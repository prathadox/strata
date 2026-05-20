// yieldAccrual.ts - for yield-bearing tokens like Ondo USDY and Ethena sUSDe.
// These tokens are NOT pegged to $1; their price drifts upward by accrued yield.
// The depeg-check would generate false alarms on them. Instead we fit an exponential
// growth trajectory from the price series and flag points where the actual price falls
// meaningfully below the expected accrual line.
//
// What this catches:
//   - issuer attestation failures (USDY suddenly worth less than expected accrual)
//   - custody compromise (the assets backing the token vanished)
//   - yield stagnation (price stops climbing)
//
// What this returns: the same DepegEvent[] shape as fetchDepegHistory, because consumers
// (scoring, dashboard, downstream agents) treat "asset value deviated from expectation"
// as one concept. The signal is folded into p_depeg in the scoring step.

import { z } from 'zod';
import type { z as zType } from 'zod';
import { DepegEventSchema } from '../../types.js';

type AccrualEvent = zType.infer<typeof DepegEventSchema>;

// Address -> CoinGecko slug. Only assets whose price is *supposed* to climb monotonically.
const YIELD_BEARING_TO_COINGECKO: Record<string, string> = {
  // Ondo USDY: price floats above $1 by accrued US T-bill yield, ~5% APY
  '0x5be26527e817998a7206475496fde1e68957c5a6': 'ondo-us-dollar-yield',
  // Ethena sUSDe: staked USDe, price floats above $1 by accrued funding-rate yield
  '0x211cc4dd073734da055fbf44a2b4667d5e5fe5d2': 'ethena-staked-usde'
};

const NEGATIVE_DEVIATION_THRESHOLD = 0.02;   // 2% below expected accrual triggers event
const RECOVERY_THRESHOLD = 0.005;             // within 0.5% of expected closes event
const MIN_SAMPLES = 30;                       // need at least 30 days of history to fit

const CoinGeckoChartResponse = z.object({
  prices: z.array(z.tuple([z.number(), z.number()]))
});

const LlamaChartResponse = z.object({
  coins: z.record(
    z.string(),
    z.object({
      prices: z.array(z.object({ timestamp: z.number(), price: z.number() }))
    })
  )
});

interface PricePoint { ms: number; price: number; }

async function fetchSeriesCoinGecko(slug: string, apiKey: string): Promise<PricePoint[] | null> {
  const url = new URL(`https://api.coingecko.com/api/v3/coins/${slug}/market_chart`);
  url.searchParams.set('vs_currency', 'usd');
  url.searchParams.set('days', '365');
  url.searchParams.set('interval', 'daily');
  let res: Response;
  try { res = await globalThis.fetch(url.toString(), { headers: { 'x-cg-demo-api-key': apiKey } }); }
  catch { return null; }
  if (!res.ok) return null;
  let body: unknown;
  try { body = await res.json(); } catch { return null; }
  const parsed = CoinGeckoChartResponse.safeParse(body);
  if (!parsed.success) return null;
  return parsed.data.prices.map((p) => ({ ms: p[0], price: p[1] }));
}

async function fetchSeriesDefiLlama(slug: string): Promise<PricePoint[] | null> {
  const coinId = `coingecko:${slug}`;
  const url = new URL(`https://coins.llama.fi/chart/${encodeURIComponent(coinId)}`);
  url.searchParams.set('period', '1d');
  url.searchParams.set('span', '365');
  let res: Response;
  try { res = await globalThis.fetch(url.toString()); } catch { return null; }
  if (!res.ok) return null;
  let body: unknown;
  try { body = await res.json(); } catch { return null; }
  const parsed = LlamaChartResponse.safeParse(body);
  if (!parsed.success) return null;
  const entry = parsed.data.coins[coinId];
  if (!entry) return null;
  return entry.prices.map((p) => ({ ms: p.timestamp * 1000, price: p.price }));
}

function mean(xs: number[]): number {
  return xs.reduce((s, x) => s + x, 0) / xs.length;
}

export async function fetchYieldAccrualEvents(
  assetAddress: string,
  coingeckoApiKey?: string
): Promise<AccrualEvent[]> {
  const slug = YIELD_BEARING_TO_COINGECKO[assetAddress.toLowerCase()];
  if (!slug) return [];

  let series: PricePoint[] | null = null;
  if (coingeckoApiKey) series = await fetchSeriesCoinGecko(slug, coingeckoApiKey);
  if (series === null) series = await fetchSeriesDefiLlama(slug);
  if (series === null || series.length < MIN_SAMPLES) return [];

  // Fit an exponential growth curve. Use 7-day endpoint averages to absorb daily noise.
  // p(t) = earlyAvg * (1 + r)^(daysFromStart / 365)
  const earlyAvg = mean(series.slice(0, 7).map((p) => p.price));
  const lateAvg = mean(series.slice(-7).map((p) => p.price));
  const totalDays = (series[series.length - 1]!.ms - series[0]!.ms) / (1000 * 86_400);
  if (totalDays < MIN_SAMPLES || earlyAvg <= 0) return [];

  const fittedAnnualReturn = Math.pow(lateAvg / earlyAvg, 365 / totalDays) - 1;
  // Yield should be positive; if endpoint fit is negative, the asset broke. Use a tiny
  // floor to keep the expected-price function well-defined; the deviation signal will
  // still fire correctly.
  const r = Math.max(0.001, fittedAnnualReturn);
  const baseMs = series[0]!.ms;

  const events: AccrualEvent[] = [];
  let currentStart: number | null = null;
  let currentMax = 0;

  for (const point of series) {
    const daysFromStart = (point.ms - baseMs) / (1000 * 86_400);
    const expected = earlyAvg * Math.pow(1 + r, daysFromStart / 365);
    // Negative deviation only. Price *above* expected is fine, that's just outperformance.
    const negDev = expected > 0 ? Math.max(0, 1 - point.price / expected) : 0;

    if (currentStart === null) {
      if (negDev > NEGATIVE_DEVIATION_THRESHOLD) {
        currentStart = point.ms;
        currentMax = negDev;
      }
    } else {
      currentMax = Math.max(currentMax, negDev);
      if (negDev < RECOVERY_THRESHOLD) {
        events.push({
          startMs: currentStart,
          endMs: point.ms,
          maxDeviation: currentMax,
          recoveryHours: (point.ms - currentStart) / 3_600_000
        });
        currentStart = null;
        currentMax = 0;
      }
    }
  }
  if (currentStart !== null) {
    events.push({ startMs: currentStart, endMs: null, maxDeviation: currentMax, recoveryHours: null });
  }
  return events;
}
