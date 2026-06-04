'use client';

import { relTime, type AgentEvent } from '@/lib/appData';
import { AGENTS, CORE, VAULTS, ADAPTERS, agentByKey, explorer, lighthouseGateway } from '@/lib/onchain';
import { REAL_EVENT_CIDS } from '@/lib/realEvents';
import { useTVL } from '@/hooks/useTVL';
import type { Route } from './shellTypes';

interface DashboardProps {
  events: AgentEvent[];
  statuses: Record<string, { status: 'working' | 'idle'; doing: string }>;
  onNav: (r: Route, tier?: string) => void;
}

function fmtUsd(n: number, dp: number = 2): string {
  return '$' + n.toLocaleString('en-US', { minimumFractionDigits: dp, maximumFractionDigits: dp });
}

function FeedRow({ evt }: { evt: AgentEvent }) {
  const a = agentByKey(evt.agentKey);
  const cid = REAL_EVENT_CIDS[evt.id];
  return (
    <div className="feed-row">
      <div className="feed-ic" style={{ color: `var(${a?.color})` }}>{a?.glyph}</div>
      <div className="feed-main">
        <div className="ln1">
          <span className="who">{a?.role ?? evt.agentKey}</span>
          <span className="verb">{evt.verb}</span>
          <span>{evt.obj}</span>
          {evt.verdict && <span className={`verdict ${evt.verdict}`}>{evt.verdict}</span>}
        </div>
        <div className="ln2">
          {evt.detail && <span>{evt.detail}</span>}
          {evt.detail && <span className="a-muted">·</span>}
          <a className="hash" href={explorer.tx(evt.hash)} target="_blank" rel="noreferrer">{evt.hash.slice(0, 10)}…{evt.hash.slice(-6)}</a>
          {cid && (
            <>
              <span className="a-muted">·</span>
              <a className="hash" href={lighthouseGateway(cid)} target="_blank" rel="noreferrer">doc</a>
            </>
          )}
        </div>
      </div>
      <div className="feed-time">{relTime(evt.ts)}</div>
    </div>
  );
}

