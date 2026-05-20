import { describe, it, expect } from 'vitest';
import { aggregate, MANDATES } from '../../src/pipeline/aggregation.js';
import type { ScoredOpportunity } from '../../src/types.js';

const make = (id: string, raapy: number, expectedLoss: number, tvl: number, pe: number, pd: number): ScoredOpportunity => ({
  id, source: 'aave', asset: '0x' + 'a'.repeat(40),
  apy: raapy + expectedLoss, apyType: 'variable', tvlUsd: tvl, lastUpdatedMs: Date.now(), raw: {},
  risk: {
    contractAgeDays: 365, auditFactor: 0.3, tvlFactor: null, depegEvents: [],
    oracleType: 'chainlink_dec', liquiditySlippageBps: null, counterpartyClass: 'permissionless', smartMoneySignal: null
  },
  probabilities: { exploit: pe, depeg: pd, oracle: 0.002, illiquid: 0.005, counterparty: 0.005 },
  severities: { exploit: 0.85, depeg: 0.20, oracle: 0.40, illiquid: 0.05, counterparty: 0.50 },
  expectedLoss, raapy, confidence: 0.9, score: raapy * 0.9,
  eligibleTranches: [], primaryTranche: null, rejectionReasons: []
});

describe('aggregate', () => {
  it('partitions opportunities into senior/mezz/junior by mandate', () => {
    const safeBig  = make('safe-big', 0.05, 0.005, 100_000_000, 0.02, 0.005);
    const mid      = make('mid',      0.10, 0.03,  10_000_000, 0.10, 0.01);
    const junky    = make('junky',    0.30, 0.10,   1_000_000, 0.30, 0.05);
    const rejected = make('rejected', 0.50, 0.30,       1_000, 0.80, 0.20);
    const result = aggregate([safeBig, mid, junky, rejected]);

    expect(result.perTranche.senior).toEqual(['safe-big']);
    expect(result.perTranche.mezzanine).toContain('mid');
    expect(result.perTranche.junior).toContain('junky');
    expect(result.perTranche.senior).not.toContain('junky');
  });

  it('tags each opportunity with its eligible tranches and primary tranche (nested mandates)', () => {
    const safeBig = make('safe-big', 0.05, 0.005, 100_000_000, 0.02, 0.005);  // all 3
    const mid     = make('mid',      0.10, 0.03,  10_000_000, 0.10, 0.01);    // mezz + junior
    const junky   = make('junky',    0.30, 0.10,   1_000_000, 0.30, 0.05);    // junior only
    const { tagged } = aggregate([safeBig, mid, junky]);
    const byId = Object.fromEntries(tagged.map((o) => [o.id, o]));

    expect(byId['safe-big']!.eligibleTranches.sort()).toEqual(['junior', 'mezzanine', 'senior']);
    expect(byId['safe-big']!.primaryTranche).toBe('senior');
    expect(byId['mid']!.eligibleTranches.sort()).toEqual(['junior', 'mezzanine']);
    expect(byId['mid']!.primaryTranche).toBe('mezzanine');
    expect(byId['junky']!.eligibleTranches).toEqual(['junior']);
    expect(byId['junky']!.primaryTranche).toBe('junior');
  });

  it('records human-readable rejection reasons per tranche', () => {
    const rejected = make('rejected', 0.50, 0.30, 1_000, 0.80, 0.20);
    const [t] = aggregate([rejected]).tagged;
    expect(t!.eligibleTranches).toEqual([]);
    expect(t!.primaryTranche).toBeNull();
    const seniorReasons = t!.rejectionReasons.find((r) => r.tranche === 'senior')!.reasons;
    expect(seniorReasons.some((r) => r.includes('expectedLoss'))).toBe(true);
    expect(seniorReasons.some((r) => r.includes('tvlUsd'))).toBe(true);
  });

  it('sorts per-tranche lists by score descending', () => {
    const a = make('a', 0.30, 0.10, 1_000_000, 0.30, 0.05);  // score ≈ 0.27
    const b = make('b', 0.50, 0.10, 1_000_000, 0.30, 0.05);  // score ≈ 0.45
    expect(aggregate([a, b]).perTranche.junior).toEqual(['b', 'a']);
  });

  it('exports MANDATES with the senior/mezz/junior thresholds', () => {
    expect(MANDATES.senior.minTvlUsd).toBe(25_000_000);
    expect(MANDATES.mezzanine.minTvlUsd).toBe(300_000);
    expect(MANDATES.mezzanine.maxExpectedLoss).toBe(0.04);
    expect(MANDATES.junior.maxExpectedLoss).toBe(0.15);
  });
});
