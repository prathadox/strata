// SPDX-License-Identifier: MIT
pragma solidity 0.8.24;

import "forge-std/Test.sol";
import {BaseYieldAdapter} from "../src/adapters/BaseYieldAdapter.sol";
import {MockUSDC} from "./mocks/MockUSDC.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";

// Minimal concrete subclass exposing the protected helpers for testing.
contract HarnessAdapter is BaseYieldAdapter {
    constructor(address usdc, address owner_) BaseYieldAdapter(usdc, owner_) {}
    function deposit(uint256 amount) external override whenNotPaused {
        _checkCap(amount);
        IERC20(asset()).transferFrom(msg.sender, address(this), amount);
    }
    function withdraw(uint256 amount, address receiver) external override {
        IERC20(asset()).transfer(receiver, amount);
    }
    function totalAssetsFor(address) external view override returns (uint256) {
        return IERC20(asset()).balanceOf(address(this));
    }
    function instantLiquidityFor(address holder) external view override returns (uint256) {
        return this.totalAssetsFor(holder);
    }
}

contract BaseYieldAdapterTest is Test {
    MockUSDC usdc;
    HarnessAdapter a;
    address owner = address(0xA11CE);
    address controller = address(0xC0);

    function setUp() public {
        usdc = new MockUSDC();
        a = new HarnessAdapter(address(usdc), owner);
        usdc.mint(controller, 10_000e6);
        vm.prank(controller);
        usdc.approve(address(a), type(uint256).max);
    }

    function test_setCap_onlyOwner() public {
        vm.prank(address(0xBAD));
        vm.expectRevert(BaseYieldAdapter.NotOwner.selector);
        a.setCap(1_000e6);
    }

    function test_capExceeded_reverts() public {
        vm.prank(owner);
        a.setCap(500e6);
        vm.prank(controller);
        vm.expectRevert(BaseYieldAdapter.CapExceeded.selector);
        a.deposit(600e6);
    }

    function test_pausedBlocksDeposit() public {
        vm.prank(owner);
        a.setPaused(true);
        vm.prank(controller);
        vm.expectRevert(BaseYieldAdapter.Paused.selector);
        a.deposit(100e6);
    }

    function test_emergencyWithdraw_pullsAll() public {
        vm.prank(controller);
        a.deposit(1_000e6);
        vm.prank(owner);
        a.emergencyWithdraw(owner);
        assertEq(usdc.balanceOf(owner), 1_000e6);
    }
}
