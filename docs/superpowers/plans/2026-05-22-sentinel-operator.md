# Sentinel (agent 3) + Operator (agent 4) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the two off-chain agents that close the Strata rebalance loop. **Sentinel** subscribes to Architect's `AllocationProposed` events, replays each proposal against the source YieldMap and the on-chain hedge ledger, emits a per-tranche `RiskVerdictIssued` (green / yellow / red), and emits `HedgeSignalEmitted` when net exposure on any asset exceeds the configured delta cap. **Operator** subscribes to `HedgeSignalEmitted`, sizes a hedge position deterministically from CoinGecko spot, pins a signed `HedgeIntent` artifact to Lighthouse, and emits `HedgeLogged`. Both agents reuse Architect's pinning / signing / event-bus pattern verbatim and ship with strategy + methodology docs pinned to their ERC-8004 identity NFT.

**Architecture:** Event-driven. No polling timers. Both agents are stateless across restarts (chain log is the source of truth, replayed from a configured `fromBlock` on boot). Sentinel's verdict engine and Operator's sizer are pure deterministic functions over their inputs; their methodology sha256 IS the `methodologyHash` field on every emitted artifact, which lets any downstream actor replay and confirm.

**Coworker dependency:** Sentinel and Operator emit three new on-chain events on `AgentEventBus`. Coworker owns `contracts/src/AgentEventBus.sol`; the event ABIs and function signatures below are the contract that Sentinel and Operator wrap. Coworker grants `Role.Sentinel` to Sentinel's address and `Role.Operator` to Operator's address. **Do not write or edit `contracts/src/*.sol` in this plan.**

**Tech Stack:** TS 5.6, viem 2.x on Mantle (chain id 5000), zod, vitest, pino, p-retry, prom-client, node:http for `/healthz` + `/metrics`, Lighthouse for IPFS pin, ethers-grade EIP-191 signing via viem. Both agents depend on `@strata/scout` (workspace) for `canonicalStringify`, `signYieldMap`-style signer, `pinYieldMap`-style IPFS pin, and shared schemas. **No LLM in any decision path.** Operator reads CoinGecko spot price (already a locked integration via Scout). Sentinel reads no external APIs; everything it needs is on-chain or already in Scout's pinned YieldMap.

**Locked external integrations (do not add new ones):** DefiLlama, CoinGecko, Nansen, Lighthouse. Sentinel uses zero of these. Operator uses CoinGecko only.

---

## Contract additions (coworker writes these in AgentEventBus.sol)

Three new events and three new functions, all role-gated. Coworker confirms the exact signatures in the contracts repo; this plan wraps them client-side with the ABIs below.

```solidity
// Sentinel role
event RiskVerdictIssued(
    address indexed agent,
    uint256 indexed proposalId,
    uint8 seniorVerdict,    // 0=green, 1=yellow, 2=red
    uint8 mezzVerdict,
    uint8 juniorVerdict,
    string reasoningHash    // IPFS CID of the signed RiskVerdict JSON
);
function issueRiskVerdict(
    uint256 proposalId,
    uint8 seniorVerdict,
    uint8 mezzVerdict,
    uint8 juniorVerdict,
    string calldata reasoningHash
) external; // onlyRole(Sentinel)

// Sentinel role
event HedgeSignalEmitted(
    address indexed agent,
    address indexed hedgedAsset,
    int256 targetNotionalUsd,   // signed; positive = open short, negative = open long
    string reasoningHash
);
function emitHedgeSignal(
    address hedgedAsset,
    int256 targetNotionalUsd,
    string calldata reasoningHash
) external; // onlyRole(Sentinel)

// Operator role  (HedgeLogged event ALREADY exists, used by Architect today)
function logHedge(
    address hedgedAsset,
    int256 netPosition,
    string calldata executionProof
) external; // onlyRole(Operator)
```

`AllocationProposed` (consumed by Sentinel) is the existing event Architect emits:

```solidity
event AllocationProposed(
    address indexed agent,
    uint256 indexed proposalId,
    uint256 seniorBps,
    uint256 mezzBps,
    uint256 juniorBps,
    string reasoningHash
);
```

---

## Sentinel file structure

```
agents/sentinel/
  package.json
  tsconfig.json
  vitest.config.ts
  .gitignore
  .env.example
  src/
    index.ts                          # entrypoint (live mode)
    config.ts                         # zod env loader
    types.ts                          # RiskVerdict, RiskReason, VerdictLevel
    chain/
      client.ts                       # viem PublicClient + WalletClient
    subscription/
      allocationProposed.ts           # watchContractEvent + backfill
      hedgeLog.ts                     # consumed for net-exposure snapshot
    ipfs/
      fetch.ts                        # GET JSON by CID with gateway fallback
    verify/
      proposal.ts                     # Architect signature verifier
      yieldMap.ts                     # Scout signature verifier (reused pattern)
    pipeline/
      netExposure.ts                  # ledger of Operator's open positions
      riskPolicy.ts                   # deterministic verdict engine + hedge-signal detection
      buildVerdict.ts                 # composes the signed RiskVerdict artifact
      orchestrator.ts                 # runVerdictCycle: fetch + verify + score + publish
    publication/
      onchain.ts                      # issueRiskVerdict + emitHedgeSignal wrappers
      publish.ts                      # sign + pin + emit
      abi/
        agentEventBus.ts              # ABI fragments Sentinel calls
    monitor/
      health.ts
      metrics.ts
    runLoop.ts                        # subscribe AllocationProposed + HedgeLogged
  docs/
    strategy-v1.md                    # what Sentinel does + does not do
    risk-methodology.md               # algorithm, sha256 -> methodologyHash
  scripts/
    inspect-verdict.ts                # run one cycle off-chain, dump verdict MD
    upload-strategy.ts                # pin both docs to Lighthouse
  tests/
    unit/
```

## Operator file structure

```
agents/operator/
  package.json
  tsconfig.json
  vitest.config.ts
  .gitignore
  .env.example
  src/
    index.ts                          # entrypoint
    config.ts
    types.ts                          # HedgeIntent, HedgeReceipt
    chain/
      client.ts
    subscription/
      hedgeSignal.ts                  # watchContractEvent + backfill
    ipfs/
      fetch.ts
      pin.ts                          # pinHedgeIntent (wraps @strata/scout pin)
    verify/
      hedgeSignal.ts                  # Sentinel signature verifier
    market/
      coingecko.ts                    # spot price lookup (existing locked source)
    pipeline/
      sizeHedge.ts                    # deterministic notional -> contract size
      executor.ts                     # paper-trade executor: signs a HedgeIntent
      buildIntent.ts                  # composes the signed HedgeIntent artifact
      orchestrator.ts                 # runHedgeCycle: verify + size + log
    publication/
      onchain.ts                      # logHedge wrapper
      publish.ts                      # sign + pin + emit
      abi/
        agentEventBus.ts
    monitor/
      health.ts
      metrics.ts
    runLoop.ts                        # subscribe HedgeSignalEmitted
  docs/
    strategy-v1.md
    hedge-methodology.md
  scripts/
    inspect-hedge.ts
    upload-strategy.ts
  tests/
    unit/
```

---

## Canonical algorithm: Sentinel risk policy v1

All thresholds frozen at module load in `agents/sentinel/src/pipeline/riskPolicy.ts` under `RISK_CONSTANTS`. Changing any constant changes `risk-methodology.md`'s sha256, which changes `methodologyHash`. Downstream consumers detect the rules have changed.

**Inputs** (per proposal cycle):
- `proposal: AllocationProposal` (from Architect, already verified)
- `yieldMap: YieldMap` (from Scout, already verified at `proposal.sourceMapCid`)
- `netExposure: Record<assetAddress, signedNotionalUsdBigInt>` (from on-chain HedgeLogged events at proposal block)

**Constants:**
```
RISK_CONSTANTS = Object.freeze({
  depegBpsThresholdByTranche:  { senior: 50,        mezzanine: 200,      junior: 500       },  // historical max deviation
  tvlFloorUsdByTranche:        { senior: 50_000_000, mezzanine: 10_000_000, junior: 1_000_000 },
  concentrationWarnBpsByTranche: { senior: 4500,    mezzanine: 3500,     junior: 2000      },
  smartMoneyOutflow7dRedUsd:   -5_000_000,                                                    // any position with worse net flow -> red on that position
  hedgeDeltaCapUsd: 250_000                                                                   // |gross - hedge| > cap -> emit signal
});
```

**Algorithm** (deterministic, no randomness, no network calls inside the policy function):

For each tranche T in [senior, mezzanine, junior]:

1. **Skip if zero-allocation.** If `proposal.tranches[T].bps === 0`, the verdict for T is `green` (nothing to risk). Continue.

2. **Score each position in T.** For each `oppId` in `proposal.tranches[T].positions`:
   - Find the matching opportunity in `yieldMap.opportunities[]` by `id`. If missing, position verdict = `red` with reason `unknown-opportunity`.
   - **Depeg check:** if `opp.depegHistory.maxDeviationBps > depegBpsThresholdByTranche[T]`, position verdict = `yellow`, reason `depeg-history-breach`.
   - **TVL check:** if `opp.tvlUsd < tvlFloorUsdByTranche[T]`, position verdict = `yellow`, reason `tvl-below-floor`.
   - **Concentration check:** if `positions[oppId] > concentrationWarnBpsByTranche[T]`, position verdict = `yellow`, reason `concentration-warn`.
   - **Smart-money check:** if `opp.nansenNetFlow7dUsd < smartMoneyOutflow7dRedUsd`, position verdict = `red`, reason `smart-money-outflow`.
   - The final position verdict is the worst of all reasons triggered (red beats yellow beats green).

3. **Aggregate to tranche verdict.**
   - Count yellow positions `y` and red positions `r` in T.
   - If `r >= 1` OR `y >= 2` → tranche verdict T = `red`.
   - Else if `y === 1` → tranche verdict T = `yellow`.
   - Else → `green`.

**Hedge-signal detection** (independent of tranche verdicts):

For each asset address A referenced in `proposal.tranches.*.positions` (joining via opportunity.id → opportunity.tokenAddress in the YieldMap):

1. Compute `grossExposureUsd[A]` = sum across all positions touching A of `(positions[oppId] / 10000) * trancheTotalUsd * trancheBps / 10000`. v1 uses a fixed `TOTAL_DEPOSITS_USD = 10_000_000` baseline (configurable; not in the policy hash because it's a deployment constant published on Sentinel's identity NFT, not in the methodology).
2. `deltaUsd[A] = grossExposureUsd[A] - netExposure[A]` (positive: under-hedged long, need short).
3. If `|deltaUsd[A]| > RISK_CONSTANTS.hedgeDeltaCapUsd`, emit a HedgeSignal with `targetNotionalUsd = deltaUsd[A]` (signed).

**Output:** one `RiskVerdict` artifact + zero-or-more `HedgeSignal` artifacts per proposal cycle. All deterministic given the same inputs.

---

## Canonical algorithm: Operator hedge sizing v1

All constants frozen at module load in `agents/operator/src/pipeline/sizeHedge.ts` under `HEDGE_CONSTANTS`.

**Inputs** (per signal):
- `signal: HedgeSignal` (from Sentinel, already verified)
- `spotPriceUsd: number` (from CoinGecko at signal-receipt time)

**Constants:**
```
HEDGE_CONSTANTS = Object.freeze({
  overshootBps: 0,              // v1: hedge exactly the requested notional, no overshoot
  minNotionalUsd: 10_000,        // signals below this are skipped (noise floor)
  maxNotionalUsd: 5_000_000,     // signals above this are clamped (single-trade cap)
  slippageToleranceBps: 50       // pinned in the HedgeIntent; descriptive, not enforced
});
```

**Algorithm:**

1. **Skip noise.** If `|signal.targetNotionalUsd| < minNotionalUsd`, log `skip:below-floor` and stop.
2. **Clamp.** `notionalUsd = sign(signal.targetNotionalUsd) * min(|signal.targetNotionalUsd|, maxNotionalUsd)`.
3. **Convert to contract size.** `contractSize = notionalUsd / spotPriceUsd`. Stored as a string fixed-point at 18 decimals.
4. **Direction.** positive `notionalUsd` → `direction: 'short'`, negative → `direction: 'long'`.
5. **Compose `HedgeIntent`:**
   ```
   {
     intentId: keccak256(sourceSignalReasoningCid + '|' + signalBlockNumber).toString(),
     sourceSignalCid: ...,         // the RiskVerdict reasoning CID that produced this signal
     sourceSignalBlock: bigint as decimal string,
     hedgedAsset, direction, notionalUsd, contractSize,
     spotPriceUsd, spotPriceSource: 'coingecko', spotPriceTimestampMs,
     slippageToleranceBps: 50,
     publisher: { address, identityNFT },
     methodologyHash, codeCommit,
     publishedAtMs,
     signature
   }
   ```
6. **Sign + pin + emit:** canonical-stringify → EIP-191 sign with Operator key → pin to Lighthouse → `bus.logHedge(hedgedAsset, netPosition=signedNotionalAsInt256, executionProof=cid)`.

`netPosition` on-chain is the signed notional in 6-decimal USD units (matching USDC denomination): `BigInt(Math.round(notionalUsd * 1_000_000))`.

For demo: this is a paper-trade executor. No call to Byreal Perps. The `executionProof` CID points to the signed intent JSON, not a real fill receipt. v2 swaps in a real fills adapter and re-emits with a real proof. The hackathon deliverable is the verifiable chain (Sentinel signal → Operator intent → on-chain log), not Byreal integration itself.

---

## APIs and data sources

| Agent | Source | Purpose | Auth |
|---|---|---|---|
| Sentinel | Mantle RPC | subscribe + emit | optional |
| Sentinel | Lighthouse gateway | GET proposal + YieldMap JSON | none |
| Sentinel | Lighthouse pin | pin verdict blob | API key |
| Sentinel | `AgentEventBus` | subscribe + emit | Sentinel role |
| Operator | Mantle RPC | subscribe + emit | optional |
| Operator | Lighthouse gateway | GET hedge-signal JSON if signal CID points to a richer blob | none |
| Operator | Lighthouse pin | pin intent blob | API key |
| Operator | CoinGecko `/simple/price` | spot for asset → notional → contracts | demo-tier API key (already in Scout's `.env`, copy into Operator's `.env`) |
| Operator | `AgentEventBus` | subscribe + emit | Operator role |

No DefiLlama. No Nansen. No new integrations beyond the locked 4. Both agents consume already-validated upstream JSON.

---

## Validation, risk, error handling

