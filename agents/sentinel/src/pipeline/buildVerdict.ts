import { keccak256, toBytes } from 'viem';
import type { RiskEvaluation } from './riskPolicy.js';
import type { RiskVerdict } from '../types.js';

export interface BuildVerdictArgs {
  evaluation: RiskEvaluation;
  proposalId: string;
  sourceMapCid: string;
  sourceProposalCid: string;
  publisherAddress: string;
  identityNFT: string;
  methodologyHash: string;
  codeCommit: string;
  now?: () => number;
}

export function buildVerdict(args: BuildVerdictArgs): Omit<RiskVerdict, 'signature'> {
  const now = args.now ?? (() => Date.now());
  const publishedAtMs = now();
  const seed = `${args.sourceProposalCid}|${publishedAtMs}`;
  const verdictId = BigInt(keccak256(toBytes(seed))).toString();
  return {
    version: '1.0',
    verdictId,
    proposalId: args.proposalId,
    sourceMapCid: args.sourceMapCid,
    sourceProposalCid: args.sourceProposalCid,
    publishedAtMs,
    publisher: { address: args.publisherAddress, identityNFT: args.identityNFT },
    methodologyHash: args.methodologyHash,
    codeCommit: args.codeCommit,
    tranches: args.evaluation.tranches,
    perPositionVerdicts: args.evaluation.perPositionVerdicts,
    reasons: args.evaluation.reasons
  };
}
