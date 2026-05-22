import { keccak256, toBytes, recoverMessageAddress } from 'viem';
import { canonicalStringify } from '@strata/scout/signer';
import type { YieldMap } from '@strata/scout/types';

export async function verifyYieldMap(
  map: YieldMap,
  expectedSigner?: `0x${string}`
): Promise<void> {
  const unsigned = canonicalStringify({ ...map, signature: '' });
  const hash = keccak256(toBytes(unsigned));
  const recovered = await recoverMessageAddress({
    message: { raw: hash },
    signature: map.signature as `0x${string}`
  });
  if (recovered.toLowerCase() !== map.publisher.address.toLowerCase()) {
    throw new Error(`map signature does not recover to publisher.address (recovered=${recovered}, publisher=${map.publisher.address})`);
  }
  if (expectedSigner && recovered.toLowerCase() !== expectedSigner.toLowerCase()) {
    throw new Error(`map signer ${recovered} is not the expected Scout address ${expectedSigner}`);
  }
}