1. **Verify every artifact** before acting on it. Sentinel verifies Architect's signature on each proposal AND Scout's signature on the source YieldMap. Operator verifies Sentinel's signature on each hedge signal. Failed verification = artifact rejected + metric `*_verification_failures` incremented + skip cycle. No silent acceptance.
2. **No silent skips on real errors.** Only documented deterministic skip rules are silent (dedup, zero-allocation, below-noise-floor). Subscription failures, IPFS unreachable, transport errors: log + metric + observable through `onLiveError`.
3. **Replayable.** Every output pins `methodologyHash` + `codeCommit`. Anyone with the source code at `codeCommit`, the methodology doc, and the source proposal/signal can replay the math.
4. **Idempotent.** Same proposal CID → same `verdictId` and byte-identical canonical bytes. Same signal CID → same `intentId`. In-memory `lastProcessedCid` dedups before emit.
5. **Role-gated mutators.** Sentinel's contract role permits only `issueRiskVerdict` + `emitHedgeSignal`. Operator's role permits only `logHedge`. Anything else reverts on-chain. The plan does not test these revert paths (coworker's contract tests do).

---

## Conventions (same as Scout and Architect plans)

- **No em-dashes anywhere.** Use hyphens, commas, or two sentences.
- **No `Co-Authored-By: Claude` trailer** in any commit.
- **`git add` specific paths.** No `-A` / `.` in any commit step.
- **Hooks must run.** No `--no-verify`.
- **TDD.** Every task: failing test → implementation → passing test → commit.
- **DRY across agents.** Reuse `@strata/scout/signer`, `@strata/scout/ipfs`, `@strata/scout/types`. Add new exports to `@strata/scout` when needed and bump the workspace consumer.
- **Bite-sized tasks.** 2-5 min per step. Commit per task.

---

## Task decomposition

28 tasks total. Tasks 1-15 build Sentinel. Tasks 16-28 build Operator. Task 0 is the prerequisite shared-types update on `@strata/scout`.

Pause point after Task 15: confirm Sentinel works end-to-end against an inspect script before starting Operator.

---

### Task 0: Add shared types to @strata/scout for Sentinel + Operator consumption

**Files:**
- Modify: `agents/scout/src/types.ts`
- Modify: `agents/scout/package.json` (exports field)

`Sentinel` and `Operator` both consume `AllocationProposal` (from Architect) and emit their own canonical artifacts that share field shapes (publisher, methodologyHash, codeCommit, signature). Move the shared base shape into `@strata/scout/types` so all three agents stay in sync.

- [ ] **Step 1: Read `agents/scout/src/types.ts`** to confirm current `Tranche` and `YieldMap` exports.

- [ ] **Step 2: Append a shared `PublishedArtifactBase` schema** to `agents/scout/src/types.ts`:

```ts
export const VerdictLevel = z.enum(['green', 'yellow', 'red']);
export type VerdictLevel = z.infer<typeof VerdictLevel>;

export const HedgeDirection = z.enum(['long', 'short']);
export type HedgeDirection = z.infer<typeof HedgeDirection>;
```

- [ ] **Step 3: Confirm `agents/scout/package.json` exports field** already exposes `./signer`, `./ipfs`, `./types`. If `./types` is not in the exports field, add it:

```json
"exports": {
  "./signer": "./dist/publication/signer.js",
  "./ipfs":   "./dist/publication/ipfs.js",
  "./types":  "./dist/types.js"
}
```

- [ ] **Step 4: Rebuild @strata/scout**

```bash
pnpm --filter @strata/scout build
```

Expected: clean build.

- [ ] **Step 5: Commit**

```bash
git add agents/scout/src/types.ts agents/scout/package.json
git commit -m "scout: export VerdictLevel + HedgeDirection enums for Sentinel/Operator"
```

---

### Task 1: Scaffold @strata/sentinel package

**Files:**
- Create: `agents/sentinel/package.json`
- Create: `agents/sentinel/tsconfig.json`
- Create: `agents/sentinel/vitest.config.ts`
- Create: `agents/sentinel/.gitignore`
- Create: `agents/sentinel/src/index.ts` (stub)

- [ ] **Step 1: Write `agents/sentinel/package.json`**

```json
{
  "name": "@strata/sentinel",
  "version": "0.1.0",
  "type": "module",
  "private": true,
  "bin": { "sentinel": "./dist/index.js" },
  "scripts": {
    "build": "tsc -p .",
    "dev": "tsx src/index.ts",
    "inspect": "tsx scripts/inspect-verdict.ts",
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

- [ ] **Step 2: Write `agents/sentinel/tsconfig.json`**

```json
{
  "extends": "../../tsconfig.base.json",
  "compilerOptions": { "outDir": "dist", "rootDir": "src" },
  "include": ["src/**/*"]
}
```

- [ ] **Step 3: Write `agents/sentinel/vitest.config.ts`**

```ts
import { defineConfig } from 'vitest/config';
export default defineConfig({
  test: { include: ['tests/**/*.test.ts'], environment: 'node', globals: false }
});
```

- [ ] **Step 4: Write `agents/sentinel/.gitignore`**

```
.env
dist
node_modules
*.log
verdict-output.md
```

- [ ] **Step 5: Write `agents/sentinel/src/index.ts`** (stub)

```ts
export const VERSION = '0.1.0';
console.log(`sentinel ${VERSION}`);
```

- [ ] **Step 6: Install + verify build**

```bash
pnpm install
pnpm --filter @strata/sentinel build
```

Expected: clean install, clean build.

- [ ] **Step 7: Commit**

```bash
git add agents/sentinel/package.json agents/sentinel/tsconfig.json agents/sentinel/vitest.config.ts agents/sentinel/.gitignore agents/sentinel/src/index.ts pnpm-lock.yaml
git commit -m "sentinel: scaffold @strata/sentinel package"
```

---

### Task 2: Sentinel canonical types

**Files:**
- Create: `agents/sentinel/src/types.ts`
- Create: `agents/sentinel/tests/unit/types.test.ts`

- [ ] **Step 1: Write the failing test** `agents/sentinel/tests/unit/types.test.ts`:

```ts
import { describe, it, expect } from 'vitest';
import { RiskVerdictSchema, HedgeSignalSchema } from '../../src/types.js';

describe('RiskVerdictSchema', () => {
  const validVerdict = {
    version: '1.0',
    verdictId: '12345',
    proposalId: '67890',
    sourceMapCid: 'bafyMap',
    sourceProposalCid: 'bafyProp',
    publishedAtMs: 1_700_000_000_000,
    publisher: { address: '0x' + 'a'.repeat(40), identityNFT: 'ipfs://x' },
    methodologyHash: '0x' + '1'.repeat(64),
    codeCommit: 'deadbeef',
    tranches: { senior: 'green', mezzanine: 'yellow', junior: 'red' },
    perPositionVerdicts: { 'opp-1': 'green' },
    reasons: [{ severity: 'yellow', code: 'tvl-below-floor', target: 'opp-1', message: 'tvl 5m < 10m floor' }],
    signature: '0x' + '2'.repeat(130)
  };

  it('parses a well-formed verdict', () => {
    expect(RiskVerdictSchema.safeParse(validVerdict).success).toBe(true);
  });

  it('rejects a verdict missing a tranche', () => {
    const bad = { ...validVerdict, tranches: { senior: 'green', mezzanine: 'yellow' } };
    expect(RiskVerdictSchema.safeParse(bad).success).toBe(false);
  });
});

describe('HedgeSignalSchema', () => {
  const validSignal = {
    version: '1.0',
    signalId: '42',
    sourceVerdictCid: 'bafyVerdict',
    sourceProposalId: '67890',
    hedgedAsset: '0x' + 'a'.repeat(40),
    targetNotionalUsd: '1500000',
    direction: 'short',
    publisher: { address: '0x' + 'a'.repeat(40), identityNFT: 'ipfs://x' },
    methodologyHash: '0x' + '1'.repeat(64),
    codeCommit: 'deadbeef',
    publishedAtMs: 1_700_000_000_000,
    signature: '0x' + '2'.repeat(130)
  };

  it('parses a well-formed signal', () => {
    expect(HedgeSignalSchema.safeParse(validSignal).success).toBe(true);
  });
});
```

- [ ] **Step 2: Run, expect FAIL** (module not found).

- [ ] **Step 3: Implement `agents/sentinel/src/types.ts`**

```ts
import { z } from 'zod';
import { VerdictLevel, HedgeDirection } from '@strata/scout/types';

const Address = z.string().regex(/^0x[a-fA-F0-9]{40}$/);
const Bytes32 = z.string().regex(/^0x[a-fA-F0-9]{64}$/);
const Uint256Dec = z.string().regex(/^\d+$/);
const Int256Dec = z.string().regex(/^-?\d+$/);

export { VerdictLevel, HedgeDirection };

export const RiskReasonSchema = z.object({
  severity: VerdictLevel,
  code: z.string().min(1),
  target: z.string().min(1),
  message: z.string()
});
export type RiskReason = z.infer<typeof RiskReasonSchema>;

export const RiskVerdictSchema = z.object({
  version: z.literal('1.0'),
  verdictId: Uint256Dec,
  proposalId: Uint256Dec,
  sourceMapCid: z.string().min(1),
  sourceProposalCid: z.string().min(1),
  publishedAtMs: z.number().int().min(0),
  publisher: z.object({ address: Address, identityNFT: z.string() }),
  methodologyHash: Bytes32,
  codeCommit: z.string(),
  tranches: z.object({
    senior:    VerdictLevel,
    mezzanine: VerdictLevel,
    junior:    VerdictLevel
  }),
  perPositionVerdicts: z.record(z.string(), VerdictLevel).default({}),
  reasons: z.array(RiskReasonSchema).default([]),
  signature: z.string()
});
export type RiskVerdict = z.infer<typeof RiskVerdictSchema>;

export const HedgeSignalSchema = z.object({
  version: z.literal('1.0'),
  signalId: Uint256Dec,
  sourceVerdictCid: z.string().min(1),
  sourceProposalId: Uint256Dec,
  hedgedAsset: Address,
  targetNotionalUsd: Int256Dec,
  direction: HedgeDirection,
  publisher: z.object({ address: Address, identityNFT: z.string() }),
  methodologyHash: Bytes32,
  codeCommit: z.string(),
  publishedAtMs: z.number().int().min(0),
  signature: z.string()
});
export type HedgeSignal = z.infer<typeof HedgeSignalSchema>;
```

- [ ] **Step 4: Run, expect PASS**

```bash
pnpm --filter @strata/sentinel test
```

- [ ] **Step 5: Commit**

```bash
git add agents/sentinel/src/types.ts agents/sentinel/tests/unit/types.test.ts
git commit -m "sentinel: canonical RiskVerdict + HedgeSignal schemas"
```

---

### Task 3: Config + chain client

**Files:**
- Create: `agents/sentinel/src/config.ts`
- Create: `agents/sentinel/src/chain/client.ts`
- Create: `agents/sentinel/.env.example`
- Create: `agents/sentinel/tests/unit/config.test.ts`

- [ ] **Step 1: Failing test** `agents/sentinel/tests/unit/config.test.ts`:

```ts
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { loadConfig } from '../../src/config.js';

const baseEnv = {
  MANTLE_RPC_URL: 'https://rpc.mantle.xyz',
  SENTINEL_PRIVATE_KEY: '0x' + '1'.repeat(64),
  LIGHTHOUSE_API_KEY: 'lh-key',
  SENTINEL_DRY_RUN: 'true'
};

describe('loadConfig', () => {
  let saved: NodeJS.ProcessEnv;
  beforeEach(() => { saved = { ...process.env }; });
  afterEach(() => { process.env = saved; });

  it('loads valid env', () => {
    process.env = { ...baseEnv } as any;
    const cfg = loadConfig();
    expect(cfg.chain.id).toBe(5000);
    expect(cfg.sentinel.dryRun).toBe(true);
  });

  it('rejects when live mode missing bus address', () => {
    process.env = { ...baseEnv, SENTINEL_DRY_RUN: 'false' } as any;
    expect(() => loadConfig()).toThrow(/AGENT_EVENT_BUS_ADDRESS/);
  });
});
```

- [ ] **Step 2: Run, expect FAIL**.

- [ ] **Step 3: Implement `agents/sentinel/src/config.ts`**

```ts
import { z } from 'zod';

const Env = z.object({
  MANTLE_RPC_URL: z.string().url(),
  MANTLE_RPC_URL_FALLBACK: z.string().url().default('https://mantle.publicgoods.network'),
  SENTINEL_PRIVATE_KEY: z.string().regex(/^0x[a-fA-F0-9]{64}$/),
  AGENT_EVENT_BUS_ADDRESS: z.string().regex(/^0x[a-fA-F0-9]{40}$/).optional(),
  IDENTITY_REGISTRY_ADDRESS: z.string().regex(/^0x[a-fA-F0-9]{40}$/).optional(),
  ARCHITECT_ADDRESS: z.string().regex(/^0x[a-fA-F0-9]{40}$/).optional(),
  SCOUT_ADDRESS: z.string().regex(/^0x[a-fA-F0-9]{40}$/).optional(),
  LIGHTHOUSE_API_KEY: z.string().min(1),
  LOG_LEVEL: z.enum(['debug', 'info', 'warn', 'error']).default('info'),
  SENTINEL_DRY_RUN: z.enum(['true', 'false']).default('false').transform((v) => v === 'true'),
  SENTINEL_IDENTITY_NFT: z.string().default('ipfs://placeholder'),
  SENTINEL_HEALTH_PORT: z.coerce.number().int().min(1).max(65535).default(9092),
  TOTAL_DEPOSITS_USD_BASELINE: z.coerce.number().positive().default(10_000_000)
});

export function loadConfig() {
  const parsed = Env.safeParse(process.env);
  if (!parsed.success) {
    throw new Error(`Config error: ${parsed.error.issues.map((i) => i.path.join('.')).join(', ')}`);
  }
  const env = parsed.data;
  if (!env.SENTINEL_DRY_RUN && !env.AGENT_EVENT_BUS_ADDRESS) {
    throw new Error('Config error: AGENT_EVENT_BUS_ADDRESS required when SENTINEL_DRY_RUN is not true');
  }
  if (!env.SENTINEL_DRY_RUN && !env.IDENTITY_REGISTRY_ADDRESS) {
    throw new Error('Config error: IDENTITY_REGISTRY_ADDRESS required when SENTINEL_DRY_RUN is not true');
  }
  return {
    chain: { id: 5000, rpcUrl: env.MANTLE_RPC_URL, rpcFallback: env.MANTLE_RPC_URL_FALLBACK },
    sentinel: {
      privateKey: env.SENTINEL_PRIVATE_KEY as `0x${string}`,
      eventBus: (env.AGENT_EVENT_BUS_ADDRESS ?? '0x0000000000000000000000000000000000000000') as `0x${string}`,
      identityRegistry: (env.IDENTITY_REGISTRY_ADDRESS ?? '0x0000000000000000000000000000000000000000') as `0x${string}`,
      ...(env.ARCHITECT_ADDRESS ? { architectAddress: env.ARCHITECT_ADDRESS as `0x${string}` } : {}),
      ...(env.SCOUT_ADDRESS ? { scoutAddress: env.SCOUT_ADDRESS as `0x${string}` } : {}),
      identityNFT: env.SENTINEL_IDENTITY_NFT,
      dryRun: env.SENTINEL_DRY_RUN,
      healthPort: env.SENTINEL_HEALTH_PORT,
      totalDepositsBaselineUsd: env.TOTAL_DEPOSITS_USD_BASELINE
    },
    ipfs: { lighthouseApiKey: env.LIGHTHOUSE_API_KEY },
    logLevel: env.LOG_LEVEL
  } as const;
}
export type SentinelConfig = ReturnType<typeof loadConfig>;
```

- [ ] **Step 4: Implement `agents/sentinel/src/chain/client.ts`** (mirrors Architect):

```ts
import { createPublicClient, createWalletClient, http, fallback } from 'viem';
import { privateKeyToAccount } from 'viem/accounts';
import { mantle } from 'viem/chains';

export interface ChainClients {
  publicClient: ReturnType<typeof createPublicClient>;
  walletClient: ReturnType<typeof createWalletClient>;
  account: ReturnType<typeof privateKeyToAccount>;
}

export function buildChainClients(opts: {
  rpcUrl: string;
  rpcFallback: string;
  privateKey: `0x${string}`;
}): ChainClients {
  const transport = fallback([http(opts.rpcUrl), http(opts.rpcFallback)]);
  const account = privateKeyToAccount(opts.privateKey);
  const publicClient = createPublicClient({ chain: mantle, transport });
  const walletClient = createWalletClient({ account, chain: mantle, transport });
  return { publicClient, walletClient, account };
}
```

- [ ] **Step 5: Write `agents/sentinel/.env.example`**

```
MANTLE_RPC_URL=https://rpc.mantle.xyz
SENTINEL_PRIVATE_KEY=0x...
SENTINEL_DRY_RUN=true
AGENT_EVENT_BUS_ADDRESS=
IDENTITY_REGISTRY_ADDRESS=
ARCHITECT_ADDRESS=
SCOUT_ADDRESS=
LIGHTHOUSE_API_KEY=
LOG_LEVEL=info
SENTINEL_IDENTITY_NFT=ipfs://placeholder
SENTINEL_HEALTH_PORT=9092
TOTAL_DEPOSITS_USD_BASELINE=10000000
```

- [ ] **Step 6: Run tests, expect PASS. Commit**

```bash
git add agents/sentinel/src/config.ts agents/sentinel/src/chain/client.ts agents/sentinel/.env.example agents/sentinel/tests/unit/config.test.ts
git commit -m "sentinel: config + viem chain client with RPC fallback"
```

---

### Task 4: IPFS fetcher (proposal + map)

**Files:**
- Create: `agents/sentinel/src/ipfs/fetch.ts`
- Create: `agents/sentinel/tests/unit/ipfsFetch.test.ts`

Reuses the same gateway-fallback pattern as Architect. Two exported functions: one for `AllocationProposal` JSON, one for `YieldMap` JSON. Each validates with zod before returning.

- [ ] **Step 1: Failing test** mocking 3 gateways with msw. Lighthouse 500, ipfs.io 200 returning a valid AllocationProposal shape. Assert `fetchAllocationProposalByCid` returns the parsed proposal.

```ts
import { describe, it, expect, beforeAll, afterAll, afterEach } from 'vitest';
import { setupServer } from 'msw/node';
import { http, HttpResponse } from 'msw';
import { fetchAllocationProposalByCid, fetchYieldMapByCid } from '../../src/ipfs/fetch.js';

const validProposal = {
  version: '1.0',
  proposalId: '1',
  sourceMapCid: 'bafyMap',
  publishedAtMs: 1_700_000_000_000,
  publisher: { address: '0x' + 'a'.repeat(40), identityNFT: 'ipfs://x' },
  methodologyHash: '0x' + '1'.repeat(64),
  codeCommit: 'deadbeef',
  tranches: {
    senior:    { bps: 10000, positions: { 'opp-1': 10000 } },
    mezzanine: { bps: 0,     positions: {} },
    junior:    { bps: 0,     positions: {} }
  },
  netExposureAtProposalMs: {},
  narrative: null,
  signature: '0xsig'
};

const server = setupServer(
  http.get('https://gateway.lighthouse.storage/ipfs/:cid', () => HttpResponse.text('boom', { status: 500 })),
  http.get('https://ipfs.io/ipfs/:cid', () => HttpResponse.json(validProposal)),
  http.get('https://dweb.link/ipfs/:cid', () => HttpResponse.text('unused', { status: 500 }))
);
beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe('fetchAllocationProposalByCid', () => {
  it('falls back to ipfs.io when lighthouse fails', async () => {
    const got = await fetchAllocationProposalByCid('bafyProp');
    expect(got?.proposalId).toBe('1');
  });
});
```

- [ ] **Step 2: Run, expect FAIL.**

- [ ] **Step 3: Implement `agents/sentinel/src/ipfs/fetch.ts`**

```ts
import { z } from 'zod';
import { YieldMapSchema, type YieldMap } from '@strata/scout/types';

const GATEWAYS = [
  'https://gateway.lighthouse.storage/ipfs/',
  'https://ipfs.io/ipfs/',
  'https://dweb.link/ipfs/'
] as const;

const FETCH_TIMEOUT_MS = 10_000;

// AllocationProposal schema is duplicated here to avoid a circular workspace
// import. Sentinel does not import @strata/architect (would create a cycle).
const Address = z.string().regex(/^0x[a-fA-F0-9]{40}$/);
const Bytes32 = z.string().regex(/^0x[a-fA-F0-9]{64}$/);
const Uint256Dec = z.string().regex(/^\d+$/);
const TrancheAllocationSchema = z.object({
  bps: z.number().int().min(0).max(10_000),
  positions: z.record(z.string(), z.number().int().min(0).max(10_000))
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
  netExposureAtProposalMs: z.record(z.string(), z.string()).default({}),
  narrative: z.string().nullable().default(null),
  signature: z.string()
});
export type AllocationProposal = z.infer<typeof AllocationProposalSchema>;

async function fetchJsonWithFallback(cid: string): Promise<unknown> {
  const errors: string[] = [];
  for (const gw of GATEWAYS) {
    const ac = new AbortController();
    const t = setTimeout(() => ac.abort(), FETCH_TIMEOUT_MS);
    try {
      const res = await fetch(`${gw}${cid}`, { signal: ac.signal });
      if (!res.ok) { errors.push(`${gw}: HTTP ${res.status}`); continue; }
      return await res.json();
    } catch (e) {
      errors.push(`${gw}: ${(e as Error).message}`);
    } finally { clearTimeout(t); }
  }
  throw new Error(`all gateways failed for ${cid}: ${errors.join('; ')}`);
}

export async function fetchAllocationProposalByCid(cid: string): Promise<AllocationProposal | null> {
  const raw = await fetchJsonWithFallback(cid);
  const parsed = AllocationProposalSchema.safeParse(raw);
  if (!parsed.success) {
    throw new Error(`fetchAllocationProposalByCid: invalid schema for ${cid}: ${parsed.error.message}`);
  }
  return parsed.data;
}

export async function fetchYieldMapByCid(cid: string): Promise<YieldMap | null> {
  const raw = await fetchJsonWithFallback(cid);
  const parsed = YieldMapSchema.safeParse(raw);
  if (!parsed.success) {
    throw new Error(`fetchYieldMapByCid: invalid schema for ${cid}: ${parsed.error.message}`);
  }
  return parsed.data;
}
```

- [ ] **Step 4: Run, expect PASS. Commit**

```bash
git add agents/sentinel/src/ipfs/fetch.ts agents/sentinel/tests/unit/ipfsFetch.test.ts
git commit -m "sentinel: ipfs fetcher with gateway fallback for proposals + maps"
```

---

### Task 5: Proposal + YieldMap signature verifiers

**Files:**
- Create: `agents/sentinel/src/verify/proposal.ts`
- Create: `agents/sentinel/src/verify/yieldMap.ts`
- Create: `agents/sentinel/tests/unit/verify.test.ts`

Sentinel must verify two signatures per cycle: Architect's signature on the proposal, and Scout's signature on the source YieldMap that the proposal references. Both use `canonicalStringify({...artifact, signature: ''})` → keccak256 → EIP-191 recover.

- [ ] **Step 1: Failing test**

```ts
import { describe, it, expect } from 'vitest';
import { privateKeyToAccount, generatePrivateKey } from 'viem/accounts';
import { keccak256, toBytes } from 'viem';
import { canonicalStringify } from '@strata/scout/signer';
import { verifyAllocationProposal } from '../../src/verify/proposal.js';
import type { AllocationProposal } from '../../src/ipfs/fetch.js';

async function sign(p: Omit<AllocationProposal, 'signature'>, key: `0x${string}`): Promise<string> {
  const acct = privateKeyToAccount(key);
  const unsigned = canonicalStringify({ ...p, signature: '' });
  const hash = keccak256(toBytes(unsigned));
  return acct.signMessage({ message: { raw: hash } });
}

describe('verifyAllocationProposal', () => {
  it('verifies a well-signed proposal', async () => {
    const key = generatePrivateKey();
    const acct = privateKeyToAccount(key);
    const draft = {
      version: '1.0' as const,
      proposalId: '1',
      sourceMapCid: 'bafyMap',
      publishedAtMs: 1_700_000_000_000,
      publisher: { address: acct.address, identityNFT: 'ipfs://x' },
      methodologyHash: '0x' + '1'.repeat(64),
      codeCommit: 'deadbeef',
      tranches: {
        senior:    { bps: 10000, positions: { 'opp-1': 10000 } },
        mezzanine: { bps: 0, positions: {} },
        junior:    { bps: 0, positions: {} }
      },
      netExposureAtProposalMs: {},
      narrative: null
    };
    const signature = await sign(draft, key);
    await expect(verifyAllocationProposal({ ...draft, signature })).resolves.toBeUndefined();
  });

  it('rejects when the signer differs from publisher.address', async () => {
    const key = generatePrivateKey();
    const draft = {
      version: '1.0' as const,
      proposalId: '1',
      sourceMapCid: 'bafyMap',
      publishedAtMs: 1_700_000_000_000,
      publisher: { address: '0x' + 'b'.repeat(40), identityNFT: 'ipfs://x' },
      methodologyHash: '0x' + '1'.repeat(64),
      codeCommit: 'deadbeef',
      tranches: {
        senior:    { bps: 10000, positions: { 'opp-1': 10000 } },
        mezzanine: { bps: 0, positions: {} },
        junior:    { bps: 0, positions: {} }
      },
      netExposureAtProposalMs: {},
      narrative: null
    };
    const signature = await sign(draft, key);
    await expect(verifyAllocationProposal({ ...draft, signature })).rejects.toThrow(/does not recover/);
  });
});
```

- [ ] **Step 2: Run, expect FAIL.**

- [ ] **Step 3: Implement `agents/sentinel/src/verify/proposal.ts`**

```ts
import { keccak256, toBytes, recoverMessageAddress } from 'viem';
import { canonicalStringify } from '@strata/scout/signer';
import type { AllocationProposal } from '../ipfs/fetch.js';

export async function verifyAllocationProposal(
  proposal: AllocationProposal,
  expectedSigner?: `0x${string}`
): Promise<void> {
  const unsigned = canonicalStringify({ ...proposal, signature: '' });
  const hash = keccak256(toBytes(unsigned));
  const recovered = await recoverMessageAddress({
    message: { raw: hash },
    signature: proposal.signature as `0x${string}`
  });
  if (recovered.toLowerCase() !== proposal.publisher.address.toLowerCase()) {
    throw new Error(`proposal signature does not recover to publisher.address (recovered=${recovered}, publisher=${proposal.publisher.address})`);
  }
  if (expectedSigner && recovered.toLowerCase() !== expectedSigner.toLowerCase()) {
    throw new Error(`proposal signer ${recovered} is not the expected Architect address ${expectedSigner}`);
  }
}
```

- [ ] **Step 4: Implement `agents/sentinel/src/verify/yieldMap.ts`** (mirrors Architect's verifier; copy with `expectedSigner` semantics):

```ts
import { keccak256, toBytes, recoverMessageAddress } from 'viem';
import { canonicalStringify } from '@strata/scout/signer';
import type { YieldMap } from '@strata/scout/types';

export async function verifyYieldMap(
  map: YieldMap,
  expectedSigner?: `0x${string}`
): Promise<void> {
  const unsigned = canonicalStringify({ ...map, signature: '' });
  const hash = keccak256(toBytes(unsigned));
  const recovered = await recoverMessageAddress({
    message: { raw: hash },
    signature: map.signature as `0x${string}`
  });
  if (recovered.toLowerCase() !== map.publisher.address.toLowerCase()) {
    throw new Error(`map signature does not recover to publisher.address (recovered=${recovered}, publisher=${map.publisher.address})`);
  }
  if (expectedSigner && recovered.toLowerCase() !== expectedSigner.toLowerCase()) {
    throw new Error(`map signer ${recovered} is not the expected Scout address ${expectedSigner}`);
  }
}
```

- [ ] **Step 5: Run, expect PASS. Commit**

```bash
git add agents/sentinel/src/verify/proposal.ts agents/sentinel/src/verify/yieldMap.ts agents/sentinel/tests/unit/verify.test.ts
git commit -m "sentinel: proposal + yield-map signature verifiers"
```

---

### Task 6: AllocationProposed subscriber + backfill

**Files:**
- Create: `agents/sentinel/src/subscription/allocationProposed.ts`
- Create: `agents/sentinel/tests/unit/allocationProposedSub.test.ts`

- [ ] **Step 1: Failing test** mocks `publicClient.getContractEvents` to return 2 past events and `publicClient.watchContractEvent` to fire 1 live event. Assert the callback fires 3 times in order, and the decoded shape exposes `proposalId`, `seniorBps`, `mezzBps`, `juniorBps`, `reasoningHash`.

```ts
import { describe, it, expect, vi } from 'vitest';
import { subscribeAllocationProposed } from '../../src/subscription/allocationProposed.js';

describe('subscribeAllocationProposed', () => {
  it('backfills past events then attaches a live watcher', async () => {
    const calls: any[] = [];
    let liveCallback: ((logs: any[]) => Promise<void>) | undefined;
    const client = {
      getContractEvents: vi.fn().mockResolvedValue([
        { args: { agent: '0xagent', proposalId: 1n, seniorBps: 5000n, mezzBps: 3000n, juniorBps: 2000n, reasoningHash: 'cidA' }, blockNumber: 100n },
        { args: { agent: '0xagent', proposalId: 2n, seniorBps: 5000n, mezzBps: 3000n, juniorBps: 2000n, reasoningHash: 'cidB' }, blockNumber: 101n }
      ]),
      watchContractEvent: vi.fn().mockImplementation((cfg: any) => { liveCallback = cfg.onLogs; return () => {}; })
    } as any;
    const unsub = await subscribeAllocationProposed(client, '0xbus', 0n, async (e) => { calls.push(e); });
    expect(calls).toHaveLength(2);
    expect(calls[0].reasoningHash).toBe('cidA');
    await liveCallback?.([{ args: { agent: '0xagent', proposalId: 3n, seniorBps: 4000n, mezzBps: 3500n, juniorBps: 2500n, reasoningHash: 'cidC' }, blockNumber: 102n }]);
    expect(calls).toHaveLength(3);
    expect(calls[2].reasoningHash).toBe('cidC');
    unsub();
  });
});
```

- [ ] **Step 2: Run, expect FAIL.**

- [ ] **Step 3: Implement `agents/sentinel/src/subscription/allocationProposed.ts`**

```ts
import type { PublicClient, Log } from 'viem';
import { parseAbiItem } from 'viem';

const allocationProposedEvent = parseAbiItem(
  'event AllocationProposed(address indexed agent, uint256 indexed proposalId, uint256 seniorBps, uint256 mezzBps, uint256 juniorBps, string reasoningHash)'
);
const ALLOC_PROPOSED_ABI = [allocationProposedEvent] as const;

type AllocProposedLog = Log<bigint, number, false, typeof allocationProposedEvent, true, typeof ALLOC_PROPOSED_ABI, 'AllocationProposed'>;

export interface AllocationProposedEvent {
  agent: `0x${string}`;
  proposalId: bigint;
  seniorBps: bigint;
  mezzBps: bigint;
  juniorBps: bigint;
  reasoningHash: string;
  blockNumber: bigint;
}

function decodeLog(log: AllocProposedLog): AllocationProposedEvent | null {
  if (log.blockNumber === null) return null;
  return {
    agent: log.args.agent!,
    proposalId: log.args.proposalId!,
    seniorBps: log.args.seniorBps!,
    mezzBps: log.args.mezzBps!,
    juniorBps: log.args.juniorBps!,
    reasoningHash: log.args.reasoningHash!,
    blockNumber: log.blockNumber
  };
}

export async function subscribeAllocationProposed(
  client: PublicClient,
  busAddress: `0x${string}`,
  fromBlock: bigint,
  onProposal: (e: AllocationProposedEvent) => Promise<void>,
  onLiveError?: (err: unknown) => void
): Promise<() => void> {
  const past = await client.getContractEvents({
    address: busAddress,
    abi: ALLOC_PROPOSED_ABI,
    eventName: 'AllocationProposed',
    fromBlock,
    toBlock: 'latest'
  });
  for (const log of past) {
    const decoded = decodeLog(log as AllocProposedLog);
    if (decoded) await onProposal(decoded);
  }
  const unsubscribe = client.watchContractEvent({
    address: busAddress,
    abi: ALLOC_PROPOSED_ABI,
    eventName: 'AllocationProposed',
    onLogs: async (logs) => {
      for (const log of logs) {
        const decoded = decodeLog(log as AllocProposedLog);
        if (!decoded) continue;
        try {
          await onProposal(decoded);
        } catch (err) {
          onLiveError?.(err);
        }
      }
    },
    onError: (err) => onLiveError?.(err)
  });
  return unsubscribe;
}
```

- [ ] **Step 4: Run, expect PASS. Commit**

```bash
git add agents/sentinel/src/subscription/allocationProposed.ts agents/sentinel/tests/unit/allocationProposedSub.test.ts
git commit -m "sentinel: AllocationProposed subscriber with backfill + live watch"
```

---

### Task 7: HedgeLogged subscriber + net-exposure ledger

**Files:**
- Create: `agents/sentinel/src/subscription/hedgeLog.ts`
- Create: `agents/sentinel/src/pipeline/netExposure.ts`
- Create: `agents/sentinel/tests/unit/netExposure.test.ts`

Mirrors Architect's `subscribeHedgeLogs` + `NetExposureLedger` verbatim. The ledger is an in-memory `Map<assetAddress, bigint>` that `apply()` updates on each event and `snapshot()` reads from. No persistence; restart re-replays from the configured `fromBlock`.

- [ ] **Step 1: Failing test**

```ts
import { describe, it, expect } from 'vitest';
import { NetExposureLedger } from '../../src/pipeline/netExposure.js';

describe('NetExposureLedger', () => {
  it('sums multiple positions per asset', () => {
    const l = new NetExposureLedger();
    l.apply('0xAsset1', 100n, 1000);
    l.apply('0xAsset1', -30n, 2000);
    l.apply('0xAsset2', 50n, 3000);
    expect(l.snapshot()).toEqual({ '0xasset1': 70n, '0xasset2': 50n });
  });

  it('lowercases the asset key', () => {
    const l = new NetExposureLedger();
    l.apply('0xAbCdEf' as `0x${string}`, 10n, 1);
    l.apply('0xABCDEF' as `0x${string}`, 5n, 2);
    expect(l.snapshot()['0xabcdef']).toBe(15n);
  });
});
```

- [ ] **Step 2: Implement `agents/sentinel/src/pipeline/netExposure.ts`**

```ts
export class NetExposureLedger {
  private byAsset = new Map<string, bigint>();
  private lastUpdatedMs = 0;

  apply(asset: `0x${string}` | string, delta: bigint, ts: number): void {
    const key = (asset as string).toLowerCase();
    this.byAsset.set(key, (this.byAsset.get(key) ?? 0n) + delta);
    if (ts > this.lastUpdatedMs) this.lastUpdatedMs = ts;
  }

  snapshot(): Record<string, bigint> {
    return Object.fromEntries(this.byAsset.entries());
  }

  serializable(): Record<string, string> {
    return Object.fromEntries([...this.byAsset.entries()].map(([k, v]) => [k, v.toString()]));
  }

  lastUpdated(): number { return this.lastUpdatedMs; }
}
```

- [ ] **Step 3: Implement `agents/sentinel/src/subscription/hedgeLog.ts`** (copy of Architect's hedgeLog.ts, identical contents).

```ts
import type { PublicClient, Log } from 'viem';
import { parseAbiItem } from 'viem';

const hedgeLogEvent = parseAbiItem(
  'event HedgeLogged(address indexed agent, address indexed hedgedAsset, int256 netPosition, string executionProof)'
);
const HEDGE_LOG_ABI = [hedgeLogEvent] as const;

type HedgeLogLog = Log<bigint, number, false, typeof hedgeLogEvent, true, typeof HEDGE_LOG_ABI, 'HedgeLogged'>;

export interface HedgeLogEvent {
  agent: `0x${string}`;
  hedgedAsset: `0x${string}`;
  netPosition: bigint;
  executionProof: string;
  blockNumber: bigint;
}

function decodeLog(log: HedgeLogLog): HedgeLogEvent | null {
  if (log.blockNumber === null) return null;
  return {
    agent: log.args.agent!,
    hedgedAsset: log.args.hedgedAsset!,
    netPosition: log.args.netPosition!,
    executionProof: log.args.executionProof!,
    blockNumber: log.blockNumber
  };
}

export async function subscribeHedgeLogs(
  client: PublicClient,
  busAddress: `0x${string}`,
  fromBlock: bigint,
  onHedge: (e: HedgeLogEvent) => Promise<void>,
  onLiveError?: (err: unknown) => void
): Promise<() => void> {
  const past = await client.getContractEvents({
    address: busAddress,
    abi: HEDGE_LOG_ABI,
    eventName: 'HedgeLogged',
    fromBlock,
    toBlock: 'latest'
  });
  for (const log of past) {
    const decoded = decodeLog(log as HedgeLogLog);
    if (decoded) await onHedge(decoded);
  }
  const unsubscribe = client.watchContractEvent({
    address: busAddress,
    abi: HEDGE_LOG_ABI,
    eventName: 'HedgeLogged',
    onLogs: async (logs) => {
      for (const log of logs) {
        const decoded = decodeLog(log as HedgeLogLog);
        if (!decoded) continue;
        try { await onHedge(decoded); } catch (err) { onLiveError?.(err); }
      }
    },
    onError: (err) => onLiveError?.(err)
  });
  return unsubscribe;
}
```

- [ ] **Step 4: Run, expect PASS. Commit**

```bash
git add agents/sentinel/src/subscription/hedgeLog.ts agents/sentinel/src/pipeline/netExposure.ts agents/sentinel/tests/unit/netExposure.test.ts
git commit -m "sentinel: HedgeLogged subscriber + net-exposure ledger"
```

---

### Task 8: Risk policy engine

**Files:**
- Create: `agents/sentinel/src/pipeline/riskPolicy.ts`
- Create: `agents/sentinel/tests/unit/riskPolicy.test.ts`

The deterministic verdict computation. Pure function. No I/O. Outputs `{ tranches, perPositionVerdicts, reasons, hedgeSignals }`. The sha256 of `risk-methodology.md` (Task 14) covers this exact algorithm.

- [ ] **Step 1: Failing tests**

```ts
import { describe, it, expect } from 'vitest';
import { evaluateRisk } from '../../src/pipeline/riskPolicy.js';
import type { YieldMap, Opportunity } from '@strata/scout/types';
import type { AllocationProposal } from '../../src/ipfs/fetch.js';

const mkOpp = (over: Partial<Opportunity> = {}): Opportunity => ({
  id: 'opp-1',
  protocol: { id: 'p', name: 'P' },
  tokenAddress: '0x' + 'a'.repeat(40) as `0x${string}`,
  tokenSymbol: 'XYZ',
  apy: 5,
  tvlUsd: 100_000_000,
  score: 0.8,
  eligibleTranches: ['senior', 'mezzanine', 'junior'],
  depegHistory: { maxDeviationBps: 10, samples: 100 },
  nansenNetFlow7dUsd: 100_000,
  audits: [{ auditor: 'X', year: 2024 }],
  oracle: 'chainlink',
  counterpartyClass: 'A',
  protocolAgeDays: 500,
  ...over
} as any);

const baseMap = (opps: Opportunity[]): YieldMap => ({
  version: '1.0',
  publishedAtMs: 1_700_000_000_000,
  publisher: { address: '0x' + 'a'.repeat(40) as `0x${string}`, identityNFT: 'ipfs://x' },
  methodologyHash: '0x' + '1'.repeat(64),
  codeCommit: 'deadbeef',
  opportunities: opps,
  tranches: { senior: { aggregateApy: 0, count: 1, avgScore: 0 }, mezzanine: { aggregateApy: 0, count: 0, avgScore: 0 }, junior: { aggregateApy: 0, count: 0, avgScore: 0 } },
  signature: '0xsig'
} as any);

const baseProposal = (positions: Record<string, number>): AllocationProposal => ({
  version: '1.0',
  proposalId: '1',
  sourceMapCid: 'bafyMap',
  publishedAtMs: 1_700_000_000_000,
  publisher: { address: '0x' + 'b'.repeat(40) as `0x${string}`, identityNFT: 'ipfs://x' },
  methodologyHash: '0x' + '2'.repeat(64),
  codeCommit: 'cafebabe',
  tranches: {
    senior:    { bps: 10000, positions },
    mezzanine: { bps: 0, positions: {} },
    junior:    { bps: 0, positions: {} }
  },
  netExposureAtProposalMs: {},
  narrative: null,
  signature: '0xsig'
});

describe('evaluateRisk', () => {
  it('returns green when everything passes', () => {
    const map = baseMap([mkOpp()]);
    const prop = baseProposal({ 'opp-1': 10000 });
    const out = evaluateRisk({ proposal: prop, map, netExposure: {}, totalDepositsBaselineUsd: 10_000_000 });
    expect(out.tranches.senior).toBe('green');
    expect(out.hedgeSignals).toHaveLength(0);
  });

  it('flags yellow when TVL is below the senior floor', () => {
    const map = baseMap([mkOpp({ tvlUsd: 5_000_000 })]);
    const prop = baseProposal({ 'opp-1': 10000 });
    const out = evaluateRisk({ proposal: prop, map, netExposure: {}, totalDepositsBaselineUsd: 10_000_000 });
    expect(out.tranches.senior).toBe('yellow');
    expect(out.reasons.some((r) => r.code === 'tvl-below-floor')).toBe(true);
  });

  it('flags red when smart-money outflow > $5m', () => {
    const map = baseMap([mkOpp({ nansenNetFlow7dUsd: -10_000_000 })]);
    const prop = baseProposal({ 'opp-1': 10000 });
    const out = evaluateRisk({ proposal: prop, map, netExposure: {}, totalDepositsBaselineUsd: 10_000_000 });
    expect(out.tranches.senior).toBe('red');
    expect(out.perPositionVerdicts['opp-1']).toBe('red');
  });

  it('escalates to red when 2 positions are yellow', () => {
    const map = baseMap([
      mkOpp({ id: 'opp-1', tvlUsd: 5_000_000 }),
      mkOpp({ id: 'opp-2', tvlUsd: 5_000_000, tokenAddress: '0x' + 'b'.repeat(40) as `0x${string}` })
    ]);
    const prop = baseProposal({ 'opp-1': 5000, 'opp-2': 5000 });
    const out = evaluateRisk({ proposal: prop, map, netExposure: {}, totalDepositsBaselineUsd: 10_000_000 });
    expect(out.tranches.senior).toBe('red');
  });

  it('emits a hedge signal when |gross - hedge| > $250k', () => {
    const map = baseMap([mkOpp()]);
    const prop = baseProposal({ 'opp-1': 10000 });
    // gross = 1.0 * $10m * 1.0 = $10m. netExposure = 0. delta = $10m > $250k.
    const out = evaluateRisk({ proposal: prop, map, netExposure: {}, totalDepositsBaselineUsd: 10_000_000 });
    expect(out.hedgeSignals).toHaveLength(1);
    expect(out.hedgeSignals[0]!.direction).toBe('short');
    expect(out.hedgeSignals[0]!.targetNotionalUsd).toBe(10_000_000n);
  });

  it('skips hedge signal when |delta| <= cap', () => {
    const map = baseMap([mkOpp()]);
    const prop = baseProposal({ 'opp-1': 10000 });
    const asset = (map.opportunities[0]!.tokenAddress as string).toLowerCase();
    const out = evaluateRisk({
      proposal: prop, map,
      netExposure: { [asset]: 10_000_000n },
      totalDepositsBaselineUsd: 10_000_000
    });
    expect(out.hedgeSignals).toHaveLength(0);
  });
});
```

- [ ] **Step 2: Run, expect FAIL.**

- [ ] **Step 3: Implement `agents/sentinel/src/pipeline/riskPolicy.ts`**

```ts
import type { YieldMap, Opportunity, VerdictLevel } from '@strata/scout/types';
import type { AllocationProposal } from '../ipfs/fetch.js';
import type { RiskReason } from '../types.js';

export const RISK_CONSTANTS = Object.freeze({
  depegBpsThresholdByTranche:    Object.freeze({ senior: 50,         mezzanine: 200,       junior: 500       }),
  tvlFloorUsdByTranche:          Object.freeze({ senior: 50_000_000, mezzanine: 10_000_000, junior: 1_000_000 }),
  concentrationWarnBpsByTranche: Object.freeze({ senior: 4500,       mezzanine: 3500,      junior: 2000      }),
  smartMoneyOutflow7dRedUsd:     -5_000_000,
  hedgeDeltaCapUsd:              250_000
});

export interface RiskEvaluationInput {
  proposal: AllocationProposal;
  map: YieldMap;
  netExposure: Record<string, bigint>;
  totalDepositsBaselineUsd: number;
}

export interface PendingHedgeSignal {
  hedgedAsset: `0x${string}`;
  targetNotionalUsd: bigint;
  direction: 'long' | 'short';
}

export interface RiskEvaluation {
  tranches: { senior: VerdictLevel; mezzanine: VerdictLevel; junior: VerdictLevel };
  perPositionVerdicts: Record<string, VerdictLevel>;
  reasons: RiskReason[];
  hedgeSignals: PendingHedgeSignal[];
}

type TrancheKey = 'senior' | 'mezzanine' | 'junior';

function worst(a: VerdictLevel, b: VerdictLevel): VerdictLevel {
  const rank = { green: 0, yellow: 1, red: 2 } as const;
  return rank[a] >= rank[b] ? a : b;
}

export function evaluateRisk(input: RiskEvaluationInput): RiskEvaluation {
  const { proposal, map, netExposure, totalDepositsBaselineUsd } = input;
  const oppById = new Map<string, Opportunity>(map.opportunities.map((o) => [o.id, o]));
  const perPositionVerdicts: Record<string, VerdictLevel> = {};
  const reasons: RiskReason[] = [];
  const trancheVerdicts: Record<TrancheKey, VerdictLevel> = { senior: 'green', mezzanine: 'green', junior: 'green' };

  const tKeys: TrancheKey[] = ['senior', 'mezzanine', 'junior'];
  for (const T of tKeys) {
    const trAlloc = proposal.tranches[T];
    if (trAlloc.bps === 0) { trancheVerdicts[T] = 'green'; continue; }
    let yellowCount = 0;
    let redCount = 0;
    for (const [oppId, bps] of Object.entries(trAlloc.positions)) {
      const opp = oppById.get(oppId);
      let v: VerdictLevel = 'green';
      if (!opp) {
        v = 'red';
        reasons.push({ severity: 'red', code: 'unknown-opportunity', target: oppId, message: `position ${oppId} not in source YieldMap` });
      } else {
        if (opp.depegHistory && opp.depegHistory.maxDeviationBps > RISK_CONSTANTS.depegBpsThresholdByTranche[T]) {
          v = worst(v, 'yellow');
          reasons.push({ severity: 'yellow', code: 'depeg-history-breach', target: oppId, message: `maxDeviationBps=${opp.depegHistory.maxDeviationBps} > ${RISK_CONSTANTS.depegBpsThresholdByTranche[T]} (${T} threshold)` });
        }
        if (opp.tvlUsd < RISK_CONSTANTS.tvlFloorUsdByTranche[T]) {
          v = worst(v, 'yellow');
          reasons.push({ severity: 'yellow', code: 'tvl-below-floor', target: oppId, message: `tvlUsd=${opp.tvlUsd} < ${RISK_CONSTANTS.tvlFloorUsdByTranche[T]} (${T} floor)` });
        }
        if (bps > RISK_CONSTANTS.concentrationWarnBpsByTranche[T]) {
          v = worst(v, 'yellow');
          reasons.push({ severity: 'yellow', code: 'concentration-warn', target: oppId, message: `bps=${bps} > ${RISK_CONSTANTS.concentrationWarnBpsByTranche[T]} warn cap (${T})` });
        }
        const flow = (opp as any).nansenNetFlow7dUsd ?? 0;
        if (flow < RISK_CONSTANTS.smartMoneyOutflow7dRedUsd) {
          v = worst(v, 'red');
          reasons.push({ severity: 'red', code: 'smart-money-outflow', target: oppId, message: `nansenNetFlow7dUsd=${flow} < ${RISK_CONSTANTS.smartMoneyOutflow7dRedUsd}` });
        }
      }
      perPositionVerdicts[oppId] = v;
      if (v === 'yellow') yellowCount++;
      if (v === 'red') redCount++;
    }
    if (redCount >= 1 || yellowCount >= 2) trancheVerdicts[T] = 'red';
    else if (yellowCount === 1) trancheVerdicts[T] = 'yellow';
    else trancheVerdicts[T] = 'green';
  }

  // Hedge-signal detection: per asset gross exposure vs hedge ledger.
  const grossUsdByAsset = new Map<string, number>();
  for (const T of tKeys) {
    const trAlloc = proposal.tranches[T];
    if (trAlloc.bps === 0) continue;
    const trancheUsd = totalDepositsBaselineUsd * (trAlloc.bps / 10_000);
    for (const [oppId, posBps] of Object.entries(trAlloc.positions)) {
      const opp = oppById.get(oppId);
      if (!opp) continue;
      const asset = (opp.tokenAddress as string).toLowerCase();
      const posUsd = trancheUsd * (posBps / 10_000);
      grossUsdByAsset.set(asset, (grossUsdByAsset.get(asset) ?? 0) + posUsd);
    }
  }

  const hedgeSignals: PendingHedgeSignal[] = [];
  for (const [asset, grossUsd] of grossUsdByAsset.entries()) {
    const hedgeRaw = netExposure[asset] ?? 0n;
    const hedgeUsd = Number(hedgeRaw);
    const deltaUsd = grossUsd - hedgeUsd;
    if (Math.abs(deltaUsd) > RISK_CONSTANTS.hedgeDeltaCapUsd) {
      hedgeSignals.push({
        hedgedAsset: asset as `0x${string}`,
        targetNotionalUsd: BigInt(Math.round(deltaUsd)),
        direction: deltaUsd > 0 ? 'short' : 'long'
      });
    }
  }
  hedgeSignals.sort((a, b) => a.hedgedAsset.localeCompare(b.hedgedAsset));

  return { tranches: trancheVerdicts, perPositionVerdicts, reasons, hedgeSignals };
}
```

- [ ] **Step 4: Run, expect PASS. Commit**

```bash
git add agents/sentinel/src/pipeline/riskPolicy.ts agents/sentinel/tests/unit/riskPolicy.test.ts
git commit -m "sentinel: deterministic risk policy engine with hedge-signal detection"
```

---

### Task 9: buildVerdict composes canonical artifact

**Files:**
- Create: `agents/sentinel/src/pipeline/buildVerdict.ts`
- Create: `agents/sentinel/tests/unit/buildVerdict.test.ts`

Pure function. Takes `RiskEvaluation` + context, returns `Omit<RiskVerdict, 'signature'>`. `verdictId = uint256(keccak256(sourceProposalCid + '|' + publishedAtMs))`.

- [ ] **Step 1: Failing test**

```ts
import { describe, it, expect } from 'vitest';
import { buildVerdict } from '../../src/pipeline/buildVerdict.js';
import type { RiskEvaluation } from '../../src/pipeline/riskPolicy.js';

const evaluation: RiskEvaluation = {
  tranches: { senior: 'green', mezzanine: 'yellow', junior: 'red' },
  perPositionVerdicts: { 'opp-1': 'green', 'opp-2': 'yellow', 'opp-3': 'red' },
  reasons: [{ severity: 'yellow', code: 'tvl-below-floor', target: 'opp-2', message: 'm' }],
  hedgeSignals: []
};

describe('buildVerdict', () => {
  it('composes a verdict draft with deterministic verdictId', () => {
    const draft = buildVerdict({
      evaluation,
      proposalId: '42',
      sourceMapCid: 'bafyMap',
      sourceProposalCid: 'bafyProp',
      publisherAddress: '0x' + 'a'.repeat(40),
      identityNFT: 'ipfs://x',
      methodologyHash: '0x' + '1'.repeat(64),
      codeCommit: 'deadbeef',
      now: () => 1_700_000_000_000
    });
    expect(draft.verdictId).toMatch(/^\d+$/);
    expect(draft.tranches.junior).toBe('red');
    expect(draft.perPositionVerdicts['opp-2']).toBe('yellow');
    expect(draft.publishedAtMs).toBe(1_700_000_000_000);
  });

  it('produces the same verdictId for the same proposal CID + time', () => {
    const args = {
      evaluation, proposalId: '42', sourceMapCid: 'bafyMap', sourceProposalCid: 'bafyProp',
      publisherAddress: '0x' + 'a'.repeat(40), identityNFT: 'ipfs://x',
      methodologyHash: '0x' + '1'.repeat(64), codeCommit: 'deadbeef',
      now: () => 1_700_000_000_000
    };
    expect(buildVerdict(args).verdictId).toBe(buildVerdict(args).verdictId);
  });
});
```

- [ ] **Step 2: Run, expect FAIL.**

- [ ] **Step 3: Implement `agents/sentinel/src/pipeline/buildVerdict.ts`**

```ts
import { keccak256, toBytes } from 'viem';
import type { RiskEvaluation } from './riskPolicy.js';
import type { RiskVerdict } from '../types.js';

export interface BuildVerdictArgs {
  evaluation: RiskEvaluation;
  proposalId: string;
  sourceMapCid: string;
  sourceProposalCid: string;
  publisherAddress: string;
  identityNFT: string;
  methodologyHash: string;
  codeCommit: string;
  now?: () => number;
}

export function buildVerdict(args: BuildVerdictArgs): Omit<RiskVerdict, 'signature'> {
  const now = args.now ?? (() => Date.now());
  const publishedAtMs = now();
  const seed = `${args.sourceProposalCid}|${publishedAtMs}`;
  const verdictId = BigInt(keccak256(toBytes(seed))).toString();
  return {
    version: '1.0',
    verdictId,
    proposalId: args.proposalId,
    sourceMapCid: args.sourceMapCid,
    sourceProposalCid: args.sourceProposalCid,
    publishedAtMs,
    publisher: { address: args.publisherAddress, identityNFT: args.identityNFT },
    methodologyHash: args.methodologyHash,
    codeCommit: args.codeCommit,
    tranches: args.evaluation.tranches,
    perPositionVerdicts: args.evaluation.perPositionVerdicts,
    reasons: args.evaluation.reasons
  };
}
```

- [ ] **Step 4: Run, expect PASS. Commit**

```bash
git add agents/sentinel/src/pipeline/buildVerdict.ts agents/sentinel/tests/unit/buildVerdict.test.ts
git commit -m "sentinel: buildVerdict composes canonical artifact"
```

---

### Task 10: AgentEventBus ABI + onchain wrappers

**Files:**
- Create: `agents/sentinel/src/publication/abi/agentEventBus.ts`
- Create: `agents/sentinel/src/publication/onchain.ts`
- Create: `agents/sentinel/tests/unit/onchain.test.ts`

Two wrappers: `issueRiskVerdictOnChain` + `emitHedgeSignalOnChain`. Both use p-retry with AbortError on revert (no retry on definitive on-chain failure).

- [ ] **Step 1: Failing test** asserts AbortError is thrown when receipt.status !== 'success'.

```ts
import { describe, it, expect, vi } from 'vitest';
import { issueRiskVerdictOnChain } from '../../src/publication/onchain.js';

describe('issueRiskVerdictOnChain', () => {
  it('throws AbortError on revert and does not retry', async () => {
    const wallet = { writeContract: vi.fn().mockResolvedValue('0xtx') } as any;
    const publicClient = { waitForTransactionReceipt: vi.fn().mockResolvedValue({ status: 'reverted' }) } as any;
    await expect(
      issueRiskVerdictOnChain({
        wallet, publicClient, account: {} as any, eventBus: '0xbus',
        proposalId: 1n, seniorVerdict: 0, mezzVerdict: 0, juniorVerdict: 0, reasoningHash: 'cid',
        retryConfig: { retries: 5, minTimeout: 1, maxTimeout: 2 }
      })
    ).rejects.toThrow(/tx reverted/);
    expect(wallet.writeContract).toHaveBeenCalledTimes(1);
  });
});
```

- [ ] **Step 2: Implement `agents/sentinel/src/publication/abi/agentEventBus.ts`**

```ts
export const agentEventBusAbi = [
  {
    type: 'function',
    name: 'issueRiskVerdict',
    stateMutability: 'nonpayable',
    inputs: [
      { name: 'proposalId',     type: 'uint256' },
      { name: 'seniorVerdict',  type: 'uint8' },
      { name: 'mezzVerdict',    type: 'uint8' },
      { name: 'juniorVerdict',  type: 'uint8' },
      { name: 'reasoningHash',  type: 'string' }
    ],
    outputs: []
  },
  {
    type: 'function',
    name: 'emitHedgeSignal',
    stateMutability: 'nonpayable',
    inputs: [
      { name: 'hedgedAsset',         type: 'address' },
      { name: 'targetNotionalUsd',   type: 'int256' },
      { name: 'reasoningHash',       type: 'string' }
    ],
    outputs: []
  }
] as const;
```

- [ ] **Step 3: Implement `agents/sentinel/src/publication/onchain.ts`**

```ts
import type { WalletClient, PublicClient, Account } from 'viem';
import pRetry, { AbortError } from 'p-retry';
import { agentEventBusAbi } from './abi/agentEventBus.js';

const DEFAULT_RETRY = { retries: 2, minTimeout: 1_000, maxTimeout: 4_000 };

export interface IssueRiskVerdictArgs {
  wallet: WalletClient;
  publicClient: PublicClient;
  account: Account;
  eventBus: `0x${string}`;
  proposalId: bigint;
  seniorVerdict: number;
  mezzVerdict: number;
  juniorVerdict: number;
  reasoningHash: string;
  retryConfig?: { retries: number; minTimeout: number; maxTimeout: number };
}

export async function issueRiskVerdictOnChain(args: IssueRiskVerdictArgs): Promise<`0x${string}`> {
  return pRetry(async () => {
    const hash = await args.wallet.writeContract({
      address: args.eventBus,
      abi: agentEventBusAbi,
      functionName: 'issueRiskVerdict',
      args: [args.proposalId, args.seniorVerdict, args.mezzVerdict, args.juniorVerdict, args.reasoningHash],
      account: args.account,
      chain: null
    } as any);
    const receipt = await args.publicClient.waitForTransactionReceipt({ hash, timeout: 60_000 });
    if (receipt.status !== 'success') throw new AbortError(`tx reverted: ${hash}`);
    return hash;
  }, args.retryConfig ?? DEFAULT_RETRY);
}

export interface EmitHedgeSignalArgs {
  wallet: WalletClient;
  publicClient: PublicClient;
  account: Account;
  eventBus: `0x${string}`;
  hedgedAsset: `0x${string}`;
  targetNotionalUsd: bigint;
  reasoningHash: string;
  retryConfig?: { retries: number; minTimeout: number; maxTimeout: number };
}

export async function emitHedgeSignalOnChain(args: EmitHedgeSignalArgs): Promise<`0x${string}`> {
  return pRetry(async () => {
    const hash = await args.wallet.writeContract({
      address: args.eventBus,
      abi: agentEventBusAbi,
      functionName: 'emitHedgeSignal',
      args: [args.hedgedAsset, args.targetNotionalUsd, args.reasoningHash],
      account: args.account,
      chain: null
    } as any);
    const receipt = await args.publicClient.waitForTransactionReceipt({ hash, timeout: 60_000 });
    if (receipt.status !== 'success') throw new AbortError(`tx reverted: ${hash}`);
    return hash;
  }, args.retryConfig ?? DEFAULT_RETRY);
}
```

- [ ] **Step 4: Run, expect PASS. Commit**

```bash
git add agents/sentinel/src/publication/abi/agentEventBus.ts agents/sentinel/src/publication/onchain.ts agents/sentinel/tests/unit/onchain.test.ts
git commit -m "sentinel: issueRiskVerdict + emitHedgeSignal onchain wrappers"
```

---

### Task 11: Publisher (sign + pin + emit) with dry-run path

**Files:**
- Create: `agents/sentinel/src/publication/publish.ts`
- Create: `agents/sentinel/tests/unit/publish.test.ts`

`makePublisher` returns `{ publishVerdict, publishHedgeSignal }`. Each function:
- canonical-stringify the draft (with `signature: ''`)
- keccak256 → EIP-191 sign with Sentinel key
- pin signed JSON to Lighthouse
- on-chain emit (skipped if dryRun)

- [ ] **Step 1: Failing test** with mocks for sign + pin + onchain.

```ts
import { describe, it, expect, vi } from 'vitest';
import { makePublisher } from '../../src/publication/publish.js';

describe('publishVerdict (dry-run)', () => {
  it('signs + pins + skips onchain', async () => {
    const pin = vi.fn().mockResolvedValue('bafyVerdict');
    const onchain = vi.fn();
    const publisher = makePublisher({
      wallet: {} as any,
      publicClient: {} as any,
      account: {
        address: '0x' + 'a'.repeat(40),
        signMessage: vi.fn().mockResolvedValue('0xsig')
      } as any,
      eventBus: '0xbus',
      lighthouseApiKey: 'k',
      dryRun: true,
      pinOverride: pin,
      issueOnChainOverride: onchain,
      emitHedgeOnChainOverride: vi.fn()
    });
    const draft = {
      version: '1.0' as const, verdictId: '1', proposalId: '2',
      sourceMapCid: 'm', sourceProposalCid: 'p', publishedAtMs: 0,
      publisher: { address: '0x' + 'a'.repeat(40), identityNFT: 'ipfs://x' },
      methodologyHash: '0x' + '1'.repeat(64), codeCommit: 'c',
      tranches: { senior: 'green' as const, mezzanine: 'green' as const, junior: 'green' as const },
      perPositionVerdicts: {}, reasons: []
    };
    const out = await publisher.publishVerdict(draft);
    expect(out.cid).toBe('bafyVerdict');
    expect(onchain).not.toHaveBeenCalled();
    expect(pin).toHaveBeenCalledTimes(1);
  });
});
```

- [ ] **Step 2: Implement `agents/sentinel/src/publication/publish.ts`**

```ts
import { keccak256, toBytes } from 'viem';
import type { WalletClient, PublicClient, Account } from 'viem';
import { canonicalStringify } from '@strata/scout/signer';
import { pinJsonToLighthouse } from '@strata/scout/ipfs';
import type { RiskVerdict, HedgeSignal } from '../types.js';
import { issueRiskVerdictOnChain, emitHedgeSignalOnChain } from './onchain.js';

export interface MakePublisherArgs {
  wallet: WalletClient;
  publicClient: PublicClient;
  account: Account;
  eventBus: `0x${string}`;
  lighthouseApiKey: string;
  dryRun: boolean;
  pinOverride?: (json: string, key: string) => Promise<string>;
  issueOnChainOverride?: typeof issueRiskVerdictOnChain;
  emitHedgeOnChainOverride?: typeof emitHedgeSignalOnChain;
}

export interface PublishedVerdict { cid: string; verdict: RiskVerdict; txHash?: `0x${string}` }
export interface PublishedHedgeSignal { cid: string; signal: HedgeSignal; txHash?: `0x${string}` }

const VERDICT_LEVEL_TO_UINT8 = { green: 0, yellow: 1, red: 2 } as const;

export function makePublisher(args: MakePublisherArgs) {
  const pin = args.pinOverride ?? pinJsonToLighthouse;
  const issueOnChain = args.issueOnChainOverride ?? issueRiskVerdictOnChain;
  const emitHedgeOnChain = args.emitHedgeOnChainOverride ?? emitHedgeSignalOnChain;

  async function signArtifact<T extends { signature?: string }>(draft: Omit<T, 'signature'>): Promise<string> {
    const unsigned = canonicalStringify({ ...draft, signature: '' });
    const hash = keccak256(toBytes(unsigned));
    return (args.account as any).signMessage({ message: { raw: hash } });
  }

  async function publishVerdict(draft: Omit<RiskVerdict, 'signature'>): Promise<PublishedVerdict> {
    const signature = await signArtifact<RiskVerdict>(draft);
    const verdict: RiskVerdict = { ...draft, signature };
    const cid = await pin(canonicalStringify(verdict), args.lighthouseApiKey);
    if (args.dryRun) return { cid, verdict };
    const txHash = await issueOnChain({
      wallet: args.wallet,
      publicClient: args.publicClient,
      account: args.account,
      eventBus: args.eventBus,
      proposalId: BigInt(verdict.proposalId),
      seniorVerdict: VERDICT_LEVEL_TO_UINT8[verdict.tranches.senior],
      mezzVerdict:   VERDICT_LEVEL_TO_UINT8[verdict.tranches.mezzanine],
      juniorVerdict: VERDICT_LEVEL_TO_UINT8[verdict.tranches.junior],
      reasoningHash: cid
    });
    return { cid, verdict, txHash };
  }

  async function publishHedgeSignal(draft: Omit<HedgeSignal, 'signature'>): Promise<PublishedHedgeSignal> {
    const signature = await signArtifact<HedgeSignal>(draft);
    const signal: HedgeSignal = { ...draft, signature };
    const cid = await pin(canonicalStringify(signal), args.lighthouseApiKey);
    if (args.dryRun) return { cid, signal };
    const txHash = await emitHedgeOnChain({
      wallet: args.wallet,
      publicClient: args.publicClient,
      account: args.account,
      eventBus: args.eventBus,
      hedgedAsset: signal.hedgedAsset as `0x${string}`,
      targetNotionalUsd: BigInt(signal.targetNotionalUsd),
      reasoningHash: cid
    });
    return { cid, signal, txHash };
  }

  return { publishVerdict, publishHedgeSignal };
}
```

- [ ] **Step 3: Run, expect PASS. Commit**

```bash
git add agents/sentinel/src/publication/publish.ts agents/sentinel/tests/unit/publish.test.ts
git commit -m "sentinel: publisher (sign + pin + emit) with dry-run path"
```

---

### Task 12: Orchestrator with dedup

**Files:**
- Create: `agents/sentinel/src/pipeline/orchestrator.ts`
- Create: `agents/sentinel/tests/unit/orchestrator.test.ts`

`Orchestrator.runVerdictCycle(proposalCid)`:
1. Dedup: skip if `proposalCid === lastProcessedCid`.
2. Fetch + verify proposal (Architect signature, optional address gate).
3. Fetch + verify source map (Scout signature, optional address gate).
4. Snapshot net exposure ledger.
5. Run `evaluateRisk()`.
6. Build verdict draft.
7. Publish verdict.
8. For each pending hedge signal: build signal draft (with the just-pinned `sourceVerdictCid`) and publish it.
9. Update `lastProcessedCid` only after successful publish.

Returns tagged union: `{ status: 'published', cid }` | `{ status: 'skipped', reason }`.

- [ ] **Step 1: Failing test**

```ts
import { describe, it, expect, vi } from 'vitest';
import { Orchestrator } from '../../src/pipeline/orchestrator.js';

describe('Orchestrator.runVerdictCycle', () => {
  it('skips when proposal CID matches lastProcessedCid', async () => {
    const orchestrator = new Orchestrator({
      fetchProposal: vi.fn(),
      fetchMap: vi.fn(),
      verifyProposal: vi.fn(),
      verifyMap: vi.fn(),
      snapshotExposure: () => ({}),
      methodologyHash: '0x' + '1'.repeat(64),
      codeCommit: 'c',
      publisher: { publishVerdict: vi.fn(), publishHedgeSignal: vi.fn() } as any,
      publisherAddress: '0x' + 'a'.repeat(40),
      identityNFT: 'ipfs://x',
      totalDepositsBaselineUsd: 10_000_000
    });
    (orchestrator as any).lastProcessedCid = 'bafyDup';
    const result = await orchestrator.runVerdictCycle('bafyDup');
    expect(result.status).toBe('skipped');
    if (result.status === 'skipped') expect(result.reason).toBe('duplicate');
  });
});
```

- [ ] **Step 2: Implement `agents/sentinel/src/pipeline/orchestrator.ts`**

```ts
import type { YieldMap } from '@strata/scout/types';
import type { AllocationProposal } from '../ipfs/fetch.js';
import { evaluateRisk, type RiskEvaluation } from './riskPolicy.js';
import { buildVerdict } from './buildVerdict.js';
import type { HedgeSignal, RiskVerdict } from '../types.js';
import { keccak256, toBytes } from 'viem';

export type RunResult =
  | { status: 'published'; cid: string; verdict: RiskVerdict; hedgeSignalCids: string[] }
  | { status: 'skipped'; reason: 'duplicate' | 'verification-failed' | 'zero-state' };

export interface OrchestratorDeps {
  fetchProposal: (cid: string) => Promise<AllocationProposal | null>;
  fetchMap: (cid: string) => Promise<YieldMap | null>;
  verifyProposal: (p: AllocationProposal) => Promise<void>;
  verifyMap: (m: YieldMap) => Promise<void>;
  snapshotExposure: () => Record<string, bigint>;
  methodologyHash: string;
  codeCommit: string;
  publisher: {
    publishVerdict: (draft: Omit<RiskVerdict, 'signature'>) => Promise<{ cid: string; verdict: RiskVerdict }>;
    publishHedgeSignal: (draft: Omit<HedgeSignal, 'signature'>) => Promise<{ cid: string; signal: HedgeSignal }>;
  };
  publisherAddress: string;
  identityNFT: string;
  totalDepositsBaselineUsd: number;
  now?: () => number;
}

export class Orchestrator {
  private lastProcessedCid: string | null = null;
  constructor(private deps: OrchestratorDeps) {}

  async runVerdictCycle(proposalCid: string): Promise<RunResult> {
    if (proposalCid === this.lastProcessedCid) {
      return { status: 'skipped', reason: 'duplicate' };
    }
    const now = this.deps.now ?? (() => Date.now());

    let proposal: AllocationProposal | null;
    try {
      proposal = await this.deps.fetchProposal(proposalCid);
      if (!proposal) return { status: 'skipped', reason: 'verification-failed' };
      await this.deps.verifyProposal(proposal);
    } catch {
      return { status: 'skipped', reason: 'verification-failed' };
    }

    let map: YieldMap | null;
    try {
      map = await this.deps.fetchMap(proposal.sourceMapCid);
      if (!map) return { status: 'skipped', reason: 'verification-failed' };
      await this.deps.verifyMap(map);
    } catch {
      return { status: 'skipped', reason: 'verification-failed' };
    }

    const totalBps = proposal.tranches.senior.bps + proposal.tranches.mezzanine.bps + proposal.tranches.junior.bps;
    if (totalBps === 0) return { status: 'skipped', reason: 'zero-state' };

    const netExposure = this.deps.snapshotExposure();
    const evaluation: RiskEvaluation = evaluateRisk({
      proposal, map, netExposure, totalDepositsBaselineUsd: this.deps.totalDepositsBaselineUsd
    });

    const verdictDraft = buildVerdict({
      evaluation,
      proposalId: proposal.proposalId,
      sourceMapCid: proposal.sourceMapCid,
      sourceProposalCid: proposalCid,
      publisherAddress: this.deps.publisherAddress,
      identityNFT: this.deps.identityNFT,
      methodologyHash: this.deps.methodologyHash,
      codeCommit: this.deps.codeCommit,
      now
    });

    const published = await this.deps.publisher.publishVerdict(verdictDraft);

    const hedgeSignalCids: string[] = [];
    for (const pending of evaluation.hedgeSignals) {
      const publishedAtMs = now();
      const signalSeed = `${published.cid}|${pending.hedgedAsset.toLowerCase()}|${publishedAtMs}`;
      const signalId = BigInt(keccak256(toBytes(signalSeed))).toString();
      const signalDraft: Omit<HedgeSignal, 'signature'> = {
        version: '1.0',
        signalId,
        sourceVerdictCid: published.cid,
        sourceProposalId: proposal.proposalId,
        hedgedAsset: pending.hedgedAsset,
        targetNotionalUsd: pending.targetNotionalUsd.toString(),
        direction: pending.direction,
        publisher: { address: this.deps.publisherAddress, identityNFT: this.deps.identityNFT },
        methodologyHash: this.deps.methodologyHash,
        codeCommit: this.deps.codeCommit,
        publishedAtMs
      };
      const pubSig = await this.deps.publisher.publishHedgeSignal(signalDraft);
      hedgeSignalCids.push(pubSig.cid);
    }

    this.lastProcessedCid = proposalCid;
    return { status: 'published', cid: published.cid, verdict: published.verdict, hedgeSignalCids };
  }
}
```

- [ ] **Step 3: Run, expect PASS. Commit**

```bash
git add agents/sentinel/src/pipeline/orchestrator.ts agents/sentinel/tests/unit/orchestrator.test.ts
git commit -m "sentinel: orchestrator with dedup, verification gate, hedge-signal fanout"
```

---

### Task 13: Event-driven run loop + health + metrics

**Files:**
- Create: `agents/sentinel/src/monitor/health.ts`
- Create: `agents/sentinel/src/monitor/metrics.ts`
- Create: `agents/sentinel/src/runLoop.ts`
- Create: `agents/sentinel/tests/unit/runLoop.test.ts`

Mirrors Architect's `health.ts` + `metrics.ts` + `runLoop.ts` patterns. `startSentinelRunLoop` subscribes to AllocationProposed (triggers cycles) and HedgeLogged (updates ledger).

- [ ] **Step 1: Implement `agents/sentinel/src/monitor/health.ts`**

```ts
export interface HealthState {
  lastVerdictAt: number | null;
  recordVerdict: (ts: number) => void;
  asJson: () => { status: 'ok'; lastVerdictAt: number | null };
}

export function makeHealth(): HealthState {
  let last: number | null = null;
  return {
    get lastVerdictAt() { return last; },
    recordVerdict(ts: number) { last = ts; },
    asJson() { return { status: 'ok' as const, lastVerdictAt: last }; }
  };
}
```

- [ ] **Step 2: Implement `agents/sentinel/src/monitor/metrics.ts`**

```ts
import { Registry, Counter, Gauge } from 'prom-client';

export interface SentinelMetrics {
  registry: Registry;
  verdictsTotal: Counter<string>;
  verdictsSkipped: Counter<string>;
  hedgeSignalsTotal: Counter<string>;
  verificationFailures: Counter<string>;
  subscriptionErrors: Counter<string>;
  lastVerdictMs: Gauge<string>;
}

export function makeMetrics(): SentinelMetrics {
  const registry = new Registry();
  const verdictsTotal = new Counter({ name: 'sentinel_verdicts_total', help: 'Total verdicts published', registers: [registry] });
  const verdictsSkipped = new Counter({ name: 'sentinel_verdicts_skipped_total', help: 'Skipped cycles', labelNames: ['reason'], registers: [registry] });
  const hedgeSignalsTotal = new Counter({ name: 'sentinel_hedge_signals_total', help: 'Hedge signals emitted', registers: [registry] });
  const verificationFailures = new Counter({ name: 'sentinel_verification_failures_total', help: 'Verification failures', registers: [registry] });
  const subscriptionErrors = new Counter({ name: 'sentinel_subscription_errors_total', help: 'Subscription transport errors', registers: [registry] });
  const lastVerdictMs = new Gauge({ name: 'sentinel_last_verdict_ms', help: 'Wall-clock ms of last verdict publish', registers: [registry] });
  return { registry, verdictsTotal, verdictsSkipped, hedgeSignalsTotal, verificationFailures, subscriptionErrors, lastVerdictMs };
}
```

- [ ] **Step 3: Implement `agents/sentinel/src/runLoop.ts`**

```ts
import type { PublicClient } from 'viem';
import { subscribeAllocationProposed, type AllocationProposedEvent } from './subscription/allocationProposed.js';
import { subscribeHedgeLogs, type HedgeLogEvent } from './subscription/hedgeLog.js';
import type { Orchestrator } from './pipeline/orchestrator.js';
import type { NetExposureLedger } from './pipeline/netExposure.js';
import type { HealthState } from './monitor/health.js';
import type { SentinelMetrics } from './monitor/metrics.js';

export interface RunLoopArgs {
  client: PublicClient;
  busAddress: `0x${string}`;
  fromBlock: bigint;
  orchestrator: Orchestrator;
  ledger: NetExposureLedger;
  health: HealthState;
  metrics: SentinelMetrics;
  abortSignal?: AbortSignal;
  now?: () => number;
}

export interface RunLoopHandle { stop: () => void }

export async function startSentinelRunLoop(args: RunLoopArgs): Promise<RunLoopHandle> {
  const now = args.now ?? (() => Date.now());

  const onProposal = async (event: AllocationProposedEvent): Promise<void> => {
    const result = await args.orchestrator.runVerdictCycle(event.reasoningHash);
    if (result.status === 'published') {
      args.metrics.verdictsTotal.inc();
      args.metrics.hedgeSignalsTotal.inc(result.hedgeSignalCids.length);
      const ts = now();
      args.metrics.lastVerdictMs.set(ts);
      args.health.recordVerdict(ts);
    } else {
      args.metrics.verdictsSkipped.inc({ reason: result.reason });
      if (result.reason === 'verification-failed') args.metrics.verificationFailures.inc();
    }
  };

  const onHedge = async (event: HedgeLogEvent): Promise<void> => {
    args.ledger.apply(event.hedgedAsset, event.netPosition, now());
  };

  const onLiveError = (_err: unknown): void => { args.metrics.subscriptionErrors.inc(); };

  const unsubProposals = await subscribeAllocationProposed(args.client, args.busAddress, args.fromBlock, onProposal, onLiveError);
  const unsubHedges = await subscribeHedgeLogs(args.client, args.busAddress, args.fromBlock, onHedge, onLiveError);

  const stop = (): void => { unsubProposals(); unsubHedges(); };
  if (args.abortSignal) args.abortSignal.addEventListener('abort', stop, { once: true });
  return { stop };
}
```

- [ ] **Step 4: Run, expect PASS. Commit**

```bash
git add agents/sentinel/src/monitor/health.ts agents/sentinel/src/monitor/metrics.ts agents/sentinel/src/runLoop.ts agents/sentinel/tests/unit/runLoop.test.ts
git commit -m "sentinel: event-driven run loop + health + metrics"
```

---

### Task 14: Strategy + methodology docs + upload script

**Files:**
- Create: `agents/sentinel/docs/strategy-v1.md`
- Create: `agents/sentinel/docs/risk-methodology.md`
- Create: `agents/sentinel/scripts/upload-strategy.ts`

The sha256 of `risk-methodology.md` is the `methodologyHash` on every verdict. Both docs are pinned to Lighthouse on deploy and the CIDs go on Sentinel's ERC-8004 identity NFT.

- [ ] **Step 1: Write `agents/sentinel/docs/strategy-v1.md`**

```markdown
# Sentinel Strategy, v1

Sentinel is the Risk agent for Strata. This document is signed and pinned to IPFS, and the CID is recorded on Sentinel's ERC-8004 identity NFT.

## Identity

- On-chain agent address: set at deployment, recorded on the ERC-8004 identity token.
- Strategy CID is updated through `IERC8004Identity.updateStrategyCid(tokenId, newCid)` when this document changes.
- Event bus contract: `AgentEventBus`, deployed on Mantle (chain id 5000). Sentinel is granted `Role.Sentinel` by the bus owner.

## What Sentinel does

Every cycle, after an `AllocationProposed` event arrives:

1. Fetches the proposal JSON from IPFS at `reasoningHash`.
2. Verifies the proposal signature against Architect's known address.
3. Fetches the source `YieldMap` from `proposal.sourceMapCid` and verifies Scout's signature.
4. Snapshots its hedge-ledger (built from on-chain `HedgeLogged` events).
5. Runs the deterministic risk policy described in `risk-methodology.md` against the proposal + map + exposure snapshot. The sha256 of that file is embedded in every verdict as `methodologyHash`.
6. Builds a `RiskVerdict` JSON, signs it (EIP-191), pins it to Lighthouse.
7. Emits `issueRiskVerdict(proposalId, seniorVerdict, mezzVerdict, juniorVerdict, reasoningHash)`.
8. For each asset whose `|grossExposure - netExposure|` exceeds the configured cap, builds and emits a `HedgeSignal` addressed to Operator via `emitHedgeSignal`.
9. Holds the last processed `proposalCid` in memory. Duplicate triggers skip on-chain emit.

## What Sentinel does not do

- Sentinel does not execute trades or hedges. It only emits verdicts and signals.
- Sentinel does not decide allocation. Architect does. Sentinel evaluates the proposal as-given.
- Sentinel does not re-run Scout's scoring. It reads `eligibleTranches`, `tvlUsd`, `depegHistory`, `nansenNetFlow7dUsd` directly from the YieldMap.
- Sentinel does not use any LLM. Verdicts are fully deterministic.
- Sentinel does not write to any contract other than `AgentEventBus.issueRiskVerdict` and `AgentEventBus.emitHedgeSignal`.
- Sentinel does not persist its history off-chain. The on-chain log of `RiskVerdictIssued` and `HedgeSignalEmitted` is the historical record.

## Events consumed

```
event AllocationProposed(address indexed agent, uint256 indexed proposalId, uint256 seniorBps, uint256 mezzBps, uint256 juniorBps, string reasoningHash);
event HedgeLogged(address indexed agent, address indexed hedgedAsset, int256 netPosition, string executionProof);
```

## Events emitted

```
event RiskVerdictIssued(address indexed agent, uint256 indexed proposalId, uint8 seniorVerdict, uint8 mezzVerdict, uint8 juniorVerdict, string reasoningHash);
event HedgeSignalEmitted(address indexed agent, address indexed hedgedAsset, int256 targetNotionalUsd, string reasoningHash);
```

## Identity gate today

In v1 the verifier accepts any signature that recovers to the proposal's or map's `publisher.address`. When `ARCHITECT_ADDRESS` or `SCOUT_ADDRESS` are set in env, the recovered signer must additionally equal those addresses. The `IDENTITY_REGISTRY_ADDRESS` field is reserved for a future on-chain lookup.

## Failure modes

- IPFS fetch fails after gateway fallback chain: skip cycle, log, metric `sentinel_verification_failures_total`.
- Proposal signature invalid: skip + log + metric.
- Map signature invalid: skip + log + metric.
- Proposal is zero-state: skip (nothing to evaluate).
- Lighthouse pin fails: cycle aborts before on-chain emit.
- On-chain tx reverts: not retried (definitive rejection from contract).

## Replayability

Given:
1. The source code at `codeCommit` recorded on the verdict.
2. `risk-methodology.md` whose sha256 matches `methodologyHash`.
3. The proposal at `sourceProposalCid` and the map at `sourceMapCid`.
4. The hedge-ledger snapshot reconstructed by replaying `HedgeLogged` up to the proposal block.

Anyone can re-run `pnpm --filter @strata/sentinel inspect --proposal-cid <cid>` and get a byte-identical verdict (modulo `publishedAtMs` and `signature`).
```

- [ ] **Step 2: Write `agents/sentinel/docs/risk-methodology.md`**

```markdown
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
   a. Look up the opportunity in `map.opportunities` by id. Missing → position verdict = `red`, code `unknown-opportunity`.
   b. **Depeg.** If `opp.depegHistory.maxDeviationBps > depegBpsThresholdByTranche[T]` → yellow, code `depeg-history-breach`.
   c. **TVL.** If `opp.tvlUsd < tvlFloorUsdByTranche[T]` → yellow, code `tvl-below-floor`.
   d. **Concentration.** If `bps > concentrationWarnBpsByTranche[T]` → yellow, code `concentration-warn`.
   e. **Smart money.** If `opp.nansenNetFlow7dUsd < smartMoneyOutflow7dRedUsd` → red, code `smart-money-outflow`.
   f. The position verdict is the worst of all triggered severities (red > yellow > green).

### Phase 2: per-tranche aggregation

For each tranche T:
- Count yellow positions `y` and red positions `r`.
- If `r >= 1` or `y >= 2` → tranche T = `red`.
- Else if `y === 1` → tranche T = `yellow`.
- Else → `green`.

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
```

- [ ] **Step 3: Implement `agents/sentinel/scripts/upload-strategy.ts`**

```ts
import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { pinJsonToLighthouse } from '@strata/scout/ipfs';

async function main(): Promise<void> {
  const apiKey = process.env.LIGHTHOUSE_API_KEY;
  if (!apiKey) throw new Error('LIGHTHOUSE_API_KEY is required');
  const strategy = readFileSync('agents/sentinel/docs/strategy-v1.md', 'utf-8');
  const methodology = readFileSync('agents/sentinel/docs/risk-methodology.md', 'utf-8');
  const stratCid = await pinJsonToLighthouse(JSON.stringify({ kind: 'strategy', text: strategy }), apiKey);
  const methCid = await pinJsonToLighthouse(JSON.stringify({ kind: 'risk-methodology', text: methodology }), apiKey);
  const methHash = '0x' + createHash('sha256').update(methodology).digest('hex');
  console.log(JSON.stringify({ strategyCid: stratCid, methodologyCid: methCid, methodologyHash: methHash }, null, 2));
}

main().catch((e) => { console.error(e); process.exit(1); });
```

- [ ] **Step 4: Commit**

```bash
git add agents/sentinel/docs/strategy-v1.md agents/sentinel/docs/risk-methodology.md agents/sentinel/scripts/upload-strategy.ts
git commit -m "sentinel: strategy + risk-methodology docs + upload script"
```

---

### Task 15: inspect-verdict script + live entrypoint

**Files:**
- Create: `agents/sentinel/scripts/inspect-verdict.ts`
- Modify: `agents/sentinel/src/index.ts` (real entrypoint, replace stub)

`inspect-verdict --proposal-cid <cid>` runs one cycle off-chain (dry-run, ephemeral key, pinned clock) and writes `verdict-output.md`. Bypasses the orchestrator's dedup.

- [ ] **Step 1: Implement `agents/sentinel/scripts/inspect-verdict.ts`**

```ts
import { readFileSync, writeFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { execSync } from 'node:child_process';
import { generatePrivateKey, privateKeyToAccount } from 'viem/accounts';
import { fetchAllocationProposalByCid, fetchYieldMapByCid } from '../src/ipfs/fetch.js';
import { verifyAllocationProposal } from '../src/verify/proposal.js';
import { verifyYieldMap } from '../src/verify/yieldMap.js';
import { evaluateRisk } from '../src/pipeline/riskPolicy.js';
import { buildVerdict } from '../src/pipeline/buildVerdict.js';

function arg(name: string): string | undefined {
  const i = process.argv.indexOf(`--${name}`);
  return i >= 0 ? process.argv[i + 1] : undefined;
}

async function main(): Promise<void> {
  const cid = arg('proposal-cid');
  if (!cid) { console.error('usage: inspect-verdict --proposal-cid <cid>'); process.exit(2); }

  process.env.SENTINEL_DRY_RUN = 'true';

  const methodology = readFileSync('agents/sentinel/docs/risk-methodology.md', 'utf-8');
  const methodologyHash = '0x' + createHash('sha256').update(methodology).digest('hex');
  const codeCommit = execSync('git rev-parse HEAD').toString().trim();
  const key = generatePrivateKey();
  const account = privateKeyToAccount(key);

  const proposal = await fetchAllocationProposalByCid(cid);
  if (!proposal) throw new Error('proposal fetch returned null');
  await verifyAllocationProposal(proposal);
  const map = await fetchYieldMapByCid(proposal.sourceMapCid);
  if (!map) throw new Error('map fetch returned null');
  await verifyYieldMap(map);

  const evaluation = evaluateRisk({
    proposal, map, netExposure: {}, totalDepositsBaselineUsd: 10_000_000
  });
  const draft = buildVerdict({
    evaluation,
    proposalId: proposal.proposalId,
    sourceMapCid: proposal.sourceMapCid,
    sourceProposalCid: cid,
    publisherAddress: account.address,
    identityNFT: 'ipfs://placeholder',
    methodologyHash,
    codeCommit,
    now: () => 1_700_000_000_000
  });

  const lines = [
    `# Verdict inspect (dry-run)`,
    ``,
    `- proposalCid: ${cid}`,
    `- mapCid: ${proposal.sourceMapCid}`,
    `- methodologyHash: ${methodologyHash}`,
    `- codeCommit: ${codeCommit}`,
    ``,
    `## Tranches`,
    `- senior: ${draft.tranches.senior}`,
    `- mezzanine: ${draft.tranches.mezzanine}`,
    `- junior: ${draft.tranches.junior}`,
    ``,
    `## Position verdicts`,
    ...Object.entries(draft.perPositionVerdicts).map(([k, v]) => `- ${k}: ${v}`),
    ``,
    `## Reasons (${draft.reasons.length})`,
    ...draft.reasons.map((r) => `- [${r.severity}] ${r.code} @ ${r.target}: ${r.message}`),
    ``,
    `## Hedge signals (${evaluation.hedgeSignals.length})`,
    ...evaluation.hedgeSignals.map((s) => `- ${s.hedgedAsset} ${s.direction} ${s.targetNotionalUsd} USD`)
  ];
  writeFileSync('agents/sentinel/verdict-output.md', lines.join('\n') + '\n');
  console.log('wrote agents/sentinel/verdict-output.md');
}

main().catch((e) => { console.error(e); process.exit(1); });
```

- [ ] **Step 2: Replace `agents/sentinel/src/index.ts`** (live entrypoint)

```ts
import { createServer } from 'node:http';
import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { execSync } from 'node:child_process';
import pino from 'pino';
import { loadConfig } from './config.js';
import { buildChainClients } from './chain/client.js';
import { NetExposureLedger } from './pipeline/netExposure.js';
import { Orchestrator } from './pipeline/orchestrator.js';
import { makeHealth } from './monitor/health.js';
import { makeMetrics } from './monitor/metrics.js';
import { startSentinelRunLoop } from './runLoop.js';
import { makePublisher } from './publication/publish.js';
import { fetchAllocationProposalByCid, fetchYieldMapByCid } from './ipfs/fetch.js';
import { verifyAllocationProposal } from './verify/proposal.js';
import { verifyYieldMap } from './verify/yieldMap.js';

async function main(): Promise<void> {
  const cfg = loadConfig();
  const log = pino({ level: cfg.logLevel });
  log.info('sentinel starting');

  const { publicClient, walletClient, account } = buildChainClients({
    rpcUrl: cfg.chain.rpcUrl,
    rpcFallback: cfg.chain.rpcFallback,
    privateKey: cfg.sentinel.privateKey
  });

  const methodologyText = readFileSync('agents/sentinel/docs/risk-methodology.md', 'utf-8');
  const methodologyHash = '0x' + createHash('sha256').update(methodologyText).digest('hex');
  const codeCommit = execSync('git rev-parse HEAD').toString().trim();

  const metrics = makeMetrics();
  const health = makeHealth();
  const ledger = new NetExposureLedger();

  const publisher = makePublisher({
    wallet: walletClient,
    publicClient,
    account,
    eventBus: cfg.sentinel.eventBus,
    lighthouseApiKey: cfg.ipfs.lighthouseApiKey,
    dryRun: cfg.sentinel.dryRun
  });

  const orchestrator = new Orchestrator({
    fetchProposal: fetchAllocationProposalByCid,
    fetchMap: fetchYieldMapByCid,
    verifyProposal: (p) => verifyAllocationProposal(p, cfg.sentinel.architectAddress as `0x${string}` | undefined),
    verifyMap: (m) => verifyYieldMap(m, cfg.sentinel.scoutAddress as `0x${string}` | undefined),
    snapshotExposure: () => ledger.snapshot(),
    methodologyHash,
    codeCommit,
    publisher,
    publisherAddress: account.address,
    identityNFT: cfg.sentinel.identityNFT,
    totalDepositsBaselineUsd: cfg.sentinel.totalDepositsBaselineUsd
  });

  let fromBlock: bigint;
  try {
    const head = await publicClient.getBlockNumber();
    fromBlock = head > 1000n ? head - 1000n : 0n;
  } catch { fromBlock = 0n; }

  const abort = new AbortController();
  const handle = await startSentinelRunLoop({
    client: publicClient,
    busAddress: cfg.sentinel.eventBus,
    fromBlock,
    orchestrator,
    ledger,
    health,
    metrics,
    abortSignal: abort.signal
  });

  process.on('SIGINT', () => { log.info('SIGINT, shutting down'); abort.abort(); });
  process.on('SIGTERM', () => { log.info('SIGTERM, shutting down'); abort.abort(); });

  const server = createServer(async (req, res) => {
    if (req.url === '/healthz') {
      res.writeHead(200, { 'content-type': 'application/json' });
      res.end(JSON.stringify(health.asJson()));
    } else if (req.url === '/metrics') {
      const body = await metrics.registry.metrics();
      res.writeHead(200, { 'content-type': metrics.registry.contentType });
      res.end(body);
    } else { res.writeHead(404); res.end(); }
  });
  server.listen(cfg.sentinel.healthPort, () => log.info({ port: cfg.sentinel.healthPort }, 'sentinel health+metrics server listening'));

  abort.signal.addEventListener('abort', () => { handle.stop(); server.close(); });
}

main().catch((e) => { console.error(e); process.exit(1); });
```

- [ ] **Step 3: Run unit suite + verify build**

```bash
pnpm --filter @strata/sentinel test
pnpm --filter @strata/sentinel build
```

Expected: all tests PASS, clean build.

- [ ] **Step 4: Commit**

```bash
git add agents/sentinel/scripts/inspect-verdict.ts agents/sentinel/src/index.ts
git commit -m "sentinel: live entrypoint + inspect-verdict script"
```

---

## Pause point

After Task 15, smoke-test Sentinel against a real Architect-published proposal CID:

```bash
pnpm --filter @strata/architect inspect --cid <yieldMapCid>      # gets proposal CID printed to stdout
# pin that proposal to Lighthouse yourself, then:
pnpm --filter @strata/sentinel inspect --proposal-cid <proposalCid>
cat agents/sentinel/verdict-output.md
```

Confirm:
- Per-tranche verdicts make sense given the proposal.
- Hedge signals fire when grossExposure > $250k (which they will, since `totalDepositsBaselineUsd` defaults to $10m and netExposure starts at 0).

Then proceed to Operator (Tasks 16-28).

---

### Task 16: Scaffold @strata/operator package

**Files:**
- Create: `agents/operator/package.json`
- Create: `agents/operator/tsconfig.json`
- Create: `agents/operator/vitest.config.ts`
- Create: `agents/operator/.gitignore`
- Create: `agents/operator/src/index.ts` (stub)

- [ ] **Step 1: Write `agents/operator/package.json`**

```json
{
  "name": "@strata/operator",
  "version": "0.1.0",
  "type": "module",
  "private": true,
  "bin": { "operator": "./dist/index.js" },
  "scripts": {
    "build": "tsc -p .",
    "dev": "tsx src/index.ts",
    "inspect": "tsx scripts/inspect-hedge.ts",
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

- [ ] **Step 2: Write `agents/operator/tsconfig.json`**

```json
{
  "extends": "../../tsconfig.base.json",
  "compilerOptions": { "outDir": "dist", "rootDir": "src" },
  "include": ["src/**/*"]
}
```

- [ ] **Step 3: Write `agents/operator/vitest.config.ts`**

```ts
import { defineConfig } from 'vitest/config';
export default defineConfig({
  test: { include: ['tests/**/*.test.ts'], environment: 'node', globals: false }
});
```

- [ ] **Step 4: Write `agents/operator/.gitignore`**

```
.env
dist
node_modules
*.log
hedge-output.md
```

- [ ] **Step 5: Write `agents/operator/src/index.ts`** (stub)

```ts
export const VERSION = '0.1.0';
console.log(`operator ${VERSION}`);
```

- [ ] **Step 6: Install + verify build**

```bash
pnpm install
pnpm --filter @strata/operator build
```

- [ ] **Step 7: Commit**

```bash
git add agents/operator/package.json agents/operator/tsconfig.json agents/operator/vitest.config.ts agents/operator/.gitignore agents/operator/src/index.ts pnpm-lock.yaml
git commit -m "operator: scaffold @strata/operator package"
```

---

### Task 17: Operator canonical types

**Files:**
- Create: `agents/operator/src/types.ts`
- Create: `agents/operator/tests/unit/types.test.ts`

- [ ] **Step 1: Failing test**

```ts
import { describe, it, expect } from 'vitest';
import { HedgeIntentSchema } from '../../src/types.js';

const valid = {
  version: '1.0',
  intentId: '1',
  sourceSignalCid: 'bafySignal',
  sourceSignalBlock: '12345',
  hedgedAsset: '0x' + 'a'.repeat(40),
  direction: 'short',
  notionalUsd: '1000000',
  contractSize: '500.5',
  spotPriceUsd: '2000.5',
  spotPriceSource: 'coingecko',
  spotPriceTimestampMs: 1_700_000_000_000,
  slippageToleranceBps: 50,
  publisher: { address: '0x' + 'b'.repeat(40), identityNFT: 'ipfs://x' },
  methodologyHash: '0x' + '1'.repeat(64),
  codeCommit: 'deadbeef',
  publishedAtMs: 1_700_000_000_000,
  signature: '0xsig'
};

describe('HedgeIntentSchema', () => {
  it('parses a valid intent', () => {
    expect(HedgeIntentSchema.safeParse(valid).success).toBe(true);
  });
  it('rejects when slippageToleranceBps is negative', () => {
    const bad = { ...valid, slippageToleranceBps: -1 };
    expect(HedgeIntentSchema.safeParse(bad).success).toBe(false);
  });
});
```

- [ ] **Step 2: Implement `agents/operator/src/types.ts`**

```ts
import { z } from 'zod';
import { HedgeDirection } from '@strata/scout/types';

const Address = z.string().regex(/^0x[a-fA-F0-9]{40}$/);
const Bytes32 = z.string().regex(/^0x[a-fA-F0-9]{64}$/);
const Uint256Dec = z.string().regex(/^\d+$/);
const Int256Dec = z.string().regex(/^-?\d+$/);
const Decimal = z.string().regex(/^-?\d+(\.\d+)?$/);

export { HedgeDirection };

export const HedgeIntentSchema = z.object({
  version: z.literal('1.0'),
  intentId: Uint256Dec,
  sourceSignalCid: z.string().min(1),
  sourceSignalBlock: Uint256Dec,
  hedgedAsset: Address,
  direction: HedgeDirection,
  notionalUsd: Int256Dec,
  contractSize: Decimal,
  spotPriceUsd: Decimal,
  spotPriceSource: z.literal('coingecko'),
  spotPriceTimestampMs: z.number().int().min(0),
  slippageToleranceBps: z.number().int().min(0).max(10_000),
  publisher: z.object({ address: Address, identityNFT: z.string() }),
  methodologyHash: Bytes32,
  codeCommit: z.string(),
  publishedAtMs: z.number().int().min(0),
  signature: z.string()
});
export type HedgeIntent = z.infer<typeof HedgeIntentSchema>;
```

- [ ] **Step 3: Run, expect PASS. Commit**

```bash
git add agents/operator/src/types.ts agents/operator/tests/unit/types.test.ts
git commit -m "operator: canonical HedgeIntent schema"
```

---

### Task 18: Config + chain client

**Files:**
- Create: `agents/operator/src/config.ts`
- Create: `agents/operator/src/chain/client.ts`
- Create: `agents/operator/.env.example`
- Create: `agents/operator/tests/unit/config.test.ts`

- [ ] **Step 1: Failing test** (mirrors Sentinel's pattern; rejects live mode without bus address).

```ts
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { loadConfig } from '../../src/config.js';

const baseEnv = {
  MANTLE_RPC_URL: 'https://rpc.mantle.xyz',
  OPERATOR_PRIVATE_KEY: '0x' + '1'.repeat(64),
  LIGHTHOUSE_API_KEY: 'lh-key',
  COINGECKO_API_KEY: 'cg-key',
  OPERATOR_DRY_RUN: 'true'
};

describe('loadConfig', () => {
  let saved: NodeJS.ProcessEnv;
  beforeEach(() => { saved = { ...process.env }; });
  afterEach(() => { process.env = saved; });

  it('loads valid env', () => {
    process.env = { ...baseEnv } as any;
    const cfg = loadConfig();
    expect(cfg.chain.id).toBe(5000);
    expect(cfg.operator.dryRun).toBe(true);
  });

  it('rejects live mode without bus address', () => {
    process.env = { ...baseEnv, OPERATOR_DRY_RUN: 'false' } as any;
    expect(() => loadConfig()).toThrow(/AGENT_EVENT_BUS_ADDRESS/);
  });
});
```

- [ ] **Step 2: Implement `agents/operator/src/config.ts`**

```ts
import { z } from 'zod';

const Env = z.object({
  MANTLE_RPC_URL: z.string().url(),
  MANTLE_RPC_URL_FALLBACK: z.string().url().default('https://mantle.publicgoods.network'),
  OPERATOR_PRIVATE_KEY: z.string().regex(/^0x[a-fA-F0-9]{64}$/),
  AGENT_EVENT_BUS_ADDRESS: z.string().regex(/^0x[a-fA-F0-9]{40}$/).optional(),
  IDENTITY_REGISTRY_ADDRESS: z.string().regex(/^0x[a-fA-F0-9]{40}$/).optional(),
  SENTINEL_ADDRESS: z.string().regex(/^0x[a-fA-F0-9]{40}$/).optional(),
  LIGHTHOUSE_API_KEY: z.string().min(1),
  COINGECKO_API_KEY: z.string().min(1),
  LOG_LEVEL: z.enum(['debug', 'info', 'warn', 'error']).default('info'),
  OPERATOR_DRY_RUN: z.enum(['true', 'false']).default('false').transform((v) => v === 'true'),
  OPERATOR_IDENTITY_NFT: z.string().default('ipfs://placeholder'),
  OPERATOR_HEALTH_PORT: z.coerce.number().int().min(1).max(65535).default(9093)
});

export function loadConfig() {
  const parsed = Env.safeParse(process.env);
  if (!parsed.success) {
    throw new Error(`Config error: ${parsed.error.issues.map((i) => i.path.join('.')).join(', ')}`);
  }
  const env = parsed.data;
  if (!env.OPERATOR_DRY_RUN && !env.AGENT_EVENT_BUS_ADDRESS) {
    throw new Error('Config error: AGENT_EVENT_BUS_ADDRESS required when OPERATOR_DRY_RUN is not true');
  }
  if (!env.OPERATOR_DRY_RUN && !env.IDENTITY_REGISTRY_ADDRESS) {
    throw new Error('Config error: IDENTITY_REGISTRY_ADDRESS required when OPERATOR_DRY_RUN is not true');
  }
  return {
    chain: { id: 5000, rpcUrl: env.MANTLE_RPC_URL, rpcFallback: env.MANTLE_RPC_URL_FALLBACK },
    operator: {
      privateKey: env.OPERATOR_PRIVATE_KEY as `0x${string}`,
      eventBus: (env.AGENT_EVENT_BUS_ADDRESS ?? '0x0000000000000000000000000000000000000000') as `0x${string}`,
      identityRegistry: (env.IDENTITY_REGISTRY_ADDRESS ?? '0x0000000000000000000000000000000000000000') as `0x${string}`,
      ...(env.SENTINEL_ADDRESS ? { sentinelAddress: env.SENTINEL_ADDRESS as `0x${string}` } : {}),
      identityNFT: env.OPERATOR_IDENTITY_NFT,
      dryRun: env.OPERATOR_DRY_RUN,
      healthPort: env.OPERATOR_HEALTH_PORT
    },
    ipfs: { lighthouseApiKey: env.LIGHTHOUSE_API_KEY },
    market: { coingeckoApiKey: env.COINGECKO_API_KEY },
    logLevel: env.LOG_LEVEL
  } as const;
}
export type OperatorConfig = ReturnType<typeof loadConfig>;
```

- [ ] **Step 3: Implement `agents/operator/src/chain/client.ts`** (copy of Sentinel's chain client; swap env names where needed). Same shape.

```ts
import { createPublicClient, createWalletClient, http, fallback } from 'viem';
import { privateKeyToAccount } from 'viem/accounts';
import { mantle } from 'viem/chains';

export interface ChainClients {
  publicClient: ReturnType<typeof createPublicClient>;
  walletClient: ReturnType<typeof createWalletClient>;
  account: ReturnType<typeof privateKeyToAccount>;
}

export function buildChainClients(opts: {
  rpcUrl: string;
  rpcFallback: string;
  privateKey: `0x${string}`;
}): ChainClients {
  const transport = fallback([http(opts.rpcUrl), http(opts.rpcFallback)]);
  const account = privateKeyToAccount(opts.privateKey);
  const publicClient = createPublicClient({ chain: mantle, transport });
  const walletClient = createWalletClient({ account, chain: mantle, transport });
  return { publicClient, walletClient, account };
}
```

- [ ] **Step 4: Write `agents/operator/.env.example`**

```
MANTLE_RPC_URL=https://rpc.mantle.xyz
OPERATOR_PRIVATE_KEY=0x...
OPERATOR_DRY_RUN=true
AGENT_EVENT_BUS_ADDRESS=
IDENTITY_REGISTRY_ADDRESS=
SENTINEL_ADDRESS=
LIGHTHOUSE_API_KEY=
COINGECKO_API_KEY=
LOG_LEVEL=info
OPERATOR_IDENTITY_NFT=ipfs://placeholder
OPERATOR_HEALTH_PORT=9093
```

- [ ] **Step 5: Run, expect PASS. Commit**

```bash
git add agents/operator/src/config.ts agents/operator/src/chain/client.ts agents/operator/.env.example agents/operator/tests/unit/config.test.ts
git commit -m "operator: config + viem chain client"
```

---

### Task 19: HedgeSignalEmitted subscriber + backfill

**Files:**
- Create: `agents/operator/src/subscription/hedgeSignal.ts`
- Create: `agents/operator/tests/unit/hedgeSignalSub.test.ts`

Same shape as Sentinel's AllocationProposed subscriber. Live + backfill, abi+eventName form, onLiveError + onError both wired.

- [ ] **Step 1: Failing test**

```ts
import { describe, it, expect, vi } from 'vitest';
import { subscribeHedgeSignals } from '../../src/subscription/hedgeSignal.js';

describe('subscribeHedgeSignals', () => {
  it('backfills past events then attaches a live watcher', async () => {
    const calls: any[] = [];
    let liveCallback: ((logs: any[]) => Promise<void>) | undefined;
    const client = {
      getContractEvents: vi.fn().mockResolvedValue([
        { args: { agent: '0xagent', hedgedAsset: '0xA', targetNotionalUsd: 1_000_000n, reasoningHash: 'cidA' }, blockNumber: 100n }
      ]),
      watchContractEvent: vi.fn().mockImplementation((cfg: any) => { liveCallback = cfg.onLogs; return () => {}; })
    } as any;
    await subscribeHedgeSignals(client, '0xbus', 0n, async (e) => { calls.push(e); });
    expect(calls).toHaveLength(1);
    expect(calls[0].targetNotionalUsd).toBe(1_000_000n);
    await liveCallback?.([{ args: { agent: '0xagent', hedgedAsset: '0xB', targetNotionalUsd: -2_000_000n, reasoningHash: 'cidB' }, blockNumber: 101n }]);
    expect(calls).toHaveLength(2);
    expect(calls[1].targetNotionalUsd).toBe(-2_000_000n);
  });
});
```

- [ ] **Step 2: Implement `agents/operator/src/subscription/hedgeSignal.ts`**

```ts
import type { PublicClient, Log } from 'viem';
import { parseAbiItem } from 'viem';

const hedgeSignalEvent = parseAbiItem(
  'event HedgeSignalEmitted(address indexed agent, address indexed hedgedAsset, int256 targetNotionalUsd, string reasoningHash)'
);
const HEDGE_SIGNAL_ABI = [hedgeSignalEvent] as const;

type HedgeSignalLog = Log<bigint, number, false, typeof hedgeSignalEvent, true, typeof HEDGE_SIGNAL_ABI, 'HedgeSignalEmitted'>;

export interface HedgeSignalEvent {
  agent: `0x${string}`;
  hedgedAsset: `0x${string}`;
  targetNotionalUsd: bigint;
  reasoningHash: string;
  blockNumber: bigint;
}

function decodeLog(log: HedgeSignalLog): HedgeSignalEvent | null {
  if (log.blockNumber === null) return null;
  return {
    agent: log.args.agent!,
    hedgedAsset: log.args.hedgedAsset!,
    targetNotionalUsd: log.args.targetNotionalUsd!,
    reasoningHash: log.args.reasoningHash!,
    blockNumber: log.blockNumber
  };
}

export async function subscribeHedgeSignals(
  client: PublicClient,
  busAddress: `0x${string}`,
  fromBlock: bigint,
  onSignal: (e: HedgeSignalEvent) => Promise<void>,
  onLiveError?: (err: unknown) => void
): Promise<() => void> {
  const past = await client.getContractEvents({
    address: busAddress,
    abi: HEDGE_SIGNAL_ABI,
    eventName: 'HedgeSignalEmitted',
    fromBlock,
    toBlock: 'latest'
  });
  for (const log of past) {
    const decoded = decodeLog(log as HedgeSignalLog);
    if (decoded) await onSignal(decoded);
  }
  const unsubscribe = client.watchContractEvent({
    address: busAddress,
    abi: HEDGE_SIGNAL_ABI,
    eventName: 'HedgeSignalEmitted',
    onLogs: async (logs) => {
      for (const log of logs) {
        const decoded = decodeLog(log as HedgeSignalLog);
        if (!decoded) continue;
        try { await onSignal(decoded); } catch (err) { onLiveError?.(err); }
      }
    },
    onError: (err) => onLiveError?.(err)
  });
  return unsubscribe;
}
```

- [ ] **Step 3: Run, expect PASS. Commit**

```bash
git add agents/operator/src/subscription/hedgeSignal.ts agents/operator/tests/unit/hedgeSignalSub.test.ts
git commit -m "operator: HedgeSignalEmitted subscriber with backfill + live watch"
```

---

### Task 20: IPFS fetch + HedgeSignal verifier

**Files:**
- Create: `agents/operator/src/ipfs/fetch.ts`
- Create: `agents/operator/src/verify/hedgeSignal.ts`
- Create: `agents/operator/tests/unit/verifyHedgeSignal.test.ts`

`fetchHedgeSignalByCid` retrieves Sentinel's signed signal JSON (the richer artifact behind the `reasoningHash` CID). `verifyHedgeSignal` recovers the signer and confirms it matches `signal.publisher.address` and (optionally) the configured `SENTINEL_ADDRESS`.

- [ ] **Step 1: Failing tests**

```ts
import { describe, it, expect } from 'vitest';
import { privateKeyToAccount, generatePrivateKey } from 'viem/accounts';
import { keccak256, toBytes } from 'viem';
import { canonicalStringify } from '@strata/scout/signer';
import { verifyHedgeSignal } from '../../src/verify/hedgeSignal.js';

describe('verifyHedgeSignal', () => {
  it('passes when the signature recovers to publisher.address', async () => {
    const key = generatePrivateKey();
    const acct = privateKeyToAccount(key);
    const draft = {
      version: '1.0' as const, signalId: '1', sourceVerdictCid: 'v',
      sourceProposalId: '1', hedgedAsset: '0x' + 'a'.repeat(40),
      targetNotionalUsd: '1000000', direction: 'short' as const,
      publisher: { address: acct.address, identityNFT: 'ipfs://x' },
      methodologyHash: '0x' + '1'.repeat(64), codeCommit: 'c',
      publishedAtMs: 0
    };
    const unsigned = canonicalStringify({ ...draft, signature: '' });
    const signature = await acct.signMessage({ message: { raw: keccak256(toBytes(unsigned)) } });
    await expect(verifyHedgeSignal({ ...draft, signature } as any)).resolves.toBeUndefined();
  });
});
```

- [ ] **Step 2: Implement `agents/operator/src/ipfs/fetch.ts`**

```ts
import { z } from 'zod';

const Address = z.string().regex(/^0x[a-fA-F0-9]{40}$/);
const Bytes32 = z.string().regex(/^0x[a-fA-F0-9]{64}$/);
const Uint256Dec = z.string().regex(/^\d+$/);
const Int256Dec = z.string().regex(/^-?\d+$/);

export const HedgeSignalSchema = z.object({
  version: z.literal('1.0'),
  signalId: Uint256Dec,
  sourceVerdictCid: z.string().min(1),
  sourceProposalId: Uint256Dec,
  hedgedAsset: Address,
  targetNotionalUsd: Int256Dec,
  direction: z.enum(['long', 'short']),
  publisher: z.object({ address: Address, identityNFT: z.string() }),
  methodologyHash: Bytes32,
  codeCommit: z.string(),
  publishedAtMs: z.number().int().min(0),
  signature: z.string()
});
export type HedgeSignal = z.infer<typeof HedgeSignalSchema>;

const GATEWAYS = [
  'https://gateway.lighthouse.storage/ipfs/',
  'https://ipfs.io/ipfs/',
  'https://dweb.link/ipfs/'
];
const FETCH_TIMEOUT_MS = 10_000;

export async function fetchHedgeSignalByCid(cid: string): Promise<HedgeSignal | null> {
  const errors: string[] = [];
  for (const gw of GATEWAYS) {
    const ac = new AbortController();
    const t = setTimeout(() => ac.abort(), FETCH_TIMEOUT_MS);
    try {
      const res = await fetch(`${gw}${cid}`, { signal: ac.signal });
      if (!res.ok) { errors.push(`${gw}: HTTP ${res.status}`); continue; }
      const raw = await res.json();
      const parsed = HedgeSignalSchema.safeParse(raw);
      if (!parsed.success) {
        throw new Error(`fetchHedgeSignalByCid: invalid schema for ${cid}: ${parsed.error.message}`);
      }
      return parsed.data;
    } catch (e) {
      errors.push(`${gw}: ${(e as Error).message}`);
    } finally { clearTimeout(t); }
  }
  throw new Error(`all gateways failed for ${cid}: ${errors.join('; ')}`);
}
```

- [ ] **Step 3: Implement `agents/operator/src/verify/hedgeSignal.ts`**

```ts
import { keccak256, toBytes, recoverMessageAddress } from 'viem';
import { canonicalStringify } from '@strata/scout/signer';
import type { HedgeSignal } from '../ipfs/fetch.js';

export async function verifyHedgeSignal(
  signal: HedgeSignal,
  expectedSigner?: `0x${string}`
): Promise<void> {
  const unsigned = canonicalStringify({ ...signal, signature: '' });
  const hash = keccak256(toBytes(unsigned));
  const recovered = await recoverMessageAddress({
    message: { raw: hash },
    signature: signal.signature as `0x${string}`
  });
  if (recovered.toLowerCase() !== signal.publisher.address.toLowerCase()) {
    throw new Error(`hedge-signal signature does not recover to publisher.address (recovered=${recovered}, publisher=${signal.publisher.address})`);
  }
  if (expectedSigner && recovered.toLowerCase() !== expectedSigner.toLowerCase()) {
    throw new Error(`hedge-signal signer ${recovered} is not the expected Sentinel address ${expectedSigner}`);
  }
}
```

- [ ] **Step 4: Run, expect PASS. Commit**

```bash
git add agents/operator/src/ipfs/fetch.ts agents/operator/src/verify/hedgeSignal.ts agents/operator/tests/unit/verifyHedgeSignal.test.ts
git commit -m "operator: ipfs fetcher + hedge-signal verifier"
```

---

### Task 21: CoinGecko spot price lookup

**Files:**
- Create: `agents/operator/src/market/coingecko.ts`
- Create: `agents/operator/tests/unit/coingecko.test.ts`

CoinGecko is an already-locked integration (used by Scout for `depegHistory`). Operator uses its `/simple/token_price` endpoint by chain + contract to fetch the current USD spot for the asset address in a signal. Demo-tier API key is already in `agents/scout/.env`; copy into `agents/operator/.env`.

- [ ] **Step 1: Failing test** mocking the CoinGecko response with msw.

```ts
import { describe, it, expect, beforeAll, afterAll, afterEach } from 'vitest';
import { setupServer } from 'msw/node';
import { http, HttpResponse } from 'msw';
import { fetchSpotUsd } from '../../src/market/coingecko.js';

const server = setupServer(
  http.get('https://api.coingecko.com/api/v3/simple/token_price/mantle', ({ request }) => {
    const u = new URL(request.url);
    const addr = u.searchParams.get('contract_addresses')!;
    return HttpResponse.json({ [addr.toLowerCase()]: { usd: 2000.5 } });
  })
);
beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe('fetchSpotUsd', () => {
  it('returns the price for a known token', async () => {
    const price = await fetchSpotUsd('0xAbC' + '0'.repeat(37), 'demo-key');
    expect(price).toBe(2000.5);
  });

  it('throws when CoinGecko returns no price', async () => {
    server.use(
      http.get('https://api.coingecko.com/api/v3/simple/token_price/mantle', () => HttpResponse.json({}))
    );
    await expect(fetchSpotUsd('0xDeAd' + '0'.repeat(36), 'demo-key')).rejects.toThrow(/no price/);
  });
});
```

- [ ] **Step 2: Implement `agents/operator/src/market/coingecko.ts`**

```ts
const BASE = 'https://api.coingecko.com/api/v3/simple/token_price/mantle';
const FETCH_TIMEOUT_MS = 10_000;

export async function fetchSpotUsd(tokenAddress: string, apiKey: string): Promise<number> {
  const ac = new AbortController();
  const t = setTimeout(() => ac.abort(), FETCH_TIMEOUT_MS);
  try {
    const url = `${BASE}?contract_addresses=${tokenAddress.toLowerCase()}&vs_currencies=usd&x_cg_demo_api_key=${apiKey}`;
    const res = await fetch(url, { signal: ac.signal, headers: { accept: 'application/json' } });
    if (!res.ok) throw new Error(`coingecko HTTP ${res.status}`);
    const body = await res.json() as Record<string, { usd?: number }>;
    const entry = body[tokenAddress.toLowerCase()];
    const price = entry?.usd;
    if (price === undefined || price <= 0) {
      throw new Error(`coingecko: no price for ${tokenAddress}`);
    }
    return price;
  } finally { clearTimeout(t); }
}
```

- [ ] **Step 3: Run, expect PASS. Commit**

```bash
git add agents/operator/src/market/coingecko.ts agents/operator/tests/unit/coingecko.test.ts
git commit -m "operator: CoinGecko spot price lookup"
```

---

### Task 22: Hedge sizing engine

**Files:**
- Create: `agents/operator/src/pipeline/sizeHedge.ts`
- Create: `agents/operator/tests/unit/sizeHedge.test.ts`

Pure function. Takes `(signal, spotPriceUsd)` returns `SizingResult` (either `{ kind: 'sized', notionalUsd, contractSize, direction }` or `{ kind: 'skip', reason }`).

- [ ] **Step 1: Failing tests**

```ts
import { describe, it, expect } from 'vitest';
import { sizeHedge, HEDGE_CONSTANTS } from '../../src/pipeline/sizeHedge.js';

describe('sizeHedge', () => {
  it('skips below the noise floor', () => {
    const r = sizeHedge({ targetNotionalUsd: 5_000n, hedgedAsset: '0x' + 'a'.repeat(40) as `0x${string}` }, 2000);
    expect(r.kind).toBe('skip');
    if (r.kind === 'skip') expect(r.reason).toBe('below-floor');
  });

  it('sizes a positive notional as a short', () => {
    const r = sizeHedge({ targetNotionalUsd: 1_000_000n, hedgedAsset: '0x' + 'a'.repeat(40) as `0x${string}` }, 2000);
    expect(r.kind).toBe('sized');
    if (r.kind === 'sized') {
      expect(r.notionalUsd).toBe(1_000_000n);
      expect(r.direction).toBe('short');
      expect(r.contractSize).toBe('500');
    }
  });

  it('clamps to the max', () => {
    const r = sizeHedge({ targetNotionalUsd: 10_000_000n, hedgedAsset: '0x' + 'a'.repeat(40) as `0x${string}` }, 2000);
    if (r.kind !== 'sized') throw new Error('expected sized');
    expect(r.notionalUsd).toBe(BigInt(HEDGE_CONSTANTS.maxNotionalUsd));
  });

  it('sizes a negative notional as a long', () => {
    const r = sizeHedge({ targetNotionalUsd: -1_000_000n, hedgedAsset: '0x' + 'a'.repeat(40) as `0x${string}` }, 2000);
    if (r.kind !== 'sized') throw new Error('expected sized');
    expect(r.direction).toBe('long');
    expect(r.notionalUsd).toBe(-1_000_000n);
  });
});
```

- [ ] **Step 2: Implement `agents/operator/src/pipeline/sizeHedge.ts`**

```ts
export const HEDGE_CONSTANTS = Object.freeze({
  overshootBps: 0,
  minNotionalUsd: 10_000,
  maxNotionalUsd: 5_000_000,
  slippageToleranceBps: 50
});

export interface SizeHedgeInput {
  targetNotionalUsd: bigint;
  hedgedAsset: `0x${string}`;
}

export type SizingResult =
  | { kind: 'sized'; notionalUsd: bigint; contractSize: string; direction: 'long' | 'short' }
  | { kind: 'skip'; reason: 'below-floor' };

function absBigInt(x: bigint): bigint { return x < 0n ? -x : x; }

function formatContractSize(notionalAbsUsd: bigint, spotUsd: number): string {
  const num = Number(notionalAbsUsd) / spotUsd;
  if (!Number.isFinite(num)) return '0';
  return num.toString();
}

export function sizeHedge(input: SizeHedgeInput, spotPriceUsd: number): SizingResult {
  const target = input.targetNotionalUsd;
  const absTarget = absBigInt(target);
  if (absTarget < BigInt(HEDGE_CONSTANTS.minNotionalUsd)) {
    return { kind: 'skip', reason: 'below-floor' };
  }
  const maxBig = BigInt(HEDGE_CONSTANTS.maxNotionalUsd);
  const sign = target >= 0n ? 1n : -1n;
  const clampedAbs = absTarget > maxBig ? maxBig : absTarget;
  const notionalUsd = sign * clampedAbs;
  const direction: 'long' | 'short' = sign === 1n ? 'short' : 'long';
  const contractSize = formatContractSize(clampedAbs, spotPriceUsd);
  return { kind: 'sized', notionalUsd, contractSize, direction };
}
```

- [ ] **Step 3: Run, expect PASS. Commit**

```bash
git add agents/operator/src/pipeline/sizeHedge.ts agents/operator/tests/unit/sizeHedge.test.ts
git commit -m "operator: deterministic hedge sizing engine"
```

---

### Task 23: buildIntent composes canonical artifact

**Files:**
- Create: `agents/operator/src/pipeline/buildIntent.ts`
- Create: `agents/operator/tests/unit/buildIntent.test.ts`

Pure function. Composes `Omit<HedgeIntent, 'signature'>`. `intentId = uint256(keccak256(sourceSignalCid + '|' + sourceSignalBlock))`.

- [ ] **Step 1: Failing test**

```ts
import { describe, it, expect } from 'vitest';
import { buildIntent } from '../../src/pipeline/buildIntent.js';

describe('buildIntent', () => {
  it('composes a hedge intent draft', () => {
    const draft = buildIntent({
      sourceSignalCid: 'bafySignal',
      sourceSignalBlock: 12345n,
      hedgedAsset: '0x' + 'a'.repeat(40),
      sizing: { kind: 'sized', notionalUsd: 1_000_000n, contractSize: '500', direction: 'short' },
      spotPriceUsd: 2000,
      spotPriceTimestampMs: 1_700_000_000_000,
      publisherAddress: '0x' + 'b'.repeat(40),
      identityNFT: 'ipfs://x',
      methodologyHash: '0x' + '1'.repeat(64),
      codeCommit: 'c',
      now: () => 1_700_000_000_000
    });
    expect(draft.intentId).toMatch(/^\d+$/);
    expect(draft.direction).toBe('short');
    expect(draft.notionalUsd).toBe('1000000');
    expect(draft.spotPriceUsd).toBe('2000');
    expect(draft.slippageToleranceBps).toBe(50);
  });
});
```

- [ ] **Step 2: Implement `agents/operator/src/pipeline/buildIntent.ts`**

```ts
import { keccak256, toBytes } from 'viem';
import { HEDGE_CONSTANTS, type SizingResult } from './sizeHedge.js';
import type { HedgeIntent } from '../types.js';

export interface BuildIntentArgs {
  sourceSignalCid: string;
  sourceSignalBlock: bigint;
  hedgedAsset: string;
  sizing: Extract<SizingResult, { kind: 'sized' }>;
  spotPriceUsd: number;
  spotPriceTimestampMs: number;
  publisherAddress: string;
  identityNFT: string;
  methodologyHash: string;
  codeCommit: string;
  now?: () => number;
}

export function buildIntent(args: BuildIntentArgs): Omit<HedgeIntent, 'signature'> {
  const now = args.now ?? (() => Date.now());
  const publishedAtMs = now();
  const seed = `${args.sourceSignalCid}|${args.sourceSignalBlock.toString()}`;
  const intentId = BigInt(keccak256(toBytes(seed))).toString();
  return {
    version: '1.0',
    intentId,
    sourceSignalCid: args.sourceSignalCid,
    sourceSignalBlock: args.sourceSignalBlock.toString(),
    hedgedAsset: args.hedgedAsset,
    direction: args.sizing.direction,
    notionalUsd: args.sizing.notionalUsd.toString(),
    contractSize: args.sizing.contractSize,
    spotPriceUsd: args.spotPriceUsd.toString(),
    spotPriceSource: 'coingecko',
    spotPriceTimestampMs: args.spotPriceTimestampMs,
    slippageToleranceBps: HEDGE_CONSTANTS.slippageToleranceBps,
    publisher: { address: args.publisherAddress, identityNFT: args.identityNFT },
    methodologyHash: args.methodologyHash,
    codeCommit: args.codeCommit,
    publishedAtMs
  };
}
```

- [ ] **Step 3: Run, expect PASS. Commit**

```bash
git add agents/operator/src/pipeline/buildIntent.ts agents/operator/tests/unit/buildIntent.test.ts
git commit -m "operator: buildIntent composes canonical artifact"
```

---

### Task 24: logHedge onchain wrapper + Publisher

**Files:**
- Create: `agents/operator/src/publication/abi/agentEventBus.ts`
- Create: `agents/operator/src/publication/onchain.ts`
- Create: `agents/operator/src/publication/publish.ts`
- Create: `agents/operator/tests/unit/publish.test.ts`

`logHedgeOnChain` wraps `bus.logHedge(hedgedAsset, netPosition, executionProof)`. `makePublisher` returns `publishIntent(draft)` which signs + pins + emits. `netPosition` on-chain is the signed notional in 6-decimal USDC units: `BigInt(round(notionalUsd * 1e6))`.

- [ ] **Step 1: Failing test** for `publishIntent` in dry-run mode (mirrors Sentinel's publish test).

```ts
import { describe, it, expect, vi } from 'vitest';
import { makePublisher } from '../../src/publication/publish.js';

describe('publishIntent (dry-run)', () => {
  it('signs + pins + skips onchain', async () => {
    const pin = vi.fn().mockResolvedValue('bafyIntent');
    const onchain = vi.fn();
    const publisher = makePublisher({
      wallet: {} as any,
      publicClient: {} as any,
      account: {
        address: '0x' + 'a'.repeat(40),
        signMessage: vi.fn().mockResolvedValue('0xsig')
      } as any,
      eventBus: '0xbus',
      lighthouseApiKey: 'k',
      dryRun: true,
      pinOverride: pin,
      onChainOverride: onchain
    });
    const draft = {
      version: '1.0' as const,
      intentId: '1',
      sourceSignalCid: 'bafySignal',
      sourceSignalBlock: '12345',
      hedgedAsset: '0x' + 'a'.repeat(40),
      direction: 'short' as const,
      notionalUsd: '1000000',
      contractSize: '500',
      spotPriceUsd: '2000',
      spotPriceSource: 'coingecko' as const,
      spotPriceTimestampMs: 1_700_000_000_000,
      slippageToleranceBps: 50,
      publisher: { address: '0x' + 'a'.repeat(40), identityNFT: 'ipfs://x' },
      methodologyHash: '0x' + '1'.repeat(64),
      codeCommit: 'c',
      publishedAtMs: 0
    };
    const out = await publisher.publishIntent(draft);
    expect(out.cid).toBe('bafyIntent');
    expect(onchain).not.toHaveBeenCalled();
    expect(pin).toHaveBeenCalledTimes(1);
  });
});
```

- [ ] **Step 2: Implement `agents/operator/src/publication/abi/agentEventBus.ts`**

```ts
export const agentEventBusAbi = [
  {
    type: 'function',
    name: 'logHedge',
    stateMutability: 'nonpayable',
    inputs: [
      { name: 'hedgedAsset',    type: 'address' },
      { name: 'netPosition',    type: 'int256' },
      { name: 'executionProof', type: 'string' }
    ],
    outputs: []
  }
] as const;
```

- [ ] **Step 3: Implement `agents/operator/src/publication/onchain.ts`**

```ts
import type { WalletClient, PublicClient, Account } from 'viem';
import pRetry, { AbortError } from 'p-retry';
import { agentEventBusAbi } from './abi/agentEventBus.js';

const DEFAULT_RETRY = { retries: 2, minTimeout: 1_000, maxTimeout: 4_000 };

export interface LogHedgeOnChainArgs {
  wallet: WalletClient;
  publicClient: PublicClient;
  account: Account;
  eventBus: `0x${string}`;
  hedgedAsset: `0x${string}`;
  netPosition: bigint;
  executionProof: string;
  retryConfig?: { retries: number; minTimeout: number; maxTimeout: number };
}

export async function logHedgeOnChain(args: LogHedgeOnChainArgs): Promise<`0x${string}`> {
  return pRetry(async () => {
    const hash = await args.wallet.writeContract({
      address: args.eventBus,
      abi: agentEventBusAbi,
      functionName: 'logHedge',
      args: [args.hedgedAsset, args.netPosition, args.executionProof],
      account: args.account,
      chain: null
    } as any);
    const receipt = await args.publicClient.waitForTransactionReceipt({ hash, timeout: 60_000 });
    if (receipt.status !== 'success') throw new AbortError(`tx reverted: ${hash}`);
    return hash;
  }, args.retryConfig ?? DEFAULT_RETRY);
}
```

- [ ] **Step 4: Implement `agents/operator/src/publication/publish.ts`**

```ts
import { keccak256, toBytes } from 'viem';
import type { WalletClient, PublicClient, Account } from 'viem';
import { canonicalStringify } from '@strata/scout/signer';
import { pinJsonToLighthouse } from '@strata/scout/ipfs';
import type { HedgeIntent } from '../types.js';
import { logHedgeOnChain } from './onchain.js';

export interface MakePublisherArgs {
  wallet: WalletClient;
  publicClient: PublicClient;
  account: Account;
  eventBus: `0x${string}`;
  lighthouseApiKey: string;
  dryRun: boolean;
  pinOverride?: (json: string, key: string) => Promise<string>;
  onChainOverride?: typeof logHedgeOnChain;
}

export interface PublishedIntent { cid: string; intent: HedgeIntent; txHash?: `0x${string}` }

function notionalToUsdcUnits(notionalUsdDecimal: string): bigint {
  // 6-decimal USDC. Round-half-away-from-zero, deterministic.
  const num = Number(notionalUsdDecimal);
  const scaled = Math.round(num * 1_000_000);
  return BigInt(scaled);
}

export function makePublisher(args: MakePublisherArgs) {
  const pin = args.pinOverride ?? pinJsonToLighthouse;
  const onChain = args.onChainOverride ?? logHedgeOnChain;

  async function publishIntent(draft: Omit<HedgeIntent, 'signature'>): Promise<PublishedIntent> {
    const unsigned = canonicalStringify({ ...draft, signature: '' });
    const hash = keccak256(toBytes(unsigned));
    const signature = await (args.account as any).signMessage({ message: { raw: hash } });
    const intent: HedgeIntent = { ...draft, signature };
    const cid = await pin(canonicalStringify(intent), args.lighthouseApiKey);
    if (args.dryRun) return { cid, intent };
    const netPosition = notionalToUsdcUnits(intent.notionalUsd);
    const txHash = await onChain({
      wallet: args.wallet,
      publicClient: args.publicClient,
      account: args.account,
      eventBus: args.eventBus,
      hedgedAsset: intent.hedgedAsset as `0x${string}`,
      netPosition,
      executionProof: cid
    });
    return { cid, intent, txHash };
  }
  return { publishIntent };
}
```

- [ ] **Step 5: Run, expect PASS. Commit**

```bash
git add agents/operator/src/publication/abi/agentEventBus.ts agents/operator/src/publication/onchain.ts agents/operator/src/publication/publish.ts agents/operator/tests/unit/publish.test.ts
git commit -m "operator: logHedge onchain wrapper + publisher"
```

---

### Task 25: Orchestrator (runHedgeCycle)

**Files:**
- Create: `agents/operator/src/pipeline/orchestrator.ts`
- Create: `agents/operator/tests/unit/orchestrator.test.ts`

`Orchestrator.runHedgeCycle(signalCid, signalBlock)`:
1. Dedup: skip if `signalCid` already processed.
2. Fetch + verify signal (Sentinel signature, optional address gate).
3. Fetch CoinGecko spot price for `signal.hedgedAsset`.
4. `sizeHedge()`.
5. If `kind === 'skip'`, return skipped.
6. Else: build intent, publish (sign + pin + emit `logHedge`).
7. Update `lastProcessedCid` on success.

Returns `{ status: 'published', cid }` | `{ status: 'skipped', reason }`.

- [ ] **Step 1: Failing test** asserts dedup short-circuit.

```ts
import { describe, it, expect, vi } from 'vitest';
import { Orchestrator } from '../../src/pipeline/orchestrator.js';

describe('Orchestrator.runHedgeCycle', () => {
  it('skips when signal CID matches last processed', async () => {
    const o = new Orchestrator({
      fetchSignal: vi.fn(),
      verifySignal: vi.fn(),
      fetchSpotUsd: vi.fn(),
      methodologyHash: '0x' + '1'.repeat(64),
      codeCommit: 'c',
      publisher: { publishIntent: vi.fn() } as any,
      publisherAddress: '0x' + 'a'.repeat(40),
      identityNFT: 'ipfs://x'
    });
    (o as any).lastProcessedCid = 'bafyDup';
    const r = await o.runHedgeCycle('bafyDup', 1n);
    expect(r.status).toBe('skipped');
    if (r.status === 'skipped') expect(r.reason).toBe('duplicate');
  });
});
```

- [ ] **Step 2: Implement `agents/operator/src/pipeline/orchestrator.ts`**

```ts
import type { HedgeSignal } from '../ipfs/fetch.js';
import { sizeHedge } from './sizeHedge.js';
import { buildIntent } from './buildIntent.js';
import type { HedgeIntent } from '../types.js';

export type RunResult =
  | { status: 'published'; cid: string; intent: HedgeIntent }
  | { status: 'skipped'; reason: 'duplicate' | 'verification-failed' | 'below-floor' | 'price-unavailable' };

export interface OrchestratorDeps {
  fetchSignal: (cid: string) => Promise<HedgeSignal | null>;
  verifySignal: (s: HedgeSignal) => Promise<void>;
  fetchSpotUsd: (tokenAddress: string) => Promise<number>;
  methodologyHash: string;
  codeCommit: string;
  publisher: {
    publishIntent: (draft: Omit<HedgeIntent, 'signature'>) => Promise<{ cid: string; intent: HedgeIntent }>;
  };
  publisherAddress: string;
  identityNFT: string;
  now?: () => number;
}

export class Orchestrator {
  private lastProcessedCid: string | null = null;
  constructor(private deps: OrchestratorDeps) {}

  async runHedgeCycle(signalCid: string, signalBlock: bigint): Promise<RunResult> {
    if (signalCid === this.lastProcessedCid) {
      return { status: 'skipped', reason: 'duplicate' };
    }
    const now = this.deps.now ?? (() => Date.now());

    let signal: HedgeSignal | null;
    try {
      signal = await this.deps.fetchSignal(signalCid);
      if (!signal) return { status: 'skipped', reason: 'verification-failed' };
      await this.deps.verifySignal(signal);
    } catch {
      return { status: 'skipped', reason: 'verification-failed' };
    }

    let spotPriceUsd: number;
    try {
      spotPriceUsd = await this.deps.fetchSpotUsd(signal.hedgedAsset);
    } catch {
      return { status: 'skipped', reason: 'price-unavailable' };
    }
    const spotPriceTimestampMs = now();

    const targetNotionalUsd = BigInt(signal.targetNotionalUsd);
    const sizing = sizeHedge({ targetNotionalUsd, hedgedAsset: signal.hedgedAsset as `0x${string}` }, spotPriceUsd);
    if (sizing.kind === 'skip') {
      return { status: 'skipped', reason: 'below-floor' };
    }

    const draft = buildIntent({
      sourceSignalCid: signalCid,
      sourceSignalBlock: signalBlock,
      hedgedAsset: signal.hedgedAsset,
      sizing,
      spotPriceUsd,
      spotPriceTimestampMs,
      publisherAddress: this.deps.publisherAddress,
      identityNFT: this.deps.identityNFT,
      methodologyHash: this.deps.methodologyHash,
      codeCommit: this.deps.codeCommit,
      now
    });

    const published = await this.deps.publisher.publishIntent(draft);
    this.lastProcessedCid = signalCid;
    return { status: 'published', cid: published.cid, intent: published.intent };
  }
}
```

- [ ] **Step 3: Run, expect PASS. Commit**

```bash
git add agents/operator/src/pipeline/orchestrator.ts agents/operator/tests/unit/orchestrator.test.ts
git commit -m "operator: orchestrator with dedup, sizing, and signed-intent emit"
```

---

### Task 26: Event-driven run loop + health + metrics

**Files:**
- Create: `agents/operator/src/monitor/health.ts`
- Create: `agents/operator/src/monitor/metrics.ts`
- Create: `agents/operator/src/runLoop.ts`
- Create: `agents/operator/tests/unit/runLoop.test.ts`

- [ ] **Step 1: Implement `agents/operator/src/monitor/health.ts`**

```ts
export interface HealthState {
  lastHedgeAt: number | null;
  recordHedge: (ts: number) => void;
  asJson: () => { status: 'ok'; lastHedgeAt: number | null };
}

export function makeHealth(): HealthState {
  let last: number | null = null;
  return {
    get lastHedgeAt() { return last; },
    recordHedge(ts: number) { last = ts; },
    asJson() { return { status: 'ok' as const, lastHedgeAt: last }; }
  };
}
```

- [ ] **Step 2: Implement `agents/operator/src/monitor/metrics.ts`**

```ts
import { Registry, Counter, Gauge } from 'prom-client';

export interface OperatorMetrics {
  registry: Registry;
  hedgesTotal: Counter<string>;
  hedgesSkipped: Counter<string>;
  verificationFailures: Counter<string>;
  priceFailures: Counter<string>;
  subscriptionErrors: Counter<string>;
  lastHedgeMs: Gauge<string>;
}

export function makeMetrics(): OperatorMetrics {
  const registry = new Registry();
  return {
    registry,
    hedgesTotal: new Counter({ name: 'operator_hedges_total', help: 'Hedges emitted', registers: [registry] }),
    hedgesSkipped: new Counter({ name: 'operator_hedges_skipped_total', help: 'Skipped cycles', labelNames: ['reason'], registers: [registry] }),
    verificationFailures: new Counter({ name: 'operator_verification_failures_total', help: 'Signal verification failures', registers: [registry] }),
    priceFailures: new Counter({ name: 'operator_price_failures_total', help: 'CoinGecko fetch failures', registers: [registry] }),
    subscriptionErrors: new Counter({ name: 'operator_subscription_errors_total', help: 'Subscription transport errors', registers: [registry] }),
    lastHedgeMs: new Gauge({ name: 'operator_last_hedge_ms', help: 'Wall-clock ms of last hedge emit', registers: [registry] })
  };
}
```

- [ ] **Step 3: Implement `agents/operator/src/runLoop.ts`**

```ts
import type { PublicClient } from 'viem';
import { subscribeHedgeSignals, type HedgeSignalEvent } from './subscription/hedgeSignal.js';
import type { Orchestrator } from './pipeline/orchestrator.js';
import type { HealthState } from './monitor/health.js';
import type { OperatorMetrics } from './monitor/metrics.js';

export interface RunLoopArgs {
  client: PublicClient;
  busAddress: `0x${string}`;
  fromBlock: bigint;
  orchestrator: Orchestrator;
  health: HealthState;
  metrics: OperatorMetrics;
  abortSignal?: AbortSignal;
  now?: () => number;
}

export interface RunLoopHandle { stop: () => void }

export async function startOperatorRunLoop(args: RunLoopArgs): Promise<RunLoopHandle> {
  const now = args.now ?? (() => Date.now());

  const onSignal = async (event: HedgeSignalEvent): Promise<void> => {
    const result = await args.orchestrator.runHedgeCycle(event.reasoningHash, event.blockNumber);
    if (result.status === 'published') {
      args.metrics.hedgesTotal.inc();
      const ts = now();
      args.metrics.lastHedgeMs.set(ts);
      args.health.recordHedge(ts);
    } else {
      args.metrics.hedgesSkipped.inc({ reason: result.reason });
      if (result.reason === 'verification-failed') args.metrics.verificationFailures.inc();
      if (result.reason === 'price-unavailable') args.metrics.priceFailures.inc();
    }
  };

  const onLiveError = (_err: unknown): void => { args.metrics.subscriptionErrors.inc(); };

  const unsubscribe = await subscribeHedgeSignals(args.client, args.busAddress, args.fromBlock, onSignal, onLiveError);
  const stop = (): void => { unsubscribe(); };
  if (args.abortSignal) args.abortSignal.addEventListener('abort', stop, { once: true });
  return { stop };
}
```

- [ ] **Step 4: Run, expect PASS. Commit**

```bash
git add agents/operator/src/monitor/health.ts agents/operator/src/monitor/metrics.ts agents/operator/src/runLoop.ts agents/operator/tests/unit/runLoop.test.ts
git commit -m "operator: event-driven run loop + health + metrics"
```

---

### Task 27: Strategy + methodology docs + upload script

**Files:**
- Create: `agents/operator/docs/strategy-v1.md`
- Create: `agents/operator/docs/hedge-methodology.md`
- Create: `agents/operator/scripts/upload-strategy.ts`

- [ ] **Step 1: Write `agents/operator/docs/strategy-v1.md`**

```markdown
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
```

- [ ] **Step 2: Write `agents/operator/docs/hedge-methodology.md`**

```markdown
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
```

- [ ] **Step 3: Implement `agents/operator/scripts/upload-strategy.ts`**

```ts
import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { pinJsonToLighthouse } from '@strata/scout/ipfs';

async function main(): Promise<void> {
  const apiKey = process.env.LIGHTHOUSE_API_KEY;
  if (!apiKey) throw new Error('LIGHTHOUSE_API_KEY is required');
  const strategy = readFileSync('agents/operator/docs/strategy-v1.md', 'utf-8');
  const methodology = readFileSync('agents/operator/docs/hedge-methodology.md', 'utf-8');
  const stratCid = await pinJsonToLighthouse(JSON.stringify({ kind: 'strategy', text: strategy }), apiKey);
  const methCid = await pinJsonToLighthouse(JSON.stringify({ kind: 'hedge-methodology', text: methodology }), apiKey);
  const methHash = '0x' + createHash('sha256').update(methodology).digest('hex');
  console.log(JSON.stringify({ strategyCid: stratCid, methodologyCid: methCid, methodologyHash: methHash }, null, 2));
}
main().catch((e) => { console.error(e); process.exit(1); });
```

- [ ] **Step 4: Commit**

```bash
git add agents/operator/docs/strategy-v1.md agents/operator/docs/hedge-methodology.md agents/operator/scripts/upload-strategy.ts
git commit -m "operator: strategy + hedge-methodology docs + upload script"
```

---

### Task 28: inspect-hedge script + live entrypoint

**Files:**
- Create: `agents/operator/scripts/inspect-hedge.ts`
- Modify: `agents/operator/src/index.ts` (real entrypoint, replace stub)

- [ ] **Step 1: Implement `agents/operator/scripts/inspect-hedge.ts`**

```ts
import { writeFileSync, readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { execSync } from 'node:child_process';
import { generatePrivateKey, privateKeyToAccount } from 'viem/accounts';
import { fetchHedgeSignalByCid } from '../src/ipfs/fetch.js';
import { verifyHedgeSignal } from '../src/verify/hedgeSignal.js';
import { fetchSpotUsd } from '../src/market/coingecko.js';
import { sizeHedge } from '../src/pipeline/sizeHedge.js';
import { buildIntent } from '../src/pipeline/buildIntent.js';

function arg(name: string): string | undefined {
  const i = process.argv.indexOf(`--${name}`);
  return i >= 0 ? process.argv[i + 1] : undefined;
}

async function main(): Promise<void> {
  const cid = arg('signal-cid');
  if (!cid) { console.error('usage: inspect-hedge --signal-cid <cid> [--block <n>]'); process.exit(2); }
  const blockStr = arg('block') ?? '0';

  process.env.OPERATOR_DRY_RUN = 'true';
  const cgKey = process.env.COINGECKO_API_KEY;
  if (!cgKey) { console.error('COINGECKO_API_KEY is required'); process.exit(2); }

  const methodology = readFileSync('agents/operator/docs/hedge-methodology.md', 'utf-8');
  const methodologyHash = '0x' + createHash('sha256').update(methodology).digest('hex');
  const codeCommit = execSync('git rev-parse HEAD').toString().trim();
  const account = privateKeyToAccount(generatePrivateKey());

  const signal = await fetchHedgeSignalByCid(cid);
  if (!signal) throw new Error('signal fetch returned null');
  await verifyHedgeSignal(signal);

  const spot = await fetchSpotUsd(signal.hedgedAsset, cgKey);
  const sizing = sizeHedge({
    targetNotionalUsd: BigInt(signal.targetNotionalUsd),
    hedgedAsset: signal.hedgedAsset as `0x${string}`
  }, spot);

  if (sizing.kind === 'skip') {
    writeFileSync('agents/operator/hedge-output.md', `# Hedge inspect\n\nResult: SKIPPED (${sizing.reason})\nspot=${spot}\nsignal=${signal.targetNotionalUsd}\n`);
    console.log('wrote agents/operator/hedge-output.md (skipped)');
    return;
  }

  const draft = buildIntent({
    sourceSignalCid: cid,
    sourceSignalBlock: BigInt(blockStr),
    hedgedAsset: signal.hedgedAsset,
    sizing,
    spotPriceUsd: spot,
    spotPriceTimestampMs: 1_700_000_000_000,
    publisherAddress: account.address,
    identityNFT: 'ipfs://placeholder',
    methodologyHash,
    codeCommit,
    now: () => 1_700_000_000_000
  });

  const lines = [
    `# Hedge inspect (dry-run)`,
    ``,
    `- signalCid: ${cid}`,
    `- hedgedAsset: ${draft.hedgedAsset}`,
    `- direction: ${draft.direction}`,
    `- notionalUsd: ${draft.notionalUsd}`,
    `- contractSize: ${draft.contractSize}`,
    `- spotPriceUsd: ${draft.spotPriceUsd}`,
    `- methodologyHash: ${methodologyHash}`,
    `- codeCommit: ${codeCommit}`
  ];
  writeFileSync('agents/operator/hedge-output.md', lines.join('\n') + '\n');
  console.log('wrote agents/operator/hedge-output.md');
}

main().catch((e) => { console.error(e); process.exit(1); });
```

- [ ] **Step 2: Replace `agents/operator/src/index.ts`** (live entrypoint)

```ts
import { createServer } from 'node:http';
import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { execSync } from 'node:child_process';
import pino from 'pino';
import { loadConfig } from './config.js';
import { buildChainClients } from './chain/client.js';
import { Orchestrator } from './pipeline/orchestrator.js';
import { makeHealth } from './monitor/health.js';
import { makeMetrics } from './monitor/metrics.js';
import { startOperatorRunLoop } from './runLoop.js';
import { makePublisher } from './publication/publish.js';
import { fetchHedgeSignalByCid } from './ipfs/fetch.js';
import { verifyHedgeSignal } from './verify/hedgeSignal.js';
import { fetchSpotUsd } from './market/coingecko.js';

async function main(): Promise<void> {
  const cfg = loadConfig();
  const log = pino({ level: cfg.logLevel });
  log.info('operator starting');

  const { publicClient, walletClient, account } = buildChainClients({
    rpcUrl: cfg.chain.rpcUrl,
    rpcFallback: cfg.chain.rpcFallback,
    privateKey: cfg.operator.privateKey
  });

  const methodologyText = readFileSync('agents/operator/docs/hedge-methodology.md', 'utf-8');
  const methodologyHash = '0x' + createHash('sha256').update(methodologyText).digest('hex');
  const codeCommit = execSync('git rev-parse HEAD').toString().trim();

  const metrics = makeMetrics();
  const health = makeHealth();

  const publisher = makePublisher({
    wallet: walletClient,
    publicClient,
    account,
    eventBus: cfg.operator.eventBus,
    lighthouseApiKey: cfg.ipfs.lighthouseApiKey,
    dryRun: cfg.operator.dryRun
  });

  const orchestrator = new Orchestrator({
    fetchSignal: fetchHedgeSignalByCid,
    verifySignal: (s) => verifyHedgeSignal(s, cfg.operator.sentinelAddress as `0x${string}` | undefined),
    fetchSpotUsd: (addr) => fetchSpotUsd(addr, cfg.market.coingeckoApiKey),
    methodologyHash,
    codeCommit,
    publisher,
    publisherAddress: account.address,
    identityNFT: cfg.operator.identityNFT
  });

  let fromBlock: bigint;
  try {
    const head = await publicClient.getBlockNumber();
    fromBlock = head > 1000n ? head - 1000n : 0n;
  } catch { fromBlock = 0n; }

  const abort = new AbortController();
  const handle = await startOperatorRunLoop({
    client: publicClient,
    busAddress: cfg.operator.eventBus,
    fromBlock,
    orchestrator,
    health,
    metrics,
    abortSignal: abort.signal
  });

  process.on('SIGINT', () => { log.info('SIGINT, shutting down'); abort.abort(); });
  process.on('SIGTERM', () => { log.info('SIGTERM, shutting down'); abort.abort(); });

  const server = createServer(async (req, res) => {
    if (req.url === '/healthz') {
      res.writeHead(200, { 'content-type': 'application/json' });
      res.end(JSON.stringify(health.asJson()));
    } else if (req.url === '/metrics') {
      const body = await metrics.registry.metrics();
      res.writeHead(200, { 'content-type': metrics.registry.contentType });
      res.end(body);
    } else { res.writeHead(404); res.end(); }
  });
  server.listen(cfg.operator.healthPort, () => log.info({ port: cfg.operator.healthPort }, 'operator health+metrics server listening'));

  abort.signal.addEventListener('abort', () => { handle.stop(); server.close(); });
}

main().catch((e) => { console.error(e); process.exit(1); });
```

- [ ] **Step 3: Run unit suite + verify build**

```bash
pnpm --filter @strata/operator test
pnpm --filter @strata/operator build
```

Expected: all tests PASS, clean build.

- [ ] **Step 4: Commit**

```bash
git add agents/operator/scripts/inspect-hedge.ts agents/operator/src/index.ts
git commit -m "operator: live entrypoint + inspect-hedge script"
```

---

## End-to-end smoke (post-Task 28, before testnet)

With both agents shipped and contracts deployed by coworker (event bus + role grants):

1. Set `LIGHTHOUSE_API_KEY` and `COINGECKO_API_KEY` in all three agents' `.env` files.
2. Run Scout in live mode: `pnpm --filter @strata/scout dev`. Wait for it to publish a YieldMap CID.
3. Run Architect: `pnpm --filter @strata/architect dev`. Confirm it picks up the map and publishes a proposal CID.
4. Run Sentinel: `pnpm --filter @strata/sentinel dev`. Confirm it picks up the proposal, publishes a verdict CID, and emits one or more hedge signals.
5. Run Operator: `pnpm --filter @strata/operator dev`. Confirm it picks up each hedge signal, logs a signed intent.
6. On the next Scout cycle, Architect's `HedgeLogged` subscription should reflect Operator's open positions in the next allocation's `netExposureAtProposalMs`.

That closes the full agent loop end-to-end.

---

## Pinning the strategy + methodology docs (post-deployment)

For each agent (Sentinel and Operator):

```bash
export LIGHTHOUSE_API_KEY=...
pnpm --filter @strata/sentinel tsx scripts/upload-strategy.ts
pnpm --filter @strata/operator tsx scripts/upload-strategy.ts
```

Hand the printed `{ strategyCid, methodologyCid, methodologyHash }` to the coworker so they can record the strategy CID on the relevant ERC-8004 identity NFT via `IERC8004Identity.updateStrategyCid(tokenId, strategyCid)`.

---

## Self-review checklist run against this plan

- **Spec coverage:** product.md Sentinel covered by Tasks 4-15 + docs. product.md Operator covered by Tasks 16-28 + docs. Both pin strategy + methodology to Lighthouse and have ERC-8004 update paths documented.
- **Locked external integrations honored:** Sentinel uses 0 external APIs (only chain + Lighthouse gateway, both already in scope). Operator uses CoinGecko only, which is one of the four locked sources.
- **No em-dashes:** confirmed during write.
- **No Claude trailer:** all commit message templates exclude it.
- **Coworker boundary:** contract additions specified at the top; no `contracts/src/*.sol` files in any task.
- **Replayability:** every emitted artifact carries `methodologyHash` + `codeCommit` + sourceCid. Inspect scripts pin clock + ephemeral key for reproducible local output.
- **TDD:** every novel-logic task starts with a failing test.
- **DRY:** signer, IPFS pin, and shared enums are reused from `@strata/scout` (Task 0).

---

## Execution

After saving this plan: dispatch via `superpowers:subagent-driven-development` (recommended, same cadence as Architect) or `superpowers:executing-plans` (inline batch). Fresh subagent per task with two-stage review between tasks. Pause point after Task 15 to smoke-test Sentinel before starting Operator.
