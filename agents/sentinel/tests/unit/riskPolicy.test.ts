import { describe, it, expect } from 'vitest';
import { evaluateRisk } from '../../src/pipeline/riskPolicy.js';
import type { YieldMap, Opportunity } from '@strata/scout/types';
import type { AllocationProposal } from '../../src/ipfs/fetch.js';

const mkOpp = (over: Partial<Opportunity> = {}): Opportunity => ({
  id: 'opp-1',
  protocol: { id: 'p', name: 'P' },
  tokenAddress: '0x' + 'a'.repeat(40) as `0x${string}`,
  tokenSymbol: 'XYZ',
  apy: 5,
  tvlUsd: 100_000_000,
  score: 0.8,
  eligibleTranches: ['senior', 'mezzanine', 'junior'],
  depegHistory: { maxDeviationBps: 10, samples: 100 },
  nansenNetFlow7dUsd: 100_000,
  audits: [{ auditor: 'X', year: 2024 }],
  oracle: 'chainlink',
  counterpartyClass: 'A',
  protocolAgeDays: 500,
  ...over
} as any);

const baseMap = (opps: Opportunity[]): YieldMap => ({
  version: '1.0',
  publishedAtMs: 1_700_000_000_000,
  publisher: { address: '0x' + 'a'.repeat(40) as `0x${string}`, identityNFT: 'ipfs://x' },
  methodologyHash: '0x' + '1'.repeat(64),
  codeCommit: 'deadbeef',
  opportunities: opps,
  tranches: { senior: { aggregateApy: 0, count: 1, avgScore: 0 }, mezzanine: { aggregateApy: 0, count: 0, avgScore: 0 }, junior: { aggregateApy: 0, count: 0, avgScore: 0 } },
  signature: '0xsig'
} as any);

const baseProposal = (positions: Record<string, number>): AllocationProposal => ({
  version: '1.0',
  proposalId: '1',
  sourceMapCid: 'bafyMap',
  publishedAtMs: 1_700_000_000_000,
  publisher: { address: '0x' + 'b'.repeat(40) as `0x${string}`, identityNFT: 'ipfs://x' },
  methodologyHash: '0x' + '2'.repeat(64),
  codeCommit: 'cafebabe',
  tranches: {
    senior:    { bps: 10000, positions },
    mezzanine: { bps: 0, positions: {} },
    junior:    { bps: 0, positions: {} }
  },
  netExposureAtProposalMs: {},
  narrative: null,
  signature: '0xsig'
});

describe('evaluateRisk', () => {
  it('returns green when everything passes', () => {
    const map = baseMap([mkOpp()]);
    const prop = baseProposal({ 'opp-1': 10000 });
    const asset = (map.opportunities[0]!.tokenAddress as string).toLowerCase();
    const out = evaluateRisk({
      proposal: prop, map,
      netExposure: { [asset]: 10_000_000n },
      totalDepositsBaselineUsd: 10_000_000
    });
    expect(out.tranches.senior).toBe('green');
    expect(out.hedgeSignals).toHaveLength(0);
  });

  it('flags yellow when TVL is below the senior floor', () => {
    const map = baseMap([mkOpp({ tvlUsd: 5_000_000 })]);
    const prop = baseProposal({ 'opp-1': 10000 });
    const out = evaluateRisk({ proposal: prop, map, netExposure: {}, totalDepositsBaselineUsd: 10_000_000 });
    expect(out.tranches.senior).toBe('yellow');
    expect(out.reasons.some((r) => r.code === 'tvl-below-floor')).toBe(true);
  });

  it('flags red when smart-money outflow > $5m', () => {
    const map = baseMap([mkOpp({ nansenNetFlow7dUsd: -10_000_000 })]);
    const prop = baseProposal({ 'opp-1': 10000 });
    const out = evaluateRisk({ proposal: prop, map, netExposure: {}, totalDepositsBaselineUsd: 10_000_000 });
    expect(out.tranches.senior).toBe('red');
    expect(out.perPositionVerdicts['opp-1']).toBe('red');
  });

  it('escalates to red when 2 positions are yellow', () => {
    const map = baseMap([
      mkOpp({ id: 'opp-1', tvlUsd: 5_000_000 }),
      mkOpp({ id: 'opp-2', tvlUsd: 5_000_000, tokenAddress: '0x' + 'b'.repeat(40) as `0x${string}` })
    ]);
    const prop = baseProposal({ 'opp-1': 5000, 'opp-2': 5000 });
    const out = evaluateRisk({ proposal: prop, map, netExposure: {}, totalDepositsBaselineUsd: 10_000_000 });
    expect(out.tranches.senior).toBe('red');
  });

  it('emits a hedge signal when |gross - hedge| > $250k', () => {
    const map = baseMap([mkOpp()]);
    const prop = baseProposal({ 'opp-1': 10000 });
    const out = evaluateRisk({ proposal: prop, map, netExposure: {}, totalDepositsBaselineUsd: 10_000_000 });
    expect(out.hedgeSignals).toHaveLength(1);
    expect(out.hedgeSignals[0]!.direction).toBe('short');
    expect(out.hedgeSignals[0]!.targetNotionalUsd).toBe(10_000_000n);
  });

  it('skips hedge signal when |delta| <= cap', () => {
    const map = baseMap([mkOpp()]);
    const prop = baseProposal({ 'opp-1': 10000 });
    const asset = (map.opportunities[0]!.tokenAddress as string).toLowerCase();
    const out = evaluateRisk({
      proposal: prop, map,
      netExposure: { [asset]: 10_000_000n },
      totalDepositsBaselineUsd: 10_000_000
    });
    expect(out.hedgeSignals).toHaveLength(0);
  });
});
