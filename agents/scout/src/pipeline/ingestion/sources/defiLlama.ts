import { z } from 'zod';
import type { SourceFetcher } from '../sourceFetcher.js';
import type { YieldOpportunity, SourceProtocol } from '../../../types.js';

const LlamaPool = z.object({
  chain: z.string(),
  project: z.string(),
  symbol: z.string(),
  underlyingTokens: z.array(z.string()).nullish(),
  apy: z.number().nullable(),
  // DefiLlama splits APY into apyBase (real protocol yield) and apyReward (token emissions).
  // Either may be null when the pool doesn't expose the split.
  apyBase: z.number().nullable().optional(),
  apyReward: z.number().nullable().optional(),
  tvlUsd: z.number().nullable(),
  pool: z.string()
});
const LlamaResponse = z.object({ data: z.array(LlamaPool) });

const PROJECT_TO_SOURCE: Record<string, SourceProtocol> = {
  'aave-v3': 'aave',
  'ondo-finance': 'ondo',
  // Mapped from the actual DefiLlama project slugs returned for chain=Mantle.
  // Tier mapping below is by *risk class*, not vendor name. See protocolConfig.ts
  // for the meta each bucket carries.
  'ondo-yield-assets': 'ondo',          // RWA, tokenized T-bill yield, custodial
  'ethena': 'ethena',                   // synthetic dollar staking (if/when listed standalone)
  'ethena-usde': 'ethena',
  'lendle-pooled-markets': 'mantleVault', // Mantle-native lending, attested
  'minterest': 'mantleVault',           // Mantle-native lending
  'aurelius': 'mantleVault',            // Mantle-native lending/yield
  'woofi-earn': 'cian',                 // strategy aggregator
  'beefy': 'cian',                      // strategy aggregator
  'circuit-protocol': 'cian',           // strategy/aggregator
  'fluxion-network': 'agni',            // Mantle DEX LP
  'merchant-moe': 'merchantMoe',        // Mantle liquidity book LP
  'solv-basis-trading': 'fbtc',         // BTC basis strategy
  'clearpool-lending': 'fbtc'           // institutional pool
};

const PLACEHOLDER_ASSET = '0x0000000000000000000000000000000000000000';
const ADDRESS_RE = /^0x[a-fA-F0-9]{40}$/;

export class DefiLlamaFetcher implements SourceFetcher {
  readonly source = 'defillama' as const;

  async fetch(): Promise<YieldOpportunity[]> {
    const res = await globalThis.fetch('https://yields.llama.fi/pools');
    const body = await res.json();
    const parsed = LlamaResponse.parse(body);
    const now = Date.now();
    return parsed.data
      .filter((p) => p.chain === 'Mantle')
      .filter((p) => p.apy !== null && p.tvlUsd !== null && p.apy > 0)
      .filter((p) => PROJECT_TO_SOURCE[p.project] !== undefined)
      .map((p) => {
        const source = PROJECT_TO_SOURCE[p.project]!;
        const underlying = p.underlyingTokens?.[0];
        const asset =
          underlying && ADDRESS_RE.test(underlying)
            ? (underlying.toLowerCase() as `0x${string}`)
            : (PLACEHOLDER_ASSET as `0x${string}`);
        // If apyBase is published, use it as the canonical real yield.
        // Otherwise fall back to total apy (apyBase missing tends to mean "lending pool
        // where all of it is base"). apyReward stays separate either way.
        const apyBasePct = p.apyBase ?? p.apy ?? 0;
        const apyRewardPct = p.apyReward ?? 0;
        return {
          id: `${source}:${p.pool}`,
          source,
          asset,
          apy: apyBasePct / 100,
          apyReward: apyRewardPct / 100,
          apyType: 'variable' as const,
          tvlUsd: p.tvlUsd ?? 0,
          lastUpdatedMs: now,
          raw: p
        };
      });
  }
}
