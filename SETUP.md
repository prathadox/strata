# Strata setup

Everything you need to get Scout running locally, the API keys you need to gather, how to run the pipeline today (before contracts are deployed), and how to wire Scout's identity to the on-chain ERC-8004 registry once the contracts ship.

For the system-level architecture and how ERC-8004 actually works conceptually, see [`README.md`](README.md). For Scout-specific design and operating rules, see [`agents/scout/README.md`](agents/scout/README.md).

## TL;DR (contracts not deployed yet)

You can run the full Scout pipeline today, off-chain only, with one env flag:

```bash
cp agents/scout/.env.example agents/scout/.env
# edit .env: fill in LIGHTHOUSE_API_KEY, COINGECKO_API_KEY, NANSEN_API_KEY,
#            MANTLE_RPC_URL, SCOUT_PRIVATE_KEY, and set SCOUT_DRY_RUN=true
pnpm install
pnpm --filter @strata/scout dev
```

Every 60 seconds you get a signed Yield Map pinned to Lighthouse. The on-chain emit is skipped and logged. When the contracts ship, flip `SCOUT_DRY_RUN=false`, set `AGENT_EVENT_BUS_ADDRESS`, and the same loop emits live events. Full details below.

## Prerequisites

- macOS or Linux (Windows via WSL works, untested)
- Node.js 22 or newer
- pnpm 9 (we use `pnpm@9.12.0` per `package.json`). Install via `corepack enable && corepack prepare pnpm@9.12.0 --activate`
- git
- A funded Mantle Sepolia or Mantle mainnet account, only if you plan to actually emit events on chain. Not required for the dry-run path or for tests.

## Clone and install

```bash
git clone <repo-url> strata
cd strata
pnpm install
pnpm --filter @strata/scout build
pnpm --filter @strata/scout test
```

You should see all 64 unit tests pass across 16 test files and a clean TypeScript build. If that works, your environment is ready.

## API keys you need

Scout uses four external services. Three need keys; one is open. **No LLM key (OpenAI, Anthropic, etc.) is needed.** Scout's scoring is deterministic arithmetic; no model calls anywhere in the pipeline. The "no LLM" guarantee is what makes the integrity checks reproducible.

### 1. Lighthouse (IPFS pin)

Used for: pinning every Yield Map, strategy doc, and methodology doc.

- Sign up at https://files.lighthouse.storage
- From the dashboard, generate an API key
- Free tier covers comfortably more than we need for the demo

Env var: `LIGHTHOUSE_API_KEY`

### 2. CoinGecko (depeg history)

Used for: 365 days of daily price data on stable underlyings (USDY, sUSDe, USDe, USDC.e, USDT) to estimate `p_depeg`.

- Sign up at https://www.coingecko.com/en/api
- Pick the Demo plan, it is free
- Generate a Demo API key

Env var: `COINGECKO_API_KEY`

### 3. Nansen (smart-money signals)

Used for: smart-money holder share, fresh-wallet inflow percent, wash-trade flag per asset. The one paid integration we accept.

- Apply at https://www.nansen.ai/
- Request API access (Pro or higher tier)
- Generate an API key from the team dashboard
- If you do not have a Nansen key yet, Scout still runs. The smart-money enricher returns `null` on 401 or 429 and the confidence on those opportunities drops accordingly. The cycle does not crash.

Env var: `NANSEN_API_KEY`

### 4. Mantle RPC

Used for: emitting `publishYieldMap` events on `AgentEventBus`, reading the ERC-8004 identity contract.

- Primary: get an Alchemy app for Mantle at https://www.alchemy.com/. Copy the HTTPS endpoint
- Fallback (free, public, lower throughput): `https://mantle.publicgoods.network`

Env vars: `MANTLE_RPC_URL` for primary, optional `MANTLE_RPC_URL_FALLBACK` (defaults to the public endpoint)

### 5. DefiLlama (yield universe)

No key. `https://yields.llama.fi/pools` is open. Nothing to do.

## Scout keypair

Scout needs a private key to sign Yield Maps (EIP-191) and to emit on-chain events as the registered Scout role.

Generate one with cast (Foundry) or with viem:

```bash
# Foundry
cast wallet new

# or with viem (one-liner)
node -e "import('viem/accounts').then(m => { const pk = m.generatePrivateKey(); console.log('pk:', pk); console.log('addr:', m.privateKeyToAccount(pk).address); })"
```

