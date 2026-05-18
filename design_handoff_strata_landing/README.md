# Handoff: Strata — Landing Page

> **TL;DR for Claude Code**
> Build a Next.js 14 (App Router) landing page that visually matches the prototype in `reference/`. The HTML/CSS/JSX files there are **design references, not production code** — recreate them in the project's existing or chosen framework, using its idioms. Treat the prototype as the source of truth for layout, typography, color, copy, and interaction.

---

## 1. Overview

**Strata** is a tranched yield protocol on Mantle. The product slices a basket of real-world and on-chain yield into three risk tiers — **Senior**, **Mezzanine**, **Junior** — and runs the asset-manager workflow with five autonomous agents (Scout, Architect, Sentinel, Operator, Compliance). Every decision is on-chain.

The landing page exists to:

1. Communicate the tranching concept clearly (one cashflow → three claims).
2. Build trust by showing on-chain verifiability isn't a buzzword — it's the substrate.
3. Funnel ideal customers (DeFi-native investors who understand risk tiers) to **one CTA: Request early access**.

The design language is pulled directly from the logo: obsidian pills, magenta edge-light, deep aubergine→black gradient, warm off-white type. Editorial-minimalist. No buzzwords.

## 2. About the design files

The files in `reference/` are an **HTML prototype**, not Next.js code:

| File | Role |
|---|---|
| `reference/index.html`     | Shell + font imports + tweak defaults |
| `reference/styles.css`     | All visual styling. Single source of truth for tokens. |
| `reference/mark.jsx`       | The three-pill logo mark, rendered in CSS. Also the small nav mark + the tranche glyph SVG. |
| `reference/sections.jsx`   | Page sections — Nav, Hero, Ticker, Tranches, Agents, Verify, Ledger, Ecosystem, Close, Footer. |
| `reference/app.jsx`        | Root composition + Tweaks panel wiring (REMOVE for production). |
| `reference/tweaks-panel.jsx` | Design-time tweak control (NOT for production). |

Things to **drop** when porting:
- `tweaks-panel.jsx` and everything in `app.jsx` that calls `useTweaks` / `<TweaksPanel>`. They're a design-time tool, not part of the product.
- The `EDITMODE-BEGIN / EDITMODE-END` JSON block in `index.html`.
- The `window.Component = Component` global exports at the bottom of each JSX file (use ES imports instead).
- The Reveal-stretching CSS workaround in `.tranche-grid > * { display: flex }` — if you implement Reveal cleanly as a real React component using `IntersectionObserver`, you can make it render `<Fragment>` semantics or just `display: contents`.

## 3. Fidelity

**High-fidelity.** Pixel-perfect. Match colors, spacing, typography, and interactions exactly. Use the prototype's CSS as the authoritative spec.

## 4. Target stack (suggested)

- **Next.js 14, App Router**
- **TypeScript**
- **CSS Modules** or **Tailwind** — either is fine; the prototype CSS maps cleanly to both. If using Tailwind, lift the design tokens (Section 8) into `tailwind.config.ts`. If using CSS Modules, keep `globals.css` for the `:root` token block + base styles, and write one `.module.css` per section component.
- **Geist** font via `next/font/google` (already used in prototype)
- Form submission stub → wire to whatever waitlist provider the project uses (Resend, Loops, Convex, etc.)

## 5. Information architecture

Single page, anchor-linked sections:

```
/  (single route)
├── <Nav>                   sticky, blurred backdrop
├── <Hero>                  #top
│   └── <Ticker>            live agent feed (animated marquee)
├── <Tranches>              #tranches    — 3 equal-height cards
├── <Agents>                #agents      — 5 row-list entries
├── <Verify>                #verify      — 3 points + live event ledger
├── <Ecosystem>             #ecosystem   — 3 equal-height cards
├── <Close>                 #access      — email form, single CTA
└── <Footer>
```

## 6. Screens

There is one screen. Each section breakdown:

### 6.1 Nav (sticky)

- Height: 18px vertical padding, sticky to top, backdrop-blur(14px) saturate(140%).
- Background: `linear-gradient(180deg, rgba(8,3,8,.72), rgba(8,3,8,.32))`, 1px bottom border `--line`.
- Layout: `flex justify-between` inside `.wrap` (max-width 1200px).
- Left: `<MarkMini />` (stacked tiny pills, 22×22) + word mark "STRATA" in 12px Geist 500, letter-spacing .14em, uppercase, muted color.
- Center: nav links — "Tranches", "Agents", "Verifiability", "Ecosystem". 13px Geist, color `--paper-dim`, hover → `--paper`. Gap 28px (20px tablet).
- Right: **Stats pill** (`TVL · $0` | `STATUS · Testnet [green dot]`) + **`.btn-ghost`** CTA "Request early access" with arrow icon.

