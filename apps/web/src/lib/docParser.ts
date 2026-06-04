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

export async function fetchDoc(cid: string, signal?: AbortSignal): Promise<ParsedDoc> {
  const init: RequestInit = signal ? { signal } : {};
  const res = await fetch(lighthouseGateway(cid), init);
  if (!res.ok) throw new Error(`Lighthouse ${res.status} for ${cid}`);
  const json = await res.json();
  const kind = classify(json);
  return { ...json, kind } as ParsedDoc;
}

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
