import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { loadConfig } from '../../src/config.js';

describe('loadConfig', () => {
  beforeEach(() => {
    process.env.MANTLE_RPC_URL = 'https://rpc.mantle.xyz';
    process.env.ARCHITECT_PRIVATE_KEY = '0x' + '1'.repeat(64);
    process.env.AGENT_EVENT_BUS_ADDRESS = '0x' + '2'.repeat(40);
    process.env.IDENTITY_REGISTRY_ADDRESS = '0x' + '3'.repeat(40);
    process.env.PINATA_JWT = 'lh-key';
    delete process.env.ARCHITECT_DRY_RUN;
    delete process.env.GEMINI_API_KEY;
  });

  afterEach(() => {
    delete process.env.ARCHITECT_DRY_RUN;
    delete process.env.GEMINI_API_KEY;
  });

  it('parses valid env', () => {
    const cfg = loadConfig();
    expect(cfg.chain.id).toBe(5000);
    expect(cfg.cycleIntervalMs).toBeGreaterThan(0);
    expect(cfg.ipfs.pinataJwt).toBe('lh-key');
    expect(cfg.architect.dryRun).toBe(false);
  });

  it('throws when MANTLE_RPC_URL is missing', () => {
    delete process.env.MANTLE_RPC_URL;
    expect(() => loadConfig()).toThrow(/MANTLE_RPC_URL/);
  });

  it('throws when AGENT_EVENT_BUS_ADDRESS is missing in live mode', () => {
    delete process.env.AGENT_EVENT_BUS_ADDRESS;
    expect(() => loadConfig()).toThrow(/AGENT_EVENT_BUS_ADDRESS/);
  });

  it('throws when IDENTITY_REGISTRY_ADDRESS is missing in live mode', () => {
    delete process.env.IDENTITY_REGISTRY_ADDRESS;
    expect(() => loadConfig()).toThrow(/IDENTITY_REGISTRY_ADDRESS/);
  });

  it('allows AGENT_EVENT_BUS_ADDRESS to be missing in dry-run mode and defaults eventBus to zero address', () => {
    delete process.env.AGENT_EVENT_BUS_ADDRESS;
    process.env.ARCHITECT_DRY_RUN = 'true';
    const cfg = loadConfig();
    expect(cfg.architect.dryRun).toBe(true);
    expect(cfg.architect.eventBus).toBe('0x0000000000000000000000000000000000000000');
  });

  it('absent GEMINI_API_KEY is fine (field is optional)', () => {
    delete process.env.GEMINI_API_KEY;
    const cfg = loadConfig();
    expect(cfg.llm.geminiApiKey).toBeUndefined();
  });
});