Breakpoints:
- ≤1100px: stats pill hides.
- ≤820px:  nav-links font tightens to 12.5px / gap 20px.
- ≤720px:  nav-links + stats pill hide; only brand + compact ghost-CTA visible.

### 6.2 Hero

Layout: 2-column grid `1.05fr / 0.95fr`, gap clamp(32px, 6vw, 80px). Stacks to single column ≤880px.

**Left column:**
1. **Kicker pill** — small monospace label: "● Tranched yield protocol · Built on Mantle". `--kicker` style (mono, 11px, .14em tracking, uppercase). Pink dot with magenta halo.
2. **Headline** — Geist 500, `clamp(44px, 7.6vw, 84px)`, line-height 1.02, letter-spacing -0.035em.
   - Three editable variants in tweaks; default = "Choose your slice of *on-chain yield.*"
   - The italicised noun phrase is `<em>` styled with `color-mix(in srgb, --pink 80%, --paper 20%)` and non-italic, weight 500.
3. **Sub** — Geist 400, 17px, line-height 1.5, color `--paper-dim`, max-width 52ch.
   - Copy: "Strata splits a basket of real-world and on-chain yield into three risk tiers. Pick the one that fits — **senior, mezzanine, or junior** — and see every move the protocol makes on-chain."
4. **CTA row**:
   - `.btn-cta` primary: "Request early access" with arrow. Pink pill, dark text, glow shadow.
   - Meta: "● Live on Mantle Sepolia" (green dot, mono 11.5px).

**Right column: `<Mark />`** — the three-pill logo mark, recreated in CSS. See Section 7.

Below the hero, full-bleed: **`<Ticker>`**.

### 6.3 Ticker

A marquee of agent events. Border-top + border-bottom hairlines, subtle vertical magenta gradient inside.

Each tick: `[WHO chip] [event description] [hash] [◆ separator]`, gap 56px. Track animates `transform: translateX(0 → -50%)` over 60s linear infinite. Items are duplicated in markup for seamless loop.

Data sample (in `sections.jsx`, const `TICKS`):
- "Scout published Yield Map v412  0x9a2c…f08e"
- "Architect proposed senior rebalance +0.4% USDY  0x4d11…ab30"
- "Sentinel verdict: CLEAR · duration drift within budget  0x71f8…0c19"
- (+ 5 more — see file)

### 6.4 Tranches section (#tranches)

**Section head pattern** (used in every section):
- Two-column flex (1fr+lede). `align-items: end`. Eyebrow ("01 — Tranches", mono 11px) + section title (Geist 500, `clamp(32px, 4.6vw, 52px)`, max-width 20ch). Right column: lede (`--paper-dim`, max-width 42ch).
- Stacks vertically on mobile.

Title: "Three claims on the same cashflow."
Lede: "One pool of yield, sliced into three tiers. You choose the tier. Losses absorb from the bottom up; yield distributes from the top down."

**Tranche grid:** 3 equal columns, gap 16px, stacks ≤880px.

**Each card** is itself a CSS grid with 4 rows so all cards align horizontally:
```
grid-template-rows: auto auto 1fr auto
```
- **Row 1 — Head**: `<TrancheGlyph />` (left, 56×22 SVG) + rank label (right, mono 10.5px, ".14em", uppercase, e.g. "01 / Senior").
- **Row 2 — Title block**:
  - `h3` name — Geist 500, 22px, -0.018em.
  - Role line — mono 10.5px ".1em" uppercase muted (e.g. "First on yield · last on loss").
  - APY block — number (Geist 500, 48px, -0.035em) + unit ("% target APY", mono 10.5px ".1em" uppercase, baseline-aligned).
- **Row 3 — Description** (1fr): 14px Geist 400, line-height 1.55, `--paper-dim`, `min-height: calc(1.55em * 2)` so all cards reserve at least 2 lines.
- **Row 4 — Backing**: `1px solid --line` top border, padding-top 16px. Vertical list of mono 11px items, each with a 4px dot bullet.

**Data** (see `sections.jsx`, const `TRANCHES`):

