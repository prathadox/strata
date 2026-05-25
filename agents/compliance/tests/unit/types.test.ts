import { describe, it, expect } from 'vitest';
import {
  encodeTranchesMask,
  decodeTranchesMask,
  ComplianceReceiptSchema,
  KycTier
} from '../../src/types.js';

describe('encodeTranchesMask', () => {
  it('senior + mezzanine = 3', () => {
    expect(encodeTranchesMask({ senior: true, mezzanine: true, junior: false })).toBe(3);
  });

  it('junior only = 4', () => {
    expect(encodeTranchesMask({ senior: false, mezzanine: false, junior: true })).toBe(4);
  });

  it('all three = 7', () => {
    expect(encodeTranchesMask({ senior: true, mezzanine: true, junior: true })).toBe(7);
  });
});

describe('decodeTranchesMask', () => {
  it('3 = senior + mezzanine', () => {
    expect(decodeTranchesMask(3)).toEqual({ senior: true, mezzanine: true, junior: false });
  });

  it('0 = none', () => {
    expect(decodeTranchesMask(0)).toEqual({ senior: false, mezzanine: false, junior: false });
  });
});

describe('ComplianceReceiptSchema', () => {
  it('rejects permittedTranchesMask > 7', () => {
    const base = {
      version: '1.0' as const,
      receiptId: 'r1',
      wallet: '0x' + 'ab'.repeat(20),
      policyTokenId: '1',
      policyCid: 'bafyabc',
      policyHash: '0x' + 'aa'.repeat(32),
      policyResolvedAtBlock: 100,
      kycTier: 'basic' as const,
      jurisdictionCodeHash: '0x' + 'bb'.repeat(32),
      sanctionsScreenCid: 'bafyscr',
      sanctionsScreenAtSec: 1700000000,
      sanctionsClear: true,
      permittedTranchesMask: 8,
      credentialProvider: 'stub' as const,
      credentialEvidenceHash: '0x' + 'cc'.repeat(32),
      evidenceBlobCid: 'bafyevd',
      depositorAuthSignature: '0xdead',
      kycExpiresAtSec: 1800000000,
      sanctionsScreenExpiresAtSec: 1700086400,
      publisher: { address: '0x' + 'dd'.repeat(20), identityNFT: 'nft1' },
      methodologyHash: '0x' + 'ee'.repeat(32),
      codeCommit: 'abc123',
      publishedAtSec: 1700000000,
      signature: '0xbeef'
    };

    const result = ComplianceReceiptSchema.safeParse(base);
    expect(result.success).toBe(false);
  });
});

describe('KycTier', () => {
  it('parses valid tier', () => {
    expect(KycTier.parse('basic')).toBe('basic');
  });

  it('rejects invalid tier', () => {
    expect(() => KycTier.parse('ultra')).toThrow();
  });
});
