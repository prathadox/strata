// Demo-day driver. Initiates Scout's cron path manually, then live-tails the bus
// to show every downstream subscriber reaction as it lands. Hard 45s budget.
//
// Modes (pick exactly one):
//   default        Trigger Scout. Watch the bus for AllocationProposed (Architect),
//                  RiskVerdictIssued (Sentinel), HedgeLogged (Operator). Per-stage
//                  timeout 15s, total budget 45s. If any stage times out, print
//                  what made it and what didn't, then exit non-zero.
//
//   --watch-only   Do NOT trigger anything. Just tail the bus from the current
//                  block tip forever. Useful if you want to watch what the live
//                  Railway cron is emitting, or pair it with a separate Scout
//                  trigger from somewhere else. Ctrl+C to stop.
//
//   --puppeteer    Skip the subscriber wait entirely. Drive all 4 stages from
//                  this process using the local agent .env keys. Fastest and
//                  most deterministic (~25-35s), but proves nothing about whether
//                  the Railway subscribers are alive. Demo-day fallback only.
//
// Usage:
//   pnpm tsx agents/scripts/demo-loop.ts                        # default, 45s
//   pnpm tsx agents/scripts/demo-loop.ts --budget 60            # bigger budget
//   pnpm tsx agents/scripts/demo-loop.ts --watch-only           # just tail
//   pnpm tsx agents/scripts/demo-loop.ts --puppeteer            # demo fallback

import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { createPublicClient, createWalletClient, http, parseAbi, parseAbiItem, keccak256, toBytes, decodeEventLog, toEventSelector, type Log } from 'viem';
import { privateKeyToAccount } from 'viem/accounts';
import { mantle } from 'viem/chains';

function loadEnv(path: string) {
  try {
    for (const line of readFileSync(path, 'utf8').split('\n')) {
      const t = line.trim();
      if (!t || t.startsWith('#')) continue;
      const i = t.indexOf('=');
      if (i < 0) continue;
      const k = t.slice(0, i).trim();
      const v = t.slice(i + 1).trim();
      if (!process.env[k]) process.env[k] = v;
    }
  } catch { /* file missing is fine */ }
}
const ROOT = join(process.cwd().endsWith('strata') ? process.cwd() : join(process.cwd(), '..', '..'), 'agents');
for (const a of ['scout', 'architect', 'sentinel', 'operator']) loadEnv(join(ROOT, a, '.env'));

const argv = process.argv;
const WATCH_ONLY = argv.includes('--watch-only');
const PUPPETEER = argv.includes('--puppeteer');
function numArg(name: string, fallback: number): number {
  const eq = argv.find((a) => a.startsWith(`${name}=`))?.split('=')[1];
  if (eq !== undefined) return Number(eq);
  const i = argv.indexOf(name);
  if (i >= 0 && i + 1 < argv.length) return Number(argv[i + 1]);
  return fallback;
}
const BUDGET_S = numArg('--budget', 45);
const STAGE_TIMEOUT_S = numArg('--stage-timeout', 15);
const POLL_MS = 1500;

if (WATCH_ONLY && PUPPETEER) {
  console.error('error: --watch-only and --puppeteer are mutually exclusive.');
  process.exit(2);
}

const RPC = process.env.MANTLE_RPC_URL ?? 'https://rpc.mantle.xyz';
const BUS = (process.env.AGENT_EVENT_BUS_ADDRESS ?? '0x0E6F30bC6D9b08cD20d422D634d565d3300D0A62') as `0x${string}`;
const LK = process.env.PINATA_JWT;
const USDC = '0x09Bc4E0D864854c6aFB6eB9A9cdF58aC190D0dF9' as const;

const SCOUT_PK = process.env.SCOUT_PRIVATE_KEY as `0x${string}` | undefined;
const ARCH_PK = process.env.ARCHITECT_PRIVATE_KEY as `0x${string}` | undefined;
const SENT_PK = process.env.SENTINEL_PRIVATE_KEY as `0x${string}` | undefined;
const OP_PK = process.env.OPERATOR_PRIVATE_KEY as `0x${string}` | undefined;