Record both the private key and the address. The private key goes into `.env`. The address is what the deployer will use when calling `bus.setRole` and `identity.register`.

Env var: `SCOUT_PRIVATE_KEY`

Treat this key like any production secret. Never commit it. The `.env` file is in `.gitignore`. For team use, share via 1Password or your secret manager of choice.

## Configure your `.env`

Copy the example and fill in the values above:

```bash
cp agents/scout/.env.example agents/scout/.env
```

Then edit `agents/scout/.env`. Two profiles:

### Profile A: dry-run (contracts not deployed yet)

This is the right profile today. Scout runs the full off-chain pipeline and skips the on-chain emit.

```
MANTLE_RPC_URL=https://mantle-mainnet.g.alchemy.com/v2/<your-key>
SCOUT_PRIVATE_KEY=0x<your-private-key>
SCOUT_DRY_RUN=true
AGENT_EVENT_BUS_ADDRESS=
LIGHTHOUSE_API_KEY=<your-lighthouse-key>
COINGECKO_API_KEY=<your-coingecko-demo-key>
NANSEN_API_KEY=<your-nansen-key>
CYCLE_INTERVAL_MS=60000
LOG_LEVEL=info
```

What runs: DefiLlama ingest, zod normalization, CoinGecko + Nansen enrichment, RAAPY scoring, per-tranche aggregation, EIP-191 signing, Lighthouse pin. What doesn't: the `bus.publishYieldMap` call. Each cycle ends with a log line like:

```
{"level":"warn","ipfsHash":"bafkrei...","msg":"DRY RUN: skipping on-chain publishYieldMap, would have emitted this CID"}
```

Take that CID and fetch the JSON from `https://gateway.lighthouse.storage/ipfs/<cid>` to inspect a real signed Yield Map produced by the live code. That's the entire integrity chain except for the last on-chain hop.

### Profile B: live (contracts deployed and Scout role granted)

When the contracts engineer ships `AgentEventBus` and you have a `tokenId` registered on the Identity contract plus `Role.Scout` set on the bus, flip the flag and fill in the bus address:

```
MANTLE_RPC_URL=https://mantle-mainnet.g.alchemy.com/v2/<your-key>
SCOUT_PRIVATE_KEY=0x<your-private-key>
SCOUT_DRY_RUN=false
AGENT_EVENT_BUS_ADDRESS=0x<deployed-bus-address>
LIGHTHOUSE_API_KEY=<your-lighthouse-key>
COINGECKO_API_KEY=<your-coingecko-demo-key>
NANSEN_API_KEY=<your-nansen-key>
CYCLE_INTERVAL_MS=60000
LOG_LEVEL=info
```

Same loop, now with on-chain emission. Same CIDs as dry-run for byte-identical inputs (deterministic canonicalization), so you can verify that nothing changed at the boundary.

## Testing

Three layers, in order of "how confident do I want to be."

### 1. Unit tests (no network, no env required)

```bash
pnpm --filter @strata/scout test
```

64 tests across 16 files. Covers:

- Config loader (required env, missing var detection, dry-run path with optional bus address)
- Canonical schemas (zod boundaries)
- DefiLlama fetcher with project-to-source mapping (msw-mocked HTTP)
- Ingestion orchestrator (timeout isolation, failure isolation, invalid-opportunity drop)
- CoinGecko depeg history (deviation compression into events)
- Nansen smart-money enricher (happy path, 429, 500, bad shape all return null)
- Static protocol config map (every SourceProtocol has an entry)
- Scoring (senior-grade math, exploit elevation, missing-enrichment confidence drop, TVL-proxy illiquidity, frozen constants snapshot)
- Aggregation (tranche partitioning, nested eligibility tagging, rejection reasons, score-desc ordering)
- Lighthouse IPFS pin (success, retry, exhaustion, bad shape)
- Canonical-JSON signing (key sorting, nesting, idempotency, recoverable signature)
- On-chain publish wrapper (correct args, retry, reverted receipt rejection)
- End-to-end orchestrator (full cycle, zero-opp early exit, dedup skip)
- LastPublished dedup state
- Health state (pre-cycle unhealthy, healthy within 2x interval, unhealthy beyond)
- Run loop (cycle counting, error handling, abort signal)

