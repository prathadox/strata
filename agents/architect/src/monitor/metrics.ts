import { Registry, Counter, Gauge, collectDefaultMetrics } from 'prom-client';

export class ArchitectMetrics {
  readonly registry = new Registry();
  readonly proposalsTotal: Counter;
  readonly proposalsSkipped: Counter<'reason'>;
  readonly verificationFailures: Counter;
  readonly lastProposalMs: Gauge;
  readonly subscriptionErrors: Counter;

  constructor() {
    collectDefaultMetrics({ register: this.registry });
    this.proposalsTotal = new Counter({
      name: 'architect_proposals_total',
      help: 'total proposals successfully published',
      registers: [this.registry]
    });
    this.proposalsSkipped = new Counter({
      name: 'architect_proposals_skipped',
      help: 'proposals skipped by reason',
      labelNames: ['reason'] as const,
      registers: [this.registry]
    });
    this.verificationFailures = new Counter({
      name: 'architect_verification_failures',
      help: 'YieldMap verification failures',
      registers: [this.registry]
    });
    this.lastProposalMs = new Gauge({
      name: 'architect_last_proposal_ms',
      help: 'unix ms of last published proposal',
      registers: [this.registry]
    });
    this.subscriptionErrors = new Counter({
      name: 'architect_subscription_errors',
      help: 'live-stream errors from yieldMap or hedge subscriptions',
      registers: [this.registry]
    });
  }

  async toText(): Promise<string> {
    return this.registry.metrics();
  }
}
