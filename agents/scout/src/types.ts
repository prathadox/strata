import { z } from 'zod';

export const SourceProtocol = z.enum([
  'ondo', 'ethena', 'meth', 'mantleVault', 'cian',
  'agni', 'merchantMoe', 'aave', 'fbtc', 'mortgageDemo'
]);
export type SourceProtocol = z.infer<typeof SourceProtocol>;

const Address = z.string().regex(/^0x[a-fA-F0-9]{40}$/, 'must be 0x-prefixed 20-byte address');

export const YieldOpportunitySchema = z.object({
  id: z.string().min(1),
  source: SourceProtocol,
  asset: Address,
  apy: z.number().min(0).max(10),       // 1000% cap as sanity guard
  apyType: z.enum(['fixed', 'variable']),
  tvlUsd: z.number().min(0),
  lastUpdatedMs: z.number().int().min(0),
  raw: z.unknown()
});
export type YieldOpportunity = z.infer<typeof YieldOpportunitySchema>;

export const DepegEventSchema = z.object({
  startMs: z.number().int(),
  endMs: z.number().int().nullable(),
  maxDeviation: z.number(),             // fraction, e.g. 0.05 = 5%
  recoveryHours: z.number().nullable()
});

export const RiskFactorsSchema = z.object({
  contractAgeDays: z.number().nullable(),
  auditFactor: z.number().nullable(),    // 0.30 / 0.60 / 1.00
  tvlFactor: z.number().nullable(),
  depegEvents: z.array(DepegEventSchema).nullable(),
  oracleType: z.enum(['chainlink_dec','pyth','redstone','custom_multi','single']).nullable(),
  liquiditySlippageBps: z.record(z.string(), z.number()).nullable(),
  counterpartyClass: z.enum(['permissionless','attested_centralized','custodial']).nullable(),
  smartMoneySignal: z.object({
    smartHolderPct: z.number(),
    freshWalletInflowPct: z.number(),
    washTradeFlag: z.boolean()
  }).nullable()
});
export type RiskFactors = z.infer<typeof RiskFactorsSchema>;

export const Tranche = z.enum(['senior', 'mezzanine', 'junior']);
export type Tranche = z.infer<typeof Tranche>;

export const ScoredOpportunitySchema = YieldOpportunitySchema.extend({
  risk: RiskFactorsSchema,
  probabilities: z.object({
    exploit: z.number(), depeg: z.number(), oracle: z.number(),
    illiquid: z.number(), counterparty: z.number()
  }),
  severities: z.object({
    exploit: z.number(), depeg: z.number(), oracle: z.number(),
    illiquid: z.number(), counterparty: z.number()
  }),
  expectedLoss: z.number(),
  raapy: z.number(),
  confidence: z.number().min(0).max(1),
  score: z.number(),
  // Tranche categorisation (per-opportunity, populated by aggregation step):
  eligibleTranches: z.array(Tranche),
  primaryTranche: Tranche.nullable(),
  rejectionReasons: z.array(z.object({
    tranche: Tranche,
    reasons: z.array(z.string())
  }))
});
export type ScoredOpportunity = z.infer<typeof ScoredOpportunitySchema>;

export const YieldMapSchema = z.object({
  version: z.literal('1.0'),
  publishedAtMs: z.number().int(),
  publisher: z.object({ address: Address, identityNFT: z.string() }),
  methodologyHash: z.string(),
  codeCommit: z.string(),
  sourcesQueried: z.array(SourceProtocol),
  sourcesDegraded: z.array(SourceProtocol),
  opportunities: z.array(ScoredOpportunitySchema),
  perTranche: z.object({
    senior: z.array(z.string()),
    mezzanine: z.array(z.string()),
    junior: z.array(z.string())
  }),
  signature: z.string()
});
export type YieldMap = z.infer<typeof YieldMapSchema>;
