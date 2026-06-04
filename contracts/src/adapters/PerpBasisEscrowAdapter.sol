// SPDX-License-Identifier: MIT
pragma solidity 0.8.24;

import {BaseYieldAdapter} from "./BaseYieldAdapter.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {SafeERC20} from "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

/// @notice Operator-driven escrow for a delta-neutral perp-basis position.
///
/// @dev    **NOT TRUSTLESS — operator-custodied.** Byreal Perps settles on Hyperliquid
///         (Solana/Privy custody); there is no Mantle contract to call, so the perp leg
///         cannot be valued on-chain. This adapter holds the *spot/margin leg* in USDC
///         escrow and exposes an operator-reported `reportedHedgeValue` (the off-chain
///         position's mark + funding-to-date, in 6-dec USDC, signed) that feeds NAV — a
///         trusted-oracle pattern, clearly flagged via `TRUSTLESS == false`.
///
///         The off-chain Operator agent runs the Byreal CLI and pushes signed value/funding
///         updates here, linking each report to the Sentinel→Operator hedge `signalId` so the
///         on-chain audit chain ("Sentinel observed X → Operator hedged Y → mark moved to Z")
///         stays intact alongside `AgentEventBus.emitHedgeSignal`/`logHedge`.
contract PerpBasisEscrowAdapter is BaseYieldAdapter {
    using SafeERC20 for IERC20;

    error NotOwnerOrOperator();

    /// @dev This adapter is operator-custodied, not trustless. Surfaced for the dashboard/tranche layer.
    bool public constant TRUSTLESS = false;

    /// @notice off-chain trading agent permitted to push hedge-value reports.
    address public operator;

    /// @notice net mark + funding-to-date of the off-chain perp leg, in 6-dec USDC (signed).
    int256 public reportedHedgeValue;
    /// @notice timestamp of the last operator report (for dashboard staleness display).
    uint64 public lastReportedAt;
    /// @notice hedge signalId of the last report (links to AgentEventBus.emitHedgeSignal).
    uint256 public lastSignalId;

    event OperatorUpdated(address indexed operator);
    event HedgeValueReported(address indexed reporter, uint256 indexed signalId, int256 value, uint256 timestamp);

    constructor(address usdc, address owner_, address operator_) BaseYieldAdapter(usdc, owner_) {
        operator = operator_;
    }

    modifier onlyOwnerOrOperator() {
        if (msg.sender != owner && msg.sender != operator) revert NotOwnerOrOperator();
        _;
    }

    function setOperator(address operator_) external onlyOwner {
        operator = operator_;
        emit OperatorUpdated(operator_);
    }

    /// @notice Controller escrows USDC (the spot/margin leg). The Operator moves it to the
    ///         off-chain venue out-of-band; on-chain it is held until reported back or withdrawn.
    function deposit(uint256 amount) external override whenNotPaused {
        _checkCap(amount);
        IERC20(asset()).safeTransferFrom(msg.sender, address(this), amount);
    }

    function withdraw(uint256 amount, address receiver) external override {
        IERC20(asset()).safeTransfer(receiver, amount);
    }

    /// @notice Operator (or owner) reports the off-chain perp leg's mark + funding, linked to a hedge signalId.
    /// @param value net value in 6-dec USDC (signed; negative = the hedge is underwater).
    /// @param signalId the AgentEventBus hedge signalId this fill/mark corresponds to.
    function reportHedgeValue(int256 value, uint256 signalId) external onlyOwnerOrOperator {
        reportedHedgeValue = value;
        lastReportedAt = uint64(block.timestamp);
        lastSignalId = signalId;
        emit HedgeValueReported(msg.sender, signalId, value, block.timestamp);
    }

    /// @dev NAV = escrowed spot leg (USDC held) + reported perp P&L, floored at zero.
    function totalAssetsFor(address) external view override returns (uint256) {
        int256 nav = int256(IERC20(asset()).balanceOf(address(this))) + reportedHedgeValue;
        return nav > 0 ? uint256(nav) : 0;
    }

    /// @dev Only the on-chain escrow is synchronously withdrawable; the off-chain perp leg is not.
    function instantLiquidityFor(address) external view override returns (uint256) {
        return IERC20(asset()).balanceOf(address(this));
    }
}
