import { YieldMapSchema, type YieldMap } from '@strata/scout/types';

const GATEWAYS = [
  'https://gateway.pinata.cloud/ipfs/',
  'https://gateway.lighthouse.storage/ipfs/',
  'https://ipfs.io/ipfs/',
  'https://dweb.link/ipfs/'
] as const;

const TIMEOUT_MS = 10_000;

export async function fetchYieldMapByCid(cid: string): Promise<YieldMap> {
  let lastError: unknown = null;
  for (const base of GATEWAYS) {
    try {
      const controller = new AbortController();
      const t = setTimeout(() => controller.abort(), TIMEOUT_MS);
      let res: Response;
      try {
        res = await globalThis.fetch(base + cid, { signal: controller.signal });
      } finally {
        clearTimeout(t);
      }
      if (!res.ok) {
        lastError = new Error(`${base}: HTTP ${res.status}`);
        continue;
      }
      const json = await res.json();
      const parsed = YieldMapSchema.safeParse(json);
      if (!parsed.success) {
        lastError = new Error(`${base}: schema mismatch: ${parsed.error.message}`);
        continue;
      }
      return parsed.data;
    } catch (err) {
      lastError = err;
    }
  }
  throw new Error(
    `fetchYieldMapByCid: all gateways failed for ${cid}: ${(lastError as Error)?.message ?? String(lastError)}`
  );
}
