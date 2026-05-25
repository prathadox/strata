import { keccak256, encodePacked } from 'viem';
import type { ComplianceReceipt, CredentialResult, SanctionsScreenResult, JurisdictionPolicy, KycTier } from '../types.js';

export const KYC_TTL_SECONDS: Record<KycTier, number> = {
  none: 86400,
  basic: 180 * 86400,
  enhanced: 365 * 86400
};

export const SANCTIONS_TTL_SECONDS = 86400;

export interface BuildReceiptInput {
  wallet: `0x${string}`;
  credential: CredentialResult;
  sanctionsScreen: SanctionsScreenResult;
  sanctionsScreenCid: string;
  policy: JurisdictionPolicy;
  policyCid: string;
  policyResolvedAtBlock: number;
  permittedTranchesMask: number;
  evidenceBlobCid: string;
  depositorAuthSignature: `0x${string}`;
  publisherAddress: string;
  identityNFT: string;
  methodologyHash: string;
  codeCommit: string;
  nowSec?: number;
  userSalt?: string;
}

export function buildReceipt(input: BuildReceiptInput): Omit<ComplianceReceipt, 'signature'> {
  const nowSec = input.nowSec ?? Math.floor(Date.now() / 1000);

  const receiptSeed = encodePacked(
    ['address', 'bytes32', 'uint256', 'string'],
    [
      input.wallet,
      input.credential.credentialEvidenceHash as `0x${string}`,
      BigInt(input.policy.policyTokenId),
      input.sanctionsScreenCid
    ]
  );
  const receiptId = BigInt(keccak256(receiptSeed)).toString();

  const salt = input.userSalt ?? '0x0000000000000000000000000000000000000000000000000000000000000000';
  const jcSeed = encodePacked(
    ['string', 'bytes32'],
    [input.credential.jurisdictionCode, salt as `0x${string}`]
  );
  const jurisdictionCodeHash = keccak256(jcSeed);

  const kycExpiresAtSec = nowSec + KYC_TTL_SECONDS[input.credential.kycTier];
  const sanctionsScreenExpiresAtSec = nowSec + SANCTIONS_TTL_SECONDS;

  return {
    version: '1.0',
    receiptId,
    wallet: input.wallet,
    policyTokenId: input.policy.policyTokenId,
    policyCid: input.policyCid,
    policyHash: input.policy.policyHash,
    policyResolvedAtBlock: input.policyResolvedAtBlock,
    kycTier: input.credential.kycTier,
    jurisdictionCodeHash,
    sanctionsScreenCid: input.sanctionsScreenCid,
    sanctionsScreenAtSec: input.sanctionsScreen.screenedAtSec,
    sanctionsClear: input.sanctionsScreen.clear,
    permittedTranchesMask: input.permittedTranchesMask,
    credentialProvider: input.credential.provider,
    credentialEvidenceHash: input.credential.credentialEvidenceHash,
    evidenceBlobCid: input.evidenceBlobCid,
    depositorAuthSignature: input.depositorAuthSignature,
    kycExpiresAtSec,
    sanctionsScreenExpiresAtSec,
    publisher: { address: input.publisherAddress, identityNFT: input.identityNFT },
    methodologyHash: input.methodologyHash,
    codeCommit: input.codeCommit,
    publishedAtSec: nowSec
  };
}
