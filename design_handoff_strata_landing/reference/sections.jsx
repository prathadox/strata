// sections.jsx — page sections for the Strata landing.

const { useEffect, useRef, useState } = React;

// ─────────── Reveal-on-scroll wrapper ───────────
function Reveal({ children, delay = 0, as: Tag = "div", ...rest }) {
  const ref = useRef(null);
  const [seen, setSeen] = useState(false);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    // If the element is already in view on mount, reveal immediately —
    // IntersectionObserver does NOT fire for already-intersecting elements
    // in all browsers/timing scenarios, so this guards against a blank hero.
    const r = el.getBoundingClientRect();
    if (r.top < window.innerHeight && r.bottom > 0) {
      setSeen(true);
      return;
    }
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { setSeen(true); io.disconnect(); }
    }, { threshold: 0.12 });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <Tag ref={ref} className={`reveal ${seen ? "in" : ""}`}
      style={{ transitionDelay: `${delay}ms`, ...(rest.style || {}) }} {...rest}>
      {children}
    </Tag>
  );
}

// ─────────── Nav ───────────
function Nav({ ctaCopy }) {
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
            <span className="sp-item"><span className="sp-k">TVL</span><span className="sp-v">$0</span></span>
            <span className="sp-divider" />
            <span className="sp-item"><span className="sp-k">Status</span><span className="sp-v sp-v-live">Testnet</span></span>
          </div>
          <a href="#access" className="btn-ghost">
            {ctaCopy}
            <svg className="arrow" width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path d="M2 6h8M7 3l3 3-3 3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </a>
        </div>
      </div>
    </header>
  );
}

// ─────────── Hero ───────────
const HEADLINES = {
  slice:   { plain: "Choose your slice of",      em: "on-chain yield." },
  layers:  { plain: "Real-world yield,",         em: "in three layers." },
  agents:  { plain: "Yield, structured by",      em: "autonomous agents." }
};

function Hero({ headlineVariant, ctaCopy, showTicker }) {
  const h = HEADLINES[headlineVariant] || HEADLINES.slice;
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
                Pick the one that fits — <strong>senior, mezzanine, or junior</strong> — and
                see every move the protocol makes on-chain.
              </p>
            </Reveal>
            <Reveal delay={220}>
              <div className="hero-cta">
                <a href="#access" className="btn-cta">
                  {ctaCopy}
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
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

      {showTicker && <Ticker />}
    </section>
  );
}

// ─────────── Ticker (live agent feed) ───────────
const TICKS = [
  { who: "Scout",     what: "published Yield Map v412",                            h: "0x9a2c…f08e" },
  { who: "Architect", what: "proposed senior rebalance +0.4% USDY",                h: "0x4d11…ab30" },
  { who: "Sentinel",  what: "verdict: CLEAR · duration drift within budget",       h: "0x71f8…0c19" },
  { who: "Operator",  what: "opened −$50K MNT short on Byreal Perps",              h: "0xc302…7e12" },
  { who: "Compliance",what: "issued Receipt #2,184 · EU-MiCA · mezz",              h: "0xee04…b9a1" },
  { who: "Sentinel",  what: "flagged 12 bps drift in senior basket",               h: "0x18bd…2f44" },
  { who: "Scout",     what: "added sUSDe v2 to map · score 0.81",                  h: "0xa9f0…dd23" },
  { who: "Architect", what: "executed junior allocation: mETH 22% / CIAN 38%",     h: "0x5b62…74c8" },
];

