import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('../../src/subscription/yieldMap.js', () => ({
  subscribeYieldMaps: vi.fn()
}));
vi.mock('../../src/subscription/hedgeLog.js', () => ({
  subscribeHedgeLogs: vi.fn()
}));

import { subscribeYieldMaps } from '../../src/subscription/yieldMap.js';
import { subscribeHedgeLogs } from '../../src/subscription/hedgeLog.js';
import { startArchitectRunLoop } from '../../src/runLoop.js';
import { ArchitectMetrics } from '../../src/monitor/metrics.js';
import { HealthState } from '../../src/monitor/health.js';
import { NetExposureLedger } from '../../src/pipeline/netExposure.js';

const BUS = '0xbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb' as `0x${string}`;
const ASSET = '0xcccccccccccccccccccccccccccccccccccccccc' as `0x${string}`;

const FAKE_MAP_EVENT = {
  agent: '0xaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa' as `0x${string}`,
  ipfsHash: 'QmTestHash',
  timestamp: 1000n,
  blockNumber: 1n
};

const FAKE_HEDGE_EVENT = {
  agent: '0xaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa' as `0x${string}`,
  hedgedAsset: ASSET,
  netPosition: 500n,
  executionProof: 'proof-abc',
  blockNumber: 2n
};

function makeOrchestrator(result: any) {
  return { runProposalCycle: vi.fn().mockResolvedValue(result) };
}

function makeArgs(orchestrator: any, metrics: ArchitectMetrics, health: HealthState, ledger: NetExposureLedger, extra: any = {}) {
  return {
    client: {} as any,
    busAddress: BUS,
    fromBlock: 0n,
    orchestrator,
    ledger,
    health,
    metrics,
    now: () => 1_700_000_000_000,
    ...extra
  };
}

