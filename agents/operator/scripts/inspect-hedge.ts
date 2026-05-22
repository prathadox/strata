import { writeFileSync, readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { execSync } from 'node:child_process';
import { generatePrivateKey, privateKeyToAccount } from 'viem/accounts';
import { fetchHedgeSignalByCid } from '../src/ipfs/fetch.js';
import { verifyHedgeSignal } from '../src/verify/hedgeSignal.js';
import { fetchSpotUsd } from '../src/market/coingecko.js';
import { sizeHedge } from '../src/pipeline/sizeHedge.js';
import { buildIntent } from '../src/pipeline/buildIntent.js';

function arg(name: string): string | undefined {
  const i = process.argv.indexOf(`--${name}`);
  return i >= 0 ? process.argv[i + 1] : undefined;
}

async function main(): Promise<void> {
  const cid = arg('signal-cid');
  if (!cid) { console.error('usage: inspect-hedge --signal-cid <cid> [--block <n>]'); process.exit(2); }
  const blockStr = arg('block') ?? '0';

  process.env.OPERATOR_DRY_RUN = 'true';
  const cgKey = process.env.COINGECKO_API_KEY;
  if (!cgKey) { console.error('COINGECKO_API_KEY is required'); process.exit(2); }

  const methodology = readFileSync('agents/operator/docs/hedge-methodology.md', 'utf-8');
  const methodologyHash = '0x' + createHash('sha256').update(methodology).digest('hex');
  const codeCommit = execSync('git rev-parse HEAD').toString().trim();
  const account = privateKeyToAccount(generatePrivateKey());

  const signal = await fetchHedgeSignalByCid(cid);
  if (!signal) throw new Error('signal fetch returned null');
  await verifyHedgeSignal(signal);

  const spot = await fetchSpotUsd(signal.hedgedAsset, cgKey);
  const sizing = sizeHedge({
    targetNotionalUsd: BigInt(signal.targetNotionalUsd),
    hedgedAsset: signal.hedgedAsset as `0x${string}`
  }, spot);

  if (sizing.kind === 'skip') {
    writeFileSync('agents/operator/hedge-output.md', `# Hedge inspect\n\nResult: SKIPPED (${sizing.reason})\nspot=${spot}\nsignal=${signal.targetNotionalUsd}\n`);
    console.log('wrote agents/operator/hedge-output.md (skipped)');
    return;
  }

  const draft = buildIntent({
    sourceSignalCid: cid,
    sourceSignalBlock: BigInt(blockStr),
    hedgedAsset: signal.hedgedAsset,
    sizing,
    spotPriceUsd: spot,
    spotPriceTimestampMs: 1_700_000_000_000,
    publisherAddress: account.address,
    identityNFT: 'ipfs://placeholder',
    methodologyHash,
    codeCommit,
    now: () => 1_700_000_000_000
  });

  const lines = [
    `# Hedge inspect (dry-run)`,
    ``,
    `- signalCid: ${cid}`,
    `- hedgedAsset: ${draft.hedgedAsset}`,
    `- direction: ${draft.direction}`,
    `- notionalUsd: ${draft.notionalUsd}`,
    `- contractSize: ${draft.contractSize}`,
    `- spotPriceUsd: ${draft.spotPriceUsd}`,
    `- methodologyHash: ${methodologyHash}`,
    `- codeCommit: ${codeCommit}`
  ];
  writeFileSync('agents/operator/hedge-output.md', lines.join('\n') + '\n');
  console.log('wrote agents/operator/hedge-output.md');
}

main().catch((e) => { console.error(e); process.exit(1); });
