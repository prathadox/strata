// SPDX-License-Identifier: MIT
pragma solidity 0.8.24;

import "forge-std/Script.sol";
import {AgentEventBus} from "../src/AgentEventBus.sol";
import {IAgentEventBus} from "../src/interfaces/IAgentEventBus.sol";

/// @notice Grants bus roles to the four operating-loop agents. Addresses come from env.
contract GrantRoles is Script {
    function run() external {
        uint256 pk = vm.envUint("DEPLOYER_PRIVATE_KEY");
        AgentEventBus bus = AgentEventBus(vm.envAddress("AGENT_EVENT_BUS_ADDRESS"));
        address scout = vm.envAddress("SCOUT_ADDRESS");
        address architect = vm.envAddress("ARCHITECT_ADDRESS");
        address sentinel = vm.envAddress("SENTINEL_ADDRESS");
        address operator = vm.envAddress("OPERATOR_ADDRESS");

        vm.startBroadcast(pk);
        bus.setRole(scout, IAgentEventBus.Role.Scout);
        bus.setRole(architect, IAgentEventBus.Role.Architect);
        bus.setRole(sentinel, IAgentEventBus.Role.Sentinel);
        bus.setRole(operator, IAgentEventBus.Role.Operator);
        vm.stopBroadcast();
    }
}
