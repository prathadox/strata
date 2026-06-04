// SPDX-License-Identifier: MIT
pragma solidity 0.8.24;

import {BaseYieldAdapter} from "./BaseYieldAdapter.sol";
import {IAaveV3Pool} from "../external/IAaveV3Pool.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {SafeERC20} from "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

/// @notice Supplies USDC to an Aave V3 Pool; aToken balance == position value (rebases up with interest).
contract AaveV3UsdcAdapter is BaseYieldAdapter {
    using SafeERC20 for IERC20;

    IAaveV3Pool public immutable pool;
    IERC20 public immutable aToken;

    constructor(address usdc, address owner_, address pool_, address aToken_) BaseYieldAdapter(usdc, owner_) {
        pool = IAaveV3Pool(pool_);
        aToken = IERC20(aToken_);
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

    /// @dev aToken is 1:1 with the underlying and rebases up; balance is the live position value.
    function totalAssetsFor(address) external view override returns (uint256) {
        return aToken.balanceOf(address(this));
    }

    function instantLiquidityFor(address) external view override returns (uint256) {
        // Aave USDC supply is withdrawable on demand up to available pool liquidity.
        return aToken.balanceOf(address(this));
    }
}
