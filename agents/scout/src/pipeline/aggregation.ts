import type { ScoredOpportunity, Tranche } from '../types.js';

// Mandate floors are calibrated to current Mantle TVL reality (May 2026: largest single
// Mantle pool is around $90M; Ondo USDY on Mantle is ~$29M). As the ecosystem grows,
// senior min-TVL should rise back toward 50M and mezz toward 5M.
//
// maxApy is a structural sanity cap, not a risk-math output: in DeFi, headline APY
// above 20% almost always reflects ephemeral incentives or hidden risk (IL, basis flip,
// exotic collateral) that our 5 failure-mode probabilities can't fully see. We force
// those into junior regardless of what the per-failure-mode math says.
// Mandate gates:
// - senior must hold real yield (not just reward emissions)
// - upper tranches reject the "too good to be true" headline APY range
// - Nansen wash-trade flag is a hard reject from senior + mezz (organic positions only)
export const MANDATES = {
  senior:    { maxExpectedLoss: 0.02, maxPExploit: 0.05, maxPDepeg: 0.01, minTvlUsd: 25_000_000, maxApy: 0.08,     minApy: 0.02, blockWashTraded: true },
  mezzanine: { maxExpectedLoss: 0.04, maxPExploit: 0.15, maxPDepeg: 0.05, minTvlUsd:    300_000, maxApy: 0.20,     minApy: 0.01, blockWashTraded: true },
  junior:    { maxExpectedLoss: 0.15, maxPExploit: 1.00, maxPDepeg: 1.00, minTvlUsd:    100_000, maxApy: Infinity, minApy: 0,    blockWashTraded: false }
} as const;

const TRANCHE_ORDER: Tranche[] = ['senior', 'mezzanine', 'junior'];

type Mandate = { maxExpectedLoss: number; maxPExploit: number; maxPDepeg: number; minTvlUsd: number; maxApy: number; minApy: number; blockWashTraded: boolean };

function reasonsFailing(o: ScoredOpportunity, m: Mandate): string[] {
  const r: string[] = [];
  if (o.expectedLoss > m.maxExpectedLoss)         r.push(`expectedLoss ${o.expectedLoss.toFixed(4)} > ${m.maxExpectedLoss}`);
  if (o.probabilities.exploit > m.maxPExploit)    r.push(`pExploit ${o.probabilities.exploit.toFixed(4)} > ${m.maxPExploit}`);
  if (o.probabilities.depeg > m.maxPDepeg)        r.push(`pDepeg ${o.probabilities.depeg.toFixed(4)} > ${m.maxPDepeg}`);
  if (o.tvlUsd < m.minTvlUsd)                     r.push(`tvlUsd ${o.tvlUsd.toFixed(0)} < ${m.minTvlUsd}`);
  if (o.apy > m.maxApy)                           r.push(`apy ${(o.apy * 100).toFixed(2)}% > ${(m.maxApy * 100).toFixed(0)}% (too-good-to-be-true gate)`);
  if (o.apy < m.minApy)                           r.push(`apyBase ${(o.apy * 100).toFixed(2)}% < ${(m.minApy * 100).toFixed(0)}% (reward-only positions blocked)`);
  if (m.blockWashTraded && o.risk.smartMoneySignal?.washTradeFlag)
    r.push('Nansen washTradeFlag set (blocked from senior + mezz)');
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
