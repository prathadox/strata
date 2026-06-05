// Verify public-gateway reachability for all 35 Strata CIDs:
//   - 25 cycle docs from apps/web/src/lib/seedDocs.ts (via REAL_EVENT_CIDS)
//   - 10 strategy + methodology pins from the per-agent upload-strategy.ts runs
//
// One-shot. No loop. Run with: pnpm tsx agents/scripts/verify-public-access.ts
//
// Per CID: tries gateway.lighthouse.storage, then w3s.link, then ipfs.io (8s timeout each).
// Prints one JSON line per CID, then a summary line. Exit 0 if all reachable, 1 otherwise.

import { REAL_EVENT_CIDS } from '../../apps/web/src/lib/realEvents.js';

// TODO: read from ERC-8004 Identity Registry once stream 7 lands. The dashboard config in
// apps/web/src/lib/onchain.ts currently shows truncated display strings (e.g. bafybeih...scout412),
// not full CIDs, because the per-agent scripts/upload-strategy.ts has not been re-run under the
// public-readable Lighthouse account yet. Fill these in from that script's stdout once it runs.
type StrategyEntry = { source: string; cid: string };
const STRATEGY_CIDS: StrategyEntry[] = [
  { source: 'strategy:scout',           cid: '' },
  { source: 'methodology:scout',        cid: '' },
  { source: 'strategy:architect',       cid: '' },
  { source: 'methodology:architect',    cid: '' },
  { source: 'strategy:sentinel',        cid: '' },
  { source: 'methodology:sentinel',     cid: '' },
  { source: 'strategy:operator',        cid: '' },
  { source: 'methodology:operator',     cid: '' },
  { source: 'strategy:compliance',      cid: '' },
  { source: 'methodology:compliance',   cid: '' }
];

const GATEWAYS = [
  { key: 'lighthouse', url: (cid: string) => `https://gateway.lighthouse.storage/ipfs/${cid}` },
  { key: 'w3s',        url: (cid: string) => `https://w3s.link/ipfs/${cid}` },
  { key: 'ipfs',       url: (cid: string) => `https://ipfs.io/ipfs/${cid}` }
] as const;

const TIMEOUT_MS = 8_000;

type GatewayResult = number | 'timeout' | 'error';

async function fetchStatus(url: string): Promise<GatewayResult> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    const res = await fetch(url, { method: 'GET', signal: controller.signal });
    // Drain to release the connection. We only care about the status code.
    try { await res.arrayBuffer(); } catch { /* ignore */ }
    return res.status;
  } catch (err) {
    if (err instanceof Error && err.name === 'AbortError') return 'timeout';
    return 'error';
  } finally {
    clearTimeout(timer);
  }
}

type Row = {
  cid: string;
  source: string;
  lighthouse: GatewayResult | 'skipped';
  w3s: GatewayResult | 'skipped';
  ipfs: GatewayResult | 'skipped';
  anyReachable: boolean;
};

async function checkCid(cid: string, source: string): Promise<Row> {
  if (!cid) {
    return { cid: '', source, lighthouse: 'skipped', w3s: 'skipped', ipfs: 'skipped', anyReachable: false };
  }
  const results: { lighthouse: GatewayResult | 'skipped'; w3s: GatewayResult | 'skipped'; ipfs: GatewayResult | 'skipped' } = {
    lighthouse: 'skipped',
    w3s: 'skipped',
    ipfs: 'skipped'
  };
  let anyReachable = false;
  for (const g of GATEWAYS) {
    if (anyReachable) break;
    const status = await fetchStatus(g.url(cid));
    results[g.key] = status;
    if (status === 200) anyReachable = true;
  }
  return {
    cid,
    source,
    lighthouse: results.lighthouse,
    w3s: results.w3s,
    ipfs: results.ipfs,
    anyReachable
  };
}

async function main(): Promise<void> {
  const cidEntries: { cid: string; source: string }[] = [];

  const seedIndices = Object.keys(REAL_EVENT_CIDS).map((k) => Number(k)).sort((a, b) => a - b);
  for (const i of seedIndices) {
    cidEntries.push({ cid: REAL_EVENT_CIDS[i] ?? '', source: `seedDocs#${i}` });
  }
  for (const s of STRATEGY_CIDS) {
    cidEntries.push({ cid: s.cid, source: s.source });
  }

  let lighthouseReachable = 0;
  let anyReachable = 0;
  let fullyUnreachable = 0;

  for (const entry of cidEntries) {
    const row = await checkCid(entry.cid, entry.source);
    console.log(JSON.stringify(row));
    if (row.lighthouse === 200) lighthouseReachable++;
    if (row.anyReachable) anyReachable++;
    else fullyUnreachable++;
  }

  const summary = {
    total: cidEntries.length,
    lighthouseReachable,
    anyReachable,
    fullyUnreachable
  };
  console.log(JSON.stringify(summary));

  process.exit(fullyUnreachable === 0 ? 0 : 1);
}

main().catch((err) => {
  process.stderr.write(`verify-public-access failed: ${err instanceof Error ? err.message : String(err)}\n`);
  process.exit(1);
});