const BUS_ABI = parseAbi([
  'function publishYieldMap(string ipfsHash) external',
  'function proposeAllocation(uint256 proposalId, uint16 seniorBps, uint16 mezzBps, uint16 juniorBps, string reasoningCid) external',
  'function issueRiskVerdict(uint256 proposalId, bool isApproved, string conditionCid) external',
  'function setAssetRiskRating(uint256 proposalId, uint8 trancheId, address asset, uint8 rating, string noteCid) external',
  'function emitHedgeSignal(address underlyingAsset, int256 deltaSize, string reasoningHash) external returns (uint256)',
  'function logHedge(uint256 signalId, address hedgedAsset, int256 netPosition, string executionProof) external',
  'event HedgeSignalEmitted(uint256 indexed signalId, address indexed agent, address indexed underlyingAsset, int256 deltaSize, string reasoningHash)'
]);

const EVT = {
  YieldMapPublished:   parseAbiItem('event YieldMapPublished(address indexed agent, string ipfsHash, uint256 timestamp)'),
  AllocationProposed:  parseAbiItem('event AllocationProposed(uint256 indexed proposalId, address indexed agent, uint256 seniorBps, uint256 mezzBps, uint256 juniorBps, string reasoningHash)'),
  RiskVerdictIssued:   parseAbiItem('event RiskVerdictIssued(uint256 indexed proposalId, address indexed agent, bool isApproved, string conditionHash)'),
  HedgeSignalEmitted:  parseAbiItem('event HedgeSignalEmitted(uint256 indexed signalId, address indexed agent, address indexed underlyingAsset, int256 deltaSize, string reasoningHash)'),
  HedgeLogged:         parseAbiItem('event HedgeLogged(uint256 indexed signalId, address indexed agent, address indexed hedgedAsset, int256 netPosition, string executionProof)'),
  AssetRiskRated:      parseAbiItem('event AssetRiskRated(uint256 indexed proposalId, uint8 indexed trancheId, address indexed asset, uint8 rating, string noteCid)')
};

const TOPIC = {
  AllocationProposed: toEventSelector(EVT.AllocationProposed),
  RiskVerdictIssued:  toEventSelector(EVT.RiskVerdictIssued),
  HedgeLogged:        toEventSelector(EVT.HedgeLogged)
};

const publicClient = createPublicClient({ chain: mantle, transport: http(RPC) });
function walletFor(pk: `0x${string}`) {
  return createWalletClient({ account: privateKeyToAccount(pk), chain: mantle, transport: http(RPC) });
}

function canonical(obj: unknown) {
  const go = (v: unknown): string => {
    if (v === null || typeof v !== "object") return JSON.stringify(v);
    if (Array.isArray(v)) return `[${v.map(go).join(",")}]`;
    const o = v as Record<string, unknown>;
    return `{${Object.keys(o).sort().map((k) => `${JSON.stringify(k)}:${go(o[k])}`).join(",")}}`;
  };
  return go(obj);
}

async function pin(json: string, name: string): Promise<string> {
  if (!LK) throw new Error('PINATA_JWT missing');
  const form = new FormData();
  form.append('file', new Blob([json], { type: 'application/json' }), `${name}.json`);
  const res = await fetch('https://api.pinata.cloud/pinning/pinFileToIPFS', {
    method: 'POST', headers: { Authorization: `Bearer ${LK}` }, body: form
  });
  if (!res.ok) throw new Error(`pinata ${res.status}: ${await res.text()}`);
  return (await res.json()).IpfsHash;
}

async function sign(pk: `0x${string}`, draft: object): Promise<string> {
  const acct = privateKeyToAccount(pk);
  const hash = keccak256(toBytes(canonical({ ...draft, signature: '' })));
  return acct.signMessage({ message: { raw: hash } });
}

const startMs = Date.now();
function elapsed(): number { return Math.round((Date.now() - startMs) / 1000); }
function ts(): string { return new Date().toISOString().slice(11, 19); }

function shortHex(s: string, head = 10, tail = 6): string {
  if (s.length <= head + tail + 1) return s;
  return `${s.slice(0, head)}...${s.slice(-tail)}`;
}

