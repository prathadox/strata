import { Reveal } from './Reveal';
import { Mark } from './Mark';
import { Ticker } from './Ticker';
import { HEADLINES } from '@/lib/content';

const HEADLINE_VARIANT = 'slice';
const CTA_COPY = 'Request early access';

export function Hero() {
  const h = HEADLINES[HEADLINE_VARIANT];

  return (
    <section id="top" className="hero">
      <div className="wrap">
        <Reveal>
          <span className="kicker">
            <span className="dot" />
            Tranched yield protocol &nbsp;·&nbsp; Built on Mantle
          </span>
        </Reveal>

        <div className="hero-grid">
          <div>
            <Reveal delay={60}>
              <h1 className="headline">
                {h.plain} <em>{h.em}</em>
              </h1>
            </Reveal>
            <Reveal delay={140}>
              <p className="sub">
                Strata splits a basket of real-world and on-chain yield into three risk tiers.
                Pick the one that fits, <strong>senior, mezzanine, or junior</strong>, and
                see every move the protocol makes on-chain.
              </p>
            </Reveal>
            <Reveal delay={220}>
              <div className="hero-cta">
                <a href="#access" className="btn-cta">
                  {CTA_COPY}
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                    <path d="M2 7h10M8 3l4 4-4 4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </a>
                <span className="cta-meta">
                  <span className="live">●</span>&nbsp; Live on Mantle Sepolia
                </span>
              </div>
            </Reveal>
          </div>

          <Reveal delay={120}>
            <div className="mark-stage">
              <Mark />
            </div>
          </Reveal>
        </div>
      </div>

      <Ticker />
    </section>
  );
}
