# Scout Strategy, v1

Scout is the Yield Sourcing agent for Strata. This document is signed and pinned to IPFS, and the CID is recorded on Scout's ERC-8004 identity NFT. Anything Scout does at runtime can be verified against the rules below.

## Identity

- On-chain agent address: set at deployment, recorded on the ERC-8004 identity token.
- Strategy CID is updated through `IERC8004Identity.updateStrategyCid(tokenId, newCid)` when this document changes.
- Event bus contract: `AgentEventBus`, deployed on Mantle (chain id 5000). Scout is granted `Role.Scout` by the bus owner.
- Canonical event signature Scout emits:

```
event YieldMapPublished(address indexed agent, string ipfsHash, uint256 timestamp);
```

The `ipfsHash` is the CID of the signed Yield Map JSON.

## What Scout does

Every 60 seconds, Scout:

1. Pulls the full Mantle pool universe from DefiLlama (`yields.llama.fi/pools`).
2. Filters to pools whose project maps to a known protocol in Scout's source map (Aave, Ondo, Ethena, mETH, Mantle Vault / MI4, CIAN, Agni, Merchant Moe, fBTC).
3. Enriches each opportunity with two off-chain signals: depeg history from CoinGecko (stable underlyings only), smart-money holder data from Nansen.
4. Pulls static metadata per protocol from `protocolConfig.ts`: audit factor, oracle type, counterparty class, contract age in days. These are hand-maintained and revised when a new protocol is added.
5. Scores each opportunity using the method documented in `scoring-methodology.md`. The hash of that file is included on every published Yield Map as `methodologyHash`.
6. Tags each opportunity with the tranches it qualifies for: senior, mezzanine, junior, or none. Mandates are nested, so a senior-eligible opportunity is also mezzanine and junior eligible.
7. Builds a canonical JSON Yield Map (sorted keys, no whitespace), signs it with the Scout key, pins to Lighthouse, and emits `publishYieldMap(ipfsHash)` on `AgentEventBus`.
8. Holds the last published CID in memory. If the next cycle produces the same CID, the on-chain emit is skipped. The chain log itself is the historical record.

## What Scout does not do

- Scout does not allocate capital.
- Scout does not sign trades.
- Scout does not decide what enters or leaves any tranche. Architect does that, reading Scout's Yield Map as input.
- Scout does not write to any contract other than `AgentEventBus.publishYieldMap`. Specifically, Scout is not authorized to call `proposeAllocation`, `issueRiskVerdict`, `emitHedgeSignal`, or `logHedge`. The role check on the bus rejects those calls.
- Scout does not persist a local mirror of its published history. Queries about prior cycles go to the chain log and IPFS.

## Data sources

External integrations are limited to four:

| Source | Used for | Auth |
|---|---|---|
| DefiLlama | Yield discovery, APY, TVL across all Mantle pools | None |
| CoinGecko | 365 day daily price for stable depeg analysis | Demo API key |
| Nansen | Smart-money holders, fresh wallet inflows, wash-trade flags | Paid API key |
| Lighthouse | IPFS pin for Yield Maps and this strategy doc | API key |

Mantle RPC (Alchemy with public.publicgoods.network fallback) is used to emit the on-chain event. No other external integrations are permitted in v1.

## Failure modes and how Scout handles them

- A source fetcher times out or throws: that source is marked degraded in the Yield Map metadata, the cycle continues with whatever opportunities were ingested.
- An enrichment call fails (Nansen 429, CoinGecko 500, etc): the corresponding risk field is set to null on that opportunity and `confidence` drops. Never default to an optimistic value.
- A Yield Map cycle produces zero opportunities: skip publication. Publishing an empty map would lie about what Scout sees.
- Lighthouse pin fails after 2 retries: skip this cycle's on-chain emit. The next cycle retries.
- On-chain tx fails after 2 retries: skip this cycle's record-keeping, alert metrics, continue.

## Versioning

This is v1. When the methodology changes, a new file `strategy-v2.md` is pinned and the identity NFT's CID is updated through `updateStrategyCid`. The on-chain trail of CID changes is itself the version log. Old strategy docs remain readable via their CIDs.

## Verifying a published Yield Map

1. Take the `ipfsHash` from a `YieldMapPublished` event on `AgentEventBus`.
2. Fetch the JSON from `https://gateway.lighthouse.storage/ipfs/{cid}` or any IPFS gateway.
3. Compute `keccak256` over the canonical serialization of the JSON with `signature` cleared to `""`. Confirm it matches the contained `mapHash`.
4. Recover the address from `signature` over `mapHash` (EIP-191). Confirm it matches the `publisher.address`, which matches the `agent` field on the event.
5. Verify `methodologyHash` matches the sha256 of the `scoring-methodology.md` linked from Scout's ERC-8004 identity at the time of publish.

If all four match, the Yield Map is exactly what Scout signed at that block.
