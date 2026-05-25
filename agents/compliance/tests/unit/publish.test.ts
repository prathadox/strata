import { describe, it, expect, vi } from 'vitest';
import { privateKeyToAccount } from 'viem/accounts';
import type { Hex } from 'viem';
import { makePublisher } from '../../src/publication/publish.js';
import type { ComplianceReceipt } from '../../src/types.js';

const TEST_KEY = '0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80' as Hex;
const account = privateKeyToAccount(TEST_KEY);

const MOCK_CID = 'QmTestCid123';
const MOCK_TX_HASH = ('0x' + 'ab'.repeat(32)) as `0x${string}`;

const mockDraft: Omit<ComplianceReceipt, 'signature'> = {
  version: '1.0',
  receiptId: '12345',
  wallet: ('0x' + 'aa'.repeat(20)) as string,
  policyTokenId: '1',
  policyCid: 'QmPolicyCid',
  policyHash: ('0x' + 'bb'.repeat(32)) as string,
  policyResolvedAtBlock: 100,
  kycTier: 'basic',
  jurisdictionCodeHash: ('0x' + 'bb'.repeat(32)) as string,
  sanctionsScreenCid: 'QmScreenCid',
  sanctionsScreenAtSec: 1700000000,
  sanctionsClear: true,
  permittedTranchesMask: 3,
  credentialProvider: 'stub',
  credentialEvidenceHash: ('0x' + 'bb'.repeat(32)) as string,
  evidenceBlobCid: 'QmEvidenceCid',
  depositorAuthSignature: '0xdeadbeef',
  kycExpiresAtSec: 1700000000,
  sanctionsScreenExpiresAtSec: 1700000000,
  publisher: { address: account.address, identityNFT: 'compliance-1' },
  methodologyHash: ('0x' + 'bb'.repeat(32)) as string,
  codeCommit: 'abc123',
  publishedAtSec: 1700000000,
};

function makeArgs(overrides: { dryRun: boolean }) {
  const mockPin = vi.fn().mockResolvedValue(MOCK_CID);
  const mockMint = vi.fn().mockResolvedValue(MOCK_TX_HASH);

  const args = {
    wallet: {} as any,
    publicClient: {} as any,
    account,
    registryAddress: ('0x' + 'cc'.repeat(20)) as `0x${string}`,
    lighthouseApiKey: 'test-key',
    dryRun: overrides.dryRun,
    pinOverride: mockPin,
    mintOverride: mockMint,
  };

  return { args, mockPin, mockMint };
}

describe('makePublisher', () => {
  it('dry-run: signs and pins but does not mint', async () => {
    const { args, mockPin, mockMint } = makeArgs({ dryRun: true });
    const { publishReceipt } = makePublisher(args);

    const result = await publishReceipt(mockDraft);

    expect(result.receiptCid).toBe(MOCK_CID);
    expect(result.receipt.signature).toBeDefined();
    expect(result.txHash).toBeUndefined();
    expect(mockPin).toHaveBeenCalledOnce();
    expect(mockMint).not.toHaveBeenCalled();
  });

  it('live mode: signs, pins, and mints on-chain', async () => {
    const { args, mockPin, mockMint } = makeArgs({ dryRun: false });
    const { publishReceipt } = makePublisher(args);

    const result = await publishReceipt(mockDraft);

    expect(result.receiptCid).toBe(MOCK_CID);
    expect(result.receipt.signature).toBeDefined();
    expect(result.txHash).toBe(MOCK_TX_HASH);
    expect(mockPin).toHaveBeenCalledOnce();
    expect(mockMint).toHaveBeenCalledOnce();
  });

  it('pin failure propagates without minting', async () => {
    const { args, mockPin, mockMint } = makeArgs({ dryRun: false });
    mockPin.mockRejectedValueOnce(new Error('Lighthouse unavailable'));
    const { publishReceipt } = makePublisher(args);

    await expect(publishReceipt(mockDraft)).rejects.toThrow('Lighthouse unavailable');
    expect(mockMint).not.toHaveBeenCalled();
  });

  it('receipt signature is a valid hex string starting with 0x', async () => {
    const { args } = makeArgs({ dryRun: true });
    const { publishReceipt } = makePublisher(args);

    const result = await publishReceipt(mockDraft);

    expect(result.receipt.signature).toMatch(/^0x[a-fA-F0-9]+$/);
  });
});
