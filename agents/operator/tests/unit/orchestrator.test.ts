import { describe, it, expect, vi } from 'vitest';
import { Orchestrator } from '../../src/pipeline/orchestrator.js';

describe('Orchestrator.runHedgeCycle', () => {
  it('skips when signal CID matches last processed', async () => {
    const o = new Orchestrator({
      fetchSignal: vi.fn(),
      verifySignal: vi.fn(),
      fetchSpotUsd: vi.fn(),
      methodologyHash: '0x' + '1'.repeat(64),
      codeCommit: 'c',
      publisher: { publishIntent: vi.fn() } as any,
      publisherAddress: '0x' + 'a'.repeat(40),
      identityNFT: 'ipfs://x'
    });
    (o as any).lastProcessedCid = 'bafyDup';
    const r = await o.runHedgeCycle('bafyDup', 1n);
    expect(r.status).toBe('skipped');
    if (r.status === 'skipped') expect(r.reason).toBe('duplicate');
  });
});
