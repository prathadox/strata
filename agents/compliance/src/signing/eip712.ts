import {
  verifyTypedData,
  recoverTypedDataAddress,
  type Hex
} from 'viem';
import type { LocalAccount } from 'viem/accounts';

export const COMPLIANCE_DOMAIN = {
  name: 'StrataCompliance',
  version: '1',
  chainId: 5000
} as const;

export const DEPOSITOR_AUTH_TYPES = {
  DepositorAuth: [
    { name: 'wallet', type: 'address' },
    { name: 'credentialEvidenceHash', type: 'bytes32' },
    { name: 'deadline', type: 'uint256' }
  ]
} as const;

export const COMPLIANCE_RECEIPT_TYPES = {
  ComplianceReceipt: [
    { name: 'receiptId', type: 'uint256' },
    { name: 'wallet', type: 'address' },
    { name: 'policyTokenId', type: 'uint256' },
    { name: 'permittedTranchesMask', type: 'uint8' },
    { name: 'kycExpiresAtSec', type: 'uint64' },
    { name: 'sanctionsScreenExpiresAtSec', type: 'uint64' },
    { name: 'policyHash', type: 'bytes32' },
    { name: 'credentialEvidenceHash', type: 'bytes32' },
    { name: 'methodologyHash', type: 'bytes32' }
  ]
} as const;

export interface DepositorAuthMessage {
  wallet: Hex;
  credentialEvidenceHash: Hex;
  deadline: bigint;
}

export interface ComplianceReceiptMessage {
  receiptId: bigint;
  wallet: Hex;
  policyTokenId: bigint;
  permittedTranchesMask: number;
  kycExpiresAtSec: bigint;
  sanctionsScreenExpiresAtSec: bigint;
  policyHash: Hex;
  credentialEvidenceHash: Hex;
  methodologyHash: Hex;
}

export interface VerifyDepositorAuthParams {
  signature: Hex;
  wallet: Hex;
  credentialEvidenceHash: Hex;
  deadline: bigint;
  nowSec?: bigint;
}

export interface VerifyDepositorAuthResult {
  valid: boolean;
  recoveredAddress: string;
}

export async function verifyDepositorAuth(
  params: VerifyDepositorAuthParams
): Promise<VerifyDepositorAuthResult> {
  const { signature, wallet, credentialEvidenceHash, deadline, nowSec } = params;
  const now = nowSec ?? BigInt(Math.floor(Date.now() / 1000));

  const message: DepositorAuthMessage = { wallet, credentialEvidenceHash, deadline };

  const recoveredAddress = await recoverTypedDataAddress({
    domain: COMPLIANCE_DOMAIN,
    types: DEPOSITOR_AUTH_TYPES,
    primaryType: 'DepositorAuth',
    message,
    signature
  });

  if (deadline < now) {
    return { valid: false, recoveredAddress };
  }

  const isValid = await verifyTypedData({
    address: wallet,
    domain: COMPLIANCE_DOMAIN,
    types: DEPOSITOR_AUTH_TYPES,
    primaryType: 'DepositorAuth',
    message,
    signature
  });

  return { valid: isValid, recoveredAddress };
}

export async function signDepositorAuth(params: {
  account: LocalAccount;
  wallet: Hex;
  credentialEvidenceHash: Hex;
  deadline: bigint;
}): Promise<Hex> {
  const { account, wallet, credentialEvidenceHash, deadline } = params;
  return account.signTypedData({
    domain: COMPLIANCE_DOMAIN,
    types: DEPOSITOR_AUTH_TYPES,
    primaryType: 'DepositorAuth',
    message: { wallet, credentialEvidenceHash, deadline }
  });
}

export async function signComplianceReceipt(params: {
  account: LocalAccount;
  receipt: ComplianceReceiptMessage;
}): Promise<Hex> {
  const { account, receipt } = params;
  return account.signTypedData({
    domain: COMPLIANCE_DOMAIN,
    types: COMPLIANCE_RECEIPT_TYPES,
    primaryType: 'ComplianceReceipt',
    message: receipt
  });
}

export async function verifyComplianceReceipt(params: {
  signature: Hex;
  receipt: ComplianceReceiptMessage;
  expectedSigner: Hex;
}): Promise<boolean> {
  const { signature, receipt, expectedSigner } = params;
  return verifyTypedData({
    address: expectedSigner,
    domain: COMPLIANCE_DOMAIN,
    types: COMPLIANCE_RECEIPT_TYPES,
    primaryType: 'ComplianceReceipt',
    message: receipt,
    signature
  });
}
