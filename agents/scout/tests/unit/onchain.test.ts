import { describe, it, expect, vi } from 'vitest';
import { publishOnChain } from '../../src/publication/onchain.js';

describe('publishOnChain', () => {
  it('calls writeContract with the correct args and waits for receipt', async () => {
    const writeContract = vi.fn().mockResolvedValue('0xtxhash' as `0x${string}`);
    const waitForTransactionReceipt = vi.fn().mockResolvedValue({ status: 'success' });

    const wallet = { writeContract } as any;
    const publicClient = { waitForTransactionReceipt } as any;
    const account = { address: '0x' + 'a'.repeat(40) } as any;
    const eventBus = ('0x' + 'b'.repeat(40)) as `0x${string}`;

    const hash = await publishOnChain({
      wallet, publicClient, account, eventBus, ipfsHash: 'bafkrei-test'
    });

    expect(hash).toBe('0xtxhash');
    expect(writeContract).toHaveBeenCalledTimes(1);
    const call = writeContract.mock.calls[0][0];
    expect(call.address).toBe(eventBus);
    expect(call.functionName).toBe('publishYieldMap');
    expect(call.args).toEqual(['bafkrei-test']);
    expect(waitForTransactionReceipt).toHaveBeenCalledWith(expect.objectContaining({ hash: '0xtxhash' }));
  });

  it('retries on revert and succeeds on second attempt', async () => {
    let calls = 0;
    const writeContract = vi.fn(async () => {
      calls++;
      if (calls === 1) throw new Error('execution reverted');
      return '0xtxhash2' as `0x${string}`;
    });
    const waitForTransactionReceipt = vi.fn().mockResolvedValue({ status: 'success' });

    const result = await publishOnChain({
      wallet: { writeContract } as any,
      publicClient: { waitForTransactionReceipt } as any,
      account: { address: '0x' + 'a'.repeat(40) } as any,
      eventBus: ('0x' + 'b'.repeat(40)) as `0x${string}`,
      ipfsHash: 'cid'
    });

    expect(result).toBe('0xtxhash2');
    expect(writeContract).toHaveBeenCalledTimes(2);
  });

  it('throws after exhausting retries', async () => {
    const writeContract = vi.fn().mockRejectedValue(new Error('always reverts'));
    const waitForTransactionReceipt = vi.fn();
    await expect(
      publishOnChain({
        wallet: { writeContract } as any,
        publicClient: { waitForTransactionReceipt } as any,
        account: { address: '0x' + 'a'.repeat(40) } as any,
        eventBus: ('0x' + 'b'.repeat(40)) as `0x${string}`,
        ipfsHash: 'cid'
      })
    ).rejects.toThrow(/always reverts/);
  });

  it('throws when the receipt reports non-success', async () => {
    const writeContract = vi.fn().mockResolvedValue('0xtx');
    const waitForTransactionReceipt = vi.fn().mockResolvedValue({ status: 'reverted' });
    await expect(
      publishOnChain({
        wallet: { writeContract } as any,
        publicClient: { waitForTransactionReceipt } as any,
        account: { address: '0x' + 'a'.repeat(40) } as any,
        eventBus: ('0x' + 'b'.repeat(40)) as `0x${string}`,
        ipfsHash: 'cid'
      })
    ).rejects.toThrow(/reverted/);
  });
}, { timeout: 15_000 });
