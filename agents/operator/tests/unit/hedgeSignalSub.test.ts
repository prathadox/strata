import { describe, it, expect, vi } from 'vitest';
import { subscribeHedgeSignals } from '../../src/subscription/hedgeSignal.js';

describe('subscribeHedgeSignals', () => {
  it('backfills past events then attaches a live watcher', async () => {
    const calls: any[] = [];
    let liveCallback: ((logs: any[]) => Promise<void>) | undefined;
    const client = {
      getContractEvents: vi.fn().mockResolvedValue([
        { args: { agent: '0xagent', hedgedAsset: '0xA', targetNotionalUsd: 1_000_000n, reasoningHash: 'cidA' }, blockNumber: 100n }
      ]),
      watchContractEvent: vi.fn().mockImplementation((cfg: any) => { liveCallback = cfg.onLogs; return () => {}; })
    } as any;
    await subscribeHedgeSignals(client, '0xbus', 0n, async (e) => { calls.push(e); });
    expect(calls).toHaveLength(1);
    expect(calls[0].targetNotionalUsd).toBe(1_000_000n);
    await liveCallback?.([{ args: { agent: '0xagent', hedgedAsset: '0xB', targetNotionalUsd: -2_000_000n, reasoningHash: 'cidB' }, blockNumber: 101n }]);
    expect(calls).toHaveLength(2);
    expect(calls[1].targetNotionalUsd).toBe(-2_000_000n);
  });
});
