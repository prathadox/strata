// SPDX-License-Identifier: MIT
pragma solidity 0.8.24;

import {IAgentEventBus} from "./interfaces/IAgentEventBus.sol";
import {IYieldAdapter} from "./interfaces/IYieldAdapter.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {SafeERC20} from "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

contract TrancheController {
    using SafeERC20 for IERC20;

    enum Tranche { Senior, Mezzanine, Junior }

    struct AdapterTarget { address adapter; uint16 bps; }

    /// @notice Per-tranche execution autonomy. Autonomous = a cleared Sentinel verdict is sufficient.
    ///         Multisig = an allocation that deploys more than `threshold` USDC for this tranche also
    ///         requires the tranche `approver` to confirm the proposal first (a human/multisig in the
    ///         loop). This is the Surface-1 autonomy spectrum: Senior users can opt into oversight for
    ///         large rebalances; Junior users get pure autonomy.
    enum AutonomyMode { Autonomous, Multisig }

    struct Autonomy {
        AutonomyMode mode;
        address approver;  // who may confirm large moves (only meaningful in Multisig mode)
        uint256 threshold; // deploys with total > threshold require confirmation (Multisig mode)
    }

    error NotOwner();
    error NotExecutor();
    error NotVault();
    error UnknownAdapter();
    error AdapterInUse();
    error VaultAlreadySet();
    error InsufficientLiquidity();
    error ProposalNotApproved();
    error ProposalStale();
    error AllocationBpsInvalid();
    error NotApprover();
    error MultisigApprovalRequired();

    uint16 internal constant BPS = 10_000;

    IAgentEventBus public immutable bus;
    IERC20 public immutable underlying;

    address public owner;
    address public executor;

    mapping(Tranche => address) public vaultOf;
    mapping(Tranche => uint256) public trancheNAV;

    address[] public adapters;
    mapping(address => bool) public isAdapter;

    uint16 public seniorTargetBps;
    uint16 public mezzTargetBps;
    uint16 public bufferBps = 300;
    uint64 public lastHarvestTs;
    uint64 public proposalTTL = 24 hours;

    // per-tranche autonomy config (default: Autonomous, no approver, zero threshold)
    mapping(Tranche => Autonomy) public autonomyOf;
    // multisig confirmation: tranche => proposalId => confirmed (consumed on execute)
    mapping(Tranche => mapping(uint256 => bool)) public multisigConfirmed;

    event VaultSet(Tranche indexed tranche, address vault);
    event AdapterAdded(address indexed adapter);
    event AdapterRemoved(address indexed adapter);
    event TargetsSet(uint16 seniorTargetBps, uint16 mezzTargetBps);
    event Deposited(Tranche indexed tranche, uint256 amount);
    event Withdrawn(Tranche indexed tranche, uint256 amount, address indexed receiver);
    event TrancheAutonomySet(Tranche indexed tranche, AutonomyMode mode, address approver, uint256 threshold);
    event AllocationConfirmed(Tranche indexed tranche, uint256 indexed proposalId, address indexed approver);
    /// @notice One per allocation: ties the on-chain execution to its Architect proposal and records
    ///         the USDC actually deployed per tranche, so the Transparency Dashboard can trace
    ///         proposal -> verdict -> execution end-to-end ("every execution is an on-chain event").
    event AllocationExecuted(
        uint256 indexed proposalId,
        address indexed executor,
        uint256 seniorDeployed,
        uint256 mezzDeployed,
        uint256 juniorDeployed
    );

    constructor(address bus_, address underlying_, address owner_, address executor_) {
        bus = IAgentEventBus(bus_);
        underlying = IERC20(underlying_);
        owner = owner_;
        executor = executor_;
        lastHarvestTs = uint64(block.timestamp);
    }

    modifier onlyOwner() { if (msg.sender != owner) revert NotOwner(); _; }
    modifier onlyExecutor() { if (msg.sender != executor) revert NotExecutor(); _; }
    modifier onlyVault(Tranche t) { if (msg.sender != vaultOf[t]) revert NotVault(); _; }

    // ── admin ────────────────────────────────────────────────────────────
    function setExecutor(address e) external onlyOwner { executor = e; }
    function setTrancheTargets(uint16 s, uint16 m) external onlyOwner {
        seniorTargetBps = s; mezzTargetBps = m; emit TargetsSet(s, m);
    }
    function setBufferBps(uint16 b) external onlyOwner { bufferBps = b; }
    function setProposalTTL(uint64 ttl) external onlyOwner { proposalTTL = ttl; }

    function setVault(Tranche t, address v) external onlyOwner {
        if (vaultOf[t] != address(0)) revert VaultAlreadySet();
        vaultOf[t] = v; emit VaultSet(t, v);
    }

    /// @notice Configure a tranche's execution autonomy. In Multisig mode, an allocation that deploys
    ///         more than `threshold` USDC for this tranche requires `approver` to confirm the proposal.
    function setTrancheAutonomy(Tranche tranche, AutonomyMode mode, address approver, uint256 threshold)
        external
        onlyOwner
    {
        autonomyOf[tranche] = Autonomy({mode: mode, approver: approver, threshold: threshold});
        emit TrancheAutonomySet(tranche, mode, approver, threshold);
    }

    /// @notice Approver confirms a specific (proposalId, tranche) allocation, satisfying the multisig gate.
    function confirmAllocation(uint256 proposalId, Tranche tranche) external {
        if (msg.sender != autonomyOf[tranche].approver) revert NotApprover();
        multisigConfirmed[tranche][proposalId] = true;
        emit AllocationConfirmed(tranche, proposalId, msg.sender);
    }

    function addAdapter(address a) external onlyOwner {
        if (!isAdapter[a]) { isAdapter[a] = true; adapters.push(a); emit AdapterAdded(a); }
    }

    function removeAdapter(address a) external onlyOwner {
        if (!isAdapter[a]) revert UnknownAdapter();
        if (IYieldAdapter(a).totalAssetsFor(address(this)) != 0) revert AdapterInUse();
        isAdapter[a] = false;
        uint256 n = adapters.length;
        for (uint256 i = 0; i < n; i++) {
            if (adapters[i] == a) { adapters[i] = adapters[n - 1]; adapters.pop(); break; }
        }
        emit AdapterRemoved(a);
    }

    // ── vault hooks ──────────────────────────────────────────────────────
    function notifyDeposit(Tranche t, uint256 amount) external onlyVault(t) {
        trancheNAV[t] += amount;
        emit Deposited(t, amount);
    }

    function notifyWithdraw(Tranche t, uint256 amount, address receiver) external onlyVault(t) {
        _ensureLiquidity(amount);
        trancheNAV[t] -= amount;
        underlying.safeTransfer(receiver, amount);
        emit Withdrawn(t, amount, receiver);
    }

    function trancheNAVView(Tranche t) external view returns (uint256) {
        return trancheNAV[t];
    }

    // ── allocation ───────────────────────────────────────────────────────
    /// @notice Architect deploys each tranche's idle USDC across adapters, once Sentinel has
    ///         approved the proposal and within its TTL. Per-tranche AdapterTarget[] bps must each sum to 10_000.
    function executeAllocation(
        uint256 proposalId,
        AdapterTarget[] calldata senior,
        AdapterTarget[] calldata mezz,
        AdapterTarget[] calldata junior
    ) external onlyExecutor {
        if (!bus.isProposalApproved(proposalId)) revert ProposalNotApproved();
        IAgentEventBus.Proposal memory p = bus.getProposal(proposalId);
        if (block.timestamp - p.proposedAt > proposalTTL) revert ProposalStale();

        uint256 seniorDeployed = _allocateTranche(Tranche.Senior, senior, proposalId);
        uint256 mezzDeployed = _allocateTranche(Tranche.Mezzanine, mezz, proposalId);
        uint256 juniorDeployed = _allocateTranche(Tranche.Junior, junior, proposalId);

        emit AllocationExecuted(proposalId, msg.sender, seniorDeployed, mezzDeployed, juniorDeployed);
    }

    /// @return deployed total USDC pushed into adapters for this tranche
    function _allocateTranche(Tranche t, AdapterTarget[] calldata targets, uint256 proposalId)
        internal
        returns (uint256 deployed)
    {
        uint256 sum;
        for (uint256 i = 0; i < targets.length; i++) {
            if (!isAdapter[targets[i].adapter]) revert UnknownAdapter();
            sum += targets[i].bps;
        }
        if (sum != BPS) revert AllocationBpsInvalid();

        uint256 nav = trancheNAV[t];
        if (nav == 0) return 0;

        // total this allocation intends to deploy for the tranche (sum of per-adapter shares).
        uint256 intended;
        for (uint256 i = 0; i < targets.length; i++) {
            intended += (nav * targets[i].bps) / BPS;
        }
        // autonomy gate runs before any funds move.
        _enforceAutonomy(t, proposalId, intended);

        for (uint256 i = 0; i < targets.length; i++) {
            uint256 amt = (nav * targets[i].bps) / BPS;
            if (amt == 0) continue;
            // ensure idle USDC is available, then push into the adapter
            _ensureLiquidity(amt);
            underlying.forceApprove(targets[i].adapter, amt);
            IYieldAdapter(targets[i].adapter).deposit(amt);
            deployed += amt;
        }
    }

    /// @dev In Multisig mode, an allocation deploying more than the tranche threshold needs the approver's
    ///      prior confirmation, which is consumed here so it can't be replayed for a later execution.
    function _enforceAutonomy(Tranche t, uint256 proposalId, uint256 totalMoved) internal {
        Autonomy storage a = autonomyOf[t];
        if (a.mode != AutonomyMode.Multisig) return;
        if (totalMoved <= a.threshold) return;
        if (!multisigConfirmed[t][proposalId]) revert MultisigApprovalRequired();
        multisigConfirmed[t][proposalId] = false; // consume
    }

    // ── harvest ──────────────────────────────────────────────────────────
    event Harvested(int256 delta, uint256 seniorNav, uint256 mezzNav, uint256 juniorNav);

    /// @notice Snapshots total assets across adapters + idle buffer, then applies the waterfall:
    ///         gains distributed top-down capped at per-tranche targets, losses absorbed bottom-up.
    function harvest() external {
        uint256 totalBefore = trancheNAV[Tranche.Senior] + trancheNAV[Tranche.Mezzanine] + trancheNAV[Tranche.Junior];
        uint256 totalAfter = underlying.balanceOf(address(this));
        uint256 n = adapters.length;
        for (uint256 i = 0; i < n; i++) {
            totalAfter += IYieldAdapter(adapters[i]).totalAssetsFor(address(this));
        }

        uint64 nowTs = uint64(block.timestamp);
        uint256 elapsed = nowTs - lastHarvestTs;

        if (totalAfter > totalBefore) {
            uint256 gain = totalAfter - totalBefore;
            uint256 seniorCap = (trancheNAV[Tranche.Senior] * seniorTargetBps * elapsed) / (uint256(BPS) * 365 days);
            uint256 mezzCap = (trancheNAV[Tranche.Mezzanine] * mezzTargetBps * elapsed) / (uint256(BPS) * 365 days);

            uint256 seniorPay = gain < seniorCap ? gain : seniorCap;
            gain -= seniorPay;
            uint256 mezzPay = gain < mezzCap ? gain : mezzCap;
            gain -= mezzPay;
            uint256 juniorPay = gain; // residual

            trancheNAV[Tranche.Senior] += seniorPay;
            trancheNAV[Tranche.Mezzanine] += mezzPay;
            trancheNAV[Tranche.Junior] += juniorPay;
        } else if (totalAfter < totalBefore) {
            uint256 loss = totalBefore - totalAfter;
            uint256 j = loss < trancheNAV[Tranche.Junior] ? loss : trancheNAV[Tranche.Junior];
            trancheNAV[Tranche.Junior] -= j; loss -= j;
            uint256 m = loss < trancheNAV[Tranche.Mezzanine] ? loss : trancheNAV[Tranche.Mezzanine];
            trancheNAV[Tranche.Mezzanine] -= m; loss -= m;
            uint256 s = loss < trancheNAV[Tranche.Senior] ? loss : trancheNAV[Tranche.Senior];
            trancheNAV[Tranche.Senior] -= s;
        }

        lastHarvestTs = nowTs;
        emit Harvested(
            int256(totalAfter) - int256(totalBefore),
            trancheNAV[Tranche.Senior], trancheNAV[Tranche.Mezzanine], trancheNAV[Tranche.Junior]
        );
    }

    // ── internal liquidity sourcing ──────────────────────────────────────
    /// @dev ensures the controller holds at least `needed` idle USDC, pulling from
    ///      adapters (highest instant liquidity first) if the buffer is short.
    function _ensureLiquidity(uint256 needed) internal {
        uint256 idle = underlying.balanceOf(address(this));
        if (idle >= needed) return;
        uint256 shortfall = needed - idle;
        uint256 n = adapters.length;
        for (uint256 i = 0; i < n && shortfall > 0; i++) {
            IYieldAdapter a = IYieldAdapter(adapters[i]);
            uint256 avail = a.instantLiquidityFor(address(this));
            if (avail == 0) continue;
            uint256 pull = avail < shortfall ? avail : shortfall;
            a.withdraw(pull, address(this));
            shortfall -= pull;
        }
        if (shortfall > 0) revert InsufficientLiquidity();
    }
}
