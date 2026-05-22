import { Registry, Counter, Gauge } from 'prom-client';

export interface OperatorMetrics {
  registry: Registry;
  hedgesTotal: Counter<string>;
  hedgesSkipped: Counter<string>;
  verificationFailures: Counter<string>;
  priceFailures: Counter<string>;
  subscriptionErrors: Counter<string>;
  lastHedgeMs: Gauge<string>;
}

export function makeMetrics(): OperatorMetrics {
  const registry = new Registry();
  return {
    registry,
    hedgesTotal: new Counter({ name: 'operator_hedges_total', help: 'Hedges emitted', registers: [registry] }),
    hedgesSkipped: new Counter({ name: 'operator_hedges_skipped_total', help: 'Skipped cycles', labelNames: ['reason'], registers: [registry] }),
    verificationFailures: new Counter({ name: 'operator_verification_failures_total', help: 'Signal verification failures', registers: [registry] }),
    priceFailures: new Counter({ name: 'operator_price_failures_total', help: 'CoinGecko fetch failures', registers: [registry] }),
    subscriptionErrors: new Counter({ name: 'operator_subscription_errors_total', help: 'Subscription transport errors', registers: [registry] }),
    lastHedgeMs: new Gauge({ name: 'operator_last_hedge_ms', help: 'Wall-clock ms of last hedge emit', registers: [registry] })
  };
}
