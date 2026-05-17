import { describe, it, expect, beforeEach } from 'vitest';
import { loadConfig } from '../../src/config.js';

describe('loadConfig', () => {
  beforeEach(() => {
    process.env.MANTLE_RPC_URL = 'https://rpc.mantle.xyz';
    process.env.SCOUT_PRIVATE_KEY = '0x' + '1'.repeat(64);
    process.env.PINATA_JWT = 'jwt-token';
    process.env.WEB3_STORAGE_TOKEN = 'tok';
    process.env.MANTLESCAN_API_KEY = 'k';
    process.env.NANSEN_API_KEY = 'k';
    process.env.ONEINCH_API_KEY = 'k';
    process.env.COINGECKO_API_KEY = 'k';
    process.env.AGENT_EVENT_BUS_ADDRESS = '0x' + '2'.repeat(40);
  });

  it('parses required env', () => {
    const cfg = loadConfig();
    expect(cfg.chain.id).toBe(5000);
    expect(cfg.cycleIntervalMs).toBeGreaterThan(0);
  });

  it('throws when a required var is missing', () => {
    delete process.env.MANTLE_RPC_URL;
    expect(() => loadConfig()).toThrow(/MANTLE_RPC_URL/);
  });
});
