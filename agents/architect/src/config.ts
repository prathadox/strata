import { z } from 'zod';

const Env = z.object({
  MANTLE_RPC_URL: z.string().url(),
  MANTLE_RPC_URL_FALLBACK: z.string().url().default('https://mantle.publicgoods.network'),
  ARCHITECT_PRIVATE_KEY: z.string().regex(/^0x[a-fA-F0-9]{64}$/),
  // Optional when ARCHITECT_DRY_RUN is true (contracts not deployed yet).
  AGENT_EVENT_BUS_ADDRESS: z.string().regex(/^0x[a-fA-F0-9]{40}$/).optional(),
  IDENTITY_REGISTRY_ADDRESS: z.string().regex(/^0x[a-fA-F0-9]{40}$/).optional(),
  SCOUT_ADDRESS: z.string().regex(/^0x[a-fA-F0-9]{40}$/).optional(),
  LIGHTHOUSE_API_KEY: z.string().min(1),
  CYCLE_INTERVAL_MS: z.coerce.number().int().min(15_000).default(60_000),
  LOG_LEVEL: z.enum(['debug', 'info', 'warn', 'error']).default('info'),
  ARCHITECT_DRY_RUN: z.enum(['true', 'false']).default('false').transform((v) => v === 'true'),
  ARCHITECT_IDENTITY_NFT: z.string().min(1).default('ipfs://placeholder'),
  ARCHITECT_HEALTH_PORT: z.coerce.number().int().min(1).max(65535).default(9091),
  // Optional. When set, Task 16 generates a narrative reasoning blob via Gemini and
  // pins it alongside the deterministic proposal. Allocation math is unaffected.
  GEMINI_API_KEY: z.string().min(1).optional(),
  GEMINI_MODEL: z.string().default('gemini-2.5-flash')
});

export function loadConfig() {
  const parsed = Env.safeParse(process.env);
  if (!parsed.success) {
    throw new Error(`Config error: ${parsed.error.issues.map((i) => i.path.join('.')).join(', ')}`);
  }
  const env = parsed.data;
  if (!env.ARCHITECT_DRY_RUN && !env.AGENT_EVENT_BUS_ADDRESS) {
    throw new Error('Config error: AGENT_EVENT_BUS_ADDRESS required when ARCHITECT_DRY_RUN is not true');
  }
  if (!env.ARCHITECT_DRY_RUN && !env.IDENTITY_REGISTRY_ADDRESS) {
    throw new Error('Config error: IDENTITY_REGISTRY_ADDRESS required when ARCHITECT_DRY_RUN is not true');
  }
  return {
    chain: { id: 5000, rpcUrl: env.MANTLE_RPC_URL, rpcFallback: env.MANTLE_RPC_URL_FALLBACK },
    architect: {
      privateKey: env.ARCHITECT_PRIVATE_KEY as `0x${string}`,
      eventBus: (env.AGENT_EVENT_BUS_ADDRESS ?? '0x0000000000000000000000000000000000000000') as `0x${string}`,
      identityRegistry: (env.IDENTITY_REGISTRY_ADDRESS ?? '0x0000000000000000000000000000000000000000') as `0x${string}`,
      ...(env.SCOUT_ADDRESS !== undefined && { scoutAddress: env.SCOUT_ADDRESS as `0x${string}` }),
      dryRun: env.ARCHITECT_DRY_RUN,
      identityNFT: env.ARCHITECT_IDENTITY_NFT,
      healthPort: env.ARCHITECT_HEALTH_PORT
    },
    ipfs: { lighthouseApiKey: env.LIGHTHOUSE_API_KEY },
    llm: { geminiApiKey: env.GEMINI_API_KEY, model: env.GEMINI_MODEL },
    cycleIntervalMs: env.CYCLE_INTERVAL_MS,
    logLevel: env.LOG_LEVEL
  } as const;
}
export type ArchitectConfig = ReturnType<typeof loadConfig>;
