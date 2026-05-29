// SPDX-License-Identifier: MIT
pragma solidity 0.8.24;

import "forge-std/Script.sol";
import {AgentEventBus} from "../src/AgentEventBus.sol";
import {TrancheController} from "../src/TrancheController.sol";
import {TrancheVault} from "../src/TrancheVault.sol";
import {OpenComplianceGate} from "../src/compliance/OpenComplianceGate.sol";
import {IComplianceGate} from "../src/interfaces/IComplianceGate.sol";
import {AaveV3UsdcAdapter} from "../src/adapters/AaveV3UsdcAdapter.sol";
import {MockUSDC} from "../test/mocks/MockUSDC.sol";
import {MockYieldAdapter} from "../test/mocks/MockYieldAdapter.sol";
import {IERC20Metadata} from "@openzeppelin/contracts/token/ERC20/extensions/IERC20Metadata.sol";

contract Deploy is Script {
    // mainnet (5000) verified facts
    address constant MANTLE_USDC = 0x09Bc4E0D864854c6aFB6eB9A9cdF58aC190D0dF9;
    address constant AAVE_POOL = 0x458F293454fE0d67EC0655f3672301301DD51422;
    address constant AUSDC = 0xcb8164415274515867ec43CbD284ab5d6d2b304F;
    uint256 constant SAFETY_CAP = 1_000e6;

    function run() external {
        uint256 pk = vm.envUint("DEPLOYER_PRIVATE_KEY");
        address deployer = vm.addr(pk);
        vm.startBroadcast(pk);

        // 1. underlying
        address usdc;
        if (block.chainid == 5000) {
            usdc = MANTLE_USDC;
            require(IERC20Metadata(usdc).decimals() == 6, "USDC decimals != 6");
        } else {
            usdc = address(new MockUSDC()); // Sepolia/local
        }

        // 2. core
        AgentEventBus bus = new AgentEventBus(deployer);
        OpenComplianceGate gate = new OpenComplianceGate();
        TrancheController controller = new TrancheController(address(bus), usdc, deployer, deployer);

        // 3. vaults
        TrancheVault senior = new TrancheVault(IERC20Metadata(usdc), controller, IComplianceGate(address(gate)), TrancheController.Tranche.Senior, deployer, "Strata Senior", "sSTRATA");
        TrancheVault mezz = new TrancheVault(IERC20Metadata(usdc), controller, IComplianceGate(address(gate)), TrancheController.Tranche.Mezzanine, deployer, "Strata Mezz", "mSTRATA");
        TrancheVault junior = new TrancheVault(IERC20Metadata(usdc), controller, IComplianceGate(address(gate)), TrancheController.Tranche.Junior, deployer, "Strata Junior", "jSTRATA");
        controller.setVault(TrancheController.Tranche.Senior, address(senior));
        controller.setVault(TrancheController.Tranche.Mezzanine, address(mezz));
        controller.setVault(TrancheController.Tranche.Junior, address(junior));

        // 4. adapter (real Aave on mainnet, mock elsewhere)
        address adapter;
        if (block.chainid == 5000) {
            AaveV3UsdcAdapter a = new AaveV3UsdcAdapter(usdc, deployer, AAVE_POOL, AUSDC);
            a.setCap(SAFETY_CAP);
            adapter = address(a);
        } else {
            adapter = address(new MockYieldAdapter(usdc, deployer, 1000));
        }
        controller.addAdapter(adapter);
        controller.setTrancheTargets(600, 1000);

        vm.stopBroadcast();

        // 5. write deployment record
        string memory json = "deployment";
        vm.serializeAddress(json, "agentEventBus", address(bus));
        vm.serializeAddress(json, "complianceGate", address(gate));
        vm.serializeAddress(json, "controller", address(controller));
        vm.serializeAddress(json, "seniorVault", address(senior));
        vm.serializeAddress(json, "mezzVault", address(mezz));
        vm.serializeAddress(json, "juniorVault", address(junior));
        vm.serializeAddress(json, "usdc", usdc);
        string memory out = vm.serializeAddress(json, "adapter", adapter);
        vm.writeJson(out, string.concat("./deployments/", vm.toString(block.chainid), ".json"));
    }
}