const AGENT_LABEL: Record<string, string> = {};
function labelForAddress(addr: string): string {
  return AGENT_LABEL[addr.toLowerCase()] ?? shortHex(addr, 6, 4);
}

if (SCOUT_PK) AGENT_LABEL[privateKeyToAccount(SCOUT_PK).address.toLowerCase()] = 'Scout';
if (ARCH_PK) AGENT_LABEL[privateKeyToAccount(ARCH_PK).address.toLowerCase()] = 'Architect';
if (SENT_PK) AGENT_LABEL[privateKeyToAccount(SENT_PK).address.toLowerCase()] = 'Sentinel';
if (OP_PK) AGENT_LABEL[privateKeyToAccount(OP_PK).address.toLowerCase()] = 'Operator';

function summarizeLog(log: Log): string {
  for (const [name, event] of Object.entries(EVT)) {
    try {
      const d = decodeEventLog({ abi: [event], data: log.data, topics: log.topics });
      const a: any = d.args;
      const agent = labelForAddress(a.agent ?? '');
      switch (name) {
        case 'YieldMapPublished':  return `[${ts()} +${elapsed()}s] ${agent} -> YieldMapPublished       cid=${shortHex(a.ipfsHash)}`;
        case 'AllocationProposed': return `[${ts()} +${elapsed()}s] ${agent} -> AllocationProposed      proposalId=${a.proposalId} senior=${a.seniorBps} mezz=${a.mezzBps} junior=${a.juniorBps} cid=${shortHex(a.reasoningHash)}`;
        case 'RiskVerdictIssued':  return `[${ts()} +${elapsed()}s] ${agent} -> RiskVerdictIssued       proposalId=${a.proposalId} approved=${a.isApproved} cid=${shortHex(a.conditionHash)}`;
        case 'AssetRiskRated':     return `[${ts()} +${elapsed()}s] ${agent} -> AssetRiskRated          proposalId=${a.proposalId} tranche=${a.trancheId} rating=${a.rating} cid=${shortHex(a.noteCid)}`;
        case 'HedgeSignalEmitted': return `[${ts()} +${elapsed()}s] ${agent} -> HedgeSignalEmitted      signalId=${a.signalId} delta=${a.deltaSize} cid=${shortHex(a.reasoningHash)}`;
        case 'HedgeLogged':        return `[${ts()} +${elapsed()}s] ${agent} -> HedgeLogged             signalId=${a.signalId} netPosition=${a.netPosition} cid=${shortHex(a.executionProof)}`;
      }
    } catch { /* not this event, try next */ }
  }
  return `[${ts()} +${elapsed()}s] unknown event topic=${log.topics[0]}`;
}

async function publishScoutYieldMap(): Promise<{ cid: string; tx: `0x${string}`; block: number }> {
  if (!SCOUT_PK) throw new Error('SCOUT_PRIVATE_KEY missing');
  const acct = privateKeyToAccount(SCOUT_PK);
  const draft = {
    agent: acct.address,
    role: 'scout',
    tokenId: 101,
    methodology: 'demo-loop trigger: first-principles RAAPY v3',
    publishedAtSec: Math.floor(Date.now() / 1000),
    opportunities: [
      { project: 'aave-v3',             asset: 'USDC',      chain: 'mantle', apy: 0.036, raapy: 0.035, expectedLoss: 0.001, confidence: 0.94, tranches: ['senior', 'mezzanine', 'junior'] },
      { project: 'ondo-finance',        asset: 'USDY',      chain: 'mantle', apy: 0.049, raapy: 0.047, expectedLoss: 0.002, confidence: 0.90, tranches: ['senior', 'mezzanine'] },
      { project: 'ethena',              asset: 'sUSDe',     chain: 'mantle', apy: 0.092, raapy: 0.074, expectedLoss: 0.018, confidence: 0.80, tranches: ['mezzanine', 'junior'] },
      { project: 'agni-finance',        asset: 'USDC/USDe', chain: 'mantle', apy: 0.118, raapy: 0.079, expectedLoss: 0.039, confidence: 0.70, tranches: ['junior'] },
      { project: 'mantle-staked-ether', asset: 'mETH',      chain: 'mantle', apy: 0.040, raapy: 0.033, expectedLoss: 0.007, confidence: 0.86, tranches: ['mezzanine'] }
    ]
  };
  const signature = await sign(SCOUT_PK, draft);
  const cid = await pin(canonical({ ...draft, signature }), 'yieldmap');
  const tx = await walletFor(SCOUT_PK).writeContract({ address: BUS, abi: BUS_ABI, functionName: 'publishYieldMap', args: [cid] });
  const r = await publicClient.waitForTransactionReceipt({ hash: tx });
  return { cid, tx, block: Number(r.blockNumber) };
}

