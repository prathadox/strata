import { MarkMini } from './Mark';

export function Footer() {
  return (
    <footer className="footer">
      <div className="wrap footer-inner">
        <div className="meta">
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
            <MarkMini />
            <b style={{ letterSpacing: '.14em', textTransform: 'uppercase' }}>STRATA</b>
          </div>
          Tranched RWA yield · Built on Mantle<br />
          © 2026, not investment advice. Read the strategy documents.
        </div>
        <nav className="footer-links" aria-label="Footer">
          <a href="#">GitHub</a>
          <a href="#">X</a>
          <a href="#">Farcaster</a>
          <a href="#">Docs</a>
        </nav>
      </div>
    </footer>
  );
}
