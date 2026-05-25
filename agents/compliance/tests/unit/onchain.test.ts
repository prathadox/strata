import { describe, it, expect, vi } from 'vitest';
import { AbortError } from 'p-retry';
import {
  mintComplianceReceiptOnChain,
  readActiveReceipt,
  readCanDeposit,
} from '../../src/chain/onchain.js';

const REGISTRY = '0x0000000000000000000000000000000000000001' as const;
const DEPOSITOR = '0x0000000000000000000000000000000000000002' as const;

describe('mintComplianceReceiptOnChain', () => {
  it('throws AbortError when wallet rejects the write', async () => {
    const mockWallet = {
      writeContract: vi.fn().mockRejectedValue(new AbortError('user rejected')),
    } as any;
    const mockPublicClient = {
      waitForTransactionReceipt: vi.fn(),
    } as any;

    await expect(
      mintComplianceReceiptOnChain({
        wallet: mockWallet,
        publicClient: mockPublicClient,
        account: {} as any,
        registryAddress: REGISTRY,
        depositorWallet: DEPOSITOR,
        policyTokenId: 1n,
        permittedTranchesMask: 7,
        kycExpiresAtSec: 1700000000n,
        sanctionsScreenExpiresAtSec: 1700086400n,
        tokenURI: 'ipfs://abc',
        retryConfig: { retries: 0, minTimeout: 0, maxTimeout: 0 },
      }),
    ).rejects.toThrow('user rejected');
  });

  it('throws AbortError when tx receipt shows revert', async () => {
    const txHash = '0xdeadbeef' as `0x${string}`;
    const mockWallet = {
      writeContract: vi.fn().mockResolvedValue(txHash),
    } as any;
    const mockPublicClient = {
      waitForTransactionReceipt: vi.fn().mockResolvedValue({ status: 'reverted' }),
    } as any;

    await expect(
      mintComplianceReceiptOnChain({
        wallet: mockWallet,
        publicClient: mockPublicClient,
        account: {} as any,
        registryAddress: REGISTRY,
        depositorWallet: DEPOSITOR,
        policyTokenId: 1n,
        permittedTranchesMask: 7,
        kycExpiresAtSec: 1700000000n,
        sanctionsScreenExpiresAtSec: 1700086400n,
        tokenURI: 'ipfs://abc',
        retryConfig: { retries: 0, minTimeout: 0, maxTimeout: 0 },
      }),
    ).rejects.toThrow(/tx reverted/);
  });
});

describe('readActiveReceipt', () => {
  it('parses a tuple response into a named object', async () => {
    const mockPublicClient = {
      readContract: vi.fn().mockResolvedValue([1n, 7, 1700000000n, 1700086400n]),
    } as any;

    const result = await readActiveReceipt({
      publicClient: mockPublicClient,
      registryAddress: REGISTRY,
      wallet: DEPOSITOR,
    });

    expect(result).toEqual({
      receiptId: 1n,
      mask: 7,
      kycExp: 1700000000n,
      sanctionsExp: 1700086400n,
    });

    expect(mockPublicClient.readContract).toHaveBeenCalledWith({
      address: REGISTRY,
      abi: expect.any(Array),
      functionName: 'activeReceipt',
      args: [DEPOSITOR],
    });
  });

  it('returns null when the read call throws', async () => {
    const mockPublicClient = {
      readContract: vi.fn().mockRejectedValue(new Error('rpc down')),
    } as any;

    const result = await readActiveReceipt({
      publicClient: mockPublicClient,
      registryAddress: REGISTRY,
      wallet: DEPOSITOR,
    });

    expect(result).toBeNull();
  });
});

describe('readCanDeposit', () => {
  it('returns true when the contract says the wallet can deposit', async () => {
    const mockPublicClient = {
      readContract: vi.fn().mockResolvedValue(true),
    } as any;

    const result = await readCanDeposit({
      publicClient: mockPublicClient,
      registryAddress: REGISTRY,
      wallet: DEPOSITOR,
      trancheId: 1,
    });

    expect(result).toBe(true);
  });

  it('returns false when the contract says the wallet cannot deposit', async () => {
    const mockPublicClient = {
      readContract: vi.fn().mockResolvedValue(false),
    } as any;

    const result = await readCanDeposit({
      publicClient: mockPublicClient,
      registryAddress: REGISTRY,
      wallet: DEPOSITOR,
      trancheId: 2,
    });

    expect(result).toBe(false);
  });

  it('returns null when the read call throws', async () => {
    const mockPublicClient = {
      readContract: vi.fn().mockRejectedValue(new Error('timeout')),
    } as any;

    const result = await readCanDeposit({
      publicClient: mockPublicClient,
      registryAddress: REGISTRY,
      wallet: DEPOSITOR,
      trancheId: 1,
    });

    expect(result).toBeNull();
  });
});