async function puppeteerDownstream(scoutCid: string) {
  if (!ARCH_PK || !SENT_PK || !OP_PK) throw new Error('one or more downstream private keys missing');

  // Architect
  const archAcct = privateKeyToAccount(ARCH_PK);
  const proposalId = BigInt(Math.floor(Date.now() / 1000));
  const archDraft = {
    agent: archAcct.address, role: 'architect', tokenId: 102, proposalId: proposalId.toString(),
    allocations: {
      senior:    { bps: 5500, targets: [{ adapter: 'AaveV3UsdcAdapter', bps: 6500 }, { adapter: 'OndoUsdyAdapter', bps: 3500 }] },
      mezzanine: { bps: 3500, targets: [{ adapter: 'AaveV3UsdcAdapter', bps: 3500 }, { adapter: 'EthenaSusdeAdapter', bps: 3500 }, { adapter: 'AgniLpUsdcUsdeAdapter', bps: 3000 }] },
      junior:    { bps: 1000, targets: [{ adapter: 'EthenaSusdeAdapter', bps: 5500 }, { adapter: 'PerpBasisEscrowAdapter', bps: 4500 }] }
    },
    rationale: 'demo-loop: tilt to mezz to capture sUSDe basis without crossing Junior cap',
    upstreamYieldMapCid: scoutCid,
    publishedAtSec: Math.floor(Date.now() / 1000)
  };
  const archCid = await pin(canonical({ ...archDraft, signature: await sign(ARCH_PK, archDraft) }), 'allocation');
  const archTx = await walletFor(ARCH_PK).writeContract({ address: BUS, abi: BUS_ABI, functionName: 'proposeAllocation', args: [proposalId, 5500n, 3500n, 1000n, archCid] });
  await publicClient.waitForTransactionReceipt({ hash: archTx });

  // Sentinel verdict
  const sentAcct = privateKeyToAccount(SENT_PK);
  const verdictDraft = {
    agent: sentAcct.address, role: 'sentinel', tokenId: 103, proposalId: proposalId.toString(),
    decision: 'approved',
    perTranche: {
      senior:    { rating: 'green', reasons: ['within senior cap'] },
      mezzanine: { rating: 'green', reasons: ['sUSDe within mezz mandate'] },
      junior:    { rating: 'green', reasons: ['perp basis funding flat'] }
    },
    publishedAtSec: Math.floor(Date.now() / 1000)
  };
  const verdictCid = await pin(canonical({ ...verdictDraft, signature: await sign(SENT_PK, verdictDraft) }), 'verdict');
  const verdictTx = await walletFor(SENT_PK).writeContract({ address: BUS, abi: BUS_ABI, functionName: 'issueRiskVerdict', args: [proposalId, true, verdictCid] });
  await publicClient.waitForTransactionReceipt({ hash: verdictTx });

  // Sentinel hedge signal
  const deltaSize = 2_000_000_000n;
  const hedgeDraft = {
    agent: sentAcct.address, role: 'sentinel', tokenId: 103,
    underlyingAsset: USDC, deltaSizeUsdc6dec: deltaSize.toString(),
    rationale: 'demo-loop: sUSDe leg crossed +1.5sigma, $2k USDC notional short basis',
    publishedAtSec: Math.floor(Date.now() / 1000)
  };
  const hedgeCid = await pin(canonical({ ...hedgeDraft, signature: await sign(SENT_PK, hedgeDraft) }), 'hedge-signal');
  const hedgeTx = await walletFor(SENT_PK).writeContract({ address: BUS, abi: BUS_ABI, functionName: 'emitHedgeSignal', args: [USDC, deltaSize, hedgeCid] });
  const hedgeRcp = await publicClient.waitForTransactionReceipt({ hash: hedgeTx });
  let signalId = 0n;
  for (const log of hedgeRcp.logs) {
    try {
      const d = decodeEventLog({ abi: BUS_ABI, data: log.data, topics: log.topics, eventName: 'HedgeSignalEmitted' });
      if (d.eventName === 'HedgeSignalEmitted') { signalId = (d.args as any).signalId; break; }
    } catch { /* skip */ }
  }

  // Operator
  const opAcct = privateKeyToAccount(OP_PK);
  const fill = 1_000_000_000n;
  const opDraft = {
    agent: opAcct.address, role: 'operator', tokenId: 104, signalId: signalId.toString(),
    hedgedAsset: USDC, netPositionUsdc6dec: fill.toString(),
    venue: 'Byreal Perps (Hyperliquid settlement)',
    fill: { side: 'short', sizeBase: '0.0', avgPriceUsd: '0.0', filledAtSec: Math.floor(Date.now() / 1000), note: 'demo-loop fill' },
    publishedAtSec: Math.floor(Date.now() / 1000)
  };
  const opCid = await pin(canonical({ ...opDraft, signature: await sign(OP_PK, opDraft) }), 'hedge-log');
  await walletFor(OP_PK).writeContract({ address: BUS, abi: BUS_ABI, functionName: 'logHedge', args: [signalId, USDC, fill, opCid] });
}

