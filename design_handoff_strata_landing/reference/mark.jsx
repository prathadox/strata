// mark.jsx — the three-pill Strata mark.
// CSS-rendered (uses .mark / .pill in styles.css) so the metallic
// edge-light and ambient glow stay sharp at any size.

function Mark({ withLabels = true }) {
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
function MarkMini() {
  return (
    <span className="mark-mini" aria-hidden="true">
      <span className="pill-mini" />
      <span className="pill-mini" />
      <span className="pill-mini" />
    </span>
  );
}

// A flat SVG glyph used inside tranche cards (one filled pill per tier).
function TrancheGlyph({ tier }) {
  // tier: "senior" | "mezz" | "junior"  — controls how many pills get the accent fill
  const filled = tier === "senior" ? [true, false, false] :
                 tier === "mezz"   ? [true, true,  false] :
                                     [true, true,  true];
  return (
    <svg className="glyph" viewBox="0 0 80 32" fill="none" aria-hidden="true">
      {[0, 1, 2].map(i => (
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

window.Mark = Mark;
window.MarkMini = MarkMini;
window.TrancheGlyph = TrancheGlyph;
