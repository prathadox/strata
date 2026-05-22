import type { PublicClient } from 'viem';
import { subscribeHedgeSignals, type HedgeSignalEvent } from './subscription/hedgeSignal.js';
import type { Orchestrator } from './pipeline/orchestrator.js';
import type { HealthState } from './monitor/health.js';
import type { OperatorMetrics } from './monitor/metrics.js';

export interface RunLoopArgs {
  client: PublicClient;
  busAddress: `0x${string}`;
  fromBlock: bigint;
  orchestrator: Orchestrator;
  health: HealthState;
  metrics: OperatorMetrics;
  abortSignal?: AbortSignal;
  now?: () => number;
}

export interface RunLoopHandle { stop: () => void }

export async function startOperatorRunLoop(args: RunLoopArgs): Promise<RunLoopHandle> {
  const now = args.now ?? (() => Date.now());

  const onSignal = async (event: HedgeSignalEvent): Promise<void> => {
    const result = await args.orchestrator.runHedgeCycle(event.reasoningHash, event.blockNumber);
    if (result.status === 'published') {
      args.metrics.hedgesTotal.inc();
      const ts = now();
      args.metrics.lastHedgeMs.set(ts);
      args.health.recordHedge(ts);
    } else {
      args.metrics.hedgesSkipped.inc({ reason: result.reason });
      if (result.reason === 'verification-failed') args.metrics.verificationFailures.inc();
      if (result.reason === 'price-unavailable') args.metrics.priceFailures.inc();
    }
  };

  const onLiveError = (_err: unknown): void => { args.metrics.subscriptionErrors.inc(); };

  const unsubscribe = await subscribeHedgeSignals(args.client, args.busAddress, args.fromBlock, onSignal, onLiveError);
  const stop = (): void => { unsubscribe(); };
  if (args.abortSignal) args.abortSignal.addEventListener('abort', stop, { once: true });
  return { stop };
}
