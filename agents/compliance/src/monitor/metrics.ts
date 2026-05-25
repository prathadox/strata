import { Registry, Counter, Gauge } from 'prom-client';

export interface ComplianceMetrics {
  registry: Registry;
  checksTotal: Counter<string>;
  receiptsTotal: Counter<string>;
  denialsTotal: Counter<string>;
  verificationFailures: Counter<string>;
  sanctionsScreensTotal: Counter<string>;
  lastReceiptMs: Gauge<string>;
}

export function makeMetrics(): ComplianceMetrics {
  const registry = new Registry();
  const checksTotal = new Counter({ name: 'compliance_checks_total', help: 'Total compliance checks', registers: [registry] });
  const receiptsTotal = new Counter({ name: 'compliance_receipts_total', help: 'Receipts minted', registers: [registry] });
  const denialsTotal = new Counter({ name: 'compliance_denials_total', help: 'Denials issued', registers: [registry] });
  const verificationFailures = new Counter({ name: 'compliance_verification_failures_total', help: 'Verification failures', registers: [registry] });
  const sanctionsScreensTotal = new Counter({ name: 'compliance_sanctions_screens_total', help: 'Sanctions screens run', registers: [registry] });
  const lastReceiptMs = new Gauge({ name: 'compliance_last_receipt_ms', help: 'Wall-clock ms of last receipt', registers: [registry] });
  return { registry, checksTotal, receiptsTotal, denialsTotal, verificationFailures, sanctionsScreensTotal, lastReceiptMs };
}
