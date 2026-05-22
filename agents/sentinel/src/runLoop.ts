import type { PublicClient } from 'viem';
import { subscribeAllocationProposed, type AllocationProposedEvent } from './subscription/allocationProposed.js';
import { subscribeHedgeLogs, type HedgeLogEvent } from './subscription/hedgeLog.js';
import type { Orchestrator } from './pipeline/orchestrator.js';
import type { NetExposureLedger } from './pipeline/netExposure.js';
import type { HealthState } from './monitor/health.js';
import type { SentinelMetrics } from './monitor/metrics.js';

export interface RunLoopArgs {
  client: PublicClient;
  busAddress: `0x${string}`;
  fromBlock: bigint;
  orchestrator: Orchestrator;
  ledger: NetExposureLedger;
  health: HealthState;
  metrics: SentinelMetrics;
  abortSignal?: AbortSignal;
  now?: () => number;
}

export interface RunLoopHandle { stop: () => void }

export async function startSentinelRunLoop(args: RunLoopArgs): Promise<RunLoopHandle> {
  const now = args.now ?? (() => Date.now());

  const onProposal = async (event: AllocationProposedEvent): Promise<void> => {
    const result = await args.orchestrator.runVerdictCycle(event.reasoningHash);
    if (result.status === 'published') {
      args.metrics.verdictsTotal.inc();
      args.metrics.hedgeSignalsTotal.inc(result.hedgeSignalCids.length);
      const ts = now();
      args.metrics.lastVerdictMs.set(ts);
      args.health.recordVerdict(ts);
    } else {
      args.metrics.verdictsSkipped.inc({ reason: result.reason });
      if (result.reason === 'verification-failed') args.metrics.verificationFailures.inc();
    }
  };

  const onHedge = async (event: HedgeLogEvent): Promise<void> => {
    args.ledger.apply(event.hedgedAsset, event.netPosition, now());
  };

  const onLiveError = (_err: unknown): void => { args.metrics.subscriptionErrors.inc(); };

  const unsubProposals = await subscribeAllocationProposed(args.client, args.busAddress, args.fromBlock, onProposal, onLiveError);
  const unsubHedges = await subscribeHedgeLogs(args.client, args.busAddress, args.fromBlock, onHedge, onLiveError);

  const stop = (): void => { unsubProposals(); unsubHedges(); };
  if (args.abortSignal) args.abortSignal.addEventListener('abort', stop, { once: true });
  return { stop };
}
