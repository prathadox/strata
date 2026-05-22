import { describe, it, expect, vi } from 'vitest';
import { startOperatorRunLoop } from '../../src/runLoop.js';

describe('startOperatorRunLoop', () => {
  it('subscribes and exposes stop', async () => {
    const stopUnsub = vi.fn();
    const client = {
      getContractEvents: vi.fn().mockResolvedValue([]),
      watchContractEvent: vi.fn().mockImplementation(() => stopUnsub)
    } as any;
    const orchestrator = { runHedgeCycle: vi.fn() } as any;
    const health = { recordHedge: vi.fn(), asJson: vi.fn() } as any;
    const metrics = {
      hedgesTotal: { inc: vi.fn() }, hedgesSkipped: { inc: vi.fn() },
      verificationFailures: { inc: vi.fn() }, priceFailures: { inc: vi.fn() },
      subscriptionErrors: { inc: vi.fn() }, lastHedgeMs: { set: vi.fn() }
    } as any;
    const handle = await startOperatorRunLoop({
      client, busAddress: '0xbus', fromBlock: 0n, orchestrator, health, metrics
    });
    expect(client.watchContractEvent).toHaveBeenCalledTimes(1);
    handle.stop();
    expect(stopUnsub).toHaveBeenCalled();
  });
});
