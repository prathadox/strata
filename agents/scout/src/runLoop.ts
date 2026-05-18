import type { YieldMap } from './types.js';
import type { HealthState } from './monitor/health.js';
import type { ScoutMetrics } from './monitor/metrics.js';

export interface RunLoopArgs {
  cycle: () => Promise<YieldMap | null>;
  health: HealthState;
  metrics: ScoutMetrics;
  cycleIntervalMs: number;
  stopAfter?: number;
  abortSignal?: AbortSignal;
}

export async function runScoutLoop(args: RunLoopArgs): Promise<void> {
  let i = 0;
  while (true) {
    if (args.abortSignal?.aborted) return;
    if (args.stopAfter !== undefined && i >= args.stopAfter) return;

    args.metrics.cyclesTotal.inc();
    try {
      const map = await args.cycle();
      const now = Date.now();
      args.health.recordCycle(now);
      args.metrics.lastCycleMs.set(now);
      if (map) args.metrics.opportunitiesGauge.set(map.opportunities.length);
    } catch (err) {
      args.metrics.cyclesFailed.inc();
      // intentional: do not rethrow, loop continues
    }

    i++;
    if (args.stopAfter !== undefined && i >= args.stopAfter) return;
    await new Promise<void>((resolve) => {
      const t = setTimeout(resolve, args.cycleIntervalMs);
      args.abortSignal?.addEventListener('abort', () => { clearTimeout(t); resolve(); }, { once: true });
    });
  }
}
