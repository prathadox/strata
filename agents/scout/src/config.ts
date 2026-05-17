import { z } from 'zod';

const Env = z.object({
  MANTLE_RPC_URL: z.string().url(),
  MANTLE_RPC_URL_FALLBACK: z.string().url().default('https://mantle.publicgoods.network'),
  SCOUT_PRIVATE_KEY: z.string().regex(/^0x[a-fA-F0-9]{64}$/),
  AGENT_EVENT_BUS_ADDRESS: z.string().regex(/^0x[a-fA-F0-9]{40}$/),
  PINATA_JWT: z.string().min(1),
  WEB3_STORAGE_TOKEN: z.string().min(1),
  MANTLESCAN_API_KEY: z.string().min(1),
  NANSEN_API_KEY: z.string().min(1),
  ONEINCH_API_KEY: z.string().min(1),
  ODOS_API_KEY: z.string().optional(),
  COINGECKO_API_KEY: z.string().min(1),
  CIAN_API_KEY: z.string().optional(),
  ALLORA_API_KEY: z.string().optional(),
  ORAKLE_API_KEY: z.string().optional(),
  CYCLE_INTERVAL_MS: z.coerce.number().int().min(15_000).default(60_000),
  LOG_LEVEL: z.enum(['debug','info','warn','error']).default('info')
});

export function loadConfig() {
  const parsed = Env.safeParse(process.env);
  if (!parsed.success) {
    const missing = parsed.error.issues.map(i => i.path.join('.')).join(', ');
    throw new Error(`Config error: ${missing}`);
  }
  const env = parsed.data;
  return {
    chain: { id: 5000, name: 'Mantle' as const, rpcUrl: env.MANTLE_RPC_URL, rpcFallback: env.MANTLE_RPC_URL_FALLBACK },
    scout: { privateKey: env.SCOUT_PRIVATE_KEY as `0x${string}`, eventBus: env.AGENT_EVENT_BUS_ADDRESS as `0x${string}` },
    ipfs: { pinataJwt: env.PINATA_JWT, web3StorageToken: env.WEB3_STORAGE_TOKEN },
    apis: {
      mantlescan: env.MANTLESCAN_API_KEY,
      nansen: env.NANSEN_API_KEY,
      oneinch: env.ONEINCH_API_KEY,
      odos: env.ODOS_API_KEY,
      coingecko: env.COINGECKO_API_KEY,
      cian: env.CIAN_API_KEY,
      allora: env.ALLORA_API_KEY,
      orakle: env.ORAKLE_API_KEY
    },
    cycleIntervalMs: env.CYCLE_INTERVAL_MS,
    logLevel: env.LOG_LEVEL
  } as const;
}
export type ScoutConfig = ReturnType<typeof loadConfig>;
