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

    error NotOwner();
    error NotExecutor();
    error NotVault();
    error UnknownAdapter();
    error AdapterInUse();
    error VaultAlreadySet();
    error InsufficientLiquidity();

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

    event VaultSet(Tranche indexed tranche, address vault);
    event AdapterAdded(address indexed adapter);
    event AdapterRemoved(address indexed adapter);
    event TargetsSet(uint16 seniorTargetBps, uint16 mezzTargetBps);
    event Deposited(Tranche indexed tranche, uint256 amount);
    event Withdrawn(Tranche indexed tranche, uint256 amount, address indexed receiver);

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
