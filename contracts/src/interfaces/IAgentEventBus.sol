// SPDX-License-Identifier: MIT
pragma solidity 0.8.24;

interface IAgentEventBus {
    enum Role { None, Scout, Architect, Sentinel, Operator }

    struct Proposal {
        address proposer;
        uint64  proposedAt;
        uint16  seniorBps;
        uint16  mezzBps;
        uint16  juniorBps;
        string  reasoningCid;
    }

    struct Verdict {
        address sentinel;
        uint64  decidedAt;
        bool    isApproved;
        string  conditionCid;
    }

    event YieldMapPublished(address indexed agent, string ipfsHash, uint256 timestamp);
    event AllocationProposed(
        uint256 indexed proposalId, address indexed agent,
        uint256 seniorBps, uint256 mezzBps, uint256 juniorBps, string reasoningHash
    );
    event RiskVerdictIssued(uint256 indexed proposalId, address indexed agent, bool isApproved, string conditionHash);
    event HedgeSignalEmitted(address indexed agent, address indexed underlyingAsset, int256 deltaSize, string reasoningHash);
    event HedgeLogged(address indexed agent, address indexed hedgedAsset, int256 netPosition, string executionProof);
    event RoleAssigned(address indexed agent, Role role);

    function setRole(address agent, Role r) external;
    function publishYieldMap(string calldata ipfsHash) external;
    function proposeAllocation(
        uint256 proposalId, uint16 seniorBps, uint16 mezzBps, uint16 juniorBps, string calldata reasoningCid
    ) external;
    function issueRiskVerdict(uint256 proposalId, bool isApproved, string calldata conditionCid) external;
    function emitHedgeSignal(address underlyingAsset, int256 deltaSize, string calldata reasoningCid) external;
    function logHedge(address hedgedAsset, int256 netPosition, string calldata executionProof) external;

    function isProposalApproved(uint256 proposalId) external view returns (bool);
    function getProposal(uint256 proposalId) external view returns (Proposal memory);
    function roleOf(address agent) external view returns (Role);
}
