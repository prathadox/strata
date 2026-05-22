import { z } from 'zod';
import { VerdictLevel, HedgeDirection } from '@strata/scout/types';

const Address = z.string().regex(/^0x[a-fA-F0-9]{40}$/);
const Bytes32 = z.string().regex(/^0x[a-fA-F0-9]{64}$/);
const Uint256Dec = z.string().regex(/^\d+$/);
const Int256Dec = z.string().regex(/^-?\d+$/);

export { VerdictLevel, HedgeDirection };

export const RiskReasonSchema = z.object({
  severity: VerdictLevel,
  code: z.string().min(1),
  target: z.string().min(1),
  message: z.string()
});
export type RiskReason = z.infer<typeof RiskReasonSchema>;

export const RiskVerdictSchema = z.object({
  version: z.literal('1.0'),
  verdictId: Uint256Dec,
  proposalId: Uint256Dec,
  sourceMapCid: z.string().min(1),
  sourceProposalCid: z.string().min(1),
  publishedAtMs: z.number().int().min(0),
  publisher: z.object({ address: Address, identityNFT: z.string() }),
  methodologyHash: Bytes32,
  codeCommit: z.string(),
  tranches: z.object({
    senior:    VerdictLevel,
    mezzanine: VerdictLevel,
    junior:    VerdictLevel
  }),
  perPositionVerdicts: z.record(z.string(), VerdictLevel).default({}),
  reasons: z.array(RiskReasonSchema).default([]),
  signature: z.string()
});
export type RiskVerdict = z.infer<typeof RiskVerdictSchema>;

export const HedgeSignalSchema = z.object({
  version: z.literal('1.0'),
  signalId: Uint256Dec,
  sourceVerdictCid: z.string().min(1),
  sourceProposalId: Uint256Dec,
  hedgedAsset: Address,
  targetNotionalUsd: Int256Dec,
  direction: HedgeDirection,
  publisher: z.object({ address: Address, identityNFT: z.string() }),
  methodologyHash: Bytes32,
  codeCommit: z.string(),
  publishedAtMs: z.number().int().min(0),
  signature: z.string()
});
export type HedgeSignal = z.infer<typeof HedgeSignalSchema>;
