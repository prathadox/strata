import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest';
import { setupServer } from 'msw/node';
import { http, HttpResponse } from 'msw';
import { fetchDepegHistory } from '../../src/pipeline/enrichment/depegHistory.js';

const DAY_S = 86_400;
const DAY_MS = DAY_S * 1000;
const baseS = 1_700_000_000;
const baseMs = baseS * 1000;
const usdyAddr = '0x5be26527e817998a7206475496fde1e68957c5a6' as const;
const unknownAddr = '0x0000000000000000000000000000000000000bad' as const;

const llamaSeries = {
  coins: {
    'coingecko:ondo-us-dollar-yield': {
      prices: [
        { timestamp: baseS + 0 * DAY_S, price: 1.000 },
        { timestamp: baseS + 1 * DAY_S, price: 0.970 },
        { timestamp: baseS + 2 * DAY_S, price: 0.950 },
        { timestamp: baseS + 3 * DAY_S, price: 0.998 },
        { timestamp: baseS + 4 * DAY_S, price: 1.000 },
        { timestamp: baseS + 5 * DAY_S, price: 0.990 }
      ]
    }
  }
};

const coingeckoSeries = {
  prices: [
    [baseMs + 0 * DAY_MS, 1.000],
    [baseMs + 1 * DAY_MS, 0.940],   // 6% deviation, deeper than the Llama fixture
    [baseMs + 2 * DAY_MS, 0.920],   // 8% max
    [baseMs + 3 * DAY_MS, 0.999],
    [baseMs + 4 * DAY_MS, 1.000]
  ]
};

const server = setupServer(
  http.get('https://coins.llama.fi/chart/coingecko%3Aondo-us-dollar-yield', () =>
    HttpResponse.json(llamaSeries)
  ),
  http.get('https://api.coingecko.com/api/v3/coins/ondo-us-dollar-yield/market_chart', () =>
    HttpResponse.json(coingeckoSeries)
  )
);

beforeAll(() => server.listen());
afterAll(() => server.close());
beforeEach(() => server.resetHandlers(
  http.get('https://coins.llama.fi/chart/coingecko%3Aondo-us-dollar-yield', () => HttpResponse.json(llamaSeries)),
  http.get('https://api.coingecko.com/api/v3/coins/ondo-us-dollar-yield/market_chart', () => HttpResponse.json(coingeckoSeries))
));

describe('fetchDepegHistory', () => {
  it('returns [] for non-stable / unmapped assets', async () => {
    const out = await fetchDepegHistory(unknownAddr);
    expect(out).toEqual([]);
  });

  it('uses DefiLlama coins when no CoinGecko key is provided', async () => {
    const out = await fetchDepegHistory(usdyAddr);
    expect(out.length).toBe(1);
    expect(out[0]!.maxDeviation).toBeCloseTo(0.05, 5);   // Llama fixture max
  });

  it('uses CoinGecko when a key is provided (different fixture proves which path ran)', async () => {
    const out = await fetchDepegHistory(usdyAddr, 'cg-demo-key');
    expect(out.length).toBe(1);
    expect(out[0]!.maxDeviation).toBeCloseTo(0.08, 5);   // CoinGecko fixture max
  });

  it('falls back to DefiLlama if CoinGecko fails', async () => {
    server.use(
      http.get('https://api.coingecko.com/api/v3/coins/ondo-us-dollar-yield/market_chart', () =>
        new HttpResponse(null, { status: 429 })
      )
    );
    const out = await fetchDepegHistory(usdyAddr, 'cg-demo-key');
    expect(out.length).toBe(1);
    expect(out[0]!.maxDeviation).toBeCloseTo(0.05, 5);   // fell back to Llama
  });
});
