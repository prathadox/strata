import { describe, it, expect } from 'vitest';
import { PROTOCOL_CONFIG, metaFor } from '../../src/pipeline/enrichment/protocolConfig.js';
import type { SourceProtocol } from '../../src/types.js';

const ALL_SOURCES: SourceProtocol[] = [
  'ondo', 'ethena', 'meth', 'mantleVault', 'cian',
  'agni', 'merchantMoe', 'aave', 'fbtc', 'mortgageDemo'
];

describe('PROTOCOL_CONFIG', () => {
  it('has an entry for every SourceProtocol', () => {
    for (const src of ALL_SOURCES) {
      expect(PROTOCOL_CONFIG[src]).toBeDefined();
    }
  });

  it('aave meta is top-tier audited + chainlink + permissionless', () => {
    const m = metaFor('aave');
    expect(m.auditFactor).toBe(0.30);
    expect(m.oracleType).toBe('chainlink_dec');
    expect(m.counterpartyClass).toBe('permissionless');
    expect(m.contractAgeDays).toBeGreaterThan(0);
  });

  it('mortgageDemo is flagged as least-trusted (unaudited, single oracle, custodial-ish, new)', () => {
    const m = metaFor('mortgageDemo');
    expect(m.auditFactor).toBe(1.00);
    expect(m.oracleType).toBe('single');
    expect(m.contractAgeDays).toBeLessThan(180);
  });

  it('every auditFactor is in {0.30, 0.60, 1.00}', () => {
    for (const src of ALL_SOURCES) {
      expect([0.30, 0.60, 1.00]).toContain(PROTOCOL_CONFIG[src]!.auditFactor);
    }
  });
});
