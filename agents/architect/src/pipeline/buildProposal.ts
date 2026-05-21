import { keccak256, toBytes } from 'viem';
import type { YieldMap } from '@strata/scout/types';
import { allocate } from './allocate.js';
import type { NetExposureLedger } from './netExposure.js';
import { AllocationProposalDraftSchema, type AllocationProposal } from '../types.js';

export interface BuildProposalArgs {
  map: YieldMap;
  sourceMapCid: string;
  publisherAddress: `0x${string}`;
  identityNFT: string;
  methodologyHash: string;
  codeCommit: string;
  ledger: NetExposureLedger;
  now?: () => number;
}

export function buildProposal(args: BuildProposalArgs): Omit<AllocationProposal, 'signature'> {
  const tranches = allocate(args.map);
  const seed = `${args.sourceMapCid}|${args.map.publishedAtMs}`;
  const proposalIdHex = keccak256(toBytes(seed));
  const proposalId = BigInt(proposalIdHex).toString();

  const draft = {
    version: '1.0' as const,
    proposalId,
    sourceMapCid: args.sourceMapCid,
    publishedAtMs: (args.now ?? Date.now)(),
    publisher: { address: args.publisherAddress, identityNFT: args.identityNFT },
    methodologyHash: args.methodologyHash,
    codeCommit: args.codeCommit,
    tranches,
    netExposureAtProposalMs: args.ledger.snapshot()
  };

  const parsed = AllocationProposalDraftSchema.safeParse(draft);
  if (!parsed.success) throw new Error(`buildProposal: invalid shape: ${parsed.error.message}`);
  return draft;
}
