import { describe, it, expect } from 'vitest';
import { sizeHedge, HEDGE_CONSTANTS } from '../../src/pipeline/sizeHedge.js';

describe('sizeHedge', () => {
  it('skips below the noise floor', () => {
    const r = sizeHedge({ targetNotionalUsd: 5_000n, hedgedAsset: '0x' + 'a'.repeat(40) as `0x${string}` }, 2000);
    expect(r.kind).toBe('skip');
    if (r.kind === 'skip') expect(r.reason).toBe('below-floor');
  });

  it('sizes a positive notional as a short', () => {
    const r = sizeHedge({ targetNotionalUsd: 1_000_000n, hedgedAsset: '0x' + 'a'.repeat(40) as `0x${string}` }, 2000);
    expect(r.kind).toBe('sized');
    if (r.kind === 'sized') {
      expect(r.notionalUsd).toBe(1_000_000n);
      expect(r.direction).toBe('short');
      expect(r.contractSize).toBe('500');
    }
  });

  it('clamps to the max', () => {
    const r = sizeHedge({ targetNotionalUsd: 10_000_000n, hedgedAsset: '0x' + 'a'.repeat(40) as `0x${string}` }, 2000);
    if (r.kind !== 'sized') throw new Error('expected sized');
    expect(r.notionalUsd).toBe(BigInt(HEDGE_CONSTANTS.maxNotionalUsd));
  });

  it('sizes a negative notional as a long', () => {
    const r = sizeHedge({ targetNotionalUsd: -1_000_000n, hedgedAsset: '0x' + 'a'.repeat(40) as `0x${string}` }, 2000);
    if (r.kind !== 'sized') throw new Error('expected sized');
    expect(r.direction).toBe('long');
    expect(r.notionalUsd).toBe(-1_000_000n);
  });
});
