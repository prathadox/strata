import { describe, it, expect } from 'vitest';
import type { ScoredOpportunity, Tranche, YieldMap } from '@strata/scout/types';
import { allocate, ALLOCATION_CONSTANTS } from '../../src/pipeline/allocate.js';

const STUB_ADDRESS = '0x0000000000000000000000000000000000000001' as const;

function makeOpp(id: string, score: number, tranches: Tranche[]): ScoredOpportunity {
  return {
    id,
    score,
    eligibleTranches: tranches,
    primaryTranche: tranches[0] ?? null,
    rejectionReasons: [],
    source: 'ondo',
    asset: STUB_ADDRESS,
    apy: 0.05,
    apyReward: 0,
    apyType: 'variable',
    tvlUsd: 1_000_000,
    lastUpdatedMs: 0,
    raw: null,
    risk: {
      contractAgeDays: null,
      auditFactor: null,
      tvlFactor: null,
      depegEvents: null,
      oracleType: null,
      liquiditySlippageBps: null,
      counterpartyClass: null,
      smartMoneySignal: null,
      apyVolatility: null,
      apyDrift: null,
      yieldAccrualEvents: null
    },
    probabilities: { exploit: 0, depeg: 0, oracle: 0, illiquid: 0, counterparty: 0 },
    severities: { exploit: 0, depeg: 0, oracle: 0, illiquid: 0, counterparty: 0 },
    expectedLoss: 0,
    raapy: 0.05,
    confidence: 1
  };
}

function makeYieldMap(opportunities: ScoredOpportunity[]): YieldMap {
  return {
    version: '1.0',
    publishedAtMs: 0,
    publisher: { address: STUB_ADDRESS, identityNFT: 'stub' },
    methodologyHash: 'stub',
    codeCommit: 'stub',
    sourcesQueried: [],
    sourcesDegraded: [],
    opportunities,
    perTranche: { senior: [], mezzanine: [], junior: [] },
    signature: 'stub'
  };
}

