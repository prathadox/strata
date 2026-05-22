import { describe, it, expect } from 'vitest';
import { RiskVerdictSchema, HedgeSignalSchema } from '../../src/types.js';

describe('RiskVerdictSchema', () => {
  const validVerdict = {
    version: '1.0',
    verdictId: '12345',
    proposalId: '67890',
    sourceMapCid: 'bafyMap',
    sourceProposalCid: 'bafyProp',
    publishedAtMs: 1_700_000_000_000,
    publisher: { address: '0x' + 'a'.repeat(40), identityNFT: 'ipfs://x' },
    methodologyHash: '0x' + '1'.repeat(64),
    codeCommit: 'deadbeef',
    tranches: { senior: 'green', mezzanine: 'yellow', junior: 'red' },
    perPositionVerdicts: { 'opp-1': 'green' },
    reasons: [{ severity: 'yellow', code: 'tvl-below-floor', target: 'opp-1', message: 'tvl 5m < 10m floor' }],
    signature: '0x' + '2'.repeat(130)
  };

  it('parses a well-formed verdict', () => {
    expect(RiskVerdictSchema.safeParse(validVerdict).success).toBe(true);
  });

  it('rejects a verdict missing a tranche', () => {
    const bad = { ...validVerdict, tranches: { senior: 'green', mezzanine: 'yellow' } };
    expect(RiskVerdictSchema.safeParse(bad).success).toBe(false);
  });
});

describe('HedgeSignalSchema', () => {
  const validSignal = {
    version: '1.0',
    signalId: '42',
    sourceVerdictCid: 'bafyVerdict',
    sourceProposalId: '67890',
    hedgedAsset: '0x' + 'a'.repeat(40),
    targetNotionalUsd: '1500000',
    direction: 'short',
    publisher: { address: '0x' + 'a'.repeat(40), identityNFT: 'ipfs://x' },
    methodologyHash: '0x' + '1'.repeat(64),
    codeCommit: 'deadbeef',
    publishedAtMs: 1_700_000_000_000,
    signature: '0x' + '2'.repeat(130)
  };

  it('parses a well-formed signal', () => {
    expect(HedgeSignalSchema.safeParse(validSignal).success).toBe(true);
  });
});
