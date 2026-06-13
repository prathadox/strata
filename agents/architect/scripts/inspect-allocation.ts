// inspect-allocation.ts - fetch a YieldMap by CID, build an AllocationProposal,
// sign and pin it (dry run), then write a markdown report to proposal-output.md.
// No on-chain emit is performed regardless of env settings.
//
// Run:
//   pnpm --filter @strata/architect exec tsx scripts/inspect-allocation.ts --cid <cid>

import { writeFile, readFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { execSync } from 'node:child_process';

// Tiny .env loader. Reads agents/architect/.env if present and sets process.env
// without overwriting anything already exported in the shell.
async function loadEnv(): Promise<void> {
  const envPath = new URL('../.env', import.meta.url);
  if (!existsSync(envPath)) return;
  const text = await readFile(envPath, 'utf8');
  for (const line of text.split('\n')) {
    const m = line.match(/^\s*([A-Z_][A-Z0-9_]*)\s*=\s*(.*?)\s*$/);
    if (!m) continue;
    const key = m[1]!;
    if (process.env[key] !== undefined) continue;
    const val = m[2]!.replace(/^["']|["']$/g, '');
    process.env[key] = val;
  }
}
await loadEnv();

// Force dry run before any config parsing.
process.env['ARCHITECT_DRY_RUN'] = 'true';

import { generatePrivateKey, privateKeyToAccount } from 'viem/accounts';
import { createWalletClient, http } from 'viem';
import { mainnet } from 'viem/chains';

import { loadConfig } from '../src/config.js';
import { fetchYieldMapByCid } from '../src/ipfs/fetch.js';
import { verifyYieldMap } from '../src/verify/yieldMap.js';
import { buildProposal } from '../src/pipeline/buildProposal.js';
import { NetExposureLedger } from '../src/pipeline/netExposure.js';
import { signYieldMap } from '@strata/scout/signer';
import { pinYieldMap } from '@strata/scout/ipfs';

function parseCid(): string | null {
  const args = process.argv.slice(2);
  const idx = args.indexOf('--cid');
  if (idx === -1 || idx + 1 >= args.length) return null;
  return args[idx + 1]!;
}

function readMethodologyHash(): string {
  try {
    const buf = readFileSync(new URL('../docs/allocation-methodology.md', import.meta.url));
    return '0x' + createHash('sha256').update(buf).digest('hex');
  } catch {
    return '0x' + '0'.repeat(64);
  }
}

function readCodeCommit(): string {
  try {
    return execSync('git rev-parse --short HEAD', { stdio: ['ignore', 'pipe', 'ignore'] })
      .toString().trim();
  } catch {
    return 'unknown';
  }
}

async function main(): Promise<void> {
  const cid = parseCid();
  if (!cid) {
    process.stderr.write(
      'Usage: pnpm --filter @strata/architect exec tsx scripts/inspect-allocation.ts --cid <cid>\n'
    );
    process.exit(1);
  }

  const cfg = loadConfig();

  // Ephemeral signer - inspect mode does not use the real private key for signing.
  const ephemeralKey = generatePrivateKey();
  const account = privateKeyToAccount(ephemeralKey);
  const wallet = createWalletClient({
    account,
    chain: mainnet,
    transport: http('http://localhost:1')
  });

  const methodologyHash = readMethodologyHash();
  const codeCommit = readCodeCommit();
  const ledger = new NetExposureLedger();

  process.stderr.write(`fetching YieldMap CID: ${cid}\n`);
  const map = await fetchYieldMapByCid(cid);
  process.stderr.write(`fetched YieldMap, ${map.opportunities.length} opportunities\n`);

  // Verify signature (skip expectedScoutSigner check in inspect mode).
  await verifyYieldMap(map);
  process.stderr.write('signature verified\n');

  // Build proposal with a fixed clock for determinism.
  const FIXED_NOW = 1700000000000;
  const unsigned = buildProposal({
    map,
    sourceMapCid: cid,
    publisherAddress: account.address,
    identityNFT: cfg.architect.identityNFT,
    methodologyHash,
    codeCommit,
    ledger,
    now: () => FIXED_NOW
  });

  // Sign with ephemeral key.
  const signed = await signYieldMap(unsigned, wallet, account);
  const proposal = { ...unsigned, signature: signed.signature };

  process.stderr.write('pinning proposal to Lighthouse...\n');
  const pinned = await pinYieldMap(proposal, { pinataJwt: cfg.ipfs.pinataJwt });
  process.stderr.write(`pinned: ${pinned.cid}\n`);

  // Build markdown report.
  const lines: string[] = [];
  lines.push('# Architect proposal inspection');
  lines.push('');
  lines.push(`Generated ${new Date(FIXED_NOW).toISOString()}`);
  lines.push(`Source map CID: ${cid}`);
  lines.push(`Proposal ID: ${unsigned.proposalId}`);
  lines.push(`Methodology hash: ${methodologyHash}`);
  lines.push(`Code commit: ${codeCommit}`);
  lines.push('');

  const renderTranche = (label: string, alloc: { bps: number; positions: Record<string, number> }): void => {
    lines.push(`## ${label} (${alloc.bps} bps)`);
    lines.push('');
    if (Object.keys(alloc.positions).length === 0) {
      lines.push('_no positions_');
      lines.push('');
      return;
    }
    lines.push('| Position | Score | bps |');
    lines.push('|---|---|---|');
    for (const [posId, posBps] of Object.entries(alloc.positions)) {
      const opp = map.opportunities.find((o) => o.id === posId);
      const score = opp ? opp.score.toFixed(4) : 'n/a';
      lines.push(`| ${posId} | ${score} | ${posBps} |`);
    }
    lines.push('');
  };

  renderTranche('Senior', unsigned.tranches.senior);
  renderTranche('Mezzanine', unsigned.tranches.mezzanine);
  renderTranche('Junior', unsigned.tranches.junior);

  lines.push('## Net exposure snapshot');
  lines.push('');
  const netSnap = ledger.snapshot();
  if (Object.keys(netSnap).length === 0) {
    lines.push('_empty (inspect mode reads no hedge log)_');
  } else {
    for (const [asset, net] of Object.entries(netSnap)) {
      lines.push(`- ${asset}: ${net}`);
    }
  }
  lines.push('');

  lines.push('## Signature');
  lines.push('');
  lines.push(`\`${signed.signature}\``);
  lines.push('');
  lines.push(`Pinned CID: \`${pinned.cid}\``);
  lines.push('');
  lines.push('DRY RUN: no on-chain emit performed.');
  lines.push('');

  const output = lines.join('\n');
  const outPath = new URL('../proposal-output.md', import.meta.url);
  await writeFile(outPath, output);
  process.stderr.write('wrote proposal-output.md\n');
}

main().catch((err) => {
  process.stderr.write(`inspect-allocation failed: ${(err as Error).message}\n`);
  process.exit(1);
});
