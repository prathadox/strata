import type { WalletClient, PublicClient, Account } from 'viem';
import pRetry, { AbortError } from 'p-retry';
import { complianceRegistryAbi } from './abi/complianceRegistry.js';

const DEFAULT_RETRY = { retries: 2, minTimeout: 1_000, maxTimeout: 4_000 };

export interface MintReceiptArgs {
  wallet: WalletClient;
  publicClient: PublicClient;
  account: Account;
  registryAddress: `0x${string}`;
  depositorWallet: `0x${string}`;
  policyTokenId: bigint;
  permittedTranchesMask: number;
  kycExpiresAtSec: bigint;
  sanctionsScreenExpiresAtSec: bigint;
  tokenURI: string;
  retryConfig?: { retries: number; minTimeout: number; maxTimeout: number };
}

export async function mintComplianceReceiptOnChain(args: MintReceiptArgs): Promise<`0x${string}`> {
  return pRetry(async () => {
    const hash = await args.wallet.writeContract({
      address: args.registryAddress,
      abi: complianceRegistryAbi,
      functionName: 'mintComplianceReceipt',
      args: [
        args.depositorWallet,
        args.policyTokenId,
        args.permittedTranchesMask,
        args.kycExpiresAtSec,
        args.sanctionsScreenExpiresAtSec,
        args.tokenURI,
      ],
      account: args.account,
      chain: null,
    } as any);
    const receipt = await args.publicClient.waitForTransactionReceipt({ hash, timeout: 60_000 });
    if (receipt.status !== 'success') throw new AbortError(`tx reverted: ${hash}`);
    return hash;
  }, args.retryConfig ?? DEFAULT_RETRY);
}

export interface RefreshScreenArgs {
  wallet: WalletClient;
  publicClient: PublicClient;
  account: Account;
  registryAddress: `0x${string}`;
  receiptId: bigint;
  newSanctionsScreenExpiresAtSec: bigint;
  newScreenCid: string;
  retryConfig?: { retries: number; minTimeout: number; maxTimeout: number };
}

export async function refreshSanctionsScreenOnChain(args: RefreshScreenArgs): Promise<`0x${string}`> {
  return pRetry(async () => {
    const hash = await args.wallet.writeContract({
      address: args.registryAddress,
      abi: complianceRegistryAbi,
      functionName: 'refreshSanctionsScreen',
      args: [
        args.receiptId,
        args.newSanctionsScreenExpiresAtSec,
        args.newScreenCid,
      ],
      account: args.account,
      chain: null,
    } as any);
    const receipt = await args.publicClient.waitForTransactionReceipt({ hash, timeout: 60_000 });
    if (receipt.status !== 'success') throw new AbortError(`tx reverted: ${hash}`);
    return hash;
  }, args.retryConfig ?? DEFAULT_RETRY);
}

export interface ReadActiveReceiptArgs {
  publicClient: PublicClient;
  registryAddress: `0x${string}`;
  wallet: `0x${string}`;
}

export interface ActiveReceiptResult {
  receiptId: bigint;
  mask: number;
  kycExp: bigint;
  sanctionsExp: bigint;
}

export async function readActiveReceipt(
  args: ReadActiveReceiptArgs,
): Promise<ActiveReceiptResult | null> {
  try {
    const result = await args.publicClient.readContract({
      address: args.registryAddress,
      abi: complianceRegistryAbi,
      functionName: 'activeReceipt',
      args: [args.wallet],
    } as any);
    const [receiptId, mask, kycExp, sanctionsExp] = result as [bigint, number, bigint, bigint];
    return { receiptId, mask, kycExp, sanctionsExp };
  } catch {
    return null;
  }
}

export interface ReadCanDepositArgs {
  publicClient: PublicClient;
  registryAddress: `0x${string}`;
  wallet: `0x${string}`;
  trancheId: number;
}

export async function readCanDeposit(args: ReadCanDepositArgs): Promise<boolean | null> {
  try {
    const result = await args.publicClient.readContract({
      address: args.registryAddress,
      abi: complianceRegistryAbi,
      functionName: 'canDeposit',
      args: [args.wallet, args.trancheId],
    } as any);
    return result as boolean;
  } catch {
    return null;
  }
}
