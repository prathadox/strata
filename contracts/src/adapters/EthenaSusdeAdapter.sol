// SPDX-License-Identifier: MIT
pragma solidity 0.8.24;

import {BaseYieldAdapter} from "./BaseYieldAdapter.sol";
import {IAgniSwapRouter} from "../external/IAgniSwapRouter.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {SafeERC20} from "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

/// @notice Holds Ethena sUSDe acquired by swapping through Agni (USDC -> USDe -> sUSDe). Ethena has no
///         native stake on Mantle (sUSDe/USDe are bridged OFTs; ERC-4626 calls revert), so entry/exit
///         are DEX swaps against the ~$1.7M USDC/USDe pool — hence this is a **capped** position.
///
/// @dev    **Valuation is deliberately NOT a pool price.** The Agni sUSDe/USDe pool has no TWAP history
///         (observationCardinality=1), and spot `slot0` is flash-manipulable, so neither is safe for NAV.
///         Instead we value held sUSDe with a conservative, owner-maintained `susdeUsdeRate` (sUSDe->USDe,
///         1e18-scaled) and treat USDe as the $1 peg:
///             value6 = sUSDeBal(18) * susdeUsdeRate(1e18) / 1e30.
///         The rate is floored at 1e18 (sUSDe never redeems below 1 USDe) and ceilinged for fat-finger
///         safety; the operator nudges it as Ethena's index accrues. This keeps NAV manipulation-resistant
///         at the cost of requiring honest, slow rate maintenance (documented operator dependency).
contract EthenaSusdeAdapter is BaseYieldAdapter {
    using SafeERC20 for IERC20;

    error RateOutOfBounds();
    error SlippageExceeded();

    IERC20 public immutable usde;   // 18 dec
    IERC20 public immutable susde;  // 18 dec
    IAgniSwapRouter public immutable router;
    uint24 public immutable feeUsdcUsde;  // USDC<->USDe pool fee
    uint24 public immutable feeUsdeSusde; // USDe<->sUSDe pool fee

    /// @notice conservative sUSDe->USDe conversion rate, 1e18-scaled (>= 1e18). Operator-maintained.
    uint256 public susdeUsdeRate;
    /// @notice max acceptable round-trip slippage for swaps, in bps (applied to the conservative mark).
    uint16 public maxSlippageBps = 100; // 1%

    uint256 internal constant RATE_FLOOR = 1e18; // sUSDe never worth < 1 USDe
    uint256 internal constant RATE_CEIL = 2e18;  // fat-finger guard
    uint256 internal constant USDC_DECIMALS = 1e6;
    uint256 internal constant WAD = 1e18;

    event RateUpdated(uint256 susdeUsdeRate);
    event MaxSlippageUpdated(uint16 bps);
    event Deposited(uint256 usdcIn, uint256 susdeOut);
    event Withdrawn(uint256 susdeIn, uint256 usdcOut, address indexed receiver);

    constructor(
        address usdc,
        address owner_,
        address usde_,
        address susde_,
        address router_,
        uint24 feeUsdcUsde_,
        uint24 feeUsdeSusde_,
        uint256 initialRate
    ) BaseYieldAdapter(usdc, owner_) {
        if (initialRate < RATE_FLOOR || initialRate > RATE_CEIL) revert RateOutOfBounds();
        usde = IERC20(usde_);
        susde = IERC20(susde_);
        router = IAgniSwapRouter(router_);
        feeUsdcUsde = feeUsdcUsde_;
        feeUsdeSusde = feeUsdeSusde_;
        susdeUsdeRate = initialRate;
    }

    function setSusdeUsdeRate(uint256 newRate) external onlyOwner {
        if (newRate < RATE_FLOOR || newRate > RATE_CEIL) revert RateOutOfBounds();
        susdeUsdeRate = newRate;
        emit RateUpdated(newRate);
    }

    function setMaxSlippageBps(uint16 bps) external onlyOwner {
        maxSlippageBps = bps;
        emit MaxSlippageUpdated(bps);
    }

    /// @dev USDC (6 dec) -> USDe -> sUSDe (both 18 dec) via Agni, then hold sUSDe. Cap is checked against
    ///      the resulting position value so the *valued* exposure stays within the configured limit.
    function deposit(uint256 amount) external override whenNotPaused {
        IERC20(asset()).safeTransferFrom(msg.sender, address(this), amount);

        // leg 1: USDC -> USDe (expect ~1:1, USDe 18-dec; floor by slippage on the $1 peg)
        uint256 minUsde = _scaleUp6To18(amount) * (10_000 - maxSlippageBps) / 10_000;
        uint256 usdeOut = _swap(asset(), address(usde), feeUsdcUsde, amount, minUsde);

        // leg 2: USDe -> sUSDe (expect usde/rate sUSDe out; floor by slippage on the conservative rate)
        uint256 minSusde = (usdeOut * WAD / susdeUsdeRate) * (10_000 - maxSlippageBps) / 10_000;
        uint256 susdeOut = _swap(address(usde), address(susde), feeUsdeSusde, usdeOut, minSusde);

        // enforce the deposit cap against the post-swap *valued* position
        _checkCap(_valueSusde(susdeOut));
        emit Deposited(amount, susdeOut);
    }

    /// @dev Delivers ~`amount` USDC to `receiver` by selling sUSDe -> USDe -> USDC. Sells the sUSDe needed
    ///      for `amount` at the conservative mark (capped at the full balance), so requesting >= position
    ///      value performs a full exit. amountOutMinimum guards each leg.
    function withdraw(uint256 amount, address receiver) external override {
        uint256 held = susde.balanceOf(address(this));
        // sUSDe needed to cover `amount` USDC at the conservative mark: amount(6)->18 then / rate
        uint256 needed = (_scaleUp6To18(amount) * WAD) / susdeUsdeRate;
        uint256 sellSusde = needed > held ? held : needed;

        uint256 minUsde = (sellSusde * susdeUsdeRate / WAD) * (10_000 - maxSlippageBps) / 10_000;
        uint256 usdeOut = _swap(address(susde), address(usde), feeUsdeSusde, sellSusde, minUsde);

        uint256 minUsdc = _scaleDown18To6(usdeOut) * (10_000 - maxSlippageBps) / 10_000;
        uint256 usdcOut = _swap(address(usde), asset(), feeUsdcUsde, usdeOut, minUsdc);

        IERC20(asset()).safeTransfer(receiver, usdcOut);
        emit Withdrawn(sellSusde, usdcOut, receiver);
    }

    /// @dev 6-dec USDC value of held sUSDe at the conservative rate (USDe pegged to $1).
    function totalAssetsFor(address) external view override returns (uint256) {
        return _valueSusde(susde.balanceOf(address(this)));
    }

    /// @dev Position is exitable via DEX, but slippage/depth make it non-instant for sizing; report 0 so
    ///      the Controller never routes synchronous user withdrawals here (mirrors the other swap/hold adapters).
    function instantLiquidityFor(address) external pure override returns (uint256) {
        return 0;
    }

    // ── internals ──────────────────────────────────────────────────────────
    function _valueSusde(uint256 susdeAmt18) internal view returns (uint256) {
        return (susdeAmt18 * susdeUsdeRate) / (WAD * WAD / USDC_DECIMALS);
    }

    function _swap(address tokenIn, address tokenOut, uint24 fee, uint256 amountIn, uint256 minOut)
        internal
        returns (uint256 amountOut)
    {
        IERC20(tokenIn).forceApprove(address(router), amountIn);
        amountOut = router.exactInputSingle(
            IAgniSwapRouter.ExactInputSingleParams({
                tokenIn: tokenIn,
                tokenOut: tokenOut,
                fee: fee,
                recipient: address(this),
                deadline: block.timestamp,
                amountIn: amountIn,
                amountOutMinimum: minOut,
                sqrtPriceLimitX96: 0
            })
        );
        if (amountOut < minOut) revert SlippageExceeded();
    }

    function _scaleUp6To18(uint256 a) internal pure returns (uint256) {
        return a * 1e12;
    }

    function _scaleDown18To6(uint256 a) internal pure returns (uint256) {
        return a / 1e12;
    }
}
