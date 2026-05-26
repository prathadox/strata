// SPDX-License-Identifier: MIT
pragma solidity 0.8.24;

import {BaseYieldAdapter} from "../../src/adapters/BaseYieldAdapter.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {SafeERC20} from "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import {MockUSDC} from "./MockUSDC.sol";

/// @dev Test/Sepolia only. Simulates a fixed-APY yield source by minting MockUSDC on accrual.
contract MockYieldAdapter is BaseYieldAdapter {
    using SafeERC20 for IERC20;

    uint16 internal constant BPS = 10_000;
    uint256 internal constant YEAR = 365 days;

    uint16 public apyBps;
    uint256 public principal;     // realized principal held
    uint64 public lastAccrual;

    constructor(address usdc, address owner_, uint16 apyBps_) BaseYieldAdapter(usdc, owner_) {
        apyBps = apyBps_;
        lastAccrual = uint64(block.timestamp);
    }

    function _pendingYield() internal view returns (uint256) {
        uint256 elapsed = block.timestamp - lastAccrual;
        return (principal * apyBps * elapsed) / (BPS * YEAR);
    }

    function _accrue() internal {
        uint256 y = _pendingYield();
        if (y > 0) {
            MockUSDC(asset()).mint(address(this), y);
            principal += y;
        }
        lastAccrual = uint64(block.timestamp);
    }

    function harvest() external {
        _accrue();
    }

    function deposit(uint256 amount) external override whenNotPaused {
        _checkCap(amount);
        _accrue();
        IERC20(asset()).safeTransferFrom(msg.sender, address(this), amount);
        principal += amount;
    }

    function withdraw(uint256 amount, address receiver) external override {
        _accrue();
        principal -= amount;
        IERC20(asset()).safeTransfer(receiver, amount);
    }

    function totalAssetsFor(address) external view override returns (uint256) {
        return principal + _pendingYield();
    }

    function instantLiquidityFor(address) external view override returns (uint256) {
        return IERC20(asset()).balanceOf(address(this));
    }
}
