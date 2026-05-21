import { signYieldMap } from '@strata/scout/signer';
import { pinYieldMap } from '@strata/scout/ipfs';
import { proposeAllocationOnChain } from './onchain.js';
import type { WalletClient, PublicClient, Account } from 'viem';
import type { AllocationProposal } from '../types.js';

export interface Publisher {
  publishProposal(unsigned: Omit<AllocationProposal, 'signature'>): Promise<{
    proposal: AllocationProposal;
    cid: string;
    txHash: `0x${string}` | null;
  }>;
}

export interface PublisherDeps {
  wallet: WalletClient;
  publicClient: PublicClient;
  account: Account;
  lighthouseApiKey: string;
  eventBus: `0x${string}`;
  dryRun: boolean;
}

export function makePublisher(deps: PublisherDeps): Publisher {
  return {
    async publishProposal(unsigned) {
      const signed = await signYieldMap(unsigned, deps.wallet, deps.account);
      const proposal = { ...unsigned, signature: signed.signature } as AllocationProposal;
      const pinned = await pinYieldMap(proposal, { lighthouseApiKey: deps.lighthouseApiKey });

      if (deps.dryRun) {
        return { proposal, cid: pinned.cid, txHash: null };
      }
      const txHash = await proposeAllocationOnChain({
        wallet: deps.wallet,
        publicClient: deps.publicClient,
        account: deps.account,
        eventBus: deps.eventBus,
        proposalId: BigInt(proposal.proposalId),
        seniorBps: BigInt(proposal.tranches.senior.bps),
        mezzBps: BigInt(proposal.tranches.mezzanine.bps),
        juniorBps: BigInt(proposal.tranches.junior.bps),
        reasoningHash: pinned.cid
      });
      return { proposal, cid: pinned.cid, txHash };
    }
  };
}
