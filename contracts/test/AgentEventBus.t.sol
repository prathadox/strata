// SPDX-License-Identifier: MIT
pragma solidity 0.8.24;

import "forge-std/Test.sol";
import {AgentEventBus} from "../src/AgentEventBus.sol";
import {IAgentEventBus} from "../src/interfaces/IAgentEventBus.sol";

contract AgentEventBusTest is Test {
    AgentEventBus bus;
    address owner = address(0xA11CE);
    address scout = address(0xBEEF);
    address architect = address(0xACED);
    address sentinel = address(0x5E47);
    address operator = address(0x09E4);

    function setUp() public {
        vm.prank(owner);
        bus = new AgentEventBus(owner);
        vm.startPrank(owner);
        bus.setRole(scout, IAgentEventBus.Role.Scout);
        bus.setRole(architect, IAgentEventBus.Role.Architect);
        bus.setRole(sentinel, IAgentEventBus.Role.Sentinel);
        bus.setRole(operator, IAgentEventBus.Role.Operator);
        vm.stopPrank();
    }

    function test_setRole_onlyOwner() public {
        vm.prank(address(0xBAD));
        vm.expectRevert(AgentEventBus.NotAuthorized.selector);
        bus.setRole(address(0xC0DE), IAgentEventBus.Role.Sentinel);
    }

    function test_publishYieldMap_onlyScout() public {
        vm.prank(scout);
        vm.expectEmit(true, false, false, true);
        emit IAgentEventBus.YieldMapPublished(scout, "QmCID", block.timestamp);
        bus.publishYieldMap("QmCID");

        vm.prank(architect);
        vm.expectRevert(AgentEventBus.NotAuthorized.selector);
        bus.publishYieldMap("QmCID");
    }

    function test_proposeAllocation_storesAndEmits() public {
        vm.prank(architect);
        vm.expectEmit(true, true, false, true);
        emit IAgentEventBus.AllocationProposed(1, architect, 4000, 4000, 2000, "QmR");
        bus.proposeAllocation(1, 4000, 4000, 2000, "QmR");

        IAgentEventBus.Proposal memory p = bus.getProposal(1);
        assertEq(p.proposer, architect);
        assertEq(p.seniorBps, 4000);
        assertEq(p.juniorBps, 2000);
    }

    function test_proposeAllocation_rejectsBpsMismatch() public {
        vm.prank(architect);
        vm.expectRevert(AgentEventBus.BpsSumInvalid.selector);
        bus.proposeAllocation(2, 4000, 4000, 1000, "QmR"); // sums to 9000
    }

    function test_proposeAllocation_rejectsDuplicate() public {
        vm.startPrank(architect);
        bus.proposeAllocation(3, 5000, 3000, 2000, "QmR");
        vm.expectRevert(AgentEventBus.ProposalExists.selector);
        bus.proposeAllocation(3, 5000, 3000, 2000, "QmR");
        vm.stopPrank();
    }

    function test_issueRiskVerdict_requiresProposal() public {
        vm.prank(sentinel);
        vm.expectRevert(AgentEventBus.ProposalMissing.selector);
        bus.issueRiskVerdict(99, true, "QmC");
    }

    function test_issueRiskVerdict_storesAndApproves() public {
        vm.prank(architect);
        bus.proposeAllocation(4, 5000, 3000, 2000, "QmR");
        vm.prank(sentinel);
        bus.issueRiskVerdict(4, true, "QmC");
        assertTrue(bus.isProposalApproved(4));
    }

    function test_issueRiskVerdict_noDoubleDecision() public {
        vm.prank(architect);
        bus.proposeAllocation(5, 5000, 3000, 2000, "QmR");
        vm.startPrank(sentinel);
        bus.issueRiskVerdict(5, true, "QmC");
        vm.expectRevert(AgentEventBus.VerdictExists.selector);
        bus.issueRiskVerdict(5, false, "QmC");
        vm.stopPrank();
    }

    function test_isProposalApproved_falseBeforeVerdict() public {
        vm.prank(architect);
        bus.proposeAllocation(6, 5000, 3000, 2000, "QmR");
        assertFalse(bus.isProposalApproved(6));
    }

    // ── hedge signal -> fill linkage (auditable Agentic-track chain) ─────────
    function test_emitHedgeSignal_returnsIncrementingIdAndEmits() public {
        vm.startPrank(sentinel);
        vm.expectEmit(true, true, true, true);
        emit IAgentEventBus.HedgeSignalEmitted(1, sentinel, address(0xABCD), -500, "QmS");
        uint256 id1 = bus.emitHedgeSignal(address(0xABCD), -500, "QmS");
        assertEq(id1, 1);
        uint256 id2 = bus.emitHedgeSignal(address(0xABCD), 250, "QmS2");
        assertEq(id2, 2);
        vm.stopPrank();
    }

    function test_logHedge_linksToSignal() public {
        vm.prank(sentinel);
        uint256 id = bus.emitHedgeSignal(address(0xABCD), -500, "QmS");
        vm.prank(operator);
        vm.expectEmit(true, true, true, true);
        emit IAgentEventBus.HedgeLogged(id, operator, address(0xABCD), -480, "QmProof");
        bus.logHedge(id, address(0xABCD), -480, "QmProof");
    }

    function test_logHedge_rejectsUnknownSignal() public {
        vm.prank(operator);
        vm.expectRevert(AgentEventBus.HedgeSignalMissing.selector);
        bus.logHedge(99, address(0xABCD), -480, "QmProof");
    }

    // ── richer risk model: green/yellow/red per asset & per tranche ──────────
    function test_setAssetRiskRating_storesAndEmits() public {
        vm.prank(architect);
        bus.proposeAllocation(7, 5000, 3000, 2000, "QmR");
        vm.prank(sentinel);
        vm.expectEmit(true, true, true, true);
        emit IAgentEventBus.AssetRiskRated(7, 2, address(0xD0E), IAgentEventBus.Rating.Red, "QmNote");
        bus.setAssetRiskRating(7, 2, address(0xD0E), IAgentEventBus.Rating.Red, "QmNote");
        assertEq(uint8(bus.assetRiskRating(7, 2, address(0xD0E))), uint8(IAgentEventBus.Rating.Red));
        // unrated (asset,tranche) pairs default to None
        assertEq(uint8(bus.assetRiskRating(7, 0, address(0xD0E))), uint8(IAgentEventBus.Rating.None));
    }

    function test_setAssetRiskRating_requiresProposal() public {
        vm.prank(sentinel);
        vm.expectRevert(AgentEventBus.ProposalMissing.selector);
        bus.setAssetRiskRating(77, 0, address(0xD0E), IAgentEventBus.Rating.Green, "QmNote");
    }

    function test_setAssetRiskRating_onlySentinel() public {
        vm.prank(architect);
        bus.proposeAllocation(8, 5000, 3000, 2000, "QmR");
        vm.prank(architect);
        vm.expectRevert(AgentEventBus.NotAuthorized.selector);
        bus.setAssetRiskRating(8, 0, address(0xD0E), IAgentEventBus.Rating.Green, "QmNote");
    }
}
