// SPDX-License-Identifier: MIT
pragma solidity 0.8.24;

import {BaseYieldAdapter} from "./BaseYieldAdapter.sol";
import {IRWADynamicOracle} from "../external/IRWADynamicOracle.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {SafeERC20} from "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

/// @notice Holds bridged Ondo USDY (real RWA T-bills, 18 dec, accruing) and reports its USD value
///         in USDC terms (6 dec) via Ondo's price oracle. USDC<->USDY conversion is NOT possible
///         on-chain on Mantle (mint/redeem is Ethereum-only), so USDC deposit reverts; the operator
///         funds/defunds USDY out-of-band via owner-only depositUsdy/withdrawUsdy.
contract OndoUsdyAdapter is BaseYieldAdapter {
    using SafeERC20 for IERC20;

    error ConversionUnavailable();

    IERC20 public immutable usdy;
    IRWADynamicOracle public oracle;

    uint256 internal constant USDY_DECIMALS = 1e18;
    uint256 internal constant ORACLE_SCALE = 1e18;
    uint256 internal constant USDC_DECIMALS = 1e6;

    event UsdyDeposited(uint256 amount);
    event UsdyWithdrawn(uint256 amount, address indexed to);

    constructor(address usdc, address owner_, address usdy_, address oracle_) BaseYieldAdapter(usdc, owner_) {
        usdy = IERC20(usdy_);
        oracle = IRWADynamicOracle(oracle_);
    }

    function setOracle(address oracle_) external onlyOwner {
        oracle = IRWADynamicOracle(oracle_);
    }

    /// @dev USDC cannot be converted to USDY on-chain on Mantle.
    function deposit(uint256) external pure override {
        revert ConversionUnavailable();
    }

    function withdraw(uint256, address) external pure override {
        revert ConversionUnavailable();
    }

    /// @notice operator funds the adapter with real USDY (bridged from Ethereum off-chain).
    function depositUsdy(uint256 amount) external onlyOwner {
        usdy.safeTransferFrom(msg.sender, address(this), amount);
        emit UsdyDeposited(amount);
    }

    function withdrawUsdy(uint256 amount, address to) external onlyOwner {
        usdy.safeTransfer(to, amount);
        emit UsdyWithdrawn(amount, to);
    }

    /// @dev USD value of held USDY, expressed in 6-decimal USDC terms.
    function totalAssetsFor(address) external view override returns (uint256) {
        uint256 bal = usdy.balanceOf(address(this));
        uint256 usdValue18 = (bal * oracle.getPrice()) / ORACLE_SCALE; // 18-dec USD
        return (usdValue18 * USDC_DECIMALS) / USDY_DECIMALS;            // -> 6-dec
    }

    /// @dev no synchronous USDC liquidity; Controller must never route user withdrawals here.
    function instantLiquidityFor(address) external pure override returns (uint256) {
        return 0;
    }
}
