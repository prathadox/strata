import { keccak256, toBytes } from 'viem';
import { HEDGE_CONSTANTS, type SizingResult } from './sizeHedge.js';
import type { HedgeIntent } from '../types.js';

export interface BuildIntentArgs {
  sourceSignalCid: string;
  sourceSignalBlock: bigint;
  hedgedAsset: string;
  sizing: Extract<SizingResult, { kind: 'sized' }>;
  spotPriceUsd: number;
  spotPriceTimestampMs: number;
  publisherAddress: string;
  identityNFT: string;
  methodologyHash: string;
  codeCommit: string;
  now?: () => number;
}

export function buildIntent(args: BuildIntentArgs): Omit<HedgeIntent, 'signature'> {
  const now = args.now ?? (() => Date.now());
  const publishedAtMs = now();
  const seed = `${args.sourceSignalCid}|${args.sourceSignalBlock.toString()}`;
  const intentId = BigInt(keccak256(toBytes(seed))).toString();
  return {
    version: '1.0',
    intentId,
    sourceSignalCid: args.sourceSignalCid,
    sourceSignalBlock: args.sourceSignalBlock.toString(),
    hedgedAsset: args.hedgedAsset,
    direction: args.sizing.direction,
    notionalUsd: args.sizing.notionalUsd.toString(),
    contractSize: args.sizing.contractSize,
    spotPriceUsd: args.spotPriceUsd.toString(),
    spotPriceSource: 'coingecko',
    spotPriceTimestampMs: args.spotPriceTimestampMs,
    slippageToleranceBps: HEDGE_CONSTANTS.slippageToleranceBps,
    publisher: { address: args.publisherAddress, identityNFT: args.identityNFT },
    methodologyHash: args.methodologyHash,
    codeCommit: args.codeCommit,
    publishedAtMs
  };
}
