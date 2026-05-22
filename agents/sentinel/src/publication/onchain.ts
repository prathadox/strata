import type { WalletClient, PublicClient, Account } from 'viem';
import pRetry, { AbortError } from 'p-retry';
import { agentEventBusAbi } from './abi/agentEventBus.js';

const DEFAULT_RETRY = { retries: 2, minTimeout: 1_000, maxTimeout: 4_000 };

export interface IssueRiskVerdictArgs {
  wallet: WalletClient;
  publicClient: PublicClient;
  account: Account;
  eventBus: `0x${string}`;
  proposalId: bigint;
  seniorVerdict: number;
  mezzVerdict: number;
  juniorVerdict: number;
  reasoningHash: string;
  retryConfig?: { retries: number; minTimeout: number; maxTimeout: number };
}

export async function issueRiskVerdictOnChain(args: IssueRiskVerdictArgs): Promise<`0x${string}`> {
  return pRetry(async () => {
    const hash = await args.wallet.writeContract({
      address: args.eventBus,
      abi: agentEventBusAbi,
      functionName: 'issueRiskVerdict',
      args: [args.proposalId, args.seniorVerdict, args.mezzVerdict, args.juniorVerdict, args.reasoningHash],
      account: args.account,
      chain: null
    } as any);
    const receipt = await args.publicClient.waitForTransactionReceipt({ hash, timeout: 60_000 });
    if (receipt.status !== 'success') throw new AbortError(`tx reverted: ${hash}`);
    return hash;
  }, args.retryConfig ?? DEFAULT_RETRY);
}

export interface EmitHedgeSignalArgs {
  wallet: WalletClient;
  publicClient: PublicClient;
  account: Account;
  eventBus: `0x${string}`;
  hedgedAsset: `0x${string}`;
  targetNotionalUsd: bigint;
  reasoningHash: string;
  retryConfig?: { retries: number; minTimeout: number; maxTimeout: number };
}

export async function emitHedgeSignalOnChain(args: EmitHedgeSignalArgs): Promise<`0x${string}`> {
  return pRetry(async () => {
    const hash = await args.wallet.writeContract({
      address: args.eventBus,
      abi: agentEventBusAbi,
      functionName: 'emitHedgeSignal',
      args: [args.hedgedAsset, args.targetNotionalUsd, args.reasoningHash],
      account: args.account,
      chain: null
    } as any);
    const receipt = await args.publicClient.waitForTransactionReceipt({ hash, timeout: 60_000 });
    if (receipt.status !== 'success') throw new AbortError(`tx reverted: ${hash}`);
    return hash;
  }, args.retryConfig ?? DEFAULT_RETRY);
}
