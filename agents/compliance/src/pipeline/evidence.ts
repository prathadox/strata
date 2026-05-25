import { randomBytes, createCipheriv, createDecipheriv } from 'node:crypto';

const ALGO = 'aes-256-gcm';
const IV_BYTES = 12;
const TAG_BYTES = 16;

export interface EncryptedBlob {
  ciphertext: Buffer;
  iv: Buffer;
  tag: Buffer;
}

export function generateEvidenceKey(): Buffer {
  return randomBytes(32);
}

export function encryptEvidence(key: Buffer, plaintext: string): EncryptedBlob {
  const iv = randomBytes(IV_BYTES);
  const cipher = createCipheriv(ALGO, key, iv);
  const ciphertext = Buffer.concat([cipher.update(plaintext, 'utf8'), cipher.final()]);
  const tag = cipher.getAuthTag();
  return { ciphertext, iv, tag };
}

export function decryptEvidence(key: Buffer, blob: EncryptedBlob): string {
  const decipher = createDecipheriv(ALGO, key, blob.iv);
  decipher.setAuthTag(blob.tag);
  const plaintext = Buffer.concat([decipher.update(blob.ciphertext), decipher.final()]);
  return plaintext.toString('utf8');
}

// Wire format for IPFS pinning: [12-byte IV] [16-byte tag] [ciphertext]
export function serializeBlob(blob: EncryptedBlob): Buffer {
  return Buffer.concat([blob.iv, blob.tag, blob.ciphertext]);
}

export function deserializeBlob(buf: Buffer): EncryptedBlob {
  const iv = buf.subarray(0, IV_BYTES);
  const tag = buf.subarray(IV_BYTES, IV_BYTES + TAG_BYTES);
  const ciphertext = buf.subarray(IV_BYTES + TAG_BYTES);
  return { ciphertext: Buffer.from(ciphertext), iv: Buffer.from(iv), tag: Buffer.from(tag) };
}
