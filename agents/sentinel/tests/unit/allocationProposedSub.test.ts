import { describe, it, expect, vi } from 'vitest';
import { subscribeAllocationProposed } from '../../src/subscription/allocationProposed.js';

describe('subscribeAllocationProposed', () => {
  it('backfills past events then attaches a live watcher', async () => {
    const calls: any[] = [];
    let liveCallback: ((logs: any[]) => Promise<void>) | undefined;
    const client = {
      getContractEvents: vi.fn().mockResolvedValue([
        { args: { agent: '0xagent', proposalId: 1n, seniorBps: 5000n, mezzBps: 3000n, juniorBps: 2000n, reasoningHash: 'cidA' }, blockNumber: 100n },
        { args: { agent: '0xagent', proposalId: 2n, seniorBps: 5000n, mezzBps: 3000n, juniorBps: 2000n, reasoningHash: 'cidB' }, blockNumber: 101n }
      ]),
      watchContractEvent: vi.fn().mockImplementation((cfg: any) => { liveCallback = cfg.onLogs; return () => {}; })
    } as any;
    const unsub = await subscribeAllocationProposed(client, '0xbus', 0n, async (e) => { calls.push(e); });
    expect(calls).toHaveLength(2);
    expect(calls[0].reasoningHash).toBe('cidA');
    await liveCallback?.([{ args: { agent: '0xagent', proposalId: 3n, seniorBps: 4000n, mezzBps: 3500n, juniorBps: 2500n, reasoningHash: 'cidC' }, blockNumber: 102n }]);
    expect(calls).toHaveLength(3);
    expect(calls[2].reasoningHash).toBe('cidC');
    unsub();
  });
});