function Ticker() {
  const items = [...TICKS, ...TICKS]; // duplicate for seamless loop
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

// ─────────── Tranches ───────────
const TRANCHES = [
  {
    cls: "senior", rank: "01 / Senior", tier: "senior",
    name: "Senior", role: "First on yield · last on loss",
    apy: "5.4", apyUnit: "% target APY",
    desc: "Steady real-world yield. Paid first, drawn down last.",
    backing: ["Ondo USDY", "Ethena sUSDe"],
  },
  {
    cls: "mezz", rank: "02 / Mezzanine", tier: "mezz",
    name: "Mezzanine", role: "Second claim · balanced",
    apy: "9.2", apyUnit: "% target APY",
    desc: "Staked ETH and curated Mantle strategies, sized to a fixed risk budget.",
    backing: ["mETH · Mantle Vault", "CIAN strategies"],
  },
  {
    cls: "junior", rank: "03 / Junior", tier: "junior",
    name: "Junior", role: "Residual upside · first loss",
    apy: "18+", apyUnit: "% target APY",
    desc: "Leveraged positions, LP rewards, and a labeled CMO sleeve. Highest yield, first to absorb loss.",
    backing: ["Leveraged + LP", "CMO sleeve"],
  },
];

function Tranches() {
  return (
    <section id="tranches" className="section">
      <div className="wrap">
        <Reveal>
          <div className="section-head">
            <div>
              <p className="section-eyebrow">01 — Tranches</p>
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
                  {t.backing.map((b, j) => <span className="b" key={j}>{b}</span>)}
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─────────── Agents ───────────
const AGENTS = [
  { n: "01", name: "Scout",      role: "Yield sourcing", desc: "Tracks yield-bearing positions across Mantle and publishes a ranked Yield Map to IPFS.",                                     outB: "Yield Map" },
  { n: "02", name: "Architect",  role: "Portfolio",      desc: "Reads the Yield Map and proposes allocations for each tranche. Cannot execute without a risk verdict.",                       outB: "Allocation" },
  { n: "03", name: "Sentinel",   role: "Risk",           desc: "Independent risk desk. Runs duration, depeg, contract, and correlation models. Gates every execution.",                       outB: "Risk verdict" },
  { n: "04", name: "Operator",   role: "Hedging",        desc: "Acts on hedge signals through Byreal Perps. Every fill carries a pointer back to the signal that triggered it.",              outB: "Hedge fill" },
  { n: "05", name: "Compliance", role: "Policy",         desc: "Verifies credentials at deposit and publishes reusable Jurisdiction Policy NFTs other protocols can subscribe to.",            outB: "Receipt + Policy" },
];

function Agents() {
  return (
    <section id="agents" className="section" style={{ paddingTop: "clamp(60px, 10vh, 100px)" }}>
      <div className="wrap">
        <Reveal>
          <div className="section-head">
            <div>
              <p className="section-eyebrow">02 — Agents</p>
              <h2 className="section-title">Five agents do the work an asset manager would.</h2>
            </div>
            <p className="section-lede">
              Each agent has an on-chain identity, a public strategy document,
              and a reputation that grows only through verified actions.
            </p>
          </div>
        </Reveal>

        <div className="agents">
          {AGENTS.map((a, i) => (
            <Reveal key={a.name} delay={i * 60}>
              <div className="agent">
                <span className="num">{a.n}</span>
                <div className="agent-name">
                  <h4>{a.name}</h4>
                  <span>{a.role}</span>
                </div>
                <p className="agent-desc">{a.desc}</p>
                <div className="agent-out">
                  On-chain output
                  <b>{a.outB}</b>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─────────── Verifiability ───────────
function Verify() {
  return (
    <section id="verify" className="section">
      <div className="wrap">
        <Reveal>
          <div className="section-head">
            <div>
              <p className="section-eyebrow">03 — Verifiability</p>
              <h2 className="section-title">Audit it like a smart contract.</h2>
            </div>
            <p className="section-lede">
              Every decision is preceded by a public strategy and followed by an on-chain event.
              The whole protocol is queryable, citable, and reusable.
            </p>
          </div>
        </Reveal>

        <div className="verify-grid">
          <div className="verify-points">
            <Reveal>
              <div className="verify-point">
                <span className="vp-num">01</span>
                <div>
                  <h5>Strategies, signed and versioned.</h5>
                  <p>Each agent publishes its strategy to IPFS, referenced from its identity NFT. Read what an agent intends before watching it act.</p>
                </div>
              </div>
            </Reveal>
            <Reveal delay={80}>
              <div className="verify-point">
                <span className="vp-num">02</span>
                <div>
                  <h5>Decisions with reasoning hashes.</h5>
                  <p>Every proposal, verdict, fill, and receipt is an on-chain event. Trace the full agent loop end-to-end from any line.</p>
                </div>
              </div>
            </Reveal>
            <Reveal delay={160}>
              <div className="verify-point">
                <span className="vp-num">03</span>
                <div>
                  <h5>Compliance as public infrastructure.</h5>
                  <p>Jurisdiction Policy NFTs and risk verdicts are reusable. Other Mantle protocols can subscribe to them directly.</p>
                </div>
              </div>
            </Reveal>
          </div>

          <Reveal delay={120}>
            <Ledger />
          </Reveal>
        </div>
      </div>
    </section>
  );
}

const LEDGER_ROWS = [
  { t: "12:04:11", who: "Scout",      what: "publish · map v412",          h: "0x9a2c…f08e" },
  { t: "12:04:09", who: "Architect",  what: "propose · senior +0.4%",      h: "0x4d11…ab30" },
  { t: "12:04:06", who: "Sentinel",   what: "verdict · clear",             h: "0x71f8…0c19" },
  { t: "12:04:02", who: "Operator",   what: "open · −$50K MNT perp",       h: "0xc302…7e12" },
  { t: "12:03:58", who: "Compliance", what: "receipt · EU-MiCA · mezz",    h: "0xee04…b9a1" },
  { t: "12:03:51", who: "Sentinel",   what: "hedge · mETH concentration",  h: "0x18bd…2f44" },
];

function Ledger() {
  return (
    <div className="ledger" role="region" aria-label="On-chain event stream sample">
      <div className="ledger-head">
        <span>Live event stream — sample</span>
        <span className="live"><span className="blip" /> chain · 5000</span>
      </div>
      {LEDGER_ROWS.map((r, i) => (
        <div className="ledger-row" key={i}>
          <span className="t">{r.t}</span>
          <span className="who">{r.who}</span>
          <span className="what">{r.what}</span>
          <span className="h">{r.h}</span>
        </div>
      ))}
    </div>
  );
}

// ─────────── Close CTA ───────────
function Close({ ctaCopy }) {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const submit = (e) => {
    e.preventDefault();
    if (!email.includes("@")) return;
    setSent(true);
  };
  return (
    <section id="access" className="close">
      <div className="inner wrap">
        <Reveal>
          <h2>Yield, structured the way it should be.</h2>
        </Reveal>
        <Reveal delay={80}>
          <p>
            Strata is launching on Mantle. Early access opens with onboarding for all three
            tiers and your first Compliance Receipt.
          </p>
        </Reveal>
        <Reveal delay={160}>
          {!sent ? (
            <form className="email-form" onSubmit={submit}>
              <input
                type="email"
                placeholder="you@wallet.xyz"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                aria-label="Email address"
                required
              />
              <button type="submit" className="btn-cta" style={{ padding: "10px 18px" }}>
                {ctaCopy}
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M2 7h10M8 3l4 4-4 4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </form>
          ) : (
            <p style={{ color: "var(--green)", fontFamily: "var(--mono)", fontSize: 13, letterSpacing: ".06em" }}>
              ✓ You're on the list.
            </p>
          )}
        </Reveal>
        <Reveal delay={240}>
          <p className="close-meta">
            v1 testnet · senior tranche US-restricted at launch
          </p>
        </Reveal>
      </div>
    </section>
  );
}

// ─────────── Footer ───────────
function Footer() {
  return (
    <footer className="footer">
      <div className="wrap footer-inner">
        <div className="meta">
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
            <MarkMini />
            <b style={{ letterSpacing: ".14em", textTransform: "uppercase" }}>STRATA</b>
          </div>
          Tranched RWA yield · Built on Mantle<br/>
          © 2026 — not investment advice. Read the strategy documents.
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

// ─────────── Ecosystem ───────────
const ECO = [
  {
    title: "Mantle",
    role: "Settlement layer",
    items: ["Sepolia testnet", "Mainnet at v1"],
  },
  {
    title: "Yield sources",
    role: "Backing assets",
    items: ["Ondo USDY", "Ethena sUSDe", "mETH · Mantle Vault", "CIAN strategies"],
  },
  {
    title: "Infrastructure",
    role: "Identity & risk",
    items: ["ERC-8004 identities", "IPFS strategies", "Byreal Perps · hedging"],
  },
];

function Ecosystem() {
  return (
    <section id="ecosystem" className="section section-eco">
      <div className="wrap">
        <Reveal>
          <div className="section-head">
            <div>
              <p className="section-eyebrow">04 — Ecosystem</p>
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

window.Nav = Nav;
window.Hero = Hero;
window.Tranches = Tranches;
window.Agents = Agents;
window.Verify = Verify;
window.Ecosystem = Ecosystem;
window.Close = Close;
window.Footer = Footer;
