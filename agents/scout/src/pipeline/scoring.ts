import type { YieldOpportunity, ScoredOpportunity, RiskFactors } from '../types.js';

export const SCORING_CONSTANTS = Object.freeze({
  alphas: { exploit: 0.85, depeg: 0.20, oracle: 0.40, illiquid: 0.05, counterparty: 0.50 },
  baseExploit: 0.30,
  exploitHalfLifeDays: 180,
  oracleP: { chainlink_dec: 0.002, pyth: 0.005, redstone: 0.007, custom_multi: 0.02, single: 0.10 },
  counterpartyP: { permissionless: 0.005, attested_centralized: 0.03, custodial: 0.08 },
  freshnessHalfLifeMs: 300_000,
  // Includes apyVolatility + apyDrift now (2 new fields), so denominator is 10 not 8.
  enrichmentFields: 10,
  illiquid: { base: 0.10, slope: 0.01, min: 0.001, max: 0.20 },
  // APY history shape thresholds.
  // High volatility (stddev of apyBase over 90d) above this cuts confidence.
  apyVolHighThreshold: 0.03,
  // Drift > this means recent-30d mean is more than 1.5x older-60d mean: APY is spiking.
  apyDriftSpikeThreshold: 1.5,
  // Multipliers applied to confidence when each flag fires.
  apyVolPenalty: 0.7,
  apyDriftPenalty: 0.7,
  // Nansen smart-money thresholds and effects.
  smartMoneyEndorsementPct: 0.20,  // smart holders own >20% of TVL: strong endorsement
  smartMoneyAbsentPct: 0.05,       // smart holders own <5%: absence flag
  freshWalletConcerning: 0.30,     // >30% inflows from <30d wallets: bad sign
  freshWalletSybil: 0.50,          // >50% paired with low smart-money: sybil farming
  // Multiplicative tweaks to p_exploit and confidence based on Nansen.
  exploitSybilBump: 0.05,
  exploitWashTradeBump: 0.10,
  exploitSmartMoneyDiscount: 0.5,  // smart-money endorsement halves p_exploit
  confSmartMoneyBoost: 1.2,        // capped by final clamp to [0,1]
  confSmartMoneyAbsentPenalty: 0.7,
  confWashTradePenalty: 0.5,
  confFreshWalletPenalty: 0.7
});

function pExploit(r: RiskFactors, tvlUsd: number): number {
  if (r.contractAgeDays === null) return 0.30;
  const base = SCORING_CONSTANTS.baseExploit * Math.exp(-r.contractAgeDays / SCORING_CONSTANTS.exploitHalfLifeDays);
  const audit = r.auditFactor ?? 1.0;
  const tvl = Math.max(0.5, Math.min(1.5, 1.5 - Math.log10(Math.max(tvlUsd, 1)) / 8));
  let p = base * audit * tvl;
  const sm = r.smartMoneySignal;
  if (sm) {
    // Sybil farming: small smart-money share + large fresh-wallet inflow share.
    if (sm.smartHolderPct < SCORING_CONSTANTS.smartMoneyAbsentPct
        && sm.freshWalletInflowPct > SCORING_CONSTANTS.freshWalletSybil) {
      p += SCORING_CONSTANTS.exploitSybilBump;
    }
    // Wash trading detected: bump exploit prob even if other signals are clean.
    if (sm.washTradeFlag) {
      p += SCORING_CONSTANTS.exploitWashTradeBump;
    }
    // Smart money endorsement: significant share held by Nansen-labeled sophisticated wallets.
    if (sm.smartHolderPct > SCORING_CONSTANTS.smartMoneyEndorsementPct) {
      p *= SCORING_CONSTANTS.exploitSmartMoneyDiscount;
    }
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
  // APY-history-derived confidence multipliers. High vol or recent spike both cut conf.
  let apyHealth = 1.0;
  if (risk.apyVolatility !== null && risk.apyVolatility > SCORING_CONSTANTS.apyVolHighThreshold) {
    apyHealth *= SCORING_CONSTANTS.apyVolPenalty;
  }
  if (risk.apyDrift !== null && risk.apyDrift > SCORING_CONSTANTS.apyDriftSpikeThreshold) {
    apyHealth *= SCORING_CONSTANTS.apyDriftPenalty;
  }
  // Nansen-derived confidence multipliers. Endorsement boosts, wash-trade / sybil / fresh-wallet penalize.
  let smartMoneyConf = 1.0;
  const sm = risk.smartMoneySignal;
  if (sm) {
    if (sm.smartHolderPct > SCORING_CONSTANTS.smartMoneyEndorsementPct) smartMoneyConf *= SCORING_CONSTANTS.confSmartMoneyBoost;
    if (sm.smartHolderPct < SCORING_CONSTANTS.smartMoneyAbsentPct)      smartMoneyConf *= SCORING_CONSTANTS.confSmartMoneyAbsentPenalty;
    if (sm.washTradeFlag)                                                smartMoneyConf *= SCORING_CONSTANTS.confWashTradePenalty;
    if (sm.freshWalletInflowPct > SCORING_CONSTANTS.freshWalletConcerning) smartMoneyConf *= SCORING_CONSTANTS.confFreshWalletPenalty;
  }
  const confidence = Math.max(0, Math.min(1, freshness * completeness * apyHealth * smartMoneyConf));

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
