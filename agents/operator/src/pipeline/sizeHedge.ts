export const HEDGE_CONSTANTS = Object.freeze({
  overshootBps: 0,
  minNotionalUsd: 10_000,
  maxNotionalUsd: 5_000_000,
  slippageToleranceBps: 50
});

export interface SizeHedgeInput {
  targetNotionalUsd: bigint;
  hedgedAsset: `0x${string}`;
}

export type SizingResult =
  | { kind: 'sized'; notionalUsd: bigint; contractSize: string; direction: 'long' | 'short' }
  | { kind: 'skip'; reason: 'below-floor' };

function absBigInt(x: bigint): bigint { return x < 0n ? -x : x; }

function formatContractSize(notionalAbsUsd: bigint, spotUsd: number): string {
  const num = Number(notionalAbsUsd) / spotUsd;
  if (!Number.isFinite(num)) return '0';
  return num.toString();
}

export function sizeHedge(input: SizeHedgeInput, spotPriceUsd: number): SizingResult {
  const target = input.targetNotionalUsd;
  const absTarget = absBigInt(target);
  if (absTarget < BigInt(HEDGE_CONSTANTS.minNotionalUsd)) {
    return { kind: 'skip', reason: 'below-floor' };
  }
  const maxBig = BigInt(HEDGE_CONSTANTS.maxNotionalUsd);
  const sign = target >= 0n ? 1n : -1n;
  const clampedAbs = absTarget > maxBig ? maxBig : absTarget;
  const notionalUsd = sign * clampedAbs;
  const direction: 'long' | 'short' = sign === 1n ? 'short' : 'long';
  const contractSize = formatContractSize(clampedAbs, spotPriceUsd);
  return { kind: 'sized', notionalUsd, contractSize, direction };
}
