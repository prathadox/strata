# Scout

The yield sourcing agent for Strata. Scout scans the Mantle yield universe every 60 seconds, scores each opportunity on a transparent risk-adjusted basis, and publishes a signed Yield Map on IPFS with an on-chain pointer. Scout owns no capital and makes no allocation decisions. It produces the canonical "what yield is available, and what it costs in risk" feed the other four agents consume.

For the system-level picture (all five agents, the event bus, ERC-8004 identity), see [`../README.md`](../README.md).

## Status

62 unit tests passing. Off-chain pipeline is feature complete: ingest, enrich, score, aggregate, sign, pin, on-chain emit, run loop, health, metrics. The on-chain integration test waits on the contracts engineer to deploy `AgentEventBus` and the ERC-8004 identity contract.

## Quickstart

```bash
# from repo root
pnpm install
pnpm --filter @strata/scout build
pnpm --filter @strata/scout test
```

That gets you a clean build and the test suite. To run a live cycle you need API keys and a Mantle RPC. See **Environment** below.

## What Scout does, in order

1. **Ingest.** Pull every Mantle pool from DefiLlama (`yields.llama.fi/pools`). Filter to pools whose `project` maps to a known `SourceProtocol`. Today that's `aave-v3`, `ondo-finance`, `ethena`, `mantle-staked-ether`, `mantle-mi4`, `cian-protocol`, `agni-finance`, `merchant-moe`, `fbtc`. Unknown projects are dropped.

2. **Enrich.** For each stable underlying, fetch 365 days of daily price from CoinGecko and compress deviation episodes into `DepegEvent[]`. For each asset, call Nansen for smart-money holders, fresh-wallet inflows, and a wash-trade flag. Both calls degrade gracefully: on 429, 5xx, or unexpected shape they return `null`. Never default to optimistic.

3. **Score.** Run the first-principles risk-adjusted model documented in `docs/scoring-methodology.md`. The sha256 of that doc is the `methodologyHash` stamped on every published map. Each opportunity gets:
   - five independent failure-mode probabilities (`exploit`, `depeg`, `oracle`, `illiquid`, `counterparty`)
   - an annualised `expectedLoss = sum(p_i * alpha_i)`
   - `raapy = apy - expectedLoss`
   - `confidence` from data freshness and enrichment completeness
   - `score = raapy * confidence`

4. **Aggregate.** Tag each scored opportunity with the tranches it qualifies for under nested mandates (senior, mezzanine, junior). Senior requires `expectedLoss <= 0.01`, `p_exploit <= 0.05`, `p_depeg <= 0.01`, `tvlUsd >= $50M`. Mezzanine and junior loosen each cap. Each opportunity carries `eligibleTranches`, `primaryTranche`, and per-tranche `rejectionReasons` so the transparency dashboard can explain why USDY didn't make it into senior on a given cycle.

5. **Sign.** Canonical-JSON the map with sorted keys and no whitespace. `mapHash = keccak256(canonicalBytes)`. Sign with the Scout key over the hash (EIP-191).

6. **Pin.** Upload to Lighthouse with two retries. Returns the CID.

7. **Publish.** Call `AgentEventBus.publishYieldMap(ipfsHash)` from the Scout-roled account. Wait for receipt. Record the CID in memory so the next cycle skips re-publishing if nothing changed.

8. **Loop.** `setInterval`-style wait for `CYCLE_INTERVAL_MS`, then start again. Errors in any step increment `scout_cycles_failed` and the loop keeps going.

## External integrations (locked at four)

| Source | Purpose | Auth |
|---|---|---|
| DefiLlama | Full Mantle pool universe, APY, TVL | None |
| CoinGecko | 365d daily price for depeg analysis | Demo API key |
| Nansen | Smart-money signals | Paid API key |
| Lighthouse | IPFS pin | API key |

Plus Mantle RPC for emitting events and reading the identity NFT. Nothing else. Mantlescan, Ondo API, Ethena API, CIAN API, Pinata, web3.storage, 1inch, Odos, Allora, OraKle, Agni/Merchant Moe subgraphs are all explicitly out of scope. If we ever need more accuracy on one protocol, that comes in as an on-chain *override* fetcher, not a new API integration.

## Environment

`agents/scout/.env.example` is the source of truth. Required:

```
MANTLE_RPC_URL=https://rpc.mantle.xyz
SCOUT_PRIVATE_KEY=0x...                  # Scout's signing key (same address that gets Role.Scout on the bus)
AGENT_EVENT_BUS_ADDRESS=0x...            # deployed by the contracts engineer
LIGHTHOUSE_API_KEY=...
COINGECKO_API_KEY=...                    # Demo tier is fine
NANSEN_API_KEY=...                       # paid
CYCLE_INTERVAL_MS=60000
LOG_LEVEL=info
```

Optional fallback: `MANTLE_RPC_URL_FALLBACK` (defaults to `https://mantle.publicgoods.network`).

## Project layout

