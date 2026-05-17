import { describe, it, expect } from 'vitest';
import { YieldOpportunitySchema } from '../../src/types.js';

describe('YieldOpportunitySchema', () => {
  it('accepts a well-formed opportunity', () => {
    const valid = {
      id: 'ondo:usdy',
      source: 'ondo',
      asset: '0x0000000000000000000000000000000000000001',
      apy: 0.053,
      apyType: 'variable',
      tvlUsd: 75_000_000,
      lastUpdatedMs: Date.now(),
      raw: {}
    };
    expect(() => YieldOpportunitySchema.parse(valid)).not.toThrow();
  });

  it('rejects negative APY', () => {
    expect(() => YieldOpportunitySchema.parse({
      id: 'x', source: 'ondo', asset: '0x0000000000000000000000000000000000000001',
      apy: -0.1, apyType: 'variable', tvlUsd: 1, lastUpdatedMs: 0, raw: {}
    })).toThrow();
  });

  it('rejects non-address asset', () => {
    expect(() => YieldOpportunitySchema.parse({
      id: 'x', source: 'ondo', asset: 'not-an-address',
      apy: 0.05, apyType: 'variable', tvlUsd: 1, lastUpdatedMs: 0, raw: {}
    })).toThrow();
  });
});
