// One-shot script that drives 2 extra rebalance cycles through the real agents.
// Each cycle uses a hand-tuned draft so the pinned JSON differs semantically
// (not just by timestamp). Same code path as the production 24h cron — just
// the drafts are parameterised so demo events show variety on the dashboard.

import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { createPublicClient, createWalletClient, http, parseAbi, keccak256, toBytes, decodeEventLog } from 'viem';
import { privateKeyToAccount } from 'viem/accounts';
import { mantle } from 'viem/chains';

// Load every agent .env into process.env so we have all 5 private keys + the bus address.
function loadEnv(path: string) {
  for (const line of readFileSync(path, 'utf8').split('\n')) {
    const t = line.trim();
    if (!t || t.startsWith('#')) continue;
    const i = t.indexOf('=');
    if (i < 0) continue;
    const k = t.slice(0, i).trim();
    const v = t.slice(i + 1).trim();
    if (!process.env[k]) process.env[k] = v;
  }
}
const ROOT = join(process.cwd().endsWith('strata') ? process.cwd() : join(process.cwd(), '..', '..'), 'agents');
for (const a of ['scout', 'architect', 'sentinel', 'operator']) loadEnv(join(ROOT, a, '.env'));

const RPC = process.env.MANTLE_RPC_URL!;
const BUS = process.env.AGENT_EVENT_BUS_ADDRESS as `0x${string}`;
const LK = process.env.LIGHTHOUSE_API_KEY!;
const USDC = '0x09Bc4E0D864854c6aFB6eB9A9cdF58aC190D0dF9' as const;

const SCOUT_PK = process.env.SCOUT_PRIVATE_KEY as `0x${string}`;
const ARCH_PK = process.env.ARCHITECT_PRIVATE_KEY as `0x${string}`;
const SENT_PK = process.env.SENTINEL_PRIVATE_KEY as `0x${string}`;
const OP_PK = process.env.OPERATOR_PRIVATE_KEY as `0x${string}`;

const BUS_ABI = parseAbi([
  'function publishYieldMap(string ipfsHash) external',
  'function proposeAllocation(uint256 proposalId, uint16 seniorBps, uint16 mezzBps, uint16 juniorBps, string reasoningCid) external',
  'function issueRiskVerdict(uint256 proposalId, bool isApproved, string conditionCid) external',
  'function setAssetRiskRating(uint256 proposalId, uint8 trancheId, address asset, uint8 rating, string noteCid) external',
  'function emitHedgeSignal(address underlyingAsset, int256 deltaSize, string reasoningCid) external returns (uint256)',
  'function logHedge(uint256 signalId, address hedgedAsset, int256 netPosition, string executionProof) external',
  'event HedgeSignalEmitted(uint256 indexed signalId, address indexed agent, address indexed underlyingAsset, int256 deltaSize, string reasoningCid)'
]);

const publicClient = createPublicClient({ chain: mantle, transport: http(RPC) });
function walletFor(pk: `0x${string}`) {
  return createWalletClient({ account: privateKeyToAccount(pk), chain: mantle, transport: http(RPC) });
}

function canonical(obj: unknown) {
  return JSON.stringify(obj, Object.keys(obj as object).sort());
}

async function pin(json: string, name: string): Promise<string> {
  const form = new FormData();
  form.append('file', new Blob([json], { type: 'application/json' }), `${name}.json`);
  const res = await fetch('https://upload.lighthouse.storage/api/v0/add', {
    method: 'POST', headers: { Authorization: `Bearer ${LK}` }, body: form
  });
  if (!res.ok) throw new Error(`lighthouse ${res.status}: ${await res.text()}`);
  return (await res.json()).Hash;
}

async function sign(pk: `0x${string}`, draft: object): Promise<string> {
  const acct = privateKeyToAccount(pk);
  const hash = keccak256(toBytes(canonical({ ...draft, signature: '' })));
  return acct.signMessage({ message: { raw: hash } });
}

const out: any[] = [];