describe('startArchitectRunLoop', () => {
  let capturedOnMap: (e: any) => Promise<void>;
  let capturedOnHedge: (e: any) => Promise<void>;
  let capturedOnLiveError: (err: unknown) => void;
  let unsubMapsSpy: ReturnType<typeof vi.fn>;
  let unsubHedgesSpy: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    vi.clearAllMocks();

    unsubMapsSpy = vi.fn();
    unsubHedgesSpy = vi.fn();

    (subscribeYieldMaps as any).mockImplementation(
      async (_c: any, _b: any, _f: any, onMap: any, onLiveError: any) => {
        capturedOnMap = onMap;
        capturedOnLiveError = onLiveError;
        return unsubMapsSpy;
      }
    );

    (subscribeHedgeLogs as any).mockImplementation(
      async (_c: any, _b: any, _f: any, onHedge: any) => {
        capturedOnHedge = onHedge;
        return unsubHedgesSpy;
      }
    );
  });

  describe('test 1: successful published cycle', () => {
    it('increments proposalsTotal, sets lastProposalMs, and health remains healthy', async () => {
      const metrics = new ArchitectMetrics();
      const health = new HealthState();
      const ledger = new NetExposureLedger();
      const orch = makeOrchestrator({ status: 'published', cid: 'bafy_pub', proposalId: 'pid', txHash: null });

      await startArchitectRunLoop(makeArgs(orch, metrics, health, ledger));

      await capturedOnMap(FAKE_MAP_EVENT);

      const text = await metrics.registry.metrics();
      expect(text).toContain('architect_proposals_total 1');
      expect(text).toContain('architect_last_proposal_ms 1700000000000');
      expect(health.isHealthy(1_700_000_000_000)).toBe(true);
    });
  });

  describe('test 2: skipped cycle - duplicate', () => {
    it('increments proposalsSkipped with reason=duplicate, does not increment proposalsTotal or set lastProposalMs', async () => {
      const metrics = new ArchitectMetrics();
      const health = new HealthState();
      const ledger = new NetExposureLedger();
      const orch = makeOrchestrator({ status: 'skipped', reason: 'duplicate' });

      await startArchitectRunLoop(makeArgs(orch, metrics, health, ledger));

      await capturedOnMap(FAKE_MAP_EVENT);

      const text = await metrics.registry.metrics();
      expect(text).toContain('architect_proposals_skipped{reason="duplicate"} 1');
      expect(text).toContain('architect_proposals_total 0');
      // lastProposalMs should not be set - gauge defaults to 0
      expect(text).not.toContain('architect_last_proposal_ms 1700000000000');
    });
  });

  describe('test 3: skipped cycle - verification-failed', () => {
    it('increments verificationFailures and proposalsSkipped with reason=verification-failed', async () => {
      const metrics = new ArchitectMetrics();
      const health = new HealthState();
      const ledger = new NetExposureLedger();
      const orch = makeOrchestrator({ status: 'skipped', reason: 'verification-failed' });

      await startArchitectRunLoop(makeArgs(orch, metrics, health, ledger));

      await capturedOnMap(FAKE_MAP_EVENT);

      const text = await metrics.registry.metrics();
      expect(text).toContain('architect_proposals_skipped{reason="verification-failed"} 1');
      expect(text).toContain('architect_verification_failures 1');
    });
  });

  describe('test 4: hedge event updates ledger', () => {
    it('applies the hedge event to the ledger with the correct net position', async () => {
      const metrics = new ArchitectMetrics();
      const health = new HealthState();
      const ledger = new NetExposureLedger();
      const orch = makeOrchestrator({ status: 'published', cid: 'bafy', proposalId: 'p', txHash: null });

      await startArchitectRunLoop(makeArgs(orch, metrics, health, ledger));

      await capturedOnHedge(FAKE_HEDGE_EVENT);

      expect(ledger.get(ASSET)).toBe(500n);
    });
  });

  describe('test 5: subscription error increments counter', () => {
    it('increments subscriptionErrors when onLiveError is called', async () => {
      const metrics = new ArchitectMetrics();
      const health = new HealthState();
      const ledger = new NetExposureLedger();
      const orch = makeOrchestrator({ status: 'published', cid: 'bafy', proposalId: 'p', txHash: null });

      await startArchitectRunLoop(makeArgs(orch, metrics, health, ledger));

      capturedOnLiveError(new Error('blip'));

      const text = await metrics.registry.metrics();
      expect(text).toContain('architect_subscription_errors 1');
    });
  });

  describe('test 6: stop() invokes both unsubscribe functions', () => {
    it('calls both unsub spies when stop() is invoked', async () => {
      const metrics = new ArchitectMetrics();
      const health = new HealthState();
      const ledger = new NetExposureLedger();
      const orch = makeOrchestrator({ status: 'published', cid: 'bafy', proposalId: 'p', txHash: null });

      const handle = await startArchitectRunLoop(makeArgs(orch, metrics, health, ledger));

      expect(unsubMapsSpy).not.toHaveBeenCalled();
      expect(unsubHedgesSpy).not.toHaveBeenCalled();

      handle.stop();

      expect(unsubMapsSpy).toHaveBeenCalledTimes(1);
      expect(unsubHedgesSpy).toHaveBeenCalledTimes(1);
    });
  });

  describe('test 7: abortSignal triggers stop', () => {
    it('calls both unsub functions when the AbortSignal fires', async () => {
      const metrics = new ArchitectMetrics();
      const health = new HealthState();
      const ledger = new NetExposureLedger();
      const orch = makeOrchestrator({ status: 'published', cid: 'bafy', proposalId: 'p', txHash: null });

      const ac = new AbortController();

      await startArchitectRunLoop(makeArgs(orch, metrics, health, ledger, { abortSignal: ac.signal }));

      expect(unsubMapsSpy).not.toHaveBeenCalled();
      expect(unsubHedgesSpy).not.toHaveBeenCalled();

      ac.abort();

      expect(unsubMapsSpy).toHaveBeenCalledTimes(1);
      expect(unsubHedgesSpy).toHaveBeenCalledTimes(1);
    });
  });
});
