export interface HealthOptions { cycleIntervalMs: number; }

export class HealthState {
  private lastSuccessMs: number | null = null;
  constructor(private opts: HealthOptions) {}

  recordCycle(nowMs: number): void { this.lastSuccessMs = nowMs; }

  isHealthy(nowMs: number): boolean {
    if (this.lastSuccessMs === null) return false;
    return nowMs - this.lastSuccessMs <= 2 * this.opts.cycleIntervalMs;
  }

  lastCycleMs(): number | null { return this.lastSuccessMs; }
}
