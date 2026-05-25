'use client';

import { privateKeyToAccount } from 'viem/accounts';
import { keccak256, encodePacked } from 'viem';

const STUB_ISSUER_KEY = '0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80' as const;
const STUB_ISSUER = privateKeyToAccount(STUB_ISSUER_KEY);

const ISSUER_DOMAIN = {
  name: 'StrataTestIssuer',
  version: '1',
  chainId: 5000
} as const;

const CREDENTIAL_TYPES = {
  Credential: [
    { name: 'wallet', type: 'address' },
    { name: 'kycTier', type: 'string' },
    { name: 'jurisdictionCode', type: 'string' },
    { name: 'issuedAtSec', type: 'uint256' },
    { name: 'expiresAtSec', type: 'uint256' }
  ]
} as const;

export async function generateStubCredential(
  wallet: `0x${string}`,
  jurisdictionCode: string = 'US',
  kycTier: 'none' | 'basic' | 'enhanced' = 'basic'
) {
  const nowSec = Math.floor(Date.now() / 1000);
  const issuedAtSec = nowSec;
  const expiresAtSec = nowSec + 365 * 86400;

  const signature = await STUB_ISSUER.signTypedData({
    domain: ISSUER_DOMAIN,
    types: CREDENTIAL_TYPES,
    primaryType: 'Credential',
    message: {
      wallet,
      kycTier,
      jurisdictionCode,
      issuedAtSec: BigInt(issuedAtSec),
      expiresAtSec: BigInt(expiresAtSec)
    }
  });

  const credentialEvidenceHash = keccak256(encodePacked(['bytes'], [signature]));

  return {
    proof: {
      issuer: STUB_ISSUER.address,
      wallet,
      kycTier,
      jurisdictionCode,
      issuedAtSec,
      expiresAtSec,
      signature
    },
    credentialEvidenceHash
  };
}
