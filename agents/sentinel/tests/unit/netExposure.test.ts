import { describe, it, expect } from 'vitest';
import { NetExposureLedger } from '../../src/pipeline/netExposure.js';

describe('NetExposureLedger', () => {
  it('sums multiple positions per asset', () => {
    const l = new NetExposureLedger();
    l.apply('0xAsset1', 100n, 1000);
    l.apply('0xAsset1', -30n, 2000);
    l.apply('0xAsset2', 50n, 3000);
    expect(l.snapshot()).toEqual({ '0xasset1': 70n, '0xasset2': 50n });
  });

  it('lowercases the asset key', () => {
    const l = new NetExposureLedger();
    l.apply('0xAbCdEf' as `0x${string}`, 10n, 1);
    l.apply('0xABCDEF' as `0x${string}`, 5n, 2);
    expect(l.snapshot()['0xabcdef']).toBe(15n);
  });
});