| Tier | Rank | Role | APY | Description | Backing |
|---|---|---|---|---|---|
| Senior | 01 / Senior | First on yield · last on loss | 5.4 | Steady real-world yield. Paid first, drawn down last. | Ondo USDY, Ethena sUSDe |
| Mezzanine | 02 / Mezzanine | Second claim · balanced | 9.2 | Staked ETH and curated Mantle strategies, sized to a fixed risk budget. | mETH · Mantle Vault, CIAN strategies |
| Junior | 03 / Junior | Residual upside · first loss | 18+ | Leveraged positions, LP rewards, and a labeled CMO sleeve. Highest yield, first to absorb loss. | Leveraged + LP, CMO sleeve |

The `<TrancheGlyph tier="senior|mezz|junior" />` is three stacked pill rects in SVG. Senior fills only the first pill at full opacity (others 0.18); Mezz fills first two; Junior fills all three. Senior fill color is `--paper`; Mezz blends accent into paper (30%); Junior is pure accent.

**Equal-height note for Claude Code:** if you use `<motion.div>` or any wrapper around each card to do scroll-reveal, ensure the wrapper stretches in the grid. The prototype does:
```css
.tranche-grid > * { display: flex; }
.tranche-grid > * > .tranche { width: 100%; }
```

### 6.5 Agents section (#agents)

Title: "Five agents do the work an asset manager would."
Lede: "Each agent has an on-chain identity, a public strategy document, and a reputation that grows only through verified actions."

5 agent rows, separated by 1px borders. Each row:
```
grid-template-columns: 80px 1.1fr 2fr auto
```
- Col 1 (80px): number "01"–"05", mono 12px ".12em".
- Col 2: name (`h4` Geist 500 22px) + role label (mono 11px uppercase, e.g. "Yield sourcing").
- Col 3: description (15px Geist 400 line-height 1.55 `--paper-dim`, max-width 56ch).
- Col 4: "On-chain output" (mono 11px ".08em" uppercase) above bold artifact name (e.g. "Yield Map"). Right-aligned.

Mobile (≤720px): collapses to 2-col grid `40px 1fr`, description and on-chain output span full width below.

**Hover state:** row gets a left-to-transparent magenta gradient wash (`linear-gradient(90deg, rgba(255,61,134,.04), transparent 60%)`).

**Data** (5 agents):
1. **Scout** — Yield sourcing — "Tracks yield-bearing positions across Mantle and publishes a ranked Yield Map to IPFS." — output: Yield Map
2. **Architect** — Portfolio — "Reads the Yield Map and proposes allocations for each tranche. Cannot execute without a risk verdict." — output: Allocation
3. **Sentinel** — Risk — "Independent risk desk. Runs duration, depeg, contract, and correlation models. Gates every execution." — output: Risk verdict
4. **Operator** — Hedging — "Acts on hedge signals through Byreal Perps. Every fill carries a pointer back to the signal that triggered it." — output: Hedge fill
5. **Compliance** — Policy — "Verifies credentials at deposit and publishes reusable Jurisdiction Policy NFTs other protocols can subscribe to." — output: Receipt + Policy

### 6.6 Verifiability section (#verify)

Title: "Audit it like a smart contract."
Lede: "Every decision is preceded by a public strategy and followed by an on-chain event. The whole protocol is queryable, citable, and reusable."

**Two-column grid** (stacks at 880px):
- **Left**: 3 numbered points (01/02/03) separated by hairlines. Each: number (mono 11px) + `h5` (Geist 500 18px) + body (14.5px `--paper-dim`).
  1. "Strategies, signed and versioned." — Each agent publishes its strategy to IPFS, referenced from its identity NFT. Read what an agent intends before watching it act.
  2. "Decisions with reasoning hashes." — Every proposal, verdict, fill, and receipt is an on-chain event. Trace the full agent loop end-to-end from any line.
  3. "Compliance as public infrastructure." — Jurisdiction Policy NFTs and risk verdicts are reusable. Other Mantle protocols can subscribe to them directly.
- **Right**: `<Ledger />` — a card showing a sample event stream. Header: "Live event stream — sample" / "● chain · 5000" (animated blip). 6 rows, each `[time | who-with-dot | event | hash]`. Mono throughout. Pink dot before each `who`. Mobile drops the "who" column.

### 6.7 Ecosystem section (#ecosystem)

Title: "Built on what already works."
Lede: "Strata composes existing yield primitives, identity standards, and risk infrastructure into a single tranched product on Mantle."

3 equal-height cards in a grid, same hover lift as tranche cards:
- **Mantle** / Settlement layer / [Sepolia testnet, Mainnet at v1]
- **Yield sources** / Backing assets / [Ondo USDY, Ethena sUSDe, mETH · Mantle Vault, CIAN strategies]
- **Infrastructure** / Identity & risk / [ERC-8004 identities, IPFS strategies, Byreal Perps · hedging]

