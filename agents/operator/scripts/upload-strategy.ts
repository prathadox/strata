import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { pinJsonToLighthouse } from '@strata/scout/ipfs';

async function main(): Promise<void> {
  const apiKey = process.env.PINATA_JWT;
  if (!apiKey) throw new Error('PINATA_JWT is required');
  const strategy = readFileSync('agents/operator/docs/strategy-v1.md', 'utf-8');
  const methodology = readFileSync('agents/operator/docs/hedge-methodology.md', 'utf-8');
  const stratCid = await pinJsonToLighthouse(JSON.stringify({ kind: 'strategy', text: strategy }), apiKey);
  const methCid = await pinJsonToLighthouse(JSON.stringify({ kind: 'hedge-methodology', text: methodology }), apiKey);
  const methHash = '0x' + createHash('sha256').update(methodology).digest('hex');
  console.log(JSON.stringify({ strategyCid: stratCid, methodologyCid: methCid, methodologyHash: methHash }, null, 2));
}
main().catch((e) => { console.error(e); process.exit(1); });
