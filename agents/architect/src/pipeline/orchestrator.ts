import type { Publisher } from '../publication/publish.js';
import type { NetExposureLedger } from './netExposure.js';
import { fetchYieldMapByCid } from '../ipfs/fetch.js';
import { verifyYieldMap } from '../verify/yieldMap.js';
import { buildProposal } from './buildProposal.js';

export type RunResult =
  | { status: 'published'; cid: string; proposalId: string; txHash: `0x${string}` | null }
  | { status: 'skipped'; reason: 'duplicate' | 'zero-state' | 'verification-failed' };

export interface OrchestratorDeps {
  publisher: Publisher;
  ledger: NetExposureLedger;
  publisherAddress: `0x${string}`;
  identityNFT: string;
  methodologyHash: string;
  codeCommit: string;
  expectedScoutSigner?: `0x${string}`;
  now?: () => number;
}

export class Orchestrator {
  private lastProcessedCid: string | null = null;

  constructor(private deps: OrchestratorDeps) {}

  async runProposalCycle(cid: string): Promise<RunResult> {
    // Step 1: dedup check.
    if (cid === this.lastProcessedCid) {
      return { status: 'skipped', reason: 'duplicate' };
    }

    // Step 2: fetch - propagate error if all gateways fail (no silent skip).
    const map = await fetchYieldMapByCid(cid);

    // Step 3: verify - silent skip on bad signature (documented skip rule).
    try {
      await verifyYieldMap(map, this.deps.expectedScoutSigner);
    } catch {
      return { status: 'skipped', reason: 'verification-failed' };
    }

    // Step 4: build proposal.
    const unsigned = buildProposal({
      map,
      sourceMapCid: cid,
      publisherAddress: this.deps.publisherAddress,
      identityNFT: this.deps.identityNFT,
      methodologyHash: this.deps.methodologyHash,
      codeCommit: this.deps.codeCommit,
      ledger: this.deps.ledger,
      ...(this.deps.now ? { now: this.deps.now } : {})
    });

    // Step 5: zero-state guard - don't emit a proposal against an empty map.
    const totalBps =
      unsigned.tranches.senior.bps +
      unsigned.tranches.mezzanine.bps +
      unsigned.tranches.junior.bps;
    if (totalBps === 0) {
      return { status: 'skipped', reason: 'zero-state' };
    }

    // Step 6: publish - propagate error (no silent skip on real errors).
    const result = await this.deps.publisher.publishProposal(unsigned);

    // Step 7: update lastProcessedCid AFTER successful publish.
    this.lastProcessedCid = cid;

    // Step 8: return published result.
    return {
      status: 'published',
      cid: result.cid,
      proposalId: unsigned.proposalId,
      txHash: result.txHash
    };
  }
}
