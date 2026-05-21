import { z } from 'zod';

const Address = z.string().regex(/^0x[a-fA-F0-9]{40}$/);
const Bytes32 = z.string().regex(/^0x[a-fA-F0-9]{64}$/);
const Uint256Dec = z.string().regex(/^\d+$/);          // proposalId as decimal string

export { Tranche } from '@strata/scout/types';
export type { Tranche as TrancheType } from '@strata/scout/types';

export const TrancheAllocationSchema = z.object({
  bps: z.number().int().min(0).max(10_000),
  positions: z.record(z.string(), z.number().int().min(0).max(10_000))
});

export const AllocationProposalSchema = z.object({
  version: z.literal('1.0'),
  proposalId: Uint256Dec,
  sourceMapCid: z.string().min(1),
  publishedAtMs: z.number().int().min(0),
  publisher: z.object({ address: Address, identityNFT: z.string() }),
  methodologyHash: Bytes32,
  codeCommit: z.string(),
  tranches: z.object({
    senior:    TrancheAllocationSchema,
    mezzanine: TrancheAllocationSchema,
    junior:    TrancheAllocationSchema
  }),
  netExposureAtProposalMs: z.record(z.string(), z.string()).default({}),
  signature: z.string()
}).superRefine((p, ctx) => {
  const total = p.tranches.senior.bps + p.tranches.mezzanine.bps + p.tranches.junior.bps;
  if (total !== 0 && total !== 10_000) {
    ctx.addIssue({ code: z.ZodIssueCode.custom, message: `tranche bps must sum to 10000 or 0 (zero-state), got ${total}` });
  }
  for (const [tr, alloc] of Object.entries(p.tranches)) {
    const sum = Object.values(alloc.positions).reduce((s, v) => s + v, 0);
    if (alloc.bps > 0 && sum !== 10_000) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: `${tr} positions must sum to 10000 bps, got ${sum}` });
    }
  }
});
export type AllocationProposal = z.infer<typeof AllocationProposalSchema>;

export const NetExposureSchema = z.object({
  asset: Address,
  netNotionalUsd: z.number(),
  lastUpdatedMs: z.number().int()
});
export type NetExposure = z.infer<typeof NetExposureSchema>;
