// SPDX-License-Identifier: MIT
pragma solidity 0.8.24;

import "forge-std/Test.sol";
import {TrancheController} from "../src/TrancheController.sol";
import {AgentEventBus} from "../src/AgentEventBus.sol";
import {IAgentEventBus} from "../src/interfaces/IAgentEventBus.sol";
import {MockUSDC} from "./mocks/MockUSDC.sol";
import {MockYieldAdapter} from "./mocks/MockYieldAdapter.sol";

contract TrancheControllerTest is Test {
    TrancheController c;
    AgentEventBus bus;
    MockUSDC usdc;
    MockYieldAdapter adapter;

    address owner = address(0xA11CE);
    address architect = address(0xACED);
    address sentinel = address(0x5E47);
    address seniorVault = address(0x51);
    address mezzVault = address(0x52);
    address juniorVault = address(0x53);

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
    }

    function test_setVault_onlyOwner() public {
        vm.prank(address(0xBAD));
        vm.expectRevert(TrancheController.NotOwner.selector);
        c.setVault(TrancheController.Tranche.Senior, address(0x99));
    }

    function test_notifyDeposit_onlyVault() public {
        vm.prank(address(0xBAD));
        vm.expectRevert(TrancheController.NotVault.selector);
        c.notifyDeposit(TrancheController.Tranche.Senior, 100e6);
    }

    function test_notifyDeposit_creditsNAV() public {
        usdc.mint(seniorVault, 1_000e6);
        vm.prank(seniorVault);
        usdc.transfer(address(c), 1_000e6); // vault forwards USDC, then notifies
        vm.prank(seniorVault);
        c.notifyDeposit(TrancheController.Tranche.Senior, 1_000e6);
        assertEq(c.trancheNAVView(TrancheController.Tranche.Senior), 1_000e6);
    }

    function test_notifyWithdraw_fromBuffer() public {
        // seed senior NAV + idle USDC buffer in controller
        usdc.mint(address(c), 1_000e6);
        vm.prank(seniorVault);
        c.notifyDeposit(TrancheController.Tranche.Senior, 1_000e6);
        // withdraw 400 to a receiver, served from idle buffer
        vm.prank(seniorVault);
        c.notifyWithdraw(TrancheController.Tranche.Senior, 400e6, address(0xCAFE));
        assertEq(usdc.balanceOf(address(0xCAFE)), 400e6);
        assertEq(c.trancheNAVView(TrancheController.Tranche.Senior), 600e6);
    }

    function test_addAdapter_onlyOwner_andRegistered() public {
        assertTrue(c.isAdapter(address(adapter)));
        vm.prank(address(0xBAD));
        vm.expectRevert(TrancheController.NotOwner.selector);
        c.addAdapter(address(0x1234));
    }

    function _approvedProposal(uint256 id) internal {
        vm.prank(architect);
        bus.proposeAllocation(id, 5000, 3000, 2000, "QmR");
        vm.prank(sentinel);
        bus.issueRiskVerdict(id, true, "QmC");
    }

    function _fundSenior(uint256 amt) internal {
        usdc.mint(address(c), amt);
        vm.prank(seniorVault);
        c.notifyDeposit(TrancheController.Tranche.Senior, amt);
    }

    function test_executeAllocation_onlyExecutor() public {
        _approvedProposal(10);
        TrancheController.AdapterTarget[] memory one = new TrancheController.AdapterTarget[](1);
        one[0] = TrancheController.AdapterTarget(address(adapter), 10000);
        vm.prank(address(0xBAD));
        vm.expectRevert(TrancheController.NotExecutor.selector);
        c.executeAllocation(10, one, one, one);
    }

    function test_executeAllocation_revertsIfNotApproved() public {
        vm.prank(architect);
        bus.proposeAllocation(11, 5000, 3000, 2000, "QmR"); // no verdict
        TrancheController.AdapterTarget[] memory one = new TrancheController.AdapterTarget[](1);
        one[0] = TrancheController.AdapterTarget(address(adapter), 10000);
        vm.prank(architect);
        vm.expectRevert(TrancheController.ProposalNotApproved.selector);
        c.executeAllocation(11, one, one, one);
    }

    function test_executeAllocation_revertsIfStale() public {
        _approvedProposal(12);
        vm.warp(block.timestamp + 25 hours);
        TrancheController.AdapterTarget[] memory one = new TrancheController.AdapterTarget[](1);
        one[0] = TrancheController.AdapterTarget(address(adapter), 10000);
        vm.prank(architect);
        vm.expectRevert(TrancheController.ProposalStale.selector);
        c.executeAllocation(12, one, one, one);
    }

    function test_executeAllocation_revertsIfBpsSumWrong() public {
        _approvedProposal(13);
        TrancheController.AdapterTarget[] memory bad = new TrancheController.AdapterTarget[](1);
        bad[0] = TrancheController.AdapterTarget(address(adapter), 9000); // != 10000
        vm.prank(architect);
        vm.expectRevert(TrancheController.AllocationBpsInvalid.selector);
        c.executeAllocation(13, bad, bad, bad);
    }

    function test_executeAllocation_routesFundsToAdapter() public {
        _fundSenior(1_000e6);
        _approvedProposal(14);
        TrancheController.AdapterTarget[] memory one = new TrancheController.AdapterTarget[](1);
        one[0] = TrancheController.AdapterTarget(address(adapter), 10000);
        TrancheController.AdapterTarget[] memory none = new TrancheController.AdapterTarget[](1);
        none[0] = TrancheController.AdapterTarget(address(adapter), 10000);
        vm.prank(architect);
        c.executeAllocation(14, one, none, none);
        // all 1000 senior USDC should now sit in the adapter
        assertEq(adapter.totalAssetsFor(address(c)), 1_000e6);
    }
}