describe('allocate', () => {
  describe('ALLOCATION_CONSTANTS', () => {
    it('trancheTargetBps is frozen', () => {
      expect(Object.isFrozen(ALLOCATION_CONSTANTS)).toBe(true);
    });

    it('trancheTargetBps sum to 10000', () => {
      const { senior, mezzanine, junior } = ALLOCATION_CONSTANTS.trancheTargetBps;
      expect(senior + mezzanine + junior).toBe(10_000);
    });
  });

  describe('test 1: plain weighted normalization', () => {
    // Three senior opportunities with scores 10, 5, 3 (total 18).
    // Raw bps (floor): floor(10/18*10000)=5555, floor(5/18*10000)=2777, floor(3/18*10000)=1666
    // Sum = 9998, top-up goes to highest-score (score=10) -> 5557.
    // Total must equal exactly 10000.
    it('distributes bps proportional to score and tops up rounding error', () => {
      const opps = [
        makeOpp('a', 10, ['senior']),
        makeOpp('b', 5, ['senior']),
        makeOpp('c', 3, ['senior'])
      ];
      const result = allocate(makeYieldMap(opps));
      const { positions } = result.senior;

      // Only senior has eligible opportunities, so it gets renormalized to 10000.
      expect(result.senior.bps).toBe(10_000);

      const positionSum = Object.values(positions).reduce((s, v) => s + v, 0);
      expect(positionSum).toBe(10_000);

      // Highest-score item gets the rounding remainder so it is >= floor share.
      // floor(10/18*10000) = 5555, remainder goes here too.
      expect(positions['a']).toBeGreaterThanOrEqual(5555);
      expect(positions['b']).toBe(2777);
      expect(positions['c']).toBe(1666);
    });
  });

  describe('test 2: concentration cap binds', () => {
    // Three senior opportunities with scores 100, 1, 1 (total 102).
    // Without cap: floor(100/102*10000)=9803, others get 98 each = 9999, top-up -> 9805.
    // Cap is 6000 for senior. The 9803 (or 9805) position hits the cap.
    // overflow = (raw_bps - 6000) redistributed to the other two positions.
    it('caps dominant position at concentrationCapBps and redistributes overflow', () => {
      const opps = [
        makeOpp('dom', 100, ['senior']),
        makeOpp('x', 1, ['senior']),
        makeOpp('y', 1, ['senior'])
      ];
      const result = allocate(makeYieldMap(opps));
      const { positions } = result.senior;

      expect(positions['dom']).toBe(6000);

      const positionSum = Object.values(positions).reduce((s, v) => s + v, 0);
      expect(positionSum).toBe(10_000);

      // The two non-dominant positions share the remaining 4000 bps.
      expect(positions['x']! + positions['y']!).toBe(4000);
      // Neither should exceed the cap.
      expect(positions['x']!).toBeLessThanOrEqual(6000);
      expect(positions['y']!).toBeLessThanOrEqual(6000);
    });
  });

  describe('test 3: zero eligible for one tranche', () => {
    // No senior-eligible opportunities. Mezzanine + junior should sum to 10000.
    // Raw target shares: mezzanine=3000, junior=2000, total=5000.
    // Normalized: mezzanine = floor(3000/5000*10000)=6000, junior = floor(2000/5000*10000)=4000.
    // Sum = 10000 exactly; no top-up needed.
    it('sets empty tranche bps to 0 and renormalizes remaining tranches to sum 10000', () => {
      const opps = [
        makeOpp('m1', 10, ['mezzanine']),
        makeOpp('j1', 10, ['junior'])
      ];
      const result = allocate(makeYieldMap(opps));

      expect(result.senior.bps).toBe(0);
      expect(Object.keys(result.senior.positions)).toHaveLength(0);

      const trancheSum = result.senior.bps + result.mezzanine.bps + result.junior.bps;
      expect(trancheSum).toBe(10_000);

      expect(result.mezzanine.bps).toBe(6000);
      expect(result.junior.bps).toBe(4000);
    });
  });

  describe('test 4: all tranches empty', () => {
    it('returns all tranches as {bps:0, positions:{}} without throwing', () => {
      const result = allocate(makeYieldMap([]));

      expect(result.senior).toEqual({ bps: 0, positions: {} });
      expect(result.mezzanine).toEqual({ bps: 0, positions: {} });
      expect(result.junior).toEqual({ bps: 0, positions: {} });
    });
  });

  describe('test 5: position bps sum invariant', () => {
    it('positions within any non-empty tranche sum to exactly 10000', () => {
      const opps = [
        makeOpp('s1', 7, ['senior']),
        makeOpp('s2', 3, ['senior']),
        makeOpp('m1', 6, ['mezzanine']),
        makeOpp('m2', 4, ['mezzanine']),
        makeOpp('j1', 5, ['junior']),
        makeOpp('j2', 5, ['junior'])
      ];
      const result = allocate(makeYieldMap(opps));

      for (const [tranche, alloc] of Object.entries(result) as [Tranche, { bps: number; positions: Record<string, number> }][]) {
        if (Object.keys(alloc.positions).length > 0) {
          const posSum = Object.values(alloc.positions).reduce((s, v) => s + v, 0);
          expect(posSum, `positions sum for ${tranche}`).toBe(10_000);
        }
      }
    });
  });

  describe('test 6: tranche bps sum invariant', () => {
    it('tranche bps sum to 10000 when at least one tranche is non-empty', () => {
      const opps = [
        makeOpp('s1', 5, ['senior']),
        makeOpp('m1', 5, ['mezzanine'])
      ];
      const result = allocate(makeYieldMap(opps));
      const total = result.senior.bps + result.mezzanine.bps + result.junior.bps;
      expect(total).toBe(10_000);
    });

    it('tranche bps all zero when no opportunities exist', () => {
      const result = allocate(makeYieldMap([]));
      const total = result.senior.bps + result.mezzanine.bps + result.junior.bps;
      expect(total).toBe(0);
    });
  });

  describe('sparse tranche: sum-to-10000 invariant takes precedence over the cap', () => {
    it('single junior position gets the full 10000 bps even though it exceeds the 2500 cap', () => {
      const result = allocate(makeYieldMap([makeOpp('only', 5, ['junior'])]));
      const sum = Object.values(result.junior.positions).reduce((s, v) => s + v, 0);
      expect(sum).toBe(10_000);
      expect(result.junior.positions['only']).toBe(10_000);
    });

    it('two equal-score junior positions split 10000 (both above the 2500 cap)', () => {
      const opps = [makeOpp('j1', 5, ['junior']), makeOpp('j2', 5, ['junior'])];
      const result = allocate(makeYieldMap(opps));
      const sum = Object.values(result.junior.positions).reduce((s, v) => s + v, 0);
      expect(sum).toBe(10_000);
      // The top-up adds the rounding leftover to the highest-score below-cap
      // position; with equal scores neither is below cap so the leftover lands
      // on the first one. The total still sums to 10000.
      expect(result.junior.positions['j1']).toBeGreaterThanOrEqual(2500);
      expect(result.junior.positions['j2']).toBeGreaterThanOrEqual(2500);
    });
  });
});
