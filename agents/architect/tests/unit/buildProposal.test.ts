import { describe, it, expect } from 'vitest';
import type { ScoredOpportunity, Tranche, YieldMap } from '@strata/scout/types';
import { buildProposal } from '../../src/pipeline/buildProposal.js';
import { NetExposureLedger } from '../../src/pipeline/netExposure.js';
import { AllocationProposalDraftSchema } from '../../src/types.js';

const STUB_ADDRESS = '0x0000000000000000000000000000000000000001' as const;
const STUB_METHODOLOGY = '0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890' as const;
const FIXED_NOW = () => 1_700_000_000_000;

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

function makeYieldMap(opportunities: ScoredOpportunity[], publishedAtMs = 1_000_000): YieldMap {
  return {
    version: '1.0',
    publishedAtMs,
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

const BASE_ARGS = {
  sourceMapCid: 'bafybeiabc123',
  publisherAddress: STUB_ADDRESS,
  identityNFT: 'stub-nft',
  methodologyHash: STUB_METHODOLOGY,
  codeCommit: 'abc1234',
  now: FIXED_NOW
};

describe('buildProposal', () => {
  describe('test 1: happy path', () => {
    it('produces a valid AllocationProposal (without signature) from a stub YieldMap', () => {
      const map = makeYieldMap([
        makeOpp('s1', 10, ['senior']),
        makeOpp('m1', 5, ['mezzanine']),
        makeOpp('j1', 3, ['junior'])
      ]);
      const ledger = new NetExposureLedger();
      const result = buildProposal({ ...BASE_ARGS, map, ledger });

      // Conforms to schema (without signature).
      const parsed = AllocationProposalDraftSchema.safeParse(result);
      expect(parsed.success, parsed.success ? '' : (parsed as { error: { message: string } }).error.message).toBe(true);

      // proposalId is a non-empty decimal string.
      expect(result.proposalId).toMatch(/^\d+$/);
      expect(result.proposalId.length).toBeGreaterThan(0);

      // sourceMapCid matches input.
      expect(result.sourceMapCid).toBe('bafybeiabc123');

      // publishedAtMs comes from the injected clock, not the map.
      expect(result.publishedAtMs).toBe(1_700_000_000_000);

      // tranches has the expected shape.
      expect(result.tranches).toHaveProperty('senior');
      expect(result.tranches).toHaveProperty('mezzanine');
      expect(result.tranches).toHaveProperty('junior');
    });
  });

  describe('test 2: proposalId is deterministic', () => {
    it('produces the same proposalId when built twice with identical inputs', () => {
      const map = makeYieldMap([makeOpp('s1', 7, ['senior'])]);
      const ledger = new NetExposureLedger();
      const r1 = buildProposal({ ...BASE_ARGS, map, ledger });
      const r2 = buildProposal({ ...BASE_ARGS, map, ledger });
      expect(r1.proposalId).toBe(r2.proposalId);
    });
  });

  describe('test 3: proposalId changes when sourceMapCid changes', () => {
    it('different sourceMapCid yields a different proposalId (same publishedAtMs)', () => {
      const map = makeYieldMap([], 9_999_999);
      const ledger = new NetExposureLedger();
      const r1 = buildProposal({ ...BASE_ARGS, sourceMapCid: 'cid-alpha', map, ledger });
      const r2 = buildProposal({ ...BASE_ARGS, sourceMapCid: 'cid-beta', map, ledger });
      expect(r1.proposalId).not.toBe(r2.proposalId);
    });
  });

  describe('test 4: proposalId changes when map.publishedAtMs changes', () => {
    it('different publishedAtMs yields a different proposalId (same sourceMapCid)', () => {
      const ledger = new NetExposureLedger();
      const r1 = buildProposal({ ...BASE_ARGS, map: makeYieldMap([], 1_000), ledger });
      const r2 = buildProposal({ ...BASE_ARGS, map: makeYieldMap([], 2_000), ledger });
      expect(r1.proposalId).not.toBe(r2.proposalId);
    });
  });

  describe('test 5: netExposureAtProposalMs reflects ledger state', () => {
    it('snapshot with two assets appears in the result', () => {
      const map = makeYieldMap([]);
      const ledger = new NetExposureLedger();
      ledger.apply('0x0000000000000000000000000000000000000002', 500_000n, 1_000);
      ledger.apply('0x0000000000000000000000000000000000000003', 250_000n, 2_000);

      const result = buildProposal({ ...BASE_ARGS, map, ledger });

      expect(result.netExposureAtProposalMs).toMatchObject({
        '0x0000000000000000000000000000000000000002': '500000',
        '0x0000000000000000000000000000000000000003': '250000'
      });
    });
  });

  describe('test 6: all-empty YieldMap produces a zero-state proposal', () => {
    it('schema still validates when all tranches are bps=0', () => {
      const map = makeYieldMap([]);
      const ledger = new NetExposureLedger();
      const result = buildProposal({ ...BASE_ARGS, map, ledger });

      const parsed = AllocationProposalDraftSchema.safeParse(result);
      expect(parsed.success, parsed.success ? '' : (parsed as { error: { message: string } }).error.message).toBe(true);

      expect(result.tranches.senior.bps).toBe(0);
      expect(result.tranches.mezzanine.bps).toBe(0);
      expect(result.tranches.junior.bps).toBe(0);
    });
  });

  describe('test 7: sum invariants hold on produced proposal', () => {
    it('across-tranche bps sum to 10000 when opportunities exist', () => {
      const map = makeYieldMap([
        makeOpp('s1', 5, ['senior']),
        makeOpp('m1', 5, ['mezzanine']),
        makeOpp('j1', 5, ['junior'])
      ]);
      const ledger = new NetExposureLedger();
      const result = buildProposal({ ...BASE_ARGS, map, ledger });

      const total = result.tranches.senior.bps + result.tranches.mezzanine.bps + result.tranches.junior.bps;
      expect(total).toBe(10_000);
    });

    it('across-tranche bps sum to 0 when no opportunities exist', () => {
      const map = makeYieldMap([]);
      const ledger = new NetExposureLedger();
      const result = buildProposal({ ...BASE_ARGS, map, ledger });

      const total = result.tranches.senior.bps + result.tranches.mezzanine.bps + result.tranches.junior.bps;
      expect(total).toBe(0);
    });

    it('per-tranche positions sum to 10000 when tranche bps > 0', () => {
      const map = makeYieldMap([
        makeOpp('s1', 7, ['senior']),
        makeOpp('s2', 3, ['senior'])
      ]);
      const ledger = new NetExposureLedger();
      const result = buildProposal({ ...BASE_ARGS, map, ledger });

      if (result.tranches.senior.bps > 0) {
        const posSum = Object.values(result.tranches.senior.positions).reduce((s, v) => s + v, 0);
        expect(posSum).toBe(10_000);
      }
    });
  });
});
