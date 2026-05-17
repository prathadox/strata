import { describe, it, expect } from 'vitest';
import { scoreOpportunity, SCORING_CONSTANTS } from '../../src/pipeline/scoring.js';
import type { YieldOpportunity, RiskFactors } from '../../src/types.js';

const seniorOpp: YieldOpportunity = {
  id: 'aave:usdc', source: 'aave', asset: '0x' + 'a'.repeat(40),
  apy: 0.05, apyType: 'variable', tvlUsd: 50_000_000,
  lastUpdatedMs: Date.now(), raw: {}
};

const smallOpp: YieldOpportunity = { ...seniorOpp, id: 'aave:small', tvlUsd: 500_000 };

const fullRisk: RiskFactors = {
  contractAgeDays: 730, auditFactor: 0.30, tvlFactor: null,
  depegEvents: [], oracleType: 'chainlink_dec',
  liquiditySlippageBps: null, counterpartyClass: 'permissionless',
  smartMoneySignal: null
};

const allNullRisk: RiskFactors = {
  contractAgeDays: null, auditFactor: null, tvlFactor: null,
  depegEvents: null, oracleType: null,
  liquiditySlippageBps: null, counterpartyClass: null, smartMoneySignal: null
};

describe('scoreOpportunity', () => {
  it('senior-grade stablecoin scores positively with low expected loss', () => {
    const s = scoreOpportunity(seniorOpp, fullRisk);
    expect(s.raapy).toBeGreaterThan(0.04);
    expect(s.score).toBeGreaterThan(0);
    expect(s.expectedLoss).toBeLessThan(0.01);
  });

  it('new unaudited small-TVL contract has elevated p_exploit', () => {
    const risk: RiskFactors = { ...fullRisk, contractAgeDays: 10, auditFactor: 1.0 };
    const s = scoreOpportunity(smallOpp, risk);
    expect(s.probabilities.exploit).toBeGreaterThan(0.20);
  });

  it('missing enrichment lowers confidence', () => {
    const s = scoreOpportunity(seniorOpp, allNullRisk);
    expect(s.confidence).toBeLessThan(0.4);
  });

  it('p_illiquid uses TVL proxy: higher TVL → lower p_illiquid', () => {
    const big = scoreOpportunity(seniorOpp, fullRisk);                                            // tvl=50M
    const small = scoreOpportunity({ ...seniorOpp, tvlUsd: 1_000 }, fullRisk);                    // tvl=1K
    expect(big.probabilities.illiquid).toBeLessThan(small.probabilities.illiquid);
  });

  it('initialises tranche tags empty (aggregation populates later)', () => {
    const s = scoreOpportunity(seniorOpp, fullRisk);
    expect(s.eligibleTranches).toEqual([]);
    expect(s.primaryTranche).toBeNull();
    expect(s.rejectionReasons).toEqual([]);
  });

  it('constants snapshot is stable', () => {
    expect(SCORING_CONSTANTS).toMatchSnapshot();
  });
});
