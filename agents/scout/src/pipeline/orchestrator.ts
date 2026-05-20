import type { SourceFetcher } from './ingestion/sourceFetcher.js';
import { runIngestion } from './ingestion/index.js';
import { scoreOpportunity } from './scoring.js';
import { aggregate } from './aggregation.js';
import { metaFor } from './enrichment/protocolConfig.js';
import type { ScoredOpportunity, YieldMap, RiskFactors } from '../types.js';
import type { Publisher } from '../publication/publish.js';
import type { LastPublished } from '../cache/lastPublished.js';

export interface Enrichers {
  depegHistory(asset: `0x${string}`): Promise<RiskFactors['depegEvents']>;
  smartMoneyFlow(asset: `0x${string}`): Promise<RiskFactors['smartMoneySignal']>;
  apyHistory(poolId: string): Promise<{ volatility: number; drift: number } | null>;
}

export interface RunCycleArgs {
  fetchers: SourceFetcher[];
  enrichers: Enrichers;
  publisher: Publisher;
  lastPublished: LastPublished;
  methodologyHash: string;
  codeCommit: string;
  publisherAddress: `0x${string}`;
  identityNFT: string;
}

export async function runCycle(args: RunCycleArgs): Promise<YieldMap | null> {
  const ingestion = await runIngestion(args.fetchers, { perSourceTimeoutMs: 15_000 });
  if (ingestion.opportunities.length === 0) return null;

  const scored: ScoredOpportunity[] = await Promise.all(
    ingestion.opportunities.map(async (opp) => {
      // Strip the "source:" prefix to recover DefiLlama's pool id for the chart endpoint.
      const poolId = opp.id.includes(':') ? opp.id.split(':').slice(1).join(':') : opp.id;
      const [depeg, smart, apyHist] = await Promise.all([
        args.enrichers.depegHistory(opp.asset as `0x${string}`).catch(() => null),
        args.enrichers.smartMoneyFlow(opp.asset as `0x${string}`).catch(() => null),
        args.enrichers.apyHistory(poolId).catch(() => null)
      ]);
      const meta = metaFor(opp.source);
      const risk: RiskFactors = {
        contractAgeDays: meta.contractAgeDays,
        auditFactor: meta.auditFactor,
        tvlFactor: null,
        depegEvents: depeg,
        oracleType: meta.oracleType,
        liquiditySlippageBps: null,
        counterpartyClass: meta.counterpartyClass,
        smartMoneySignal: smart,
        apyVolatility: apyHist?.volatility ?? null,
        apyDrift: apyHist?.drift ?? null
      };
      return scoreOpportunity(opp, risk);
    })
  );

  const { tagged, perTranche } = aggregate(scored);

  const unsignedMap: Omit<YieldMap, 'signature'> = {
    version: '1.0',
    publishedAtMs: Date.now(),
    publisher: { address: args.publisherAddress, identityNFT: args.identityNFT },
    methodologyHash: args.methodologyHash,
    codeCommit: args.codeCommit,
    sourcesQueried: ingestion.attempted.filter((s): s is YieldMap['sourcesQueried'][number] => s !== 'defillama'),
    sourcesDegraded: ingestion.degraded.filter((s): s is YieldMap['sourcesDegraded'][number] => s !== 'defillama'),
    opportunities: tagged,
    perTranche
  };

  const signed = await args.publisher.signYieldMap(unsignedMap);
  const finalMap: YieldMap = { ...unsignedMap, signature: signed.signature };
  const pinned = await args.publisher.pinYieldMap(finalMap);

  if (!args.lastPublished.shouldPublish(pinned.cid)) {
    return finalMap;
  }

  await args.publisher.publishOnChain({ ipfsHash: pinned.cid });
  args.lastPublished.record({ cid: pinned.cid, mapHash: signed.mapHash, publishedAtMs: Date.now() });
  return finalMap;
}
