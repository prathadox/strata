// Pin strategy-v1.md and scoring-methodology.md to Lighthouse, print the resulting CIDs and the
// sha256 hash of the methodology doc. The output is consumed by the (coworker-owned) identity
// register step, which writes the strategy CID onto Scout's ERC-8004 token.
//
// Run with: pnpm --filter @strata/scout exec tsx scripts/upload-strategy.ts

import { readFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { pinYieldMap } from '../src/publication/ipfs.js';
import { loadConfig } from '../src/config.js';

async function main(): Promise<void> {
  const cfg = loadConfig();
  const strategyMd = await readFile(new URL('../docs/strategy-v1.md', import.meta.url), 'utf8');
  const methodologyMd = await readFile(new URL('../docs/scoring-methodology.md', import.meta.url), 'utf8');

  const methodologyHash = '0x' + createHash('sha256').update(methodologyMd).digest('hex');

  const strategyPin = await pinYieldMap(
    { kind: 'scout-strategy', version: 'v1', body: strategyMd, methodologyHash },
    { pinataJwt: cfg.ipfs.pinataJwt }
  );
  const methodologyPin = await pinYieldMap(
    { kind: 'scout-scoring-methodology', version: 'v1', body: methodologyMd },
    { pinataJwt: cfg.ipfs.pinataJwt }
  );

  process.stdout.write(JSON.stringify({
    strategyCid: strategyPin.cid,
    methodologyCid: methodologyPin.cid,
    methodologyHash
  }, null, 2) + '\n');
}

main().catch((err) => {
  process.stderr.write(`upload-strategy failed: ${(err as Error).message}\n`);
  process.exitCode = 1;
});
