// Architect demo entrypoint for Railway. Once per 24h, reads the latest YieldMapPublished CID from
// the bus (waits up to 10 minutes on first boot for Scout to publish), fetches the yield map from
// IPFS, derives a tranched allocation from it, asks Gemini for plain-English rationale (falling
// back to a template on failure), pins reasoning to Lighthouse, then calls proposeAllocation.

import { createPublicClient, createWalletClient, http, parseAbi, parseAbiItem, keccak256, toBytes } from 'viem';
import { privateKeyToAccount } from 'viem/accounts';
import { mantle } from 'viem/chains';
import { generateNarrative } from './llm/narrative.js';

const BUS_ABI = parseAbi([
  'function proposeAllocation(uint256 proposalId, uint16 seniorBps, uint16 mezzBps, uint16 juniorBps, string reasoningCid) external'
]);
const YIELD_MAP_EVENT = parseAbiItem('event YieldMapPublished(address indexed agent, string ipfsHash, uint256 timestamp)');

const IPFS_GATEWAYS = [
  'https://gateway.lighthouse.storage/ipfs/',
  'https://w3s.link/ipfs/',
  'https://ipfs.io/ipfs/'
];

// Maps Scout-side project/asset hints to the on-chain adapter contract names.
// Be defensive: Scout's field shape may evolve, so we look up by several keys.
const ADAPTER_MAP: Record<string, string> = {
  'aave-v3': 'AaveV3UsdcAdapter',
  'aave': 'AaveV3UsdcAdapter',
  'ondo-finance': 'OndoUsdyAdapter',
  'ondo': 'OndoUsdyAdapter',
  'usdy': 'OndoUsdyAdapter',
  'mantle-staked-ether': 'MethAdapter',
  'meth': 'MethAdapter',
  'agni-finance': 'AgniLpUsdcUsdeAdapter',
  'agni': 'AgniLpUsdcUsdeAdapter',
  'ethena': 'EthenaSusdeAdapter',
  'susde': 'EthenaSusdeAdapter',
  'perp-basis': 'PerpBasisEscrowAdapter',
  'perpbasis': 'PerpBasisEscrowAdapter'
};

async function pinJson(json: string, apiKey: string): Promise<string> {
  const blob = new Blob([json], { type: 'application/json' });
  const form = new FormData();
  form.append('file', blob, 'allocation.json');
  const res = await fetch('https://upload.lighthouse.storage/api/v0/add', {
    method: 'POST', headers: { Authorization: `Bearer ${apiKey}` }, body: form
  });
  if (!res.ok) throw new Error(`lighthouse ${res.status}: ${await res.text()}`);
  return (await res.json()).Hash;
}

function canonicalStringify(obj: unknown): string {
  return JSON.stringify(obj, Object.keys(obj as object).sort());
}

async function waitForYieldMap(client: any, bus: `0x${string}`, scoutAddress: `0x${string}`, maxMs: number): Promise<{ cid: string; block: bigint } | null> {
  const deadline = Date.now() + maxMs;
  const latestBlock = await client.getBlockNumber();
  const lookback = latestBlock > 50_000n ? latestBlock - 50_000n : 0n;
  while (Date.now() < deadline) {
    const logs = await client.getContractEvents({
      address: bus, abi: [YIELD_MAP_EVENT], eventName: 'YieldMapPublished', fromBlock: lookback, toBlock: 'latest'
    });
    const fromScout = logs.filter((l: any) => l.args.agent?.toLowerCase() === scoutAddress.toLowerCase());
    if (fromScout.length > 0) {
      const last = fromScout[fromScout.length - 1];
      return { cid: last.args.ipfsHash!, block: last.blockNumber! };
    }
    await new Promise(r => setTimeout(r, 30_000));
  }
  return null;
}

async function fetchYieldMap(cid: string): Promise<any | null> {
  for (const gw of IPFS_GATEWAYS) {
    const ctrl = new AbortController();
    const t = setTimeout(() => ctrl.abort(), 8_000);
    try {
      const res = await fetch(`${gw}${cid}`, { signal: ctrl.signal });
      clearTimeout(t);
      if (res.ok) {
        try { return await res.json(); } catch { /* try next gw */ }
      }
    } catch { /* timeout or net err, try next gw */ }
    finally { clearTimeout(t); }
  }
  return null;
}

type Opp = { name: string; key: string; adapter: string | null; score: number; tranches: string[]; isGreen: boolean };

function normalizeOpportunities(map: any): Opp[] {
  const raw = Array.isArray(map?.opportunities) ? map.opportunities : [];
  const out: Opp[] = [];
  for (const o of raw) {
    if (!o || typeof o !== 'object') continue;
    const project = String(o.project ?? o.id ?? o.adapter ?? o.name ?? '').toLowerCase();
    const asset = String(o.asset ?? '').toLowerCase();
    const adapter = ADAPTER_MAP[project] ?? ADAPTER_MAP[asset] ?? ADAPTER_MAP[project.replace(/[^a-z0-9]/g, '')] ?? null;
    const score = Number(o.score ?? o.raapy ?? o.apy ?? 0);
    const tranches: string[] = Array.isArray(o.eligibleTranches) ? o.eligibleTranches
                              : Array.isArray(o.tranches) ? o.tranches : [];
    const expectedLoss = Number(o.expectedLoss ?? 1);
    const confidence = Number(o.confidence ?? 0);
    const isGreen = expectedLoss < 0.005 || confidence > 0.85;
    if (!adapter || !(score > 0)) continue;
    out.push({ name: project || asset || adapter, key: adapter, adapter, score, tranches, isGreen });
  }
  return out;
}

