import { keccak256, toBytes } from 'viem';
import type { SanctionsScreenResult } from '../types.js';
import type { SanctionsOracle } from './sanctions.js';

export const STUB_DENIED_ADDRESSES: readonly `0x${string}`[] = [
  '0x000000000000000000000000000000000000dEaD',
  '0x1111111111111111111111111111111111111111'
];

const deniedSet = new Set(STUB_DENIED_ADDRESSES.map(a => a.toLowerCase()));

export function createStubSanctionsOracle(
  opts?: { now?: () => number }
): SanctionsOracle {
  const nowFn = opts?.now ?? (() => Math.floor(Date.now() / 1000));

  return {
    provider: 'stub',

    async screen(wallet) {
      const isDenied = deniedSet.has(wallet.toLowerCase());
      const clear = !isDenied;
      const screenedAtSec = nowFn();
      const preimage = `${wallet.toLowerCase()}${clear ? '1' : '0'}${screenedAtSec}`;
      const resultHash = keccak256(toBytes(preimage));

      return {
        wallet,
        clear,
        screenedAtSec,
        resultHash,
        provider: 'stub'
      } satisfies SanctionsScreenResult;
    }
  };
}
