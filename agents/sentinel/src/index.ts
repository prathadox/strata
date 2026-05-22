import { createServer } from 'node:http';
import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { execSync } from 'node:child_process';
import type { PublicClient } from 'viem';
import pino from 'pino';
import { loadConfig } from './config.js';
import { buildChainClients } from './chain/client.js';
import { NetExposureLedger } from './pipeline/netExposure.js';
import { Orchestrator } from './pipeline/orchestrator.js';
import { makeHealth } from './monitor/health.js';
import { makeMetrics } from './monitor/metrics.js';
import { startSentinelRunLoop } from './runLoop.js';
import { makePublisher } from './publication/publish.js';
import { fetchAllocationProposalByCid, fetchYieldMapByCid } from './ipfs/fetch.js';
import { verifyAllocationProposal } from './verify/proposal.js';
import { verifyYieldMap } from './verify/yieldMap.js';

async function main(): Promise<void> {
  const cfg = loadConfig();
  const log = pino({ level: cfg.logLevel });
  log.info('sentinel starting');

  const clients = buildChainClients({
    rpcUrl: cfg.chain.rpcUrl,
    rpcFallback: cfg.chain.rpcFallback,
    privateKey: cfg.sentinel.privateKey
  });
  const publicClient = clients.publicClient as unknown as PublicClient;
  const walletClient = clients.walletClient;
  const account = clients.account;

  const methodologyText = readFileSync('agents/sentinel/docs/risk-methodology.md', 'utf-8');
  const methodologyHash = '0x' + createHash('sha256').update(methodologyText).digest('hex');
  const codeCommit = execSync('git rev-parse HEAD').toString().trim();

  const metrics = makeMetrics();
  const health = makeHealth();
  const ledger = new NetExposureLedger();

  const publisher = makePublisher({
    wallet: walletClient,
    publicClient,
    account,
    eventBus: cfg.sentinel.eventBus,
    lighthouseApiKey: cfg.ipfs.lighthouseApiKey,
    dryRun: cfg.sentinel.dryRun
  });

  const orchestrator = new Orchestrator({
    fetchProposal: fetchAllocationProposalByCid,
    fetchMap: fetchYieldMapByCid,
    verifyProposal: (p) => verifyAllocationProposal(p, (cfg.sentinel as { architectAddress?: `0x${string}` }).architectAddress),
    verifyMap: (m) => verifyYieldMap(m, (cfg.sentinel as { scoutAddress?: `0x${string}` }).scoutAddress),
    snapshotExposure: () => ledger.snapshot(),
    methodologyHash,
    codeCommit,
    publisher,
    publisherAddress: account.address,
    identityNFT: cfg.sentinel.identityNFT,
    totalDepositsBaselineUsd: cfg.sentinel.totalDepositsBaselineUsd
  });

  let fromBlock: bigint;
  try {
    const head = await publicClient.getBlockNumber();
    fromBlock = head > 1000n ? head - 1000n : 0n;
  } catch { fromBlock = 0n; }

  const abort = new AbortController();
  const handle = await startSentinelRunLoop({
    client: publicClient,
    busAddress: cfg.sentinel.eventBus,
    fromBlock,
    orchestrator,
    ledger,
    health,
    metrics,
    abortSignal: abort.signal
  });

  process.on('SIGINT', () => { log.info('SIGINT, shutting down'); abort.abort(); });
  process.on('SIGTERM', () => { log.info('SIGTERM, shutting down'); abort.abort(); });

  const server = createServer(async (req, res) => {
    if (req.url === '/healthz') {
      res.writeHead(200, { 'content-type': 'application/json' });
      res.end(JSON.stringify(health.asJson()));
    } else if (req.url === '/metrics') {
      const body = await metrics.registry.metrics();
      res.writeHead(200, { 'content-type': metrics.registry.contentType });
      res.end(body);
    } else { res.writeHead(404); res.end(); }
  });
  server.listen(cfg.sentinel.healthPort, () => log.info({ port: cfg.sentinel.healthPort }, 'sentinel health+metrics server listening'));

  abort.signal.addEventListener('abort', () => { handle.stop(); server.close(); });
}

main().catch((e) => { console.error(e); process.exit(1); });
