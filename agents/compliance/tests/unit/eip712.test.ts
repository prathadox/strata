import { describe, it, expect } from 'vitest';
import { privateKeyToAccount } from 'viem/accounts';
import type { Hex } from 'viem';
import {
  signDepositorAuth,
  verifyDepositorAuth,
  signComplianceReceipt,
  verifyComplianceReceipt,
  type ComplianceReceiptMessage
} from '../../src/signing/eip712.js';

const TEST_KEY = '0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80' as Hex;
const account = privateKeyToAccount(TEST_KEY);

const credentialEvidenceHash = ('0x' + 'ab'.repeat(32)) as Hex;
const futureDeadline = BigInt(Math.floor(Date.now() / 1000) + 3600);
const pastDeadline = BigInt(Math.floor(Date.now() / 1000) - 3600);

describe('signDepositorAuth + verifyDepositorAuth', () => {
  it('round-trip succeeds and recoveredAddress matches signer', async () => {
    const signature = await signDepositorAuth({
      account,
      wallet: account.address,
      credentialEvidenceHash,
      deadline: futureDeadline
    });

    const result = await verifyDepositorAuth({
      signature,
      wallet: account.address,
      credentialEvidenceHash,
      deadline: futureDeadline
    });

    expect(result.valid).toBe(true);
    expect(result.recoveredAddress.toLowerCase()).toBe(account.address.toLowerCase());
  });

  it('returns valid=false when deadline is expired', async () => {
    const signature = await signDepositorAuth({
      account,
      wallet: account.address,
      credentialEvidenceHash,
      deadline: pastDeadline
    });

    const result = await verifyDepositorAuth({
      signature,
      wallet: account.address,
      credentialEvidenceHash,
      deadline: pastDeadline
    });

    expect(result.valid).toBe(false);
    expect(result.recoveredAddress.toLowerCase()).toBe(account.address.toLowerCase());
  });

  it('returns valid=false when verified against wrong wallet', async () => {
    const otherWallet = '0x70997970C51812dc3A010C7d01b50e0d17dc79C8' as Hex;

    const signature = await signDepositorAuth({
      account,
      wallet: account.address,
      credentialEvidenceHash,
      deadline: futureDeadline
    });

    const result = await verifyDepositorAuth({
      signature,
      wallet: otherWallet,
      credentialEvidenceHash,
      deadline: futureDeadline
    });

    expect(result.valid).toBe(false);
  });
});

describe('signComplianceReceipt + verifyComplianceReceipt', () => {
  const receipt: ComplianceReceiptMessage = {
    receiptId: 1n,
    wallet: account.address,
    policyTokenId: 42n,
    permittedTranchesMask: 7,
    kycExpiresAtSec: BigInt(Math.floor(Date.now() / 1000) + 86400),
    sanctionsScreenExpiresAtSec: BigInt(Math.floor(Date.now() / 1000) + 43200),
    policyHash: ('0x' + 'cc'.repeat(32)) as Hex,
    credentialEvidenceHash,
    methodologyHash: ('0x' + 'dd'.repeat(32)) as Hex
  };

  it('round-trip succeeds', async () => {
    const signature = await signComplianceReceipt({ account, receipt });

    const valid = await verifyComplianceReceipt({
      signature,
      receipt,
      expectedSigner: account.address
    });

    expect(valid).toBe(true);
  });

  it('returns false when expectedSigner does not match', async () => {
    const wrongSigner = '0x70997970C51812dc3A010C7d01b50e0d17dc79C8' as Hex;
    const signature = await signComplianceReceipt({ account, receipt });

    const valid = await verifyComplianceReceipt({
      signature,
      receipt,
      expectedSigner: wrongSigner
    });

    expect(valid).toBe(false);
  });
});