All HTTP is msw-intercepted. All chain calls are viem-mocked. The full suite runs in under 8 seconds.

### 2. Build verification

```bash
pnpm --filter @strata/scout build
```

Strict TypeScript with `noUncheckedIndexedAccess` and `exactOptionalPropertyTypes` on. Any drift in types fails here.

### 3. Live cycle against real services

With `.env` filled in (either profile, but A is fine today), boot the worker:

```bash
pnpm --filter @strata/scout dev
```

You should see one log line per `CYCLE_INTERVAL_MS` (default 60s) like:

```
{"opps":7,"senior":2,"mezz":4,"junior":1,"ms":1240,"msg":"cycle complete"}
```

In dry-run mode each cycle also prints the CID it would have emitted:

```
{"level":"warn","ipfsHash":"bafkrei...","msg":"DRY RUN: skipping on-chain publishYieldMap, would have emitted this CID"}
```

To run it long-lived without a foreground terminal:

```bash
nohup pnpm --filter @strata/scout dev > scout.log 2>&1 &
tail -f scout.log
```

If you want to validate the Lighthouse pipeline in isolation (just IPFS, no cycle), run the strategy upload script:

```bash
pnpm --filter @strata/scout exec tsx scripts/upload-strategy.ts
```

It pins both docs to Lighthouse and prints `{ strategyCid, methodologyCid, methodologyHash }`. If that succeeds, your Lighthouse key works and the full pipeline will too.

## ERC-8004 linking

Once the contracts engineer deploys `IAgentEventBus`, `AgentEventBus`, and the ERC-8004 Identity Registry, you wire Scout to its identity in this order. All on-chain steps are done by the protocol deployer, not by Scout itself.

### Step 1, pin Scout's strategy docs

```bash
pnpm --filter @strata/scout exec tsx scripts/upload-strategy.ts
```

Output looks like:

```json
{
  "strategyCid": "bafkrei...",
  "methodologyCid": "bafkrei...",
  "methodologyHash": "0x..."
}
```

Capture all three. The `strategyCid` goes on-chain in the next step. The `methodologyHash` is the value Scout will embed in every Yield Map.

### Step 2, mint Scout's identity NFT

The Identity Registry owner calls:

```solidity
identity.register(scoutAddress, strategyCid);
```

Returns a `tokenId`. From this point, anyone calling `identity.tokenOf(scoutAddress)` gets the token, and `identity.tokenURI(tokenId)` returns metadata pointing at `strategyCid`.

If you have `cast`:

```bash
cast send <identity-address> "register(address,string)" <scoutAddress> "bafkrei..." \
  --rpc-url $MANTLE_RPC_URL --private-key <deployer-pk>
```

### Step 3, grant Scout the bus role

The `AgentEventBus` owner calls:

```solidity
bus.setRole(scoutAddress, Role.Scout);
```

From now on, only `scoutAddress` can call `bus.publishYieldMap(string)`. Other callers revert with `NotAuthorized`.

If you have cast:

```bash
cast send <bus-address> "setRole(address,uint8)" <scoutAddress> 1 \
  --rpc-url $MANTLE_RPC_URL --private-key <owner-pk>
```

(Role enum: `None=0, Scout=1, Architect=2, Sentinel=3, Operator=4`.)

### Step 4, verify the wiring

Confirm the identity exists:

```bash
cast call <identity-address> "tokenOf(address)(uint256)" <scoutAddress> --rpc-url $MANTLE_RPC_URL
# returns the tokenId

cast call <identity-address> "strategyCidOf(uint256)(string)" <tokenId> --rpc-url $MANTLE_RPC_URL
# returns the strategyCid you registered
```

Confirm the role is set:

```bash
cast call <bus-address> "roleOf(address)(uint8)" <scoutAddress> --rpc-url $MANTLE_RPC_URL
# returns 1 for Role.Scout
```

### Step 5, start Scout and verify the first event

Boot the worker:

```bash
pnpm --filter @strata/scout dev
```

Wait one cycle interval (60s by default). Then scan recent blocks for `YieldMapPublished`:

```bash
cast logs --rpc-url $MANTLE_RPC_URL \
  --from-block latest-50 \
  --address <bus-address> \
  "YieldMapPublished(address,string,uint256)" <scoutAddress>
```

