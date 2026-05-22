# Sentinel Strategy, v1

Sentinel is the Risk agent for Strata. This document is signed and pinned to IPFS, and the CID is recorded on Sentinel's ERC-8004 identity NFT.

## Identity

- On-chain agent address: set at deployment, recorded on the ERC-8004 identity token.
- Strategy CID is updated through `IERC8004Identity.updateStrategyCid(tokenId, newCid)` when this document changes.
- Event bus contract: `AgentEventBus`, deployed on Mantle (chain id 5000). Sentinel is granted `Role.Sentinel` by the bus owner.

## What Sentinel does

Every cycle, after an `AllocationProposed` event arrives:

1. Fetches the proposal JSON from IPFS at `reasoningHash`.
2. Verifies the proposal signature against Architect's known address.
3. Fetches the source `YieldMap` from `proposal.sourceMapCid` and verifies Scout's signature.
4. Snapshots its hedge-ledger (built from on-chain `HedgeLogged` events).
5. Runs the deterministic risk policy described in `risk-methodology.md` against the proposal + map + exposure snapshot. The sha256 of that file is embedded in every verdict as `methodologyHash`.
6. Builds a `RiskVerdict` JSON, signs it (EIP-191), pins it to Lighthouse.
7. Emits `issueRiskVerdict(proposalId, seniorVerdict, mezzVerdict, juniorVerdict, reasoningHash)`.
8. For each asset whose `|grossExposure - netExposure|` exceeds the configured cap, builds and emits a `HedgeSignal` addressed to Operator via `emitHedgeSignal`.
9. Holds the last processed `proposalCid` in memory. Duplicate triggers skip on-chain emit.

## What Sentinel does not do

- Sentinel does not execute trades or hedges. It only emits verdicts and signals.
- Sentinel does not decide allocation. Architect does. Sentinel evaluates the proposal as-given.
- Sentinel does not re-run Scout's scoring. It reads `eligibleTranches`, `tvlUsd`, `depegHistory`, `nansenNetFlow7dUsd` directly from the YieldMap.
- Sentinel does not use any LLM. Verdicts are fully deterministic.
- Sentinel does not write to any contract other than `AgentEventBus.issueRiskVerdict` and `AgentEventBus.emitHedgeSignal`.
- Sentinel does not persist its history off-chain. The on-chain log of `RiskVerdictIssued` and `HedgeSignalEmitted` is the historical record.

## Events consumed

```
event AllocationProposed(address indexed agent, uint256 indexed proposalId, uint256 seniorBps, uint256 mezzBps, uint256 juniorBps, string reasoningHash);
event HedgeLogged(address indexed agent, address indexed hedgedAsset, int256 netPosition, string executionProof);
```

## Events emitted

```
event RiskVerdictIssued(address indexed agent, uint256 indexed proposalId, uint8 seniorVerdict, uint8 mezzVerdict, uint8 juniorVerdict, string reasoningHash);
event HedgeSignalEmitted(address indexed agent, address indexed hedgedAsset, int256 targetNotionalUsd, string reasoningHash);
```

## Identity gate today

In v1 the verifier accepts any signature that recovers to the proposal's or map's `publisher.address`. When `ARCHITECT_ADDRESS` or `SCOUT_ADDRESS` are set in env, the recovered signer must additionally equal those addresses. The `IDENTITY_REGISTRY_ADDRESS` field is reserved for a future on-chain lookup.

## Failure modes

- IPFS fetch fails after gateway fallback chain: skip cycle, log, metric `sentinel_verification_failures_total`.
- Proposal signature invalid: skip + log + metric.
- Map signature invalid: skip + log + metric.
- Proposal is zero-state: skip (nothing to evaluate).
- Lighthouse pin fails: cycle aborts before on-chain emit.
- On-chain tx reverts: not retried (definitive rejection from contract).

## Replayability

Given:
1. The source code at `codeCommit` recorded on the verdict.
2. `risk-methodology.md` whose sha256 matches `methodologyHash`.
3. The proposal at `sourceProposalCid` and the map at `sourceMapCid`.
4. The hedge-ledger snapshot reconstructed by replaying `HedgeLogged` up to the proposal block.

Anyone can re-run `pnpm --filter @strata/sentinel inspect --proposal-cid <cid>` and get a byte-identical verdict (modulo `publishedAtMs` and `signature`).
