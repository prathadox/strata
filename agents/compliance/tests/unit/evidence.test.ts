import { describe, it, expect } from 'vitest';
import {
  generateEvidenceKey,
  encryptEvidence,
  decryptEvidence,
  serializeBlob,
  deserializeBlob,
} from '../../src/pipeline/evidence.js';

const samplePlaintext = JSON.stringify({
  credentialProof: '0xdeadbeef',
  sanctionsScreen: { provider: 'chainalysis', clear: true },
  jurisdiction: 'US',
  denialReason: null,
});

describe('evidence encryption', () => {
  it('encrypt then decrypt round-trip recovers plaintext', () => {
    const key = generateEvidenceKey();
    const blob = encryptEvidence(key, samplePlaintext);
    const recovered = decryptEvidence(key, blob);
    expect(recovered).toBe(samplePlaintext);
  });

  it('wrong key causes auth tag mismatch', () => {
    const key = generateEvidenceKey();
    const wrongKey = generateEvidenceKey();
    const blob = encryptEvidence(key, samplePlaintext);
    expect(() => decryptEvidence(wrongKey, blob)).toThrow();
  });

  it('tampered ciphertext causes decrypt to throw', () => {
    const key = generateEvidenceKey();
    const blob = encryptEvidence(key, samplePlaintext);
    blob.ciphertext[0] ^= 0xff;
    expect(() => decryptEvidence(key, blob)).toThrow();
  });

  it('serialize then deserialize round-trip preserves all fields', () => {
    const key = generateEvidenceKey();
    const blob = encryptEvidence(key, samplePlaintext);
    const wire = serializeBlob(blob);
    const restored = deserializeBlob(wire);

    expect(Buffer.compare(restored.iv, blob.iv)).toBe(0);
    expect(Buffer.compare(restored.tag, blob.tag)).toBe(0);
    expect(Buffer.compare(restored.ciphertext, blob.ciphertext)).toBe(0);

    const recovered = decryptEvidence(key, restored);
    expect(recovered).toBe(samplePlaintext);
  });

  it('generateEvidenceKey returns 32 bytes', () => {
    const key = generateEvidenceKey();
    expect(key.length).toBe(32);
  });

  it('different encryptions of same plaintext produce different ciphertexts', () => {
    const key = generateEvidenceKey();
    const a = encryptEvidence(key, samplePlaintext);
    const b = encryptEvidence(key, samplePlaintext);
    expect(Buffer.compare(a.iv, b.iv)).not.toBe(0);
    expect(Buffer.compare(a.ciphertext, b.ciphertext)).not.toBe(0);
  });
});
