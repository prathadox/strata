// content.ts - single source of truth for all copy on the Strata landing page.
// Edit this file to update copy without touching component code.

export const HEADLINES = {
  slice:   { plain: "Choose your slice of",  em: "on-chain yield." },
  layers:  { plain: "Real-world yield,",     em: "in three layers." },
  agents:  { plain: "Yield, structured by",  em: "autonomous agents." },
} as const;

export type HeadlineVariant = keyof typeof HEADLINES;

export interface Tick {
  who: string;
  what: string;
  h: string;
}

export const TICKS: Tick[] = [
  { who: "Scout",      what: "published Yield Map v412",                           h: "0x9a2c…f08e" },
  { who: "Architect",  what: "proposed senior rebalance +0.4% USDY",               h: "0x4d11…ab30" },
  { who: "Sentinel",   what: "verdict: CLEAR · duration drift within budget", h: "0x71f8…0c19" },
  { who: "Operator",   what: "opened -$50K MNT short on Byreal Perps",             h: "0xc302…7e12" },
  { who: "Compliance", what: "issued Receipt #2,184 · EU-MiCA · mezz",  h: "0xee04…b9a1" },
  { who: "Sentinel",   what: "flagged 12 bps drift in senior basket",              h: "0x18bd…2f44" },
  { who: "Scout",      what: "added sUSDe v2 to map · score 0.81",            h: "0xa9f0…dd23" },
  { who: "Architect",  what: "executed junior allocation: mETH 22% / CIAN 38%",   h: "0x5b62…74c8" },
];

export interface Tranche {
  cls: string;
  rank: string;
  tier: "senior" | "mezz" | "junior";
  name: string;
  role: string;
  apy: string;
  apyUnit: string;
  desc: string;
  backing: string[];
}

export const TRANCHES: Tranche[] = [
  {
    cls: "senior",
    rank: "01 / Senior",
    tier: "senior",
    name: "Senior",
    role: "First on yield · last on loss",
    apy: "5.4",
    apyUnit: "% target APY",
    desc: "Steady real-world yield. Paid first, drawn down last.",
    backing: ["Ondo USDY", "Ethena sUSDe"],
  },
  {
    cls: "mezz",
    rank: "02 / Mezzanine",
    tier: "mezz",
    name: "Mezzanine",
    role: "Second claim · balanced",
    apy: "9.2",
    apyUnit: "% target APY",
    desc: "Staked ETH and curated Mantle strategies, sized to a fixed risk budget.",
    backing: ["mETH · Mantle Vault", "CIAN strategies"],
  },
  {
    cls: "junior",
    rank: "03 / Junior",
    tier: "junior",
    name: "Junior",
    role: "Residual upside · first loss",
    apy: "18+",
    apyUnit: "% target APY",
    desc: "Leveraged positions, LP rewards, and a labeled CMO sleeve. Highest yield, first to absorb loss.",
    backing: ["Leveraged + LP", "CMO sleeve"],
  },
];

export interface Agent {
  n: string;
  name: string;
  role: string;
  desc: string;
  outB: string;
}

export const AGENTS: Agent[] = [
  {
    n: "01",
    name: "Scout",
    role: "Yield sourcing",
    desc: "Tracks yield-bearing positions across Mantle and publishes a ranked Yield Map to IPFS.",
    outB: "Yield Map",
  },
  {
    n: "02",
    name: "Architect",
    role: "Portfolio",
    desc: "Reads the Yield Map and proposes allocations for each tranche. Cannot execute without a risk verdict.",
    outB: "Allocation",
  },
  {
    n: "03",
    name: "Sentinel",
    role: "Risk",
    desc: "Independent risk desk. Runs duration, depeg, contract, and correlation models. Gates every execution.",
    outB: "Risk verdict",
  },
  {
    n: "04",
    name: "Operator",
    role: "Hedging",
    desc: "Acts on hedge signals through Byreal Perps. Every fill carries a pointer back to the signal that triggered it.",
    outB: "Hedge fill",
  },
  {
    n: "05",
    name: "Compliance",
    role: "Policy",
    desc: "Verifies credentials at deposit and publishes reusable Jurisdiction Policy NFTs other protocols can subscribe to.",
    outB: "Receipt + Policy",
  },
];

export interface EcoCard {
  title: string;
  role: string;
  items: string[];
}

export const ECO: EcoCard[] = [
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

export interface LedgerRow {
  t: string;
  who: string;
  what: string;
  h: string;
}

export const LEDGER_ROWS: LedgerRow[] = [
  { t: "12:04:11", who: "Scout",      what: "publish · map v412",         h: "0x9a2c…f08e" },
  { t: "12:04:09", who: "Architect",  what: "propose · senior +0.4%",     h: "0x4d11…ab30" },
  { t: "12:04:06", who: "Sentinel",   what: "verdict · clear",            h: "0x71f8…0c19" },
  { t: "12:04:02", who: "Operator",   what: "open · -$50K MNT perp",      h: "0xc302…7e12" },
  { t: "12:03:58", who: "Compliance", what: "receipt · EU-MiCA · mezz", h: "0xee04…b9a1" },
  { t: "12:03:51", who: "Sentinel",   what: "hedge · mETH concentration", h: "0x18bd…2f44" },
];