You should see one event. Extract the `ipfsHash` (second arg). Fetch the map JSON:

```bash
curl https://gateway.lighthouse.storage/ipfs/<ipfsHash>
```

The JSON should have `publisher.address == scoutAddress`, `methodologyHash` matching the value you captured in step 1, and a `signature` that recovers to `scoutAddress` over the canonical-unsigned bytes. That confirms the full verification chain works end to end.

### Strategy updates without re-minting

When `scoring-methodology.md` or `strategy-v1.md` change, do not mint a new identity. Pin a new doc and update the CID on the existing token:

```bash
# rerun the upload script
pnpm --filter @strata/scout exec tsx scripts/upload-strategy.ts
# capture newStrategyCid

# deployer calls:
cast send <identity-address> "updateStrategyCid(uint256,string)" <scoutTokenId> "<newStrategyCid>" \
  --rpc-url $MANTLE_RPC_URL --private-key <owner-pk>
```

Old CIDs remain readable from IPFS forever. The on-chain log of `updateStrategyCid` events is the strategy's version history.

## Troubleshooting

| Symptom | Likely cause | Fix |
|---|---|---|
| `Config error: MANTLE_RPC_URL` on boot | env var missing | check `agents/scout/.env`, ensure all required vars are set |
| `Config error: AGENT_EVENT_BUS_ADDRESS required when SCOUT_DRY_RUN is not set to true` | live profile selected without a bus address | set `SCOUT_DRY_RUN=true` for now, or fill in the bus address once contracts deploy |
| `lighthouse 401` during pin | bad API key | regenerate key in Lighthouse dashboard, paste into `.env` |
| `lighthouse 413` during pin | payload too large | should not happen for normal maps; if it does, investigate why opportunities ballooned |
| Nansen returns null repeatedly | rate limit or unfunded key | check quota in Nansen dashboard, confidence drops but Scout keeps cycling |
| CoinGecko returns `429` | rate limit on Demo tier | wait a minute, or upgrade plan. Depeg fields go null, confidence drops |
| `NotAuthorized` revert on `publishYieldMap` | role not granted | run ERC-8004 step 3 above to grant `Role.Scout` |
| `tx reverted` from `publishOnChain` | revert reason missing | check that `bus.roleOf(scoutAddress) == 1`, then re-emit |
| Tests hang on `ipfs.test.ts` retry case | network blip making real call | rerun, tests use msw and should not hit the network |
| `Cycle complete` log shows `opps:0` repeatedly | DefiLlama has no Mantle pools at the moment, or project map is stale | check the project list in `src/pipeline/ingestion/sources/defiLlama.ts` matches DefiLlama's current `project` slugs for Mantle |
| Web dev server shows unstyled page | dev server serving stale HTML referencing old CSS hash | hard reload Cmd+Shift+R, or kill `next dev` and restart |

## Quick reference

```bash
# install + build + test
pnpm install
pnpm --filter @strata/scout build
pnpm --filter @strata/scout test

# run Scout off-chain only (contracts not deployed yet)
# set SCOUT_DRY_RUN=true in agents/scout/.env first
pnpm --filter @strata/scout dev

# pin strategy + methodology docs to Lighthouse, print CIDs
pnpm --filter @strata/scout exec tsx scripts/upload-strategy.ts

# once contracts are deployed and Scout role is granted:
# flip SCOUT_DRY_RUN=false, set AGENT_EVENT_BUS_ADDRESS, restart dev

# check Scout's identity on-chain (live mode only)
cast call <identity-address> "tokenOf(address)(uint256)" <scoutAddress> --rpc-url $MANTLE_RPC_URL
cast call <bus-address> "roleOf(address)(uint8)" <scoutAddress> --rpc-url $MANTLE_RPC_URL

# scan for recent Scout events (live mode only)
cast logs --rpc-url $MANTLE_RPC_URL \
  --from-block latest-50 \
  --address <bus-address> \
  "YieldMapPublished(address,string,uint256)" <scoutAddress>

# run the web landing locally
pnpm --filter @strata/web dev
# then http://localhost:3000
```

That's the whole setup. Today you run profile A (dry-run) and verify the off-chain stack end-to-end. When the contracts engineer ships `AgentEventBus` and the Identity Registry, you flip the flag, wire Scout's address into both, and the same loop starts producing verifiable on-chain artifacts.
