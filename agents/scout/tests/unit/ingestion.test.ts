import { describe, it, expect } from 'vitest';
import { runIngestion } from '../../src/pipeline/ingestion/index.js';
import type { SourceFetcher } from '../../src/pipeline/ingestion/sourceFetcher.js';

const ok: SourceFetcher = {
  source: 'aave',
  fetch: async () => [{
    id: 'aave:x', source: 'aave', asset: '0x' + 'a'.repeat(40),
    apy: 0.05, apyType: 'variable', tvlUsd: 1, lastUpdatedMs: 0, raw: {}
  }]
};
const bad: SourceFetcher = { source: 'cian', fetch: async () => { throw new Error('boom'); } };

describe('runIngestion', () => {
  it('isolates failures', async () => {
    const result = await runIngestion([ok, bad], { perSourceTimeoutMs: 5_000 });
    expect(result.opportunities.length).toBe(1);
    expect(result.degraded).toContain('cian');
    expect(result.attempted.sort()).toEqual(['aave', 'cian']);
  });

  it('honors per-source timeout', async () => {
    const slow: SourceFetcher = { source: 'agni', fetch: () => new Promise(r => setTimeout(() => r([]), 1000)) };
    const result = await runIngestion([slow], { perSourceTimeoutMs: 50 });
    expect(result.degraded).toContain('agni');
    expect(result.errors['agni']).toMatch(/timeout/i);
  });

  it('drops invalid opportunities (zod parse failure) but keeps source attempted', async () => {
    const garbageOpp: SourceFetcher = {
      source: 'aave',
      fetch: async () => [{ id: '', source: 'aave', asset: 'bad', apy: -1, apyType: 'variable', tvlUsd: 0, lastUpdatedMs: 0, raw: {} } as any]
    };
    const result = await runIngestion([garbageOpp], { perSourceTimeoutMs: 1_000 });
    expect(result.opportunities.length).toBe(0);
    expect(result.attempted).toContain('aave');
    expect(result.degraded).not.toContain('aave');  // it ran successfully, just produced invalid data
  });
});
