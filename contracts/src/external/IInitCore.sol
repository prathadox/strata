// SPDX-License-Identifier: MIT
pragma solidity 0.8.24;

/// @dev Minimal INIT Capital surface used by the USDC supply adapter (verified on Mantle, 2026-05-30).
///      Supply flow:  USDC.transfer(pool, amt)  -> core.mintTo(pool, to)  returns inToken shares.
///      Redeem flow:  inToken.transfer(pool, shares) -> core.burnTo(pool, to) returns USDC amt.
interface IInitCore {
    /// @notice mints inTokens for `_pool` to `_to`, crediting the underlying already sent to the pool.
    function mintTo(address _pool, address _to) external returns (uint256 shares);

    /// @notice burns the inTokens already sent to `_pool` and sends the underlying to `_to`.
    function burnTo(address _pool, address _to) external returns (uint256 amt);
}

/// @dev INIT lending pool (the "inUSDC" receipt token). It is itself an ERC-20 (14 dec here);
///      conversions are share<->underlying via toAmt / toShares. View variants use the last-accrued
///      index (good enough for NAV); the *Current variants accrue first (non-view).
interface IInitLendingPool {
    function underlyingToken() external view returns (address);
    function totalAssets() external view returns (uint256);
    function cash() external view returns (uint256);

    /// @notice underlying amount for a given share count (last-accrued index; view).
    function toAmt(uint256 shares) external view returns (uint256);
    /// @notice share count for a given underlying amount (last-accrued index; view).
    function toShares(uint256 amt) external view returns (uint256);
}
