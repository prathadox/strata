import { describe, it, expect, vi } from 'vitest';
import { runScoutLoop } from '../../src/runLoop.js';
import { HealthState } from '../../src/monitor/health.js';
import { ScoutMetrics } from '../../src/monitor/metrics.js';

describe('runScoutLoop', () => {
  it('invokes cycle, increments cyclesTotal, records health on success', async () => {
    const cycle = vi.fn().mockResolvedValue({ opportunities: [{ id: 'x' }] });
    const health = new HealthState({ cycleIntervalMs: 1000 });
    const metrics = new ScoutMetrics();
    await runScoutLoop({ cycle, health, metrics, stopAfter: 1, cycleIntervalMs: 10 });
    expect(cycle).toHaveBeenCalledTimes(1);
    expect(health.isHealthy(Date.now())).toBe(true);
    const text = await metrics.toText();
    expect(text).toContain('scout_cycles_total 1');
  });

  it('catches cycle errors, increments cyclesFailed, does not throw', async () => {
    const cycle = vi.fn().mockRejectedValue(new Error('boom'));
    const health = new HealthState({ cycleIntervalMs: 1000 });
    const metrics = new ScoutMetrics();
    await runScoutLoop({ cycle, health, metrics, stopAfter: 1, cycleIntervalMs: 10 });
    expect(cycle).toHaveBeenCalledTimes(1);
    expect(health.isHealthy(Date.now())).toBe(false);
    const text = await metrics.toText();
    expect(text).toContain('scout_cycles_failed 1');
  });

  it('runs exactly stopAfter iterations', async () => {
    const cycle = vi.fn().mockResolvedValue(null);
    const health = new HealthState({ cycleIntervalMs: 1000 });
    const metrics = new ScoutMetrics();
    await runScoutLoop({ cycle, health, metrics, stopAfter: 3, cycleIntervalMs: 5 });
    expect(cycle).toHaveBeenCalledTimes(3);
  });
});
