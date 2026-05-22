export interface HealthState {
  lastHedgeAt: number | null;
  recordHedge: (ts: number) => void;
  asJson: () => { status: 'ok'; lastHedgeAt: number | null };
}

export function makeHealth(): HealthState {
  let last: number | null = null;
  return {
    get lastHedgeAt() { return last; },
    recordHedge(ts: number) { last = ts; },
    asJson() { return { status: 'ok' as const, lastHedgeAt: last }; }
  };
}
