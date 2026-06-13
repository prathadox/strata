// Re-pin Scout's strategy and scoring methodology docs to Lighthouse so the strategy CID on the
// ERC-8004 identity registry stays reachable on public IPFS gateways. Prints one JSON object per
// line: {"file","cid","hash"?}. Does not push anything on-chain; that's the deployer's step.
//
// Run with: pnpm tsx agents/scout/scripts/repin-strategy.ts

import { readFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';

async function pinFile(content: string, filename: string, apiKey: string): Promise<string> {
  const blob = new Blob([content], { type: 'text/markdown' });
  const form = new FormData();
  form.append('file', blob, filename);
  const res = await fetch('https://api.pinata.cloud/pinning/pinFileToIPFS', {
    method: 'POST',
    headers: { Authorization: `Bearer ${apiKey}` },
    body: form
  });
  if (!res.ok) throw new Error(`pinata ${res.status}: ${await res.text()}`);
  const { IpfsHash: Hash } = await res.json();
  return Hash;
}

async function main() {
  const apiKey = process.env.PINATA_JWT;
  if (!apiKey) throw new Error('missing env: PINATA_JWT');

  const targets = [
    { file: 'strategy-v1.md', hash: false },
    { file: 'scoring-methodology.md', hash: true }
  ];

  for (const t of targets) {
    const body = await readFile(new URL(`../docs/${t.file}`, import.meta.url), 'utf8');
    const cid = await pinFile(body, t.file, apiKey);
    const out: Record<string, string> = { file: t.file, cid };
    if (t.hash) out.hash = '0x' + createHash('sha256').update(body).digest('hex');
    console.log(JSON.stringify(out));
  }
}

main();
