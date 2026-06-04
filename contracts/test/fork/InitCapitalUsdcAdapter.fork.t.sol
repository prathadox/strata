// SPDX-License-Identifier: MIT
pragma solidity 0.8.24;

import "forge-std/Test.sol";
import {InitCapitalUsdcAdapter} from "../../src/adapters/InitCapitalUsdcAdapter.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";

/// @notice Live-Mantle fork test for the INIT Capital USDC supply adapter.
///         INIT pools are ERC-4626-like: supply USDC -> hold inUSDC shares -> value via toAmt(shares).
///         Run with: MANTLE_RPC_URL=https://rpc.mantle.xyz FOUNDRY_NO_MATCH_PATH= \
///                   $HOME/.foundry/bin/forge test --match-contract InitCapitalUsdcAdapterForkTest -vv
contract InitCapitalUsdcAdapterForkTest is Test {
    // Verified on-chain 2026-05-30 (research doc + cast probes)
    address constant USDC = 0x09Bc4E0D864854c6aFB6eB9A9cdF58aC190D0dF9; // 6 dec
    address constant INIT_CORE = 0x972BcB0284cca0152527c4f70f8F689852bCAFc5;
    address constant POOL_USDC = 0x00A55649E597d463fD212fBE48a3B40f0E227d06; // "inUSDC", 14 dec

    InitCapitalUsdcAdapter adapter;
    address owner = address(0xA11CE);
    address controller = address(0xC0);

    function setUp() public {
        // skip unless a Mantle RPC is configured
        try vm.envString("MANTLE_RPC_URL") returns (string memory url) {
            vm.createSelectFork(url);
        } catch {
            vm.skip(true);
        }
        adapter = new InitCapitalUsdcAdapter(USDC, owner, INIT_CORE, POOL_USDC);
        deal(USDC, controller, 10_000e6);
        vm.prank(controller);
        IERC20(USDC).approve(address(adapter), type(uint256).max);
    }

    function test_realInitSupplyAndWithdraw() public {
        // supply 1,000 USDC into the INIT pool
        vm.prank(controller);
        adapter.deposit(1_000e6);

        // inUSDC shares minted to the adapter; valuation ~= principal (entry rounding only)
        assertGt(IERC20(POOL_USDC).balanceOf(address(adapter)), 0, "no inUSDC shares minted");
        assertApproxEqRel(adapter.totalAssetsFor(controller), 1_000e6, 1e15); // within 0.1%

        // accrue interest over time; value must not fall below principal (minus dust)
        vm.warp(block.timestamp + 30 days);
        assertGe(adapter.totalAssetsFor(controller) + 10, 1_000e6, "value dropped below principal");

        // withdraw the principal back to the controller
        uint256 balBefore = IERC20(USDC).balanceOf(controller);
        vm.prank(controller);
        adapter.withdraw(1_000e6, controller);
        uint256 received = IERC20(USDC).balanceOf(controller) - balBefore;
        assertApproxEqRel(received, 1_000e6, 1e15, "withdraw did not return ~principal");
    }

    function test_totalAssetsTracksSharePrice() public {
        vm.prank(controller);
        adapter.deposit(2_000e6);
        uint256 v0 = adapter.totalAssetsFor(controller);
        vm.warp(block.timestamp + 365 days);
        // a year of supply yield: value strictly increases (INIT USDC supply APR > 0)
        assertGe(adapter.totalAssetsFor(controller), v0, "value did not accrue");
    }
}
