import { keccak256, toBytes, recoverMessageAddress } from 'viem';
import { canonicalStringify } from '@strata/scout/signer';
import type { AllocationProposal } from '../ipfs/fetch.js';

export async function verifyAllocationProposal(
  proposal: AllocationProposal,
  expectedSigner?: `0x${string}`
): Promise<void> {
  const unsigned = canonicalStringify({ ...proposal, signature: '' });
  const hash = keccak256(toBytes(unsigned));
  const recovered = await recoverMessageAddress({
    message: { raw: hash },
    signature: proposal.signature as `0x${string}`
  });
  if (recovered.toLowerCase() !== proposal.publisher.address.toLowerCase()) {
    throw new Error(`proposal signature does not recover to publisher.address (recovered=${recovered}, publisher=${proposal.publisher.address})`);
  }
  if (expectedSigner && recovered.toLowerCase() !== expectedSigner.toLowerCase()) {
    throw new Error(`proposal signer ${recovered} is not the expected Architect address ${expectedSigner}`);
  }
}
