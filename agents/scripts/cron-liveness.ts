// Read-only liveness probe for the agent cron on Mantle.
//
// Asks the AgentEventBus: when did each event type last fire, and what is the gap
// between consecutive fires? Lets you confirm the cron interval matches what Railway
// is configured for and that no agent has silently stopped.
//
// Usage:
//   pnpm tsx agents/scripts/cron-liveness.ts            (default: 24h lookback)
//   pnpm tsx agents/scripts/cron-liveness.ts --hours 72 (longer history)
//
// No keys required. Reads only.

import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { createPublicClient, http, parseAbiItem, type Log } from 'viem';
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
loadEnv(join(ROOT, 'scout', '.env'));

const RPC = process.env.MANTLE_RPC_URL ?? 'https://rpc.mantle.xyz';
const BUS = (process.env.AGENT_EVENT_BUS_ADDRESS ?? '0x0E6F30bC6D9b08cD20d422D634d565d3300D0A62') as `0x${string}`;
function numArg(name: string, fallback: number): number {
  const eq = process.argv.find((a) => a.startsWith(`${name}=`))?.split('=')[1];
  if (eq !== undefined) return Number(eq);
  const i = process.argv.indexOf(name);
  if (i >= 0 && i + 1 < process.argv.length) return Number(process.argv[i + 1]);
  return fallback;
}
const HOURS = numArg('--hours', 24);
const MANTLE_BLOCK_TIME_S = 2;

const EVENTS = {
  YieldMapPublished:     parseAbiItem('event YieldMapPublished(address indexed agent, string ipfsHash, uint256 timestamp)'),
  AllocationProposed:    parseAbiItem('event AllocationProposed(uint256 indexed proposalId, address indexed agent, uint256 seniorBps, uint256 mezzBps, uint256 juniorBps, string reasoningHash)'),
  RiskVerdictIssued:     parseAbiItem('event RiskVerdictIssued(uint256 indexed proposalId, address indexed agent, bool isApproved, string conditionHash)'),
  HedgeSignalEmitted:    parseAbiItem('event HedgeSignalEmitted(uint256 indexed signalId, address indexed agent, address indexed underlyingAsset, int256 deltaSize, string reasoningHash)'),
  HedgeLogged:           parseAbiItem('event HedgeLogged(uint256 indexed signalId, address indexed agent, address indexed hedgedAsset, int256 netPosition, string executionProof)'),
  AssetRiskRated:        parseAbiItem('event AssetRiskRated(uint256 indexed proposalId, uint8 indexed trancheId, address indexed asset, uint8 rating, string noteCid)')
};

const client = createPublicClient({ chain: mantle, transport: http(RPC) });

