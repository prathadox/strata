import type { ScoredOpportunity, Tranche } from '../types.js';

export const MANDATES = {
  senior:    { maxExpectedLoss: 0.01, maxPExploit: 0.05, maxPDepeg: 0.01, minTvlUsd: 50_000_000 },
  mezzanine: { maxExpectedLoss: 0.04, maxPExploit: 0.15, maxPDepeg: 0.05, minTvlUsd:  5_000_000 },
  junior:    { maxExpectedLoss: 0.15, maxPExploit: 1.00, maxPDepeg: 1.00, minTvlUsd:    100_000 }
} as const;

const TRANCHE_ORDER: Tranche[] = ['senior', 'mezzanine', 'junior'];

type Mandate = { maxExpectedLoss: number; maxPExploit: number; maxPDepeg: number; minTvlUsd: number };

function reasonsFailing(o: ScoredOpportunity, m: Mandate): string[] {
  const r: string[] = [];
  if (o.expectedLoss > m.maxExpectedLoss)         r.push(`expectedLoss ${o.expectedLoss.toFixed(4)} > ${m.maxExpectedLoss}`);
  if (o.probabilities.exploit > m.maxPExploit)    r.push(`pExploit ${o.probabilities.exploit.toFixed(4)} > ${m.maxPExploit}`);
  if (o.probabilities.depeg > m.maxPDepeg)        r.push(`pDepeg ${o.probabilities.depeg.toFixed(4)} > ${m.maxPDepeg}`);
  if (o.tvlUsd < m.minTvlUsd)                     r.push(`tvlUsd ${o.tvlUsd.toFixed(0)} < ${m.minTvlUsd}`);
  return r;
}

export interface AggregateResult {
  tagged: ScoredOpportunity[];
  perTranche: { senior: string[]; mezzanine: string[]; junior: string[] };
}

export function aggregate(opportunities: ScoredOpportunity[]): AggregateResult {
  const tagged: ScoredOpportunity[] = opportunities.map((o) => {
    const eligibleTranches: Tranche[] = [];
    const rejectionReasons: ScoredOpportunity['rejectionReasons'] = [];
    for (const t of TRANCHE_ORDER) {
      const failed = reasonsFailing(o, MANDATES[t]);
      if (failed.length === 0) eligibleTranches.push(t);
      else rejectionReasons.push({ tranche: t, reasons: failed });
    }
    const primaryTranche = eligibleTranches[0] ?? null;
    return { ...o, eligibleTranches, primaryTranche, rejectionReasons };
  });

  const sortByScore = (a: ScoredOpportunity, b: ScoredOpportunity) => b.score - a.score;
  const sorted = [...tagged].sort(sortByScore);
  const perTranche = {
    senior:    sorted.filter((o) => o.eligibleTranches.includes('senior')).map((o) => o.id),
    mezzanine: sorted.filter((o) => o.eligibleTranches.includes('mezzanine')).map((o) => o.id),
    junior:    sorted.filter((o) => o.eligibleTranches.includes('junior')).map((o) => o.id)
  };
  return { tagged, perTranche };
}
