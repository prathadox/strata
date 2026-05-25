export interface HealthState {
  lastReceiptAt: number | null;
  lastDenialAt: number | null;
  recordReceipt: (ts: number) => void;
  recordDenial: (ts: number) => void;
  asJson: () => { status: 'ok'; lastReceiptAt: number | null; lastDenialAt: number | null };
}

export function makeHealth(): HealthState {
  let lastReceipt: number | null = null;
  let lastDenial: number | null = null;
  return {
    get lastReceiptAt() { return lastReceipt; },
    get lastDenialAt() { return lastDenial; },
    recordReceipt(ts: number) { lastReceipt = ts; },
    recordDenial(ts: number) { lastDenial = ts; },
    asJson() { return { status: 'ok' as const, lastReceiptAt: lastReceipt, lastDenialAt: lastDenial }; }
  };
}
