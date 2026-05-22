import { describe, it, expect, vi } from 'vitest';
import { Orchestrator } from '../../src/pipeline/orchestrator.js';

describe('Orchestrator.runVerdictCycle', () => {
  it('skips when proposal CID matches lastProcessedCid', async () => {
    const orchestrator = new Orchestrator({
      fetchProposal: vi.fn(),
      fetchMap: vi.fn(),
      verifyProposal: vi.fn(),
      verifyMap: vi.fn(),
      snapshotExposure: () => ({}),
      methodologyHash: '0x' + '1'.repeat(64),
      codeCommit: 'c',
      publisher: { publishVerdict: vi.fn(), publishHedgeSignal: vi.fn() } as any,
      publisherAddress: '0x' + 'a'.repeat(40),
      identityNFT: 'ipfs://x',
      totalDepositsBaselineUsd: 10_000_000
    });
    (orchestrator as any).lastProcessedCid = 'bafyDup';
    const result = await orchestrator.runVerdictCycle('bafyDup');
    expect(result.status).toBe('skipped');
    if (result.status === 'skipped') expect(result.reason).toBe('duplicate');
  });
});
