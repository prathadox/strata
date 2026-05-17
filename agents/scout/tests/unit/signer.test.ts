import { describe, it, expect } from 'vitest';
import { canonicalStringify, signYieldMap } from '../../src/publication/signer.js';
import { createWalletClient, http, recoverMessageAddress, keccak256, toBytes } from 'viem';
import { privateKeyToAccount, generatePrivateKey } from 'viem/accounts';
import { mainnet } from 'viem/chains';

describe('canonicalStringify', () => {
  it('sorts object keys alphabetically', () => {
    expect(canonicalStringify({ b: 1, a: 2 })).toBe('{"a":2,"b":1}');
  });

  it('handles nested objects', () => {
    expect(canonicalStringify({ z: { d: 1, c: 2 }, a: 3 })).toBe('{"a":3,"z":{"c":2,"d":1}}');
  });

  it('preserves array order (arrays are sequential)', () => {
    expect(canonicalStringify({ list: [3, 1, 2] })).toBe('{"list":[3,1,2]}');
  });

  it('is deterministic across reorderings', () => {
    const a = canonicalStringify({ x: 1, y: { p: 'a', q: 'b' } });
    const b = canonicalStringify({ y: { q: 'b', p: 'a' }, x: 1 });
    expect(a).toBe(b);
  });

  it('handles null and primitives', () => {
    expect(canonicalStringify(null)).toBe('null');
    expect(canonicalStringify(true)).toBe('true');
    expect(canonicalStringify(42)).toBe('42');
    expect(canonicalStringify('hi')).toBe('"hi"');
  });
});

describe('signYieldMap', () => {
  it('produces a recoverable EIP-191 signature over keccak(canonical unsigned bytes)', async () => {
    const pk = generatePrivateKey();
    const account = privateKeyToAccount(pk);
    const wallet = createWalletClient({ account, chain: mainnet, transport: http('http://localhost:1') });

    const unsigned = { version: '1.0', publishedAtMs: 1700000000000, opportunities: [], publisher: { address: account.address, identityNFT: '0' } };
    const signed = await signYieldMap(unsigned, wallet, account);

    // mapHash should be keccak of canonical-unsigned bytes (with signature: "")
    const unsignedCanonical = canonicalStringify({ ...unsigned, signature: '' });
    const expectedHash = keccak256(toBytes(unsignedCanonical));
    expect(signed.mapHash).toBe(expectedHash);

    // signature should recover to account.address
    const recovered = await recoverMessageAddress({ message: { raw: signed.mapHash }, signature: signed.signature });
    expect(recovered.toLowerCase()).toBe(account.address.toLowerCase());
  });

  it('produces identical mapHash for identical inputs (idempotent)', async () => {
    const pk = generatePrivateKey();
    const account = privateKeyToAccount(pk);
    const wallet = createWalletClient({ account, chain: mainnet, transport: http('http://localhost:1') });

    const unsigned = { foo: 'bar', baz: 1 };
    const a = await signYieldMap(unsigned, wallet, account);
    const b = await signYieldMap(unsigned, wallet, account);
    expect(a.mapHash).toBe(b.mapHash);
  });
});
