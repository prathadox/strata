import { LEDGER_ROWS } from '@/lib/content';

export function Ledger() {
  return (
    <div className="ledger" role="region" aria-label="On-chain event stream sample">
      <div className="ledger-head">
        <span>Live event stream, sample</span>
        <span className="live">
          <span className="blip" />
          chain · 5000
        </span>
      </div>
      {LEDGER_ROWS.map((r, i) => (
        <div className="ledger-row" key={i}>
          <span className="t">{r.t}</span>
          <span className="who">{r.who}</span>
          <span className="what">{r.what}</span>
          <span className="h">{r.h}</span>
        </div>
      ))}
    </div>
  );
}
