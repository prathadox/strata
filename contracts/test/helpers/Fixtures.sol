// SPDX-License-Identifier: MIT
pragma solidity 0.8.24;

import "forge-std/Test.sol";
import {AgentEventBus} from "../../src/AgentEventBus.sol";
import {IAgentEventBus} from "../../src/interfaces/IAgentEventBus.sol";
import {TrancheController} from "../../src/TrancheController.sol";
import {TrancheVault} from "../../src/TrancheVault.sol";
import {OpenComplianceGate} from "../../src/compliance/OpenComplianceGate.sol";
import {IComplianceGate} from "../../src/interfaces/IComplianceGate.sol";
import {MockUSDC} from "../mocks/MockUSDC.sol";
import {MockYieldAdapter} from "../mocks/MockYieldAdapter.sol";
import {IERC20Metadata} from "@openzeppelin/contracts/token/ERC20/extensions/IERC20Metadata.sol";

contract Fixtures is Test {
    AgentEventBus bus;
    TrancheController controller;
    TrancheVault senior;
    TrancheVault mezz;
    TrancheVault junior;
    OpenComplianceGate gate;
    MockUSDC usdc;
    MockYieldAdapter adapter;

    address owner = address(0xA11CE);
    address architect = address(0xACED);
    address sentinel = address(0x5E47);

    function deployStack() internal {
        usdc = new MockUSDC();
        gate = new OpenComplianceGate();
        vm.prank(owner);
        bus = new AgentEventBus(owner);
        vm.startPrank(owner);
        bus.setRole(architect, IAgentEventBus.Role.Architect);
        bus.setRole(sentinel, IAgentEventBus.Role.Sentinel);
        controller = new TrancheController(address(bus), address(usdc), owner, architect);
        senior = new TrancheVault(IERC20Metadata(address(usdc)), controller, IComplianceGate(address(gate)), TrancheController.Tranche.Senior, owner, "Strata Senior", "sSTRATA");
        mezz = new TrancheVault(IERC20Metadata(address(usdc)), controller, IComplianceGate(address(gate)), TrancheController.Tranche.Mezzanine, owner, "Strata Mezz", "mSTRATA");
        junior = new TrancheVault(IERC20Metadata(address(usdc)), controller, IComplianceGate(address(gate)), TrancheController.Tranche.Junior, owner, "Strata Junior", "jSTRATA");
        controller.setVault(TrancheController.Tranche.Senior, address(senior));
        controller.setVault(TrancheController.Tranche.Mezzanine, address(mezz));
        controller.setVault(TrancheController.Tranche.Junior, address(junior));
        adapter = new MockYieldAdapter(address(usdc), owner, 1000); // 10% APY
        controller.addAdapter(address(adapter));
        controller.setTrancheTargets(600, 1000);
        vm.stopPrank();
    }
}
