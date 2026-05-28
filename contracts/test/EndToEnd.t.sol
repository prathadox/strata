// SPDX-License-Identifier: MIT
pragma solidity 0.8.24;

import {Fixtures} from "./helpers/Fixtures.sol";
import {TrancheController} from "../src/TrancheController.sol";

contract EndToEndTest is Fixtures {
    address alice = address(0xA11);

    function setUp() public {
        deployStack();
        usdc.mint(alice, 1_000e6);
        vm.prank(alice);
        usdc.approve(address(senior), type(uint256).max);
    }

    function test_fullLifecycle_depositProposeVerdictExecuteHarvestWithdraw() public {
        // 1. Alice deposits into Senior
        vm.prank(alice);
        senior.deposit(1_000e6, alice);
        assertEq(controller.trancheNAVView(TrancheController.Tranche.Senior), 1_000e6);

        // 2. Architect proposes, 3. Sentinel approves
        vm.prank(architect);
        bus.proposeAllocation(1, 10000, 0, 0, "QmReason");
        vm.prank(sentinel);
        bus.issueRiskVerdict(1, true, "QmCond");

        // 4. Architect executes: 100% of senior into the adapter
        TrancheController.AdapterTarget[] memory all = new TrancheController.AdapterTarget[](1);
        all[0] = TrancheController.AdapterTarget(address(adapter), 10000);
        vm.prank(architect);
        controller.executeAllocation(1, all, all, all);
        assertEq(adapter.totalAssetsFor(address(controller)), 1_000e6);

        // 5. one year passes, adapter accrues 10%
        vm.warp(block.timestamp + 365 days);
        adapter.harvest();

        // 6. harvest applies the waterfall (senior capped at 6%)
        controller.harvest();
        uint256 seniorNav = controller.trancheNAVView(TrancheController.Tranche.Senior);
        assertApproxEqAbs(seniorNav, 1_060e6, 5e6);

        // 7. Alice redeems her full position; receives senior NAV share (≈1060)
        uint256 shares = senior.balanceOf(alice);
        vm.prank(alice);
        senior.redeem(shares, alice, alice);
        assertGt(usdc.balanceOf(alice), 1_000e6); // gained yield
        assertApproxEqAbs(usdc.balanceOf(alice), 1_060e6, 5e6);
    }
}
