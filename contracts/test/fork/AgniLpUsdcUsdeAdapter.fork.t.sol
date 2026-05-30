// SPDX-License-Identifier: MIT
pragma solidity 0.8.24;

import "forge-std/Test.sol";
import {AgniLpUsdcUsdeAdapter} from "../../src/adapters/AgniLpUsdcUsdeAdapter.sol";
import {BaseYieldAdapter} from "../../src/adapters/BaseYieldAdapter.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";

/// @notice Live-Mantle fork test for the Agni USDC/USDe LP adapter (operator-assisted, peg-clamped NAV).
///         deposit: swap half USDC->USDe, mint a full-range Agni V3 NFT LP held by the adapter.
///         withdraw: remove liquidity, collect, swap USDe leg back to USDC.
///         NAV = deployed USDC cost basis + idle USDC + idle USDe at the $1 peg (not pool-spot, not IL-marked).
///         Run: MANTLE_RPC_URL=https://rpc.mantle.xyz FOUNDRY_NO_MATCH_PATH= \
///              $HOME/.foundry/bin/forge test --match-contract AgniLpUsdcUsdeAdapterForkTest -vv
contract AgniLpUsdcUsdeAdapterForkTest is Test {
    // Verified on-chain 2026-05-30
    address constant USDC = 0x09Bc4E0D864854c6aFB6eB9A9cdF58aC190D0dF9; // 6 dec, token0
    address constant USDE = 0x5d3a1Ff2b6BAb83b63cd9AD0787074081a52ef34; // 18 dec, token1
    address constant POOL = 0xBCf99c834E65E8a58090E20eDc058279317865BD; // fee 100, tickSpacing 1, only USDC/USDe pool
    address constant POSITION_MANAGER = 0x218bf598D1453383e2F4AA7b14fFB9BfB102D637;
    address constant ROUTER = 0x319B69888b0d11cEC22caA5034e25FfFBDc88421;

    AgniLpUsdcUsdeAdapter adapter;
    address owner = address(0xA11CE);
    address controller = address(0xC0);

    function setUp() public {
        try vm.envString("MANTLE_RPC_URL") returns (string memory url) {
            vm.createSelectFork(url);
        } catch {
            vm.skip(true);
        }
        adapter = new AgniLpUsdcUsdeAdapter(USDC, owner, POOL, POSITION_MANAGER, ROUTER);
        deal(USDC, controller, 50_000e6);
        vm.prank(controller);
        IERC20(USDC).approve(address(adapter), type(uint256).max);
    }

    function test_poolImmutablesDecoded() public view {
        assertTrue(adapter.usdcIsToken0(), "USDC should be token0");
        assertEq(adapter.poolFee(), 100, "fee should be 100");
        assertEq(adapter.tickLower(), -887272, "full-range lower (spacing 1)");
        assertEq(adapter.tickUpper(), 887272, "full-range upper (spacing 1)");
    }

    function test_depositMintsLpAndValues() public {
        vm.prank(controller);
        adapter.deposit(1_000e6);

        // an NFT position now exists
        assertGt(adapter.tokenId(), 0, "no LP NFT minted");
        assertGt(adapter.deployedCostBasisUSDC(), 0, "no cost basis recorded");
        // NAV within ~2% of input (half-swap fee on the USDe leg + tiny leftover dust)
        assertApproxEqRel(adapter.totalAssetsFor(controller), 1_000e6, 2e16, "NAV off vs input");
    }

    function test_secondDepositIncreasesLiquidity() public {
        vm.startPrank(controller);
        adapter.deposit(1_000e6);
        uint256 id1 = adapter.tokenId();
        adapter.deposit(1_000e6);
        vm.stopPrank();
        assertEq(adapter.tokenId(), id1, "tokenId should be reused (increaseLiquidity)");
        assertApproxEqRel(adapter.totalAssetsFor(controller), 2_000e6, 2e16, "NAV off after 2nd deposit");
    }

    function test_withdrawReturnsUsdc() public {
        vm.prank(controller);
        adapter.deposit(2_000e6);
        uint256 value = adapter.totalAssetsFor(controller);

        uint256 before = IERC20(USDC).balanceOf(controller);
        vm.prank(controller);
        adapter.withdraw(1_000e6, controller);
        uint256 received = IERC20(USDC).balanceOf(controller) - before;

        // partial withdraw delivers close to the requested USDC (round-trip fees/impact)
        assertApproxEqRel(received, 1_000e6, 3e16, "withdraw did not return ~requested USDC");
        // remaining NAV roughly value - received
        assertApproxEqRel(adapter.totalAssetsFor(controller), value - received, 5e16, "residual NAV off");
    }

    function test_fullWithdraw() public {
        vm.prank(controller);
        adapter.deposit(1_000e6);

        uint256 before = IERC20(USDC).balanceOf(controller);
        vm.prank(controller);
        adapter.withdraw(2_000e6, controller); // request > value -> full exit
        uint256 received = IERC20(USDC).balanceOf(controller) - before;

        assertApproxEqRel(received, 1_000e6, 3e16, "full exit did not return ~deposit");
        assertLt(adapter.totalAssetsFor(controller), 20e6, "residual NAV should be ~dust after full exit");
    }

    function test_instantLiquidityIsIdleUsdcOnly() public {
        vm.prank(controller);
        adapter.deposit(1_000e6);
        // nearly all USDC went into the LP; idle USDC is ~0
        assertLt(adapter.instantLiquidityFor(controller), 50e6, "idle USDC should be small after deposit");
    }

    function test_depositCapEnforced() public {
        vm.prank(owner);
        adapter.setCap(500e6);
        vm.prank(controller);
        vm.expectRevert(BaseYieldAdapter.CapExceeded.selector);
        adapter.deposit(1_000e6);
    }
}
