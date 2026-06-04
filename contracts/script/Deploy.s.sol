// SPDX-License-Identifier: MIT
pragma solidity 0.8.24;

import "forge-std/Script.sol";
import {AgentEventBus} from "../src/AgentEventBus.sol";
import {TrancheController} from "../src/TrancheController.sol";
import {TrancheVault} from "../src/TrancheVault.sol";
import {OpenComplianceGate} from "../src/compliance/OpenComplianceGate.sol";
import {ComplianceRegistry} from "../src/compliance/ComplianceRegistry.sol";
import {IComplianceGate} from "../src/interfaces/IComplianceGate.sol";
import {BaseYieldAdapter} from "../src/adapters/BaseYieldAdapter.sol";
import {AaveV3UsdcAdapter} from "../src/adapters/AaveV3UsdcAdapter.sol";
import {OndoUsdyAdapter} from "../src/adapters/OndoUsdyAdapter.sol";
import {MethAdapter} from "../src/adapters/MethAdapter.sol";
import {EthenaSusdeAdapter} from "../src/adapters/EthenaSusdeAdapter.sol";
import {AgniLpUsdcUsdeAdapter} from "../src/adapters/AgniLpUsdcUsdeAdapter.sol";
import {PerpBasisEscrowAdapter} from "../src/adapters/PerpBasisEscrowAdapter.sol";
import {MockUSDC} from "../test/mocks/MockUSDC.sol";
import {MockYieldAdapter} from "../test/mocks/MockYieldAdapter.sol";
import {IERC20Metadata} from "@openzeppelin/contracts/token/ERC20/extensions/IERC20Metadata.sol";

