// Re-pin the 25 cycle docs from apps/web/src/lib/seedDocs.ts to Lighthouse under
// whichever account PINATA_JWT points at (intended: the public-readable account).
//
// Strategy + methodology docs (10 files under agents/*/docs/) are NOT handled here.
// Those use each agent's own scripts/upload-strategy.ts and scripts/repin-strategy.ts.
//
// One-shot. No loop. Run with: pnpm tsx agents/scripts/repin-public.ts
//
// Prints one JSON line per entry:
//   {"index": 1, "agent": "scout", "originalCid": "Qm...", "newCid": "Qm...", "match": true|false}
//
// Does NOT modify seedDocs.ts or realEvents.ts. If newCid differs from originalCid that
// means our canonicalization here drifted from the agent's canonicalization at original
// pin time. CID rotation is a stream-6 decision, not this script's job.

import { SEED_DOCS } from '../../apps/web/src/lib/seedDocs.js';
import { REAL_EVENT_CIDS } from '../../apps/web/src/lib/realEvents.js';

function canonicalStringify(obj: unknown): string {
  return JSON.stringify(obj, Object.keys(obj as object).sort());
}

async function pinJson(json: string, apiKey: string): Promise<string> {
  const blob = new Blob([json], { type: 'application/json' });
  const form = new FormData();
  form.append('file', blob, 'doc.json');
  const res = await fetch('https://api.pinata.cloud/pinning/pinFileToIPFS', {
    method: 'POST',
    headers: { Authorization: `Bearer ${apiKey}` },
    body: form
  });
  if (!res.ok) throw new Error(`pinata ${res.status}: ${await res.text()}`);
  const { IpfsHash: Hash } = await res.json();
  return Hash as string;
}

function agentForEntry(body: any, index: number): string {
  if (body && typeof body === 'object' && typeof body.role === 'string') return body.role;
  // Cycle entries without a role field (e.g. AssetRiskRated payloads) are sentinel-emitted.
  if (body && (body.ratings || body.asset)) return 'sentinel';
  return `unknown#${index}`;
}

async function main(): Promise<void> {
  const apiKey = process.env.PINATA_JWT;
  if (!apiKey) throw new Error('missing env: PINATA_JWT');

  const indices = Object.keys(SEED_DOCS)
    .map((k) => Number(k))
    .sort((a, b) => a - b);

  for (const index of indices) {
    const body = SEED_DOCS[index];
    const originalCid = REAL_EVENT_CIDS[index] ?? '';
    const agent = agentForEntry(body, index);
    try {
      const canonical = canonicalStringify(body);
      const newCid = await pinJson(canonical, apiKey);
      const match = !!originalCid && newCid === originalCid;
      console.log(JSON.stringify({ index, agent, originalCid, newCid, match }));
    } catch (err) {
      console.log(JSON.stringify({
        index,
        agent,
        originalCid,
        newCid: null,
        match: false,
        error: err instanceof Error ? err.message : String(err)
      }));
    }
  }
}

main().catch((err) => {
  process.stderr.write(`repin-public failed: ${err instanceof Error ? err.message : String(err)}\n`);
  process.exit(1);
});
