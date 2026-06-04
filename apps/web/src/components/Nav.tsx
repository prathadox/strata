import { MarkMini } from './Mark';

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
          <span className="net-pill" aria-label="Network">
            <span className="net-dot" />
            Mantle Mainnet
          </span>
          <a href="/app" className="btn-primary">Launch App</a>
        </div>
      </div>
    </header>
  );
}
