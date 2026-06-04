// SPDX-License-Identifier: MIT
pragma solidity 0.8.24;

import "forge-std/Test.sol";
import {MockUSDC} from "./mocks/MockUSDC.sol";

contract MockUSDCTest is Test {
    MockUSDC usdc;

    function setUp() public {
        usdc = new MockUSDC();
    }

    function test_decimalsIsSix() public view {
        assertEq(usdc.decimals(), 6);
    }

    function test_mintCreditsBalance() public {
        usdc.mint(address(0xBEEF), 1_000e6);
        assertEq(usdc.balanceOf(address(0xBEEF)), 1_000e6);
    }
}
