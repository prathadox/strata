# Sentinel Risk Methodology, v1

This file's sha256 is included as `methodologyHash` on every published RiskVerdict.

## Inputs

Per cycle:
- `proposal`: an already-verified `AllocationProposal` from Architect.
- `map`: an already-verified `YieldMap` from Scout, referenced by `proposal.sourceMapCid`.
- `netExposure`: `Record<assetAddress, bigint>` reconstructed from on-chain `HedgeLogged` events up to the proposal block.
- `totalDepositsBaselineUsd`: a deployment constant (env-injected, NOT part of this methodology hash). Default: `10_000_000`.

## Constants

```
RISK_CONSTANTS = {
  depegBpsThresholdByTranche:    { senior: 50,         mezzanine: 200,       junior: 500       },
  tvlFloorUsdByTranche:          { senior: 50_000_000, mezzanine: 10_000_000, junior: 1_000_000 },
  concentrationWarnBpsByTranche: { senior: 4500,       mezzanine: 3500,      junior: 2000      },
  smartMoneyOutflow7dRedUsd:     -5_000_000,
  hedgeDeltaCapUsd:              250_000
}
```

These live in `agents/sentinel/src/pipeline/riskPolicy.ts` and are frozen at module load.

## Algorithm

### Phase 1: per-position scoring

For each tranche T in `[senior, mezzanine, junior]`:

1. If `proposal.tranches[T].bps === 0`, skip; tranche verdict is `green`.
2. For each `(oppId, bps)` in `proposal.tranches[T].positions`:
   a. Look up the opportunity in `map.opportunities` by id. Missing means position verdict equals `red`, code `unknown-opportunity`.
   b. **Depeg.** If `opp.depegHistory.maxDeviationBps > depegBpsThresholdByTranche[T]`, position is yellow, code `depeg-history-breach`.
   c. **TVL.** If `opp.tvlUsd < tvlFloorUsdByTranche[T]`, position is yellow, code `tvl-below-floor`.
   d. **Concentration.** This check fires only when the tranche has 2 or more positions. If the tranche has a single position holding 100 percent, no concentration warn is raised (warning a solo allocation is tautological). For tranches with 2+ positions, if `bps > concentrationWarnBpsByTranche[T]`, position is yellow, code `concentration-warn`.
   e. **Smart money.** If `opp.nansenNetFlow7dUsd < smartMoneyOutflow7dRedUsd`, position is red, code `smart-money-outflow`.
   f. The position verdict is the worst of all triggered severities (red beats yellow beats green).

### Phase 2: per-tranche aggregation

For each tranche T:
- Count yellow positions `y` and red positions `r`.
- If `r >= 1` or `y >= 2`, tranche T is `red`.
- Else if `y === 1`, tranche T is `yellow`.
- Else `green`.

### Phase 3: hedge-signal detection

1. For each tranche T with `bps > 0`:
   - `trancheUsd = totalDepositsBaselineUsd * (T.bps / 10000)`
   - For each `(oppId, posBps)`: `grossUsdByAsset[opp.tokenAddress] += trancheUsd * (posBps / 10000)`
2. For each asset A in `grossUsdByAsset`:
   - `deltaUsd = grossUsdByAsset[A] - netExposure[A]`
   - If `|deltaUsd| > hedgeDeltaCapUsd`, emit a hedge signal with `targetNotionalUsd = round(deltaUsd)` (signed) and `direction = deltaUsd > 0 ? 'short' : 'long'`.
3. Hedge signals are sorted by asset address ascending for stable ordering.

## Verdict identifiers

```
verdictId = uint256(keccak256(sourceProposalCid + '|' + publishedAtMs))
signalId  = uint256(keccak256(verdictCid + '|' + hedgedAsset + '|' + publishedAtMs))
```

## Replayability

Given the source code at `codeCommit`, this methodology file, and the inputs above, anyone running `pnpm --filter @strata/sentinel inspect --proposal-cid <cid>` produces the same `tranches`, `perPositionVerdicts`, `reasons`, and ordered `hedgeSignals`. Two fields differ: `publishedAtMs` (wall clock) and `signature` (key-dependent). The inspect script pins `publishedAtMs` to `1700000000000` and uses an ephemeral key, so its output file is reproducible.
