// SPDX-License-Identifier: MIT
pragma solidity 0.8.24;

import "forge-std/Test.sol";
import {OndoUsdyAdapter} from "../../src/adapters/OndoUsdyAdapter.sol";
import {IRWADynamicOracle} from "../../src/external/IRWADynamicOracle.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";

/// @notice Real-Mantle integration check for the hold-only Ondo USDY adapter.
///         Validates the adapter's valuation math against the LIVE Ondo price oracle and the real
///         18-decimal USDY token — i.e. that the oracle implements getPrice() at 1e18 scale and our
///         18->6 decimal conversion reports a correct USDC-equivalent NAV.
///
///         Addresses verified on-chain 2026-05-30: USDY is 18-dec; the Redemption Price Oracle's
///         getPrice() returns ~1.13e18 ($1.13/USDY, accruing). USDC<->USDY conversion is NOT
///         on-chain on Mantle, so deposit()/withdraw() revert by design (hold-only custody).
contract OndoUsdyAdapterForkTest is Test {
    address constant USDC = 0x09Bc4E0D864854c6aFB6eB9A9cdF58aC190D0dF9;
    address constant USDY = 0x5bE26527e817998A7206475496fDE1E68957c5A6;
    address constant ORACLE = 0xA96abbe61AfEdEB0D14a20440Ae7100D9aB4882f; // USDY Redemption Price Oracle

    OndoUsdyAdapter adapter;
    address owner = address(0xA11CE);
    address controller = address(0xC0);

    function setUp() public {
        try vm.envString("MANTLE_RPC_URL") returns (string memory url) {
            vm.createSelectFork(url);
        } catch {
            vm.skip(true);
        }
        adapter = new OndoUsdyAdapter(USDC, owner, USDY, ORACLE);
        deal(USDY, owner, 1_000e18);
        vm.prank(owner);
        IERC20(USDY).approve(address(adapter), type(uint256).max);
    }

    /// NAV equals (held USDY * live oracle price), converted 18->6 decimals to USDC terms.
    function test_realOndo_valuesUsdyViaLiveOracle() public {
        vm.prank(owner);
        adapter.depositUsdy(1_000e18);

        uint256 price = IRWADynamicOracle(ORACLE).getPrice(); // 1e18-scaled USD/USDY
        assertGt(price, 1e18, "USDY should have accrued above $1");
        uint256 expected = ((1_000e18 * price) / 1e18) * 1e6 / 1e18; // mirror adapter math, in 6-dec
        assertEq(adapter.totalAssetsFor(controller), expected);

        // sanity band: ~1000 USDY @ ~$1.13 -> ~1130 USDC-equivalent
        assertGt(adapter.totalAssetsFor(controller), 1_050e6);
        assertLt(adapter.totalAssetsFor(controller), 1_300e6);
    }

    /// USDC in/out is not possible on Mantle -> the adapter rejects it (hold-only custody).
    function test_realOndo_usdcConversionUnavailable() public {
        vm.prank(controller);
        vm.expectRevert(OndoUsdyAdapter.ConversionUnavailable.selector);
        adapter.deposit(1_000e6);

        vm.prank(controller);
        vm.expectRevert(OndoUsdyAdapter.ConversionUnavailable.selector);
        adapter.withdraw(1_000e6, controller);

        // controller must never route user withdrawals here
        assertEq(adapter.instantLiquidityFor(controller), 0);
    }
}
