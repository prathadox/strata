// Pin strategy-v1.md and risk-methodology.md to Lighthouse, print the resulting CIDs and the
// sha256 hash of the methodology doc. The output is consumed by the (coworker-owned) identity
// register step, which writes the strategy CID onto Sentinel's ERC-8004 token.
//
// Run with: pnpm --filter @strata/sentinel exec tsx scripts/upload-strategy.ts

import { readFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { pinJsonToPinata } from '@strata/scout/ipfs';

async function main(): Promise<void> {
  const apiKey = process.env.PINATA_JWT;
  if (!apiKey) throw new Error('PINATA_JWT is required');

  const strategyMd = await readFile(new URL('../docs/strategy-v1.md', import.meta.url), 'utf8');
  const methodologyMd = await readFile(new URL('../docs/risk-methodology.md', import.meta.url), 'utf8');

  const methodologyHash = '0x' + createHash('sha256').update(methodologyMd).digest('hex');

  const strategyCid = await pinJsonToPinata(
    JSON.stringify({ kind: 'sentinel-strategy', version: 'v1', body: strategyMd, methodologyHash }),
    apiKey
  );
  const methodologyCid = await pinJsonToPinata(
    JSON.stringify({ kind: 'sentinel-risk-methodology', version: 'v1', body: methodologyMd }),
    apiKey
  );

  process.stdout.write(JSON.stringify({
    strategyCid,
    methodologyCid,
    methodologyHash
  }, null, 2) + '\n');
}

main().catch((err) => {
  process.stderr.write(`upload-strategy failed: ${(err as Error).message}\n`);
  process.exitCode = 1;
});
