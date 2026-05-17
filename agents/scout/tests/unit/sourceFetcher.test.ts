import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { setupServer } from 'msw/node';
import { http, HttpResponse } from 'msw';
import { DefiLlamaFetcher } from '../../src/pipeline/ingestion/sources/defiLlama.js';

const server = setupServer(
  http.get('https://yields.llama.fi/pools', () => HttpResponse.json({
    data: [
      { chain: 'Mantle', project: 'aave-v3', symbol: 'USDC', underlyingTokens: ['0x' + 'a'.repeat(40)],
        apy: 4.2, tvlUsd: 12_000_000, pool: 'p1' },
      { chain: 'Ethereum', project: 'aave-v3', symbol: 'USDC', apy: 5.0, tvlUsd: 1, pool: 'p2' },
      { chain: 'Mantle', project: 'agni-finance', symbol: 'USDC-MNT', underlyingTokens: ['0x' + 'b'.repeat(40)],
        apy: 18.0, tvlUsd: 3_000_000, pool: 'p3' },
      { chain: 'Mantle', project: 'unknown-protocol', symbol: 'X', apy: 99, tvlUsd: 1, pool: 'p4' }
    ]
  }))
);

beforeAll(() => server.listen());
afterAll(() => server.close());

describe('DefiLlamaFetcher', () => {
  it('returns only Mantle pools whose project maps to a SourceProtocol', async () => {
    const f = new DefiLlamaFetcher();
    const out = await f.fetch();
    expect(out.length).toBe(2);
    expect(out.map(o => o.source).sort()).toEqual(['aave', 'agni']);
  });

  it('drops Ethereum pools', async () => {
    const f = new DefiLlamaFetcher();
    const out = await f.fetch();
    expect(out.every(o => (o.raw as any).chain === 'Mantle')).toBe(true);
  });

  it('drops pools with unrecognized projects', async () => {
    const f = new DefiLlamaFetcher();
    const out = await f.fetch();
    expect(out.find(o => (o.raw as any).project === 'unknown-protocol')).toBeUndefined();
  });

  it('converts apy from percent to fraction', async () => {
    const f = new DefiLlamaFetcher();
    const out = await f.fetch();
    const aave = out.find(o => o.source === 'aave')!;
    expect(aave.apy).toBeCloseTo(0.042, 5);
  });

  it('uses underlyingTokens[0] as asset', async () => {
    const f = new DefiLlamaFetcher();
    const out = await f.fetch();
    const aave = out.find(o => o.source === 'aave')!;
    expect(aave.asset).toBe('0x' + 'a'.repeat(40));
  });
});
