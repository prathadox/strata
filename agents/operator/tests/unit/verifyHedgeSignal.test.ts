import { describe, it, expect } from 'vitest';
import { privateKeyToAccount, generatePrivateKey } from 'viem/accounts';
import { keccak256, toBytes } from 'viem';
import { canonicalStringify } from '@strata/scout/signer';
import { verifyHedgeSignal } from '../../src/verify/hedgeSignal.js';

describe('verifyHedgeSignal', () => {
  it('passes when the signature recovers to publisher.address', async () => {
    const key = generatePrivateKey();
    const acct = privateKeyToAccount(key);
    const draft = {
      version: '1.0' as const, signalId: '1', sourceVerdictCid: 'v',
      sourceProposalId: '1', hedgedAsset: '0x' + 'a'.repeat(40),
      targetNotionalUsd: '1000000', direction: 'short' as const,
      publisher: { address: acct.address, identityNFT: 'ipfs://x' },
      methodologyHash: '0x' + '1'.repeat(64), codeCommit: 'c',
      publishedAtMs: 0
    };
    const unsigned = canonicalStringify({ ...draft, signature: '' });
    const signature = await acct.signMessage({ message: { raw: keccak256(toBytes(unsigned)) } });
    await expect(verifyHedgeSignal({ ...draft, signature } as any)).resolves.toBeUndefined();
  });
});
