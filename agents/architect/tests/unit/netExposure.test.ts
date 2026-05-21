import { describe, it, expect } from 'vitest';
import { NetExposureLedger } from '../../src/pipeline/netExposure.js';

const ASSET_A = '0xAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA' as `0x${string}`;
const ASSET_B = '0xBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBB' as `0x${string}`;
const UNKNOWN = '0xCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCC' as `0x${string}`;

describe('NetExposureLedger', () => {
  it('latest-wins: three apply calls for the same asset yield the final netPosition', () => {
    const ledger = new NetExposureLedger();
    ledger.apply(ASSET_A, 100n, 1000);
    ledger.apply(ASSET_A, 200n, 1001);
    ledger.apply(ASSET_A, 350n, 1002);
    expect(ledger.get(ASSET_A)).toBe(350n);
  });

  it('multiple assets: each get() returns its own value and snapshot includes both', () => {
    const ledger = new NetExposureLedger();
    ledger.apply(ASSET_A, 500n, 1000);
    ledger.apply(ASSET_B, 750n, 1001);
    expect(ledger.get(ASSET_A)).toBe(500n);
    expect(ledger.get(ASSET_B)).toBe(750n);
    const snap = ledger.snapshot();
    expect(snap[ASSET_A.toLowerCase()]).toBe('500');
    expect(snap[ASSET_B.toLowerCase()]).toBe('750');
  });

  it('address case-insensitivity: apply uppercase, get lowercase returns the value', () => {
    const ledger = new NetExposureLedger();
    ledger.apply('0xABCDEF1234567890ABCDEF1234567890ABCDEF12' as `0x${string}`, 999n, 2000);
    expect(ledger.get('0xabcdef1234567890abcdef1234567890abcdef12' as `0x${string}`)).toBe(999n);
  });

  it('unknown asset returns 0n', () => {
    const ledger = new NetExposureLedger();
    expect(ledger.get(UNKNOWN)).toBe(0n);
  });

  it('snapshot serializes negative bigints as decimal strings', () => {
    const ledger = new NetExposureLedger();
    ledger.apply(ASSET_A, -100n, 3000);
    const snap = ledger.snapshot();
    expect(snap[ASSET_A.toLowerCase()]).toBe('-100');
  });
});
