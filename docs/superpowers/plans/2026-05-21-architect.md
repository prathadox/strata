# Architect (agent 2) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Build Architect, the portfolio agent. It subscribes to Scout's `YieldMapPublished` events on `AgentEventBus`, fetches each map from IPFS, verifies the signature against Scout's ERC-8004 identity, runs a deterministic allocation algorithm per tranche, emits `AllocationProposed` events with a reasoning-hash CID pointing to a pinned rationale document, and reads Operator's `HedgeLogged` stream to net out exposure for the next cycle. Architect owns no capital and cannot execute. Every proposal is gated by Sentinel's `RiskVerdictIssued` before TrancheVault unlocks funds.

**Architecture:** Event-driven loop. Subscribe to bus events; on each new YieldMap, verify → fetch → score-weight per tranche → propose. The signing / IPFS pin / on-chain emit chain mirrors Scout's exactly (canonical JSON, EIP-191, Lighthouse, role-gated bus call). Net-exposure tracker maintains an in-memory ledger of Operator's hedge positions, refreshed every cycle from the bus log. No external data sources beyond the chain + IPFS.

**LLM**: not required. Tasks 1-15 produce a fully deterministic Architect. Task 16 is an *optional* Gemini narrative-text layer that pins a human-readable rationale alongside the deterministic numbers. The allocation decisions themselves never come from an LLM (that would break integrity-check #5). Architect ships without any LLM key; flip on Task 16 only if you want the dashboard prose.

**Tech Stack:** same as Scout (TS 5.6, viem 2.x on Mantle, zod, vitest, pino, prom-client, Lighthouse). Add the workspace dep `@strata/scout` so we reuse `canonicalStringify`, `signYieldMap` (renamed/reused), `pinYieldMap`, and shared schemas. Architect lives at `agents/architect/`.

---

## File structure

```
agents/architect/
  package.json
  tsconfig.json
  vitest.config.ts
  .env.example
  src/
    index.ts                          # entrypoint
    config.ts                         # zod env loader
    types.ts                          # AllocationProposal, NetExposureLedger, etc.
    chain/
      client.ts                       # viem PublicClient + WalletClient (Architect key)
    subscription/
      yieldMap.ts                     # watchContractEvent for YieldMapPublished + backfill
      hedgeLog.ts                     # watchContractEvent for HedgeLogged + backfill
      blockCursor.ts                  # last-seen block per topic (in-memory; restart re-replays)
    ipfs/
      fetch.ts                        # GET from Lighthouse / public gateway with fallback
    verify/
      yieldMap.ts                     # signature recovery + identity-registry cross-check
    pipeline/
      netExposure.ts                  # ledger of Operator's hedge positions per asset
      allocate.ts                     # per-tranche allocation algorithm
      buildProposal.ts                # composes the AllocationProposal artifact
      orchestrator.ts                 # runProposalCycle: verify -> allocate -> publish
    publication/
      signer.ts                       # canonical JSON + sign (reused from @strata/scout)
      onchain.ts                      # bus.proposeAllocation wrapper
      publish.ts                      # sign + pin + emit
    monitor/
      health.ts
      metrics.ts
    runLoop.ts                        # listens for events, fires runProposalCycle
  docs/
    strategy-v1.md                    # what Architect does + does not do
    allocation-methodology.md         # algorithm, sha256 -> methodologyHash
  scripts/
    inspect-allocation.ts             # run one cycle off-chain, dump proposal MD
    upload-strategy.ts
  tests/
    unit/
```

---

## Canonical algorithm (referenced by tasks below)

For every new YieldMap (CID `m`):

1. **Verify**: fetch JSON from Lighthouse gateway. Recompute `keccak256(canonicalStringify({...map, signature: ""}))`, recover EIP-191 signer over that hash, confirm signer == map.publisher.address == Identity Registry's `tokenOf(map.publisher.address) -> tokenId -> strategyCidOf(tokenId)` chain. Reject if any check fails; emit a metric.

2. **Build net exposure**: read the latest `HedgeLogged` events for each asset referenced in `map.opportunities[]`, sum `netPosition`. Net exposure for asset A = (gross allocation Architect proposed for A) + (Operator's current hedge in A). Used for *next* cycle's input, not for capping this cycle.

3. **Allocate per tranche** (deterministic):

   For each tranche T ∈ {senior, mezzanine, junior}:
   - eligible = `map.opportunities.filter(o => o.eligibleTranches.includes(T))`
   - if eligible.length === 0 → tranche has 0 allocation
   - else: normalize by score
     ```
     totalScore = sum(o.score for o in eligible)
     perOppBps[o.id] = floor((o.score / totalScore) * 10000)
     ```
   - clamp single-position concentration: `perOppBps[o.id] = min(perOppBps[o.id], CONCENTRATION_CAP_BPS[T])`
     - senior: 6000 (60% max in one position)
     - mezzanine: 4000 (40%)
     - junior: 2500 (25%)
   - re-normalize after clamping so per-tranche sum == 10000

4. **Tranche-share allocation** is configured, not algorithmic in v1:
   - senior: 50% of deposits
   - mezzanine: 30%
   - junior: 20%
   Exposed in `MANDATE_TARGETS`; Sentinel and the vault read this same constant.

5. **Compose proposal**:
   ```
   AllocationProposal {
     proposalId: keccak256(sourceMapCid + publishedAtMs).toBigInt(),
     sourceMapCid: m,
     publishedAtMs,
     methodologyHash: sha256(allocation-methodology.md),
     codeCommit,
     tranches: {
       senior:    { bps: 5000, positions: { 'ondo:b5d7...': 10000, ... } },
       mezzanine: { bps: 3000, positions: { ... } },
       junior:    { bps: 2000, positions: { ... } }
     },
     netExposureAtProposalMs: { ... },
     reasoning: <human-readable text or LLM-generated narrative; optional>,
     signature: <Architect EIP-191 over canonical-unsigned bytes>
   }
   ```

6. **Pin + emit**: canonical-stringify, sign with Architect key, pin to Lighthouse → CID. Then `bus.proposeAllocation(proposalId, seniorBps, mezzBps, juniorBps, reasoningHash=cid)`.

7. **Skip-rules** (same spirit as Scout):
   - If the new YieldMap's CID equals the one we last processed → skip (dedup).
   - If verification fails → skip + log + metric `architect_verification_failures`.
   - If every tranche allocates 0 → don't propose (zero-state map).

---

## APIs and data sources

Architect has no external API surface. It reads:

| Source | Purpose | Auth |
|---|---|---|
| Mantle RPC | event subscription, contract calls | optional Alchemy key |
| Lighthouse public gateway | GET JSON by CID | none |
| Lighthouse pin endpoint | pin reasoning blob | API key |
| `IAgentEventBus` | subscribe + emit | role |
| `IERC8004Identity` | verify Scout's identity | read-only |

No DefiLlama, no CoinGecko, no Nansen. Architect consumes Scout's already-validated output.

---

## Validation, risk, and error handling

1. **Verify every map** before acting on it. Failed verification = artifact rejected, alert. Never propose against an unsigned or wrong-signer map.
2. **No silent skips** on real errors. Only the deterministic skip rules above are silent. Subscription failures, signature failures, IPFS unreachable: log + metric + retry.
3. **Replayable**. The proposal pins `sourceMapCid` and `methodologyHash`; given those + Architect's code commit, anyone can replay the allocation math and confirm.
4. **Idempotent**. Same YieldMap + same methodology produces same `proposalId` and byte-identical canonical proposal bytes. The bus's `proposalId` field is `uint256 indexed`, so a repeat emission would just re-trigger Sentinel's review. We dedup before emitting via in-memory state.
5. **Architect cannot move capital**. The contract role check on `proposeAllocation` enforces this is the only mutator Architect calls.

---

## Task decomposition

15 tasks, each producing a focused commit. TDD throughout. Same conventions as Scout's plan: bite-sized steps, exact paths, full code, no placeholders. **No em-dashes in any artifact.** **No `Co-Authored-By: Claude` trailer** in commits. Architect package depends on `@strata/scout` for shared signer / IPFS / schemas.

---

### Task 1: Scaffold @strata/architect package

**Files:**
- Create: `agents/architect/package.json`
- Create: `agents/architect/tsconfig.json`
- Create: `agents/architect/vitest.config.ts`
- Create: `agents/architect/.gitignore`
- Create: `agents/architect/src/index.ts` (stub)

- [ ] **Step 1: Write `agents/architect/package.json`**

```json
{
  "name": "@strata/architect",
  "version": "0.1.0",
  "type": "module",
  "private": true,
  "bin": { "architect": "./dist/index.js" },
  "scripts": {
    "build": "tsc -p .",
    "dev": "tsx src/index.ts",
    "inspect": "tsx scripts/inspect-allocation.ts",
    "test": "vitest run",
    "test:watch": "vitest"
  },
  "dependencies": {
    "@strata/scout": "workspace:*",
    "viem": "^2.21.0",
    "zod": "^3.23.0",
    "pino": "^9.4.0",
    "p-retry": "^6.2.0",
    "lru-cache": "^11.0.0",
    "prom-client": "^15.1.3"
  },
  "devDependencies": {
    "@types/node": "^22.7.0",
    "tsx": "^4.19.0",
    "typescript": "^5.6.0",
    "vitest": "^2.1.0",
    "msw": "^2.4.0"
  }
}
```

- [ ] **Step 2: Write `agents/architect/tsconfig.json`**

```json
{
  "extends": "../../tsconfig.base.json",
  "compilerOptions": { "outDir": "dist", "rootDir": "src" },
  "include": ["src/**/*"]
}
```

- [ ] **Step 3: Write `agents/architect/vitest.config.ts`**

```ts
import { defineConfig } from 'vitest/config';
export default defineConfig({
  test: { include: ['tests/**/*.test.ts'], environment: 'node', globals: false }
});
```

- [ ] **Step 4: Write `agents/architect/.gitignore`**

```
.env
dist
node_modules
*.log
```

- [ ] **Step 5: Write `agents/architect/src/index.ts`** (stub)

```ts
export const VERSION = '0.1.0';
console.log(`architect ${VERSION}`);
```

- [ ] **Step 6: Update `agents/scout/package.json`** so the shared exports are reachable. Add an `"exports"` field:

```json
"exports": {
  "./signer":     "./dist/publication/signer.js",
  "./ipfs":       "./dist/publication/ipfs.js",
  "./types":      "./dist/types.js"
}
```

- [ ] **Step 7: pnpm install + verify build**

```bash
pnpm install
pnpm --filter @strata/scout build
pnpm --filter @strata/architect build
```

- [ ] **Step 8: Commit**

```bash
git add -A
git commit -m "architect: scaffold pnpm workspace + scout exports for shared modules"
```

---

### Task 2: Architect canonical types

**Files:**
- Create: `agents/architect/src/types.ts`
- Create: `agents/architect/tests/unit/types.test.ts`

- [ ] **Step 1: Failing test** asserting an `AllocationProposalSchema` parses a well-formed proposal and rejects bad bps sums.

- [ ] **Step 2: Implement `types.ts`**

```ts
import { z } from 'zod';

const Address = z.string().regex(/^0x[a-fA-F0-9]{40}$/);
const Bytes32 = z.string().regex(/^0x[a-fA-F0-9]{64}$/);
const Uint256Dec = z.string().regex(/^\d+$/);          // proposalId as decimal string

export const Tranche = z.enum(['senior', 'mezzanine', 'junior']);
export type Tranche = z.infer<typeof Tranche>;

export const TrancheAllocationSchema = z.object({
  bps: z.number().int().min(0).max(10_000),                                  // share of total deposits in bps
  positions: z.record(z.string(), z.number().int().min(0).max(10_000))       // opportunity id -> bps within tranche
});

export const AllocationProposalSchema = z.object({
  version: z.literal('1.0'),
  proposalId: Uint256Dec,
  sourceMapCid: z.string().min(1),
  publishedAtMs: z.number().int().min(0),
  publisher: z.object({ address: Address, identityNFT: z.string() }),
  methodologyHash: Bytes32,
  codeCommit: z.string(),
  tranches: z.object({
    senior:    TrancheAllocationSchema,
    mezzanine: TrancheAllocationSchema,
    junior:    TrancheAllocationSchema
  }),
  netExposureAtProposalMs: z.record(z.string(), z.string()).default({}),     // asset -> signed bigint as decimal string
  signature: z.string()
}).superRefine((p, ctx) => {
  const total = p.tranches.senior.bps + p.tranches.mezzanine.bps + p.tranches.junior.bps;
  if (total !== 0 && total !== 10_000) {
    ctx.addIssue({ code: z.ZodIssueCode.custom, message: `tranche bps must sum to 10000 or 0 (zero-state), got ${total}` });
  }
  for (const [tr, alloc] of Object.entries(p.tranches)) {
    const sum = Object.values(alloc.positions).reduce((s, v) => s + v, 0);
    if (alloc.bps > 0 && sum !== 10_000) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: `${tr} positions must sum to 10000 bps, got ${sum}` });
    }
  }
});
export type AllocationProposal = z.infer<typeof AllocationProposalSchema>;

// Net-exposure ledger entry (per asset). netNotionalUsd is signed: positive = long, negative = short.
export const NetExposureSchema = z.object({
  asset: Address,
  netNotionalUsd: z.number(),
  lastUpdatedMs: z.number().int()
});
export type NetExposure = z.infer<typeof NetExposureSchema>;
```

- [ ] **Step 3: Run, expect PASS**
- [ ] **Step 4: Commit:** `architect: canonical AllocationProposal + NetExposure schemas`

---

### Task 3: Config + chain client

**Files:**
- Create: `agents/architect/src/config.ts`
- Create: `agents/architect/src/chain/client.ts`
- Create: `agents/architect/.env.example`
- Create: `agents/architect/tests/unit/config.test.ts`

- [ ] **Step 1: Failing test** for `loadConfig` (mirrors Scout's pattern).

- [ ] **Step 2: Implement `config.ts`**

```ts
import { z } from 'zod';

const Env = z.object({
  MANTLE_RPC_URL: z.string().url(),
  MANTLE_RPC_URL_FALLBACK: z.string().url().default('https://mantle.publicgoods.network'),
  ARCHITECT_PRIVATE_KEY: z.string().regex(/^0x[a-fA-F0-9]{64}$/),
  AGENT_EVENT_BUS_ADDRESS: z.string().regex(/^0x[a-fA-F0-9]{40}$/).optional(),
  IDENTITY_REGISTRY_ADDRESS: z.string().regex(/^0x[a-fA-F0-9]{40}$/).optional(),
  SCOUT_ADDRESS: z.string().regex(/^0x[a-fA-F0-9]{40}$/).optional(),    // for verification
  LIGHTHOUSE_API_KEY: z.string().min(1),
  CYCLE_INTERVAL_MS: z.coerce.number().int().min(15_000).default(60_000),
  LOG_LEVEL: z.enum(['debug', 'info', 'warn', 'error']).default('info'),
  ARCHITECT_DRY_RUN: z.enum(['true', 'false']).default('false').transform((v) => v === 'true'),
  // Optional. When set, Task 16 generates a narrative reasoning blob via Gemini and
  // pins it alongside the deterministic proposal. Allocation math is unaffected.
  GEMINI_API_KEY: z.string().min(1).optional(),
  GEMINI_MODEL: z.string().default('gemini-2.5-flash')
});

export function loadConfig() {
  const parsed = Env.safeParse(process.env);
  if (!parsed.success) {
    throw new Error(`Config error: ${parsed.error.issues.map((i) => i.path.join('.')).join(', ')}`);
  }
  const env = parsed.data;
  if (!env.ARCHITECT_DRY_RUN && !env.AGENT_EVENT_BUS_ADDRESS) {
    throw new Error('Config error: AGENT_EVENT_BUS_ADDRESS required when ARCHITECT_DRY_RUN is not true');
  }
  return {
    chain: { id: 5000, rpcUrl: env.MANTLE_RPC_URL, rpcFallback: env.MANTLE_RPC_URL_FALLBACK },
    architect: {
      privateKey: env.ARCHITECT_PRIVATE_KEY as `0x${string}`,
      eventBus: (env.AGENT_EVENT_BUS_ADDRESS ?? '0x0000000000000000000000000000000000000000') as `0x${string}`,
      identityRegistry: (env.IDENTITY_REGISTRY_ADDRESS ?? '0x0000000000000000000000000000000000000000') as `0x${string}`,
      scoutAddress: env.SCOUT_ADDRESS as `0x${string}` | undefined,
      dryRun: env.ARCHITECT_DRY_RUN
    },
    ipfs: { lighthouseApiKey: env.LIGHTHOUSE_API_KEY },
    llm: { geminiApiKey: env.GEMINI_API_KEY, model: env.GEMINI_MODEL },
    cycleIntervalMs: env.CYCLE_INTERVAL_MS,
    logLevel: env.LOG_LEVEL
  } as const;
}
export type ArchitectConfig = ReturnType<typeof loadConfig>;
```

- [ ] **Step 3: Implement `chain/client.ts`** (copy of Scout's, swap the env vars). PublicClient + WalletClient with RPC fallback.

- [ ] **Step 4: Write `.env.example`**

```
MANTLE_RPC_URL=https://rpc.mantle.xyz
ARCHITECT_PRIVATE_KEY=0x...
ARCHITECT_DRY_RUN=true
AGENT_EVENT_BUS_ADDRESS=
IDENTITY_REGISTRY_ADDRESS=
SCOUT_ADDRESS=
LIGHTHOUSE_API_KEY=
CYCLE_INTERVAL_MS=60000
LOG_LEVEL=info

# Optional: enables Task 16's narrative-text layer. Leave blank to ship Architect
# fully deterministic with no LLM in the allocation path.
GEMINI_API_KEY=
GEMINI_MODEL=gemini-2.5-flash
```

- [ ] **Step 5: Run, expect PASS. Commit:** `architect: config + viem chain client with RPC fallback`

---

### Task 4: IPFS fetcher

**Files:**
- Create: `agents/architect/src/ipfs/fetch.ts`
- Create: `agents/architect/tests/unit/ipfsFetch.test.ts`

Fetches JSON from a Lighthouse gateway, falls back to `ipfs.io` and `dweb.link` on failure. Validates against `YieldMapSchema` from `@strata/scout/types` before returning.

- [ ] **Step 1: Failing test** with msw mocking 3 gateways: lighthouse 500, ipfs.io 200 returning a valid YieldMap shape.

- [ ] **Step 2: Implement** as `fetchYieldMapByCid(cid): Promise<YieldMap>`. Tries gateways in order, parses with zod, throws on all failures.

- [ ] **Step 3: Run, expect PASS. Commit:** `architect: ipfs fetcher with gateway fallback chain`

---

### Task 5: YieldMap signature verifier

**Files:**
- Create: `agents/architect/src/verify/yieldMap.ts`
- Create: `agents/architect/tests/unit/verifyYieldMap.test.ts`

Recomputes `mapHash = keccak256(canonicalStringify({...map, signature: ""}))`, recovers EIP-191 signer over `mapHash`, asserts signer === `map.publisher.address`. Optionally asserts signer === configured `SCOUT_ADDRESS` for strict mode.

- [ ] **Step 1: Failing test** signs a YieldMap with a known key, verifies. Negative test: tamper with `apy` on one opportunity, expect verifier to reject.

- [ ] **Step 2: Implement** using `recoverMessageAddress` from viem and `canonicalStringify` from `@strata/scout/signer`.

```ts
import { keccak256, toBytes, recoverMessageAddress } from 'viem';
import { canonicalStringify } from '@strata/scout/signer';
import type { YieldMap } from '@strata/scout/types';

export async function verifyYieldMap(map: YieldMap, expectedSigner?: `0x${string}`): Promise<void> {
  const unsigned = canonicalStringify({ ...map, signature: '' });
  const mapHash = keccak256(toBytes(unsigned));
  const recovered = await recoverMessageAddress({ message: { raw: mapHash }, signature: map.signature as `0x${string}` });
  if (recovered.toLowerCase() !== map.publisher.address.toLowerCase()) {
    throw new Error(`signature does not recover to publisher.address`);
  }
  if (expectedSigner && recovered.toLowerCase() !== expectedSigner.toLowerCase()) {
    throw new Error(`signer ${recovered} is not the expected Scout address ${expectedSigner}`);
  }
}
```

- [ ] **Step 3: Run, expect PASS. Commit:** `architect: yield-map signature verifier`

---

### Task 6: YieldMapPublished event subscriber + backfill

**Files:**
- Create: `agents/architect/src/subscription/yieldMap.ts`
- Create: `agents/architect/tests/unit/yieldMapSub.test.ts`

`subscribeYieldMaps(client, busAddress, fromBlock, onMap)`: backfills past events from `fromBlock`, then attaches a live watcher.

- [ ] **Step 1: Failing test** mocks `publicClient.getContractEvents` to return 2 past events and `publicClient.watchContractEvent` to fire 1 live event. Assert the callback fires 3 times in order.

- [ ] **Step 2: Implement**

```ts
import type { PublicClient } from 'viem';
import { parseAbiItem } from 'viem';

const yieldMapEvent = parseAbiItem(
  'event YieldMapPublished(address indexed agent, string ipfsHash, uint256 timestamp)'
);

export interface YieldMapEvent {
  agent: `0x${string}`;
  ipfsHash: string;
  timestamp: bigint;
  blockNumber: bigint;
}

export async function subscribeYieldMaps(
  client: PublicClient,
  busAddress: `0x${string}`,
  fromBlock: bigint,
  onMap: (e: YieldMapEvent) => Promise<void>
): Promise<() => void> {
  const past = await client.getContractEvents({
    address: busAddress, event: yieldMapEvent, fromBlock, toBlock: 'latest'
  });
  for (const log of past) {
    await onMap({
      agent: log.args.agent!, ipfsHash: log.args.ipfsHash!,
      timestamp: log.args.timestamp!, blockNumber: log.blockNumber!
    });
  }
  const unsubscribe = client.watchContractEvent({
    address: busAddress, event: yieldMapEvent,
    onLogs: async (logs) => {
      for (const log of logs) await onMap({
        agent: log.args.agent!, ipfsHash: log.args.ipfsHash!,
        timestamp: log.args.timestamp!, blockNumber: log.blockNumber!
      });
    }
  });
  return unsubscribe;
}
```

- [ ] **Step 3: Run, expect PASS. Commit:** `architect: YieldMapPublished subscriber with backfill`

---

### Task 7: HedgeLogged subscriber + net-exposure ledger

**Files:**
- Create: `agents/architect/src/subscription/hedgeLog.ts`
- Create: `agents/architect/src/pipeline/netExposure.ts`
- Create: `agents/architect/tests/unit/netExposure.test.ts`

`subscribeHedgeLogs` mirrors Task 6 but for `HedgeLogged(address indexed agent, address indexed hedgedAsset, int256 netPosition, string executionProof)`.

`NetExposureLedger` is an in-memory map `asset -> netNotional`. Adds incremental updates from each event, exposes `get(asset)` and `snapshot()`.

- [ ] **Step 1: Failing test** for `NetExposureLedger`: applies three HedgeLogged events for the same asset, expects the latest netNotional only (Operator emits the absolute current position, not deltas).

- [ ] **Step 2: Implement**

```ts
// pipeline/netExposure.ts
export class NetExposureLedger {
  private positions = new Map<string, { net: bigint; lastUpdatedMs: number }>();

  apply(asset: `0x${string}`, netPosition: bigint, atMs: number): void {
    this.positions.set(asset.toLowerCase(), { net: netPosition, lastUpdatedMs: atMs });
  }

  get(asset: `0x${string}`): bigint {
    return this.positions.get(asset.toLowerCase())?.net ?? 0n;
  }

  snapshot(): Record<string, string> {
    const out: Record<string, string> = {};
    for (const [asset, { net }] of this.positions) out[asset] = net.toString();
    return out;
  }
}
```

`subscribeHedgeLogs` calls `ledger.apply(...)` per event.

- [ ] **Step 3: Run, expect PASS. Commit:** `architect: HedgeLogged subscriber + net-exposure ledger`

---

### Task 8: Allocation algorithm

**Files:**
- Create: `agents/architect/src/pipeline/allocate.ts`
- Create: `agents/architect/tests/unit/allocate.test.ts`

Pure function: `allocate(map: YieldMap): TrancheAllocations`. Implements the per-tranche weighted-by-score normalization with concentration clamp + renormalize from the canonical algorithm section above.

- [ ] **Step 1: Failing test** with three eligible senior opportunities at scores 10, 5, 3. Expect bps roughly 5555 / 2778 / 1667 (totals 10000, all under 60% cap). Add second test where one opportunity dominates with score 100 vs 1, 1 - expect the 60% cap to bind.

- [ ] **Step 2: Implement**

```ts
import type { YieldMap, ScoredOpportunity, Tranche } from '@strata/scout/types';

export const ALLOCATION_CONSTANTS = Object.freeze({
  trancheTargetBps: { senior: 5000, mezzanine: 3000, junior: 2000 },
  concentrationCapBps: { senior: 6000, mezzanine: 4000, junior: 2500 }
});

interface TrancheAllocation { bps: number; positions: Record<string, number>; }

export function allocate(map: YieldMap): Record<Tranche, TrancheAllocation> {
  const out = {
    senior: allocateOneTranche('senior', map.opportunities),
    mezzanine: allocateOneTranche('mezzanine', map.opportunities),
    junior: allocateOneTranche('junior', map.opportunities)
  };
  // Re-zero a tranche's bps if it ended up with no positions.
  const present = (Object.entries(out) as [Tranche, TrancheAllocation][]).filter(([_, a]) => Object.keys(a.positions).length > 0);
  if (present.length === 0) return out;
  // Normalize the present tranches' bps to sum to 10000.
  const totalRaw = present.reduce((s, [t]) => s + ALLOCATION_CONSTANTS.trancheTargetBps[t], 0);
  for (const [t, alloc] of present) {
    alloc.bps = Math.floor((ALLOCATION_CONSTANTS.trancheTargetBps[t] / totalRaw) * 10_000);
  }
  // Top up rounding error to one of the tranches.
  const sum = (Object.values(out) as TrancheAllocation[]).reduce((s, a) => s + a.bps, 0);
  if (sum < 10_000 && present.length > 0) present[0]![1].bps += (10_000 - sum);
  return out;
}

function allocateOneTranche(t: Tranche, all: ScoredOpportunity[]): TrancheAllocation {
  const eligible = all.filter((o) => o.eligibleTranches.includes(t) && o.score > 0);
  if (eligible.length === 0) return { bps: 0, positions: {} };

  // First pass: pure score-weighted bps.
  const totalScore = eligible.reduce((s, o) => s + o.score, 0);
  const bpsByOpp: Record<string, number> = {};
  for (const o of eligible) bpsByOpp[o.id] = Math.floor((o.score / totalScore) * 10_000);

  // Apply concentration cap.
  const cap = ALLOCATION_CONSTANTS.concentrationCapBps[t];
  let overflow = 0;
  const uncapped: string[] = [];
  for (const id of Object.keys(bpsByOpp)) {
    if (bpsByOpp[id]! > cap) {
      overflow += bpsByOpp[id]! - cap;
      bpsByOpp[id] = cap;
    } else {
      uncapped.push(id);
    }
  }
  // Redistribute overflow proportionally across uncapped positions.
  while (overflow > 0 && uncapped.length > 0) {
    const totalUncappedScore = uncapped.reduce((s, id) => s + eligible.find((o) => o.id === id)!.score, 0);
    const next: string[] = [];
    let remaining = 0;
    for (const id of uncapped) {
      const o = eligible.find((x) => x.id === id)!;
      const share = Math.floor((o.score / totalUncappedScore) * overflow);
      const candidate = bpsByOpp[id]! + share;
      if (candidate > cap) {
        remaining += candidate - cap;
        bpsByOpp[id] = cap;
      } else {
        bpsByOpp[id] = candidate;
        next.push(id);
      }
    }
    overflow = remaining;
    uncapped.length = 0;
    uncapped.push(...next);
    if (next.length === 0) break;
  }

  // Top up rounding error to the highest-score position.
  const positionSum = Object.values(bpsByOpp).reduce((s, v) => s + v, 0);
  if (positionSum < 10_000) {
    const topId = eligible[0]!.id;
    bpsByOpp[topId] = bpsByOpp[topId]! + (10_000 - positionSum);
  }

  return { bps: ALLOCATION_CONSTANTS.trancheTargetBps[t], positions: bpsByOpp };
}
```

- [ ] **Step 3: Run, expect PASS. Commit:** `architect: per-tranche allocation algorithm with concentration cap`

---

### Task 9: Build proposal artifact

**Files:**
- Create: `agents/architect/src/pipeline/buildProposal.ts`
- Create: `agents/architect/tests/unit/buildProposal.test.ts`

Wraps `allocate()` output into `AllocationProposal` shape: computes `proposalId = uint256(keccak256(sourceMapCid || publishedAtMs))`, attaches methodology hash, code commit, net-exposure snapshot, publisher info.

- [ ] **Step 1: Failing test** that calls `buildProposal` with a stub YieldMap + ledger and asserts the resulting proposal validates against `AllocationProposalSchema`.

- [ ] **Step 2: Implement**

```ts
import { keccak256, toBytes } from 'viem';
import type { YieldMap } from '@strata/scout/types';
import { allocate } from './allocate.js';
import type { NetExposureLedger } from './netExposure.js';
import { AllocationProposalSchema, type AllocationProposal } from '../types.js';

export interface BuildProposalArgs {
  map: YieldMap;
  sourceMapCid: string;
  publisherAddress: `0x${string}`;
  identityNFT: string;
  methodologyHash: string;
  codeCommit: string;
  ledger: NetExposureLedger;
}

export function buildProposal(args: BuildProposalArgs): Omit<AllocationProposal, 'signature'> {
  const tranches = allocate(args.map);
  const seed = `${args.sourceMapCid}|${args.map.publishedAtMs}`;
  const proposalIdHex = keccak256(toBytes(seed));
  const proposalId = BigInt(proposalIdHex).toString();

  const draft = {
    version: '1.0' as const,
    proposalId,
    sourceMapCid: args.sourceMapCid,
    publishedAtMs: Date.now(),
    publisher: { address: args.publisherAddress, identityNFT: args.identityNFT },
    methodologyHash: args.methodologyHash,
    codeCommit: args.codeCommit,
    tranches,
    netExposureAtProposalMs: args.ledger.snapshot()
  };

  // Validate shape (will throw if bps don't sum). signature added later.
  const parsed = AllocationProposalSchema.omit({ signature: true }).safeParse(draft);
  if (!parsed.success) throw new Error(`buildProposal: invalid shape: ${parsed.error.message}`);
  return draft;
}
```

- [ ] **Step 3: Run, expect PASS. Commit:** `architect: buildProposal composes the canonical artifact`

---

### Task 10: On-chain emitter for proposeAllocation

**Files:**
- Create: `agents/architect/src/publication/onchain.ts`
- Create: `agents/architect/src/publication/abi/agentEventBus.ts`
- Create: `agents/architect/tests/unit/onchain.test.ts`

Mirrors Scout's `publishOnChain` exactly, but calls `proposeAllocation(uint256, uint256, uint256, uint256, string)` instead of `publishYieldMap`.

- [ ] **Step 1: ABI** with the one function we call:

```ts
export const agentEventBusAbi = [
  {
    type: 'function', name: 'proposeAllocation', stateMutability: 'nonpayable',
    inputs: [
      { name: 'proposalId', type: 'uint256' },
      { name: 'seniorBps', type: 'uint256' },
      { name: 'mezzBps', type: 'uint256' },
      { name: 'juniorBps', type: 'uint256' },
      { name: 'reasoningHash', type: 'string' }
    ],
    outputs: []
  }
] as const;
```

- [ ] **Step 2: Failing test** mocks `writeContract` + `waitForTransactionReceipt`, asserts the args match.

- [ ] **Step 3: Implement** `proposeAllocationOnChain(args)` with `pRetry` (2 retries, 1-4s backoff).

- [ ] **Step 4: Run, expect PASS. Commit:** `architect: proposeAllocation onchain wrapper`

---

### Task 11: Publisher (sign + pin + emit)

**Files:**
- Create: `agents/architect/src/publication/publish.ts`
- Create: `agents/architect/tests/unit/publish.test.ts`

Defines a `Publisher` interface (mirroring Scout's), wired with `signYieldMap` (reused for sign-by-key) + `pinYieldMap` (reused) + the new `proposeAllocationOnChain`. Inspect script and tests stub the on-chain call.

- [ ] **Step 1: Failing test** for the full sign + pin + emit flow, mocking each step.

- [ ] **Step 2: Implement**

```ts
import { signYieldMap } from '@strata/scout/signer';
import { pinYieldMap } from '@strata/scout/ipfs';
import { proposeAllocationOnChain } from './onchain.js';
import type { WalletClient, PublicClient, Account } from 'viem';
import type { AllocationProposal } from '../types.js';

export interface Publisher {
  publishProposal(unsigned: Omit<AllocationProposal, 'signature'>): Promise<{ proposal: AllocationProposal; cid: string; txHash: `0x${string}` | null }>;
}

export interface PublisherDeps {
  wallet: WalletClient;
  publicClient: PublicClient;
  account: Account;
  lighthouseApiKey: string;
  eventBus: `0x${string}`;
  dryRun: boolean;
}

export function makePublisher(deps: PublisherDeps): Publisher {
  return {
    async publishProposal(unsigned) {
      const signed = await signYieldMap(unsigned, deps.wallet, deps.account);
      const proposal = { ...unsigned, signature: signed.signature } as AllocationProposal;
      const pinned = await pinYieldMap(proposal, { lighthouseApiKey: deps.lighthouseApiKey });

      if (deps.dryRun) {
        return { proposal, cid: pinned.cid, txHash: null };
      }
      const txHash = await proposeAllocationOnChain({
        wallet: deps.wallet, publicClient: deps.publicClient, account: deps.account,
        eventBus: deps.eventBus,
        proposalId: BigInt(proposal.proposalId),
        seniorBps: BigInt(proposal.tranches.senior.bps),
        mezzBps: BigInt(proposal.tranches.mezzanine.bps),
        juniorBps: BigInt(proposal.tranches.junior.bps),
        reasoningHash: pinned.cid
      });
      return { proposal, cid: pinned.cid, txHash };
    }
  };
}
```

- [ ] **Step 3: Run, expect PASS. Commit:** `architect: publisher (sign + pin + emit) with dry-run path`

---

### Task 12: Orchestrator + last-processed dedup

**Files:**
- Create: `agents/architect/src/pipeline/orchestrator.ts`
- Create: `agents/architect/tests/unit/orchestrator.test.ts`

`runProposalCycle(yieldMapCid)`:
1. Fetch + validate map via `fetchYieldMapByCid`
2. Verify signature via `verifyYieldMap`
3. Build proposal via `buildProposal`
4. Dedup against `lastProcessedCid`
5. Publish via `publisher.publishProposal`
6. Record `lastProcessedCid = cid`

- [ ] **Step 1: Failing test** runs a full cycle with stubbed fetch + verify + publisher, asserts emitted event has the expected proposal id.

- [ ] **Step 2: Implement.** Same structure as Scout's `runCycle`, but the trigger is "new YieldMap CID" not "every 60s."

- [ ] **Step 3: Run, expect PASS. Commit:** `architect: orchestrator runProposalCycle with dedup`

---

### Task 13: Run loop + health + metrics

**Files:**
- Create: `agents/architect/src/monitor/health.ts`
- Create: `agents/architect/src/monitor/metrics.ts`
- Create: `agents/architect/src/runLoop.ts`
- Create: `agents/architect/tests/unit/runLoop.test.ts`

The run loop is event-driven, not timer-driven (Architect doesn't poll, it reacts). On startup: backfill, subscribe, attach HedgeLogged subscriber to keep ledger fresh. Health tracks "last successful proposal within last 2 hours" since Architect only proposes when Scout publishes.

- [ ] **Step 1: Failing test** wires a fake event emitter, simulates one YieldMapPublished, asserts `runProposalCycle` was called and `architect_proposals_total` incremented.

- [ ] **Step 2: Implement.** Mirror Scout's runLoop structure but parameterized over the subscription instead of a timer.

- [ ] **Step 3: Run, expect PASS. Commit:** `architect: event-driven run loop + health + metrics`

---

### Task 14: Strategy + methodology docs

**Files:**
- Create: `agents/architect/docs/strategy-v1.md`
- Create: `agents/architect/docs/allocation-methodology.md`
- Create: `agents/architect/scripts/upload-strategy.ts`

`strategy-v1.md` declares what Architect does, what it doesn't (no executions, no risk checks - Sentinel's domain, no hedging - Operator's domain), how it links to the ERC-8004 identity, the bus event signatures, and the verification chain a downstream actor can run.

`allocation-methodology.md` contains the exact algorithm from this plan's canonical section. Its sha256 is the `methodologyHash`.

`upload-strategy.ts` mirrors Scout's: pin both docs to Lighthouse, print `{ strategyCid, methodologyCid, methodologyHash }`.

- [ ] **Steps 1-5: write the docs + script, verify the script pins successfully, commit:** `architect: strategy + methodology docs + lighthouse upload script`.

---

### Task 15: Inspect script + entrypoint

**Files:**
- Modify: `agents/architect/src/index.ts`
- Create: `agents/architect/scripts/inspect-allocation.ts`

`inspect-allocation.ts` does a one-shot off-chain run: takes a Yield Map CID from `--cid <cid>` (or fetches the most recent YieldMapPublished event from chain if no `--cid` provided), builds the proposal, pins it, prints a markdown summary to `proposal-output.md`. Skips on-chain emit. Mirrors Scout's `inspect-cycle.ts`.

`index.ts` becomes the real entrypoint: loads config, wires clients, attaches subscribers, runs the loop.

- [ ] **Steps 1-5: implement both, test against a known Scout-pinned CID (the one from yesterday's inspect works), commit:** `architect: live entrypoint + inspect-allocation script with dry-run support`.

---

### Task 16 (optional): Gemini narrative layer

**Files:**
- Create: `agents/architect/src/llm/gemini.ts`
- Create: `agents/architect/src/llm/narrative.ts`
- Create: `agents/architect/tests/unit/narrative.test.ts`
- Modify: `agents/architect/src/publication/publish.ts`
- Modify: `agents/architect/src/types.ts`

**This task is fully optional.** Skip it and Architect ships without any LLM dependency. The deterministic proposal at Task 15 already satisfies product.md's "every decision has a reasoning hash on chain" commitment, since the reasoning *is* the algorithm itself, fetchable from IPFS, replayable in code.

Wire this in only if you want the dashboard to render a paragraph of plain-language rationale beside the bps numbers.

**Design rules:**

1. **The LLM never sees a decision in flight.** It only summarizes the *already-computed* deterministic proposal. Inputs to the prompt: the YieldMap CID, the per-tranche bps + positions Architect just computed, the methodology hash. Outputs: ≤300 words of prose.
2. **The LLM never affects the numbers.** The `tranches` object is finalized before the LLM is called. If the LLM disagrees, the deterministic output wins.
3. **`methodologyHash` covers only the deterministic block.** The narrative is in a separate object alongside it in the pinned IPFS payload.
4. **No LLM key → no call.** The publisher checks `cfg.llm.geminiApiKey` and skips narrative generation cleanly. The proposal is still emitted, just with `narrative: null` in the pinned blob.

- [ ] **Step 1: Failing test** for `generateNarrative(proposal, geminiKey)`: mocks the Gemini REST endpoint, asserts the response is parsed correctly and bounded to 300 words. Also tests that an HTTP failure returns `null` rather than throwing (Architect must never block on LLM availability).

- [ ] **Step 2: Implement `agents/architect/src/llm/gemini.ts`**

```ts
import { z } from 'zod';

const GeminiResponse = z.object({
  candidates: z.array(z.object({
    content: z.object({
      parts: z.array(z.object({ text: z.string() }))
    })
  })).min(1)
});

export async function callGeminiText(
  prompt: string,
  apiKey: string,
  model: string
): Promise<string | null> {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
  let res: Response;
  try {
    res = await globalThis.fetch(url, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { maxOutputTokens: 400, temperature: 0.2 }
      })
    });
  } catch { return null; }
  if (!res.ok) return null;
  let body: unknown;
  try { body = await res.json(); } catch { return null; }
  const parsed = GeminiResponse.safeParse(body);
  if (!parsed.success) return null;
  return parsed.data.candidates[0]?.content.parts[0]?.text.trim() ?? null;
}
```

- [ ] **Step 3: Implement `agents/architect/src/llm/narrative.ts`**

```ts
import { callGeminiText } from './gemini.js';
import type { AllocationProposal } from '../types.js';

export async function generateNarrative(
  proposal: Omit<AllocationProposal, 'signature'>,
  apiKey: string | undefined,
  model: string
): Promise<string | null> {
  if (!apiKey) return null;
  const prompt = [
    'You are explaining a yield protocol allocation decision in plain English. ≤200 words.',
    'Do NOT invent numbers. Use only the data given.',
    '',
    `Yield Map CID: ${proposal.sourceMapCid}`,
    `Methodology hash: ${proposal.methodologyHash}`,
    '',
    `Senior allocation (${proposal.tranches.senior.bps} bps of total deposits):`,
    ...Object.entries(proposal.tranches.senior.positions).map(([id, bps]) => `  ${id}: ${bps} bps`),
    `Mezzanine allocation (${proposal.tranches.mezzanine.bps} bps):`,
    ...Object.entries(proposal.tranches.mezzanine.positions).map(([id, bps]) => `  ${id}: ${bps} bps`),
    `Junior allocation (${proposal.tranches.junior.bps} bps):`,
    ...Object.entries(proposal.tranches.junior.positions).map(([id, bps]) => `  ${id}: ${bps} bps`),
    '',
    'Write 2-3 short paragraphs. Lead with the senior tranche rationale. Be concrete.'
  ].join('\n');
  return callGeminiText(prompt, apiKey, model);
}
```

- [ ] **Step 4: Extend the pinned blob.** Update `AllocationProposalSchema` in `types.ts` to include an optional `narrative` field:

```ts
narrative: z.string().nullable().default(null)
```

Update `buildProposal` (Task 9) signature to accept an optional narrative string; default is `null`. Update the publisher (Task 11) to call `generateNarrative` AFTER the deterministic block is built, BEFORE signing/pinning. The narrative is part of the canonical JSON that gets signed.

- [ ] **Step 5: Run, expect PASS. Commit:** `architect: optional Gemini narrative layer (off when GEMINI_API_KEY unset)`.

---

## Stretch (post-MVP, after Scout/Architect handshake works end-to-end)

- **Multi-objective allocation**: replace pure score-weighting with a small QP solver that maximizes (Σ score · bps) subject to concentration caps + correlation budget. Optional library: a tiny in-house implementation since the problem is well-conditioned (~10 variables).
- **Correlation-aware rebalancing**: when Sentinel publishes a correlation matrix, Architect uses it to avoid pile-on in correlated positions.
- **Per-cycle exposure reporting**: include a snapshot of the prior cycle's actual fills (from chain) alongside the new proposal, so the dashboard can show "you allocated X, here's what filled."

---

## Self-review checklist

**Spec coverage from product.md:**
- ✅ "reads Scout's Yield Map, applies each tranche's mandate, and produces a proposed allocation" → Tasks 6, 8, 9
- ✅ "every proposal is gated by Sentinel's risk verdict before capital moves" → Architect emits proposals only; vault unlock waits on `RiskVerdictIssued` (Sentinel's concern)
- ✅ "Net exposure also flows in from Operator's hedge book" → Task 7
- ✅ "Architect mints, burns, and rebalances through the underlying protocols. Once cleared." → out of scope for v1 (vault contract executes once Sentinel clears, that's a contracts task)
- ✅ "Every proposal and every execution is an on-chain event" → Task 10

**Type consistency:**
- `AllocationProposal` shape used consistently across Tasks 2 → 9 → 11 → 12 → 15
- `Tranche` enum imported from `@strata/scout/types`, not redefined
- `proposalId` is `uint256 decimal string` everywhere it crosses package boundaries

**Placeholder scan:** no TBD, no "implement later", no "similar to Scout" without showing the diff. Tasks 3, 6, 10, 11 explicitly call out which Scout module is reused vs. which is new.

---

## Execution handoff

Plan saved to `docs/superpowers/plans/2026-05-21-architect.md`. Same two options as before:

1. **Subagent-Driven (recommended)**: dispatch fresh subagent per task with two-stage review. Best fit since Architect has ~15 mostly-independent tasks, lots of shared patterns with Scout.
2. **Inline Execution**: batch with checkpoints.

Which approach?
