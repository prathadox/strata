// On-demand trigger of the agent loop on Mantle.
//
// Architecture reminder: Scout is the only cron-driven agent. Architect, Sentinel,
// and Operator are bus subscribers - they listen for the upstream event and react.
// Inter-agent communication happens through the bus, not through this script.
//
// Two modes:
//
//   --mode observe     (default) Only Scout publishes a yield map. Then we watch
//                      the bus for the downstream events (AllocationProposed,
//                      RiskVerdictIssued, HedgeLogged) to fire on their own. This
//                      is the production flow. Requires Architect, Sentinel,
//                      Operator to be RUNNING as bus subscribers (Railway services
//                      up, or local pnpm dev in each agent dir). 120s per-stage
//                      timeout. If a downstream event never fires, that listener
//                      daemon is dead - restart it, do not switch to puppeteer.
//
//   --mode puppeteer   Demo-day fallback. This process directly signs and submits
//                      all 4 stages using each agent's private key, bypassing the
//                      bus subscription pattern entirely. Use ONLY when you need
//                      deterministic timing (e.g. live demo) and you accept that
//                      the loop is not proving the listener daemons work. Fast,
//                      ~25-35s wall time.
//
// Output: one JSON line per stage, plus a final summary block.
//
// Usage:
//   pnpm tsx agents/scripts/trigger-full-loop.ts                           # observe, default
//   pnpm tsx agents/scripts/trigger-full-loop.ts --stage-timeout 180       # observe, longer wait
//   pnpm tsx agents/scripts/trigger-full-loop.ts --mode puppeteer          # demo fallback only

import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { createPublicClient, createWalletClient, http, parseAbi, parseAbiItem, keccak256, toBytes, decodeEventLog } from 'viem';
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
const MODE = (argv.find((a) => a.startsWith('--mode='))?.split('=')[1] ?? argv[argv.indexOf('--mode') + 1] ?? 'observe') as 'puppeteer' | 'observe';
const STAGE_TIMEOUT_S = Number(argv.find((a) => a.startsWith('--stage-timeout='))?.split('=')[1] ?? argv[argv.indexOf('--stage-timeout') + 1] ?? 120);

if (MODE !== 'puppeteer' && MODE !== 'observe') {
  console.error(`unknown mode: ${MODE}. use puppeteer or observe.`);
  process.exit(2);
}

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

const EVT_YIELD = parseAbiItem('event YieldMapPublished(address indexed agent, string ipfsHash, uint256 timestamp)');
const EVT_ALLOC = parseAbiItem('event AllocationProposed(uint256 indexed proposalId, address indexed agent, uint256 seniorBps, uint256 mezzBps, uint256 juniorBps, string reasoningHash)');
const EVT_VERDICT = parseAbiItem('event RiskVerdictIssued(uint256 indexed proposalId, address indexed agent, bool isApproved, string conditionHash)');
const EVT_HEDGE_LOG = parseAbiItem('event HedgeLogged(uint256 indexed signalId, address indexed agent, address indexed hedgedAsset, int256 netPosition, string executionProof)');

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

function emit(stage: string, fields: Record<string, unknown>) {
  console.log(JSON.stringify({ ts: new Date().toISOString(), stage, ...fields }));
}

const startMs = Date.now();
function elapsed(): number {
  return Math.round((Date.now() - startMs) / 1000);
}

