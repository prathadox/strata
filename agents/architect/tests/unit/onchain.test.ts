import { describe, it, expect, vi } from 'vitest';
import { proposeAllocationOnChain } from '../../src/publication/onchain.js';

const EVENT_BUS = `0x${'b'.repeat(40)}` as `0x${string}`;

const BASE_ARGS = {
  eventBus: EVENT_BUS,
  proposalId: 1n,
  seniorBps: 5000n,
  mezzBps: 3000n,
  juniorBps: 2000n,
  reasoningHash: 'bafybeiabc123'
};

const makeMocks = (overrides: any = {}) => {
  const writeContract = overrides.writeContract ?? vi.fn().mockResolvedValue('0xabc...txhash' as const);
  const waitForTransactionReceipt = overrides.waitForTransactionReceipt ?? vi.fn().mockResolvedValue({ status: 'success' });
  const wallet = { writeContract } as any;
  const publicClient = { waitForTransactionReceipt } as any;
  const account = { address: '0xaaaa...' } as any;
  return { wallet, publicClient, account, writeContract, waitForTransactionReceipt };
};

describe('proposeAllocationOnChain', () => {
  it('success path: calls writeContract with correct args and returns tx hash', async () => {
    const { wallet, publicClient, account, writeContract, waitForTransactionReceipt } = makeMocks();

    const result = await proposeAllocationOnChain({
      ...BASE_ARGS,
      wallet,
      publicClient,
      account
    });

    expect(result).toBe('0xabc...txhash');

    expect(writeContract).toHaveBeenCalledOnce();
    const callArgs = writeContract.mock.calls[0][0];
    expect(callArgs.address).toBe(EVENT_BUS);
    expect(callArgs.functionName).toBe('proposeAllocation');
    expect(callArgs.args).toEqual([1n, 5000n, 3000n, 2000n, 'bafybeiabc123']);
    expect(callArgs.abi[0].name).toBe('proposeAllocation');

    expect(waitForTransactionReceipt).toHaveBeenCalledOnce();
  });

  it('reverted tx: throws with "tx reverted" when receipt status is reverted', async () => {
    const { wallet, publicClient, account } = makeMocks({
      waitForTransactionReceipt: vi.fn().mockResolvedValue({ status: 'reverted' })
    });

    await expect(
      proposeAllocationOnChain({ ...BASE_ARGS, wallet, publicClient, account })
    ).rejects.toThrow('tx reverted');
  });

  it('retry on writeContract failure: retries once and returns hash on second attempt', async () => {
    let callCount = 0;
    const writeContract = vi.fn().mockImplementation(() => {
      callCount += 1;
      if (callCount === 1) return Promise.reject(new Error('network blip'));
      return Promise.resolve('0xabc...txhash');
    });

    const { wallet, publicClient, account } = makeMocks({ writeContract });

    const result = await proposeAllocationOnChain({ ...BASE_ARGS, wallet, publicClient, account });

    expect(result).toBe('0xabc...txhash');
    expect(writeContract).toHaveBeenCalledTimes(2);
  });
});
