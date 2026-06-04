import { Reveal } from './Reveal';

export function Close() {
  return (
    <section id="access" className="close">
      <div className="inner wrap">
        <Reveal>
          <h2>Yield, structured the way it should be.</h2>
        </Reveal>
        <Reveal delay={80}>
          <p>
            Strata is live on Mantle mainnet. Onboard into any of the three tranches and
            receive your soulbound Compliance Receipt.
          </p>
        </Reveal>
        <Reveal delay={160}>
          <div className="close-cta">
            <a href="/app" className="btn-cta">
              Launch app
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                <path d="M2 7h10M8 3l4 4-4 4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </a>
            <a href="/deposit" className="btn-cta btn-cta-ghost">
              Deposit USDC
            </a>
          </div>
        </Reveal>
        <Reveal delay={240}>
          <p className="close-meta">
            Capped launch · $1,000 per adapter · all addresses verifiable on MantleScan
          </p>
        </Reveal>
      </div>
    </section>
  );
}
