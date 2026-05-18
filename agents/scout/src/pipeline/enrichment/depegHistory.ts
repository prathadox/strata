// Depeg history is fetched from DefiLlama's coins API (coins.llama.fi).
// Same vendor as the yield fetcher, no API key needed, generous public rate limit.
// We use coingecko slugs as the coin id (e.g. "coingecko:tether") because the
// stables we care about all have well-known coingecko entries and the price is
// universal, not chain-specific.

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

const LlamaChartResponse = z.object({
  coins: z.record(
    z.string(),
    z.object({
      prices: z.array(z.object({ timestamp: z.number(), price: z.number() }))
    })
  )
});

export async function fetchDepegHistory(assetAddress: string): Promise<DepegEvent[]> {
  const slug = STABLE_TO_COINGECKO_ID[assetAddress.toLowerCase()];
  if (!slug) return [];

  const coinId = `coingecko:${slug}`;
  const url = new URL(`https://coins.llama.fi/chart/${encodeURIComponent(coinId)}`);
  url.searchParams.set('period', '1d');
  url.searchParams.set('span', '365');

  const res = await globalThis.fetch(url.toString());
  if (!res.ok) return [];
  const body = await res.json();
  const parsed = LlamaChartResponse.safeParse(body);
  if (!parsed.success) return [];

  const entry = parsed.data.coins[coinId];
  if (!entry) return [];

  const events: DepegEvent[] = [];
  let currentStart: number | null = null;
  let currentMax = 0;

  for (const point of entry.prices) {
    const ms = point.timestamp * 1000;
    const price = point.price;
    const dev = Math.abs(price - 1);
    if (currentStart === null) {
      if (dev > DEVIATION_THRESHOLD) {
        currentStart = ms;
        currentMax = dev;
      }
    } else {
      currentMax = Math.max(currentMax, dev);
      if (dev < RECOVERY_THRESHOLD) {
        events.push({
          startMs: currentStart,
          endMs: ms,
          maxDeviation: currentMax,
          recoveryHours: (ms - currentStart) / 3_600_000
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
