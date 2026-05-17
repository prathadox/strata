import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { setupServer } from 'msw/node';
import { http, HttpResponse } from 'msw';
import { fetchDepegHistory } from '../../src/pipeline/enrichment/depegHistory.js';

const DAY_MS = 86_400_000;
const base = 1_700_000_000_000;
const usdyAddr = '0x5be26527e817998a7206475496fde1e68957c5a6' as const;
const unknownAddr = '0x0000000000000000000000000000000000000bad' as const;

const usdySeries = {
  prices: [
    [base + 0 * DAY_MS, 1.000],
    [base + 1 * DAY_MS, 0.970],   // event start (3% deviation)
    [base + 2 * DAY_MS, 0.950],   // max deviation (5%)
    [base + 3 * DAY_MS, 0.998],   // event end (within 0.5%)
    [base + 4 * DAY_MS, 1.000],
    [base + 5 * DAY_MS, 0.990]    // single-day blip below threshold, no event
  ]
};

const server = setupServer(
  http.get('https://api.coingecko.com/api/v3/coins/ondo-us-dollar-yield/market_chart', () =>
    HttpResponse.json(usdySeries)
  )
);

beforeAll(() => server.listen());
afterAll(() => server.close());

describe('fetchDepegHistory', () => {
  it('returns [] for non-stable / unmapped assets', async () => {
    const out = await fetchDepegHistory(unknownAddr, 'demo-key');
    expect(out).toEqual([]);
  });

  it('compresses consecutive deviation days into one event', async () => {
    const out = await fetchDepegHistory(usdyAddr, 'demo-key');
    expect(out.length).toBe(1);
    const ev = out[0]!;
    expect(ev.startMs).toBe(base + 1 * DAY_MS);
    expect(ev.endMs).toBe(base + 3 * DAY_MS);
    expect(ev.maxDeviation).toBeCloseTo(0.05, 5);
    expect(ev.recoveryHours).toBeCloseTo(48, 1);
  });
});
