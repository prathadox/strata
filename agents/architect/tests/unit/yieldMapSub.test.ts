import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { PublicClient } from 'viem';
import { subscribeYieldMaps } from '../../src/subscription/yieldMap.js';

const AGENT = '0xaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa' as `0x${string}`;
const BUS = '0xbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb' as `0x${string}`;

const fakeLog = (ipfsHash: string, blockNumber: bigint, ts: bigint, agent: `0x${string}` = AGENT) => ({
  args: { agent, ipfsHash, timestamp: ts },
  blockNumber
});

describe('subscribeYieldMaps', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('backfill + live: invokes callback 3 times in order with correct ipfsHash values', async () => {
    const onLogsCallbacks: ((logs: ReturnType<typeof fakeLog>[]) => Promise<void>)[] = [];
    const unsubscribeSpy = vi.fn();

    const client = {
      getContractEvents: vi.fn().mockResolvedValue([
        fakeLog('Qm1', 100n, 1700n),
        fakeLog('Qm2', 101n, 1701n)
      ]),
      watchContractEvent: vi.fn((opts: { onLogs: (logs: ReturnType<typeof fakeLog>[]) => Promise<void> }) => {
        onLogsCallbacks.push(opts.onLogs);
        return unsubscribeSpy;
      })
    } as unknown as PublicClient;

    const received: string[] = [];
    const onMap = vi.fn(async (e: { ipfsHash: string }) => {
      received.push(e.ipfsHash);
    });

    await subscribeYieldMaps(client, BUS, 50n, onMap);

    // Trigger a live event
    await onLogsCallbacks[0]([fakeLog('Qm3', 102n, 1702n)]);

    expect(onMap).toHaveBeenCalledTimes(3);
    expect(received).toEqual(['Qm1', 'Qm2', 'Qm3']);
  });

  it('no past events: only live events trigger callbacks', async () => {
    const onLogsCallbacks: ((logs: ReturnType<typeof fakeLog>[]) => Promise<void>)[] = [];
    const unsubscribeSpy = vi.fn();

    const client = {
      getContractEvents: vi.fn().mockResolvedValue([]),
      watchContractEvent: vi.fn((opts: { onLogs: (logs: ReturnType<typeof fakeLog>[]) => Promise<void> }) => {
        onLogsCallbacks.push(opts.onLogs);
        return unsubscribeSpy;
      })
    } as unknown as PublicClient;

    const onMap = vi.fn(async () => {});

    await subscribeYieldMaps(client, BUS, 50n, onMap);

    // No backfill invocations
    expect(onMap).toHaveBeenCalledTimes(0);

    // Trigger a live event
    await onLogsCallbacks[0]([fakeLog('QmLive', 200n, 2000n)]);

    expect(onMap).toHaveBeenCalledTimes(1);
    expect(onMap).toHaveBeenCalledWith(
      expect.objectContaining({ ipfsHash: 'QmLive', blockNumber: 200n })
    );
  });

  it('unsubscribe: returned function invokes the watchContractEvent unsubscribe spy', async () => {
    const unsubscribeSpy = vi.fn();

    const client = {
      getContractEvents: vi.fn().mockResolvedValue([]),
      watchContractEvent: vi.fn(() => unsubscribeSpy)
    } as unknown as PublicClient;

    const onMap = vi.fn(async () => {});

    const unsubscribe = await subscribeYieldMaps(client, BUS, 50n, onMap);

    expect(unsubscribeSpy).not.toHaveBeenCalled();
    unsubscribe();
    expect(unsubscribeSpy).toHaveBeenCalledTimes(1);
  });
});
