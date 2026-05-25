import type { CredentialResult } from '../types.js';

export interface CredentialProof {
  issuer: `0x${string}`;
  wallet: `0x${string}`;
  kycTier: 'none' | 'basic' | 'enhanced';
  jurisdictionCode: string;
  issuedAtSec: number;
  expiresAtSec: number;
  signature: `0x${string}`;
}

export interface CredentialAdapter {
  verify(proof: CredentialProof, wallet: `0x${string}`): Promise<CredentialResult>;
  readonly provider: 'zkpass' | 'privado' | 'stub';
}