```
agents/scout/
  src/
    index.ts                          # entrypoint (boots config, clients, run loop)
    config.ts                         # zod-validated env loader
    types.ts                          # canonical schemas (YieldOpportunity, ScoredOpportunity, YieldMap, Tranche)
    chain/
      client.ts                       # viem PublicClient + WalletClient on Mantle (chain id 5000) with RPC fallback
    pipeline/
      ingestion/
        sourceFetcher.ts              # SourceFetcher interface
        sources/defiLlama.ts          # the canonical fetcher, project -> source map
        index.ts                      # runIngestion: parallel, isolated per-source, timeouts
      enrichment/
        protocolConfig.ts             # static per-protocol map: auditFactor, oracleType, counterpartyClass, contractAgeDays
        depegHistory.ts               # CoinGecko 365d -> DepegEvent[]
        smartMoneyFlow.ts             # Nansen holders summary -> SmartMoneySignal | null
      scoring.ts                      # RAAPY + confidence, frozen SCORING_CONSTANTS
      aggregation.ts                  # MANDATES + per-tranche tagging + score-sorted lists
      orchestrator.ts                 # runCycle: ingest -> enrich -> score -> aggregate -> publish
    publication/
      signer.ts                       # canonicalStringify + signYieldMap (EIP-191)
      ipfs.ts                         # Lighthouse pin with retry
      onchain.ts                      # publishOnChain wrapper around AgentEventBus.publishYieldMap
      publish.ts                      # Publisher interface, makePublisher factory
      abi/agentEventBus.ts            # minimal ABI for the one function Scout calls
    cache/
      lastPublished.ts                # in-memory dedup state (no persistence; chain log is the history)
    monitor/
      health.ts                       # HealthState: healthy iff last cycle within 2x interval
      metrics.ts                      # prom-client counters and gauges
    runLoop.ts                        # runScoutLoop: drives runCycle on a timer
  docs/
    strategy-v1.md                    # what Scout does and doesn't do (pinned to IPFS, linked from identity NFT)
    scoring-methodology.md            # the algorithm with worked examples (sha256 is methodologyHash)
  scripts/
    upload-strategy.ts                # pin both docs to Lighthouse, print CIDs and methodologyHash
  tests/
    unit/                             # vitest, msw-mocked HTTP, viem mocked
```

## How Scout fits the event bus

Scout is one of four agents that emits through the shared `AgentEventBus` contract. The role bootstrap is:

1. Generate the Scout keypair off-chain. The address is the agent's permanent on-chain identity.
2. Pin `docs/strategy-v1.md` and `docs/scoring-methodology.md` to Lighthouse via `pnpm --filter @strata/scout exec tsx scripts/upload-strategy.ts`. The script prints `{ strategyCid, methodologyCid, methodologyHash }`.
3. The owner of the ERC-8004 identity contract calls `identity.register(scoutAddress, strategyCid)`. That mints Scout's identity token.
4. The owner of `AgentEventBus` calls `bus.setRole(scoutAddress, Role.Scout)`. From that point Scout's address can call `publishYieldMap(string)` and the role check passes. Other addresses get reverted with `NotAuthorized`.
5. Scout's worker starts. Every cycle ends with `bus.publishYieldMap(ipfsHash)` from `scoutAddress`, which emits:

```
event YieldMapPublished(address indexed agent, string ipfsHash, uint256 timestamp);
```

Architect (and any dashboard) listens for this event via viem `watchContractEvent`. To verify a published map end-to-end:

- Read the event. Note `agent` and `ipfsHash`.
- Fetch the JSON from any IPFS gateway (Lighthouse, ipfs.io, dweb.link).
- Recover the EIP-191 signer over the canonical-unsigned hash. The recovered address must equal `agent`.
- Look up `agent` in the identity contract. The token's current strategy CID must match what the map declares.
- The map's `methodologyHash` must equal the sha256 of `scoring-methodology.md` linked from that strategy doc.

If all match, you have proven the map was produced by the registered Scout under its declared rules. Anyone can cite or replay it.

## How to update the strategy

Strategy docs are versioned. When the methodology or sources change, do not mint a new identity. Pin a new doc and update the CID on the existing token:

```bash
pnpm --filter @strata/scout exec tsx scripts/upload-strategy.ts
# capture the new strategyCid from output
# then have the owner call:
# identity.updateStrategyCid(scoutTokenId, newCid)
```

Old CIDs remain readable from IPFS. The chain log of `updateStrategyCid` calls is itself the version history.

## Running tests

```bash
pnpm --filter @strata/scout test              # one-shot
pnpm --filter @strata/scout test:watch        # watch mode
```

The suite covers the full off-chain pipeline. HTTP calls are msw-intercepted. Chain calls use viem mocks. There is no integration test against the real `AgentEventBus` in this package yet; that lands once the contract is deployed.

## Running a live cycle

Once you have a deployed `AgentEventBus` address, the Scout role granted, and a funded Scout key on Mantle Sepolia or mainnet, fill in `.env` and run:

```bash
pnpm --filter @strata/scout dev
```

You should see one cycle every `CYCLE_INTERVAL_MS`. The first successful cycle moves the agent to healthy. Metrics on `/metrics`, health on `/healthz` (HTTP server wiring is in `runLoop` consumers, not exposed yet in the entrypoint stub).

## Failure modes

- A source fetcher throws or times out: marked degraded in the map metadata, the cycle continues.
- An enricher returns null: the corresponding risk field stays null, confidence drops accordingly.
- Lighthouse pin fails after 2 retries: skip this cycle's on-chain emit. Next cycle retries.
- On-chain tx reverts: retry up to twice with backoff. After that, log and continue.
- Zero opportunities in a cycle: do not publish. Empty maps would lie about Scout's view.
- Same CID as last cycle: skip the on-chain emit. The chain log doesn't need duplicate events.

## Things Scout never does

- Move capital. That's Architect plus Sentinel plus the TrancheVault contract.
- Sign trades.
- Decide tranche allocations. Scout publishes eligibility tags, Architect decides.
- Write to any contract other than `AgentEventBus.publishYieldMap`. The role check would reject anything else.
- Persist a local mirror of its event history. Queries about prior cycles go to the chain log and IPFS.
