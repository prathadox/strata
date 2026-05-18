// Mark.tsx - the three-pill Strata mark.
// CSS-rendered (uses .mark / .pill in globals.css) so the metallic
// edge-light and ambient glow stay sharp at any size.

interface MarkProps {
  withLabels?: boolean;
}

export function Mark({ withLabels = true }: MarkProps) {
  return (
    <div className="mark" aria-label="Strata mark">
      <div className="pill">
        {withLabels && (
          <span className="pill-label"><b>Senior</b> &nbsp;·&nbsp; capital preservation</span>
        )}
      </div>
      <div className="pill">
        {withLabels && (
          <span className="pill-label"><b>Mezzanine</b> &nbsp;·&nbsp; balanced</span>
        )}
      </div>
      <div className="pill">
        {withLabels && (
          <span className="pill-label"><b>Junior</b> &nbsp;·&nbsp; residual upside</span>
        )}
      </div>
    </div>
  );
}

// Tiny stacked-pill mark for the nav.
export function MarkMini() {
  return (
    <span className="mark-mini" aria-hidden="true">
      <span className="pill-mini" />
      <span className="pill-mini" />
      <span className="pill-mini" />
    </span>
  );
}

// A flat SVG glyph used inside tranche cards (one filled pill per tier).
interface TrancheGlyphProps {
  tier: 'senior' | 'mezz' | 'junior';
}

export function TrancheGlyph({ tier }: TrancheGlyphProps) {
  // tier controls how many pills get the accent fill
  const filled =
    tier === 'senior' ? [true, false, false] :
    tier === 'mezz'   ? [true, true,  false] :
                        [true, true,  true];

  return (
    <svg className="glyph" viewBox="0 0 80 32" fill="none" aria-hidden="true">
      {([0, 1, 2] as const).map((i) => (
        <rect
          key={i}
          x={i * 14}
          y={4}
          width={52}
          height={6}
          rx={3}
          className="p"
          opacity={filled[i] ? 1 : 0.18}
          transform={`translate(0 ${i * 9})`}
        />
      ))}
    </svg>
  );
}
