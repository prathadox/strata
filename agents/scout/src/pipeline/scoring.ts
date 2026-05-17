import type { YieldOpportunity, ScoredOpportunity, RiskFactors } from '../types.js';

export const SCORING_CONSTANTS = Object.freeze({
  alphas: { exploit: 0.85, depeg: 0.20, oracle: 0.40, illiquid: 0.05, counterparty: 0.50 },
  baseExploit: 0.30,
  exploitHalfLifeDays: 180,
  oracleP: { chainlink_dec: 0.002, pyth: 0.005, redstone: 0.007, custom_multi: 0.02, single: 0.10 },
  counterpartyP: { permissionless: 0.005, attested_centralized: 0.03, custodial: 0.08 },
  freshnessHalfLifeMs: 300_000,
  enrichmentFields: 8,
  illiquid: { base: 0.10, slope: 0.01, min: 0.001, max: 0.20 }
});

function pExploit(r: RiskFactors, tvlUsd: number): number {
  if (r.contractAgeDays === null) return 0.30;
  const base = SCORING_CONSTANTS.baseExploit * Math.exp(-r.contractAgeDays / SCORING_CONSTANTS.exploitHalfLifeDays);
  const audit = r.auditFactor ?? 1.0;
  const tvl = Math.max(0.5, Math.min(1.5, 1.5 - Math.log10(Math.max(tvlUsd, 1)) / 8));
  let p = base * audit * tvl;
  if (r.smartMoneySignal && r.smartMoneySignal.smartHolderPct < 0.05 && r.smartMoneySignal.freshWalletInflowPct > 0.5) {
    p = Math.min(1.0, p + 0.05);
  }
  return Math.min(1.0, p);
}

function pDepeg(r: RiskFactors): number {
  if (!r.depegEvents) return 0.05;
  if (r.depegEvents.length === 0) return 0.005;
  const windowDays = 365;
  let agg = 0;
  for (const ev of r.depegEvents) {
    agg += ev.maxDeviation * (1 / Math.max(1, (ev.recoveryHours ?? 24) / 24));
  }
  return Math.min(1.0, agg / windowDays);
}

function pOracle(r: RiskFactors): number {
  if (!r.oracleType) return 0.05;
  return SCORING_CONSTANTS.oracleP[r.oracleType];
}

function pIlliquidFromTvl(tvlUsd: number): number {
  const c = SCORING_CONSTANTS.illiquid;
  // formula: p = base − log10(tvl) * slope  →  0.10 − log10(tvl) * 0.10  →  0.10 − log10(tvl)/10
  const raw = c.base - Math.log10(Math.max(tvlUsd, 1)) * c.slope;
  return Math.max(c.min, Math.min(c.max, raw));
}

function pCounterparty(r: RiskFactors): number {
  if (!r.counterpartyClass) return 0.03;
  return SCORING_CONSTANTS.counterpartyP[r.counterpartyClass];
}

export function scoreOpportunity(opp: YieldOpportunity, risk: RiskFactors): ScoredOpportunity {
  const probabilities = {
    exploit: pExploit(risk, opp.tvlUsd),
    depeg: pDepeg(risk),
    oracle: pOracle(risk),
    illiquid: pIlliquidFromTvl(opp.tvlUsd),
    counterparty: pCounterparty(risk)
  };
  const a = SCORING_CONSTANTS.alphas;
  const expectedLoss =
    probabilities.exploit * a.exploit +
    probabilities.depeg * a.depeg +
    probabilities.oracle * a.oracle +
    probabilities.illiquid * a.illiquid +
    probabilities.counterparty * a.counterparty;
  const raapy = opp.apy - expectedLoss;

  const populated = (Object.values(risk) as unknown[]).filter((v) => v !== null).length;
  const completeness = populated / SCORING_CONSTANTS.enrichmentFields;
  const staleness = Date.now() - opp.lastUpdatedMs;
  const freshness = Math.exp(-staleness / SCORING_CONSTANTS.freshnessHalfLifeMs);
  const confidence = Math.max(0, Math.min(1, freshness * completeness));

  return {
    ...opp,
    risk,
    probabilities,
    severities: a,
    expectedLoss,
    raapy,
    confidence,
    score: raapy * confidence,
    eligibleTranches: [],
    primaryTranche: null,
    rejectionReasons: []
  };
}
