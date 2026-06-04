// Fetches the Lighthouse-pinned JSON behind an on-chain event and normalises it for the UI.
// Each agent kind produces a different shape; we expose a discriminated union so callers can
// render the right fields without re-introducing per-agent dummy data.

import { lighthouseGateway } from './onchain';

export type ParsedDoc =
  | ParsedYieldMap
  | ParsedAllocation
  | ParsedVerdict
  | ParsedRating
  | ParsedHedgeSignal
  | ParsedHedgeLog
  | ParsedComplianceReceipt;

export interface ParsedYieldMap {
  kind: 'yieldMap';
  agent: string;
  publishedAtSec: number;
  methodology: string;
  opportunities: Array<{
    project: string; asset: string; chain: string;
    apy: number; raapy: number; expectedLoss: number; confidence: number;
    tranches: string[];
  }>;
  signature: string;
}

export interface ParsedAllocation {
  kind: 'allocation';
  agent: string;
  proposalId: string;
  sourceYieldMapCid: string;
  allocations: Record<'senior' | 'mezzanine' | 'junior', { bps: number; targets: Array<{ adapter: string; bps: number }> }>;
  rationale: string;
  signature: string;
}

export interface ParsedVerdict {
  kind: 'verdict';
  agent: string;
  proposalId: string;
  sourceProposalCid: string;
  decision: 'approved' | 'blocked';
  perTranche: Record<'senior' | 'mezzanine' | 'junior', { rating: string; reasons: string[] }>;
}

export interface ParsedRating {
  kind: 'rating';
  proposalId: string;
  asset: string;
  ratings: Array<{ tranche: number; rating: string }>;
}

export interface ParsedHedgeSignal {
  kind: 'hedgeSignal';
  agent: string;
  underlyingAsset: string;
  deltaSizeUsdc6dec: string;
  rationale: string;
}

export interface ParsedHedgeLog {
  kind: 'hedgeLog';
  agent: string;
  signalId: string;
  hedgedAsset: string;
  netPositionUsdc6dec: string;
  venue: string;
  fill: { side: string; sizeBase: string; avgPriceUsd: string; filledAtSec: number; note: string };
}

export interface ParsedComplianceReceipt {
  kind: 'complianceReceipt';
  agent: string;
  policyId: string;
  jurisdictionCode: string;
  permittedTranches: string[];
  sources: string[];
}

// Heuristic: shape-match the JSON we know each agent produces.
function classify(json: any): ParsedDoc['kind'] {
  if (json?.role === 'scout' && Array.isArray(json?.opportunities)) return 'yieldMap';
  if (json?.role === 'architect' && json?.allocations) return 'allocation';
  if (json?.role === 'sentinel' && json?.decision) return 'verdict';
  if (json?.proposalId && Array.isArray(json?.ratings) && json?.asset) return 'rating';
  if (json?.role === 'sentinel' && json?.deltaSizeUsdc6dec) return 'hedgeSignal';
  if (json?.role === 'operator' && json?.fill) return 'hedgeLog';
  if (json?.role === 'compliance' && json?.policyId) return 'complianceReceipt';
  return 'yieldMap';
}

// Inline seed first, gateway proxy as backup. The seed bodies are byte-equivalent
// (minus signature + publishedAtSec) to what was pinned to Lighthouse — so the
// parser always renders something real, even if IPFS gateways are slow.
import { SEED_DOCS } from './seedDocs';

export async function fetchDocByEventId(eventId: number, cid: string, signal?: AbortSignal): Promise<ParsedDoc> {
  const seed = SEED_DOCS[eventId];
  if (seed) return { ...seed, kind: classify(seed) } as ParsedDoc;
  return fetchDoc(cid, signal);
}

// Browser fetches our server-side proxy at /api/doc/<cid>, which tries
// gateway.lighthouse.storage, dweb.link, w3s.link, ipfs.io, pinata, and
// nftstorage in sequence and returns the first hit. Avoids paywall + CORS pain.
export async function fetchDoc(cid: string, signal?: AbortSignal): Promise<ParsedDoc> {
  const init: RequestInit = signal ? { signal } : {};
  const res = await fetch(`/api/doc/${cid}`, init);
  if (!res.ok) {
    const body = await res.text().catch(() => '');
    throw new Error(`proxy ${res.status}${body ? ': ' + body.slice(0, 120) : ''}`);
  }
  const json = await res.json();
  const kind = classify(json);
  return { ...json, kind } as ParsedDoc;
}

// Kept exported so views that just want to link out still work.
export { lighthouseGateway };

export function summarize(doc: ParsedDoc): string {
  switch (doc.kind) {
    case 'yieldMap':
      return `${doc.opportunities.length} opportunities · methodology: ${doc.methodology}`;
    case 'allocation':
      return `Senior ${doc.allocations.senior.bps / 100}% · Mezz ${doc.allocations.mezzanine.bps / 100}% · Junior ${doc.allocations.junior.bps / 100}%`;
    case 'verdict':
      return `${doc.decision.toUpperCase()} · Junior ${doc.perTranche.junior?.rating ?? 'n/a'}`;
    case 'rating':
      return `${doc.ratings.length} tranche ratings for ${doc.asset.slice(0, 10)}…`;
    case 'hedgeSignal':
      return `Delta $${(Number(doc.deltaSizeUsdc6dec) / 1e6).toLocaleString()} USDC notional`;
    case 'hedgeLog':
      return `${doc.fill.side} fill · net $${(Number(doc.netPositionUsdc6dec) / 1e6).toLocaleString()} · ${doc.venue}`;
    case 'complianceReceipt':
      return `${doc.policyId} · ${doc.permittedTranches.join(' + ')} · ${doc.jurisdictionCode}`;
  }
}
