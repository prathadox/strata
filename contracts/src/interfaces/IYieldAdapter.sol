// SPDX-License-Identifier: MIT
pragma solidity 0.8.24;

interface IYieldAdapter {
    function asset() external view returns (address);
    /// @dev pulls `amount` of asset from msg.sender (the Controller)
    function deposit(uint256 amount) external;
    /// @dev sends `amount` of asset to `receiver`
    function withdraw(uint256 amount, address receiver) external;
    /// @dev total asset value attributable to `holder` (principal + accrued)
    function totalAssetsFor(address holder) external view returns (uint256);
    /// @dev amount disbursable synchronously (no cooldown) for `holder`
    function instantLiquidityFor(address holder) external view returns (uint256);
}
