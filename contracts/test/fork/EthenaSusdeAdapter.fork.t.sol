// SPDX-License-Identifier: MIT
pragma solidity 0.8.24;

import "forge-std/Test.sol";
import {EthenaSusdeAdapter} from "../../src/adapters/EthenaSusdeAdapter.sol";
import {BaseYieldAdapter} from "../../src/adapters/BaseYieldAdapter.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";

/// @notice Live-Mantle fork test for the Ethena sUSDe swap adapter (capped, conservative peg valuation).
///         No native stake on Mantle -> deposit/withdraw are real Agni swaps (USDC<->USDe<->sUSDe).
///         Valuation = sUSDe * an owner-maintained sUSDe->USDe rate, USDe held to a $1 peg (no on-chain
///         price in the NAV path -> not flash-manipulable). The rate is seeded here from the live
///         sUSDe/USDe pool spot so the round-trip assertions are self-consistent.
///         Run: MANTLE_RPC_URL=https://rpc.mantle.xyz FOUNDRY_NO_MATCH_PATH= \
///              $HOME/.foundry/bin/forge test --match-contract EthenaSusdeAdapterForkTest -vv
contract EthenaSusdeAdapterForkTest is Test {
    // Verified on-chain 2026-05-30
    address constant USDC = 0x09Bc4E0D864854c6aFB6eB9A9cdF58aC190D0dF9; // 6 dec
    address constant USDE = 0x5d3a1Ff2b6BAb83b63cd9AD0787074081a52ef34; // 18 dec
    address constant SUSDE = 0x211Cc4DD073734dA055fbF44a2b4667d5E5fE5d2; // 18 dec
    address constant ROUTER = 0x319B69888b0d11cEC22caA5034e25FfFBDc88421; // Agni SwapRouter (V3 style)
    address constant POOL_USDC_USDE = 0xBCf99c834E65E8a58090E20eDc058279317865BD; // fee 100 (0.01%)
    address constant POOL_SUSDE_USDE = 0x07277F7c1567b5324aA50a3d2F1F003E2287fBfc; // fee 500 (0.05%); token0=sUSDe, token1=USDe
    uint24 constant FEE_USDC_USDE = 100;
    uint24 constant FEE_USDE_SUSDE = 500;

    EthenaSusdeAdapter adapter;
    address owner = address(0xA11CE);
    address controller = address(0xC0);

    // Conservative sUSDe->USDe rate (1e18), read once from the live Agni sUSDe/USDe pool spot via cast
    // (sqrtPriceX96^2 >> 192, both tokens 18-dec). Passed as a literal so the test doesn't depend on
    // decoding Agni's non-standard slot0 (its feeProtocol is uint32, not the vanilla uint8). The operator
    // maintains this rate on the live contract as Ethena's index accrues; it is always >= 1e18.
    uint256 constant SUSDE_USDE_RATE = 1232629081726051886; // ~1.2326 USDe per sUSDe (2026-05-30)

    function setUp() public {
        try vm.envString("MANTLE_RPC_URL") returns (string memory url) {
            vm.createSelectFork(url);
        } catch {
            vm.skip(true);
        }
        adapter = new EthenaSusdeAdapter(
            USDC, owner, USDE, SUSDE, ROUTER, FEE_USDC_USDE, FEE_USDE_SUSDE, SUSDE_USDE_RATE
        );
        deal(USDC, controller, 50_000e6);
        vm.prank(controller);
        IERC20(USDC).approve(address(adapter), type(uint256).max);
    }

    function test_depositSwapsToSusdeAndValues() public {
        vm.prank(controller);
        adapter.deposit(1_000e6);

        // real sUSDe now held by the adapter
        assertGt(IERC20(SUSDE).balanceOf(address(adapter)), 0, "no sUSDe held after deposit");
        // value within ~1% of input (only the deposit-direction swap fees + tiny impact applied)
        assertApproxEqRel(adapter.totalAssetsFor(controller), 1_000e6, 1e16, "value off vs input");
    }

    function test_withdrawReturnsUsdc() public {
        vm.prank(controller);
        adapter.deposit(1_000e6);
        uint256 value = adapter.totalAssetsFor(controller);

        uint256 before = IERC20(USDC).balanceOf(controller);
        // request slightly more than value so the adapter sells its full sUSDe position back to USDC
        vm.prank(controller);
        adapter.withdraw(value + 10e6, controller);
        uint256 received = IERC20(USDC).balanceOf(controller) - before;

        // full round-trip back to USDC: within ~2% of the marked value (round-trip fees + impact)
        assertApproxEqRel(received, value, 2e16, "withdraw did not return ~value in USDC");
        assertLt(IERC20(SUSDE).balanceOf(address(adapter)), 1e12, "sUSDe dust should be ~0 after full exit");
    }

    function test_setRate_bounds() public {
        vm.startPrank(owner);
        // floor: sUSDe is never worth less than 1 USDe
        vm.expectRevert(EthenaSusdeAdapter.RateOutOfBounds.selector);
        adapter.setSusdeUsdeRate(1e18 - 1);
        // ceiling: fat-finger guard
        vm.expectRevert(EthenaSusdeAdapter.RateOutOfBounds.selector);
        adapter.setSusdeUsdeRate(2e18 + 1);
        // in-range ok
        adapter.setSusdeUsdeRate(125e16);
        assertEq(adapter.susdeUsdeRate(), 125e16);
        vm.stopPrank();
    }

    function test_depositCapEnforced() public {
        vm.prank(owner);
        adapter.setCap(500e6); // value cap below the 1000 deposit
        vm.prank(controller);
        vm.expectRevert(BaseYieldAdapter.CapExceeded.selector);
        adapter.deposit(1_000e6);
    }
}
