// SPDX-License-Identifier: MIT
pragma solidity 0.8.24;

import "forge-std/Test.sol";
import {TrancheController} from "../src/TrancheController.sol";
import {AgentEventBus} from "../src/AgentEventBus.sol";
import {IAgentEventBus} from "../src/interfaces/IAgentEventBus.sol";
import {MockUSDC} from "./mocks/MockUSDC.sol";
import {MockYieldAdapter} from "./mocks/MockYieldAdapter.sol";

/// @notice Task 29 — per-tranche autonomy spectrum: Autonomous (verdict alone) vs Multisig (verdict +
///         approver confirmation for allocations that deploy more than a threshold). Senior users may want
///         a human in the loop for large rebalances; Junior users want pure autonomy.
contract TrancheControllerAutonomyTest is Test {
    TrancheController c;
    AgentEventBus bus;
    MockUSDC usdc;
    MockYieldAdapter adapter;

    address owner = address(0xA11CE);
    address architect = address(0xACED); // also the controller's executor
    address sentinel = address(0x5E47);
    address approver = address(0xAFFE);
    address seniorVault = address(0x51);
    address mezzVault = address(0x52);
    address juniorVault = address(0x53);

    uint256 constant TRANCHE_NAV = 1_000e6;

    function setUp() public {
        usdc = new MockUSDC();
        vm.prank(owner);
        bus = new AgentEventBus(owner);
        vm.startPrank(owner);
        bus.setRole(architect, IAgentEventBus.Role.Architect);
        bus.setRole(sentinel, IAgentEventBus.Role.Sentinel);
        c = new TrancheController(address(bus), address(usdc), owner, architect);
        c.setVault(TrancheController.Tranche.Senior, seniorVault);
        c.setVault(TrancheController.Tranche.Mezzanine, mezzVault);
        c.setVault(TrancheController.Tranche.Junior, juniorVault);
        adapter = new MockYieldAdapter(address(usdc), owner, 1000);
        c.addAdapter(address(adapter));
        c.setTrancheTargets(600, 1000);
        vm.stopPrank();

        // fund the controller buffer and credit each tranche's NAV
        usdc.mint(address(c), 3 * TRANCHE_NAV);
        vm.prank(seniorVault);
        c.notifyDeposit(TrancheController.Tranche.Senior, TRANCHE_NAV);
        vm.prank(mezzVault);
        c.notifyDeposit(TrancheController.Tranche.Mezzanine, TRANCHE_NAV);
        vm.prank(juniorVault);
        c.notifyDeposit(TrancheController.Tranche.Junior, TRANCHE_NAV);
    }

    // ---- helpers ----
    function _approvedProposal(uint256 id) internal {
        vm.prank(architect);
        bus.proposeAllocation(id, 4000, 4000, 2000, "cid");
        vm.prank(sentinel);
        bus.issueRiskVerdict(id, true, "cid");
    }

    /// each tranche deploys 100% of its NAV into the single mock adapter
    function _fullTargets() internal view returns (TrancheController.AdapterTarget[] memory t) {
        t = new TrancheController.AdapterTarget[](1);
        t[0] = TrancheController.AdapterTarget({adapter: address(adapter), bps: 10_000});
    }

    function _execute(uint256 id) internal {
        vm.prank(architect);
        c.executeAllocation(id, _fullTargets(), _fullTargets(), _fullTargets());
    }

    // ---- config ----
    function test_setTrancheAutonomy_onlyOwner() public {
        vm.prank(address(0xBAD));
        vm.expectRevert(TrancheController.NotOwner.selector);
        c.setTrancheAutonomy(TrancheController.Tranche.Senior, TrancheController.AutonomyMode.Multisig, approver, 500e6);
    }

    function test_defaultModeIsAutonomous() public view {
        (TrancheController.AutonomyMode mode,,) = c.autonomyOf(TrancheController.Tranche.Junior);
        assertEq(uint8(mode), uint8(TrancheController.AutonomyMode.Autonomous));
    }

    // ---- Autonomous: executes on verdict alone ----
    function test_autonomousExecutesOnVerdictAlone() public {
        _approvedProposal(1);
        _execute(1);
        // all three tranches (3 x 1000) deployed into the adapter
        assertEq(adapter.totalAssetsFor(address(c)), 3 * TRANCHE_NAV);
    }

    // ---- Multisig: large move blocked without approver confirmation ----
    function test_multisigLargeMoveRevertsWithoutConfirm() public {
        vm.prank(owner);
        c.setTrancheAutonomy(TrancheController.Tranche.Senior, TrancheController.AutonomyMode.Multisig, approver, 500e6);
        _approvedProposal(2);
        vm.prank(architect);
        vm.expectRevert(TrancheController.MultisigApprovalRequired.selector);
        c.executeAllocation(2, _fullTargets(), _fullTargets(), _fullTargets()); // Senior deploys 1000 > 500
    }

    // ---- Multisig: large move succeeds after approver confirms ----
    function test_multisigLargeMoveSucceedsAfterConfirm() public {
        vm.prank(owner);
        c.setTrancheAutonomy(TrancheController.Tranche.Senior, TrancheController.AutonomyMode.Multisig, approver, 500e6);
        _approvedProposal(3);

        // wrong confirmer rejected
        vm.prank(address(0xBAD));
        vm.expectRevert(TrancheController.NotApprover.selector);
        c.confirmAllocation(3, TrancheController.Tranche.Senior);

        // approver confirms, then executor executes
        vm.prank(approver);
        c.confirmAllocation(3, TrancheController.Tranche.Senior);
        _execute(3);
        assertEq(adapter.totalAssetsFor(address(c)), 3 * TRANCHE_NAV);
        // confirmation consumed
        assertFalse(c.multisigConfirmed(TrancheController.Tranche.Senior, 3));
    }

    // ---- Multisig: move at/under threshold skips the multisig ----
    function test_multisigSmallMoveSkipsApproval() public {
        vm.prank(owner);
        c.setTrancheAutonomy(TrancheController.Tranche.Senior, TrancheController.AutonomyMode.Multisig, approver, 2_000e6);
        _approvedProposal(4);
        _execute(4); // Senior deploys 1000 <= 2000 threshold -> no confirmation needed
        assertEq(adapter.totalAssetsFor(address(c)), 3 * TRANCHE_NAV);
    }

    // ---- confirmation is scoped to (proposalId, tranche) and does not leak ----
    function test_confirmationDoesNotLeakToOtherProposal() public {
        vm.prank(owner);
        c.setTrancheAutonomy(TrancheController.Tranche.Senior, TrancheController.AutonomyMode.Multisig, approver, 500e6);
        _approvedProposal(5);
        _approvedProposal(6);
        vm.prank(approver);
        c.confirmAllocation(5, TrancheController.Tranche.Senior);
        // proposal 6 was never confirmed -> still blocked
        vm.prank(architect);
        vm.expectRevert(TrancheController.MultisigApprovalRequired.selector);
        c.executeAllocation(6, _fullTargets(), _fullTargets(), _fullTargets());
    }
}
