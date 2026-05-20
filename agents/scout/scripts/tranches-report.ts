// tranches-report.ts - produce tranches.md, a clean view of how Scout segregates
// the current Mantle yield universe into senior / mezzanine / junior. Same data
// pipeline as inspect-cycle.ts, simpler output focused on the tranche partition.
//
// Run:  pnpm --filter @strata/scout exec tsx scripts/tranches-report.ts

import { writeFile, readFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { generatePrivateKey, privateKeyToAccount } from 'viem/accounts';

import { DefiLlamaFetcher } from '../src/pipeline/ingestion/sources/defiLlama.js';
import { runIngestion } from '../src/pipeline/ingestion/index.js';
import { fetchDepegHistory } from '../src/pipeline/enrichment/depegHistory.js';
import { fetchYieldAccrualEvents } from '../src/pipeline/enrichment/yieldAccrual.js';
import { fetchApyHistory } from '../src/pipeline/enrichment/apyHistory.js';
import { fetchSmartMoneyFlow } from '../src/pipeline/enrichment/smartMoneyFlow.js';
import { metaFor } from '../src/pipeline/enrichment/protocolConfig.js';
import { scoreOpportunity } from '../src/pipeline/scoring.js';
import { aggregate, MANDATES } from '../src/pipeline/aggregation.js';
import type { RiskFactors, ScoredOpportunity } from '../src/types.js';

async function loadEnv(): Promise<void> {
  const envPath = new URL('../.env', import.meta.url);
  if (!existsSync(envPath)) return;
  const text = await readFile(envPath, 'utf8');
  for (const line of text.split('\n')) {
    const m = line.match(/^\s*([A-Z_][A-Z0-9_]*)\s*=\s*(.*?)\s*$/);
    if (!m) continue;
    const key = m[1]!;
    if (process.env[key] !== undefined) continue;
    process.env[key] = m[2]!.replace(/^["']|["']$/g, '');
  }
}

function fmtUsd(n: number): string {
  if (n >= 1e9) return `$${(n / 1e9).toFixed(2)}B`;
  if (n >= 1e6) return `$${(n / 1e6).toFixed(2)}M`;
  if (n >= 1e3) return `$${(n / 1e3).toFixed(1)}K`;
  return `$${n.toFixed(0)}`;
}

function fmtPct(n: number, digits = 2): string {
  return `${(n * 100).toFixed(digits)}%`;
}

function symbolFromRaw(raw: unknown): string {
  if (raw && typeof raw === 'object' && 'symbol' in raw && typeof raw.symbol === 'string') {
    return raw.symbol;
  }
  return '?';
}

function renderTrancheTable(title: string, ids: string[], all: ScoredOpportunity[]): string[] {
  const out: string[] = [];
  out.push(`### ${title} (${ids.length})`);
  out.push('');
  if (ids.length === 0) {
    out.push('_no eligible positions in this tranche right now._');
    out.push('');
    return out;
  }
  out.push('| Rank | Protocol | Asset symbol | APY (base) | APY (reward) | TVL | RAAPY | Score | Pool id |');
  out.push('|---|---|---|---|---|---|---|---|---|');
  ids.forEach((id, i) => {
    const o = all.find((x) => x.id === id);
    if (!o) return;
    out.push(
      `| ${i + 1} | ${o.source} | ${symbolFromRaw(o.raw)} | ${fmtPct(o.apy)} | ${fmtPct(o.apyReward)} | ${fmtUsd(o.tvlUsd)} | ${fmtPct(o.raapy)} | ${o.score.toFixed(4)} | \`${o.id.split(':').slice(1).join(':')}\` |`
    );
  });
  out.push('');
  return out;
}

async function main(): Promise<void> {
  await loadEnv();
  const cgKey = process.env.COINGECKO_API_KEY;
  const nansenKey = process.env.NANSEN_API_KEY;

  process.stderr.write('fetching Mantle yield universe from DefiLlama...\n');
  const ingestion = await runIngestion([new DefiLlamaFetcher()], { perSourceTimeoutMs: 30_000 });
  process.stderr.write(`ingested ${ingestion.opportunities.length} opportunities\n`);

  const scored = await Promise.all(
    ingestion.opportunities.map(async (opp) => {
      const poolId = opp.id.includes(':') ? opp.id.split(':').slice(1).join(':') : opp.id;
      const [depeg, accrual, apyHist, smart] = await Promise.all([
        fetchDepegHistory(opp.asset, cgKey).catch(() => null),
        fetchYieldAccrualEvents(opp.asset, cgKey).catch(() => null),
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
        apyDrift: apyHist?.drift ?? null,
        yieldAccrualEvents: accrual
      };
      return scoreOpportunity(opp, risk);
    })
  );

  const { tagged, perTranche } = aggregate(scored);
  const rejected = tagged.filter((o) => o.eligibleTranches.length === 0);

  const lines: string[] = [];
  lines.push('# Strata yield map, tranches');
  lines.push('');
  lines.push(`Generated ${new Date().toISOString()} from real DefiLlama data on Mantle.`);
  lines.push(`Total opportunities ingested: **${tagged.length}**. Senior **${perTranche.senior.length}**, Mezzanine **${perTranche.mezzanine.length}**, Junior **${perTranche.junior.length}**, fully rejected **${rejected.length}**.`);
  lines.push('');
  lines.push('Each tranche has its own mandate. An opportunity that passes the senior mandate also passes mezz and junior (nested), so the same opportunity can show up in multiple lists. The "primary tranche" for any opportunity is the most-senior one it qualifies for.');
  lines.push('');

  lines.push('## Senior, capital preservation');
  lines.push('');
  lines.push(`**Mandate**: expected-loss ≤ ${fmtPct(MANDATES.senior.maxExpectedLoss)}/yr · p_exploit ≤ ${fmtPct(MANDATES.senior.maxPExploit)} · p_depeg ≤ ${fmtPct(MANDATES.senior.maxPDepeg)} · TVL ≥ ${fmtUsd(MANDATES.senior.minTvlUsd)} · APY ∈ [${fmtPct(MANDATES.senior.minApy)}, ${fmtPct(MANDATES.senior.maxApy)}] · no wash-trade flag`);
  lines.push('');
  lines.push('Per product.md: backed by **Ondo USDY** (tokenized T-bill yield) and **Ethena sUSDe** (synthetic dollar with delta-neutral basis). First on yield, last on loss.');
  lines.push('');
  lines.push(...renderTrancheTable('Eligible positions', perTranche.senior, tagged));

  lines.push('## Mezzanine, balanced');
  lines.push('');
  lines.push(`**Mandate**: expected-loss ≤ ${fmtPct(MANDATES.mezzanine.maxExpectedLoss)}/yr · p_exploit ≤ ${fmtPct(MANDATES.mezzanine.maxPExploit)} · p_depeg ≤ ${fmtPct(MANDATES.mezzanine.maxPDepeg)} · TVL ≥ ${fmtUsd(MANDATES.mezzanine.minTvlUsd)} · APY ∈ [${fmtPct(MANDATES.mezzanine.minApy)}, ${fmtPct(MANDATES.mezzanine.maxApy)}] · no wash-trade flag`);
  lines.push('');
  lines.push('Per product.md: **mETH + Mantle Vault + CIAN strategies**, plus select stablecoin lending. Second claim, balanced risk and yield.');
  lines.push('');
  lines.push(...renderTrancheTable('Eligible positions', perTranche.mezzanine, tagged));

  lines.push('## Junior, residual upside');
  lines.push('');
  lines.push(`**Mandate**: expected-loss ≤ ${fmtPct(MANDATES.junior.maxExpectedLoss)}/yr · p_exploit ≤ 100% · TVL ≥ ${fmtUsd(MANDATES.junior.minTvlUsd)} · APY uncapped`);
  lines.push('');
  lines.push('Per product.md: **leveraged positions, LP rewards, perp basis, and the CMO sleeve (demo)**. Last on yield, first on loss. Highest expected return.');
  lines.push('');
  lines.push(...renderTrancheTable('Eligible positions', perTranche.junior, tagged));

  lines.push('## Fully rejected');
  lines.push('');
  if (rejected.length === 0) {
    lines.push('_All ingested opportunities qualified for at least junior._');
    lines.push('');
  } else {
    lines.push('Opportunities that failed every mandate. These get tracked in the published Yield Map under `opportunities` but appear in no `perTranche` list.');
    lines.push('');
    lines.push('| Protocol | Asset | TVL | APY (base) | Why rejected from junior |');
    lines.push('|---|---|---|---|---|');
    for (const o of rejected) {
      const juniorReasons = o.rejectionReasons.find((r) => r.tranche === 'junior')?.reasons.join('; ') ?? 'unknown';
      lines.push(`| ${o.source} | ${symbolFromRaw(o.raw)} | ${fmtUsd(o.tvlUsd)} | ${fmtPct(o.apy)} | ${juniorReasons} |`);
    }
    lines.push('');
  }

  lines.push('## Notes on the data');
  lines.push('');
  lines.push(`- Source: DefiLlama \`/pools\` filtered to chain=Mantle, project mapped through PROJECT_TO_SOURCE.`);
  lines.push(`- Depeg history via ${cgKey ? '**CoinGecko Demo**' : '**DefiLlama coins API** (no CoinGecko key set)'}.`);
  lines.push(`- Yield-accrual consistency (for USDY, sUSDe) via the same source, baselined against fitted exponential growth.`);
  lines.push(`- Smart-money signal via Nansen: ${nansenKey ? 'enabled' : '**disabled**, set NANSEN_API_KEY to activate'}.`);
  lines.push(`- APY split into \`apy\` (real protocol yield, apyBase) and \`apyReward\` (token emissions). Senior + mezz score against base only.`);
  lines.push('');

  const signer = privateKeyToAccount(generatePrivateKey()).address;
  lines.push(`This report is informational. The signed canonical Yield Map (with full per-opportunity scoring breakdown) is at \`dry-cycle-output.md\`. Both are generated from the same pipeline; this file just slices the data by tranche. Ephemeral run signer: \`${signer}\`.`);
  lines.push('');

  await writeFile(new URL('../tranches.md', import.meta.url), lines.join('\n'));
  process.stderr.write('wrote tranches.md\n');
}

main().catch((err) => {
  process.stderr.write(`tranches-report failed: ${(err as Error).message}\n`);
  process.exit(1);
});
