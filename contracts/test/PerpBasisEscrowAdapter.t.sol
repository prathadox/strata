// SPDX-License-Identifier: MIT
pragma solidity 0.8.24;

import "forge-std/Test.sol";
import {PerpBasisEscrowAdapter} from "../src/adapters/PerpBasisEscrowAdapter.sol";
import {BaseYieldAdapter} from "../src/adapters/BaseYieldAdapter.sol";
import {MockUSDC} from "./mocks/MockUSDC.sol";

/// @notice Unit tests for the operator-driven perp-basis escrow adapter (no fork).
///         The off-chain Byreal/Hyperliquid perp leg is valued via an operator-reported
///         mark+funding figure; the on-chain USDC is the escrowed spot leg.
contract PerpBasisEscrowAdapterTest is Test {
    PerpBasisEscrowAdapter adapter;
    MockUSDC usdc;

    address owner = address(0xA11CE);
    address operator = address(0x09E7);
    address controller = address(0xC0);
    address receiver = address(0xCAFE);

    function setUp() public {
        usdc = new MockUSDC();
        adapter = new PerpBasisEscrowAdapter(address(usdc), owner, operator);
        usdc.mint(controller, 10_000e6);
        vm.prank(controller);
        usdc.approve(address(adapter), type(uint256).max);
    }

    function _deposit(uint256 amount) internal {
        vm.prank(controller);
        adapter.deposit(amount);
    }

    function test_deposit_escrowsUsdc_andCountsAsNav() public {
        _deposit(1_000e6);
        assertEq(usdc.balanceOf(address(adapter)), 1_000e6);
        assertEq(adapter.totalAssetsFor(controller), 1_000e6); // reportedHedgeValue == 0
    }

    function test_reportHedgeValue_positive_addsToNav() public {
        _deposit(1_000e6);
        vm.prank(operator);
        adapter.reportHedgeValue(50e6, 1); // +$50 perp mark+funding gain, linked to signalId 1
        assertEq(adapter.totalAssetsFor(controller), 1_050e6);
    }

    function test_reportHedgeValue_negative_reducesNav() public {
        _deposit(1_000e6);
        vm.prank(operator);
        adapter.reportHedgeValue(-200e6, 2);
        assertEq(adapter.totalAssetsFor(controller), 800e6);
    }

    function test_reportHedgeValue_lossExceedingEscrow_floorsAtZero() public {
        _deposit(1_000e6);
        vm.prank(owner);
        adapter.reportHedgeValue(-2_000e6, 3);
        assertEq(adapter.totalAssetsFor(controller), 0);
    }

    function test_reportHedgeValue_onlyOwnerOrOperator() public {
        _deposit(1_000e6);
        vm.prank(address(0xBAD));
        vm.expectRevert(PerpBasisEscrowAdapter.NotOwnerOrOperator.selector);
        adapter.reportHedgeValue(10e6, 4);
        // owner and operator both succeed
        vm.prank(owner);
        adapter.reportHedgeValue(10e6, 4);
        vm.prank(operator);
        adapter.reportHedgeValue(20e6, 5);
        assertEq(adapter.reportedHedgeValue(), 20e6);
    }

    function test_setOperator_onlyOwner() public {
        vm.prank(address(0xBAD));
        vm.expectRevert(BaseYieldAdapter.NotOwner.selector);
        adapter.setOperator(address(0x1234));
        vm.prank(owner);
        adapter.setOperator(address(0x1234));
        assertEq(adapter.operator(), address(0x1234));
    }

    function test_isNotTrustless() public view {
        assertFalse(adapter.TRUSTLESS());
    }

    function test_withdraw_returnsEscrowedUsdc() public {
        _deposit(1_000e6);
        vm.prank(controller);
        adapter.withdraw(400e6, receiver);
        assertEq(usdc.balanceOf(receiver), 400e6);
        assertEq(usdc.balanceOf(address(adapter)), 600e6);
    }

    function test_instantLiquidity_isOnChainEscrowOnly() public {
        _deposit(1_000e6);
        vm.prank(operator);
        adapter.reportHedgeValue(500e6, 6); // off-chain gain is NOT synchronously withdrawable
        assertEq(adapter.instantLiquidityFor(controller), 1_000e6);
    }

    function test_reportHedgeValue_emitsLinkedEvent() public {
        _deposit(1_000e6);
        vm.expectEmit(true, true, false, true);
        emit PerpBasisEscrowAdapter.HedgeValueReported(operator, 7, 123e6, block.timestamp);
        vm.prank(operator);
        adapter.reportHedgeValue(123e6, 7);
    }
}
