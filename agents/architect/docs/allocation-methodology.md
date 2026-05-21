# Architect Allocation Methodology, v1

This is the algorithm Architect uses to produce bps splits from a verified YieldMap. The sha256 of this file is included as `methodologyHash` on every published AllocationProposal. Anyone replaying a published proposal can verify the bps were computed under exactly the rules described here.

## Purpose

For every verified YieldMap, produce one `AllocationProposal`: a set of per-tranche bps splits and per-position bps weights that sum correctly, are concentration-capped, and are deterministic given the same input.

## Inputs

A verified `YieldMap` from Scout. Each entry in `opportunities[]` carries:

- `id`: unique string identifier for the pool/opportunity.
- `score`: `number` (RAAPY * confidence, as defined in Scout's scoring-methodology.md). Must be > 0 to participate in allocation.
- `eligibleTranches`: `Array<'senior' | 'mezzanine' | 'junior'>`. Empty means no allocation.

Architect reads `eligibleTranches` directly from the map and does not re-run Scout's mandate checks.

## Constants

All constants live in `agents/architect/src/pipeline/allocate.ts` under `ALLOCATION_CONSTANTS`. They are frozen at module load. If a constant changes, the methodology hash changes, which means downstream consumers can detect that this v1 contract has been replaced.

```
trancheTargetBps    = { senior: 5000, mezzanine: 3000, junior: 2000 }
concentrationCapBps = { senior: 6000, mezzanine: 4000, junior: 2500 }
```

## Algorithm

The algorithm runs in two phases: per-tranche allocation (steps 1-5), then cross-tranche normalization (steps 6-7).

### Phase 1: per-tranche allocation

Run steps 1-5 independently for each of `senior`, `mezzanine`, `junior`.

**Step 1 - Filter and sort.**

Select opportunities where `eligibleTranches` includes this tranche and `score > 0`. Sort descending by `score`. If no opportunities pass, set `bps: 0, positions: {}` for this tranche and skip remaining steps.

**Step 2 - Score-weighted normalization.**

```
totalScore  = sum(score[i]) for all eligible i
bps[i]      = floor((score[i] / totalScore) * 10000)
```

Each `bps[i]` is truncated (floor), so the sum across positions is at most 10000.

**Step 3 - Concentration cap.**

Let `cap = concentrationCapBps[tranche]`.

For each position:

```
if bps[i] > cap:
    overflow += bps[i] - cap
    bps[i]    = cap
else:
    mark i as uncapped
```

**Step 4 - Redistribute overflow.**

Iterate until `overflow == 0` or all positions are at the cap:

```
totalUncappedScore = sum(score[j]) for uncapped j
for each uncapped j:
    share       = floor((score[j] / totalUncappedScore) * overflow)
    candidate   = bps[j] + share
    if candidate > cap:
        remaining += candidate - cap
        bps[j]     = cap
        remove j from uncapped
    else:
        bps[j]     = candidate
overflow = remaining
```

If `uncapped` becomes empty before overflow reaches 0, stop (the remaining overflow is absorbed by the top-up step below).

**Step 5 - Top-up.**

```
positionSum = sum(bps[i])
if positionSum < 10000:
    topId = highest-score position where bps[topId] < cap
          ?? highest-score position (fallback when all are at cap)
    bps[topId] += (10000 - positionSum)
```

The fallback (pushing a position above the cap) only occurs in sparse tranches where every eligible position is already at the cap. In that case the sum-to-10000 invariant takes precedence over the concentration cap, because `AllocationProposalSchema` requires each active tranche's positions to sum to exactly 10000.

Set `tranche.bps = trancheTargetBps[tranche]`, `tranche.positions = bps map`.

### Phase 2: cross-tranche normalization

**Step 6 - Identify present tranches.**

A tranche is "present" if `Object.keys(positions).length > 0`. If no tranches are present, return zero-state (all bps 0) and stop.

**Step 7 - Normalize tranche bps.**

```
totalRaw = sum(trancheTargetBps[t]) for present tranches t
for each present tranche t:
    tranche[t].bps = floor((trancheTargetBps[t] / totalRaw) * 10000)
```

Top up rounding error to the first present tranche:

```
sum = tranche.senior.bps + tranche.mezzanine.bps + tranche.junior.bps
if sum < 10000:
    present[0].bps += (10000 - sum)
```

The "first present" tranche is the first of `[senior, mezzanine, junior]` that has positions. This is stable across runs given the same input.

## proposalId derivation

```
seed       = sourceMapCid + "|" + map.publishedAtMs
proposalId = uint256(keccak256(toBytes(seed)))
```

`sourceMapCid` is the IPFS CID of the YieldMap. `publishedAtMs` is the millisecond timestamp from the map's `publishedAtMs` field. The result is a deterministic, collision-resistant identifier for the proposal. Two proposals from the same YieldMap cycle always produce the same `proposalId`.

## Output shape

`AllocationProposal` as defined in `agents/architect/src/types.ts`. Key fields:

| Field | Type | Description |
|---|---|---|
| `version` | `"1.0"` | Schema version. |
| `proposalId` | `string` (decimal uint256) | Derived from map CID and timestamp. |
| `sourceMapCid` | `string` | IPFS CID of the input YieldMap. |
| `publishedAtMs` | `number` | Wall-clock ms when the proposal was built. |
| `publisher.address` | `address` | Architect's on-chain address. |
| `methodologyHash` | `bytes32` | `"0x" + sha256(this file)`. |
| `codeCommit` | `string` | Git commit hash of the Architect source at runtime. |
| `tranches` | object | `senior`, `mezzanine`, `junior`, each with `bps` and `positions`. |
| `netExposureAtProposalMs` | `Record<address, string>` | Net notional USD per asset from the hedge ledger, snapshotted at proposal time. |
| `signature` | `string` | EIP-191 signature over the proposal hash. |

Invariants enforced by `AllocationProposalSchema`:

- `senior.bps + mezzanine.bps + junior.bps` is either 0 (zero-state) or exactly 10000.
- For each tranche with `bps > 0`, `sum(positions.values())` is exactly 10000.

## Replayability checklist

A downstream actor with:

1. The source code at `codeCommit`.
2. This methodology doc (confirm its sha256 matches `methodologyHash` on the proposal).
3. The source YieldMap at `sourceMapCid`.

can run:

```
pnpm --filter @strata/architect inspect --cid <proposalCid>
```

and get byte-identical `bps` values. The allocation is fully deterministic: no randomness, no timestamps in position math, no network calls after the YieldMap is fetched.

The `bps` splits and the `proposalId` are the replayable invariants. Two fields will differ between a live run and a replay: `publishedAtMs` (wall-clock at proposal build time) and `signature` (depends on the signing key). The inspect script holds `publishedAtMs` fixed at `1700000000000` and uses an ephemeral key, so its `proposal-output.md` is reproducible for manual inspection but is not byte-identical to a live emission.

## Constants reference

```
ALLOCATION_CONSTANTS = {
  trancheTargetBps:    { senior: 5000, mezzanine: 3000, junior: 2000 },
  concentrationCapBps: { senior: 6000, mezzanine: 4000, junior: 2500 }
}
```

These constants live in `agents/architect/src/pipeline/allocate.ts`. Changing any constant produces a different `methodologyHash` on the next build, which signals to downstream consumers that the allocation rules have changed.
