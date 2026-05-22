import { z } from 'zod';

const Env = z.object({
  MANTLE_RPC_URL: z.string().url(),
  MANTLE_RPC_URL_FALLBACK: z.string().url().default('https://mantle.publicgoods.network'),
  SENTINEL_PRIVATE_KEY: z.string().regex(/^0x[a-fA-F0-9]{64}$/),
  AGENT_EVENT_BUS_ADDRESS: z.string().regex(/^0x[a-fA-F0-9]{40}$/).optional(),
  IDENTITY_REGISTRY_ADDRESS: z.string().regex(/^0x[a-fA-F0-9]{40}$/).optional(),
  ARCHITECT_ADDRESS: z.string().regex(/^0x[a-fA-F0-9]{40}$/).optional(),
  SCOUT_ADDRESS: z.string().regex(/^0x[a-fA-F0-9]{40}$/).optional(),
  LIGHTHOUSE_API_KEY: z.string().min(1),
  LOG_LEVEL: z.enum(['debug', 'info', 'warn', 'error']).default('info'),
  SENTINEL_DRY_RUN: z.enum(['true', 'false']).default('false').transform((v) => v === 'true'),
  SENTINEL_IDENTITY_NFT: z.string().default('ipfs://placeholder'),
  SENTINEL_HEALTH_PORT: z.coerce.number().int().min(1).max(65535).default(9092),
  TOTAL_DEPOSITS_USD_BASELINE: z.coerce.number().positive().default(10_000_000)
});

export function loadConfig() {
  const parsed = Env.safeParse(process.env);
  if (!parsed.success) {
    throw new Error(`Config error: ${parsed.error.issues.map((i) => i.path.join('.')).join(', ')}`);
  }
  const env = parsed.data;
  if (!env.SENTINEL_DRY_RUN && !env.AGENT_EVENT_BUS_ADDRESS) {
    throw new Error('Config error: AGENT_EVENT_BUS_ADDRESS required when SENTINEL_DRY_RUN is not true');
  }
  if (!env.SENTINEL_DRY_RUN && !env.IDENTITY_REGISTRY_ADDRESS) {
    throw new Error('Config error: IDENTITY_REGISTRY_ADDRESS required when SENTINEL_DRY_RUN is not true');
  }
  return {
    chain: { id: 5000, rpcUrl: env.MANTLE_RPC_URL, rpcFallback: env.MANTLE_RPC_URL_FALLBACK },
    sentinel: {
      privateKey: env.SENTINEL_PRIVATE_KEY as `0x${string}`,
      eventBus: (env.AGENT_EVENT_BUS_ADDRESS ?? '0x0000000000000000000000000000000000000000') as `0x${string}`,
      identityRegistry: (env.IDENTITY_REGISTRY_ADDRESS ?? '0x0000000000000000000000000000000000000000') as `0x${string}`,
      ...(env.ARCHITECT_ADDRESS ? { architectAddress: env.ARCHITECT_ADDRESS as `0x${string}` } : {}),
      ...(env.SCOUT_ADDRESS ? { scoutAddress: env.SCOUT_ADDRESS as `0x${string}` } : {}),
      identityNFT: env.SENTINEL_IDENTITY_NFT,
      dryRun: env.SENTINEL_DRY_RUN,
      healthPort: env.SENTINEL_HEALTH_PORT,
      totalDepositsBaselineUsd: env.TOTAL_DEPOSITS_USD_BASELINE
    },
    ipfs: { lighthouseApiKey: env.LIGHTHOUSE_API_KEY },
    logLevel: env.LOG_LEVEL
  } as const;
}
export type SentinelConfig = ReturnType<typeof loadConfig>;
