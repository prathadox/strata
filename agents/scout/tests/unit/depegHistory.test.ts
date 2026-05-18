import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { setupServer } from 'msw/node';
import { http, HttpResponse } from 'msw';
import { fetchDepegHistory } from '../../src/pipeline/enrichment/depegHistory.js';

const DAY_S = 86_400;
const baseS = 1_700_000_000;
const usdyAddr = '0x5be26527e817998a7206475496fde1e68957c5a6' as const;
const unknownAddr = '0x0000000000000000000000000000000000000bad' as const;

const llamaSeries = {
  coins: {
    'coingecko:ondo-us-dollar-yield': {
      prices: [
        { timestamp: baseS + 0 * DAY_S, price: 1.000 },
        { timestamp: baseS + 1 * DAY_S, price: 0.970 },   // event start (3% deviation)
        { timestamp: baseS + 2 * DAY_S, price: 0.950 },   // max deviation (5%)
        { timestamp: baseS + 3 * DAY_S, price: 0.998 },   // event end (within 0.5%)
        { timestamp: baseS + 4 * DAY_S, price: 1.000 },
        { timestamp: baseS + 5 * DAY_S, price: 0.990 }    // single-day blip below threshold, no event
      ]
    }
  }
};

const server = setupServer(
  http.get('https://coins.llama.fi/chart/coingecko%3Aondo-us-dollar-yield', () =>
    HttpResponse.json(llamaSeries)
  )
);

beforeAll(() => server.listen());
afterAll(() => server.close());

describe('fetchDepegHistory', () => {
  it('returns [] for non-stable / unmapped assets', async () => {
    const out = await fetchDepegHistory(unknownAddr);
    expect(out).toEqual([]);
  });

  it('compresses consecutive deviation days into one event', async () => {
    const out = await fetchDepegHistory(usdyAddr);
    expect(out.length).toBe(1);
    const ev = out[0]!;
    expect(ev.startMs).toBe((baseS + 1 * DAY_S) * 1000);
    expect(ev.endMs).toBe((baseS + 3 * DAY_S) * 1000);
    expect(ev.maxDeviation).toBeCloseTo(0.05, 5);
    expect(ev.recoveryHours).toBeCloseTo(48, 1);
  });
});
