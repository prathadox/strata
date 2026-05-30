// SPDX-License-Identifier: MIT
pragma solidity 0.8.24;

import {BaseYieldAdapter} from "./BaseYieldAdapter.sol";
import {IInitCore, IInitLendingPool} from "../external/IInitCore.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {SafeERC20} from "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

/// @notice Supplies USDC into an INIT Capital lending pool and holds the inToken (e.g. "inUSDC", 14 dec).
///         Trustless real yield: the second clean USDC source alongside Aave, and the only Mantle market
///         where USDC counts as collateral. Position value = pool.toAmt(inToken balance), in 6-dec USDC.
///
///         INIT pool tokens mint/burn are `onlyCore`, so supply/redeem route through InitCore:
///           deposit:  USDC -> pool; core.mintTo(pool, this)
///           withdraw: inToken -> pool; core.burnTo(pool, receiver)
contract InitCapitalUsdcAdapter is BaseYieldAdapter {
    using SafeERC20 for IERC20;

    error PoolAssetMismatch();

    IInitCore public immutable core;
    IInitLendingPool public immutable pool; // the inToken receipt (also an ERC-20)

    constructor(address usdc, address owner_, address core_, address pool_) BaseYieldAdapter(usdc, owner_) {
        if (IInitLendingPool(pool_).underlyingToken() != usdc) revert PoolAssetMismatch();
        core = IInitCore(core_);
        pool = IInitLendingPool(pool_);
    }

    function deposit(uint256 amount) external override whenNotPaused {
        _checkCap(amount);
        IERC20(asset()).safeTransferFrom(msg.sender, address(this), amount);
        // INIT credits the underlying already sitting in the pool, then mints inTokens to us.
        IERC20(asset()).safeTransfer(address(pool), amount);
        core.mintTo(address(pool), address(this));
    }

    /// @dev Burns enough inToken shares to deliver `amount` USDC to `receiver`. Shares are rounded up by
    ///      one so rounding never under-delivers; any sub-unit excess stays with the receiver.
    function withdraw(uint256 amount, address receiver) external override {
        uint256 shares = pool.toShares(amount);
        if (pool.toAmt(shares) < amount) shares += 1;
        uint256 held = IERC20(address(pool)).balanceOf(address(this));
        if (shares > held) shares = held; // never burn more than we hold (full-exit path)
        IERC20(address(pool)).safeTransfer(address(pool), shares);
        core.burnTo(address(pool), receiver);
    }

    /// @dev Live position value in 6-dec USDC: underlying redeemable for our inToken balance.
    function totalAssetsFor(address) external view override returns (uint256) {
        return pool.toAmt(IERC20(address(pool)).balanceOf(address(this)));
    }

    /// @dev Synchronous USDC available is bounded by both our position and the pool's idle cash.
    function instantLiquidityFor(address) external view override returns (uint256) {
        uint256 mine = pool.toAmt(IERC20(address(pool)).balanceOf(address(this)));
        uint256 available = pool.cash();
        return mine < available ? mine : available;
    }
}
