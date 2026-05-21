import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('../../src/ipfs/fetch.js', () => ({
  fetchYieldMapByCid: vi.fn()
}));
vi.mock('../../src/verify/yieldMap.js', () => ({
  verifyYieldMap: vi.fn()
}));
vi.mock('../../src/pipeline/buildProposal.js', () => ({
  buildProposal: vi.fn()
}));

import { fetchYieldMapByCid } from '../../src/ipfs/fetch.js';
import { verifyYieldMap } from '../../src/verify/yieldMap.js';
import { buildProposal } from '../../src/pipeline/buildProposal.js';
import { Orchestrator } from '../../src/pipeline/orchestrator.js';
import type { OrchestratorDeps } from '../../src/pipeline/orchestrator.js';
import type { AllocationProposal } from '../../src/types.js';

const fetchMock = fetchYieldMapByCid as ReturnType<typeof vi.fn>;
const verifyMock = verifyYieldMap as ReturnType<typeof vi.fn>;
const buildMock = buildProposal as ReturnType<typeof vi.fn>;

// Minimal YieldMap stub - the orchestrator passes it through; shape details don't matter.
const STUB_MAP = { version: '1.0', publishedAtMs: 1_700_000_000_000 } as any;

// A stub unsigned proposal with realistic-looking values.
const STUB_UNSIGNED: Omit<AllocationProposal, 'signature'> = {
  version: '1.0',
  proposalId: '99887766554433221100',
  sourceMapCid: 'bafy_source_cid',
  publishedAtMs: 1_700_000_000_000,
  publisher: {
    address: `0x${'a'.repeat(40)}`,
    identityNFT: 'nft-stub'
  },
  methodologyHash: `0x${'b'.repeat(64)}`,
  codeCommit: 'abc1234',
  tranches: {
    senior:    { bps: 5000, positions: { pool1: 10_000 } },
    mezzanine: { bps: 3000, positions: { pool2: 10_000 } },
    junior:    { bps: 2000, positions: { pool3: 10_000 } }
  },
  netExposureAtProposalMs: {}
};

// Zero-state variant: all bps = 0.
const STUB_UNSIGNED_ZERO: Omit<AllocationProposal, 'signature'> = {
  ...STUB_UNSIGNED,
  tranches: {
    senior:    { bps: 0, positions: {} },
    mezzanine: { bps: 0, positions: {} },
    junior:    { bps: 0, positions: {} }
  }
};

const STUB_PUBLISH_RESULT = {
  proposal: { ...STUB_UNSIGNED, signature: '0xdeadbeef' } as AllocationProposal,
  cid: 'bafy_published_cid',
  txHash: '0xabc123tx' as `0x${string}`
};

function makePublisherStub(result = STUB_PUBLISH_RESULT) {
  return { publishProposal: vi.fn().mockResolvedValue(result) };
}

function makeDeps(overrides: Partial<OrchestratorDeps> = {}): OrchestratorDeps {
  return {
    publisher: makePublisherStub(),
    ledger: { snapshot: () => ({}) } as any,
    publisherAddress: `0x${'a'.repeat(40)}` as `0x${string}`,
    identityNFT: 'nft-stub',
    methodologyHash: `0x${'b'.repeat(64)}`,
    codeCommit: 'abc1234',
    ...overrides
  };
}

beforeEach(() => {
  vi.clearAllMocks();
  fetchMock.mockResolvedValue(STUB_MAP);
  verifyMock.mockResolvedValue(undefined);
  buildMock.mockReturnValue(STUB_UNSIGNED);
});

