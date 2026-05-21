import type { PublicClient, Log } from 'viem';
import { parseAbiItem } from 'viem';

const hedgeLogEvent = parseAbiItem(
  'event HedgeLogged(address indexed agent, address indexed hedgedAsset, int256 netPosition, string executionProof)'
);
const HEDGE_LOG_ABI = [hedgeLogEvent] as const;

type HedgeLogLog = Log<bigint, number, false, typeof hedgeLogEvent, true, typeof HEDGE_LOG_ABI, 'HedgeLogged'>;

export interface HedgeLogEvent {
  agent: `0x${string}`;
  hedgedAsset: `0x${string}`;
  netPosition: bigint;
  executionProof: string;
  blockNumber: bigint;
}

function decodeLog(log: HedgeLogLog): HedgeLogEvent | null {
  if (log.blockNumber === null) return null;
  return {
    agent: log.args.agent!,
    hedgedAsset: log.args.hedgedAsset!,
    netPosition: log.args.netPosition!,
    executionProof: log.args.executionProof!,
    blockNumber: log.blockNumber
  };
}

export async function subscribeHedgeLogs(
  client: PublicClient,
  busAddress: `0x${string}`,
  fromBlock: bigint,
  onHedge: (e: HedgeLogEvent) => Promise<void>,
  onLiveError?: (err: unknown) => void
): Promise<() => void> {
  const past = await client.getContractEvents({
    address: busAddress,
    abi: HEDGE_LOG_ABI,
    eventName: 'HedgeLogged',
    fromBlock,
    toBlock: 'latest'
  });
  for (const log of past) {
    const decoded = decodeLog(log as HedgeLogLog);
    if (decoded) await onHedge(decoded);
  }
  // viem's `watchContractEvent` discards the value `onLogs` returns. Catching
  // errors *inside* this callback (rather than letting them reject the returned
  // promise) is what makes live failures observable. The `onLiveError` hook is
  // also wired to viem's `onError` for transport-level failures.
  const unsubscribe = client.watchContractEvent({
    address: busAddress,
    abi: HEDGE_LOG_ABI,
    eventName: 'HedgeLogged',
    onLogs: async (logs) => {
      for (const log of logs) {
        const decoded = decodeLog(log as HedgeLogLog);
        if (!decoded) continue;
        try {
          await onHedge(decoded);
        } catch (err) {
          onLiveError?.(err);
        }
      }
    },
    onError: (err) => onLiveError?.(err)
  });
  return unsubscribe;
}
