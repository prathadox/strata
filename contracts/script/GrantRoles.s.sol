// SPDX-License-Identifier: MIT
pragma solidity 0.8.24;

import "forge-std/Script.sol";
import {AgentEventBus} from "../src/AgentEventBus.sol";
import {IAgentEventBus} from "../src/interfaces/IAgentEventBus.sol";

/// @notice Grants bus roles to the four operating-loop agents. Defaults to the on-chain-verified
///         agent wallets (ERC-8004 `ownerOf`, recorded in STATUS.md); each can be overridden via env.
///
/// @dev    ⚠️ These are the agents' identity-NFT owner EOAs. If the agents emit to the bus from
///         smart-contract wallets instead, override the env vars with those SC-wallet addresses
///         before broadcasting (confirm with the agents owner — prathadox — first).
contract GrantRoles is Script {
    // Verified on-chain via registry ownerOf(agentId), 2026-05-30.
    address constant SCOUT = 0x7CAC071f0F59dEe64509ea1C3BD8245bE529fcdE;     // #101
    address constant ARCHITECT = 0xbFDb8d132358b2f46D3104Ef484048Bb916De714; // #102
    address constant SENTINEL = 0xfE7EB19092F03E00B6eD0a248D38E80e0aA8708f;  // #103
    address constant OPERATOR = 0xB342B41A68a3c6C36Efb8f224CDd252F90aD519E;  // #104

    function run() external {
        uint256 pk = vm.envUint("DEPLOYER_PRIVATE_KEY");
        AgentEventBus bus = AgentEventBus(vm.envAddress("AGENT_EVENT_BUS_ADDRESS"));
        address scout = vm.envOr("SCOUT_ADDRESS", SCOUT);
        address architect = vm.envOr("ARCHITECT_ADDRESS", ARCHITECT);
        address sentinel = vm.envOr("SENTINEL_ADDRESS", SENTINEL);
        address operator = vm.envOr("OPERATOR_ADDRESS", OPERATOR);

        vm.startBroadcast(pk);
        grantAll(bus, scout, architect, sentinel, operator);
        vm.stopBroadcast();
    }

    /// @notice Assign the four roles. Broadcast-free so a dry-run test can reuse it. Caller (or the
    ///         broadcasting key) must be the bus owner.
    function grantAll(AgentEventBus bus, address scout, address architect, address sentinel, address operator)
        public
    {
        bus.setRole(scout, IAgentEventBus.Role.Scout);
        bus.setRole(architect, IAgentEventBus.Role.Architect);
        bus.setRole(sentinel, IAgentEventBus.Role.Sentinel);
        bus.setRole(operator, IAgentEventBus.Role.Operator);
    }
}
