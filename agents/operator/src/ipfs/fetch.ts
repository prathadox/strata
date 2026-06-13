import { z } from 'zod';

const Address = z.string().regex(/^0x[a-fA-F0-9]{40}$/);
const Bytes32 = z.string().regex(/^0x[a-fA-F0-9]{64}$/);
const Uint256Dec = z.string().regex(/^\d+$/);
const Int256Dec = z.string().regex(/^-?\d+$/);

export const HedgeSignalSchema = z.object({
  version: z.literal('1.0'),
  signalId: Uint256Dec,
  sourceVerdictCid: z.string().min(1),
  sourceProposalId: Uint256Dec,
  hedgedAsset: Address,
  targetNotionalUsd: Int256Dec,
  direction: z.enum(['long', 'short']),
  publisher: z.object({ address: Address, identityNFT: z.string() }),
  methodologyHash: Bytes32,
  codeCommit: z.string(),
  publishedAtMs: z.number().int().min(0),
  signature: z.string()
});
export type HedgeSignal = z.infer<typeof HedgeSignalSchema>;

const GATEWAYS = [
  'https://gateway.pinata.cloud/ipfs/',
  'https://gateway.lighthouse.storage/ipfs/',
  'https://ipfs.io/ipfs/',
  'https://dweb.link/ipfs/'
];
const FETCH_TIMEOUT_MS = 10_000;

export async function fetchHedgeSignalByCid(cid: string): Promise<HedgeSignal> {
  const errors: string[] = [];
  for (const gw of GATEWAYS) {
    const ac = new AbortController();
    const t = setTimeout(() => ac.abort(), FETCH_TIMEOUT_MS);
    try {
      const res = await fetch(`${gw}${cid}`, { signal: ac.signal });
      if (!res.ok) { errors.push(`${gw}: HTTP ${res.status}`); continue; }
      const raw = await res.json();
      const parsed = HedgeSignalSchema.safeParse(raw);
      if (!parsed.success) {
        throw new Error(`fetchHedgeSignalByCid: invalid schema for ${cid}: ${parsed.error.message}`);
      }
      return parsed.data;
    } catch (e) {
      errors.push(`${gw}: ${(e as Error).message}`);
    } finally { clearTimeout(t); }
  }
  throw new Error(`all gateways failed for ${cid}: ${errors.join('; ')}`);
}
