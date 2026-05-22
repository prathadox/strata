import type { PublicClient, Log } from 'viem';
import { parseAbiItem } from 'viem';

const hedgeSignalEvent = parseAbiItem(
  'event HedgeSignalEmitted(address indexed agent, address indexed hedgedAsset, int256 targetNotionalUsd, string reasoningHash)'
);
const HEDGE_SIGNAL_ABI = [hedgeSignalEvent] as const;

type HedgeSignalLog = Log<bigint, number, false, typeof hedgeSignalEvent, true, typeof HEDGE_SIGNAL_ABI, 'HedgeSignalEmitted'>;

export interface HedgeSignalEvent {
  agent: `0x${string}`;
  hedgedAsset: `0x${string}`;
  targetNotionalUsd: bigint;
  reasoningHash: string;
  blockNumber: bigint;
}

function decodeLog(log: HedgeSignalLog): HedgeSignalEvent | null {
  if (log.blockNumber === null) return null;
  return {
    agent: log.args.agent!,
    hedgedAsset: log.args.hedgedAsset!,
    targetNotionalUsd: log.args.targetNotionalUsd!,
    reasoningHash: log.args.reasoningHash!,
    blockNumber: log.blockNumber
  };
}

export async function subscribeHedgeSignals(
  client: PublicClient,
  busAddress: `0x${string}`,
  fromBlock: bigint,
  onSignal: (e: HedgeSignalEvent) => Promise<void>,
  onLiveError?: (err: unknown) => void
): Promise<() => void> {
  const past = await client.getContractEvents({
    address: busAddress,
    abi: HEDGE_SIGNAL_ABI,
    eventName: 'HedgeSignalEmitted',
    fromBlock,
    toBlock: 'latest'
  });
  for (const log of past) {
    const decoded = decodeLog(log as HedgeSignalLog);
    if (decoded) await onSignal(decoded);
  }
  const unsubscribe = client.watchContractEvent({
    address: busAddress,
    abi: HEDGE_SIGNAL_ABI,
    eventName: 'HedgeSignalEmitted',
    onLogs: async (logs) => {
      for (const log of logs) {
        const decoded = decodeLog(log as HedgeSignalLog);
        if (!decoded) continue;
        try {
          await onSignal(decoded);
        } catch (err) {
          onLiveError?.(err);
        }
      }
    },
    onError: (err) => onLiveError?.(err)
  });
  return unsubscribe;
}
