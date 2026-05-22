import { describe, it, expect, vi } from 'vitest';
import { issueRiskVerdictOnChain } from '../../src/publication/onchain.js';

describe('issueRiskVerdictOnChain', () => {
  it('throws AbortError on revert and does not retry', async () => {
    const wallet = { writeContract: vi.fn().mockResolvedValue('0xtx') } as any;
    const publicClient = { waitForTransactionReceipt: vi.fn().mockResolvedValue({ status: 'reverted' }) } as any;
    await expect(
      issueRiskVerdictOnChain({
        wallet, publicClient, account: {} as any, eventBus: '0xbus',
        proposalId: 1n, seniorVerdict: 0, mezzVerdict: 0, juniorVerdict: 0, reasoningHash: 'cid',
        retryConfig: { retries: 5, minTimeout: 1, maxTimeout: 2 }
      })
    ).rejects.toThrow(/tx reverted/);
    expect(wallet.writeContract).toHaveBeenCalledTimes(1);
  });
});
