import type { WalletClient, PublicClient, Account } from 'viem';
import pRetry, { AbortError } from 'p-retry';
import { agentEventBusAbi } from './abi/agentEventBus.js';

export interface ProposeAllocationOnChainArgs {
  wallet: WalletClient;
  publicClient: PublicClient;
  account: Account;
  eventBus: `0x${string}`;
  proposalId: bigint;
  seniorBps: bigint;
  mezzBps: bigint;
  juniorBps: bigint;
  reasoningHash: string;
  retryConfig?: { retries: number; minTimeout: number; maxTimeout: number };
}

const DEFAULT_RETRY = { retries: 2, minTimeout: 1_000, maxTimeout: 4_000 };

export async function proposeAllocationOnChain(args: ProposeAllocationOnChainArgs): Promise<`0x${string}`> {
  return pRetry(async () => {
    const hash = await args.wallet.writeContract({
      address: args.eventBus,
      abi: agentEventBusAbi,
      functionName: 'proposeAllocation',
      args: [args.proposalId, args.seniorBps, args.mezzBps, args.juniorBps, args.reasoningHash],
      account: args.account,
      chain: null
    } as any);
    const receipt = await args.publicClient.waitForTransactionReceipt({ hash, timeout: 60_000 });
    // A definitive on-chain revert (bad role, bad bps, duplicate proposalId) is
    // not retriable: re-submitting wastes gas and risks duplicate events. Abort
    // pRetry immediately so the rejection bubbles up after one attempt.
    if (receipt.status !== 'success') throw new AbortError(`tx reverted: ${hash}`);
    return hash;
  }, args.retryConfig ?? DEFAULT_RETRY);
}
