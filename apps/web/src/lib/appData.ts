// Mock portfolio + activity data for the /app dashboard. Numbers are stand-ins for the future
// API/chain reads. The five real agent identities + the deployed contract addresses live in
// `onchain.ts` and are the source of truth where on-chain data is needed.

export interface Tier {
  key: 'senior' | 'mezz' | 'junior';
  name: string;
  role: string;
  apy: number;
  cssVar: string;
  note: string;
  poolTvl: number;
  capacity: number;
  staked: number;
  value: number;
  yieldEarned: number;
  backing: string[];
}

export const TIERS: Tier[] = [
  {
    key: 'senior', name: 'Senior', role: 'First on yield · last on loss',
    apy: 5.4, cssVar: '--senior',
    note: 'Steady real-world yield. Paid first, drawn down last.',
    poolTvl: 8_420_000, capacity: 12_000_000,
    staked: 25_000, value: 25_412.88, yieldEarned: 412.88,
    backing: ['Aave V3 USDC', 'Ondo USDY']
  },
  {
    key: 'mezz', name: 'Mezzanine', role: 'Second claim · balanced',
    apy: 9.2, cssVar: '--mezz',
    note: 'Aave + Agni LP + FX-labeled mETH on a fixed risk budget.',
    poolTvl: 5_110_000, capacity: 8_000_000,
    staked: 12_000, value: 12_734.10, yieldEarned: 734.10,
    backing: ['Aave V3 USDC', 'Agni USDC/USDe LP', 'mETH']
  },
  {
    key: 'junior', name: 'Junior', role: 'Residual upside · first loss',
    apy: 18.0, cssVar: '--junior',
    note: 'Ethena sUSDe + perp-basis escrow. First to absorb loss, residual upside.',
    poolTvl: 2_640_000, capacity: 4_000_000,
    staked: 5_000, value: 5_488.42, yieldEarned: 488.42,
    backing: ['Ethena sUSDe', 'Perp basis escrow']
  }
];

export const fmtUSD = (n: number, dp = 2) =>
  '$' + n.toLocaleString('en-US', { minimumFractionDigits: dp, maximumFractionDigits: dp });
export const fmtNum = (n: number, dp = 2) =>
  n.toLocaleString('en-US', { minimumFractionDigits: dp, maximumFractionDigits: dp });
export const fmtCompact = (n: number) =>
  '$' + Intl.NumberFormat('en-US', { notation: 'compact', maximumFractionDigits: 2 }).format(n);

export function relTime(ts: number): string {
  const s = Math.floor((Date.now() - ts) / 1000);
  if (s < 5) return 'just now';
  if (s < 60) return s + 's ago';
  const m = Math.floor(s / 60);
  if (m < 60) return m + 'm ago';
  return Math.floor(m / 60) + 'h ago';
}

export function clockTime(ts: number): string {
  return new Date(ts).toLocaleTimeString('en-US', { hour12: false });
}

export type AgentKey = 'scout' | 'architect' | 'sentinel' | 'operator' | 'compliance';

export interface AgentEvent {
  id: number;
  agentKey: AgentKey;
  verb: string;
  obj: string;
  detail?: string;
  kind: 'publish' | 'propose' | 'verdict' | 'flag' | 'exec' | 'receipt';
  verdict?: 'clear' | 'flag' | 'exec';
  hash: string;
  ts: number;
  doing: string;
}

export interface EventTemplate {
  agent: AgentKey;
  verb: string;
  obj: string;
  detail?: string;
  kind: AgentEvent['kind'];
  verdict?: AgentEvent['verdict'];
  doing: string;
}

let evtSeq = 5000;
function nextHash(): string {
  const hex = '0123456789abcdef';
  let h = '0x';
  for (let i = 0; i < 4; i++) h += hex[Math.floor(Math.random() * 16)];
  h += '…';
  for (let i = 0; i < 4; i++) h += hex[Math.floor(Math.random() * 16)];
  return h;
}

export const EVENT_TEMPLATES: EventTemplate[] = [
  { agent: 'scout',      verb: 'published',  obj: 'Yield Map v{n}',         detail: 'ranked {k} positions', kind: 'publish', doing: 'Publishing updated Yield Map' },
  { agent: 'scout',      verb: 'added',      obj: 'sUSDe v2 to map',        detail: 'score 0.81',           kind: 'publish', doing: 'Scoring new yield source' },
  { agent: 'architect',  verb: 'proposed',   obj: 'senior rebalance',       detail: '+0.4% USDY',           kind: 'propose', doing: 'Drafting allocation proposal' },
  { agent: 'architect',  verb: 'executed',   obj: 'junior allocation',      detail: 'sUSDe 22% · LP 38%',   kind: 'exec',    doing: 'Executing approved allocation' },
  { agent: 'sentinel',   verb: 'cleared',    obj: 'duration check',         detail: 'within budget',        kind: 'verdict', verdict: 'clear', doing: 'Validating risk budget' },
  { agent: 'sentinel',   verb: 'flagged',    obj: 'mETH concentration',     detail: '12 bps drift',         kind: 'flag',    verdict: 'flag',  doing: 'Investigating concentration drift' },
  { agent: 'operator',   verb: 'opened',     obj: '-$50K MNT perp',         detail: 'Byreal Perps',         kind: 'exec',    verdict: 'exec',  doing: 'Filling hedge on Byreal Perps' },
  { agent: 'operator',   verb: 'closed',     obj: 'ETH basis hedge',        detail: '+$1.2K pnl',           kind: 'exec',    doing: 'Settling hedge position' },
  { agent: 'compliance', verb: 'issued',     obj: 'Receipt #{r}',           detail: 'EU-MiCA · mezz',       kind: 'receipt', doing: 'Issuing compliance receipt' },
  { agent: 'scout',      verb: 'refreshed',  obj: 'Aave V3 USDC APY',       detail: '3.18% → 3.42%',        kind: 'publish', doing: 'Refreshing live APYs' }
];

export function makeEvent(tpl: EventTemplate): AgentEvent {
  const n = ++evtSeq;
  const obj = tpl.obj.replace('{n}', String(n - 4588)).replace('{r}', String(2180 + (n % 40)));
  const detail = (tpl.detail || '').replace('{k}', String(30 + (n % 12)));
  const evt: AgentEvent = {
    id: n,
    agentKey: tpl.agent,
    verb: tpl.verb,
    obj,
    detail,
    kind: tpl.kind,
    hash: nextHash(),
    ts: Date.now(),
    doing: tpl.doing
  };
  if (tpl.verdict) evt.verdict = tpl.verdict;
  return evt;
}

export function seedEvents(): AgentEvent[] {
  const seeds = [3, 5, 6, 2, 8, 0, 4, 9].map((i) => EVENT_TEMPLATES[i]);
  const now = Date.now();
  return seeds.map((tpl, i) => {
    const e = makeEvent(tpl);
    e.ts = now - (i + 1) * 47000;
    return e;
  });
}
