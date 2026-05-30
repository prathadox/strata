// SPDX-License-Identifier: MIT
pragma solidity 0.8.24;

import {BaseYieldAdapter} from "./BaseYieldAdapter.sol";
import {IChainlinkFeed} from "../external/IChainlinkFeed.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {SafeERC20} from "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

/// @notice Holds Mantle mETH (an ETH-denominated LST, 18 dec) and reports its value in USDC terms
///         (6 dec) via Chainlink's "Calculated mETH/USD" feed.
///
/// @dev    **FX-LABELED.** mETH's USD value moves with ETH/USD, so this is *not* a stable position —
///         it belongs in Junior (or Mezz with an explicit FX label) so the tranche layer can cap/hedge.
///         There is no viable on-chain USDC<->mETH route at size on Mantle (~$2k DEX depth), so this is
///         hold-only: `deposit(usdc)`/`withdraw` revert; the operator funds/defunds mETH out-of-band via
///         owner-only `depositMeth`/`withdrawMeth`. Valuation is guarded for stale / non-positive prices.
contract MethAdapter is BaseYieldAdapter {
    using SafeERC20 for IERC20;

    error ConversionUnavailable();
    error StalePrice();
    error BadPrice();

    IERC20 public immutable meth;
    IChainlinkFeed public immutable methUsdFeed;

    uint256 public maxPriceAge; // seconds; reverts valuation if the feed is older than this

    uint256 internal constant METH_DECIMALS = 1e18;
    uint256 internal constant USDC_DECIMALS = 1e6;

    event MethDeposited(uint256 amount);
    event MethWithdrawn(uint256 amount, address indexed to);
    event MaxPriceAgeUpdated(uint256 maxPriceAge);

    constructor(address usdc, address owner_, address meth_, address methUsdFeed_, uint256 maxPriceAge_)
        BaseYieldAdapter(usdc, owner_)
    {
        meth = IERC20(meth_);
        methUsdFeed = IChainlinkFeed(methUsdFeed_);
        maxPriceAge = maxPriceAge_;
    }

    function setMaxPriceAge(uint256 maxPriceAge_) external onlyOwner {
        maxPriceAge = maxPriceAge_;
        emit MaxPriceAgeUpdated(maxPriceAge_);
    }

    /// @dev No on-chain USDC->mETH conversion at size on Mantle.
    function deposit(uint256) external pure override {
        revert ConversionUnavailable();
    }

    function withdraw(uint256, address) external pure override {
        revert ConversionUnavailable();
    }

    /// @notice operator funds the adapter with mETH (sourced off-Mantle / out-of-band).
    function depositMeth(uint256 amount) external onlyOwner {
        meth.safeTransferFrom(msg.sender, address(this), amount);
        emit MethDeposited(amount);
    }

    function withdrawMeth(uint256 amount, address to) external onlyOwner {
        meth.safeTransfer(to, amount);
        emit MethWithdrawn(amount, to);
    }

    /// @dev USD value of held mETH in 6-dec USDC. The feed is 18-dec USD per mETH; mETH is 18-dec.
    ///      value6 = methBal(18) * price(18) / 1e30.
    function totalAssetsFor(address) external view override returns (uint256) {
        uint256 price = _price();
        uint256 bal = meth.balanceOf(address(this));
        return (bal * price) / (METH_DECIMALS * METH_DECIMALS / USDC_DECIMALS);
    }

    /// @dev no synchronous USDC liquidity; Controller must never route user USDC withdrawals here.
    function instantLiquidityFor(address) external pure override returns (uint256) {
        return 0;
    }

    function _price() internal view returns (uint256) {
        (, int256 answer,, uint256 updatedAt,) = methUsdFeed.latestRoundData();
        if (answer <= 0) revert BadPrice();
        if (block.timestamp - updatedAt > maxPriceAge) revert StalePrice();
        return uint256(answer);
    }
}
