import { describe, it, expect, beforeEach } from 'vitest';
import { loadConfig } from '../../src/config.js';

describe('loadConfig', () => {
  beforeEach(() => {
    process.env.MANTLE_RPC_URL = 'https://rpc.mantle.xyz';
    process.env.SCOUT_PRIVATE_KEY = '0x' + '1'.repeat(64);
    process.env.AGENT_EVENT_BUS_ADDRESS = '0x' + '2'.repeat(40);
    process.env.LIGHTHOUSE_API_KEY = 'lh-key';
    process.env.COINGECKO_API_KEY = 'cg-key';
    process.env.NANSEN_API_KEY = 'nansen-key';
  });

  it('parses required env', () => {
    const cfg = loadConfig();
    expect(cfg.chain.id).toBe(5000);
    expect(cfg.cycleIntervalMs).toBeGreaterThan(0);
    expect(cfg.ipfs.lighthouseApiKey).toBe('lh-key');
    expect(cfg.apis.coingecko).toBe('cg-key');
    expect(cfg.apis.nansen).toBe('nansen-key');
  });

  it('throws when a required var is missing', () => {
    delete process.env.MANTLE_RPC_URL;
    expect(() => loadConfig()).toThrow(/MANTLE_RPC_URL/);
  });
});
