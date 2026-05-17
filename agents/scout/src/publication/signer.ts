import { keccak256, toBytes, type WalletClient, type Account } from 'viem';

export function canonicalStringify(value: unknown): string {
  if (value === null || typeof value !== 'object') return JSON.stringify(value);
  if (Array.isArray(value)) return `[${value.map(canonicalStringify).join(',')}]`;
  const obj = value as Record<string, unknown>;
  const keys = Object.keys(obj).sort();
  return `{${keys.map((k) => `${JSON.stringify(k)}:${canonicalStringify(obj[k])}`).join(',')}}`;
}

export interface SignedMap {
  mapHash: `0x${string}`;
  signature: `0x${string}`;
  canonicalBytes: Uint8Array;
}

export async function signYieldMap(
  payloadWithoutSig: unknown,
  wallet: WalletClient,
  account: Account
): Promise<SignedMap> {
  const unsignedCanonical = canonicalStringify({ ...(payloadWithoutSig as object), signature: '' });
  const unsignedBytes = toBytes(unsignedCanonical);
  const mapHash = keccak256(unsignedBytes);
  const signature = await wallet.signMessage({ account, message: { raw: mapHash } });
  const signed = { ...(payloadWithoutSig as object), signature };
  return { mapHash, signature, canonicalBytes: toBytes(canonicalStringify(signed)) };
}
