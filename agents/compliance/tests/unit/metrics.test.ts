import { describe, it, expect } from 'vitest';
import { makeMetrics } from '../../src/monitor/metrics.js';

describe('makeMetrics', () => {
  it('all counters exist with correct names', () => {
    const m = makeMetrics();
    expect(m.checksTotal.name).toBe('compliance_checks_total');
    expect(m.receiptsTotal.name).toBe('compliance_receipts_total');
    expect(m.denialsTotal.name).toBe('compliance_denials_total');
    expect(m.verificationFailures.name).toBe('compliance_verification_failures_total');
    expect(m.sanctionsScreensTotal.name).toBe('compliance_sanctions_screens_total');
    expect(m.lastReceiptMs.name).toBe('compliance_last_receipt_ms');
  });

  it('incrementing checksTotal works', () => {
    const m = makeMetrics();
    m.checksTotal.inc();
    m.checksTotal.inc();
    expect((m.checksTotal as any).hashMap).toBeDefined();
  });

  it('setting lastReceiptMs works', () => {
    const m = makeMetrics();
    m.lastReceiptMs.set(Date.now());
    expect((m.lastReceiptMs as any).hashMap).toBeDefined();
  });

  it('registry.metrics() returns a string', async () => {
    const m = makeMetrics();
    m.checksTotal.inc();
    const output = await m.registry.metrics();
    expect(typeof output).toBe('string');
    expect(output).toContain('compliance_checks_total');
  });
});
