import { Registry, Counter, Gauge, collectDefaultMetrics } from 'prom-client';

export class ScoutMetrics {
  readonly registry = new Registry();
  readonly cyclesTotal: Counter;
  readonly cyclesFailed: Counter;
  readonly opportunitiesGauge: Gauge;
  readonly lastCycleMs: Gauge;

  constructor() {
    collectDefaultMetrics({ register: this.registry });
    this.cyclesTotal = new Counter({ name: 'scout_cycles_total', help: 'total cycles attempted', registers: [this.registry] });
    this.cyclesFailed = new Counter({ name: 'scout_cycles_failed', help: 'cycles that threw', registers: [this.registry] });
    this.opportunitiesGauge = new Gauge({ name: 'scout_opportunities_last_cycle', help: 'opportunity count in last published map', registers: [this.registry] });
    this.lastCycleMs = new Gauge({ name: 'scout_last_cycle_ms', help: 'unix ms of last successful cycle', registers: [this.registry] });
  }

  async toText(): Promise<string> { return this.registry.metrics(); }
}
