// SPDX-License-Identifier: MIT
pragma solidity 0.8.24;

import {IYieldAdapter} from "../interfaces/IYieldAdapter.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {SafeERC20} from "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

abstract contract BaseYieldAdapter is IYieldAdapter {
    using SafeERC20 for IERC20;

    error NotOwner();
    error CapExceeded();
    error Paused();

    event CapUpdated(uint256 newCap);
    event PausedUpdated(bool paused);
    event EmergencyWithdrawal(address indexed to, uint256 amount);

    address public owner;
    address internal immutable _asset;
    bool public paused;
    uint256 public depositCap; // 0 = no cap

    constructor(address asset_, address owner_) {
        _asset = asset_;
        owner = owner_;
    }

    modifier onlyOwner() {
        if (msg.sender != owner) revert NotOwner();
        _;
    }

    modifier whenNotPaused() {
        if (paused) revert Paused();
        _;
    }

    function asset() public view returns (address) {
        return _asset;
    }

    function setCap(uint256 newCap) external onlyOwner {
        depositCap = newCap;
        emit CapUpdated(newCap);
    }

    function setPaused(bool p) external onlyOwner {
        paused = p;
        emit PausedUpdated(p);
    }

    function emergencyWithdraw(address to) external onlyOwner {
        uint256 bal = IERC20(_asset).balanceOf(address(this));
        IERC20(_asset).safeTransfer(to, bal);
        emit EmergencyWithdrawal(to, bal);
    }

    /// @dev reverts if depositing `incoming` would push this adapter's holdings past the cap
    function _checkCap(uint256 incoming) internal view {
        if (depositCap == 0) return;
        if (IERC20(_asset).balanceOf(address(this)) + incoming > depositCap) revert CapExceeded();
    }

    // each concrete adapter implements these
    function deposit(uint256 amount) external virtual;
    function withdraw(uint256 amount, address receiver) external virtual;
    function totalAssetsFor(address holder) external view virtual returns (uint256);
    function instantLiquidityFor(address holder) external view virtual returns (uint256);
}
