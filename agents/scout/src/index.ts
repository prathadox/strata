// Scout entrypoint. Boots config, viem clients, fetchers, enrichers, publisher,
// and the run loop. Errors at any stage log + abort startup; runtime errors inside
// the loop are caught by runScoutLoop and logged via metrics.

import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { execSync } from 'node:child_process';
import pino from 'pino';

import { loadConfig } from './config.js';
import { makeClients } from './chain/client.js';
import { DefiLlamaFetcher } from './pipeline/ingestion/sources/defiLlama.js';
import { fetchDepegHistory } from './pipeline/enrichment/depegHistory.js';
import { fetchSmartMoneyFlow } from './pipeline/enrichment/smartMoneyFlow.js';
import { runCycle } from './pipeline/orchestrator.js';
import { makePublisher } from './publication/publish.js';
import { publishOnChain } from './publication/onchain.js';
import { LastPublished } from './cache/lastPublished.js';
import { HealthState } from './monitor/health.js';
import { ScoutMetrics } from './monitor/metrics.js';
import { runScoutLoop } from './runLoop.js';

export const VERSION = '0.1.0';

function readMethodologyHash(): string {
  try {
    const buf = readFileSync(new URL('../docs/scoring-methodology.md', import.meta.url));
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
  const cfg = loadConfig();
  const log = pino({ level: cfg.logLevel });

  log.info({ version: VERSION, chain: cfg.chain.id, dryRun: cfg.scout.dryRun }, 'scout starting');

  const clients = makeClients(cfg);
  const fetchers = [new DefiLlamaFetcher()];

  const enrichers = {
    depegHistory: (asset: `0x${string}`) => fetchDepegHistory(asset),
    smartMoneyFlow: (asset: `0x${string}`) => fetchSmartMoneyFlow(asset, cfg.apis.nansen)
  };

  const liveOnChain = ({ ipfsHash }: { ipfsHash: string }) =>
    publishOnChain({
      wallet: clients.walletClient,
      publicClient: clients.publicClient,
      account: clients.account,
      eventBus: cfg.scout.eventBus,
      ipfsHash
    });

  const dryOnChain = async ({ ipfsHash }: { ipfsHash: string }): Promise<`0x${string}`> => {
    log.warn({ ipfsHash }, 'DRY RUN: skipping on-chain publishYieldMap, would have emitted this CID');
    return '0xdryRunSkipped' as `0x${string}`;
  };

  const publisher = makePublisher({
    wallet: clients.walletClient,
    publicClient: clients.publicClient,
    account: clients.account,
    lighthouseApiKey: cfg.ipfs.lighthouseApiKey,
    publishOnChain: cfg.scout.dryRun ? dryOnChain : liveOnChain
  });

  const lastPublished = new LastPublished();
  const health = new HealthState({ cycleIntervalMs: cfg.cycleIntervalMs });
  const metrics = new ScoutMetrics();

  const methodologyHash = readMethodologyHash();
  const codeCommit = readCodeCommit();
  log.info({ methodologyHash, codeCommit }, 'scout config resolved');

  const abort = new AbortController();
  process.on('SIGINT', () => { log.info('SIGINT received, shutting down'); abort.abort(); });
  process.on('SIGTERM', () => { log.info('SIGTERM received, shutting down'); abort.abort(); });

  await runScoutLoop({
    cycle: async () => {
      const start = Date.now();
      try {
        const map = await runCycle({
          fetchers,
          enrichers,
          publisher,
          lastPublished,
          methodologyHash,
          codeCommit,
          publisherAddress: clients.account.address,
          identityNFT: 'unset'
        });
        log.info({
          ms: Date.now() - start,
          opps: map?.opportunities.length ?? 0,
          senior: map?.perTranche.senior.length ?? 0,
          mezz: map?.perTranche.mezzanine.length ?? 0,
          junior: map?.perTranche.junior.length ?? 0
        }, 'cycle complete');
        return map;
      } catch (err) {
        log.error({ err, ms: Date.now() - start }, 'cycle failed');
        throw err;
      }
    },
    health,
    metrics,
    cycleIntervalMs: cfg.cycleIntervalMs,
    abortSignal: abort.signal
  });

  log.info('scout stopped');
}

main().catch((err) => {
  process.stderr.write(`fatal: ${(err as Error).message}\n`);
  process.exitCode = 1;
});
