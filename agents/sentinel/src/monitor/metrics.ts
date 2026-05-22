import { Registry, Counter, Gauge } from 'prom-client';

export interface SentinelMetrics {
  registry: Registry;
  verdictsTotal: Counter<string>;
  verdictsSkipped: Counter<string>;
  hedgeSignalsTotal: Counter<string>;
  verificationFailures: Counter<string>;
  subscriptionErrors: Counter<string>;
  lastVerdictMs: Gauge<string>;
}

export function makeMetrics(): SentinelMetrics {
  const registry = new Registry();
  const verdictsTotal = new Counter({ name: 'sentinel_verdicts_total', help: 'Total verdicts published', registers: [registry] });
  const verdictsSkipped = new Counter({ name: 'sentinel_verdicts_skipped_total', help: 'Skipped cycles', labelNames: ['reason'], registers: [registry] });
  const hedgeSignalsTotal = new Counter({ name: 'sentinel_hedge_signals_total', help: 'Hedge signals emitted', registers: [registry] });
  const verificationFailures = new Counter({ name: 'sentinel_verification_failures_total', help: 'Verification failures', registers: [registry] });
  const subscriptionErrors = new Counter({ name: 'sentinel_subscription_errors_total', help: 'Subscription transport errors', registers: [registry] });
  const lastVerdictMs = new Gauge({ name: 'sentinel_last_verdict_ms', help: 'Wall-clock ms of last verdict publish', registers: [registry] });
  return { registry, verdictsTotal, verdictsSkipped, hedgeSignalsTotal, verificationFailures, subscriptionErrors, lastVerdictMs };
}
