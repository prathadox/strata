import { MarkMini } from './Mark';

const CTA_COPY = 'Request early access';

export function Nav() {
  return (
    <header className="nav">
      <div className="wrap nav-inner">
        <a href="#top" className="brand" aria-label="Strata, home">
          <MarkMini />
          <span className="brand-word"><b>STRATA</b></span>
        </a>
        <nav className="nav-links" aria-label="Primary">
          <a href="#tranches">Tranches</a>
          <a href="#agents">Agents</a>
          <a href="#verify">Verifiability</a>
          <a href="#ecosystem">Ecosystem</a>
        </nav>
        <div className="nav-right">
          <div className="stats-pill" aria-label="Protocol stats">
            <span className="sp-item">
              <span className="sp-k">TVL</span>
              <span className="sp-v">$0</span>
            </span>
            <span className="sp-divider" />
            <span className="sp-item">
              <span className="sp-k">Status</span>
              <span className="sp-v sp-v-live">Testnet</span>
            </span>
          </div>
          <a href="#access" className="btn-ghost">
            {CTA_COPY}
            <svg className="arrow" width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
              <path d="M2 6h8M7 3l3 3-3 3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </a>
        </div>
      </div>
    </header>
  );
}
