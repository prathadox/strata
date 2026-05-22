import type { YieldMap } from '@strata/scout/types';
import type { AllocationProposal } from '../ipfs/fetch.js';
import { evaluateRisk, type RiskEvaluation } from './riskPolicy.js';
import { buildVerdict } from './buildVerdict.js';
import type { HedgeSignal, RiskVerdict } from '../types.js';
import { keccak256, toBytes } from 'viem';

export type RunResult =
  | { status: 'published'; cid: string; verdict: RiskVerdict; hedgeSignalCids: string[] }
  | { status: 'skipped'; reason: 'duplicate' | 'verification-failed' | 'zero-state' };

export interface OrchestratorDeps {
  fetchProposal: (cid: string) => Promise<AllocationProposal | null>;
  fetchMap: (cid: string) => Promise<YieldMap | null>;
  verifyProposal: (p: AllocationProposal) => Promise<void>;
  verifyMap: (m: YieldMap) => Promise<void>;
  snapshotExposure: () => Record<string, bigint>;
  methodologyHash: string;
  codeCommit: string;
  publisher: {
    publishVerdict: (draft: Omit<RiskVerdict, 'signature'>) => Promise<{ cid: string; verdict: RiskVerdict }>;
    publishHedgeSignal: (draft: Omit<HedgeSignal, 'signature'>) => Promise<{ cid: string; signal: HedgeSignal }>;
  };
  publisherAddress: string;
  identityNFT: string;
  totalDepositsBaselineUsd: number;
  now?: () => number;
}

export class Orchestrator {
  private lastProcessedCid: string | null = null;
  constructor(private deps: OrchestratorDeps) {}

  async runVerdictCycle(proposalCid: string): Promise<RunResult> {
    if (proposalCid === this.lastProcessedCid) {
      return { status: 'skipped', reason: 'duplicate' };
    }
    const now = this.deps.now ?? (() => Date.now());

    let proposal: AllocationProposal | null;
    try {
      proposal = await this.deps.fetchProposal(proposalCid);
      if (!proposal) return { status: 'skipped', reason: 'verification-failed' };
      await this.deps.verifyProposal(proposal);
    } catch {
      return { status: 'skipped', reason: 'verification-failed' };
    }

    let map: YieldMap | null;
    try {
      map = await this.deps.fetchMap(proposal.sourceMapCid);
      if (!map) return { status: 'skipped', reason: 'verification-failed' };
      await this.deps.verifyMap(map);
    } catch {
      return { status: 'skipped', reason: 'verification-failed' };
    }

    const totalBps = proposal.tranches.senior.bps + proposal.tranches.mezzanine.bps + proposal.tranches.junior.bps;
    if (totalBps === 0) return { status: 'skipped', reason: 'zero-state' };

    const netExposure = this.deps.snapshotExposure();
    const evaluation: RiskEvaluation = evaluateRisk({
      proposal, map, netExposure, totalDepositsBaselineUsd: this.deps.totalDepositsBaselineUsd
    });

    const verdictDraft = buildVerdict({
      evaluation,
      proposalId: proposal.proposalId,
      sourceMapCid: proposal.sourceMapCid,
      sourceProposalCid: proposalCid,
      publisherAddress: this.deps.publisherAddress,
      identityNFT: this.deps.identityNFT,
      methodologyHash: this.deps.methodologyHash,
      codeCommit: this.deps.codeCommit,
      now
    });

    const published = await this.deps.publisher.publishVerdict(verdictDraft);

    const hedgeSignalCids: string[] = [];
    for (const pending of evaluation.hedgeSignals) {
      const publishedAtMs = now();
      const signalSeed = `${published.cid}|${pending.hedgedAsset.toLowerCase()}|${publishedAtMs}`;
      const signalId = BigInt(keccak256(toBytes(signalSeed))).toString();
      const signalDraft: Omit<HedgeSignal, 'signature'> = {
        version: '1.0',
        signalId,
        sourceVerdictCid: published.cid,
        sourceProposalId: proposal.proposalId,
        hedgedAsset: pending.hedgedAsset,
        targetNotionalUsd: pending.targetNotionalUsd.toString(),
        direction: pending.direction,
        publisher: { address: this.deps.publisherAddress, identityNFT: this.deps.identityNFT },
        methodologyHash: this.deps.methodologyHash,
        codeCommit: this.deps.codeCommit,
        publishedAtMs
      };
      const pubSig = await this.deps.publisher.publishHedgeSignal(signalDraft);
      hedgeSignalCids.push(pubSig.cid);
    }

    this.lastProcessedCid = proposalCid;
    return { status: 'published', cid: published.cid, verdict: published.verdict, hedgeSignalCids };
  }
}
