// LEGACY: not imported by the Railway entrypoint (src/demo.ts). Kept for future "production" daemon path.
import type { WalletClient, PublicClient, Account } from 'viem';
import pRetry from 'p-retry';
import { agentEventBusAbi } from './abi/agentEventBus.js';

export interface PublishOnChainArgs {
  wallet: WalletClient;
  publicClient: PublicClient;
  account: Account;
  eventBus: `0x${string}`;
  ipfsHash: string;
}

export async function publishOnChain(args: PublishOnChainArgs): Promise<`0x${string}`> {
  return pRetry(async () => {
    const hash = await args.wallet.writeContract({
      address: args.eventBus,
      abi: agentEventBusAbi,
      functionName: 'publishYieldMap',
      args: [args.ipfsHash],
      account: args.account,
      chain: null
    } as any);
    const receipt = await args.publicClient.waitForTransactionReceipt({ hash, timeout: 60_000 });
    if (receipt.status !== 'success') throw new Error(`tx reverted: ${hash}`);
    return hash;
  }, { retries: 2, minTimeout: 1_000, maxTimeout: 4_000 });
}
