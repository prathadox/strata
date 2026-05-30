// SPDX-License-Identifier: MIT
pragma solidity 0.8.24;

import "forge-std/Test.sol";
import {MethAdapter} from "../../src/adapters/MethAdapter.sol";
import {IChainlinkFeed} from "../../src/external/IChainlinkFeed.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";

/// @notice Live-Mantle fork test for the FX-labeled mETH hold+oracle adapter.
///         mETH is an ETH-denominated LST; USD value moves with ETH/USD (FX risk) -> Junior/Mezz only.
///         USDC<->mETH has no viable on-chain route at size (~$2k DEX depth), so this is hold-only:
///         the operator funds mETH out-of-band; valuation is via the Chainlink Calculated mETH/USD feed.
///         Run: MANTLE_RPC_URL=https://rpc.mantle.xyz FOUNDRY_NO_MATCH_PATH= \
///              $HOME/.foundry/bin/forge test --match-contract MethAdapterForkTest -vv
contract MethAdapterForkTest is Test {
    // Verified on-chain 2026-05-30 (research doc + cast probes)
    address constant USDC = 0x09Bc4E0D864854c6aFB6eB9A9cdF58aC190D0dF9; // 6 dec
    address constant METH = 0xcDA86A272531e8640cD7F1a92c01839911B90bb0; // 18 dec (Mantle mETH)
    address constant FEED_METH_USD = 0xB16FcAFB8378baA0a69142a325878FDCad58606A; // "Calculated mETH/USD", 18 dec

    MethAdapter adapter;
    address owner = address(0xA11CE);
    address controller = address(0xC0);

    function setUp() public {
        try vm.envString("MANTLE_RPC_URL") returns (string memory url) {
            vm.createSelectFork(url);
        } catch {
            vm.skip(true);
        }
        // generous staleness window so the test isn't flaky against the live feed's heartbeat
        adapter = new MethAdapter(USDC, owner, METH, FEED_METH_USD, 30 days);
    }

    function test_valuesMethViaChainlinkFeed() public {
        // operator funds 1 mETH
        deal(METH, owner, 1e18);
        vm.startPrank(owner);
        IERC20(METH).approve(address(adapter), type(uint256).max);
        adapter.depositMeth(1e18);
        vm.stopPrank();

        // expected USDC value = 1 mETH * price(18-dec USD) -> 6-dec USDC
        (, int256 price,,,) = IChainlinkFeed(FEED_METH_USD).latestRoundData();
        uint256 expected6 = (1e18 * uint256(price)) / 1e30;
        assertGt(expected6, 1_000e6, "sanity: mETH should be worth >$1000");
        assertApproxEqAbs(adapter.totalAssetsFor(controller), expected6, 1, "valuation mismatch vs live feed");
    }

    function test_usdcDepositReverts() public {
        vm.expectRevert(MethAdapter.ConversionUnavailable.selector);
        adapter.deposit(1_000e6);
    }

    function test_stalePriceReverts() public {
        deal(METH, owner, 1e18);
        vm.startPrank(owner);
        IERC20(METH).approve(address(adapter), type(uint256).max);
        adapter.depositMeth(1e18);
        // tighten the staleness window to 1h, then warp far past the feed's last update
        adapter.setMaxPriceAge(1 hours);
        vm.stopPrank();
        vm.warp(block.timestamp + 365 days);
        vm.expectRevert(MethAdapter.StalePrice.selector);
        adapter.totalAssetsFor(controller);
    }
}