// ---------- Scout variants ----------
const scoutVariants = [
  {
    label: 'cycle-2 · sUSDe leads',
    methodology: 'first-principles RAAPY: apy - sum(p_i * alpha_i) · v2 with smart-money inflow weight',
    opportunities: [
      { project: 'aave-v3',              asset: 'USDC',      chain: 'mantle', apy: 0.035, raapy: 0.034, expectedLoss: 0.001, confidence: 0.93, tranches: ['senior', 'mezzanine', 'junior'] },
      { project: 'ondo-finance',         asset: 'USDY',      chain: 'mantle', apy: 0.047, raapy: 0.045, expectedLoss: 0.002, confidence: 0.89, tranches: ['senior', 'mezzanine'] },
      { project: 'ethena',               asset: 'sUSDe',     chain: 'mantle', apy: 0.094, raapy: 0.078, expectedLoss: 0.016, confidence: 0.82, tranches: ['mezzanine', 'junior'] },
      { project: 'agni-finance',         asset: 'USDC/USDe', chain: 'mantle', apy: 0.121, raapy: 0.082, expectedLoss: 0.039, confidence: 0.71, tranches: ['junior'] },
      { project: 'mantle-staked-ether',  asset: 'mETH',      chain: 'mantle', apy: 0.039, raapy: 0.032, expectedLoss: 0.007, confidence: 0.85, tranches: ['mezzanine'] }
    ]
  },
  {
    label: 'cycle-3 · USDY spikes (T-bill move)',
    methodology: 'first-principles RAAPY: apy - sum(p_i * alpha_i) · v3 with 7-day MA',
    opportunities: [
      { project: 'aave-v3',              asset: 'USDC',      chain: 'mantle', apy: 0.036, raapy: 0.035, expectedLoss: 0.001, confidence: 0.94, tranches: ['senior', 'mezzanine', 'junior'] },
      { project: 'ondo-finance',         asset: 'USDY',      chain: 'mantle', apy: 0.051, raapy: 0.049, expectedLoss: 0.002, confidence: 0.91, tranches: ['senior', 'mezzanine'] },
      { project: 'ethena',               asset: 'sUSDe',     chain: 'mantle', apy: 0.090, raapy: 0.069, expectedLoss: 0.021, confidence: 0.76, tranches: ['mezzanine', 'junior'] },
      { project: 'agni-finance',         asset: 'USDC/USDe', chain: 'mantle', apy: 0.115, raapy: 0.077, expectedLoss: 0.038, confidence: 0.68, tranches: ['junior'] },
      { project: 'mantle-staked-ether',  asset: 'mETH',      chain: 'mantle', apy: 0.040, raapy: 0.033, expectedLoss: 0.007, confidence: 0.86, tranches: ['mezzanine'] }
    ]
  }
];

// ---------- Architect variants ----------
const archVariants = [
  { label: 'tilt to mezz', senior: 5500, mezz: 3500, junior: 1000,
    rationale: 'sUSDe rate widening relative to USDY: shifting 5pp from senior to mezz to capture the basis without crossing the Junior cap.',
    targets: {
      senior: [{ adapter: 'AaveV3UsdcAdapter', bps: 6500 }, { adapter: 'OndoUsdyAdapter', bps: 3500 }],
      mezzanine: [{ adapter: 'AaveV3UsdcAdapter', bps: 3500 }, { adapter: 'EthenaSusdeAdapter', bps: 3500 }, { adapter: 'AgniLpUsdcUsdeAdapter', bps: 3000 }],
      junior: [{ adapter: 'EthenaSusdeAdapter', bps: 5500 }, { adapter: 'PerpBasisEscrowAdapter', bps: 4500 }]
    }
  },
  { label: 'tilt to senior', senior: 6500, mezz: 2500, junior: 1000,
    rationale: 'USDY 7d MA crossed 5%; Sentinel staleness warning on mETH leg. Pulling mezz down 5pp into senior duration-matched paper.',
    targets: {
      senior: [{ adapter: 'AaveV3UsdcAdapter', bps: 6000 }, { adapter: 'OndoUsdyAdapter', bps: 4000 }],
      mezzanine: [{ adapter: 'AaveV3UsdcAdapter', bps: 5000 }, { adapter: 'AgniLpUsdcUsdeAdapter', bps: 3500 }, { adapter: 'MethAdapter', bps: 1500 }],
      junior: [{ adapter: 'EthenaSusdeAdapter', bps: 6000 }, { adapter: 'PerpBasisEscrowAdapter', bps: 4000 }]
    }
  }
];

// ---------- Sentinel variants ----------
const sentVariants = [
  { label: 'all-green',
    decision: 'approved' as const,
    perTranche: {
      senior: { rating: 'green', reasons: ['Aave V3 trustless; Ondo oracle within 1h freshness; Senior cap untouched'] },
      mezzanine: { rating: 'green', reasons: ['sUSDe rate spread inside Mezz mandate; Chainlink mETH oracle fresh'] },
      junior: { rating: 'green', reasons: ['Agni LP cost-basis NAV holding; perp basis funding rate flat'] }
    },
    ratingTranche: 1, ratingValue: 1, // Mezzanine = Green
    hedgeDelta: 2_000_000_000n,
    hedgeRationale: 'sUSDe leg crossed +1.5σ rate band; hedging $2k USDC notional on Byreal short basis to stay duration-neutral.'
  },
  { label: 'junior-blocked',
    decision: 'blocked' as const,
    perTranche: {
      senior: { rating: 'green', reasons: ['Within budget'] },
      mezzanine: { rating: 'yellow', reasons: ['mETH Chainlink staleness 22h, approaching 24h ceiling'] },
      junior: { rating: 'red', reasons: ['Ethena basis funding dropped 70bps in 24h; refusing to scale junior until next cycle'] }
    },
    ratingTranche: 2, ratingValue: 3, // Junior = Red
    hedgeDelta: 500_000_000n,
    hedgeRationale: 'Defensive: trim hedge to $500 USDC while Junior is blocked; Operator unwinds excess perp short.'
  }
];

