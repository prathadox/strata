// SPDX-License-Identifier: MIT
pragma solidity 0.8.24;

import "forge-std/Test.sol";
import {MockYieldAdapter} from "./mocks/MockYieldAdapter.sol";
import {MockUSDC} from "./mocks/MockUSDC.sol";

contract MockYieldAdapterTest is Test {
    MockUSDC usdc;
    MockYieldAdapter a;
    address owner = address(0xA11CE);
    address controller = address(0xC0);

    function setUp() public {
        usdc = new MockUSDC();
        a = new MockYieldAdapter(address(usdc), owner, 1000); // 10% APY
        usdc.mint(controller, 10_000e6);
        vm.prank(controller);
        usdc.approve(address(a), type(uint256).max);
    }

    function test_depositTracksPrincipal() public {
        vm.prank(controller);
        a.deposit(1_000e6);
        assertEq(a.totalAssetsFor(controller), 1_000e6);
    }

    function test_yieldAccruesOverTime() public {
        vm.prank(controller);
        a.deposit(1_000e6);
        vm.warp(block.timestamp + 365 days);
        // 10% APY on 1000 over a year ≈ 100
        assertApproxEqAbs(a.totalAssetsFor(controller), 1_100e6, 1e6);
    }

    function test_withdrawReturnsPrincipalPlusYield() public {
        vm.prank(controller);
        a.deposit(1_000e6);
        vm.warp(block.timestamp + 365 days);
        a.harvest(); // realize yield into balance
        vm.prank(controller);
        a.withdraw(1_050e6, controller);
        assertGe(usdc.balanceOf(controller), 9_000e6 + 1_050e6);
    }
}