async function getLogsThrottled(event: any, fromBlock: bigint, toBlock: bigint): Promise<Log[]> {
  const MAX = 10_000n;
  const out: Log[] = [];
  let cursor = fromBlock;
  let backoff = 500;
  while (cursor <= toBlock) {
    const end = cursor + MAX - 1n > toBlock ? toBlock : cursor + MAX - 1n;
    try {
      const chunk = await publicClient.getLogs({ address: BUS, event, fromBlock: cursor, toBlock: end });
      out.push(...chunk);
      cursor = end + 1n;
      backoff = 500;
    } catch (e: any) {
      const msg = String(e?.details ?? e?.message ?? '');
      if (msg.includes('rate limit')) {
        await new Promise((r) => setTimeout(r, backoff));
        backoff = Math.min(backoff * 2, 8000);
        continue;
      }
      throw e;
    }
  }
  return out;
}

async function watchLoop(fromBlock: bigint, stopOnAll: { allocation: boolean; verdict: boolean; hedgeLog: boolean } | null): Promise<void> {
  const seen = new Set<string>();
  const got = { allocation: false, verdict: false, hedgeLog: false };
  const stageDeadlines = {
    allocation: Date.now() + STAGE_TIMEOUT_S * 1000,
    verdict:    Date.now() + STAGE_TIMEOUT_S * 2 * 1000,
    hedgeLog:   Date.now() + STAGE_TIMEOUT_S * 3 * 1000
  };
  const overallDeadline = WATCH_ONLY ? Infinity : startMs + BUDGET_S * 1000;

  let cursor = fromBlock;
  while (Date.now() < overallDeadline) {
    let tip: bigint;
    try {
      tip = await publicClient.getBlockNumber();
    } catch (e: any) {
      await new Promise((r) => setTimeout(r, POLL_MS));
      continue;
    }
    if (tip >= cursor) {
      const all: Log[] = [];
      for (const event of Object.values(EVT)) {
        try {
          const chunk = await getLogsThrottled(event, cursor, tip);
          all.push(...chunk);
        } catch (e: any) { /* skip this event this round */ }
      }
      all.sort((a, b) => Number((a.blockNumber ?? 0n) - (b.blockNumber ?? 0n)) || Number((a.logIndex ?? 0) - (b.logIndex ?? 0)));
      for (const log of all) {
        const key = `${log.transactionHash}:${log.logIndex}`;
        if (seen.has(key)) continue;
        seen.add(key);
        console.log(summarizeLog(log));
        const t0 = log.topics[0];
        if (stopOnAll) {
          if (!got.allocation && t0 === TOPIC.AllocationProposed) got.allocation = true;
          if (!got.verdict && t0 === TOPIC.RiskVerdictIssued) got.verdict = true;
          if (!got.hedgeLog && t0 === TOPIC.HedgeLogged) got.hedgeLog = true;
        }
      }
      cursor = tip + 1n;
    }
    if (stopOnAll && got.allocation && got.verdict && got.hedgeLog) {
      console.log(`\nfull loop landed in ${elapsed()}s`);
      return;
    }
    if (stopOnAll && !got.allocation && Date.now() > stageDeadlines.allocation) {
      console.log(`\nTIMEOUT after ${elapsed()}s: Architect never emitted AllocationProposed. Architect listener on Railway is likely down.`);
      console.log('try --puppeteer for a deterministic demo, then restart Architect.');
      process.exit(3);
    }
    if (stopOnAll && got.allocation && !got.verdict && Date.now() > stageDeadlines.verdict) {
      console.log(`\nTIMEOUT after ${elapsed()}s: Sentinel never emitted RiskVerdictIssued. Sentinel listener on Railway is likely down.`);
      process.exit(3);
    }
    if (stopOnAll && got.verdict && !got.hedgeLog && Date.now() > stageDeadlines.hedgeLog) {
      console.log(`\nTIMEOUT after ${elapsed()}s: Operator never emitted HedgeLogged. Operator listener on Railway is likely down.`);
      process.exit(3);
    }
    await new Promise((r) => setTimeout(r, POLL_MS));
  }
  if (stopOnAll) {
    console.log(`\nTIMEOUT after ${elapsed()}s. Got allocation=${got.allocation} verdict=${got.verdict} hedgeLog=${got.hedgeLog}.`);
    process.exit(3);
  }
}

