// Pin strategy-v1.md and allocation-methodology.md to Lighthouse, print the resulting CIDs and the
// sha256 hash of the methodology doc. The output is consumed by the (coworker-owned) identity
// register step, which writes the strategy CID onto Architect's ERC-8004 token.
//
// Run with: ARCHITECT_DRY_RUN=true pnpm --filter @strata/architect exec tsx scripts/upload-strategy.ts
//
// ARCHITECT_DRY_RUN=true is required: this script only needs the Lighthouse API key, not the
// on-chain addresses or private key that live mode requires.

import { readFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { pinYieldMap } from '@strata/scout/ipfs';
import { loadConfig } from '../src/config.js';

async function main(): Promise<void> {
  const cfg = loadConfig();
  const strategyMd = await readFile(new URL('../docs/strategy-v1.md', import.meta.url), 'utf8');
  const methodologyMd = await readFile(new URL('../docs/allocation-methodology.md', import.meta.url), 'utf8');

  const methodologyHash = '0x' + createHash('sha256').update(methodologyMd).digest('hex');

  const strategyPin = await pinYieldMap(
    { kind: 'architect-strategy', version: 'v1', body: strategyMd, methodologyHash },
    { pinataJwt: cfg.ipfs.pinataJwt }
  );
  const methodologyPin = await pinYieldMap(
    { kind: 'architect-allocation-methodology', version: 'v1', body: methodologyMd },
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
