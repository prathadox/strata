import { z } from 'zod';

const Env = z.object({
  MANTLE_RPC_URL: z.string().url(),
  MANTLE_RPC_URL_FALLBACK: z.string().url().default('https://mantle.publicgoods.network'),
  SCOUT_PRIVATE_KEY: z.string().regex(/^0x[a-fA-F0-9]{64}$/),
  // Optional when SCOUT_DRY_RUN is true (contracts not deployed yet).
  AGENT_EVENT_BUS_ADDRESS: z.string().regex(/^0x[a-fA-F0-9]{40}$/).optional(),
  LIGHTHOUSE_API_KEY: z.string().min(1),
  NANSEN_API_KEY: z.string().min(1),
  CYCLE_INTERVAL_MS: z.coerce.number().int().min(15_000).default(60_000),
  LOG_LEVEL: z.enum(['debug', 'info', 'warn', 'error']).default('info'),
  // Skip the on-chain emit. Pipeline still ingests, scores, signs, and pins to IPFS.
  SCOUT_DRY_RUN: z.enum(['true', 'false']).default('false').transform((v) => v === 'true')
});

export function loadConfig() {
  const parsed = Env.safeParse(process.env);
  if (!parsed.success) {
    const missing = parsed.error.issues.map((i) => i.path.join('.')).join(', ');
    throw new Error(`Config error: ${missing}`);
  }
  const env = parsed.data;

  const dryRun = env.SCOUT_DRY_RUN;
  const eventBus = env.AGENT_EVENT_BUS_ADDRESS as `0x${string}` | undefined;
  if (!dryRun && !eventBus) {
    throw new Error('Config error: AGENT_EVENT_BUS_ADDRESS required when SCOUT_DRY_RUN is not set to true');
  }

  return {
    chain: { id: 5000, name: 'Mantle' as const, rpcUrl: env.MANTLE_RPC_URL, rpcFallback: env.MANTLE_RPC_URL_FALLBACK },
    scout: {
      privateKey: env.SCOUT_PRIVATE_KEY as `0x${string}`,
      eventBus: eventBus ?? ('0x0000000000000000000000000000000000000000' as `0x${string}`),
      dryRun
    },
    ipfs: { lighthouseApiKey: env.LIGHTHOUSE_API_KEY },
    apis: {
      nansen: env.NANSEN_API_KEY
    },
    cycleIntervalMs: env.CYCLE_INTERVAL_MS,
    logLevel: env.LOG_LEVEL
  } as const;
}
export type ScoutConfig = ReturnType<typeof loadConfig>;
