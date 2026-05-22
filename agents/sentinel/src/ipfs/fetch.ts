import { z } from 'zod';
import { YieldMapSchema, type YieldMap } from '@strata/scout/types';

const GATEWAYS = [
  'https://gateway.lighthouse.storage/ipfs/',
  'https://ipfs.io/ipfs/',
  'https://dweb.link/ipfs/'
] as const;

const FETCH_TIMEOUT_MS = 10_000;

// AllocationProposal schema is duplicated here to avoid a circular workspace
// import. Sentinel does not import @strata/architect (would create a cycle).
const Address = z.string().regex(/^0x[a-fA-F0-9]{40}$/);
const Bytes32 = z.string().regex(/^0x[a-fA-F0-9]{64}$/);
const Uint256Dec = z.string().regex(/^\d+$/);
const TrancheAllocationSchema = z.object({
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
  narrative: z.string().nullable().default(null),
  signature: z.string()
});
export type AllocationProposal = z.infer<typeof AllocationProposalSchema>;

async function fetchJsonWithFallback(cid: string): Promise<unknown> {
  const errors: string[] = [];
  for (const gw of GATEWAYS) {
    const ac = new AbortController();
    const t = setTimeout(() => ac.abort(), FETCH_TIMEOUT_MS);
    try {
      const res = await fetch(`${gw}${cid}`, { signal: ac.signal });
      if (!res.ok) { errors.push(`${gw}: HTTP ${res.status}`); continue; }
      return await res.json();
    } catch (e) {
      errors.push(`${gw}: ${(e as Error).message}`);
    } finally { clearTimeout(t); }
  }
  throw new Error(`all gateways failed for ${cid}: ${errors.join('; ')}`);
}

export async function fetchAllocationProposalByCid(cid: string): Promise<AllocationProposal> {
  const raw = await fetchJsonWithFallback(cid);
  const parsed = AllocationProposalSchema.safeParse(raw);
  if (!parsed.success) {
    throw new Error(`fetchAllocationProposalByCid: invalid schema for ${cid}: ${parsed.error.message}`);
  }
  return parsed.data;
}

export async function fetchYieldMapByCid(cid: string): Promise<YieldMap> {
  const raw = await fetchJsonWithFallback(cid);
  const parsed = YieldMapSchema.safeParse(raw);
  if (!parsed.success) {
    throw new Error(`fetchYieldMapByCid: invalid schema for ${cid}: ${parsed.error.message}`);
  }
  return parsed.data;
}
