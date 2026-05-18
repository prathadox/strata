import { describe, it, expect } from 'vitest';
import { HealthState } from '../../src/monitor/health.js';

describe('HealthState', () => {
  it('reports unhealthy on first start (no successful cycle yet)', () => {
    const h = new HealthState({ cycleIntervalMs: 60_000 });
    expect(h.isHealthy(Date.now())).toBe(false);
  });

  it('reports healthy after a successful cycle within 2x interval', () => {
    const h = new HealthState({ cycleIntervalMs: 60_000 });
    const t = 1_000_000;
    h.recordCycle(t);
    expect(h.isHealthy(t + 100_000)).toBe(true);
  });

  it('reports unhealthy when last cycle is older than 2x interval', () => {
    const h = new HealthState({ cycleIntervalMs: 60_000 });
    const t = 1_000_000;
    h.recordCycle(t);
    expect(h.isHealthy(t + 130_000)).toBe(false);
  });
});