function ageString(seconds: number): string {
  if (seconds < 60) return `${seconds}s`;
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m`;
  if (seconds < 86400) return `${(seconds / 3600).toFixed(1)}h`;
  return `${(seconds / 86400).toFixed(1)}d`;
}

async function blockTimestamp(blockNumber: bigint): Promise<number> {
  const b = await client.getBlock({ blockNumber });
  return Number(b.timestamp);
}

const MAX_RANGE = 10_000n;
const CHUNK_SLEEP_MS = 250;

async function sleep(ms: number) { return new Promise((r) => setTimeout(r, ms)); }

async function getLogsChunked(event: any, fromBlock: bigint, toBlock: bigint): Promise<Log[]> {
  const out: Log[] = [];
  let cursor = fromBlock;
  let backoffMs = 500;
  while (cursor <= toBlock) {
    const end = cursor + MAX_RANGE - 1n > toBlock ? toBlock : cursor + MAX_RANGE - 1n;
    try {
      const chunk = await client.getLogs({ address: BUS, event, fromBlock: cursor, toBlock: end });
      out.push(...chunk);
      cursor = end + 1n;
      backoffMs = 500;
      await sleep(CHUNK_SLEEP_MS);
    } catch (e: any) {
      const msg = String(e?.details ?? e?.message ?? '');
      if (msg.includes('rate limit')) {
        await sleep(backoffMs);
        backoffMs = Math.min(backoffMs * 2, 8000);
        continue;
      }
      throw e;
    }
  }
  return out;
}

async function probeOne(name: string, event: any, fromBlock: bigint, toBlock: bigint, nowSec: number) {
  const logs = await getLogsChunked(event, fromBlock, toBlock);
  if (logs.length === 0) {
    return { name, count: 0, lastAgeS: null, gaps: [], status: 'STALE' as const };
  }
  const lastTs = await blockTimestamp(logs[logs.length - 1].blockNumber!);
  const lastAgeS = nowSec - lastTs;
  const lastFew = logs.slice(-6);
  const ts = await Promise.all(lastFew.map((l) => blockTimestamp(l.blockNumber!)));
  const gaps: number[] = [];
  for (let i = 1; i < ts.length; i++) gaps.push(ts[i] - ts[i - 1]);
  return { name, count: logs.length, lastAgeS, gaps, status: 'LIVE' as const };
}

async function main() {
  const tip = await client.getBlockNumber();
  const lookbackBlocks = BigInt(Math.ceil((HOURS * 3600) / MANTLE_BLOCK_TIME_S));
  const fromBlock = tip > lookbackBlocks ? tip - lookbackBlocks : 0n;
  const nowSec = Math.floor(Date.now() / 1000);

  console.log(`bus       : ${BUS}`);
  console.log(`rpc       : ${RPC}`);
  console.log(`window    : last ${HOURS}h (block ${fromBlock} -> ${tip})`);
  console.log('');
  console.log('event                  count   last fire   typical gap (last few)   status');
  console.log('-----------------------------------------------------------------------------');

  const results = [];
  for (const [name, event] of Object.entries(EVENTS)) {
    const r = await probeOne(name, event, fromBlock, tip, nowSec);
    results.push(r);
    const last = r.lastAgeS === null ? 'never' : ageString(r.lastAgeS);
    const gapStr = r.gaps.length ? r.gaps.map((g) => ageString(g)).join(', ') : '-';
    const padName = name.padEnd(22);
    const padCount = String(r.count).padStart(5);
    const padLast = last.padEnd(11);
    console.log(`${padName} ${padCount}   ${padLast} ${gapStr.padEnd(24)} ${r.status}`);
  }

  console.log('');
  const yieldMap = results.find((r) => r.name === 'YieldMapPublished');
  const alloc = results.find((r) => r.name === 'AllocationProposed');
  const verdict = results.find((r) => r.name === 'RiskVerdictIssued');
  const hedgeLog = results.find((r) => r.name === 'HedgeLogged');

  console.log('architecture: Scout is the only cron-driven agent. Architect, Sentinel, Operator are bus subscribers.');
  console.log('');
  console.log('Scout cron (publishes YieldMapPublished):');
  if (yieldMap && yieldMap.gaps.length >= 2) {
    const avgGap = yieldMap.gaps.reduce((a, b) => a + b, 0) / yieldMap.gaps.length;
    console.log(`  interval (inferred): ~${ageString(Math.round(avgGap))}, last fire: ${yieldMap.lastAgeS ? ageString(yieldMap.lastAgeS) : 'never'} ago`);
  } else if (yieldMap) {
    console.log(`  fires in window: ${yieldMap.count}, last fire: ${yieldMap.lastAgeS ? ageString(yieldMap.lastAgeS) : 'never'} ago (need >=3 fires to infer interval)`);
  }

  console.log('Subscriber reaction rate (each vs its own upstream event):');
  const yieldCount = yieldMap?.count ?? 0;
  const hedgeSignal = results.find((r) => r.name === 'HedgeSignalEmitted');
  function reactionLine(name: string, ownerEvent: any, listensFor: string, upstreamCount: number) {
    if (!ownerEvent) return;
    const missed = Math.max(0, upstreamCount - ownerEvent.count);
    const last = ownerEvent.lastAgeS ? ageString(ownerEvent.lastAgeS) : 'never';
    console.log(`  ${name.padEnd(10)} (listens for ${listensFor}): ${ownerEvent.count}/${upstreamCount} reactions, last: ${last} ago${missed > 0 ? ` MISSED ${missed}` : ''}`);
  }
  reactionLine('Architect', alloc,      'YieldMapPublished',  yieldCount);
  reactionLine('Sentinel',  verdict,    'AllocationProposed', alloc?.count ?? 0);
  reactionLine('Operator',  hedgeLog,   'HedgeSignalEmitted', hedgeSignal?.count ?? 0);

  console.log('');
  const stalenessOk = yieldMap?.lastAgeS !== null && (yieldMap?.lastAgeS ?? Infinity) < 6 * 3600;
  const reactionsHealthy = yieldCount === 0 || (alloc && verdict && hedgeLog && alloc.count === yieldCount && verdict.count === yieldCount && hedgeLog.count === yieldCount);
  const allOk = stalenessOk && reactionsHealthy;
  console.log(allOk ? 'overall: HEALTHY' : 'overall: ATTENTION');

  if (yieldMap && yieldMap.lastAgeS !== null && yieldMap.lastAgeS > 6 * 3600) {
    console.log(`  - Scout cron stale: ${ageString(yieldMap.lastAgeS)} since last fire. Restart Scout on Railway.`);
  }
  if (yieldCount > 0 && alloc && alloc.count < yieldCount) {
    console.log(`  - Architect listener missed ${yieldCount - alloc.count}/${yieldCount} Scout fires. Restart Architect on Railway.`);
  }
  if (yieldCount > 0 && verdict && verdict.count < (alloc?.count ?? yieldCount)) {
    console.log(`  - Sentinel listener missed ${(alloc?.count ?? yieldCount) - verdict.count} of Architect's allocations. Restart Sentinel on Railway.`);
  }
  if (yieldCount > 0 && hedgeLog && hedgeLog.count < (verdict?.count ?? yieldCount)) {
    console.log(`  - Operator listener missed hedge signals. Restart Operator on Railway.`);
  }
}

main().catch((e) => { console.error(e); process.exit(1); });
