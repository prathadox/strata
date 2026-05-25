import { describe, it, expect } from 'vitest';
import { makeHealth } from '../../src/monitor/health.js';

describe('makeHealth', () => {
  it('starts with null timestamps', () => {
    const h = makeHealth();
    expect(h.lastReceiptAt).toBeNull();
    expect(h.lastDenialAt).toBeNull();
  });

  it('recordReceipt updates lastReceiptAt', () => {
    const h = makeHealth();
    h.recordReceipt(1000);
    expect(h.lastReceiptAt).toBe(1000);
  });

  it('recordDenial updates lastDenialAt', () => {
    const h = makeHealth();
    h.recordDenial(2000);
    expect(h.lastDenialAt).toBe(2000);
  });

  it('asJson returns correct shape with status ok', () => {
    const h = makeHealth();
    h.recordReceipt(3000);
    h.recordDenial(4000);
    expect(h.asJson()).toEqual({
      status: 'ok',
      lastReceiptAt: 3000,
      lastDenialAt: 4000
    });
  });
});
