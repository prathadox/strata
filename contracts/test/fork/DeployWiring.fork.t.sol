// SPDX-License-Identifier: MIT
pragma solidity 0.8.24;

import "forge-std/Test.sol";
import {Deploy} from "../../script/Deploy.s.sol";
import {GrantRoles} from "../../script/GrantRoles.s.sol";
import {AgentEventBus} from "../../src/AgentEventBus.sol";
import {IAgentEventBus} from "../../src/interfaces/IAgentEventBus.sol";
import {TrancheController} from "../../src/TrancheController.sol";
import {TrancheVault} from "../../src/TrancheVault.sol";
import {ComplianceRegistry} from "../../src/compliance/ComplianceRegistry.sol";
import {BaseYieldAdapter} from "../../src/adapters/BaseYieldAdapter.sol";

/// @notice Dry-run deploy wiring test. Executes the real `Deploy.deployAll` + `GrantRoles.grantAll`
///         logic and asserts the stack is wired correctly — the ComplianceRegistry is the gate on every
///         vault, the verifier is the Compliance agent, all six adapters are registered + capped, and the
///         four bus roles map to the verified agent wallets. NO broadcasting, no key, no gas: this proves
///         the mainnet deploy path is correct before the (separately gated) real broadcast.
///
/// @dev    `deployAll`/`grantAll` perform `onlyOwner` wiring calls, so the *caller* must be the owner.
///         In production `run()` gets this via `vm.startBroadcast(deployer)` (the script's calls are sent
///         as the deployer). In this test the caller of the wiring is the script contract itself, so we
///         pass `address(deployScript)` as the admin/owner — the script wires what it owns. The only
///         thing this doesn't cover is the constructor arg "owner == deployer" (trivially correct and
///         exercised by the real broadcast). The mainnet-path tests fork Mantle (need MANTLE_RPC_URL);
///         the fallback-path test runs in-memory.
contract DeployWiringForkTest is Test {
    // Expected wired constants (mirror Deploy.s.sol / GrantRoles.s.sol; verified on-chain 2026-05-30)
    address constant MANTLE_USDC = 0x09Bc4E0D864854c6aFB6eB9A9cdF58aC190D0dF9;
    address constant COMPLIANCE_VERIFIER = 0x59767a3E91998A07D11aBE13CD460Fa3249CA628;
    address constant SCOUT = 0x7CAC071f0F59dEe64509ea1C3BD8245bE529fcdE;
    address constant ARCHITECT = 0xbFDb8d132358b2f46D3104Ef484048Bb916De714;
    address constant SENTINEL = 0xfE7EB19092F03E00B6eD0a248D38E80e0aA8708f;
    address constant OPERATOR = 0xB342B41A68a3c6C36Efb8f224CDd252F90aD519E;

    Deploy deployScript;
    GrantRoles grantScript;

    function setUp() public {
        deployScript = new Deploy();
        grantScript = new GrantRoles();
    }

    function _forkMantleOrSkip() internal {
        try vm.envString("MANTLE_RPC_URL") returns (string memory url) {
            vm.createSelectFork(url);
        } catch {
            vm.skip(true);
        }
        // re-create the scripts on the forked state so their bytecode is present
        deployScript = new Deploy();
        grantScript = new GrantRoles();
    }

    // ── mainnet path (Mantle fork) ──────────────────────────────────────────
    function test_mainnetWiring_registryGatesAllVaultsAndAdaptersRegistered() public {
        _forkMantleOrSkip();
        require(block.chainid == 5000, "fork must be Mantle mainnet (5000)");

        // admin == the script, because the script is what makes the onlyOwner wiring calls here.
        Deploy.Deployment memory d = deployScript.deployAll(address(deployScript));

        assertTrue(d.mainnet, "should take the mainnet path");
        assertEq(d.usdc, MANTLE_USDC, "real Mantle USDC");

        // ComplianceRegistry is the gate on ALL THREE vaults (not the allow-all stub)
        assertEq(d.gate, d.registry, "gate should be the ComplianceRegistry on mainnet");
        assertEq(address(TrancheVault(d.senior).complianceGate()), d.registry, "senior gate");
        assertEq(address(TrancheVault(d.mezz).complianceGate()), d.registry, "mezz gate");
        assertEq(address(TrancheVault(d.junior).complianceGate()), d.registry, "junior gate");

        // verifier == Compliance agent #105
        assertEq(ComplianceRegistry(d.registry).verifier(), COMPLIANCE_VERIFIER, "registry verifier");

        // controller knows its vaults
        TrancheController c = TrancheController(d.controller);
        assertEq(c.vaultOf(TrancheController.Tranche.Senior), d.senior, "controller senior vault");
        assertEq(c.vaultOf(TrancheController.Tranche.Mezzanine), d.mezz, "controller mezz vault");
        assertEq(c.vaultOf(TrancheController.Tranche.Junior), d.junior, "controller junior vault");

        // all six real adapters registered + capped at the $1000 safety cap
        address[6] memory adapters = [d.aave, d.ondo, d.meth, d.ethena, d.agniLp, d.perp];
        for (uint256 i = 0; i < adapters.length; i++) {
            assertTrue(adapters[i] != address(0), "adapter not deployed");
            assertTrue(c.isAdapter(adapters[i]), "adapter not registered");
            assertEq(BaseYieldAdapter(adapters[i]).depositCap(), 1_000e6, "safety cap not set");
        }

        // tranche targets wired
        assertEq(c.seniorTargetBps(), 600, "senior target");
        assertEq(c.mezzTargetBps(), 1000, "mezz target");
    }

    function test_grantRoles_mapsToAgentWallets() public {
        // No fork needed — exercises the GrantRoles logic + the verified agent-wallet constants.
        // bus owner == grantScript so its onlyOwner setRole calls succeed.
        AgentEventBus bus = new AgentEventBus(address(grantScript));
        grantScript.grantAll(bus, SCOUT, ARCHITECT, SENTINEL, OPERATOR);

        assertEq(uint8(bus.roleOf(SCOUT)), uint8(IAgentEventBus.Role.Scout), "scout role");
        assertEq(uint8(bus.roleOf(ARCHITECT)), uint8(IAgentEventBus.Role.Architect), "architect role");
        assertEq(uint8(bus.roleOf(SENTINEL)), uint8(IAgentEventBus.Role.Sentinel), "sentinel role");
        assertEq(uint8(bus.roleOf(OPERATOR)), uint8(IAgentEventBus.Role.Operator), "operator role");
    }

    // ── fallback path (no fork: chainid is not 5000) ────────────────────────
    function test_fallbackWiring_usesOpenGateAndMockAdapter() public {
        require(block.chainid != 5000, "expected non-mainnet chainid for fallback test");

        Deploy.Deployment memory d = deployScript.deployAll(address(deployScript));

        assertFalse(d.mainnet, "should take the fallback path");
        assertEq(d.registry, address(0), "no registry off mainnet");
        assertTrue(d.gate != address(0), "an allow-all gate is set");
        TrancheController c = TrancheController(d.controller);
        assertTrue(c.isAdapter(d.aave), "mock adapter registered");
        assertEq(d.ondo, address(0), "no ondo off mainnet");
        assertEq(d.agniLp, address(0), "no agni off mainnet");
        // gate allows anyone (allow-all stub) so vault deposits aren't compliance-blocked on smoke chains
        assertTrue(TrancheVault(d.senior).complianceGate().isAllowed(address(0xBEEF), 0), "open gate allows");
    }
}
