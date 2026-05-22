import { describe, it, expect } from 'vitest';
import { buildVerdict } from '../../src/pipeline/buildVerdict.js';
import type { RiskEvaluation } from '../../src/pipeline/riskPolicy.js';

const evaluation: RiskEvaluation = {
  tranches: { senior: 'green', mezzanine: 'yellow', junior: 'red' },
  perPositionVerdicts: { 'opp-1': 'green', 'opp-2': 'yellow', 'opp-3': 'red' },
  reasons: [{ severity: 'yellow', code: 'tvl-below-floor', target: 'opp-2', message: 'm' }],
  hedgeSignals: []
};

describe('buildVerdict', () => {
  it('composes a verdict draft with deterministic verdictId', () => {
    const draft = buildVerdict({
      evaluation,
      proposalId: '42',
      sourceMapCid: 'bafyMap',
      sourceProposalCid: 'bafyProp',
      publisherAddress: '0x' + 'a'.repeat(40),
      identityNFT: 'ipfs://x',
      methodologyHash: '0x' + '1'.repeat(64),
      codeCommit: 'deadbeef',
      now: () => 1_700_000_000_000
    });
    expect(draft.verdictId).toMatch(/^\d+$/);
    expect(draft.tranches.junior).toBe('red');
    expect(draft.perPositionVerdicts['opp-2']).toBe('yellow');
    expect(draft.publishedAtMs).toBe(1_700_000_000_000);
  });

  it('produces the same verdictId for the same proposal CID + time', () => {
    const args = {
      evaluation, proposalId: '42', sourceMapCid: 'bafyMap', sourceProposalCid: 'bafyProp',
      publisherAddress: '0x' + 'a'.repeat(40), identityNFT: 'ipfs://x',
      methodologyHash: '0x' + '1'.repeat(64), codeCommit: 'deadbeef',
      now: () => 1_700_000_000_000
    };
    expect(buildVerdict(args).verdictId).toBe(buildVerdict(args).verdictId);
  });
});
