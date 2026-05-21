import type { PublicClient, AbiEvent } from 'viem';
import { parseAbiItem } from 'viem';

const yieldMapEvent = parseAbiItem(
  'event YieldMapPublished(address indexed agent, string ipfsHash, uint256 timestamp)'
) as AbiEvent;

const YIELD_MAP_ABI = [yieldMapEvent] as const;

export interface YieldMapEvent {
  agent: `0x${string}`;
  ipfsHash: string;
  timestamp: bigint;
  blockNumber: bigint;
}

type RawLog = {
  args: { agent?: `0x${string}`; ipfsHash?: string; timestamp?: bigint };
  blockNumber: bigint | null;
};

export async function subscribeYieldMaps(
  client: PublicClient,
  busAddress: `0x${string}`,
  fromBlock: bigint,
  onMap: (e: YieldMapEvent) => Promise<void>
): Promise<() => void> {
  const past = (await client.getContractEvents({
    address: busAddress,
    abi: YIELD_MAP_ABI,
    eventName: 'YieldMapPublished',
    fromBlock,
    toBlock: 'latest'
  })) as unknown as RawLog[];
  for (const log of past) {
    await onMap({
      agent: log.args.agent!,
      ipfsHash: log.args.ipfsHash!,
      timestamp: log.args.timestamp!,
      blockNumber: log.blockNumber!
    });
  }
  const unsubscribe = client.watchContractEvent({
    address: busAddress,
    abi: YIELD_MAP_ABI,
    eventName: 'YieldMapPublished',
    onLogs: async (logs) => {
      for (const log of logs as unknown as RawLog[]) {
        await onMap({
          agent: log.args.agent!,
          ipfsHash: log.args.ipfsHash!,
          timestamp: log.args.timestamp!,
          blockNumber: log.blockNumber!
        });
      }
    }
  });
  return unsubscribe;
}