/// @notice Deploys the full Strata stack. On Mantle mainnet (chainid 5000) it wires the real
///         ComplianceRegistry (verifier = Compliance Agent #105) into all three vaults and registers
///         every real backing adapter (Aave, Ondo, mETH, Ethena, Agni LP, perp escrow). On any other
///         chain it falls back to the allow-all gate + a MockYieldAdapter for smoke deploys.
///
/// @dev    The wiring lives in `deployAll(deployer)` — a pure, broadcast-free function so a dry-run
///         test (`test/fork/DeployWiring.fork.t.sol`) can execute the exact mainnet path on a Mantle
///         fork and assert correctness without spending gas or needing a key. `run()` only wraps it in
///         `vm.broadcast` + writes the deployment JSON.
contract Deploy is Script {
    // ── Mantle mainnet (5000) verified facts ──
    address constant MANTLE_USDC = 0x09Bc4E0D864854c6aFB6eB9A9cdF58aC190D0dF9;
    address constant AAVE_POOL = 0x458F293454fE0d67EC0655f3672301301DD51422;
    address constant AUSDC = 0xcb8164415274515867ec43CbD284ab5d6d2b304F;
    address constant ONDO_USDY = 0x5bE26527e817998A7206475496fDE1E68957c5A6;
    address constant ONDO_ORACLE = 0xA96abbe61AfEdEB0D14a20440Ae7100D9aB4882f;
    address constant METH = 0xcDA86A272531e8640cD7F1a92c01839911B90bb0;
    address constant METH_USD_FEED = 0xB16FcAFB8378baA0a69142a325878FDCad58606A;
    address constant USDE = 0x5d3a1Ff2b6BAb83b63cd9AD0787074081a52ef34;
    address constant SUSDE = 0x211Cc4DD073734dA055fbF44a2b4667d5E5fE5d2;
    address constant AGNI_ROUTER = 0x319B69888b0d11cEC22caA5034e25FfFBDc88421;
    address constant AGNI_POOL_USDC_USDE = 0xBCf99c834E65E8a58090E20eDc058279317865BD;
    address constant AGNI_POSITION_MANAGER = 0x218bf598D1453383e2F4AA7b14fFB9BfB102D637;
    uint24 constant FEE_USDC_USDE = 100;
    uint24 constant FEE_USDE_SUSDE = 500;
    uint256 constant ETHENA_INIT_RATE = 1232629081726051886; // ~1.2326 sUSDe->USDe (2026-05-30)

    // Compliance Agent #105 signing wallet (ERC-8004 ownerOf, verified on-chain) → registry verifier.
    address constant COMPLIANCE_VERIFIER = 0x59767a3E91998A07D11aBE13CD460Fa3249CA628;
    // Operator agent #104 wallet → perp-escrow reporter.
    address constant OPERATOR_WALLET = 0xB342B41A68a3c6C36Efb8f224CDd252F90aD519E;

    uint256 constant SAFETY_CAP = 1_000e6;        // $1000 per-adapter cap for the capped mainnet launch
    uint256 constant METH_MAX_PRICE_AGE = 1 days; // Chainlink staleness bound

    struct Deployment {
        address usdc;
        address bus;
        address gate;       // active compliance gate set on the vaults
        address registry;   // ComplianceRegistry (== gate on mainnet; address(0) otherwise)
        address controller;
        address senior;
        address mezz;
        address junior;
        address aave;
        address ondo;
        address meth;
        address ethena;
        address agniLp;
        address perp;
        bool mainnet;
    }

    function run() external {
        uint256 pk = vm.envUint("DEPLOYER_PRIVATE_KEY");
        address deployer = vm.addr(pk);
        vm.startBroadcast(pk);
        Deployment memory d = deployAll(deployer);
        vm.stopBroadcast();
        _writeJson(d);
    }

    /// @notice Deploys + wires the whole stack. No broadcasting — safe to call from a dry-run test.
    function deployAll(address deployer) public returns (Deployment memory d) {
        d.mainnet = block.chainid == 5000;

        // 1. underlying
        d.usdc = d.mainnet ? MANTLE_USDC : address(new MockUSDC());
        if (d.mainnet) require(IERC20Metadata(d.usdc).decimals() == 6, "USDC decimals != 6");

        // 2. core
        AgentEventBus bus = new AgentEventBus(deployer);
        d.bus = address(bus);
        TrancheController controller = new TrancheController(address(bus), d.usdc, deployer, deployer);
        d.controller = address(controller);

        // 3. compliance gate — real registry on mainnet, allow-all stub for smoke chains
        if (d.mainnet) {
            ComplianceRegistry registry = new ComplianceRegistry(deployer, COMPLIANCE_VERIFIER);
            d.registry = address(registry);
            d.gate = address(registry);
        } else {
            d.gate = address(new OpenComplianceGate());
        }

        // 4. vaults (gated by the chosen compliance gate)
        TrancheVault senior = new TrancheVault(
            IERC20Metadata(d.usdc), controller, IComplianceGate(d.gate),
            TrancheController.Tranche.Senior, deployer, "Strata Senior", "sSTRATA"
        );
        TrancheVault mezz = new TrancheVault(
            IERC20Metadata(d.usdc), controller, IComplianceGate(d.gate),
            TrancheController.Tranche.Mezzanine, deployer, "Strata Mezz", "mSTRATA"
        );
        TrancheVault junior = new TrancheVault(
            IERC20Metadata(d.usdc), controller, IComplianceGate(d.gate),
            TrancheController.Tranche.Junior, deployer, "Strata Junior", "jSTRATA"
        );
        d.senior = address(senior);
        d.mezz = address(mezz);
        d.junior = address(junior);
        controller.setVault(TrancheController.Tranche.Senior, d.senior);
        controller.setVault(TrancheController.Tranche.Mezzanine, d.mezz);
        controller.setVault(TrancheController.Tranche.Junior, d.junior);

        // 5. adapters
        if (d.mainnet) {
            d.aave = _addAdapter(controller, address(new AaveV3UsdcAdapter(d.usdc, deployer, AAVE_POOL, AUSDC)));
            d.ondo = _addAdapter(controller, address(new OndoUsdyAdapter(d.usdc, deployer, ONDO_USDY, ONDO_ORACLE)));
            d.meth = _addAdapter(
                controller, address(new MethAdapter(d.usdc, deployer, METH, METH_USD_FEED, METH_MAX_PRICE_AGE))
            );
            d.ethena = _addAdapter(
                controller,
                address(new EthenaSusdeAdapter(
                    d.usdc, deployer, USDE, SUSDE, AGNI_ROUTER, FEE_USDC_USDE, FEE_USDE_SUSDE, ETHENA_INIT_RATE
                ))
            );
            d.agniLp = _addAdapter(
                controller,
                address(new AgniLpUsdcUsdeAdapter(d.usdc, deployer, AGNI_POOL_USDC_USDE, AGNI_POSITION_MANAGER, AGNI_ROUTER))
            );
            d.perp = _addAdapter(
                controller, address(new PerpBasisEscrowAdapter(d.usdc, deployer, OPERATOR_WALLET))
            );
        } else {
            d.aave = _addAdapter(controller, address(new MockYieldAdapter(d.usdc, deployer, 1000)));
        }

        // 6. tranche targets (senior 6%, mezz 10%; junior = remainder)
        controller.setTrancheTargets(600, 1000);
    }

    /// @dev register an adapter, apply the per-adapter safety cap, return its address (for the struct).
    function _addAdapter(TrancheController controller, address adapter) internal returns (address) {
        BaseYieldAdapter(adapter).setCap(SAFETY_CAP); // $1000 capped-launch limit, enforced in BaseYieldAdapter
        controller.addAdapter(adapter);
        return adapter;
    }

    function _writeJson(Deployment memory d) internal {
        string memory json = "deployment";
        vm.serializeAddress(json, "agentEventBus", d.bus);
        vm.serializeAddress(json, "complianceGate", d.gate);
        vm.serializeAddress(json, "complianceRegistry", d.registry);
        vm.serializeAddress(json, "controller", d.controller);
        vm.serializeAddress(json, "seniorVault", d.senior);
        vm.serializeAddress(json, "mezzVault", d.mezz);
        vm.serializeAddress(json, "juniorVault", d.junior);
        vm.serializeAddress(json, "usdc", d.usdc);
        vm.serializeAddress(json, "aaveAdapter", d.aave);
        vm.serializeAddress(json, "ondoAdapter", d.ondo);
        vm.serializeAddress(json, "methAdapter", d.meth);
        vm.serializeAddress(json, "ethenaAdapter", d.ethena);
        vm.serializeAddress(json, "agniLpAdapter", d.agniLp);
        string memory out = vm.serializeAddress(json, "perpAdapter", d.perp);
        vm.writeJson(out, string.concat("./deployments/", vm.toString(block.chainid), ".json"));
    }
}
