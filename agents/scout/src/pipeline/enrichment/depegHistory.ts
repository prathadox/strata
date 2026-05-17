import { z } from 'zod';
import type { z as zType } from 'zod';
import { DepegEventSchema } from '../../types.js';

type DepegEvent = zType.infer<typeof DepegEventSchema>;

const STABLE_TO_COINGECKO_ID: Record<string, string> = {
  // USDY (Ondo) on Mantle — replace with real address
  '0x5be26527e817998a7206475496fde1e68957c5a6': 'ondo-us-dollar-yield',
  // sUSDe (Ethena) on Mantle — replace with real address
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

const ChartResponse = z.object({
  prices: z.array(z.tuple([z.number(), z.number()]))
});

export async function fetchDepegHistory(
  assetAddress: string,
  coingeckoApiKey: string
): Promise<DepegEvent[]> {
  const id = STABLE_TO_COINGECKO_ID[assetAddress.toLowerCase()];
  if (!id) return [];

  const url = new URL(`https://api.coingecko.com/api/v3/coins/${id}/market_chart`);
  url.searchParams.set('vs_currency', 'usd');
  url.searchParams.set('days', '365');
  url.searchParams.set('interval', 'daily');

  const res = await globalThis.fetch(url.toString(), {
    headers: { 'x-cg-demo-api-key': coingeckoApiKey }
  });
  if (!res.ok) return [];
  const body = await res.json();
  const parsed = ChartResponse.safeParse(body);
  if (!parsed.success) return [];

  const events: DepegEvent[] = [];
  let currentStart: number | null = null;
  let currentMax = 0;

  for (const point of parsed.data.prices) {
    const ms = point[0];
    const price = point[1];
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
