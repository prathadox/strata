import { keccak256, toBytes, recoverMessageAddress } from 'viem';
import { canonicalStringify } from '@strata/scout/signer';
import type { HedgeSignal } from '../ipfs/fetch.js';

export async function verifyHedgeSignal(
  signal: HedgeSignal,
  expectedSigner?: `0x${string}`
): Promise<void> {
  const unsigned = canonicalStringify({ ...signal, signature: '' });
  const hash = keccak256(toBytes(unsigned));
  const recovered = await recoverMessageAddress({
    message: { raw: hash },
    signature: signal.signature as `0x${string}`
  });
  if (recovered.toLowerCase() !== signal.publisher.address.toLowerCase()) {
    throw new Error(`hedge-signal signature does not recover to publisher.address (recovered=${recovered}, publisher=${signal.publisher.address})`);
  }
  if (expectedSigner && recovered.toLowerCase() !== expectedSigner.toLowerCase()) {
    throw new Error(`hedge-signal signer ${recovered} is not the expected Sentinel address ${expectedSigner}`);
  }
}