async function main() {
  const tip = await publicClient.getBlockNumber();
  console.log(`bus     : ${BUS}`);
  console.log(`tip     : block ${tip}`);

  if (WATCH_ONLY) {
    console.log(`mode    : watch-only (tail bus from block ${tip} forever, Ctrl+C to stop)`);
    console.log('');
    await watchLoop(tip, null);
    return;
  }

  if (PUPPETEER) {
    console.log(`mode    : puppeteer (this process drives all 4 stages, ~25-35s)`);
    console.log(`budget  : n/a`);
    console.log('');
    console.log(`[${ts()} +${elapsed()}s] Scout: pinning + publishing yield map...`);
    const scout = await publishScoutYieldMap();
    console.log(`[${ts()} +${elapsed()}s] Scout: tx=${shortHex(scout.tx)} block=${scout.block} cid=${shortHex(scout.cid)}`);
    console.log(`[${ts()} +${elapsed()}s] Architect/Sentinel/Operator: driving downstream stages...`);
    await puppeteerDownstream(scout.cid);
    console.log(`\nfull loop landed in ${elapsed()}s (puppeteer mode, bus subscribers not exercised)`);
    return;
  }

  console.log(`mode    : observe (trigger Scout, watch bus for subscriber reactions)`);
  console.log(`budget  : ${BUDGET_S}s total, ${STAGE_TIMEOUT_S}s per stage`);
  console.log('');
  console.log(`[${ts()} +${elapsed()}s] Scout: pinning + publishing yield map (initiating cron manually)...`);
  const scout = await publishScoutYieldMap();
  console.log(`[${ts()} +${elapsed()}s] Scout: tx=${shortHex(scout.tx)} block=${scout.block} cid=${shortHex(scout.cid)}`);
  console.log(`[${ts()} +${elapsed()}s] Tailing bus for downstream reactions...`);
  console.log('');
  await watchLoop(BigInt(scout.block), { allocation: false, verdict: false, hedgeLog: false });
}

main().catch((e) => { console.error(e); process.exit(1); });