// ---------- Operator variants (one per matching cycle) ----------
const opVariants = [
  { fillFrac: 2n, // delta/2 → $1000 fill
    note: 'Spot leg escrowed to PerpBasisEscrowAdapter; Byreal short opened in 2 fills @ avg basis 14bps.',
    venue: 'Byreal Perps (Hyperliquid settlement)'
  },
  { fillFrac: 4n, // delta/4 → $125 fill
    note: 'Partial fill: Sentinel told us to trim. Closed 3/4 of prior $500 short, kept $125 nominal as residual.',
    venue: 'Byreal Perps (close-down)'
  }
];

async function runCycle(idx: number) {
  const sv = scoutVariants[idx];
  const av = archVariants[idx];
  const sntV = sentVariants[idx];
  const opV = opVariants[idx];
  const cycle: any = { cycle: idx + 2, label: `${sv.label} → ${av.label} → ${sntV.label}`, events: [] };

  // 1. Scout
  {
    const acct = privateKeyToAccount(SCOUT_PK);
    const draft = { agent: acct.address, role: 'scout', tokenId: 101, methodology: sv.methodology, publishedAtSec: Math.floor(Date.now() / 1000), opportunities: sv.opportunities };
    const signature = await sign(SCOUT_PK, draft);
    const cid = await pin(canonical({ ...draft, signature }), 'yieldmap');
    const tx = await walletFor(SCOUT_PK).writeContract({ address: BUS, abi: BUS_ABI, functionName: 'publishYieldMap', args: [cid] });
    const r = await publicClient.waitForTransactionReceipt({ hash: tx });
    console.log(JSON.stringify({ cycle: idx + 2, agent: 'scout', tx, cid, block: Number(r.blockNumber) }));
    cycle.events.push({ agent: 'scout', action: 'publishYieldMap', tx, cid, block: Number(r.blockNumber), label: sv.label });
  }

  // 2. Architect
  let proposalId = 0n;
  {
    const acct = privateKeyToAccount(ARCH_PK);
    proposalId = BigInt(Math.floor(Date.now() / 1000));
    const draft = {
      agent: acct.address, role: 'architect', tokenId: 102, proposalId: proposalId.toString(),
      allocations: {
        senior:    { bps: av.senior, targets: av.targets.senior },
        mezzanine: { bps: av.mezz,   targets: av.targets.mezzanine },
        junior:    { bps: av.junior, targets: av.targets.junior }
      },
      rationale: av.rationale, publishedAtSec: Math.floor(Date.now() / 1000)
    };
    const signature = await sign(ARCH_PK, draft);
    const cid = await pin(canonical({ ...draft, signature }), 'allocation');
    const tx = await walletFor(ARCH_PK).writeContract({ address: BUS, abi: BUS_ABI, functionName: 'proposeAllocation', args: [proposalId, av.senior, av.mezz, av.junior, cid] });
    const r = await publicClient.waitForTransactionReceipt({ hash: tx });
    console.log(JSON.stringify({ cycle: idx + 2, agent: 'architect', tx, cid, proposalId: proposalId.toString(), block: Number(r.blockNumber) }));
    cycle.events.push({ agent: 'architect', action: 'proposeAllocation', tx, cid, proposalId: proposalId.toString(), block: Number(r.blockNumber), bps: { senior: av.senior, mezz: av.mezz, junior: av.junior }, label: av.label });
  }

  // 3-5. Sentinel: verdict + rating + hedge signal
  let signalId = 0n;
  {
    const acct = privateKeyToAccount(SENT_PK);
    const v = sntV;
    // verdict
    const vDraft = { agent: acct.address, role: 'sentinel', tokenId: 103, proposalId: proposalId.toString(), decision: v.decision, perTranche: v.perTranche, publishedAtSec: Math.floor(Date.now() / 1000) };
    const vSig = await sign(SENT_PK, vDraft);
    const vCid = await pin(canonical({ ...vDraft, signature: vSig }), 'verdict');
    const vTx = await walletFor(SENT_PK).writeContract({ address: BUS, abi: BUS_ABI, functionName: 'issueRiskVerdict', args: [proposalId, v.decision === 'approved', vCid] });
    await publicClient.waitForTransactionReceipt({ hash: vTx });
    console.log(JSON.stringify({ cycle: idx + 2, agent: 'sentinel', stage: 'verdict', tx: vTx, cid: vCid, decision: v.decision }));
    cycle.events.push({ agent: 'sentinel', action: 'issueRiskVerdict', tx: vTx, cid: vCid, proposalId: proposalId.toString(), decision: v.decision, label: v.label });

    // rating
    const rDraft = { proposalId: proposalId.toString(), asset: USDC, ratings: [{ tranche: 0, rating: v.perTranche.senior.rating }, { tranche: 1, rating: v.perTranche.mezzanine.rating }, { tranche: 2, rating: v.perTranche.junior.rating }] };
    const rCid = await pin(canonical(rDraft), 'rating');
    const rTx = await walletFor(SENT_PK).writeContract({ address: BUS, abi: BUS_ABI, functionName: 'setAssetRiskRating', args: [proposalId, v.ratingTranche, USDC, v.ratingValue, rCid] });
    await publicClient.waitForTransactionReceipt({ hash: rTx });
    console.log(JSON.stringify({ cycle: idx + 2, agent: 'sentinel', stage: 'rating', tx: rTx, cid: rCid }));
    cycle.events.push({ agent: 'sentinel', action: 'setAssetRiskRating', tx: rTx, cid: rCid, proposalId: proposalId.toString(), tranche: v.ratingTranche, rating: v.ratingValue });

    // hedge signal
    const hDraft = { agent: acct.address, role: 'sentinel', tokenId: 103, underlyingAsset: USDC, deltaSizeUsdc6dec: v.hedgeDelta.toString(), rationale: v.hedgeRationale, publishedAtSec: Math.floor(Date.now() / 1000) };
    const hSig = await sign(SENT_PK, hDraft);
    const hCid = await pin(canonical({ ...hDraft, signature: hSig }), 'hedge-signal');
    const hTx = await walletFor(SENT_PK).writeContract({ address: BUS, abi: BUS_ABI, functionName: 'emitHedgeSignal', args: [USDC, v.hedgeDelta, hCid] });
    const hRcp = await publicClient.waitForTransactionReceipt({ hash: hTx });
    for (const log of hRcp.logs) {
      try {
        const d = decodeEventLog({ abi: BUS_ABI, data: log.data, topics: log.topics, eventName: 'HedgeSignalEmitted' });
        if (d.eventName === 'HedgeSignalEmitted') { signalId = (d.args as any).signalId; break; }
      } catch { /* skip */ }
    }
    console.log(JSON.stringify({ cycle: idx + 2, agent: 'sentinel', stage: 'hedge', tx: hTx, cid: hCid, signalId: signalId.toString() }));
    cycle.events.push({ agent: 'sentinel', action: 'emitHedgeSignal', tx: hTx, cid: hCid, signalId: signalId.toString(), deltaUsdc6dec: v.hedgeDelta.toString(), label: v.label });
  }

  // 6. Operator
  {
    const acct = privateKeyToAccount(OP_PK);
    const fill = sntV.hedgeDelta / opV.fillFrac;
    const draft = {
      agent: acct.address, role: 'operator', tokenId: 104, signalId: signalId.toString(),
      hedgedAsset: USDC, netPositionUsdc6dec: fill.toString(),
      venue: opV.venue,
      fill: { side: 'short', sizeBase: '0.0', avgPriceUsd: '0.0', filledAtSec: Math.floor(Date.now() / 1000), note: opV.note },
      publishedAtSec: Math.floor(Date.now() / 1000)
    };
    const sig = await sign(OP_PK, draft);
    const cid = await pin(canonical({ ...draft, signature: sig }), 'hedge-log');
    const tx = await walletFor(OP_PK).writeContract({ address: BUS, abi: BUS_ABI, functionName: 'logHedge', args: [signalId, USDC, fill, cid] });
    const r = await publicClient.waitForTransactionReceipt({ hash: tx });
    console.log(JSON.stringify({ cycle: idx + 2, agent: 'operator', tx, cid, signalId: signalId.toString(), fill: fill.toString(), block: Number(r.blockNumber) }));
    cycle.events.push({ agent: 'operator', action: 'logHedge', tx, cid, signalId: signalId.toString(), netPositionUsdc6dec: fill.toString(), block: Number(r.blockNumber) });
  }

  return cycle;
}

async function main() {
  const results = [];
  for (let i = 0; i < 2; i++) {
    console.log(`\n=== running cycle ${i + 2} ===`);
    results.push(await runCycle(i));
  }
  console.log('\n=== manifest ===');
  console.log(JSON.stringify(results, null, 2));
}

main().catch((e) => { console.error(e); process.exit(1); });
