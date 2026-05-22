import type { PublicClient, Log } from 'viem';
import { parseAbiItem } from 'viem';

const allocationProposedEvent = parseAbiItem(
  'event AllocationProposed(address indexed agent, uint256 indexed proposalId, uint256 seniorBps, uint256 mezzBps, uint256 juniorBps, string reasoningHash)'
);
const ALLOC_PROPOSED_ABI = [allocationProposedEvent] as const;

type AllocProposedLog = Log<bigint, number, false, typeof allocationProposedEvent, true, typeof ALLOC_PROPOSED_ABI, 'AllocationProposed'>;

export interface AllocationProposedEvent {
  agent: `0x${string}`;
  proposalId: bigint;
  seniorBps: bigint;
  mezzBps: bigint;
  juniorBps: bigint;
  reasoningHash: string;
  blockNumber: bigint;
}

function decodeLog(log: AllocProposedLog): AllocationProposedEvent | null {
  if (log.blockNumber === null) return null;
  return {
    agent: log.args.agent!,
    proposalId: log.args.proposalId!,
    seniorBps: log.args.seniorBps!,
    mezzBps: log.args.mezzBps!,
    juniorBps: log.args.juniorBps!,
    reasoningHash: log.args.reasoningHash!,
    blockNumber: log.blockNumber
  };
}

export async function subscribeAllocationProposed(
  client: PublicClient,
  busAddress: `0x${string}`,
  fromBlock: bigint,
  onProposal: (e: AllocationProposedEvent) => Promise<void>,
  onLiveError?: (err: unknown) => void
): Promise<() => void> {
  const past = await client.getContractEvents({
    address: busAddress,
    abi: ALLOC_PROPOSED_ABI,
    eventName: 'AllocationProposed',
    fromBlock,
    toBlock: 'latest'
  });
  for (const log of past) {
    const decoded = decodeLog(log as AllocProposedLog);
    if (decoded) await onProposal(decoded);
  }
  const unsubscribe = client.watchContractEvent({
    address: busAddress,
    abi: ALLOC_PROPOSED_ABI,
    eventName: 'AllocationProposed',
    onLogs: async (logs) => {
      for (const log of logs) {
        const decoded = decodeLog(log as AllocProposedLog);
        if (!decoded) continue;
        try {
          await onProposal(decoded);
        } catch (err) {
          onLiveError?.(err);
        }
      }
    },
    onError: (err) => onLiveError?.(err)
  });
  return unsubscribe;
}
