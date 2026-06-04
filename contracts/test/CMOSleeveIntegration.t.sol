// SPDX-License-Identifier: MIT
pragma solidity 0.8.24;

import {Fixtures} from "./helpers/Fixtures.sol";
import {TrancheController} from "../src/TrancheController.sol";
import {IAgentEventBus} from "../src/interfaces/IAgentEventBus.sol";
import {MortgageCMOSleeve} from "../src/adapters/MortgageCMOSleeve.sol";

/// @notice End-to-end: a mortgage default in the Junior-backing CMO sleeve must flow through the
///         controller's harvest waterfall as a Junior-first loss, leaving Senior/Mezz untouched.
///         (Previously only unit-tested on the sleeve in isolation.)
contract CMOSleeveIntegrationTest is Fixtures {
    MortgageCMOSleeve cmo;

    function setUp() public {
        deployStack();
        cmo = new MortgageCMOSleeve(address(usdc), owner, 600, 0); // demo CMO, Junior adapter
        vm.prank(owner);
        controller.addAdapter(address(cmo));
    }

    function _fund(TrancheController.Tranche t, address vault, uint256 amt) internal {
        usdc.mint(address(controller), amt);
        vm.prank(vault);
        controller.notifyDeposit(t, amt);
    }

    /// Routes Senior/Mezz to the (yield) mock and Junior 100% into the CMO sleeve.
    function _seedAndAllocate(uint256 id) internal {
        _fund(TrancheController.Tranche.Senior, address(senior), 2_000e6);
        _fund(TrancheController.Tranche.Mezzanine, address(mezz), 2_000e6);
        _fund(TrancheController.Tranche.Junior, address(junior), 1_000e6);

        vm.prank(architect);
        bus.proposeAllocation(id, 5000, 3000, 2000, "QmR");
        vm.prank(sentinel);
        bus.issueRiskVerdict(id, true, "QmC");

        TrancheController.AdapterTarget[] memory toMock = new TrancheController.AdapterTarget[](1);
        toMock[0] = TrancheController.AdapterTarget(address(adapter), 10000);
        TrancheController.AdapterTarget[] memory toCmo = new TrancheController.AdapterTarget[](1);
        toCmo[0] = TrancheController.AdapterTarget(address(cmo), 10000);

        vm.prank(architect);
        controller.executeAllocation(id, toMock, toMock, toCmo);

        // Junior's 1000 is now locked as CMO principal; Senior+Mezz sit in the mock.
        assertEq(cmo.totalAssetsFor(address(controller)), 1_000e6);
    }

    function test_cmoDefault_isAbsorbedByJuniorFirst() public {
        _seedAndAllocate(1);

        // a 200 mortgage default writes down CMO principal -> the sleeve's NAV drops by 200
        vm.prank(owner);
        cmo.applyDefault(200e6);
        assertEq(cmo.totalAssetsFor(address(controller)), 800e6);

        controller.harvest();

        // Junior (the first-loss tranche) eats the entire 200; Senior/Mezz untouched
        assertEq(controller.trancheNAVView(TrancheController.Tranche.Junior), 800e6);
        assertEq(controller.trancheNAVView(TrancheController.Tranche.Mezzanine), 2_000e6);
        assertEq(controller.trancheNAVView(TrancheController.Tranche.Senior), 2_000e6);
    }

    function test_cmoFullDefault_wipesJuniorToZero_noSpillToMezz() public {
        _seedAndAllocate(2);

        // total default on the CMO principal: sleeve NAV -> 0, a 1000 loss == Junior's whole NAV
        vm.prank(owner);
        cmo.applyDefault(1_000e6);
        assertEq(cmo.totalAssetsFor(address(controller)), 0);

        controller.harvest();

        assertEq(controller.trancheNAVView(TrancheController.Tranche.Junior), 0);
        assertEq(controller.trancheNAVView(TrancheController.Tranche.Mezzanine), 2_000e6);
        assertEq(controller.trancheNAVView(TrancheController.Tranche.Senior), 2_000e6);
    }
}
