import { Reveal } from './Reveal';
import { TrancheGlyph } from './Mark';
import { TRANCHES } from '@/lib/content';

export function Tranches() {
  return (
    <section id="tranches" className="section">
      <div className="wrap">
        <Reveal>
          <div className="section-head">
            <div>
              <p className="section-eyebrow">01 / Tranches</p>
              <h2 className="section-title">Three claims on the same cashflow.</h2>
            </div>
            <p className="section-lede">
              One pool of yield, sliced into three tiers. You choose the tier.
              Losses absorb from the bottom up; yield distributes from the top down.
            </p>
          </div>
        </Reveal>

        <div className="tranche-grid">
          {TRANCHES.map((t, i) => (
            <Reveal key={t.cls} delay={i * 80}>
              <article className={`tranche ${t.cls}`}>
                <header className="tranche-head">
                  <TrancheGlyph tier={t.tier} />
                  <span className="rank">{t.rank}</span>
                </header>

                <div className="tranche-title">
                  <h3>{t.name}</h3>
                  <span className="role">{t.role}</span>
                  <div className="apy">
                    <span className="n">{t.apy}</span>
                    <span className="u">{t.apyUnit}</span>
                  </div>
                </div>

                <p className="desc">{t.desc}</p>

                <div className="backing">
                  {t.backing.map((b, j) => (
                    <span className="b" key={j}>{b}</span>
                  ))}
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
