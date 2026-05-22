export interface HealthState {
  lastVerdictAt: number | null;
  recordVerdict: (ts: number) => void;
  asJson: () => { status: 'ok'; lastVerdictAt: number | null };
}

export function makeHealth(): HealthState {
  let last: number | null = null;
  return {
    get lastVerdictAt() { return last; },
    recordVerdict(ts: number) { last = ts; },
    asJson() { return { status: 'ok' as const, lastVerdictAt: last }; }
  };
}
