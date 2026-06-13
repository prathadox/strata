import { z } from 'zod';

const Env = z.object({
  MANTLE_RPC_URL: z.string().url(),
  MANTLE_RPC_URL_FALLBACK: z.string().url().default('https://mantle.publicgoods.network'),
  OPERATOR_PRIVATE_KEY: z.string().regex(/^0x[a-fA-F0-9]{64}$/),
  AGENT_EVENT_BUS_ADDRESS: z.string().regex(/^0x[a-fA-F0-9]{40}$/).optional(),
  IDENTITY_REGISTRY_ADDRESS: z.string().regex(/^0x[a-fA-F0-9]{40}$/).optional(),
  SENTINEL_ADDRESS: z.string().regex(/^0x[a-fA-F0-9]{40}$/).optional(),
  PINATA_JWT: z.string().min(1),
  COINGECKO_API_KEY: z.string().min(1),
  LOG_LEVEL: z.enum(['debug', 'info', 'warn', 'error']).default('info'),
  OPERATOR_DRY_RUN: z.enum(['true', 'false']).default('false').transform((v) => v === 'true'),
  OPERATOR_IDENTITY_NFT: z.string().default('ipfs://placeholder'),
  OPERATOR_HEALTH_PORT: z.coerce.number().int().min(1).max(65535).default(9093)
});

export function loadConfig() {
  const parsed = Env.safeParse(process.env);
  if (!parsed.success) {
    throw new Error(`Config error: ${parsed.error.issues.map((i) => i.path.join('.')).join(', ')}`);
  }
  const env = parsed.data;
  if (!env.OPERATOR_DRY_RUN && !env.AGENT_EVENT_BUS_ADDRESS) {
    throw new Error('Config error: AGENT_EVENT_BUS_ADDRESS required when OPERATOR_DRY_RUN is not true');
  }
  if (!env.OPERATOR_DRY_RUN && !env.IDENTITY_REGISTRY_ADDRESS) {
    throw new Error('Config error: IDENTITY_REGISTRY_ADDRESS required when OPERATOR_DRY_RUN is not true');
  }
  return {
    chain: { id: 5000, rpcUrl: env.MANTLE_RPC_URL, rpcFallback: env.MANTLE_RPC_URL_FALLBACK },
    operator: {
      privateKey: env.OPERATOR_PRIVATE_KEY as `0x${string}`,
      eventBus: (env.AGENT_EVENT_BUS_ADDRESS ?? '0x0000000000000000000000000000000000000000') as `0x${string}`,
      identityRegistry: (env.IDENTITY_REGISTRY_ADDRESS ?? '0x0000000000000000000000000000000000000000') as `0x${string}`,
      ...(env.SENTINEL_ADDRESS ? { sentinelAddress: env.SENTINEL_ADDRESS as `0x${string}` } : {}),
      identityNFT: env.OPERATOR_IDENTITY_NFT,
      dryRun: env.OPERATOR_DRY_RUN,
      healthPort: env.OPERATOR_HEALTH_PORT
    },
    ipfs: { pinataJwt: env.PINATA_JWT },
    market: { coingeckoApiKey: env.COINGECKO_API_KEY },
    logLevel: env.LOG_LEVEL
  } as const;
}
export type OperatorConfig = ReturnType<typeof loadConfig>;
