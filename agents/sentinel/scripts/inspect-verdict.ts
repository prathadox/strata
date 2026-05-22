import { readFileSync, writeFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { execSync } from 'node:child_process';
import { generatePrivateKey, privateKeyToAccount } from 'viem/accounts';
import { fetchAllocationProposalByCid, fetchYieldMapByCid } from '../src/ipfs/fetch.js';
import { verifyAllocationProposal } from '../src/verify/proposal.js';
import { verifyYieldMap } from '../src/verify/yieldMap.js';
import { evaluateRisk } from '../src/pipeline/riskPolicy.js';
import { buildVerdict } from '../src/pipeline/buildVerdict.js';

function arg(name: string): string | undefined {
  const i = process.argv.indexOf(`--${name}`);
  return i >= 0 ? process.argv[i + 1] : undefined;
}

async function main(): Promise<void> {
  const cid = arg('proposal-cid');
  if (!cid) { console.error('usage: inspect-verdict --proposal-cid <cid>'); process.exit(2); }

  process.env.SENTINEL_DRY_RUN = 'true';

  const methodology = readFileSync('agents/sentinel/docs/risk-methodology.md', 'utf-8');
  const methodologyHash = '0x' + createHash('sha256').update(methodology).digest('hex');
  const codeCommit = execSync('git rev-parse HEAD').toString().trim();
  const key = generatePrivateKey();
  const account = privateKeyToAccount(key);

  const proposal = await fetchAllocationProposalByCid(cid);
  if (!proposal) throw new Error('proposal fetch returned null');
  await verifyAllocationProposal(proposal);
  const map = await fetchYieldMapByCid(proposal.sourceMapCid);
  if (!map) throw new Error('map fetch returned null');
  await verifyYieldMap(map);

  const evaluation = evaluateRisk({
    proposal, map, netExposure: {}, totalDepositsBaselineUsd: 10_000_000
  });
  const draft = buildVerdict({
    evaluation,
    proposalId: proposal.proposalId,
    sourceMapCid: proposal.sourceMapCid,
    sourceProposalCid: cid,
    publisherAddress: account.address,
    identityNFT: 'ipfs://placeholder',
    methodologyHash,
    codeCommit,
    now: () => 1_700_000_000_000
  });

  const lines = [
    `# Verdict inspect (dry-run)`,
    ``,
    `- proposalCid: ${cid}`,
    `- mapCid: ${proposal.sourceMapCid}`,
    `- methodologyHash: ${methodologyHash}`,
    `- codeCommit: ${codeCommit}`,
    ``,
    `## Tranches`,
    `- senior: ${draft.tranches.senior}`,
    `- mezzanine: ${draft.tranches.mezzanine}`,
    `- junior: ${draft.tranches.junior}`,
    ``,
    `## Position verdicts`,
    ...Object.entries(draft.perPositionVerdicts).map(([k, v]) => `- ${k}: ${v}`),
    ``,
    `## Reasons (${draft.reasons.length})`,
    ...draft.reasons.map((r) => `- [${r.severity}] ${r.code} @ ${r.target}: ${r.message}`),
    ``,
    `## Hedge signals (${evaluation.hedgeSignals.length})`,
    ...evaluation.hedgeSignals.map((s) => `- ${s.hedgedAsset} ${s.direction} ${s.targetNotionalUsd} USD`)
  ];
  writeFileSync('agents/sentinel/verdict-output.md', lines.join('\n') + '\n');
  console.log('wrote agents/sentinel/verdict-output.md');
}

main().catch((e) => { console.error(e); process.exit(1); });
