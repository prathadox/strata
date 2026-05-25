import { describe, it, expect } from 'vitest';
import type { CredentialResult, SanctionsScreenResult, JurisdictionPolicy } from '../../src/types.js';
import {
  buildReceipt,
  KYC_TTL_SECONDS,
  SANCTIONS_TTL_SECONDS,
  type BuildReceiptInput
} from '../../src/pipeline/buildReceipt.js';

const NOW = 1_700_000_000;

const credential: CredentialResult = {
  valid: true,
  kycTier: 'basic',
  jurisdictionCode: 'US',
  credentialEvidenceHash: '0xaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
  issuer: '0x1111111111111111111111111111111111111111',
  provider: 'zkpass'
};

const sanctionsScreen: SanctionsScreenResult = {
  wallet: '0x2222222222222222222222222222222222222222',
  clear: true,
  screenedAtSec: NOW - 60,
  resultHash: '0xbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb',
  provider: 'chainalysis'
};

const policy = {
  version: '1.0' as const,
  policyTokenId: '42',
  jurisdictionCode: 'US',
  policyHash: '0xcccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccc',
  permittedTranchesByKycTier: { none: 4, basic: 3, enhanced: 7 }
} as JurisdictionPolicy;

function makeInput(overrides?: Partial<BuildReceiptInput>): BuildReceiptInput {
  return {
    wallet: '0x2222222222222222222222222222222222222222',
    credential,
    sanctionsScreen,
    sanctionsScreenCid: 'bafyscreen1',
    policy,
    policyCid: 'bafypolicy1',
    policyResolvedAtBlock: 100_000,
    permittedTranchesMask: 3,
    evidenceBlobCid: 'bafyevidence1',
    depositorAuthSignature: '0xdeadbeef',
    publisherAddress: '0x3333333333333333333333333333333333333333',
    identityNFT: 'strata-identity-42',
    methodologyHash: '0xdddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd',
    codeCommit: 'abc1234',
    nowSec: NOW,
    ...overrides
  };
}

describe('buildReceipt', () => {
  it('receiptId is idempotent for identical inputs', () => {
    const a = buildReceipt(makeInput());
    const b = buildReceipt(makeInput());
    expect(a.receiptId).toBe(b.receiptId);
  });

  it('receiptId changes when wallet changes', () => {
    const a = buildReceipt(makeInput());
    const b = buildReceipt(makeInput({
      wallet: '0x4444444444444444444444444444444444444444'
    }));
    expect(a.receiptId).not.toBe(b.receiptId);
  });

  it('receiptId changes when policyTokenId changes', () => {
    const a = buildReceipt(makeInput());
    const altPolicy = { ...policy, policyTokenId: '99' } as JurisdictionPolicy;
    const b = buildReceipt(makeInput({ policy: altPolicy }));
    expect(a.receiptId).not.toBe(b.receiptId);
  });

  it('jurisdictionCodeHash is salted: different salts produce different hashes', () => {
    const a = buildReceipt(makeInput({
      userSalt: '0x0000000000000000000000000000000000000000000000000000000000000001'
    }));
    const b = buildReceipt(makeInput({
      userSalt: '0x0000000000000000000000000000000000000000000000000000000000000002'
    }));
    expect(a.jurisdictionCodeHash).not.toBe(b.jurisdictionCodeHash);
  });

  it('kycExpiresAtSec for basic tier = nowSec + 180 * 86400', () => {
    const receipt = buildReceipt(makeInput());
    expect(receipt.kycExpiresAtSec).toBe(NOW + 180 * 86400);
  });

  it('kycExpiresAtSec for enhanced tier = nowSec + 365 * 86400', () => {
    const enhancedCred: CredentialResult = { ...credential, kycTier: 'enhanced' };
    const receipt = buildReceipt(makeInput({ credential: enhancedCred }));
    expect(receipt.kycExpiresAtSec).toBe(NOW + 365 * 86400);
  });

  it('kycExpiresAtSec for none tier = nowSec + 86400', () => {
    const noneCred: CredentialResult = { ...credential, kycTier: 'none' };
    const receipt = buildReceipt(makeInput({ credential: noneCred }));
    expect(receipt.kycExpiresAtSec).toBe(NOW + KYC_TTL_SECONDS.none);
    expect(receipt.kycExpiresAtSec).toBe(NOW + 86400);
  });

  it('sanctionsScreenExpiresAtSec is always nowSec + 86400', () => {
    const receipt = buildReceipt(makeInput());
    expect(receipt.sanctionsScreenExpiresAtSec).toBe(NOW + SANCTIONS_TTL_SECONDS);
    expect(receipt.sanctionsScreenExpiresAtSec).toBe(NOW + 86400);
  });

  it('all output fields are present and well-formed', () => {
    const receipt = buildReceipt(makeInput());

    expect(receipt.version).toBe('1.0');
    expect(receipt.receiptId).toMatch(/^\d+$/);
    expect(receipt.wallet).toBe('0x2222222222222222222222222222222222222222');
    expect(receipt.policyTokenId).toBe('42');
    expect(receipt.policyCid).toBe('bafypolicy1');
    expect(receipt.policyHash).toMatch(/^0x[a-f0-9]{64}$/);
    expect(receipt.policyResolvedAtBlock).toBe(100_000);
    expect(receipt.kycTier).toBe('basic');
    expect(receipt.jurisdictionCodeHash).toMatch(/^0x[a-f0-9]{64}$/);
    expect(receipt.sanctionsScreenCid).toBe('bafyscreen1');
    expect(receipt.sanctionsScreenAtSec).toBe(NOW - 60);
    expect(receipt.sanctionsClear).toBe(true);
    expect(receipt.permittedTranchesMask).toBe(3);
    expect(receipt.credentialProvider).toBe('zkpass');
    expect(receipt.credentialEvidenceHash).toMatch(/^0x[a-f0-9]{64}$/);
    expect(receipt.evidenceBlobCid).toBe('bafyevidence1');
    expect(receipt.depositorAuthSignature).toBe('0xdeadbeef');
    expect(receipt.kycExpiresAtSec).toBeGreaterThan(NOW);
    expect(receipt.sanctionsScreenExpiresAtSec).toBeGreaterThan(NOW);
    expect(receipt.publisher.address).toBe('0x3333333333333333333333333333333333333333');
    expect(receipt.publisher.identityNFT).toBe('strata-identity-42');
    expect(receipt.methodologyHash).toMatch(/^0x[a-f0-9]{64}$/);
    expect(receipt.codeCommit).toBe('abc1234');
    expect(receipt.publishedAtSec).toBe(NOW);

    expect(receipt).not.toHaveProperty('signature');
  });
});
