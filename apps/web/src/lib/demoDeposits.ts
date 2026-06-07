// Demo-mode deposit ledger persisted in localStorage. Lets the deposit form act
// as if it were calling the real ERC-4626 vault without needing USDC on chain.
// Read by DepositGate (to show simulated shares) and by app/page.tsx (to splice
// synthetic AgentEvent rows into the activity feed).

import type { AgentEvent } from './appData';

export type TrancheKey = 'senior' | 'mezz' | 'junior';

export interface DemoDeposit {
  id: number;          // unix ms, also the AgentEvent id
  tranche: TrancheKey;
  amountUsdc: string;  // human string, e.g. "10.5"
  txHash: `0x${string}`;
}

const KEY = 'strata:demo-deposits';
const TRANCHE_LABEL: Record<TrancheKey, string> = {
  senior: 'Senior',
  mezz:   'Mezzanine',
  junior: 'Junior'
};

export function isDemoDepositsEnabled(): boolean {
  if (typeof process === 'undefined') return false;
  return process.env.NEXT_PUBLIC_DEMO_DEPOSITS === '1';
}

export function readDemoDeposits(): DemoDeposit[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function appendDemoDeposit(d: Omit<DemoDeposit, 'id' | 'txHash'>): DemoDeposit {
  const id = Date.now();
  const txHash = ('0x' + id.toString(16).padStart(8, '0').repeat(8).slice(0, 64)) as `0x${string}`;
  const entry: DemoDeposit = { id, txHash, ...d };
  const current = readDemoDeposits();
  current.push(entry);
  window.localStorage.setItem(KEY, JSON.stringify(current));
  window.dispatchEvent(new CustomEvent('strata:demo-deposit'));
  return entry;
}

export function totalByTranche(): Record<TrancheKey, number> {
  const out: Record<TrancheKey, number> = { senior: 0, mezz: 0, junior: 0 };
  for (const d of readDemoDeposits()) {
    const n = Number(d.amountUsdc);
    if (Number.isFinite(n)) out[d.tranche] += n;
  }
  return out;
}

export function demoDepositsToEvents(): AgentEvent[] {
  return readDemoDeposits().map((d) => ({
    id: d.id,
    agentKey: 'compliance',
    verb: 'deposited',
    obj: `${d.amountUsdc} USDC -> ${TRANCHE_LABEL[d.tranche]}`,
    detail: 'demo-mode simulated deposit',
    kind: 'receipt' as const,
    hash: d.txHash,
    ts: d.id,
    doing: 'Simulated deposit recorded (no on-chain tx)'
  }));
}
