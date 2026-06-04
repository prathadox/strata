// SPDX-License-Identifier: MIT
pragma solidity 0.8.24;

/// @dev Ondo's on-Mantle USDY price oracle. Returns USDY price scaled to 1e18.
interface IRWADynamicOracle {
    function getPrice() external view returns (uint256);
}
