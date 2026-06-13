import { readFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { pinJsonToPinata } from '@strata/scout/ipfs';

async function main(): Promise<void> {
  const apiKey = process.env.PINATA_JWT;
  if (!apiKey) throw new Error('PINATA_JWT is required');

  const strategyMd = await readFile(new URL('../docs/strategy-v1.md', import.meta.url), 'utf8');
  const methodologyMd = await readFile(new URL('../docs/compliance-methodology.md', import.meta.url), 'utf8');

  const methodologyHash = '0x' + createHash('sha256').update(methodologyMd).digest('hex');

  const strategyCid = await pinJsonToPinata(
    JSON.stringify({ kind: 'compliance-strategy', version: 'v1', body: strategyMd, methodologyHash }),
    apiKey
  );
  const methodologyCid = await pinJsonToPinata(
    JSON.stringify({ kind: 'compliance-gate-methodology', version: 'v1', body: methodologyMd }),
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
