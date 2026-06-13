// Architect entrypoint. Boots config, viem clients, ledger, orchestrator,
// run loop, health check, and metrics server. Errors at startup log and abort;
// runtime errors inside the subscription loop are caught and surfaced via metrics.

import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { execSync } from 'node:child_process';
import * as http from 'node:http';
import pino from 'pino';

import { loadConfig } from './config.js';
import { makeClients } from './chain/client.js';
import { ArchitectMetrics } from './monitor/metrics.js';
import { HealthState } from './monitor/health.js';
import { NetExposureLedger } from './pipeline/netExposure.js';
import { makePublisher } from './publication/publish.js';
import { Orchestrator } from './pipeline/orchestrator.js';
import { startArchitectRunLoop } from './runLoop.js';

export const VERSION = '0.1.0';

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
  // Step 1: load config.
  const cfg = loadConfig();

  // Step 2: set up logger.
  const log = pino({ level: cfg.logLevel });

  log.info(
    { version: VERSION, chain: cfg.chain.id, dryRun: cfg.architect.dryRun },
    'architect starting'
  );

  // Step 3: viem clients.
  const clients = makeClients(cfg);

  // Step 4: read methodology hash.
  const methodologyHash = readMethodologyHash();

  // Step 5: read code commit.
  const codeCommit = readCodeCommit();

  log.info({ methodologyHash, codeCommit }, 'architect config resolved');

  // Step 6: instantiate monitor + ledger.
  const metrics = new ArchitectMetrics();
  const health = new HealthState();
  const ledger = new NetExposureLedger();

  // Step 7: compose publisher.
  const publisher = makePublisher({
    wallet: clients.walletClient,
    publicClient: clients.publicClient,
    account: clients.account,
    pinataJwt: cfg.ipfs.pinataJwt,
    eventBus: cfg.architect.eventBus,
    dryRun: cfg.architect.dryRun,
    ...(cfg.llm.geminiApiKey !== undefined && { geminiApiKey: cfg.llm.geminiApiKey }),
    geminiModel: cfg.llm.model
  });

  // Step 8: compose orchestrator.
  const orchestrator = new Orchestrator({
    publisher,
    ledger,
    publisherAddress: clients.account.address,
    identityNFT: cfg.architect.identityNFT,
    methodologyHash,
    codeCommit,
    ...(cfg.architect.scoutAddress !== undefined && {
      expectedScoutSigner: cfg.architect.scoutAddress
    })
  });

  // Step 9: compute fromBlock (1000 blocks back for replay window on restart).
  let fromBlock: bigint;
  try {
    const latest = await clients.publicClient.getBlockNumber();
    fromBlock = latest > 1000n ? latest - 1000n : 0n;
  } catch (err) {
    log.warn({ err }, 'could not fetch latest block number, defaulting fromBlock to 0n');
    fromBlock = 0n;
  }

  // Step 10: start run loop.
  const abort = new AbortController();
  const handle = await startArchitectRunLoop({
    client: clients.publicClient,
    busAddress: cfg.architect.eventBus,
    fromBlock,
    orchestrator,
    ledger,
    health,
    metrics,
    abortSignal: abort.signal
  });

  // Step 11: wire shutdown signals.
  const shutdown = (): void => {
    log.info('shutdown signal received');
    handle.stop();
    process.exit(0);
  };
  process.on('SIGINT', shutdown);
  process.on('SIGTERM', shutdown);

  // Step 12: HTTP server for health + metrics.
  const port = cfg.architect.healthPort;
  const server = http.createServer(async (req, res) => {
    const url = req.url ?? '/';
    if (url === '/healthz') {
      const ok = health.isHealthy(Date.now());
      const body = JSON.stringify({
        status: ok ? 'ok' : 'degraded',
        lastProposalAt: health.lastProposalAt()
      });
      res.writeHead(ok ? 200 : 503, { 'Content-Type': 'application/json' });
      res.end(body);
    } else if (url === '/metrics') {
      const text = await metrics.toText();
      res.writeHead(200, { 'Content-Type': 'text/plain; version=0.0.4' });
      res.end(text);
    } else {
      res.writeHead(404);
      res.end('not found');
    }
  });

  server.listen(port, () => {
    log.info({ port }, 'architect health+metrics server listening');
  });

  log.info({ fromBlock: fromBlock.toString() }, 'architect run loop started');
}

main().catch((err) => {
  process.stderr.write(`fatal: ${(err as Error).message}\n`);
  process.exitCode = 1;
});
