import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { loadConfig } from '../../src/config.js';

const baseEnv = {
  MANTLE_RPC_URL: 'https://rpc.mantle.xyz',
  OPERATOR_PRIVATE_KEY: '0x' + '1'.repeat(64),
  PINATA_JWT: 'lh-key',
  COINGECKO_API_KEY: 'cg-key',
  OPERATOR_DRY_RUN: 'true'
};

describe('loadConfig', () => {
  let saved: NodeJS.ProcessEnv;
  beforeEach(() => { saved = { ...process.env }; });
  afterEach(() => { process.env = saved; });

  it('loads valid env', () => {
    process.env = { ...baseEnv } as any;
    const cfg = loadConfig();
    expect(cfg.chain.id).toBe(5000);
    expect(cfg.operator.dryRun).toBe(true);
  });

  it('rejects live mode without bus address', () => {
    process.env = { ...baseEnv, OPERATOR_DRY_RUN: 'false' } as any;
    expect(() => loadConfig()).toThrow(/AGENT_EVENT_BUS_ADDRESS/);
  });

  it('rejects live mode without identity registry', () => {
    process.env = { ...baseEnv, OPERATOR_DRY_RUN: 'false', AGENT_EVENT_BUS_ADDRESS: '0x' + 'a'.repeat(40) } as any;
    expect(() => loadConfig()).toThrow(/IDENTITY_REGISTRY_ADDRESS/);
  });
});
