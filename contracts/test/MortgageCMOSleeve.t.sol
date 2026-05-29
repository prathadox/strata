// SPDX-License-Identifier: MIT
pragma solidity 0.8.24;

import "forge-std/Test.sol";
import {MortgageCMOSleeve} from "../src/adapters/MortgageCMOSleeve.sol";
import {BaseYieldAdapter} from "../src/adapters/BaseYieldAdapter.sol";
import {MockUSDC} from "./mocks/MockUSDC.sol";

contract MortgageCMOSleeveTest is Test {
    MockUSDC usdc;
    MortgageCMOSleeve cmo;
    address owner = address(0xA11CE);
    address controller = address(0xC0);

    function setUp() public {
        usdc = new MockUSDC();
        // WAC 6% coupon, CPR 0 by default (set per test)
        cmo = new MortgageCMOSleeve(address(usdc), owner, 600, 0);
        usdc.mint(controller, 100_000e6);
        usdc.mint(owner, 100_000e6);
        vm.prank(controller);
        usdc.approve(address(cmo), type(uint256).max);
        vm.prank(owner);
        usdc.approve(address(cmo), type(uint256).max);
    }

    function test_demoModeFlagged() public view {
        assertTrue(cmo.DEMO_MODE());
    }

    function test_depositLocksAsOutstandingPrincipal() public {
        vm.prank(controller);
        cmo.deposit(1_000e6);
        assertEq(cmo.principalOutstanding(), 1_000e6);
        assertEq(cmo.totalAssetsFor(controller), 1_000e6);
        assertEq(cmo.instantLiquidityFor(controller), 0); // nothing received yet — illiquid
    }

    function test_couponAccruesOnOutstanding() public {
        vm.prank(owner);
        cmo.seedReserve(10_000e6); // fund simulated coupon
        vm.prank(controller);
        cmo.deposit(1_000e6);
        vm.warp(block.timestamp + 365 days);
        // 6% of 1000 over a year ≈ 60 (no prepayment, cpr=0)
        assertApproxEqAbs(cmo.totalAssetsFor(controller), 1_060e6, 1e6);
    }

    function test_prepaymentConvertsPrincipalToLiquidity_noValueChange() public {
        // pure prepayment: cpr 10%, wac 0
        cmo = new MortgageCMOSleeve(address(usdc), owner, 0, 1000);
        vm.prank(controller);
        usdc.approve(address(cmo), type(uint256).max);
        vm.prank(controller);
        cmo.deposit(1_000e6);
        vm.warp(block.timestamp + 365 days);
        cmo.accrue();
        // ~10% of principal prepaid -> outstanding falls, cash rises, total value unchanged
        assertApproxEqAbs(cmo.principalOutstanding(), 900e6, 2e6);
        assertApproxEqAbs(cmo.cashReceived(), 100e6, 2e6);
        assertApproxEqAbs(cmo.totalAssetsFor(controller), 1_000e6, 1);
        assertApproxEqAbs(cmo.instantLiquidityFor(controller), 100e6, 2e6);
    }

    // accrue monthly for a year (how it runs live), so prepayment shrinks the balance
    // before each subsequent coupon tick.
    function _runOneYearMonthly(MortgageCMOSleeve pool) internal {
        // explicit accumulator: under via_ir, re-reading block.timestamp across vm.warp in a loop
        // gets cached, so warp to absolute increasing times instead.
        uint256 t = block.timestamp;
        for (uint256 i = 0; i < 12; i++) {
            t += 30 days;
            vm.warp(t);
            pool.accrue();
        }
    }

    function test_prepaymentDeceleratesYield() public {
        // no-prepay pool: full coupon on a steady balance
        vm.prank(owner); cmo.seedReserve(10_000e6);
        vm.prank(controller); cmo.deposit(1_000e6);
        _runOneYearMonthly(cmo);
        uint256 slowYield = cmo.totalAssetsFor(controller); // cpr=0

        // fast-prepay pool: same WAC, 50% CPR -> balance shrinks each month -> less total interest
        MortgageCMOSleeve fast = new MortgageCMOSleeve(address(usdc), owner, 600, 5000);
        vm.prank(owner); usdc.approve(address(fast), type(uint256).max);
        vm.prank(owner); fast.seedReserve(10_000e6);
        vm.prank(controller); usdc.approve(address(fast), type(uint256).max);
        vm.prank(controller); fast.deposit(1_000e6);
        _runOneYearMonthly(fast);
        uint256 fastYield = fast.totalAssetsFor(controller);

        assertLt(fastYield, slowYield); // heavy prepayment shrinks the interest-earning base
    }

    function test_withdraw_onlyLiquidCashflow() public {
        cmo = new MortgageCMOSleeve(address(usdc), owner, 0, 1000);
        vm.prank(controller); usdc.approve(address(cmo), type(uint256).max);
        vm.prank(controller); cmo.deposit(1_000e6);
        vm.warp(block.timestamp + 365 days);
        cmo.accrue();
        // can pull the ~100 prepaid cashflow
        vm.prank(controller);
        cmo.withdraw(100e6, controller);
        assertEq(usdc.balanceOf(controller), 99_000e6 + 100e6);
        // cannot pull beyond received cashflow (outstanding principal is locked)
        vm.prank(controller);
        vm.expectRevert(MortgageCMOSleeve.Illiquid.selector);
        cmo.withdraw(500e6, controller);
    }

    function test_applyDefault_writesDownPrincipal_juniorFirstLoss() public {
        vm.prank(controller);
        cmo.deposit(1_000e6);
        vm.prank(owner);
        cmo.applyDefault(200e6);
        assertEq(cmo.principalOutstanding(), 800e6);
        assertApproxEqAbs(cmo.totalAssetsFor(controller), 800e6, 1); // value dropped -> Junior absorbs
    }

    function test_setPrepaymentSpeed_onlyOwner() public {
        vm.prank(address(0xBAD));
        vm.expectRevert(BaseYieldAdapter.NotOwner.selector);
        cmo.setPrepaymentSpeed(2000);
        vm.prank(owner);
        cmo.setPrepaymentSpeed(2000);
        assertEq(cmo.cprBps(), 2000);
    }
}
