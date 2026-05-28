// SPDX-License-Identifier: MIT
pragma solidity 0.8.24;

import {BaseYieldAdapter} from "./BaseYieldAdapter.sol";
import {IAaveV3Pool} from "../external/IAaveV3Pool.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {SafeERC20} from "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

/// @notice Lendle is an Aave V3 fork on Mantle; identical Pool interface, distinct deployment.
contract LendleUsdcAdapter is BaseYieldAdapter {
    using SafeERC20 for IERC20;

    IAaveV3Pool public immutable pool;
    IERC20 public immutable lToken;

    constructor(address usdc, address owner_, address pool_, address lToken_) BaseYieldAdapter(usdc, owner_) {
        pool = IAaveV3Pool(pool_);
        lToken = IERC20(lToken_);
    }

    function deposit(uint256 amount) external override whenNotPaused {
        _checkCap(amount);
        IERC20(asset()).safeTransferFrom(msg.sender, address(this), amount);
        IERC20(asset()).forceApprove(address(pool), amount);
        pool.supply(asset(), amount, address(this), 0);
    }

    function withdraw(uint256 amount, address receiver) external override {
        pool.withdraw(asset(), amount, receiver);
    }

    function totalAssetsFor(address) external view override returns (uint256) {
        return lToken.balanceOf(address(this));
    }

    function instantLiquidityFor(address) external view override returns (uint256) {
        return lToken.balanceOf(address(this));
    }
}
