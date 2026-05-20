// Depeg history. Two sources, picked at call time:
//   1) CoinGecko Demo API when a key is provided. Preferred: longer history, daily
//      granularity, well-curated stable-asset entries.
//   2) DefiLlama coins API as a keyless fallback. Same coingecko slugs work as ids.
//
// The compression algorithm (deviation > 2% starts an event, deviation < 0.5% ends it)
// is shared. The state machine over the price series is identical regardless of source.

import { z } from 'zod';
import type { z as zType } from 'zod';
import { DepegEventSchema } from '../../types.js';

type DepegEvent = zType.infer<typeof DepegEventSchema>;

const STABLE_TO_COINGECKO_ID: Record<string, string> = {
  // USDY (Ondo) on Mantle, replace with real address
  '0x5be26527e817998a7206475496fde1e68957c5a6': 'ondo-us-dollar-yield',
  // sUSDe (Ethena) on Mantle, replace with real address
  '0x211cc4dd073734da055fbf44a2b4667d5e5fe5d2': 'ethena-staked-usde',
  // USDe (Ethena) on Mantle
  '0x5d3a1ff2b6bab83b63cd9ad0787074081a52ef34': 'ethena-usde',
  // USDC.e (Mantle bridged)
  '0x09bc4e0d864854c6afb6eb9a9cdf58ac190d0df9': 'usd-coin',
  // USDT
  '0x201eba5cc46d216ce6dc03f6a759e8e766e956ae': 'tether'
};

const DEVIATION_THRESHOLD = 0.02;
const RECOVERY_THRESHOLD = 0.005;

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
  try {
    res = await globalThis.fetch(url.toString(), { headers: { 'x-cg-demo-api-key': apiKey } });
  } catch { return null; }
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

function compressDeviations(series: PricePoint[]): DepegEvent[] {
  const events: DepegEvent[] = [];
  let currentStart: number | null = null;
  let currentMax = 0;
  for (const point of series) {
    const dev = Math.abs(point.price - 1);
    if (currentStart === null) {
      if (dev > DEVIATION_THRESHOLD) {
        currentStart = point.ms;
        currentMax = dev;
      }
    } else {
      currentMax = Math.max(currentMax, dev);
      if (dev < RECOVERY_THRESHOLD) {
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

export async function fetchDepegHistory(
  assetAddress: string,
  coingeckoApiKey?: string
): Promise<DepegEvent[]> {
  const slug = STABLE_TO_COINGECKO_ID[assetAddress.toLowerCase()];
  if (!slug) return [];

  // Prefer CoinGecko when a key is provided. Fall back to DefiLlama coins otherwise,
  // and also if CoinGecko returns nothing usable (rate limit, key revoked, etc).
  let series: PricePoint[] | null = null;
  if (coingeckoApiKey) series = await fetchSeriesCoinGecko(slug, coingeckoApiKey);
  if (series === null) series = await fetchSeriesDefiLlama(slug);
  if (series === null) return [];

  return compressDeviations(series);
}