Each card: title (Geist 500 20px), role (mono 10.5px uppercase muted), 1px hairline divider, then a bulleted list (4px dot bullets, mono 12px).

### 6.8 Close CTA section (#access)

Centered. Soft pink radial bloom behind.
- Title: "Yield, structured the way it should be." (Geist 500, `clamp(42px, 6.4vw, 72px)`).
- Sub: "Strata is launching on Mantle. Early access opens with onboarding for all three tiers and your first Compliance Receipt." (17px `--paper-dim`, max-width 50ch).
- **Email form**: rounded-999px pill containing `<input type=email>` + `.btn-cta` "Request early access". On submit → check `email.includes('@')`, swap to green "✓ You're on the list." Mobile: stacks (input above button), each full width.
- Meta line below: "v1 testnet · senior tranche US-restricted at launch" (mono 11.5px muted).

### 6.9 Footer

Single row, `flex justify-between align-end`:
- Left: small mark + STRATA word, then 2 mono lines: "Tranched RWA yield · Built on Mantle" / "© 2026 — not investment advice. Read the strategy documents."
- Right: link row — GitHub, X, Farcaster, Docs (mono 11px ".12em" uppercase, hover → paper).
- Mobile: stacks vertically.

## 7. The brand mark (logo recreation)

The Strata logo is **three obsidian pills with magenta edge-light** on a deep aubergine→black background. We recreate it in CSS so it stays sharp at any size and the edge-light reflows when the accent color is tweaked. See `mark.jsx` and `.mark`/`.pill` in `styles.css`.

Each pill (`.pill`) is:
- `aspect-ratio: 4.2 / 1`, `border-radius: 999px`.
- Body fill: `radial-gradient(140% 240% at 50% 30%, #1e0c18, #0e060c 55%, #050207 100%)` — near-black obsidian, slightly lighter top-center.
- Layered `box-shadow` for the rim-light: tight inset shadows at left and right edges only, NOT a halo across the whole body. The bright magenta hugs the rim of the pill.
- `::before` adds a thin top specular highlight; `::after` adds a subtle bottom glint.
- Slight `rotateX(8deg)` for depth. On `.mark:hover` each pill shifts vertically a few px (-4, 0, +4) and reveals its label (Senior / Mezzanine / Junior).

The `<MarkMini>` is 3 stacked 4px-tall slivers for the nav. Same gradient + tight rim-light recipe at small scale.

## 8. Design tokens

```css
/* Colors */
--ink:         #0a0408   /* deepest black, near-aubergine */
--ink-1:       #110610   /* primary surface */
--ink-2:       #1a0915   /* raised surface */
--aubergine:   #2a0f22
--aubergine-2: #3a1230
--magenta:     #b8195a   /* deep edge-light */
--pink:        #ff3d86   /* hot accent / CTA — DEFAULT */
--pink-soft:   #ff5fa0
--paper:       #f4eaef   /* primary text */
--paper-dim:   #b9a0ad   /* secondary text */
--paper-mute:  #7a6573   /* tertiary / meta */
--line:        rgba(255, 200, 220, 0.08)
--line-2:      rgba(255, 200, 220, 0.14)
--green:       #6ee7b7   /* "verified" status accent */

/* Page background — composed */
background:
  radial-gradient(1200px 800px at 78% -10%, rgba(255, 61, 134, 0.18), transparent 60%),
  radial-gradient(900px 600px at 0% 100%, rgba(184, 25, 90, 0.14), transparent 60%),
  linear-gradient(180deg, #0d0509 0%, #07030a 60%, #050309 100%);

/* Type */
--sans:    "Geist", ui-sans-serif, system-ui, -apple-system, "Helvetica Neue", sans-serif;
--display: "Geist", ui-sans-serif, system-ui, -apple-system, "Helvetica Neue", sans-serif;
--mono:    "Geist Mono", ui-monospace, "SF Mono", Menlo, monospace;

/* Rhythm */
--maxw:    1200px;
--gut:     clamp(20px, 4vw, 48px);

/* Border radius scale */
8px   — small chips
16px  — cards (tranches, ecosystem, ledger)
18px  — slightly larger (forms)
999px — pills, buttons, mark
```

### Typography scale