async function publishScoutYieldMap(): Promise<{ cid: string; tx: `0x${string}`; block: number }> {
  const acct = privateKeyToAccount(SCOUT_PK);
  const draft = {
    agent: acct.address,
    role: 'scout',
    tokenId: 101,
    methodology: 'on-demand trigger: first-principles RAAPY v3 with smart-money inflow weight',
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

async function puppeteerStages(scout: { cid: string; tx: `0x${string}`; block: number }) {
  let proposalId = 0n;
  let signalId = 0n;

  // Architect
  {
    const acct = privateKeyToAccount(ARCH_PK);
    proposalId = BigInt(Math.floor(Date.now() / 1000));
    const draft = {
      agent: acct.address, role: 'architect', tokenId: 102, proposalId: proposalId.toString(),
      allocations: {
        senior:    { bps: 5500, targets: [{ adapter: 'AaveV3UsdcAdapter', bps: 6500 }, { adapter: 'OndoUsdyAdapter', bps: 3500 }] },
        mezzanine: { bps: 3500, targets: [{ adapter: 'AaveV3UsdcAdapter', bps: 3500 }, { adapter: 'EthenaSusdeAdapter', bps: 3500 }, { adapter: 'AgniLpUsdcUsdeAdapter', bps: 3000 }] },
        junior:    { bps: 1000, targets: [{ adapter: 'EthenaSusdeAdapter', bps: 5500 }, { adapter: 'PerpBasisEscrowAdapter', bps: 4500 }] }
      },
      rationale: 'On-demand trigger: tilt to mezz to capture sUSDe basis without crossing Junior cap.',
      publishedAtSec: Math.floor(Date.now() / 1000),
      upstreamYieldMapCid: scout.cid
    };
    const signature = await sign(ARCH_PK, draft);
    const cid = await pin(canonical({ ...draft, signature }), 'allocation');
    const tx = await walletFor(ARCH_PK).writeContract({ address: BUS, abi: BUS_ABI, functionName: 'proposeAllocation', args: [proposalId, 5500, 3500, 1000, cid] });
    const r = await publicClient.waitForTransactionReceipt({ hash: tx });
    emit('architect.allocation', { tx, cid, proposalId: proposalId.toString(), block: Number(r.blockNumber), elapsedS: elapsed() });
  }

  // Sentinel verdict
  {
    const acct = privateKeyToAccount(SENT_PK);
    const draft = {
      agent: acct.address, role: 'sentinel', tokenId: 103, proposalId: proposalId.toString(),
      decision: 'approved',
      perTranche: {
        senior:    { rating: 'green',  reasons: ['Aave V3 trustless; Ondo oracle within 1h freshness; Senior cap untouched'] },
        mezzanine: { rating: 'green',  reasons: ['sUSDe rate spread inside Mezz mandate; Chainlink mETH oracle fresh'] },
        junior:    { rating: 'green',  reasons: ['Agni LP cost-basis NAV holding; perp basis funding rate flat'] }
      },
      publishedAtSec: Math.floor(Date.now() / 1000)
    };
    const sig = await sign(SENT_PK, draft);
    const cid = await pin(canonical({ ...draft, signature: sig }), 'verdict');
    const tx = await walletFor(SENT_PK).writeContract({ address: BUS, abi: BUS_ABI, functionName: 'issueRiskVerdict', args: [proposalId, true, cid] });
    const r = await publicClient.waitForTransactionReceipt({ hash: tx });
    emit('sentinel.verdict', { tx, cid, proposalId: proposalId.toString(), decision: 'approved', block: Number(r.blockNumber), elapsedS: elapsed() });
  }

  // Sentinel hedge signal
  {
    const acct = privateKeyToAccount(SENT_PK);
    const deltaSize = 2_000_000_000n;
    const draft = {
      agent: acct.address, role: 'sentinel', tokenId: 103,
      underlyingAsset: USDC, deltaSizeUsdc6dec: deltaSize.toString(),
      rationale: 'On-demand trigger: sUSDe leg crossed +1.5sigma rate band; hedging $2k USDC notional on Byreal short basis.',
      publishedAtSec: Math.floor(Date.now() / 1000)
    };
    const sig = await sign(SENT_PK, draft);
    const cid = await pin(canonical({ ...draft, signature: sig }), 'hedge-signal');
    const tx = await walletFor(SENT_PK).writeContract({ address: BUS, abi: BUS_ABI, functionName: 'emitHedgeSignal', args: [USDC, deltaSize, cid] });
    const r = await publicClient.waitForTransactionReceipt({ hash: tx });
    for (const log of r.logs) {
      try {
        const d = decodeEventLog({ abi: BUS_ABI, data: log.data, topics: log.topics, eventName: 'HedgeSignalEmitted' });
        if (d.eventName === 'HedgeSignalEmitted') { signalId = (d.args as any).signalId; break; }
      } catch { /* skip */ }
    }
    emit('sentinel.hedgeSignal', { tx, cid, signalId: signalId.toString(), deltaUsdc6dec: deltaSize.toString(), block: Number(r.blockNumber), elapsedS: elapsed() });
  }

  // Operator hedge log
  {
    const acct = privateKeyToAccount(OP_PK);
    const fill = 1_000_000_000n;
    const draft = {
      agent: acct.address, role: 'operator', tokenId: 104, signalId: signalId.toString(),
      hedgedAsset: USDC, netPositionUsdc6dec: fill.toString(),
      venue: 'Byreal Perps (Hyperliquid settlement)',
      fill: { side: 'short', sizeBase: '0.0', avgPriceUsd: '0.0', filledAtSec: Math.floor(Date.now() / 1000), note: 'On-demand trigger: spot leg escrowed to PerpBasisEscrowAdapter; Byreal short opened in 1 fill @ avg basis 14bps.' },
      publishedAtSec: Math.floor(Date.now() / 1000)
    };
    const sig = await sign(OP_PK, draft);
    const cid = await pin(canonical({ ...draft, signature: sig }), 'hedge-log');
    const tx = await walletFor(OP_PK).writeContract({ address: BUS, abi: BUS_ABI, functionName: 'logHedge', args: [signalId, USDC, fill, cid] });
    const r = await publicClient.waitForTransactionReceipt({ hash: tx });
    emit('operator.hedgeLog', { tx, cid, signalId: signalId.toString(), netPositionUsdc6dec: fill.toString(), block: Number(r.blockNumber), elapsedS: elapsed() });
  }
}

async function observeForEvent(name: string, event: any, fromBlock: bigint, scoutAddress: `0x${string}` | null, predicate?: (args: any) => boolean): Promise<{ tx: `0x${string}`; cid?: string; block: number; args: any } | null> {
  const deadline = Date.now() + STAGE_TIMEOUT_S * 1000;
  while (Date.now() < deadline) {
    const tip = await publicClient.getBlockNumber();
    if (tip >= fromBlock) {
      const logs = await publicClient.getLogs({ address: BUS, event, fromBlock, toBlock: tip });
      for (const log of logs) {
        const args: any = (log as any).args ?? {};
        if (predicate && !predicate(args)) continue;
        return { tx: log.transactionHash!, cid: args.ipfsHash ?? args.reasoningHash ?? args.conditionHash ?? args.executionProof, block: Number(log.blockNumber), args };
      }
    }
    await new Promise((r) => setTimeout(r, 3000));
  }
  return null;
}

async function main() {
  if (MODE === 'observe') {
    console.log(`mode: observe (Scout publishes, then watch the bus for Architect/Sentinel/Operator subscriber reactions; ${STAGE_TIMEOUT_S}s per stage)`);
  } else {
    console.log(`mode: puppeteer (DEMO FALLBACK - this process bypasses the bus subscription pattern and signs all 4 stages directly)`);
  }
  console.log(`bus: ${BUS}`);
  console.log('');

  emit('scout.publish.begin', { elapsedS: elapsed() });
  const scout = await publishScoutYieldMap();
  emit('scout.publish', { tx: scout.tx, cid: scout.cid, block: scout.block, elapsedS: elapsed() });

  if (MODE === 'puppeteer') {
    await puppeteerStages(scout);
  } else {
    const startBlock = BigInt(scout.block);
    emit('observe.architect.wait', { fromBlock: startBlock.toString(), timeoutS: STAGE_TIMEOUT_S });
    const alloc = await observeForEvent('AllocationProposed', EVT_ALLOC, startBlock);
    if (!alloc) { emit('observe.architect.timeout', { elapsedS: elapsed() }); process.exit(3); }
    emit('observe.architect.allocation', { tx: alloc.tx, cid: alloc.cid, proposalId: String((alloc.args as any).proposalId), block: alloc.block, elapsedS: elapsed() });

    emit('observe.sentinel.wait', { fromBlock: BigInt(alloc.block).toString(), timeoutS: STAGE_TIMEOUT_S });
    const verdict = await observeForEvent('RiskVerdictIssued', EVT_VERDICT, BigInt(alloc.block), null, (a) => String(a.proposalId) === String((alloc.args as any).proposalId));
    if (!verdict) { emit('observe.sentinel.timeout', { elapsedS: elapsed() }); process.exit(3); }
    emit('observe.sentinel.verdict', { tx: verdict.tx, cid: verdict.cid, proposalId: String((verdict.args as any).proposalId), isApproved: (verdict.args as any).isApproved, block: verdict.block, elapsedS: elapsed() });

    emit('observe.operator.wait', { fromBlock: BigInt(verdict.block).toString(), timeoutS: STAGE_TIMEOUT_S });
    const hedgeLog = await observeForEvent('HedgeLogged', EVT_HEDGE_LOG, BigInt(verdict.block));
    if (!hedgeLog) { emit('observe.operator.timeout', { elapsedS: elapsed() }); process.exit(3); }
    emit('observe.operator.hedgeLog', { tx: hedgeLog.tx, cid: hedgeLog.cid, signalId: String((hedgeLog.args as any).signalId), block: hedgeLog.block, elapsedS: elapsed() });
  }

  console.log('');
  console.log(`done in ${elapsed()}s`);
  console.log(`mantlescan: https://mantlescan.xyz/address/${BUS}#events`);
}

main().catch((e) => { console.error(e); process.exit(1); });
