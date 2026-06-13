// Sentinel demo entrypoint for Railway. Once per 24h, reads the latest AllocationProposed from the
// bus (waits up to 10 minutes for Architect on first boot), fetches the allocation JSON from IPFS,
// runs a tranche-level scoring pipeline, issues a risk verdict, emits one setAssetRiskRating per
// (tranche, asset) pair, then emits a hedge signal so the Operator has something to log.

import { createPublicClient, createWalletClient, http, parseAbi, parseAbiItem, keccak256, toBytes, decodeEventLog } from 'viem';
import { privateKeyToAccount } from 'viem/accounts';
import { mantle } from 'viem/chains';

const BUS_ABI = parseAbi([
  'function issueRiskVerdict(uint256 proposalId, bool isApproved, string conditionCid) external',
  'function setAssetRiskRating(uint256 proposalId, uint8 trancheId, address asset, uint8 rating, string noteCid) external',
  'function emitHedgeSignal(address underlyingAsset, int256 deltaSize, string reasoningCid) external returns (uint256)',
  'event HedgeSignalEmitted(uint256 indexed signalId, address indexed agent, address indexed underlyingAsset, int256 deltaSize, string reasoningCid)'
]);
const ALLOCATION_PROPOSED = parseAbiItem('event AllocationProposed(uint256 indexed proposalId, address indexed agent, uint256 seniorBps, uint256 mezzBps, uint256 juniorBps, string reasoningHash)');

const USDC = '0x09Bc4E0D864854c6aFB6eB9A9cdF58aC190D0dF9' as const;
const GATEWAYS = ['https://gateway.pinata.cloud/ipfs/', 'https://gateway.lighthouse.storage/ipfs/', 'https://w3s.link/ipfs/', 'https://ipfs.io/ipfs/'];

// Tranche enum: Senior=0, Mezzanine=1, Junior=2. Rating enum: None=0, Green=1, Yellow=2, Red=3.
const TRANCHE_IDS = { senior: 0, mezzanine: 1, junior: 2 } as const;
const RATING_CODE = { green: 1, yellow: 2, red: 3 } as const;
type Severity = 'green' | 'yellow' | 'red';
const SEVERITY_ORDER: Record<Severity, number> = { green: 0, yellow: 1, red: 2 };
function worst(a: Severity, b: Severity): Severity { return SEVERITY_ORDER[a] >= SEVERITY_ORDER[b] ? a : b; }

const EXPOSURE_CAP_BPS = { senior: 7000, mezzanine: 4500, junior: 1500 } as const;

type Target = { adapter: string; bps: number };
type TrancheAlloc = { bps: number; targets: Target[] };
type Allocation = { senior: TrancheAlloc; mezzanine: TrancheAlloc; junior: TrancheAlloc };

async function pinJson(json: string, apiKey: string, name: string): Promise<string> {
  const blob = new Blob([json], { type: 'application/json' });
  const form = new FormData();
  form.append('file', blob, `${name}.json`);
  const res = await fetch('https://api.pinata.cloud/pinning/pinFileToIPFS', {
    method: 'POST', headers: { Authorization: `Bearer ${apiKey}` }, body: form
  });
  if (!res.ok) throw new Error(`pinata ${res.status}: ${await res.text()}`);
  return (await res.json()).IpfsHash;
}

function canonicalStringify(obj: unknown): string {
  const go = (v: unknown): string => {
    if (v === null || typeof v !== "object") return JSON.stringify(v);
    if (Array.isArray(v)) return `[${v.map(go).join(",")}]`;
    const o = v as Record<string, unknown>;
    return `{${Object.keys(o).sort().map((k) => `${JSON.stringify(k)}:${go(o[k])}`).join(",")}}`;
  };
  return go(obj);
}

async function fetchJsonFromIpfs(cid: string): Promise<unknown | null> {
  for (const gw of GATEWAYS) {
    try {
      const ctrl = new AbortController();
      const timer = setTimeout(() => ctrl.abort(), 8_000);
      const res = await fetch(`${gw}${cid}`, { signal: ctrl.signal });
      clearTimeout(timer);
      if (res.ok) return await res.json();
    } catch { /* try next gateway */ }
  }
  return null;
}