describe('Orchestrator.runProposalCycle', () => {
  describe('test 1: happy path', () => {
    it('publishes and returns status=published with correct cid, proposalId, txHash', async () => {
      const deps = makeDeps();
      const orch = new Orchestrator(deps);

      const result = await orch.runProposalCycle('bafy_source_cid');

      expect(result).toEqual({
        status: 'published',
        cid: STUB_PUBLISH_RESULT.cid,
        proposalId: STUB_UNSIGNED.proposalId,
        txHash: STUB_PUBLISH_RESULT.txHash
      });

      expect(fetchMock).toHaveBeenCalledOnce();
      expect(fetchMock).toHaveBeenCalledWith('bafy_source_cid');

      expect(verifyMock).toHaveBeenCalledOnce();
      expect(verifyMock).toHaveBeenCalledWith(STUB_MAP, undefined);

      expect(buildMock).toHaveBeenCalledOnce();

      expect(deps.publisher.publishProposal).toHaveBeenCalledOnce();
      expect(deps.publisher.publishProposal).toHaveBeenCalledWith(STUB_UNSIGNED);
    });
  });

  describe('test 2: dedup', () => {
    it('second call with same CID returns skipped/duplicate; fetch/verify/build/publish not called again', async () => {
      const deps = makeDeps();
      const orch = new Orchestrator(deps);

      // First call: publishes.
      const first = await orch.runProposalCycle('bafy_cid_1');
      expect(first.status).toBe('published');

      vi.clearAllMocks();

      // Second call: same CID.
      const second = await orch.runProposalCycle('bafy_cid_1');
      expect(second).toEqual({ status: 'skipped', reason: 'duplicate' });

      expect(fetchMock).not.toHaveBeenCalled();
      expect(verifyMock).not.toHaveBeenCalled();
      expect(buildMock).not.toHaveBeenCalled();
      expect(deps.publisher.publishProposal).not.toHaveBeenCalled();
    });
  });

  describe('test 3: verification failure', () => {
    it('returns skipped/verification-failed; publisher not called; lastProcessedCid not updated', async () => {
      verifyMock.mockRejectedValueOnce(new Error('bad signature'));

      const deps = makeDeps();
      const orch = new Orchestrator(deps);

      const result = await orch.runProposalCycle('bafy_unverified');
      expect(result).toEqual({ status: 'skipped', reason: 'verification-failed' });

      expect(fetchMock).toHaveBeenCalledOnce();
      expect(verifyMock).toHaveBeenCalledOnce();
      expect(buildMock).not.toHaveBeenCalled();
      expect(deps.publisher.publishProposal).not.toHaveBeenCalled();

      // lastProcessedCid was NOT set; a retry with the same CID should not be skipped as duplicate.
      vi.clearAllMocks();
      verifyMock.mockResolvedValueOnce(undefined);
      buildMock.mockReturnValueOnce(STUB_UNSIGNED);

      const retry = await orch.runProposalCycle('bafy_unverified');
      expect(retry.status).toBe('published');
    });
  });

  describe('test 4: zero-state', () => {
    it('returns skipped/zero-state; publisher not called; lastProcessedCid not updated', async () => {
      buildMock.mockReturnValueOnce(STUB_UNSIGNED_ZERO);

      const deps = makeDeps();
      const orch = new Orchestrator(deps);

      const result = await orch.runProposalCycle('bafy_zero');
      expect(result).toEqual({ status: 'skipped', reason: 'zero-state' });

      expect(fetchMock).toHaveBeenCalledOnce();
      expect(verifyMock).toHaveBeenCalledOnce();
      expect(buildMock).toHaveBeenCalledOnce();
      expect(deps.publisher.publishProposal).not.toHaveBeenCalled();

      // lastProcessedCid was NOT set; retry with same CID should not be a duplicate.
      vi.clearAllMocks();
      buildMock.mockReturnValueOnce(STUB_UNSIGNED);

      const retry = await orch.runProposalCycle('bafy_zero');
      expect(retry.status).toBe('published');
    });
  });

  describe('test 5: fetch failure', () => {
    it('propagates the fetch error; does not silently skip; lastProcessedCid not updated', async () => {
      const fetchError = new Error('all gateways failed');
      fetchMock.mockRejectedValueOnce(fetchError);

      const deps = makeDeps();
      const orch = new Orchestrator(deps);

      await expect(orch.runProposalCycle('bafy_bad_cid')).rejects.toThrow('all gateways failed');

      expect(verifyMock).not.toHaveBeenCalled();
      expect(buildMock).not.toHaveBeenCalled();
      expect(deps.publisher.publishProposal).not.toHaveBeenCalled();

      // lastProcessedCid was NOT set; same CID should attempt again.
      vi.clearAllMocks();
      const retry = await orch.runProposalCycle('bafy_bad_cid');
      expect(retry.status).toBe('published');
    });
  });

  describe('test 6: publish failure', () => {
    it('propagates publish error; lastProcessedCid not updated', async () => {
      const publishError = new Error('pin failed');
      const deps = makeDeps({
        publisher: { publishProposal: vi.fn().mockRejectedValueOnce(publishError) }
      });
      const orch = new Orchestrator(deps);

      await expect(orch.runProposalCycle('bafy_publish_fail')).rejects.toThrow('pin failed');

      expect(fetchMock).toHaveBeenCalledOnce();
      expect(verifyMock).toHaveBeenCalledOnce();
      expect(buildMock).toHaveBeenCalledOnce();

      // lastProcessedCid was NOT set; retry should call publish again.
      vi.clearAllMocks();
      (deps.publisher.publishProposal as ReturnType<typeof vi.fn>).mockResolvedValueOnce(STUB_PUBLISH_RESULT);

      const retry = await orch.runProposalCycle('bafy_publish_fail');
      expect(retry.status).toBe('published');
    });
  });
});