// Distribute bps proportional to score across N items; sum exactly to `total`.
function weightedSplit(items: { adapter: string; score: number }[], total: number): { adapter: string; bps: number }[] {
  const sumScore = items.reduce((s, i) => s + i.score, 0);
  if (sumScore <= 0 || items.length === 0) return [];
  const draft = items.map(i => ({ adapter: i.adapter, bps: Math.floor((i.score / sumScore) * total) }));
  const drift = total - draft.reduce((s, d) => s + d.bps, 0);
  if (drift !== 0 && draft.length > 0) draft[0]!.bps += drift;
  return draft;
}

type TrancheTargets = { adapter: string; bps: number }[];
type Derived = { senior: { bps: number; targets: TrancheTargets }; mezzanine: { bps: number; targets: TrancheTargets }; junior: { bps: number; targets: TrancheTargets }; greenCount: number };

function deriveAllocation(opps: Opp[]): Derived | null {
  if (opps.length === 0) return null;
  const eligible = (tr: string) => opps
    .filter(o => o.tranches.length === 0 || o.tranches.includes(tr))
    .sort((a, b) => b.score - a.score)
    .slice(0, 3);
  const seniorTop = eligible('senior');
  const mezzTop = eligible('mezzanine');
  const juniorTop = eligible('junior');
  if (seniorTop.length === 0 || mezzTop.length === 0 || juniorTop.length === 0) return null;

  // Tranche bps: senior scales with green count (5000..6500), junior with junior-eligible count (1000..1500),
  // mezz absorbs the rest. Round to 500 bps for clean demo values.
  const greenCount = opps.filter(o => o.isGreen).length;
  const seniorBps = Math.min(6500, 5000 + Math.min(3, greenCount) * 500);
  const juniorBps = Math.min(1500, 1000 + Math.min(1, Math.max(0, juniorTop.length - 1)) * 500);
  const mezzBps = 10_000 - seniorBps - juniorBps;

  return {
    senior:    { bps: seniorBps, targets: weightedSplit(seniorTop.map(o => ({ adapter: o.adapter!, score: o.score })), 10_000) },
    mezzanine: { bps: mezzBps,   targets: weightedSplit(mezzTop.map(o => ({ adapter: o.adapter!, score: o.score })),   10_000) },
    junior:    { bps: juniorBps, targets: weightedSplit(juniorTop.map(o => ({ adapter: o.adapter!, score: o.score })), 10_000) },
    greenCount
  };
}

const FALLBACK: Derived = {
  senior:    { bps: 6000, targets: [{ adapter: 'AaveV3UsdcAdapter', bps: 7000 }, { adapter: 'OndoUsdyAdapter', bps: 3000 }] },
  mezzanine: { bps: 3000, targets: [{ adapter: 'AaveV3UsdcAdapter', bps: 4000 }, { adapter: 'AgniLpUsdcUsdeAdapter', bps: 4000 }, { adapter: 'MethAdapter', bps: 2000 }] },
  junior:    { bps: 1000, targets: [{ adapter: 'EthenaSusdeAdapter', bps: 6000 }, { adapter: 'PerpBasisEscrowAdapter', bps: 4000 }] },
  greenCount: 0
};

function templateRationale(d: Derived): string {
  const names = (ts: TrancheTargets) => ts.map(t => t.adapter.replace(/Adapter$/, '')).join(' and ');
  return `Senior holds ${names(d.senior.targets)} (${d.senior.bps} bps). Mezz mixes ${names(d.mezzanine.targets)} (${d.mezzanine.bps} bps). Junior takes ${names(d.junior.targets)} (${d.junior.bps} bps).`;
}

function toNarrativeProposal(d: Derived, sourceMapCid: string) {
  const positions = (ts: TrancheTargets) => Object.fromEntries(ts.map(t => [t.adapter, t.bps]));
  return {
    version: '1.0' as const,
    proposalId: '0',
    sourceMapCid,
    publishedAtMs: Date.now(),
    publisher: { address: '0x0000000000000000000000000000000000000000' as `0x${string}`, identityNFT: '102' },
    methodologyHash: ('0x' + '0'.repeat(64)) as `0x${string}`,
    codeCommit: '',
    tranches: {
      senior:    { bps: d.senior.bps,    positions: positions(d.senior.targets) },
      mezzanine: { bps: d.mezzanine.bps, positions: positions(d.mezzanine.targets) },
      junior:    { bps: d.junior.bps,    positions: positions(d.junior.targets) }
    },
    netExposureAtProposalMs: {}
  };
}

