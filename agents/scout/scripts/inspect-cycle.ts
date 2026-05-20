// inspect-cycle.ts - run the full Scout pipeline once without any external secrets.
// No Lighthouse pin, no Nansen call, no on-chain emit. Just DefiLlama (yields + coins)
// and the deterministic scoring/aggregation/signing math. Writes a markdown summary of
// what Scout sees to dry-cycle-output.md in the scout package root.
//
// Run:
//   pnpm --filter @strata/scout exec tsx scripts/inspect-cycle.ts

import { writeFile, readFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';

// Tiny .env loader. Reads agents/scout/.env if present and sets process.env without
// overwriting anything already exported. Avoids a dotenv dep for this one-off script.
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

import { generatePrivateKey, privateKeyToAccount } from 'viem/accounts';
import { createWalletClient, http } from 'viem';
import { mainnet } from 'viem/chains';

import { DefiLlamaFetcher } from '../src/pipeline/ingestion/sources/defiLlama.js';
import { runIngestion } from '../src/pipeline/ingestion/index.js';
import { fetchDepegHistory } from '../src/pipeline/enrichment/depegHistory.js';
import { fetchApyHistory } from '../src/pipeline/enrichment/apyHistory.js';
import { fetchSmartMoneyFlow } from '../src/pipeline/enrichment/smartMoneyFlow.js';
import { metaFor } from '../src/pipeline/enrichment/protocolConfig.js';
import { scoreOpportunity } from '../src/pipeline/scoring.js';
import { aggregate } from '../src/pipeline/aggregation.js';
import { signYieldMap } from '../src/publication/signer.js';
import type { RiskFactors, YieldMap, SourceProtocol } from '../src/types.js';

function fmtUsd(n: number): string {
  return '$' + Math.round(n).toLocaleString();
}

function fmtPct(n: number, digits = 2): string {
  return `${(n * 100).toFixed(digits)}%`;
}

async function main(): Promise<void> {
  const ephemeralKey = generatePrivateKey();
  const account = privateKeyToAccount(ephemeralKey);
  const wallet = createWalletClient({ account, chain: mainnet, transport: http('http://localhost:1') });

  process.stderr.write('fetching DefiLlama pools...\n');
  const ingestion = await runIngestion([new DefiLlamaFetcher()], { perSourceTimeoutMs: 30_000 });
  process.stderr.write(`ingested ${ingestion.opportunities.length} opportunities from ${ingestion.attempted.join(',')}\n`);
  if (ingestion.degraded.length > 0) {
    process.stderr.write(`degraded: ${ingestion.degraded.join(',')}\n`);
  }

  process.stderr.write('enriching + scoring...\n');
  const nansenKey = process.env.NANSEN_API_KEY;
  const cgKey = process.env.COINGECKO_API_KEY;
  if (nansenKey) process.stderr.write('NANSEN_API_KEY found, enabling smart-money enrichment...\n');
  else process.stderr.write('NANSEN_API_KEY not set, smartMoneySignal will be null for every opp\n');
  if (cgKey) process.stderr.write('COINGECKO_API_KEY found, using CoinGecko for depeg history...\n');
  else process.stderr.write('COINGECKO_API_KEY not set, falling back to DefiLlama coins API for depeg history\n');

  const scored = await Promise.all(
    ingestion.opportunities.map(async (opp) => {
      const poolId = opp.id.includes(':') ? opp.id.split(':').slice(1).join(':') : opp.id;
      const [depeg, apyHist, smart] = await Promise.all([
        fetchDepegHistory(opp.asset, cgKey).catch(() => null),
        fetchApyHistory(poolId).catch(() => null),
        nansenKey ? fetchSmartMoneyFlow(opp.asset, nansenKey).catch(() => null) : Promise.resolve(null)
      ]);
      const meta = metaFor(opp.source);
      const risk: RiskFactors = {
        contractAgeDays: meta?.contractAgeDays ?? null,
        auditFactor: meta?.auditFactor ?? null,
        tvlFactor: null,
        depegEvents: depeg,
        oracleType: meta?.oracleType ?? null,
        liquiditySlippageBps: null,
        counterpartyClass: meta?.counterpartyClass ?? null,
        smartMoneySignal: smart,
        apyVolatility: apyHist?.volatility ?? null,
        apyDrift: apyHist?.drift ?? null
      };
      return scoreOpportunity(opp, risk);
    })
  );

  const { tagged, perTranche } = aggregate(scored);
  process.stderr.write(
    `scored: ${tagged.length}, senior=${perTranche.senior.length}, mezz=${perTranche.mezzanine.length}, junior=${perTranche.junior.length}\n`
  );

  const unsigned: Omit<YieldMap, 'signature'> = {
    version: '1.0',
    publishedAtMs: Date.now(),
    publisher: { address: account.address, identityNFT: 'dry-run' },
    methodologyHash: '0x' + 'd'.repeat(64),
    codeCommit: 'dry-run-inspect',
    sourcesQueried: ingestion.attempted.filter((s): s is SourceProtocol => s !== 'defillama'),
    sourcesDegraded: ingestion.degraded.filter((s): s is SourceProtocol => s !== 'defillama'),
    opportunities: tagged,
    perTranche
  };
  const signed = await signYieldMap(unsigned, wallet, account);
  const finalMap: YieldMap = { ...unsigned, signature: signed.signature };

  const lines: string[] = [];
  lines.push('# Scout dry-cycle inspection');
  lines.push('');
  lines.push(`Generated: ${new Date().toISOString()}`);
  lines.push(`Ephemeral signer: \`${account.address}\``);
  lines.push(`Map hash: \`${signed.mapHash}\``);
  lines.push('');
  lines.push('This file is produced by `scripts/inspect-cycle.ts`. The pipeline runs end to end, fetching real data from DefiLlama (yields + price history). Nansen and Lighthouse are skipped; the signature is over an ephemeral keypair generated at run time.');
  lines.push('');

  lines.push('## Summary');
  lines.push('');
  lines.push(`- Opportunities ingested: **${ingestion.opportunities.length}**`);
  lines.push(`- Opportunities scored: **${tagged.length}**`);
  lines.push(`- Senior-eligible: **${perTranche.senior.length}**`);
  lines.push(`- Mezzanine-eligible: **${perTranche.mezzanine.length}**`);
  lines.push(`- Junior-eligible: **${perTranche.junior.length}**`);
  lines.push('');

  const renderRanked = (title: string, ids: string[]): string[] => {
    const out: string[] = [];
    out.push(`### ${title} (${ids.length})`);
    out.push('');
    if (ids.length === 0) {
      out.push('_none_');
      out.push('');
      return out;
    }
    out.push('| Rank | Source | Pool id | APY | RAAPY | Score | TVL |');
    out.push('|---|---|---|---|---|---|---|');
    ids.forEach((id, i) => {
      const o = tagged.find((x) => x.id === id);
      if (!o) return;
      out.push(`| ${i + 1} | ${o.source} | \`${o.id}\` | ${fmtPct(o.apy)} | ${fmtPct(o.raapy)} | ${o.score.toFixed(4)} | ${fmtUsd(o.tvlUsd)} |`);
    });
    out.push('');
    return out;
  };

  lines.push('## Per-tranche rankings');
  lines.push('');
  lines.push(...renderRanked('Senior', perTranche.senior));
  lines.push(...renderRanked('Mezzanine', perTranche.mezzanine));
  lines.push(...renderRanked('Junior', perTranche.junior));

  lines.push('## All scored opportunities');
  lines.push('');
  if (tagged.length === 0) {
    lines.push('_None._ DefiLlama returned no Mantle pools matching the project map, or all rows failed validation.');
    lines.push('');
  } else {
    for (const o of tagged) {
      lines.push(`### ${o.id}`);
      lines.push('');
      lines.push(`- **Source**: ${o.source}`);
      lines.push(`- **Asset**: \`${o.asset}\``);
      lines.push(`- **APY (base)**: ${fmtPct(o.apy)}    **APY (reward)**: ${fmtPct(o.apyReward)}    **Total**: ${fmtPct(o.apy + o.apyReward)}`);
      lines.push(`- **TVL**: ${fmtUsd(o.tvlUsd)}`);
      const ah = o.risk.apyVolatility !== null || o.risk.apyDrift !== null
        ? `vol=${o.risk.apyVolatility !== null ? (o.risk.apyVolatility * 100).toFixed(2) + '%' : 'n/a'}, drift=${o.risk.apyDrift !== null ? o.risk.apyDrift.toFixed(2) + 'x' : 'n/a'}`
        : 'no history available';
      lines.push(`- **APY history**: ${ah}`);
      const sm = o.risk.smartMoneySignal;
      if (sm) {
        lines.push(`- **Nansen signal**: smartHolderPct=${(sm.smartHolderPct * 100).toFixed(1)}%, freshWalletInflowPct=${(sm.freshWalletInflowPct * 100).toFixed(1)}%, washTrade=${sm.washTradeFlag}`);
      } else {
        lines.push(`- **Nansen signal**: _null_ (no key or asset not covered)`);
      }
      lines.push(`- **Probabilities**: exploit=${o.probabilities.exploit.toFixed(5)}, depeg=${o.probabilities.depeg.toFixed(5)}, oracle=${o.probabilities.oracle.toFixed(5)}, illiquid=${o.probabilities.illiquid.toFixed(5)}, counterparty=${o.probabilities.counterparty.toFixed(5)}`);
      lines.push(`- **Expected loss**: ${fmtPct(o.expectedLoss, 3)} /yr`);
      lines.push(`- **RAAPY**: ${fmtPct(o.raapy)}`);
      lines.push(`- **Confidence**: ${o.confidence.toFixed(3)}`);
      lines.push(`- **Score**: ${o.score.toFixed(4)}`);
      lines.push(`- **Eligible tranches**: ${o.eligibleTranches.length === 0 ? '_none_' : o.eligibleTranches.join(', ')}`);
      lines.push(`- **Primary tranche**: ${o.primaryTranche ?? '_none_'}`);
      if (o.rejectionReasons.length > 0) {
        lines.push(`- **Rejection reasons**:`);
        for (const r of o.rejectionReasons) {
          lines.push(`  - ${r.tranche}: ${r.reasons.join('; ')}`);
        }
      }
      lines.push('');
    }
  }

  lines.push('## Signed canonical Yield Map');
  lines.push('');
  lines.push('```json');
  lines.push(JSON.stringify(finalMap, null, 2));
  lines.push('```');
  lines.push('');

  const out = lines.join('\n');
  await writeFile(new URL('../dry-cycle-output.md', import.meta.url), out);
  process.stderr.write('wrote dry-cycle-output.md\n');
}

main().catch((err) => {
  process.stderr.write(`inspect failed: ${(err as Error).message}\n`);
  process.exit(1);
});
