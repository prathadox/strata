// SPDX-License-Identifier: MIT
pragma solidity 0.8.24;

import "forge-std/Test.sol";
import {AaveV3UsdcAdapter} from "../../src/adapters/AaveV3UsdcAdapter.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract AaveV3UsdcAdapterForkTest is Test {
    // Verified Integration Facts (spec appendix, 2026-05-30)
    address constant USDC = 0x09Bc4E0D864854c6aFB6eB9A9cdF58aC190D0dF9;
    address constant AAVE_POOL = 0x458F293454fE0d67EC0655f3672301301DD51422;
    address constant AUSDC = 0xcb8164415274515867ec43CbD284ab5d6d2b304F;

    AaveV3UsdcAdapter adapter;
    address owner = address(0xA11CE);
    address controller = address(0xC0);

    function setUp() public {
        // skip unless a Mantle RPC is configured
        try vm.envString("MANTLE_RPC_URL") returns (string memory url) {
            vm.createSelectFork(url);
        } catch {
            vm.skip(true);
        }
        adapter = new AaveV3UsdcAdapter(USDC, owner, AAVE_POOL, AUSDC);
        deal(USDC, controller, 1_000e6);
        vm.prank(controller);
        IERC20(USDC).approve(address(adapter), type(uint256).max);
    }

    function test_realAaveSupplyAndWithdraw() public {
        vm.prank(controller);
        adapter.deposit(1_000e6);
        // aUSDC minted ~1:1
        assertApproxEqAbs(adapter.totalAssetsFor(controller), 1_000e6, 2);

        // accrue a little interest
        vm.warp(block.timestamp + 30 days);
        assertGe(adapter.totalAssetsFor(controller), 1_000e6);

        // withdraw original principal back to controller
        vm.prank(controller);
        adapter.withdraw(1_000e6, controller);
        assertGe(IERC20(USDC).balanceOf(controller), 1_000e6);
    }
}
