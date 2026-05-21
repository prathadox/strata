export interface HealthOptions {
  // Time (ms) since the last successful proposal that still counts as healthy.
  // Architect is event-driven, so this is generous (default 2 hours).
  maxStalenessMs?: number;
}

export class HealthState {
  private lastProposalMs: number | null = null;
  private readonly maxStalenessMs: number;

  constructor(opts: HealthOptions = {}) {
    this.maxStalenessMs = opts.maxStalenessMs ?? 2 * 60 * 60 * 1_000; // 2h
  }

  recordProposal(nowMs: number): void {
    this.lastProposalMs = nowMs;
  }

  isHealthy(nowMs: number): boolean {
    if (this.lastProposalMs === null) return true; // grace period at startup
    return (nowMs - this.lastProposalMs) <= this.maxStalenessMs;
  }

  lastProposalAt(): number | null {
    return this.lastProposalMs;
  }
}
