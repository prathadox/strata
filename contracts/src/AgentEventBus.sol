// SPDX-License-Identifier: MIT
pragma solidity 0.8.24;

import {IAgentEventBus} from "./interfaces/IAgentEventBus.sol";

contract AgentEventBus is IAgentEventBus {
    error NotAuthorized();
    error BpsSumInvalid();
    error ProposalExists();
    error ProposalMissing();
    error VerdictExists();
    error HedgeSignalMissing();

    uint16 internal constant BPS_DENOMINATOR = 10_000;

    address public immutable owner;
    mapping(address => Role) public roleOf;
    mapping(uint256 => Proposal) internal _proposals;
    mapping(uint256 => Verdict) internal _verdicts;

    /// @notice monotonically increasing count of hedge signals; the latest id is also the total.
    ///         A logHedge fill must reference an id in [1, hedgeSignalCount].
    uint256 public hedgeSignalCount;

    /// @notice proposalId => trancheId => asset => Sentinel's green/yellow/red grade.
    mapping(uint256 => mapping(uint8 => mapping(address => Rating))) internal _assetRiskRating;

    constructor(address _owner) {
        owner = _owner;
    }

    modifier onlyRole(Role r) {
        if (roleOf[msg.sender] != r) revert NotAuthorized();
        _;
    }

    function setRole(address agent, Role r) external {
        if (msg.sender != owner) revert NotAuthorized();
        roleOf[agent] = r;
        emit RoleAssigned(agent, r);
    }

    function publishYieldMap(string calldata ipfsHash) external onlyRole(Role.Scout) {
        emit YieldMapPublished(msg.sender, ipfsHash, block.timestamp);
    }

    function proposeAllocation(
        uint256 proposalId, uint16 seniorBps, uint16 mezzBps, uint16 juniorBps, string calldata reasoningCid
    ) external onlyRole(Role.Architect) {
        if (uint256(seniorBps) + mezzBps + juniorBps != BPS_DENOMINATOR) revert BpsSumInvalid();
        if (_proposals[proposalId].proposer != address(0)) revert ProposalExists();
        _proposals[proposalId] = Proposal({
            proposer: msg.sender,
            proposedAt: uint64(block.timestamp),
            seniorBps: seniorBps,
            mezzBps: mezzBps,
            juniorBps: juniorBps,
            reasoningCid: reasoningCid
        });
        emit AllocationProposed(proposalId, msg.sender, seniorBps, mezzBps, juniorBps, reasoningCid);
    }

    function issueRiskVerdict(uint256 proposalId, bool isApproved, string calldata conditionCid)
        external onlyRole(Role.Sentinel)
    {
        if (_proposals[proposalId].proposer == address(0)) revert ProposalMissing();
        if (_verdicts[proposalId].decidedAt != 0) revert VerdictExists();
        _verdicts[proposalId] = Verdict({
            sentinel: msg.sender,
            decidedAt: uint64(block.timestamp),
            isApproved: isApproved,
            conditionCid: conditionCid
        });
        emit RiskVerdictIssued(proposalId, msg.sender, isApproved, conditionCid);
    }

    /// @notice Sentinel grades a single (tranche, asset) pair of an existing proposal. The binary
    ///         isProposalApproved gate still governs execution; this is the richer model the
    ///         Transparency Dashboard renders (green/yellow/red per asset and per tranche).
    function setAssetRiskRating(uint256 proposalId, uint8 trancheId, address asset, Rating rating, string calldata noteCid)
        external onlyRole(Role.Sentinel)
    {
        if (_proposals[proposalId].proposer == address(0)) revert ProposalMissing();
        _assetRiskRating[proposalId][trancheId][asset] = rating;
        emit AssetRiskRated(proposalId, trancheId, asset, rating, noteCid);
    }

    function assetRiskRating(uint256 proposalId, uint8 trancheId, address asset) external view returns (Rating) {
        return _assetRiskRating[proposalId][trancheId][asset];
    }

    function emitHedgeSignal(address underlyingAsset, int256 deltaSize, string calldata reasoningCid)
        external onlyRole(Role.Sentinel) returns (uint256 signalId)
    {
        signalId = ++hedgeSignalCount;
        emit HedgeSignalEmitted(signalId, msg.sender, underlyingAsset, deltaSize, reasoningCid);
    }

    function logHedge(uint256 signalId, address hedgedAsset, int256 netPosition, string calldata executionProof)
        external onlyRole(Role.Operator)
    {
        if (signalId == 0 || signalId > hedgeSignalCount) revert HedgeSignalMissing();
        emit HedgeLogged(signalId, msg.sender, hedgedAsset, netPosition, executionProof);
    }

    function isProposalApproved(uint256 proposalId) external view returns (bool) {
        Verdict storage v = _verdicts[proposalId];
        return v.isApproved && v.decidedAt != 0;
    }

    function getProposal(uint256 proposalId) external view returns (Proposal memory) {
        return _proposals[proposalId];
    }
}
