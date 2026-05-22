import { describe, it, expect } from 'vitest';
import { HedgeIntentSchema } from '../../src/types.js';

const valid = {
  version: '1.0',
  intentId: '1',
  sourceSignalCid: 'bafySignal',
  sourceSignalBlock: '12345',
  hedgedAsset: '0x' + 'a'.repeat(40),
  direction: 'short',
  notionalUsd: '1000000',
  contractSize: '500.5',
  spotPriceUsd: '2000.5',
  spotPriceSource: 'coingecko',
  spotPriceTimestampMs: 1_700_000_000_000,
  slippageToleranceBps: 50,
  publisher: { address: '0x' + 'b'.repeat(40), identityNFT: 'ipfs://x' },
  methodologyHash: '0x' + '1'.repeat(64),
  codeCommit: 'deadbeef',
  publishedAtMs: 1_700_000_000_000,
  signature: '0xsig'
};

describe('HedgeIntentSchema', () => {
  it('parses a valid intent', () => {
    expect(HedgeIntentSchema.safeParse(valid).success).toBe(true);
  });
  it('rejects when slippageToleranceBps is negative', () => {
    const bad = { ...valid, slippageToleranceBps: -1 };
    expect(HedgeIntentSchema.safeParse(bad).success).toBe(false);
  });
});
