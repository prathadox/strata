import { z } from 'zod';
import { HedgeDirection } from '@strata/scout/types';

const Address = z.string().regex(/^0x[a-fA-F0-9]{40}$/);
const Bytes32 = z.string().regex(/^0x[a-fA-F0-9]{64}$/);
const Uint256Dec = z.string().regex(/^\d+$/);
const Int256Dec = z.string().regex(/^-?\d+$/);
const Decimal = z.string().regex(/^-?\d+(\.\d+)?$/);

export { HedgeDirection };

export const HedgeIntentSchema = z.object({
  version: z.literal('1.0'),
  intentId: Uint256Dec,
  sourceSignalCid: z.string().min(1),
  sourceSignalBlock: Uint256Dec,
  hedgedAsset: Address,
  direction: HedgeDirection,
  notionalUsd: Int256Dec,
  contractSize: Decimal,
  spotPriceUsd: Decimal,
  spotPriceSource: z.literal('coingecko'),
  spotPriceTimestampMs: z.number().int().min(0),
  slippageToleranceBps: z.number().int().min(0).max(10_000),
  publisher: z.object({ address: Address, identityNFT: z.string() }),
  methodologyHash: Bytes32,
  codeCommit: z.string(),
  publishedAtMs: z.number().int().min(0),
  signature: z.string()
});
export type HedgeIntent = z.infer<typeof HedgeIntentSchema>;
