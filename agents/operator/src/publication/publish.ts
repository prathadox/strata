import { keccak256, toBytes } from 'viem';
import type { WalletClient, PublicClient, Account } from 'viem';
import { canonicalStringify } from '@strata/scout/signer';
import { pinJsonToLighthouse } from '@strata/scout/ipfs';
import type { HedgeIntent } from '../types.js';
import { logHedgeOnChain } from './onchain.js';

export interface MakePublisherArgs {
  wallet: WalletClient;
  publicClient: PublicClient;
  account: Account;
  eventBus: `0x${string}`;
  pinataJwt: string;
  dryRun: boolean;
  pinOverride?: (json: string, key: string) => Promise<string>;
  onChainOverride?: typeof logHedgeOnChain;
}

export interface PublishedIntent { cid: string; intent: HedgeIntent; txHash?: `0x${string}` }

function notionalToUsdcUnits(notionalUsdDecimal: string): bigint {
  // 6-decimal USDC. Round-half-away-from-zero, deterministic.
  const num = Number(notionalUsdDecimal);
  const scaled = Math.round(num * 1_000_000);
  return BigInt(scaled);
}

export function makePublisher(args: MakePublisherArgs) {
  const pin = args.pinOverride ?? pinJsonToLighthouse;
  const onChain = args.onChainOverride ?? logHedgeOnChain;

  async function publishIntent(draft: Omit<HedgeIntent, 'signature'>): Promise<PublishedIntent> {
    const unsigned = canonicalStringify({ ...draft, signature: '' });
    const hash = keccak256(toBytes(unsigned));
    const signature = await (args.account as any).signMessage({ message: { raw: hash } });
    const intent: HedgeIntent = { ...draft, signature };
    const cid = await pin(canonicalStringify(intent), args.pinataJwt);
    if (args.dryRun) return { cid, intent };
    const netPosition = notionalToUsdcUnits(intent.notionalUsd);
    const txHash = await onChain({
      wallet: args.wallet,
      publicClient: args.publicClient,
      account: args.account,
      eventBus: args.eventBus,
      hedgedAsset: intent.hedgedAsset as `0x${string}`,
      netPosition,
      executionProof: cid
    });
    return { cid, intent, txHash };
  }
  return { publishIntent };
}
