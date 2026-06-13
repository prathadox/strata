import { keccak256, toBytes } from 'viem';
import type { WalletClient, PublicClient, Account } from 'viem';
import { canonicalStringify } from '@strata/scout/signer';
import { pinJsonToLighthouse } from '@strata/scout/ipfs';
import type { RiskVerdict, HedgeSignal } from '../types.js';
import { issueRiskVerdictOnChain, emitHedgeSignalOnChain } from './onchain.js';

export interface MakePublisherArgs {
  wallet: WalletClient;
  publicClient: PublicClient;
  account: Account;
  eventBus: `0x${string}`;
  pinataJwt: string;
  dryRun: boolean;
  pinOverride?: (json: string, key: string) => Promise<string>;
  issueOnChainOverride?: typeof issueRiskVerdictOnChain;
  emitHedgeOnChainOverride?: typeof emitHedgeSignalOnChain;
}

export interface PublishedVerdict { cid: string; verdict: RiskVerdict; txHash?: `0x${string}` }
export interface PublishedHedgeSignal { cid: string; signal: HedgeSignal; txHash?: `0x${string}` }

const VERDICT_LEVEL_TO_UINT8 = { green: 0, yellow: 1, red: 2 } as const;

export function makePublisher(args: MakePublisherArgs) {
  const pin = args.pinOverride ?? pinJsonToLighthouse;
  const issueOnChain = args.issueOnChainOverride ?? issueRiskVerdictOnChain;
  const emitHedgeOnChain = args.emitHedgeOnChainOverride ?? emitHedgeSignalOnChain;

  async function signArtifact(draft: Record<string, unknown>): Promise<string> {
    const unsigned = canonicalStringify({ ...draft, signature: '' });
    const hash = keccak256(toBytes(unsigned));
    return (args.account as any).signMessage({ message: { raw: hash } });
  }

  async function publishVerdict(draft: Omit<RiskVerdict, 'signature'>): Promise<PublishedVerdict> {
    const signature = await signArtifact(draft as unknown as Record<string, unknown>);
    const verdict: RiskVerdict = { ...draft, signature };
    const cid = await pin(canonicalStringify(verdict), args.pinataJwt);
    if (args.dryRun) return { cid, verdict };
    const txHash = await issueOnChain({
      wallet: args.wallet,
      publicClient: args.publicClient,
      account: args.account,
      eventBus: args.eventBus,
      proposalId: BigInt(verdict.proposalId),
      seniorVerdict: VERDICT_LEVEL_TO_UINT8[verdict.tranches.senior],
      mezzVerdict:   VERDICT_LEVEL_TO_UINT8[verdict.tranches.mezzanine],
      juniorVerdict: VERDICT_LEVEL_TO_UINT8[verdict.tranches.junior],
      reasoningHash: cid
    });
    return { cid, verdict, txHash };
  }

  async function publishHedgeSignal(draft: Omit<HedgeSignal, 'signature'>): Promise<PublishedHedgeSignal> {
    const signature = await signArtifact(draft as unknown as Record<string, unknown>);
    const signal: HedgeSignal = { ...draft, signature };
    const cid = await pin(canonicalStringify(signal), args.pinataJwt);
    if (args.dryRun) return { cid, signal };
    const txHash = await emitHedgeOnChain({
      wallet: args.wallet,
      publicClient: args.publicClient,
      account: args.account,
      eventBus: args.eventBus,
      hedgedAsset: signal.hedgedAsset as `0x${string}`,
      targetNotionalUsd: BigInt(signal.targetNotionalUsd),
      reasoningHash: cid
    });
    return { cid, signal, txHash };
  }

  return { publishVerdict, publishHedgeSignal };
}
