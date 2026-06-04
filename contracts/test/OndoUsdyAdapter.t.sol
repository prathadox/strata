// SPDX-License-Identifier: MIT
pragma solidity 0.8.24;

import "forge-std/Test.sol";
import {OndoUsdyAdapter} from "../src/adapters/OndoUsdyAdapter.sol";
import {IRWADynamicOracle} from "../src/external/IRWADynamicOracle.sol";
import {MockUSDC} from "./mocks/MockUSDC.sol";
import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract MockUSDY is ERC20 {
    constructor() ERC20("Ondo USD Yield", "USDY") {}
    function mint(address to, uint256 amt) external { _mint(to, amt); }
}

contract MockOracle is IRWADynamicOracle {
    uint256 public price = 1.05e18; // 1 USDY = $1.05
    function setPrice(uint256 p) external { price = p; }
    function getPrice() external view returns (uint256) { return price; }
}

contract OndoUsdyAdapterTest is Test {
    MockUSDC usdc;
    MockUSDY usdy;
    MockOracle oracle;
    OndoUsdyAdapter adapter;
    address owner = address(0xA11CE);
    address controller = address(0xC0);

    function setUp() public {
        usdc = new MockUSDC();
        usdy = new MockUSDY();
        oracle = new MockOracle();
        adapter = new OndoUsdyAdapter(address(usdc), owner, address(usdy), address(oracle));
    }

    function test_usdcDepositReverts() public {
        vm.prank(controller);
        vm.expectRevert(OndoUsdyAdapter.ConversionUnavailable.selector);
        adapter.deposit(1_000e6);
    }

    function test_depositUsdy_ownerFundsRWA() public {
        usdy.mint(owner, 1_000e18);
        vm.startPrank(owner);
        usdy.approve(address(adapter), type(uint256).max);
        adapter.depositUsdy(1_000e18);
        vm.stopPrank();
        // 1000 USDY * $1.05 = $1050, reported as 1050e6 USDC-equivalent (6 decimals)
        assertApproxEqAbs(adapter.totalAssetsFor(controller), 1_050e6, 1);
    }

    function test_valueTracksOraclePrice() public {
        usdy.mint(owner, 1_000e18);
        vm.startPrank(owner);
        usdy.approve(address(adapter), type(uint256).max);
        adapter.depositUsdy(1_000e18);
        vm.stopPrank();
        oracle.setPrice(1.10e18);
        assertApproxEqAbs(adapter.totalAssetsFor(controller), 1_100e6, 1);
    }

    function test_instantLiquidityIsZero() public view {
        // no on-chain USDC liquidity; controller must not route user withdrawals here
        assertEq(adapter.instantLiquidityFor(controller), 0);
    }
}
