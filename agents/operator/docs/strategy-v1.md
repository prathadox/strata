# Operator Strategy, v1

Operator is the Hedging agent for Strata. This document is signed and pinned to IPFS, and the CID is recorded on Operator's ERC-8004 identity NFT.

## Identity

- On-chain agent address: set at deployment, recorded on the ERC-8004 identity token.
- Strategy CID is updated through `IERC8004Identity.updateStrategyCid(tokenId, newCid)` when this document changes.
- Event bus contract: `AgentEventBus`, deployed on Mantle (chain id 5000). Operator is granted `Role.Operator` by the bus owner.

## What Operator does

After each `HedgeSignalEmitted` event from Sentinel:

1. Fetches the signed `HedgeSignal` JSON from IPFS (the `reasoningHash`).
2. Verifies the signal signature against Sentinel's known address.
3. Reads the current USD spot for `signal.hedgedAsset` from CoinGecko (the only external API Operator uses).
4. Runs the deterministic sizing algorithm described in `hedge-methodology.md`. The sha256 of that file is embedded in every intent as `methodologyHash`.
5. Builds a `HedgeIntent` JSON capturing direction, notional, contract size, spot, slippage tolerance. Signs it (EIP-191) and pins it to Lighthouse.
6. Emits `logHedge(hedgedAsset, netPosition, executionProof=cid)`. `netPosition` is the signed notional in 6-decimal USDC units.

## What Operator does not do in v1

- Operator does not actually execute on Byreal Perps in v1. The pinned `HedgeIntent` is a signed paper-trade declaration. v2 swaps in a real fill adapter and amends `executionProof` to point at a real fill receipt.
- Operator does not generate new hedge ideas. It only acts on signals issued by Sentinel.
- Operator does not write to any contract other than `AgentEventBus.logHedge`.
- Operator does not use any LLM. Sizing is fully deterministic.

## Events consumed

```
event HedgeSignalEmitted(address indexed agent, address indexed hedgedAsset, int256 targetNotionalUsd, string reasoningHash);
```

## Events emitted

```
event HedgeLogged(address indexed agent, address indexed hedgedAsset, int256 netPosition, string executionProof);
```

## Identity gate today

When `SENTINEL_ADDRESS` is set, the verifier requires the recovered signer to match. `IDENTITY_REGISTRY_ADDRESS` is reserved for a future on-chain lookup.

## Failure modes

- Signal fetch fails after gateway fallback: skip + log + metric `operator_verification_failures_total`.
- Signal signature invalid: skip + log + metric.
- CoinGecko unavailable for the asset: skip + log + metric `operator_price_failures_total`.
- Signal below noise floor ($10k): skip with `below-floor`.
- Lighthouse pin fails: cycle aborts before on-chain emit.
- On-chain tx reverts: not retried.

## Replayability

Given:
1. The source code at `codeCommit` recorded on the intent.
2. `hedge-methodology.md` whose sha256 matches `methodologyHash`.
3. The source signal at `sourceSignalCid` and the CoinGecko spot at `spotPriceTimestampMs`.

Anyone replaying produces the same `notionalUsd`, `contractSize`, and `intentId`. Two fields differ: `publishedAtMs` and `signature`.
