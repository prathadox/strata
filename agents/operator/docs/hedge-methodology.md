# Operator Hedge Methodology, v1

This file's sha256 is included as `methodologyHash` on every published HedgeIntent.

## Inputs

Per cycle:
- `signal`: an already-verified `HedgeSignal` from Sentinel (carries `hedgedAsset` and `targetNotionalUsd` signed).
- `spotPriceUsd`: USD spot price for `signal.hedgedAsset`, fetched from CoinGecko (`/simple/token_price/mantle?contract_addresses=<addr>&vs_currencies=usd`).

## Constants

```
HEDGE_CONSTANTS = {
  overshootBps: 0,
  minNotionalUsd: 10_000,
  maxNotionalUsd: 5_000_000,
  slippageToleranceBps: 50
}
```

These live in `agents/operator/src/pipeline/sizeHedge.ts` and are frozen at module load.

## Algorithm

1. Let `target = signal.targetNotionalUsd` (signed bigint).
2. If `|target| < minNotionalUsd`, skip the cycle with reason `below-floor`.
3. Clamp: `absClamped = min(|target|, maxNotionalUsd)`. Preserve sign.
4. `direction = target >= 0 ? 'short' : 'long'`. The semantics: a positive `targetNotionalUsd` from Sentinel means the protocol is long the asset and needs to short it to neutralize.
5. `contractSize = (absClamped / spotPriceUsd)`, formatted as decimal string. v1 does not enforce contract-tick rounding; that belongs to the real-fill adapter in v2.
6. Compose the `HedgeIntent` artifact with `slippageToleranceBps = 50`, sign EIP-191, pin to Lighthouse.
7. On-chain `netPosition` is `BigInt(round(signedNotionalUsd * 1_000_000))` (6-decimal USDC). The IPFS payload carries the full precision; the on-chain integer is a summary indexable by Architect for the next allocation cycle.

## Identifiers

```
intentId = uint256(keccak256(sourceSignalCid + '|' + sourceSignalBlockNumber))
```

## Determinism notes

- `Number(notionalUsd) / spotPriceUsd` is computed in float64. For the hackathon demo this is acceptable; in v2 swap to a fixed-point library so replays are byte-identical.
- `spotPriceUsd` and `spotPriceTimestampMs` are recorded in the intent so any replay can confirm the price the sizer saw.
