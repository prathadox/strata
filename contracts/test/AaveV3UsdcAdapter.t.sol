// SPDX-License-Identifier: MIT
pragma solidity 0.8.24;

import "forge-std/Test.sol";
import {AaveV3UsdcAdapter} from "../src/adapters/AaveV3UsdcAdapter.sol";
import {IAaveV3Pool} from "../src/external/IAaveV3Pool.sol";
import {MockUSDC} from "./mocks/MockUSDC.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";

// Mock Aave Pool: mints an aToken 1:1 on supply, burns on withdraw. aToken == a second MockUSDC.
contract MockAavePool is IAaveV3Pool {
    MockUSDC public usdc;
    MockUSDC public aToken;
    constructor(MockUSDC _usdc, MockUSDC _a) { usdc = _usdc; aToken = _a; }
    function supply(address, uint256 amount, address onBehalfOf, uint16) external {
        usdc.transferFrom(msg.sender, address(this), amount);
        aToken.mint(onBehalfOf, amount);
    }
    function withdraw(address, uint256 amount, address to) external returns (uint256) {
        aToken.burn(msg.sender, amount);
        usdc.transfer(to, amount);
        return amount;
    }
    function getReserveData(address) external view returns (
        uint256,uint128,uint128,uint128,uint128,uint128,uint40,uint16,address,address,address,address,uint128,uint128,uint128
    ) {
        return (0,0,0,0,0,0,0,0,address(aToken),address(0),address(0),address(0),0,0,0);
    }
}

contract AaveV3UsdcAdapterTest is Test {
    MockUSDC usdc;
    MockUSDC aUsdc;
    MockAavePool pool;
    AaveV3UsdcAdapter adapter;
    address owner = address(0xA11CE);
    address controller = address(0xC0);

    function setUp() public {
        usdc = new MockUSDC();
        aUsdc = new MockUSDC();
        pool = new MockAavePool(usdc, aUsdc);
        adapter = new AaveV3UsdcAdapter(address(usdc), owner, address(pool), address(aUsdc));
        usdc.mint(controller, 10_000e6);
        vm.prank(controller);
        usdc.approve(address(adapter), type(uint256).max);
    }

    function test_deposit_suppliesToPool() public {
        vm.prank(controller);
        adapter.deposit(1_000e6);
        assertEq(adapter.totalAssetsFor(controller), 1_000e6);
        assertEq(aUsdc.balanceOf(address(adapter)), 1_000e6);
    }

    function test_withdraw_redeemsFromPool() public {
        vm.prank(controller);
        adapter.deposit(1_000e6);
        vm.prank(controller);
        adapter.withdraw(400e6, controller);
        assertEq(usdc.balanceOf(controller), 9_000e6 + 400e6);
        assertEq(adapter.totalAssetsFor(controller), 600e6);
    }

    function test_instantLiquidity_equalsAtokenBalance() public {
        vm.prank(controller);
        adapter.deposit(1_000e6);
        assertEq(adapter.instantLiquidityFor(controller), 1_000e6);
    }
}
