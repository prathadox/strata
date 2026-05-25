// SPDX-License-Identifier: MIT
pragma solidity 0.8.24;

import {IAgentEventBus} from "./interfaces/IAgentEventBus.sol";

contract AgentEventBus is IAgentEventBus {
    error NotAuthorized();
    error BpsSumInvalid();
    error ProposalExists();
    error ProposalMissing();
    error VerdictExists();

    uint16 internal constant BPS_DENOMINATOR = 10_000;

    address public immutable owner;
    mapping(address => Role) public roleOf;
    mapping(uint256 => Proposal) internal _proposals;
    mapping(uint256 => Verdict) internal _verdicts;

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

    function emitHedgeSignal(address underlyingAsset, int256 deltaSize, string calldata reasoningCid)
        external onlyRole(Role.Sentinel)
    {
        emit HedgeSignalEmitted(msg.sender, underlyingAsset, deltaSize, reasoningCid);
    }

    function logHedge(address hedgedAsset, int256 netPosition, string calldata executionProof)
        external onlyRole(Role.Operator)
    {
        emit HedgeLogged(msg.sender, hedgedAsset, netPosition, executionProof);
    }

    function isProposalApproved(uint256 proposalId) external view returns (bool) {
        Verdict storage v = _verdicts[proposalId];
        return v.isApproved && v.decidedAt != 0;
    }

    function getProposal(uint256 proposalId) external view returns (Proposal memory) {
        return _proposals[proposalId];
    }
}
