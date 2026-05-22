import { describe, it, expect } from 'vitest';
import { buildIntent } from '../../src/pipeline/buildIntent.js';

describe('buildIntent', () => {
  it('composes a hedge intent draft', () => {
    const draft = buildIntent({
      sourceSignalCid: 'bafySignal',
      sourceSignalBlock: 12345n,
      hedgedAsset: '0x' + 'a'.repeat(40),
      sizing: { kind: 'sized', notionalUsd: 1_000_000n, contractSize: '500', direction: 'short' },
      spotPriceUsd: 2000,
      spotPriceTimestampMs: 1_700_000_000_000,
      publisherAddress: '0x' + 'b'.repeat(40),
      identityNFT: 'ipfs://x',
      methodologyHash: '0x' + '1'.repeat(64),
      codeCommit: 'c',
      now: () => 1_700_000_000_000
    });
    expect(draft.intentId).toMatch(/^\d+$/);
    expect(draft.direction).toBe('short');
    expect(draft.notionalUsd).toBe('1000000');
    expect(draft.spotPriceUsd).toBe('2000');
    expect(draft.slippageToleranceBps).toBe(50);
  });
});
