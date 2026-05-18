# Strata setup

Everything you need to get Scout running locally, the API keys you need to gather, how to test the pipeline, and how to wire Scout's identity to the on-chain ERC-8004 registry once the contracts are deployed.

For the system-level architecture and how ERC-8004 actually works conceptually, see [`README.md`](README.md). For Scout-specific design and operating rules, see [`agents/scout/README.md`](agents/scout/README.md).

## Prerequisites

- macOS or Linux (Windows via WSL works, untested)
- Node.js 22 or newer
- pnpm 9 (we use `pnpm@9.12.0` per `package.json`). Install via `corepack enable && corepack prepare pnpm@9.12.0 --activate`
- git
- A funded Mantle Sepolia or Mantle mainnet account if you plan to actually emit events on chain (not required for tests)

## Clone and install

```bash
git clone <repo-url> strata
cd strata
pnpm install
pnpm --filter @strata/scout build
pnpm --filter @strata/scout test
```

You should see all 62 unit tests pass and a clean TypeScript build. If that works, your environment is ready.

## API keys you need

Scout uses four external services. Three need keys; one is open.

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

Then edit `agents/scout/.env`:

```
MANTLE_RPC_URL=https://mantle-mainnet.g.alchemy.com/v2/<your-key>
SCOUT_PRIVATE_KEY=0x<your-private-key>
AGENT_EVENT_BUS_ADDRESS=0x<deployed-by-contracts-engineer>
LIGHTHOUSE_API_KEY=<your-lighthouse-key>
COINGECKO_API_KEY=<your-coingecko-demo-key>
NANSEN_API_KEY=<your-nansen-key>
CYCLE_INTERVAL_MS=60000
LOG_LEVEL=info
```

`AGENT_EVENT_BUS_ADDRESS` comes from the contracts engineer. Until those contracts are deployed, you can use a placeholder (any valid 40-hex address) and rely on the unit tests for verification. The on-chain emit path is fully covered by `tests/unit/onchain.test.ts` using mocked clients.

## Testing

Three layers.

### 1. Unit tests

```bash
pnpm --filter @strata/scout test
```

Runs the full vitest suite (62 tests across 17 files). Covers:

- Schema validation (zod)
- DefiLlama fetcher with project-to-source mapping (msw-mocked HTTP)
- Ingestion orchestrator (timeout isolation, failure isolation, invalid-opportunity filtering)
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

All HTTP is msw-intercepted. All chain calls are viem-mocked. Tests run in under 5 seconds.

### 2. Build verification

```bash
pnpm --filter @strata/scout build
```

Strict TypeScript with `noUncheckedIndexedAccess` and `exactOptionalPropertyTypes` on. Any drift in types fails here.

### 3. Live dry-run

Once your `.env` is filled in and contracts are deployed, run the worker entrypoint:

```bash
pnpm --filter @strata/scout dev
```

You should see logs every `CYCLE_INTERVAL_MS` indicating one cycle ran. Metrics are exposed via `prom-client` and intended to be served on `/metrics` (HTTP wiring lives in the consumer; not exposed in the stub `index.ts` yet).

If you want to verify the IPFS pipeline alone without on-chain emit, run the strategy upload script:

```bash
pnpm --filter @strata/scout exec tsx scripts/upload-strategy.ts
```

It pins both docs to Lighthouse and prints `{ strategyCid, methodologyCid, methodologyHash }`. If that succeeds, Lighthouse is working.

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
| `lighthouse 401` during pin | bad API key | regenerate key in Lighthouse dashboard, paste into `.env` |
| `lighthouse 413` during pin | payload too large | should not happen for normal maps; if it does, investigate why opportunities ballooned |
| Nansen returns null repeatedly | rate limit or unfunded key | check quota in Nansen dashboard, confidence drops but Scout keeps cycling |
| CoinGecko returns `429` | rate limit on Demo tier | wait a minute, or upgrade plan. Depeg fields go null, confidence drops |
| `NotAuthorized` revert on `publishYieldMap` | role not granted | run step 3 above to grant `Role.Scout` |
| Tests hang on `ipfs.test.ts` retry case | network blip making real call | rerun, tests use msw and should not hit the network |
| `tx reverted` from `publishOnChain` | revert reason missing | check that `bus.roleOf(scoutAddress) == 1`, then re-emit |

## Quick reference

```bash
# install + build + test
pnpm install
pnpm --filter @strata/scout build
pnpm --filter @strata/scout test

# upload strategy + methodology, get CIDs
pnpm --filter @strata/scout exec tsx scripts/upload-strategy.ts

# run live (requires .env filled in)
pnpm --filter @strata/scout dev

# check Scout's identity on-chain
cast call <identity-address> "tokenOf(address)(uint256)" <scoutAddress> --rpc-url $MANTLE_RPC_URL
cast call <bus-address> "roleOf(address)(uint8)" <scoutAddress> --rpc-url $MANTLE_RPC_URL

# scan for recent Scout events
cast logs --rpc-url $MANTLE_RPC_URL \
  --from-block latest-50 \
  --address <bus-address> \
  "YieldMapPublished(address,string,uint256)" <scoutAddress>
```

That's the whole setup. The contracts engineer ships `AgentEventBus` + the Identity Registry, you wire Scout's address into both, and the loop starts producing verifiable on-chain artifacts.
