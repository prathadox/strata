# Architect Strategy, v1

Architect is the Allocation agent for Strata. This document is signed and pinned to IPFS, and the CID is recorded on Architect's ERC-8004 identity NFT. Anything Architect does at runtime can be verified against the rules below.

## Identity

- On-chain agent address: set at deployment, recorded on the ERC-8004 identity token.
- Strategy CID is updated through `IERC8004Identity.updateStrategyCid(tokenId, newCid)` when this document changes.
- Event bus contract: `AgentEventBus`, deployed on Mantle (chain id 5000). Architect is granted `Role.Architect` by the bus owner.
- Canonical event signature Architect emits:

```
event proposeAllocation(uint256 proposalId, uint256 seniorBps, uint256 mezzBps, uint256 juniorBps, string reasoningHash);
```

The `reasoningHash` is the IPFS CID of the signed AllocationProposal JSON.

## What Architect does

Every cycle, after a `YieldMapPublished` event arrives on `AgentEventBus`, Architect:

1. Reads the `ipfsHash` from the event and fetches the Yield Map JSON from IPFS.
2. Verifies the map signature: recomputes `mapHash` over the canonical JSON (signature cleared), recovers the EIP-191 signer, confirms it matches `publisher.address` on the map and `agent` on the event.
3. Cross-checks `publisher.address` against Scout's ERC-8004 identity entry on-chain.
4. Reads all current `HedgeLogged` events to snapshot net exposure at the time of the proposal.
5. Applies per-tranche mandates inherited from Scout: each opportunity already carries `eligibleTranches[]` from Scout's scoring step. Architect reads that field directly rather than re-running the mandate checks.
6. Runs the deterministic allocation algorithm described in `allocation-methodology.md`. The sha256 of that file is embedded in every proposal as `methodologyHash`.
7. Builds an `AllocationProposal` blob (schema in `agents/architect/src/types.ts`), signs it with the Architect key using EIP-191, and pins it to Lighthouse.
8. Emits `proposeAllocation(proposalId, seniorBps, mezzBps, juniorBps, reasoningHash)` on `AgentEventBus`.
9. Holds the last published `proposalId` in memory. If the next cycle maps to the same CID (identical inputs), the on-chain emit is skipped. The chain log is the historical record.

## What Architect does not do

- Architect does not execute trades. Vault contracts execute, gated by Sentinel's risk verdict.
- Architect does not perform risk checks. Sentinel reads the proposal and issues a verdict independently.
- Architect does not hedge. Hedging is Operator's domain. Architect reads Operator's hedge log only to record net exposure at proposal time.
- Architect does not decide tranche eligibility. That determination belongs to Scout's scoring step, encoded in `eligibleTranches[]` on each opportunity.
- Architect does not use any LLM or external model to compute bps splits. The allocation is fully deterministic: given the same YieldMap, the same bps output is always produced.
- Architect does not write to any contract other than `AgentEventBus.proposeAllocation`. Specifically, Architect is not authorized to call `publishYieldMap`, `issueRiskVerdict`, `emitHedgeSignal`, or `logHedge`. The role check on the bus rejects those calls.
- Architect does not persist a local mirror of its proposal history. Queries about prior cycles go to the chain log and IPFS.

## Events consumed

```
event YieldMapPublished(address indexed agent, string ipfsHash, uint256 timestamp);
```

Triggers a new allocation cycle. The `agent` field is validated against Scout's registered on-chain address.

```
event HedgeLogged(address indexed agent, address indexed hedgedAsset, int256 netPosition, string executionProof);
```

Used to build the `netExposureAtProposalMs` snapshot. Not a trigger: Architect reads the hedge ledger at the time it processes each YieldMap.

## Event emitted

```
event proposeAllocation(uint256 proposalId, uint256 seniorBps, uint256 mezzBps, uint256 juniorBps, string reasoningHash);
```

`proposalId = uint256(keccak256(sourceMapCid + "|" + map.publishedAtMs))`. Deterministic and unique per YieldMap cycle.

## Failure modes and how Architect handles them

- IPFS fetch fails after 2 retries: skip this cycle, log the missed CID, wait for the next event.
- Signature verification fails: skip the map and log a warning. Never allocate from an unverified map.
- Zero eligible opportunities in a tranche: that tranche gets `bps: 0`. Tranches that are present get bps re-normalized to sum to 10000.
- All tranches empty: emit nothing. Publishing a zero-allocation proposal would misrepresent the state.
- Lighthouse pin fails after 2 retries: skip the on-chain emit for this cycle.
- On-chain tx fails after 2 retries: skip record-keeping, alert metrics, continue.

## Versioning

This is v1. When the methodology changes, a new file `strategy-v2.md` is pinned and the identity NFT's CID is updated through `updateStrategyCid`. The on-chain trail of CID changes is itself the version log. Old strategy docs remain readable via their CIDs.

## Verifying a published AllocationProposal

1. Take the `ipfsHash` (reasoningHash) from a `proposeAllocation` event on `AgentEventBus`.
2. Fetch the JSON from `https://gateway.lighthouse.storage/ipfs/{cid}` or any IPFS gateway.
3. Compute `keccak256` over the canonical serialization of the JSON with `signature` cleared to `""`. Confirm it matches the contained hash.
4. Recover the address from `signature` over the hash (EIP-191). Confirm it matches `publisher.address` on the proposal and `agent` as registered on Architect's ERC-8004 identity.
5. Confirm `methodologyHash` matches the sha256 of `allocation-methodology.md` linked from Architect's ERC-8004 identity at the time of publish.
6. Verify the upstream YieldMap: fetch `sourceMapCid` from IPFS, re-run Scout's verification chain (see Scout strategy-v1), confirm `publisher.address` on the map matches Scout's registered on-chain address.

If all steps pass, the proposal is exactly what Architect signed using exactly the algorithm documented at that `methodologyHash`.

## Verification chain a downstream actor can replay

1. Fetch `ipfsHash` from a `YieldMapPublished` event on `AgentEventBus`.
2. Fetch JSON from IPFS.
3. Recompute `mapHash` over the canonical serialization (signature field cleared to `""`).
4. Recover EIP-191 signer from the signature over `mapHash`.
5. Compare recovered address to `publisher.address` in the JSON.
6. Cross-check `publisher.address` against Scout's ERC-8004 identity entry on-chain.

If these match, the YieldMap is authentic. Architect's proposal is then verifiable by running `pnpm --filter @strata/architect inspect --cid <cid>` against the source code at `codeCommit`.

### Identity gate today

In v1 the verifier accepts any signature that recovers to `publisher.address`. When `SCOUT_ADDRESS` is set in env, it additionally asserts the recovered signer equals that address (step 6 above, but as an env-var compare, not a registry read). The `IDENTITY_REGISTRY_ADDRESS` field is reserved for a future on-chain lookup that resolves Scout's token to its current signer address.
