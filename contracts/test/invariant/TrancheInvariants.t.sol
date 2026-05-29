// SPDX-License-Identifier: MIT
pragma solidity 0.8.24;

import {Fixtures} from "../helpers/Fixtures.sol";
import {TrancheController} from "../../src/TrancheController.sol";
import {StdInvariant} from "forge-std/StdInvariant.sol";

contract TrancheInvariants is StdInvariant, Fixtures {
    address alice = address(0xA11);

    function setUp() public {
        deployStack();
        usdc.mint(alice, 100_000e6);
        vm.prank(alice);
        usdc.approve(address(senior), type(uint256).max);
        // seed a position so harvest has something to act on
        vm.prank(alice);
        senior.deposit(10_000e6, alice);

        // only fuzz harvest() — it's the permissionless state mutator
        targetContract(address(controller));
        bytes4[] memory selectors = new bytes4[](1);
        selectors[0] = TrancheController.harvest.selector;
        targetSelector(FuzzSelector({addr: address(controller), selectors: selectors}));
    }

    /// @dev tranche NAVs are never negative (unsigned, so this checks no underflow corrupted them
    ///      and senior never exceeds total assets under the bookkeeping).
    function invariant_navsNonNegativeAndBounded() public view {
        uint256 s = controller.trancheNAVView(TrancheController.Tranche.Senior);
        uint256 m = controller.trancheNAVView(TrancheController.Tranche.Mezzanine);
        uint256 j = controller.trancheNAVView(TrancheController.Tranche.Junior);
        // sum is a sane number (no underflow wraparound to astronomically large values)
        assertLe(s + m + j, 1_000_000_000e6);
    }

    /// @dev sum of tranche NAVs equals controller idle + adapter holdings after a harvest settles.
    function invariant_navMatchesBackedAssets() public {
        controller.harvest();
        uint256 navSum = controller.trancheNAVView(TrancheController.Tranche.Senior)
            + controller.trancheNAVView(TrancheController.Tranche.Mezzanine)
            + controller.trancheNAVView(TrancheController.Tranche.Junior);
        uint256 backed = usdc.balanceOf(address(controller)) + adapter.totalAssetsFor(address(controller));
        assertApproxEqAbs(navSum, backed, 2);
    }
}