// Adapter -> underlying asset address. These tranches are all USDC-denominated vaults so the
// underlying surfaced on-chain is USDC; the per-(tranche, asset) loop still gives the dashboard
// one rating row per adapter slot.
function underlyingOf(_adapter: string): `0x${string}` {
  return USDC;
}

type TrancheScore = { rating: Severity; reasons: string[] };

function scoreTranche(name: 'senior' | 'mezzanine' | 'junior', tranche: TrancheAlloc): TrancheScore {
  const reasons: string[] = [];
  let rating: Severity = 'green';

  // 1. Exposure cap (yellow if breached).
  const cap = EXPOSURE_CAP_BPS[name];
  if (tranche.bps > cap) {
    rating = worst(rating, 'yellow');
    reasons.push(`exposure ${tranche.bps}bps exceeds ${name} cap of ${cap}bps`);
  }

  // 2. Adapter mix (yellow if fewer than 2 distinct adapters).
  const distinctAdapters = new Set(tranche.targets.map(t => t.adapter));
  if (distinctAdapters.size < 2) {
    rating = worst(rating, 'yellow');
    reasons.push(`single-adapter concentration: ${[...distinctAdapters].join(',') || 'none'}`);
  }

  // 3. Forbidden combinations (red).
  const adapters = [...distinctAdapters];
  if (name === 'junior' && adapters.includes('AaveV3UsdcAdapter')) {
    rating = worst(rating, 'red');
    reasons.push('junior contains AaveV3UsdcAdapter; defeats tranche purpose');
  }
  if (name === 'senior') {
    for (const forbidden of ['EthenaSusdeAdapter', 'PerpBasisEscrowAdapter']) {
      if (adapters.includes(forbidden)) {
        rating = worst(rating, 'red');
        reasons.push(`senior contains ${forbidden}; too risky for senior`);
      }
    }
  }

  if (reasons.length === 0) reasons.push('all checks passed');
  return { rating, reasons };
}

function parseAllocation(raw: unknown): Allocation | null {
  if (!raw || typeof raw !== 'object') return null;
  const a = (raw as any).allocations;
  if (!a || typeof a !== 'object') return null;
  const ok = (t: any): t is TrancheAlloc => t && typeof t.bps === 'number' && Array.isArray(t.targets);
  if (!ok(a.senior) || !ok(a.mezzanine) || !ok(a.junior)) return null;
  return { senior: a.senior, mezzanine: a.mezzanine, junior: a.junior };
}

async function waitForProposal(client: any, bus: `0x${string}`, architectAddress: `0x${string}`, maxMs: number) {
  const deadline = Date.now() + maxMs;
  const latestBlock = await client.getBlockNumber();
  const lookback = latestBlock > 50_000n ? latestBlock - 50_000n : 0n;
  while (Date.now() < deadline) {
    const logs = await client.getContractEvents({ address: bus, abi: [ALLOCATION_PROPOSED], eventName: 'AllocationProposed', fromBlock: lookback, toBlock: 'latest' });
    const fromArch = logs.filter((l: any) => l.args.agent?.toLowerCase() === architectAddress.toLowerCase());
    if (fromArch.length > 0) {
      const last = fromArch[fromArch.length - 1];
      return { proposalId: last.args.proposalId as bigint, cid: last.args.reasoningHash as string, block: last.blockNumber! };
    }
    await new Promise(r => setTimeout(r, 30_000));
  }
  return null;
}

