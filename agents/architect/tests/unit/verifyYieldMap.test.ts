import { describe, it, expect } from 'vitest';
import { privateKeyToAccount, generatePrivateKey } from 'viem/accounts';
import { keccak256, toBytes } from 'viem';
import { canonicalStringify } from '@strata/scout/signer';
import { verifyYieldMap } from '../../src/verify/yieldMap.js';

// Minimal unsigned YieldMap fixture (no signature yet).
const BASE_MAP = {
  version: '1.0' as const,
  publishedAtMs: 1_700_000_000_000,
  publisher: {
    address: '0x0000000000000000000000000000000000000000' as `0x${string}`,
    identityNFT: 'ipfs://QmTest'
  },
  methodologyHash: 'sha256:abc123',
  codeCommit: 'a1b2c3d4e5f6',
  sourcesQueried: ['aave' as const],
  sourcesDegraded: [] as string[],
  opportunities: [],
  perTranche: {
    senior: [],
    mezzanine: [],
    junior: []
  },
  signature: ''
};

async function signMapWith(privateKey: `0x${string}`, unsignedMap: typeof BASE_MAP) {
  const account = privateKeyToAccount(privateKey);
  // Set the publisher address first, then sign - so the signature covers the correct address.
  const withAddress = { ...unsignedMap, publisher: { ...unsignedMap.publisher, address: account.address }, signature: '' };
  const canonical = canonicalStringify(withAddress);
  const mapHash = keccak256(toBytes(canonical));
  const signature = await account.signMessage({ message: { raw: mapHash } });
  return { ...withAddress, signature };
}

describe('verifyYieldMap', () => {
  it('resolves without throwing for a valid signed map', async () => {
    const pk = generatePrivateKey();
    const signed = await signMapWith(pk, BASE_MAP);
    await expect(verifyYieldMap(signed as any)).resolves.toBeUndefined();
  });

  it('rejects when a field is tampered after signing', async () => {
    const pk = generatePrivateKey();
    const signed = await signMapWith(pk, BASE_MAP);
    // Tamper with a field after signing.
    const tampered = {
      ...signed,
      methodologyHash: 'sha256:tampered'
    };
    await expect(verifyYieldMap(tampered as any)).rejects.toThrow(
      'signature does not recover to publisher.address'
    );
  });

  it('rejects when publisher.address does not match the signing key', async () => {
    const pkA = generatePrivateKey();
    const pkB = generatePrivateKey();
    const accountB = privateKeyToAccount(pkB);
    // Sign with key A but set publisher.address to key B's address.
    const canonical = canonicalStringify({ ...BASE_MAP, signature: '' });
    const mapHash = keccak256(toBytes(canonical));
    const accountA = privateKeyToAccount(pkA);
    const signature = await accountA.signMessage({ message: { raw: mapHash } });
    const wrongPublisher = {
      ...BASE_MAP,
      signature,
      publisher: { ...BASE_MAP.publisher, address: accountB.address }
    };
    await expect(verifyYieldMap(wrongPublisher as any)).rejects.toThrow(
      'signature does not recover to publisher.address'
    );
  });

  it('resolves in strict mode when expectedSigner matches publisher', async () => {
    const pk = generatePrivateKey();
    const account = privateKeyToAccount(pk);
    const signed = await signMapWith(pk, BASE_MAP);
    await expect(verifyYieldMap(signed as any, account.address)).resolves.toBeUndefined();
  });

  it('rejects in strict mode when expectedSigner differs from actual signer', async () => {
    const pkA = generatePrivateKey();
    const pkB = generatePrivateKey();
    const accountB = privateKeyToAccount(pkB);
    const signed = await signMapWith(pkA, BASE_MAP);
    await expect(verifyYieldMap(signed as any, accountB.address)).rejects.toThrow(
      `is not the expected Scout address ${accountB.address}`
    );
  });
});
