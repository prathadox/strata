// SPDX-License-Identifier: MIT
pragma solidity 0.8.24;

import {BaseYieldAdapter} from "./BaseYieldAdapter.sol";
import {IAgniSwapRouter} from "../external/IAgniSwapRouter.sol";
import {IAgniPositionManager, IAgniPoolMinimal} from "../external/IAgniPositionManager.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {SafeERC20} from "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

/// @notice Provides USDC into a real Agni (PancakeSwap-V3 fork) USDC/USDe concentrated-liquidity
///         position: on `deposit` it swaps half the USDC to USDe and mints/extends a full-range NFT
///         LP held by this adapter; on `withdraw` it removes liquidity, collects, and swaps the USDe
///         leg back to USDC. Trading fees are realized to USDC via `collectFees`.
///
/// @dev    **Conservative, peg-based NAV — not pool-spot mark-to-market.** Pricing the live LP via
///         `slot0`/LiquidityAmounts would be flash-manipulable and require fragile in-contract V3 math.
///         Instead NAV = USDC cost-basis of deployed liquidity (`deployedCostBasisUSDC`) + idle USDC
///         + idle USDe valued at the $1 peg. This mirrors the Ethena adapter's floored-peg philosophy:
///         deployed liquidity is held at the USDC value actually put in (so accrued LP fees only lift
///         NAV once `collectFees` realizes them to idle USDC), and the USDe leg is valued at $1.
///         **Limitations (documented):** does not mark IL or a USDe de-peg below $1 on the *deployed*
///         leg; rAGNI incentives are distributed off-chain and are excluded from NAV until realized.
///         Therefore this is an **operator-assisted** Mezz/Junior backing, not a fully trustless mark.
contract AgniLpUsdcUsdeAdapter is BaseYieldAdapter {
    using SafeERC20 for IERC20;

    error NothingDeployed();

    IAgniSwapRouter public immutable router;
    IAgniPositionManager public immutable positionManager;
    address public immutable pool;

    IERC20 public immutable usde;
    bool public immutable usdcIsToken0;
    uint24 public immutable poolFee;
    int24 public immutable tickLower;
    int24 public immutable tickUpper;

    uint256 public tokenId;                 // 0 until first mint
    uint256 public deployedCostBasisUSDC;   // 6-dec USDC cost basis of liquidity currently deployed

    uint256 public maxSlippageBps;          // applied to the half-swap on deposit/withdraw

    uint256 internal constant USDC_WAD = 1e6;
    uint256 internal constant PEG_SCALE = 1e12; // USDe(18) -> USDC(6)

    event LiquidityAdded(uint256 indexed tokenId, uint256 usdcIn, uint128 liquidity);
    event LiquidityRemoved(uint256 indexed tokenId, uint128 liquidity, uint256 usdcOut);
    event FeesCollected(uint256 amount0, uint256 amount1);
    event MaxSlippageUpdated(uint256 bps);

    constructor(address usdc, address owner_, address pool_, address positionManager_, address router_)
        BaseYieldAdapter(usdc, owner_)
    {
        pool = pool_;
        positionManager = IAgniPositionManager(positionManager_);
        router = IAgniSwapRouter(router_);

        // Read the pool's immutables on-chain so token ordering / fee / spacing are always correct.
        address t0 = IAgniPoolMinimal(pool_).token0();
        address t1 = IAgniPoolMinimal(pool_).token1();
        poolFee = IAgniPoolMinimal(pool_).fee();
        int24 spacing = IAgniPoolMinimal(pool_).tickSpacing();

        usdcIsToken0 = (t0 == usdc);
        usde = IERC20(usdcIsToken0 ? t1 : t0);

        // Full-range bounds aligned to tick spacing (V3 MIN/MAX_TICK = -/+887272).
        tickLower = (int24(-887272) / spacing) * spacing;
        tickUpper = (int24(887272) / spacing) * spacing;

        maxSlippageBps = 100; // 1%
    }

    function setMaxSlippage(uint256 bps) external onlyOwner {
        maxSlippageBps = bps;
        emit MaxSlippageUpdated(bps);
    }

    // ── IYieldAdapter ────────────────────────────────────────────────────

    function deposit(uint256 amount) external override whenNotPaused {
        _checkCap(amount);
        IERC20(asset()).safeTransferFrom(msg.sender, address(this), amount);

        // Swap half the incoming USDC to USDe so we can provide both legs ~1:1.
        uint256 half = amount / 2;
        uint256 usdeOut = _swap(asset(), address(usde), half, _minOut18(half));
        uint256 usdcForLp = amount - half;

        IERC20(asset()).forceApprove(address(positionManager), usdcForLp);
        usde.forceApprove(address(positionManager), usdeOut);

        uint256 amount0Desired = usdcIsToken0 ? usdcForLp : usdeOut;
        uint256 amount1Desired = usdcIsToken0 ? usdeOut : usdcForLp;

        uint128 liq;
        uint256 used0;
        uint256 used1;
        if (tokenId == 0) {
            (tokenId, liq, used0, used1) = positionManager.mint(
                IAgniPositionManager.MintParams({
                    token0: usdcIsToken0 ? asset() : address(usde),
                    token1: usdcIsToken0 ? address(usde) : asset(),
                    fee: poolFee,
                    tickLower: tickLower,
                    tickUpper: tickUpper,
                    amount0Desired: amount0Desired,
                    amount1Desired: amount1Desired,
                    amount0Min: 0,
                    amount1Min: 0,
                    recipient: address(this),
                    deadline: block.timestamp
                })
            );
        } else {
            (liq, used0, used1) = positionManager.increaseLiquidity(
                IAgniPositionManager.IncreaseLiquidityParams({
                    tokenId: tokenId,
                    amount0Desired: amount0Desired,
                    amount1Desired: amount1Desired,
                    amount0Min: 0,
                    amount1Min: 0,
                    deadline: block.timestamp
                })
            );
        }

        // Cost basis of what actually got deployed (leftover stays idle and is counted via balances).
        uint256 usdcUsed = usdcIsToken0 ? used0 : used1;
        uint256 usdeUsed = usdcIsToken0 ? used1 : used0;
        deployedCostBasisUSDC += usdcUsed + usdeUsed / PEG_SCALE;

        emit LiquidityAdded(tokenId, amount, liq);
    }

    function withdraw(uint256 amount, address receiver) external override {
        // Serve from idle USDC first.
        uint256 idle = IERC20(asset()).balanceOf(address(this));
        if (idle < amount) {
            _removeLiquidity(amount - idle);
            // swap any USDe we now hold back to USDC
            uint256 usdeBal = usde.balanceOf(address(this));
            if (usdeBal > 0) _swap(address(usde), asset(), usdeBal, _minOut6(usdeBal));
        }
        uint256 bal = IERC20(asset()).balanceOf(address(this));
        uint256 out = amount < bal ? amount : bal;
        IERC20(asset()).safeTransfer(receiver, out);
    }

    /// @notice Realize accrued LP trading fees to USDC (collect both legs, swap the USDe leg).
    function collectFees() external returns (uint256 usdcRealized) {
        if (tokenId == 0) return 0;
        (uint256 a0, uint256 a1) = positionManager.collect(
            IAgniPositionManager.CollectParams({
                tokenId: tokenId,
                recipient: address(this),
                amount0Max: type(uint128).max,
                amount1Max: type(uint128).max
            })
        );
        emit FeesCollected(a0, a1);
        uint256 usdeBal = usde.balanceOf(address(this));
        if (usdeBal > 0) usdcRealized = _swap(address(usde), asset(), usdeBal, _minOut6(usdeBal));
    }

    /// @dev Conservative NAV: deployed USDC cost basis + idle USDC + idle USDe at $1 peg.
    function totalAssetsFor(address) external view override returns (uint256) {
        uint256 idleUsdc = IERC20(asset()).balanceOf(address(this));
        uint256 idleUsde = usde.balanceOf(address(this));
        return deployedCostBasisUSDC + idleUsdc + idleUsde / PEG_SCALE;
    }

    /// @dev Only idle USDC is synchronously withdrawable without touching the LP position.
    function instantLiquidityFor(address) external view override returns (uint256) {
        return IERC20(asset()).balanceOf(address(this));
    }

    // ── internals ────────────────────────────────────────────────────────

    function _removeLiquidity(uint256 usdcWanted) internal {
        if (deployedCostBasisUSDC == 0) revert NothingDeployed();
        (,,,,,,, uint128 liquidity,,,,) = positionManager.positions(tokenId);
        if (liquidity == 0) revert NothingDeployed();

        // Proportional removal by cost basis; clamp to the whole position.
        uint256 frac = usdcWanted >= deployedCostBasisUSDC ? 1e18 : (usdcWanted * 1e18) / deployedCostBasisUSDC;
        uint128 liqToRemove = uint128((uint256(liquidity) * frac) / 1e18);
        if (liqToRemove == 0) liqToRemove = 1;
        if (liqToRemove > liquidity) liqToRemove = liquidity;

        positionManager.decreaseLiquidity(
            IAgniPositionManager.DecreaseLiquidityParams({
                tokenId: tokenId,
                liquidity: liqToRemove,
                amount0Min: 0,
                amount1Min: 0,
                deadline: block.timestamp
            })
        );
        positionManager.collect(
            IAgniPositionManager.CollectParams({
                tokenId: tokenId,
                recipient: address(this),
                amount0Max: type(uint128).max,
                amount1Max: type(uint128).max
            })
        );

        uint256 removedBasis = (deployedCostBasisUSDC * uint256(liqToRemove)) / uint256(liquidity);
        deployedCostBasisUSDC -= removedBasis > deployedCostBasisUSDC ? deployedCostBasisUSDC : removedBasis;
        emit LiquidityRemoved(tokenId, liqToRemove, removedBasis);
    }

    function _swap(address tokenIn, address tokenOut, uint256 amountIn, uint256 minOut)
        internal
        returns (uint256 amountOut)
    {
        if (amountIn == 0) return 0;
        IERC20(tokenIn).forceApprove(address(router), amountIn);
        amountOut = router.exactInputSingle(
            IAgniSwapRouter.ExactInputSingleParams({
                tokenIn: tokenIn,
                tokenOut: tokenOut,
                fee: poolFee,
                recipient: address(this),
                deadline: block.timestamp,
                amountIn: amountIn,
                amountOutMinimum: minOut,
                sqrtPriceLimitX96: 0
            })
        );
    }

    /// @dev min USDe (18-dec) out for `usdcIn` (6-dec) at $1 peg minus slippage.
    function _minOut18(uint256 usdcIn) internal view returns (uint256) {
        return (usdcIn * PEG_SCALE * (10_000 - maxSlippageBps)) / 10_000;
    }

    /// @dev min USDC (6-dec) out for `usdeIn` (18-dec) at $1 peg minus slippage.
    function _minOut6(uint256 usdeIn) internal view returns (uint256) {
        return (usdeIn * (10_000 - maxSlippageBps)) / (PEG_SCALE * 10_000);
    }
}