export function Dashboard({ events, statuses, onNav }: DashboardProps) {
  const tvl = useTVL();
  const totalContracts = CORE.length + VAULTS.length + ADAPTERS.length;
  const navTotal = tvl.senior + tvl.mezz + tvl.junior;
  const allocPctSenior = navTotal > 0 ? (tvl.senior / navTotal) * 100 : 33.34;
  const allocPctMezz = navTotal > 0 ? (tvl.mezz / navTotal) * 100 : 33.33;
  const allocPctJunior = navTotal > 0 ? (tvl.junior / navTotal) * 100 : 33.33;

  return (
    <div className="app-content" style={{ height: 'calc(100vh - 68px)', overflow: 'hidden', display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div className="a-grid a-cols-3" style={{ flex: '0 0 auto' }}>
        <div className="a-card a-stat">
          <span className="k">Total TVL · on-chain</span>
          <span className="v tnum">{tvl.loading ? '—' : fmtUsd(tvl.total, 2)}</span>
          <span className="delta up" style={{ color: 'var(--paper-mute)' }}>
            live via {VAULTS.length} ERC-4626 vaults
          </span>
        </div>
        <div className="a-card a-stat">
          <span className="k">Active agents</span>
          <span className="v tnum">{AGENTS.length}</span>
          <span className="delta up" style={{ color: 'var(--paper-mute)' }}>
            ERC-8004 #101–#{AGENTS.length + 100} · all verified
          </span>
        </div>
        <div className="a-card a-stat">
          <span className="k">Contracts deployed</span>
          <span className="v tnum">{totalContracts}</span>
          <span className="delta up" style={{ color: 'var(--paper-mute)' }}>
            bus · controller · registry · 3 vaults · 6 adapters
          </span>
        </div>
      </div>

      <div className="a-card a-card-pad" style={{ flex: '0 0 auto', marginTop: 0, paddingTop: 14, paddingBottom: 14 }}>
        <div className="a-row-between" style={{ marginBottom: 10 }}>
          <span className="a-eyebrow">Per-tranche TVL · live read</span>
          <span className="a-hint mono">
            {tvl.loading ? 'reading…' : tvl.error ? 'rpc error' : `${fmtUsd(navTotal, 2)} across 3 tranches`}
          </span>
        </div>
        <div className="alloc">
          <span style={{ width: `${allocPctSenior}%`, background: 'var(--senior)' }} />
          <span style={{ width: `${allocPctMezz}%`, background: 'var(--mezz)' }} />
          <span style={{ width: `${allocPctJunior}%`, background: 'var(--junior)' }} />
        </div>
        <div className="a-flex a-gap-14 a-mt-14" style={{ flexWrap: 'wrap' }}>
          {VAULTS.map((v, i) => {
            const amt = i === 0 ? tvl.senior : i === 1 ? tvl.mezz : tvl.junior;
            const cssVar = i === 0 ? '--senior' : i === 1 ? '--mezz' : '--junior';
            return (
              <a key={v.address} href={explorer.address(v.address)} target="_blank" rel="noreferrer" className="a-flex a-gap-6" style={{ fontSize: 12, color: 'inherit' }}>
                <span className="tier-dot" style={{ background: `var(${cssVar})` }} />
                <span className="a-dim">{v.short}</span>
                <span className="mono tnum">{tvl.loading ? '—' : fmtUsd(amt, 2)}</span>
              </a>
            );
          })}
          {tvl.controllerIdle > 0 && (
            <span className="a-flex a-gap-6" style={{ fontSize: 12 }}>
              <span className="tier-dot" style={{ background: 'var(--paper-mute)' }} />
              <span className="a-dim">Controller idle</span>
              <span className="mono tnum">{fmtUsd(tvl.controllerIdle, 2)}</span>
            </span>
          )}
        </div>
      </div>

      <div className="dash-split" style={{ flex: '1 1 auto', minHeight: 0, marginTop: 0 }}>
        <div className="a-card a-card-pad" style={{ display: 'flex', flexDirection: 'column', minHeight: 0, height: '100%', overflow: 'hidden' }}>
          <div className="a-row-between" style={{ marginBottom: 14 }}>
            <h2 style={{ margin: 0, fontSize: 14.5, fontWeight: 500 }}>What the agents are doing</h2>
            <span className="a-eyebrow">Live · 5 identities</span>
          </div>
          <div className="agentstat" style={{ overflowY: 'auto', flex: 1, gridTemplateColumns: 'repeat(2, 1fr)' }}>
            {AGENTS.map((a) => {
              const s = statuses[a.key] ?? { status: a.status, doing: a.doing };
              return (
                <div className="as-card" key={a.key}>
                  <div className="as-top">
                    <span className="as-glyph" style={{ color: `var(${a.color})` }}>{a.glyph}</span>
                    <span className="a-flex-col">
                      <span className="nm">{a.role}</span>
                      <span className="rl">{a.shortRole}</span>
                    </span>
                  </div>
                  <div className="doing">{s.doing}</div>
                  <div className={`as-status ${s.status}`}>
                    <span className="sdot" />
                    {s.status === 'working' ? 'Working' : 'Idle'}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        <div className="a-card" style={{ display: 'flex', flexDirection: 'column', minHeight: 0, height: '100%', overflow: 'hidden' }}>
          <div className="a-card-head" style={{ flex: '0 0 auto' }}>
            <div className="a-flex a-gap-10">
              <h2>Live agent activity</h2>
              <span className="chip" style={{ padding: '4px 9px' }}><span className="gdot" /> live</span>
            </div>
            <button className="btn-app btn-ghost btn-sm" onClick={() => onNav('activity')}>View all</button>
          </div>
          <div className="feed" style={{ flex: '1 1 auto', minHeight: 0, overflowY: 'auto' }}>
            {events.length === 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', textAlign: 'center', padding: 16 }}>
                <div style={{ fontSize: 13, color: 'var(--paper-mute)' }}>No on-chain events yet.</div>
                <div className="a-muted" style={{ fontSize: 12, marginTop: 6, maxWidth: 320 }}>
                  Agents publish to AgentEventBus on their daily cycle. Hashes + IPFS CIDs land here as they emit.
                </div>
              </div>
            ) : (
              events.slice(0, 9).map((e) => <FeedRow key={e.id} evt={e} />)
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
