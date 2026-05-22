import { describe, it, expect, vi } from 'vitest';
import { startSentinelRunLoop } from '../../src/runLoop.js';

describe('startSentinelRunLoop', () => {
  it('subscribes to both feeds and exposes stop', async () => {
    const stopMaps = vi.fn();
    const stopHedges = vi.fn();
    const client = {
      getContractEvents: vi.fn().mockResolvedValue([]),
      watchContractEvent: vi.fn().mockImplementationOnce(() => stopMaps).mockImplementationOnce(() => stopHedges)
    } as any;
    const orchestrator = { runVerdictCycle: vi.fn() } as any;
    const ledger = { apply: vi.fn() } as any;
    const health = { recordVerdict: vi.fn(), asJson: vi.fn() } as any;
    const metrics = {
      verdictsTotal: { inc: vi.fn() }, verdictsSkipped: { inc: vi.fn() },
      hedgeSignalsTotal: { inc: vi.fn() }, verificationFailures: { inc: vi.fn() },
      subscriptionErrors: { inc: vi.fn() }, lastVerdictMs: { set: vi.fn() }
    } as any;
    const handle = await startSentinelRunLoop({
      client, busAddress: '0xbus', fromBlock: 0n, orchestrator, ledger, health, metrics
    });
    expect(client.watchContractEvent).toHaveBeenCalledTimes(2);
    handle.stop();
    expect(stopMaps).toHaveBeenCalled();
    expect(stopHedges).toHaveBeenCalled();
  });
});
