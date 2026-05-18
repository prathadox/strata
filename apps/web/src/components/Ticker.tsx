import { TICKS } from '@/lib/content';

export function Ticker() {
  // Duplicate items for seamless loop
  const items = [...TICKS, ...TICKS];

  return (
    <div className="ticker" aria-hidden="true">
      <div className="ticker-track">
        {items.map((t, i) => (
          <span className="tick" key={i}>
            <span className="who">{t.who}</span>
            <span>{t.what}</span>
            <span className="hash">{t.h}</span>
            <span className="sep">◆</span>
          </span>
        ))}
      </div>
    </div>
  );
}
