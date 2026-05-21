import { z } from 'zod';
import { Tranche as ScoutTranche } from '@strata/scout/types';

const Address = z.string().regex(/^0x[a-fA-F0-9]{40}$/);
const Bytes32 = z.string().regex(/^0x[a-fA-F0-9]{64}$/);
const Uint256Dec = z.string().regex(/^\d+$/);          // proposalId as decimal string

export const Tranche = ScoutTranche;
export type Tranche = z.infer<typeof Tranche>;

export const TrancheAllocationSchema = z.object({
  bps: z.number().int().min(0).max(10_000),
  positions: z.record(z.string(), z.number().int().min(0).max(10_000))
});

export const AllocationProposalBaseSchema = z.object({
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
});

function applyAllocationInvariants(
  p: { tranches: { senior: { bps: number; positions: Record<string, number> }; mezzanine: { bps: number; positions: Record<string, number> }; junior: { bps: number; positions: Record<string, number> } } },
  ctx: z.RefinementCtx
) {
  const total = p.tranches.senior.bps + p.tranches.mezzanine.bps + p.tranches.junior.bps;
  if (total !== 0 && total !== 10_000) {
    ctx.addIssue({ code: z.ZodIssueCode.custom, message: `tranche bps must sum to 10000 or 0 (zero-state), got ${total}` });
  }
  for (const [tr, alloc] of Object.entries(p.tranches)) {
    const sum = Object.values(alloc.positions).reduce((s, v) => s + (v as number), 0);
    if (alloc.bps > 0 && sum !== 10_000) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: `${tr} positions must sum to 10000 bps, got ${sum}` });
    }
  }
}

// Schema for a proposal draft (no signature field) - used by buildProposal for validation.
export const AllocationProposalDraftSchema = AllocationProposalBaseSchema
  .omit({ signature: true })
  .superRefine(applyAllocationInvariants);

export const AllocationProposalSchema = AllocationProposalBaseSchema.superRefine(applyAllocationInvariants);
export type AllocationProposal = z.infer<typeof AllocationProposalSchema>;

export const NetExposureSchema = z.object({
  asset: Address,
  netNotionalUsd: z.number(),
  lastUpdatedMs: z.number().int()
});
export type NetExposure = z.infer<typeof NetExposureSchema>;
