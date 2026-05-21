import type { PublicClient, Log } from 'viem';
import { parseAbiItem } from 'viem';

const yieldMapEvent = parseAbiItem(
  'event YieldMapPublished(address indexed agent, string ipfsHash, uint256 timestamp)'
);
const YIELD_MAP_ABI = [yieldMapEvent] as const;

type YieldMapLog = Log<bigint, number, false, typeof yieldMapEvent, true, typeof YIELD_MAP_ABI, 'YieldMapPublished'>;

export interface YieldMapEvent {
  agent: `0x${string}`;
  ipfsHash: string;
  timestamp: bigint;
  blockNumber: bigint;
}

function decodeLog(log: YieldMapLog): YieldMapEvent | null {
  if (log.blockNumber === null) return null;
  return {
    agent: log.args.agent!,
    ipfsHash: log.args.ipfsHash!,
    timestamp: log.args.timestamp!,
    blockNumber: log.blockNumber
  };
}

export async function subscribeYieldMaps(
  client: PublicClient,
  busAddress: `0x${string}`,
  fromBlock: bigint,
  onMap: (e: YieldMapEvent) => Promise<void>,
  onLiveError?: (err: unknown) => void
): Promise<() => void> {
  const past = await client.getContractEvents({
    address: busAddress,
    abi: YIELD_MAP_ABI,
    eventName: 'YieldMapPublished',
    fromBlock,
    toBlock: 'latest'
  });
  for (const log of past) {
    const decoded = decodeLog(log as YieldMapLog);
    if (decoded) await onMap(decoded);
  }
  // viem's `watchContractEvent` discards the value `onLogs` returns. Catching
  // errors *inside* this callback (rather than letting them reject the returned
  // promise) is what makes live failures observable. The `onLiveError` hook is
  // also wired to viem's `onError` for transport-level failures.
  const unsubscribe = client.watchContractEvent({
    address: busAddress,
    abi: YIELD_MAP_ABI,
    eventName: 'YieldMapPublished',
    onLogs: async (logs) => {
      for (const log of logs) {
        const decoded = decodeLog(log as YieldMapLog);
        if (!decoded) continue;
        try {
          await onMap(decoded);
        } catch (err) {
          onLiveError?.(err);
        }
      }
    },
    onError: (err) => onLiveError?.(err)
  });
  return unsubscribe;
}
