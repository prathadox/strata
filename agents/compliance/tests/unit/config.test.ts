import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { loadConfig } from '../../src/config.js';

const baseEnv = {
  MANTLE_RPC_URL: 'https://rpc.mantle.xyz',
  COMPLIANCE_PRIVATE_KEY: '0x' + '1'.repeat(64),
  PINATA_JWT: 'lh-key',
  COMPLIANCE_DRY_RUN: 'true'
};

describe('loadConfig', () => {
  let saved: NodeJS.ProcessEnv;
  beforeEach(() => { saved = { ...process.env }; });
  afterEach(() => { process.env = saved; });

  it('loads valid env with dryRun=true', () => {
    process.env = { ...baseEnv } as any;
    const cfg = loadConfig();
    expect(cfg.chain.id).toBe(5000);
    expect(cfg.compliance.dryRun).toBe(true);
  });

  it('throws on missing MANTLE_RPC_URL', () => {
    const { MANTLE_RPC_URL: _, ...rest } = baseEnv;
    process.env = { ...rest } as any;
    expect(() => loadConfig()).toThrow(/Config error/);
  });

  it('throws on missing COMPLIANCE_PRIVATE_KEY', () => {
    const { COMPLIANCE_PRIVATE_KEY: _, ...rest } = baseEnv;
    process.env = { ...rest } as any;
    expect(() => loadConfig()).toThrow(/Config error/);
  });

  it('throws when dryRun=false without COMPLIANCE_REGISTRY_ADDRESS', () => {
    process.env = { ...baseEnv, COMPLIANCE_DRY_RUN: 'false' } as any;
    expect(() => loadConfig()).toThrow(/COMPLIANCE_REGISTRY_ADDRESS/);
  });

  it('throws when dryRun=false without JURISDICTION_POLICY_NFT_ADDRESS', () => {
    process.env = {
      ...baseEnv,
      COMPLIANCE_DRY_RUN: 'false',
      COMPLIANCE_REGISTRY_ADDRESS: '0x' + '2'.repeat(40)
    } as any;
    expect(() => loadConfig()).toThrow(/JURISDICTION_POLICY_NFT_ADDRESS/);
  });

  it('throws when dryRun=false without POLICY_REVOCATION_REGISTRY_ADDRESS', () => {
    process.env = {
      ...baseEnv,
      COMPLIANCE_DRY_RUN: 'false',
      COMPLIANCE_REGISTRY_ADDRESS: '0x' + '2'.repeat(40),
      JURISDICTION_POLICY_NFT_ADDRESS: '0x' + '3'.repeat(40)
    } as any;
    expect(() => loadConfig()).toThrow(/POLICY_REVOCATION_REGISTRY_ADDRESS/);
  });

  it('applies correct defaults for healthPort, logLevel, and dryRun', () => {
    const { COMPLIANCE_DRY_RUN: _, ...envWithoutDryRun } = baseEnv;
    process.env = {
      ...envWithoutDryRun,
      COMPLIANCE_REGISTRY_ADDRESS: '0x' + '2'.repeat(40),
      JURISDICTION_POLICY_NFT_ADDRESS: '0x' + '3'.repeat(40),
      POLICY_REVOCATION_REGISTRY_ADDRESS: '0x' + '4'.repeat(40)
    } as any;
    const cfg = loadConfig();
    expect(cfg.compliance.healthPort).toBe(9094);
    expect(cfg.logLevel).toBe('info');
    expect(cfg.compliance.dryRun).toBe(false);
  });
});
