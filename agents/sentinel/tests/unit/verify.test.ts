import { describe, it, expect } from 'vitest';
import { privateKeyToAccount, generatePrivateKey } from 'viem/accounts';
import { keccak256, toBytes } from 'viem';
import { canonicalStringify } from '@strata/scout/signer';
import { verifyAllocationProposal } from '../../src/verify/proposal.js';
import type { AllocationProposal } from '../../src/ipfs/fetch.js';

async function sign(p: Omit<AllocationProposal, 'signature'>, key: `0x${string}`): Promise<string> {
  const acct = privateKeyToAccount(key);
  const unsigned = canonicalStringify({ ...p, signature: '' });
  const hash = keccak256(toBytes(unsigned));
  return acct.signMessage({ message: { raw: hash } });
}

describe('verifyAllocationProposal', () => {
  it('verifies a well-signed proposal', async () => {
    const key = generatePrivateKey();
    const acct = privateKeyToAccount(key);
    const draft = {
      version: '1.0' as const,
      proposalId: '1',
      sourceMapCid: 'bafyMap',
      publishedAtMs: 1_700_000_000_000,
      publisher: { address: acct.address, identityNFT: 'ipfs://x' },
      methodologyHash: '0x' + '1'.repeat(64),
      codeCommit: 'deadbeef',
      tranches: {
        senior:    { bps: 10000, positions: { 'opp-1': 10000 } },
        mezzanine: { bps: 0, positions: {} },
        junior:    { bps: 0, positions: {} }
      },
      netExposureAtProposalMs: {},
      narrative: null
    };
    const signature = await sign(draft, key);
    await expect(verifyAllocationProposal({ ...draft, signature })).resolves.toBeUndefined();
  });

  it('rejects when the signer differs from publisher.address', async () => {
    const key = generatePrivateKey();
    const draft = {
      version: '1.0' as const,
      proposalId: '1',
      sourceMapCid: 'bafyMap',
      publishedAtMs: 1_700_000_000_000,
      publisher: { address: '0x' + 'b'.repeat(40), identityNFT: 'ipfs://x' },
      methodologyHash: '0x' + '1'.repeat(64),
      codeCommit: 'deadbeef',
      tranches: {
        senior:    { bps: 10000, positions: { 'opp-1': 10000 } },
        mezzanine: { bps: 0, positions: {} },
        junior:    { bps: 0, positions: {} }
      },
      netExposureAtProposalMs: {},
      narrative: null
    };
    const signature = await sign(draft, key);
    await expect(verifyAllocationProposal({ ...draft, signature })).rejects.toThrow(/does not recover/);
  });
});