async function cycle() {
  const pk = process.env.ARCHITECT_PRIVATE_KEY as `0x${string}`;
  const rpc = process.env.MANTLE_RPC_URL!;
  const bus = process.env.AGENT_EVENT_BUS_ADDRESS as `0x${string}`;
  const lighthouseKey = process.env.LIGHTHOUSE_API_KEY!;
  const scoutAddress = (process.env.SCOUT_ADDRESS ?? '0x7CAC071f0F59dEe64509ea1C3BD8245bE529fcdE') as `0x${string}`;
  const geminiKey = process.env.GEMINI_API_KEY;
  const geminiModel = process.env.GEMINI_MODEL ?? 'gemini-2.0-flash-001';
  if (!pk || !rpc || !bus || !lighthouseKey) throw new Error('missing env');

  const account = privateKeyToAccount(pk);
  const publicClient = createPublicClient({ chain: mantle, transport: http(rpc) });
  const walletClient = createWalletClient({ account, chain: mantle, transport: http(rpc) });

  console.log(JSON.stringify({ agent: 'architect', stage: 'waiting-for-yield-map', maxMs: 600_000 }));
  const upstream = await waitForYieldMap(publicClient, bus, scoutAddress, 600_000);
  if (!upstream) {
    console.log(JSON.stringify({ agent: 'architect', stage: 'no-upstream-yet', action: 'sleeping' }));
    return;
  }
  console.log(JSON.stringify({ agent: 'architect', stage: 'yield-map-found', cid: upstream.cid, block: Number(upstream.block) }));

  const map = await fetchYieldMap(upstream.cid);
  const opps = map ? normalizeOpportunities(map) : [];
  const derived = deriveAllocation(opps);
  const allocation: Derived = derived ?? FALLBACK;
  const derivedFrom: 'scout-yield-map' | 'fallback' = derived ? 'scout-yield-map' : 'fallback';
  console.log(JSON.stringify({ agent: 'architect', stage: 'derived', derivedFrom, oppCount: opps.length, greenCount: allocation.greenCount, senior: allocation.senior.bps, mezz: allocation.mezzanine.bps, junior: allocation.junior.bps }));

  let rationale: string;
  try {
    const llmText = await generateNarrative(toNarrativeProposal(allocation, upstream.cid) as any, geminiKey, geminiModel);
    rationale = llmText ?? templateRationale(allocation);
    console.log(JSON.stringify({ agent: 'architect', stage: 'narrative', source: llmText ? 'gemini' : 'template', chars: rationale.length }));
  } catch (err) {
    rationale = templateRationale(allocation);
    console.log(JSON.stringify({ agent: 'architect', stage: 'narrative', source: 'template', reason: err instanceof Error ? err.message : String(err) }));
  }

  const proposalId = BigInt(Math.floor(Date.now() / 1000));
  const draft = {
    agent: account.address,
    role: 'architect',
    tokenId: 102,
    proposalId: proposalId.toString(),
    sourceYieldMapCid: upstream.cid,
    derivedFrom,
    allocations: {
      senior:    { bps: allocation.senior.bps,    targets: allocation.senior.targets },
      mezzanine: { bps: allocation.mezzanine.bps, targets: allocation.mezzanine.targets },
      junior:    { bps: allocation.junior.bps,    targets: allocation.junior.targets }
    },
    narrative: {
      senior:    { bps: allocation.senior.bps,    targets: allocation.senior.targets },
      mezzanine: { bps: allocation.mezzanine.bps, targets: allocation.mezzanine.targets },
      junior:    { bps: allocation.junior.bps,    targets: allocation.junior.targets }
    },
    rationale,
    publishedAtSec: Math.floor(Date.now() / 1000)
  };
  const sig = await account.signMessage({ message: { raw: keccak256(toBytes(canonicalStringify({ ...draft, signature: '' }))) } });
  const cid = await pinJson(canonicalStringify({ ...draft, signature: sig }), lighthouseKey);
  console.log(JSON.stringify({ agent: 'architect', stage: 'pinned', cid, gateway: `https://gateway.lighthouse.storage/ipfs/${cid}` }));

  const hash = await walletClient.writeContract({
    address: bus, abi: BUS_ABI, functionName: 'proposeAllocation',
    args: [proposalId, allocation.senior.bps, allocation.mezzanine.bps, allocation.junior.bps, cid]
  });
  const receipt = await publicClient.waitForTransactionReceipt({ hash });
  console.log(JSON.stringify({ agent: 'architect', stage: 'tx-mined', txHash: hash, proposalId: proposalId.toString(), block: Number(receipt.blockNumber), status: receipt.status, mantlescan: `https://mantlescan.xyz/tx/${hash}` }));
}

async function main() {
  while (true) {
    try { await cycle(); } catch (err) { console.error(JSON.stringify({ agent: 'architect', error: err instanceof Error ? err.message : String(err) })); }
    await new Promise(r => setTimeout(r, 86_400_000));
  }
}

main();
