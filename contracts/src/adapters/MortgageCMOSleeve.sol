// SPDX-License-Identifier: MIT
pragma solidity 0.8.24;

import {BaseYieldAdapter} from "./BaseYieldAdapter.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {SafeERC20} from "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

/// @notice DEMO-MODE simulated CMO (collateralized mortgage obligation) sleeve for the Junior tranche.
///         It models a mortgage pool's cashflows with two defining dynamics:
///           1. WAC coupon — interest accrues on the OUTSTANDING balance (annual `wacBps`);
///           2. CPR prepayment — a conditional prepayment rate (`cprBps`) converts locked principal
///              into liquid cashflow over time, shrinking the interest-earning base so yield
///              decelerates (the core prepayment/reinvestment risk of a real CMO).
///         Simulated coupon interest is funded from a seeded USDC reserve, so reported value is
///         always fully USDC-backed. `applyDefault` writes down principal to exercise the Junior
///         tranche's first-loss position in the controller waterfall.
///
///         NOT backed by real mortgages — this is the honest bridge to a v2 integration with
///         Centrifuge / Maple / Figure. A flat CPR approximates a PSA curve's steady state;
///         `setPrepaymentSpeed` lets the speed be stress-tested live.
contract MortgageCMOSleeve is BaseYieldAdapter {
    using SafeERC20 for IERC20;

    error Illiquid();

    bool    public constant DEMO_MODE = true;
    uint16  internal constant BPS = 10_000;
    uint256 internal constant YEAR = 365 days;

    uint16  public wacBps;                // weighted-average coupon (annual)
    uint16  public cprBps;                // conditional prepayment rate (annual)
    uint256 public principalOutstanding;  // locked in mortgages; earns interest; falls on prepay/default
    uint256 public cashReceived;          // prepaid principal + paid interest; liquid/withdrawable
    uint64  public lastAccrual;

    event ReserveSeeded(uint256 amount);
    event PrepaymentSpeedSet(uint16 cprBps);
    event DefaultApplied(uint256 amount, uint256 principalOutstanding);
    event Accrued(uint256 interest, uint256 prepaid, uint256 principalOutstanding);

    constructor(address usdc, address owner_, uint16 wacBps_, uint16 cprBps_) BaseYieldAdapter(usdc, owner_) {
        wacBps = wacBps_;
        cprBps = cprBps_;
        lastAccrual = uint64(block.timestamp);
    }

    function setPrepaymentSpeed(uint16 cprBps_) external onlyOwner {
        _accrue();
        cprBps = cprBps_;
        emit PrepaymentSpeedSet(cprBps_);
    }

    /// @notice Operator seeds the USDC that funds simulated coupon interest (demo).
    function seedReserve(uint256 amount) external onlyOwner {
        IERC20(asset()).safeTransferFrom(msg.sender, address(this), amount);
        emit ReserveSeeded(amount);
    }

    /// @notice DEMO: write down outstanding principal to simulate mortgage defaults — the loss the
    ///         Junior tranche absorbs first in the controller's waterfall.
    function applyDefault(uint256 amount) external onlyOwner {
        _accrue();
        uint256 d = amount < principalOutstanding ? amount : principalOutstanding;
        principalOutstanding -= d;
        emit DefaultApplied(d, principalOutstanding);
    }

    function accrue() external {
        _accrue();
    }

    function _pending() internal view returns (uint256 interest, uint256 prepaid) {
        uint256 dt = block.timestamp - lastAccrual;
        if (dt == 0 || principalOutstanding == 0) return (0, 0);
        interest = (principalOutstanding * wacBps * dt) / (uint256(BPS) * YEAR);
        prepaid  = (principalOutstanding * cprBps * dt) / (uint256(BPS) * YEAR);
        if (prepaid > principalOutstanding) prepaid = principalOutstanding;
    }

    /// @dev USDC held beyond what already backs principal + received cashflow — i.e. the seeded
    ///      reserve still available to back simulated coupon. Guarantees the invariant
    ///      `principalOutstanding + cashReceived <= USDC balance`, so NAV is always fully backed.
    function _freeReserve() internal view returns (uint256) {
        uint256 bal = IERC20(asset()).balanceOf(address(this));
        uint256 claimed = principalOutstanding + cashReceived;
        return bal > claimed ? bal - claimed : 0;
    }

    function _accrue() internal {
        (uint256 interest, uint256 prepaid) = _pending();
        // Simulated coupon is only recognized to the extent a seeded USDC reserve backs it;
        // unbacked interest is dropped rather than inflating NAV with value it cannot pay.
        uint256 backed = _freeReserve();
        if (interest > backed) interest = backed;
        if (interest > 0 || prepaid > 0) {
            principalOutstanding -= prepaid;
            cashReceived += interest + prepaid;
            emit Accrued(interest, prepaid, principalOutstanding);
        }
        lastAccrual = uint64(block.timestamp);
    }

    // ── IYieldAdapter ────────────────────────────────────────────────────
    function deposit(uint256 amount) external override whenNotPaused {
        _checkCap(amount);
        _accrue();
        IERC20(asset()).safeTransferFrom(msg.sender, address(this), amount);
        principalOutstanding += amount;
    }

    function withdraw(uint256 amount, address receiver) external override {
        _accrue();
        if (amount > cashReceived) revert Illiquid(); // only received cashflow is liquid
        cashReceived -= amount;
        IERC20(asset()).safeTransfer(receiver, amount);
    }

    /// @dev model value = outstanding principal + received cashflow + pending (unrealized) interest,
    ///      where pending interest is capped at the seeded reserve so NAV never exceeds USDC backing.
    function totalAssetsFor(address) external view override returns (uint256) {
        (uint256 interest, ) = _pending();
        uint256 backed = _freeReserve();
        if (interest > backed) interest = backed;
        return principalOutstanding + cashReceived + interest;
    }

    /// @dev only received cashflow is liquid; outstanding principal is locked in the pool.
    function instantLiquidityFor(address) external view override returns (uint256) {
        (uint256 interest, uint256 prepaid) = _pending();
        uint256 liquid = cashReceived + interest + prepaid;
        uint256 bal = IERC20(asset()).balanceOf(address(this));
        return liquid < bal ? liquid : bal;
    }
}
