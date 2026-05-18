import { Reveal } from './Reveal';
import { ECO } from '@/lib/content';

export function Ecosystem() {
  return (
    <section id="ecosystem" className="section section-eco">
      <div className="wrap">
        <Reveal>
          <div className="section-head">
            <div>
              <p className="section-eyebrow">04 / Ecosystem</p>
              <h2 className="section-title">Built on what already works.</h2>
            </div>
            <p className="section-lede">
              Strata composes existing yield primitives, identity standards, and risk infrastructure
              into a single tranched product on Mantle.
            </p>
          </div>
        </Reveal>

        <div className="eco-grid">
          {ECO.map((g, i) => (
            <Reveal key={g.title} delay={i * 80}>
              <article className="eco-card">
                <header className="eco-card-head">
                  <h3>{g.title}</h3>
                  <span className="eco-role">{g.role}</span>
                </header>
                <ul className="eco-list">
                  {g.items.map((it, j) => (
                    <li key={j}>
                      <span className="eco-dot" />
                      <span>{it}</span>
                    </li>
                  ))}
                </ul>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
