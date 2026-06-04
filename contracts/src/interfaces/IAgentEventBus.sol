// SPDX-License-Identifier: MIT
pragma solidity 0.8.24;

interface IAgentEventBus {
    enum Role { None, Scout, Architect, Sentinel, Operator }

    /// @dev Sentinel's per-asset, per-tranche risk grade — the richer model behind the binary
    ///      execution gate (isApproved). None = ungraded.
    enum Rating { None, Green, Yellow, Red }

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
    /// @dev signalId anchors the auditable signal->fill chain (see HedgeLogged.signalId).
    event HedgeSignalEmitted(uint256 indexed signalId, address indexed agent, address indexed underlyingAsset, int256 deltaSize, string reasoningHash);
    /// @dev signalId points back to the HedgeSignalEmitted this fill responds to.
    event HedgeLogged(uint256 indexed signalId, address indexed agent, address indexed hedgedAsset, int256 netPosition, string executionProof);
    event RoleAssigned(address indexed agent, Role role);
    /// @dev Sentinel grades each (tranche, asset) pair of a proposal green/yellow/red for the
    ///      Transparency Dashboard; complements the binary isApproved gate.
    event AssetRiskRated(uint256 indexed proposalId, uint8 indexed trancheId, address indexed asset, Rating rating, string noteCid);

    function setRole(address agent, Role r) external;
    function publishYieldMap(string calldata ipfsHash) external;
    function proposeAllocation(
        uint256 proposalId, uint16 seniorBps, uint16 mezzBps, uint16 juniorBps, string calldata reasoningCid
    ) external;
    function issueRiskVerdict(uint256 proposalId, bool isApproved, string calldata conditionCid) external;
    function setAssetRiskRating(uint256 proposalId, uint8 trancheId, address asset, Rating rating, string calldata noteCid) external;
    function assetRiskRating(uint256 proposalId, uint8 trancheId, address asset) external view returns (Rating);
    function emitHedgeSignal(address underlyingAsset, int256 deltaSize, string calldata reasoningCid) external returns (uint256 signalId);
    function logHedge(uint256 signalId, address hedgedAsset, int256 netPosition, string calldata executionProof) external;

    function isProposalApproved(uint256 proposalId) external view returns (bool);
    function getProposal(uint256 proposalId) external view returns (Proposal memory);
    function roleOf(address agent) external view returns (Role);
}