| Use | Family | Size | Weight | Letter-spacing | Line-height |
|---|---|---|---|---|---|
| Hero headline | Geist | `clamp(44px, 7.6vw, 84px)` | 500 | -0.035em | 1.02 |
| Section title | Geist | `clamp(32px, 4.6vw, 52px)` | 500 | -0.028em | 1.04 |
| Close h2 | Geist | `clamp(42px, 6.4vw, 72px)` | 500 | -0.035em | 1.02 |
| Card h3 (tranche, eco) | Geist | 20–22px | 500 | -0.018em | 1.1 |
| Agent h4 | Geist | 22px | 500 | -0.02em | 1.1 |
| Verify h5 | Geist | 18px | 500 | -0.015em | 1.25 |
| Sub / lede | Geist | 17px (15.5 in sections) | 400 | normal | 1.5 |
| Body | Geist | 14–14.5px | 400 | normal | 1.55 |
| Meta (mono) | Geist Mono | 10.5–12px | 400 | 0.04–0.18em | 1.4 |
| Big number (APY) | Geist | 48px | 500 | -0.035em | 1 |

### Spacing rhythm

- Section vertical padding: `clamp(80px, 14vh, 140px)` desktop, 64px mobile
- Section head margin-bottom: 56px desktop, 36px mobile
- Card padding: 26px × 22px desktop, 22px × 18px mobile
- Grid gap between cards: 16px

## 9. Interactions

- **Reveal on scroll**: every block fades in from 14px down. 700ms ease-out. Implemented with `IntersectionObserver` (threshold 0.12). Already-onscreen elements reveal immediately on mount (don't wait for an intersection event).
- **Card hover**: 2px translate-Y up, border lifts from `--line` to `--line-2`, background brightens slightly.
- **Pill mark hover**: pills offset vertically (-4 / 0 / +4) and labels slide in from the right.
- **Buttons**: `.btn-cta` translates -1px on hover and intensifies its glow. `.btn-ghost` brightens border + bg.
- **Ticker**: continuous 60s linear infinite. Pause on `prefers-reduced-motion` (add this — the prototype doesn't yet).
- **Live blip**: 1.8s ease-in-out infinite opacity 1 → 0.4 → 1 (status pill, ledger header).

## 10. Responsive breakpoints

| Width | Changes |
|---|---|
| ≤ 1100px | Stats pill in nav hides |
| ≤ 980px  | Hero 2-col, verify 2-col still hold |
| 880px    | Hero, tranche grid, verify grid, eco grid → 1 column |
| 820px    | Nav links gap + font tighten |
| ≤ 720px  | Full mobile rules — see `@media (max-width: 720px)` block in `styles.css` |

## 11. State

- **Email form**: local component state (`email` string, `sent` boolean). On port: wire to the project's chosen waitlist provider.
- **Reveal**: each `<Reveal>` owns its own `seen` boolean via IntersectionObserver.
- **Tweaks** (REMOVE in production): the `useTweaks` hook in `app.jsx` is design-time only.

## 12. Copy reference (single source of truth)

Keep all copy in a single content module, e.g. `lib/content.ts`, so a non-engineer can edit it. The prototype already mostly factors this — see the `HEADLINES`, `TRANCHES`, `AGENTS`, `ECO`, `LEDGER_ROWS`, `TICKS` constants in `sections.jsx`.

## 13. Assets

- `assets/strata-logo.png` — original logo (reference only, **not used in production** — the mark is recreated in CSS).
- Favicon: same logo PNG (or generate a clean SVG version from the CSS mark).
- No other raster assets.

## 14. Acceptance checklist for Claude Code

- [ ] Next.js 14 App Router project, TypeScript
- [ ] Geist + Geist Mono via `next/font/google`
- [ ] All sections render and visually match the prototype at 1440 / 1200 / 768 / 414 / 375
- [ ] Three tranche cards equal-height with internal rows aligned across columns
- [ ] Three ecosystem cards same treatment
- [ ] Five-agent row list with 4-col grid that collapses gracefully on mobile
- [ ] Ledger column widths don't truncate event text
- [ ] Reveal-on-scroll on every block, with already-onscreen elements visible immediately
- [ ] Email form submits to waitlist provider (replace stub)
- [ ] Mobile nav hides links + stats below 720px; tablet keeps them
- [ ] No horizontal scrollbar at 375px
- [ ] `prefers-reduced-motion`: disable ticker and reveal transforms
- [ ] SEO: title, description, og-image (generate from CSS mark), favicon

## 15. Files in this bundle

```
design_handoff_strata_landing/
├── README.md                    ← this file
├── assets/
│   └── strata-logo.png
└── reference/
    ├── index.html
    ├── styles.css
    ├── app.jsx
    ├── sections.jsx
    ├── mark.jsx
    └── tweaks-panel.jsx         ← design-time only; drop in production
```
