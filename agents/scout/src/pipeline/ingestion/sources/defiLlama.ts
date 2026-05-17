import { z } from 'zod';
import type { SourceFetcher } from '../sourceFetcher.js';
import type { YieldOpportunity, SourceProtocol } from '../../../types.js';

const LlamaPool = z.object({
  chain: z.string(),
  project: z.string(),
  symbol: z.string(),
  underlyingTokens: z.array(z.string()).nullish(),
  apy: z.number().nullable(),
  tvlUsd: z.number().nullable(),
  pool: z.string()
});
const LlamaResponse = z.object({ data: z.array(LlamaPool) });

const PROJECT_TO_SOURCE: Record<string, SourceProtocol> = {
  'aave-v3': 'aave',
  'ondo-finance': 'ondo',
  'ethena': 'ethena',
  'ethena-usde': 'ethena',
  'mantle-staked-ether': 'meth',
  'mantle-meth': 'meth',
  'mantle-mi4': 'mantleVault',
  'cian-protocol': 'cian',
  'agni-finance': 'agni',
  'merchant-moe': 'merchantMoe',
  'fbtc': 'fbtc'
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
        return {
          id: `${source}:${p.pool}`,
          source,
          asset,
          apy: (p.apy ?? 0) / 100,
          apyType: 'variable' as const,
          tvlUsd: p.tvlUsd ?? 0,
          lastUpdatedMs: now,
          raw: p
        };
      });
  }
}
