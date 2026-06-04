// SPDX-License-Identifier: MIT
pragma solidity 0.8.24;

import "forge-std/Test.sol";
import {TrancheVault} from "../src/TrancheVault.sol";
import {TrancheController} from "../src/TrancheController.sol";
import {AgentEventBus} from "../src/AgentEventBus.sol";
import {IAgentEventBus} from "../src/interfaces/IAgentEventBus.sol";
import {OpenComplianceGate} from "../src/compliance/OpenComplianceGate.sol";
import {IComplianceGate} from "../src/interfaces/IComplianceGate.sol";
import {MockUSDC} from "./mocks/MockUSDC.sol";
import {IERC20Metadata} from "@openzeppelin/contracts/token/ERC20/extensions/IERC20Metadata.sol";

contract TrancheVaultTest is Test {
    TrancheController c;
    AgentEventBus bus;
    MockUSDC usdc;
    OpenComplianceGate gate;
    TrancheVault senior;

    address owner = address(0xA11CE);
    address architect = address(0xACED);
    address alice = address(0xA11);

    function setUp() public {
        usdc = new MockUSDC();
        gate = new OpenComplianceGate();
        vm.prank(owner);
        bus = new AgentEventBus(owner);
        vm.startPrank(owner);
        c = new TrancheController(address(bus), address(usdc), owner, architect);
        senior = new TrancheVault(IERC20Metadata(address(usdc)), c, IComplianceGate(address(gate)), TrancheController.Tranche.Senior, owner, "Strata Senior", "sSTRATA");
        c.setVault(TrancheController.Tranche.Senior, address(senior));
        vm.stopPrank();

        usdc.mint(alice, 10_000e6);
        vm.prank(alice);
        usdc.approve(address(senior), type(uint256).max);
    }

    function test_deposit_forwardsToController_creditsNAV() public {
        vm.prank(alice);
        senior.deposit(1_000e6, alice);
        assertEq(usdc.balanceOf(address(c)), 1_000e6);     // controller custodies
        assertEq(usdc.balanceOf(address(senior)), 0);       // vault holds nothing
        assertEq(c.trancheNAVView(TrancheController.Tranche.Senior), 1_000e6);
        assertEq(senior.totalAssets(), 1_000e6);
        assertGt(senior.balanceOf(alice), 0);
    }

    function test_withdraw_burnsShares_releasesFromController() public {
        vm.startPrank(alice);
        senior.deposit(1_000e6, alice);
        uint256 shares = senior.balanceOf(alice);
        senior.redeem(shares, alice, alice);
        vm.stopPrank();
        assertEq(usdc.balanceOf(alice), 10_000e6); // got it all back
        assertEq(c.trancheNAVView(TrancheController.Tranche.Senior), 0);
    }

    function test_deposit_blockedByComplianceGate() public {
        // swap in a deny-all gate, expect revert
        DenyGate deny = new DenyGate();
        vm.prank(owner);
        senior.setComplianceGate(IComplianceGate(address(deny)));
        vm.prank(alice);
        vm.expectRevert(TrancheVault.NotCompliant.selector);
        senior.deposit(1_000e6, alice);
    }

    function test_setComplianceGate_onlyOwner() public {
        vm.prank(address(0xBAD));
        vm.expectRevert(); // Ownable revert
        senior.setComplianceGate(IComplianceGate(address(0x1)));
    }
}

contract DenyGate is IComplianceGate {
    function isAllowed(address, uint8) external pure returns (bool) { return false; }
}
