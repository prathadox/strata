import type { PublicClient } from 'viem';
import { subscribeYieldMaps, type YieldMapEvent } from './subscription/yieldMap.js';
import { subscribeHedgeLogs, type HedgeLogEvent } from './subscription/hedgeLog.js';
import type { Orchestrator } from './pipeline/orchestrator.js';
import type { NetExposureLedger } from './pipeline/netExposure.js';
import type { HealthState } from './monitor/health.js';
import type { ArchitectMetrics } from './monitor/metrics.js';

export interface RunLoopArgs {
  client: PublicClient;
  busAddress: `0x${string}`;
  fromBlock: bigint;
  orchestrator: Orchestrator;
  ledger: NetExposureLedger;
  health: HealthState;
  metrics: ArchitectMetrics;
  abortSignal?: AbortSignal;
  now?: () => number;
}

export interface RunLoopHandle {
  stop: () => void;
}

export async function startArchitectRunLoop(args: RunLoopArgs): Promise<RunLoopHandle> {
  const now = args.now ?? (() => Date.now());

  const onMap = async (event: YieldMapEvent): Promise<void> => {
    const result = await args.orchestrator.runProposalCycle(event.ipfsHash);
    if (result.status === 'published') {
      args.metrics.proposalsTotal.inc();
      const ts = now();
      args.metrics.lastProposalMs.set(ts);
      args.health.recordProposal(ts);
    } else {
      args.metrics.proposalsSkipped.inc({ reason: result.reason });
      if (result.reason === 'verification-failed') {
        args.metrics.verificationFailures.inc();
      }
    }
  };

  const onHedge = async (event: HedgeLogEvent): Promise<void> => {
    args.ledger.apply(event.hedgedAsset, event.netPosition, now());
  };

  const onLiveError = (_err: unknown): void => {
    args.metrics.subscriptionErrors.inc();
  };

  const unsubMaps = await subscribeYieldMaps(
    args.client,
    args.busAddress,
    args.fromBlock,
    onMap,
    onLiveError
  );
  const unsubHedges = await subscribeHedgeLogs(
    args.client,
    args.busAddress,
    args.fromBlock,
    onHedge,
    onLiveError
  );

  const stop = (): void => {
    unsubMaps();
    unsubHedges();
  };

  if (args.abortSignal) {
    args.abortSignal.addEventListener('abort', stop, { once: true });
  }

  return { stop };
}