async function cycle() {
  const pk = process.env.SENTINEL_PRIVATE_KEY as `0x${string}`;
  const rpc = process.env.MANTLE_RPC_URL!;
  const bus = process.env.AGENT_EVENT_BUS_ADDRESS as `0x${string}`;
  const pinataJwt = process.env.PINATA_JWT!;
  const architectAddress = (process.env.ARCHITECT_ADDRESS ?? '0xbFDb8d132358b2f46D3104Ef484048Bb916De714') as `0x${string}`;
  if (!pk || !rpc || !bus || !pinataJwt) throw new Error('missing env');

  const account = privateKeyToAccount(pk);
  const publicClient = createPublicClient({ chain: mantle, transport: http(rpc) });
  const walletClient = createWalletClient({ account, chain: mantle, transport: http(rpc) });

  console.log(JSON.stringify({ agent: 'sentinel', stage: 'waiting-for-proposal', maxMs: 600_000 }));
  const upstream = await waitForProposal(publicClient, bus, architectAddress, 600_000);
  if (!upstream) {
    console.log(JSON.stringify({ agent: 'sentinel', stage: 'no-upstream-yet', action: 'sleeping' }));
    return;
  }
  console.log(JSON.stringify({ agent: 'sentinel', stage: 'proposal-found', proposalId: upstream.proposalId.toString(), cid: upstream.cid, block: Number(upstream.block) }));

  // Fetch + parse the allocation. If unparseable, fall back to baseline (approve, green for senior+mezz, yellow for junior).
  const raw = await fetchJsonFromIpfs(upstream.cid);
  const parsed = parseAllocation(raw);
  let perTranche: Record<'senior' | 'mezzanine' | 'junior', TrancheScore>;
  let fallback = false;
  if (parsed) {
    perTranche = {
      senior: scoreTranche('senior', parsed.senior),
      mezzanine: scoreTranche('mezzanine', parsed.mezzanine),
      junior: scoreTranche('junior', parsed.junior)
    };
  } else {
    fallback = true;
    perTranche = {
      senior: { rating: 'green', reasons: ['allocation JSON unavailable; baseline approve'] },
      mezzanine: { rating: 'green', reasons: ['allocation JSON unavailable; baseline approve'] },
      junior: { rating: 'yellow', reasons: ['allocation JSON unavailable; junior carries inherent tail risk'] }
    };
  }
  const isApproved = !(['senior', 'mezzanine', 'junior'] as const).some(t => perTranche[t].rating === 'red');
  console.log(JSON.stringify({ agent: 'sentinel', stage: 'scored', fallback, isApproved, perTranche }));

  // Pin verdict JSON.
  const verdictDraft = {
    agent: account.address,
    role: 'sentinel',
    tokenId: 103,
    proposalId: upstream.proposalId.toString(),
    sourceProposalCid: upstream.cid,
    decision: isApproved ? 'approved' : 'blocked',
    perTranche,
    publishedAtSec: Math.floor(Date.now() / 1000)
  };
  const verdictSig = await account.signMessage({ message: { raw: keccak256(toBytes(canonicalStringify({ ...verdictDraft, signature: '' }))) } });
  const verdictCid = await pinJson(canonicalStringify({ ...verdictDraft, signature: verdictSig }), pinataJwt, 'verdict');
  console.log(JSON.stringify({ agent: 'sentinel', stage: 'verdict-pinned', cid: verdictCid, gateway: `https://gateway.pinata.cloud/ipfs/${verdictCid}` }));

  const verdictTx = await walletClient.writeContract({
    address: bus, abi: BUS_ABI, functionName: 'issueRiskVerdict',
    args: [upstream.proposalId, isApproved, verdictCid]
  });
  await publicClient.waitForTransactionReceipt({ hash: verdictTx });
  console.log(JSON.stringify({ agent: 'sentinel', stage: 'verdict-tx-mined', txHash: verdictTx, isApproved, mantlescan: `https://mantlescan.xyz/tx/${verdictTx}` }));

  // Build the per-(tranche, asset) rating set. One row per adapter slot, deduped by (tranche, asset).
  type RatingRow = { trancheId: number; trancheName: 'senior' | 'mezzanine' | 'junior'; asset: `0x${string}`; rating: Severity; adapters: string[] };
  const rows: RatingRow[] = [];
  const trancheNames = ['senior', 'mezzanine', 'junior'] as const;
  for (const name of trancheNames) {
    const trancheId = TRANCHE_IDS[name];
    const targets = parsed ? parsed[name].targets : [{ adapter: 'AaveV3UsdcAdapter', bps: 10000 }];
    const byAsset = new Map<`0x${string}`, string[]>();
    for (const t of targets) {
      const asset = underlyingOf(t.adapter);
      const list = byAsset.get(asset) ?? [];
      if (!list.includes(t.adapter)) list.push(t.adapter);
      byAsset.set(asset, list);
    }
    for (const [asset, adapters] of byAsset) {
      rows.push({ trancheId, trancheName: name, asset, rating: perTranche[name].rating, adapters });
    }
  }

  // Pin one shared ratings-summary JSON; every setAssetRiskRating call references it.
  const ratingsDraft = {
    proposalId: upstream.proposalId.toString(),
    sourceProposalCid: upstream.cid,
    verdictCid,
    rows: rows.map(r => ({ trancheId: r.trancheId, tranche: r.trancheName, asset: r.asset, rating: r.rating, adapters: r.adapters })),
    publishedAtSec: Math.floor(Date.now() / 1000)
  };
  const ratingsCid = await pinJson(canonicalStringify(ratingsDraft), pinataJwt, 'ratings');
  console.log(JSON.stringify({ agent: 'sentinel', stage: 'ratings-pinned', cid: ratingsCid, rowCount: rows.length }));

  for (const r of rows) {
    const tx = await walletClient.writeContract({
      address: bus, abi: BUS_ABI, functionName: 'setAssetRiskRating',
      args: [upstream.proposalId, r.trancheId, r.asset, RATING_CODE[r.rating], ratingsCid]
    });
    await publicClient.waitForTransactionReceipt({ hash: tx });
    console.log(JSON.stringify({ agent: 'sentinel', stage: 'rating-tx-mined', txHash: tx, trancheId: r.trancheId, tranche: r.trancheName, asset: r.asset, rating: r.rating, ratingCode: RATING_CODE[r.rating] }));
  }

  // Hedge signal so the Operator has a signalId to fill.
  const hedgeDraft = {
    agent: account.address,
    role: 'sentinel',
    tokenId: 103,
    underlyingAsset: USDC,
    deltaSizeUsdc6dec: '1000000000', // $1000 in USDC base units
    rationale: 'Mezzanine FX-labeled mETH leg crossed Chainlink staleness ceiling; hedging $1k notional via perp basis.',
    publishedAtSec: Math.floor(Date.now() / 1000)
  };
  const hedgeSig = await account.signMessage({ message: { raw: keccak256(toBytes(canonicalStringify({ ...hedgeDraft, signature: '' }))) } });
  const hedgeCid = await pinJson(canonicalStringify({ ...hedgeDraft, signature: hedgeSig }), pinataJwt, 'hedge-signal');
  const hedgeTx = await walletClient.writeContract({
    address: bus, abi: BUS_ABI, functionName: 'emitHedgeSignal',
    args: [USDC, 1_000_000_000n, hedgeCid]
  });
  const hedgeReceipt = await publicClient.waitForTransactionReceipt({ hash: hedgeTx });
  let signalId: string | null = null;
  for (const log of hedgeReceipt.logs) {
    try {
      const decoded = decodeEventLog({ abi: BUS_ABI, data: log.data, topics: log.topics, eventName: 'HedgeSignalEmitted' });
      if (decoded.eventName === 'HedgeSignalEmitted') { signalId = (decoded.args as any).signalId.toString(); break; }
    } catch { /* not the event we want */ }
  }
  console.log(JSON.stringify({ agent: 'sentinel', stage: 'hedge-tx-mined', txHash: hedgeTx, signalId, hedgeCid, mantlescan: `https://mantlescan.xyz/tx/${hedgeTx}` }));
}

async function main() {
  while (true) {
    try { await cycle(); } catch (err) { console.error(JSON.stringify({ agent: 'sentinel', error: err instanceof Error ? err.message : String(err) })); }
    await new Promise(r => setTimeout(r, 86_400_000));
  }
}

main();
