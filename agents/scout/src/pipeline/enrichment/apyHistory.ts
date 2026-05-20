// apyHistory.ts - fetch a pool's APY history from DefiLlama, compute volatility and drift.
// Volatility: stddev of apyBase over the last 90 daily samples (fraction).
// Drift: mean(recent 30d) / mean(older 60d). >1.5 means the APY is spiking recently.
// Both null on fetch failure or insufficient data; scoring downweights confidence accordingly.

import { z } from 'zod';

const ChartPoint = z.object({
  timestamp: z.string().or(z.number()),
  apy: z.number().nullable(),
  apyBase: z.number().nullable().optional()
});
const ChartResponse = z.object({
  status: z.string(),
  data: z.array(ChartPoint)
});

export interface ApyHistory {
  volatility: number;
  drift: number;
  samples: number;
}

function mean(xs: number[]): number {
  return xs.reduce((s, x) => s + x, 0) / xs.length;
}

function stddev(xs: number[]): number {
  if (xs.length < 2) return 0;
  const m = mean(xs);
  const variance = xs.reduce((s, x) => s + (x - m) ** 2, 0) / (xs.length - 1);
  return Math.sqrt(variance);
}

export async function fetchApyHistory(poolId: string): Promise<ApyHistory | null> {
  const url = `https://yields.llama.fi/chart/${encodeURIComponent(poolId)}`;
  let res: Response;
  try {
    res = await globalThis.fetch(url);
  } catch {
    return null;
  }
  if (!res.ok) return null;

  let body: unknown;
  try {
    body = await res.json();
  } catch {
    return null;
  }
  const parsed = ChartResponse.safeParse(body);
  if (!parsed.success || parsed.data.data.length < 30) return null;

  // Use the last 90 samples (daily). Prefer apyBase, fall back to apy.
  const tail = parsed.data.data.slice(-90);
  const series = tail
    .map((p) => p.apyBase ?? p.apy)
    .filter((x): x is number => x !== null && !Number.isNaN(x))
    .map((x) => x / 100); // percent -> fraction

  if (series.length < 14) return null;

  // Volatility over the whole window.
  const vol = stddev(series);

  // Drift: recent 30d mean vs older 60d mean. If we don't have a 60d window, fall back
  // to first half vs second half of whatever we have.
  let recent: number[], older: number[];
  if (series.length >= 90) {
    recent = series.slice(-30);
    older = series.slice(-90, -30);
  } else {
    const mid = Math.floor(series.length / 2);
    older = series.slice(0, mid);
    recent = series.slice(mid);
  }
  const olderMean = mean(older);
  const recentMean = mean(recent);
  const drift = olderMean > 0 ? recentMean / olderMean : 1;

  return { volatility: vol, drift, samples: series.length };
}
