'use client';

import { useState } from 'react';
import { AGENTS, explorer, lighthouseGateway } from '@/lib/onchain';
import { relTime, type AgentEvent } from '@/lib/appData';
import { CopyAddr } from './CopyAddr';

function short(addr: string): string {
  if (!addr) return '';
  return `${addr.slice(0, 6)}…${addr.slice(-4)}`;
}

function shortHash(h: string): string {
  if (h.length <= 12) return h;
  return `${h.slice(0, 6)}…${h.slice(-4)}`;
}

function eventsForAgent(agentKey: string, events: AgentEvent[]): AgentEvent[] {
  return events.filter((e) => e.agentKey === agentKey);
}

const AGENT_EMPTY_HINTS: Record<string, string> = {
  scout: 'Once Scout publishes a Yield Map, their tx + IPFS CID will appear here.',
  architect: 'Once Architect publishes a Tranche Plan, their tx + IPFS CID will appear here.',
  sentinel: 'Once Sentinel publishes a Risk Report, their tx + IPFS CID will appear here.',
  operator: 'Once Operator executes a Rebalance, their tx + IPFS CID will appear here.',
  compliance: 'Once Compliance posts a Policy Decision, their tx + IPFS CID will appear here.',
};

interface AgentsViewProps {
  events: AgentEvent[];
}

export function AgentsView({ events }: AgentsViewProps) {
  const [selectedKey, setSelectedKey] = useState<string>('scout');
  const agent = AGENTS.find((a) => a.key === selectedKey) ?? AGENTS[0];
  const txs = eventsForAgent(agent.key, events);

  return (
    <div className="app-content">
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, marginBottom: 14 }}>
        <span className="a-eyebrow">5 ERC-8004 identities · role-gated on AgentEventBus</span>
        <h2 style={{ margin: 0, fontSize: 18, fontWeight: 500 }}>Agent registry</h2>
      </div>

      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 18 }}>
        <div className="tabs">
          {AGENTS.map((a) => (
            <button
              key={a.key}
              type="button"
              className={`tab ${a.key === selectedKey ? 'active' : ''}`}
              onClick={() => setSelectedKey(a.key)}
            >
              {a.role}
            </button>
          ))}
        </div>
      </div>

      <div>
        <div className="agent-card" key={agent.key} style={{ minHeight: 540, width: '100%' }}>
          <div className="agent-card-head" style={{ minHeight: 88, height: 88, boxSizing: 'border-box' }}>
            <div className="agent-avatar" style={{ color: `var(${agent.color})` }}>{agent.glyph}</div>
            <div className="agent-id">
              <div className="nm">
                {agent.role}
                {agent.verified && (
                  <span className="verified-badge">
                    <svg width="11" height="11" viewBox="0 0 12 12" fill="none">
                      <path d="M6 1.5l3.2 1.1v2.2c0 1.9-1.4 3.2-3.2 3.8C4.2 8 2.8 6.7 2.8 4.8V2.6L6 1.5z" stroke="currentColor" strokeWidth="1" />
                      <path d="M4.6 5l1 1L7.6 4" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    Verified
                  </span>
                )}
              </div>
              <div className="rl">{agent.shortRole} · outputs {agent.output}</div>
              <div className="rep-bar"><span style={{ width: `${agent.reputation * 100}%` }} /></div>
            </div>
            <span className="badge-soft mono">{(agent.reputation * 100).toFixed(0)} rep</span>
          </div>

          <div className="agent-meta">
            <div className="meta-cell">
              <div className="mk">ERC-8004 ID</div>
              <div className="mv mono">
                <a href={explorer.token(agent.registryAddress, agent.id)} target="_blank" rel="noreferrer" className="a-dim" style={{ textDecoration: 'underline dotted', textUnderlineOffset: 3 }}>
                  #{agent.id}
                </a>
              </div>
            </div>
            <div className="meta-cell">
              <div className="mk">Verified actions</div>
              <div className="mv tnum">{agent.actions.toLocaleString()}</div>
            </div>
            <div className="meta-cell" style={{ gridColumn: '1 / -1', borderRight: 0 }}>
              <div className="mk">Public address (Mantle)</div>
              <CopyAddr value={agent.wallet} display={short(agent.wallet)} />
            </div>
            <div className="meta-cell" style={{ gridColumn: '1 / -1', borderRight: 0 }}>
              <div className="mk">Role-grant tx</div>
              <div className="mv mono">
                {agent.roleGrantTx ? (
                  <a href={explorer.tx(agent.roleGrantTx)} target="_blank" rel="noreferrer" style={{ color: 'var(--paper)', textDecoration: 'underline dotted', textUnderlineOffset: 3 }}>
                    {shortHash(agent.roleGrantTx)}
                  </a>
                ) : (
                  <span className="a-dim">—</span>
                )}
              </div>
            </div>
            <div className="meta-cell" style={{ gridColumn: '1 / -1', borderRight: 0, borderBottom: 0 }}>
              <div className="mk">Strategy document · IPFS</div>
              <div className="a-flex" style={{ justifyContent: 'space-between' }}>
                <span className="mv mono a-dim">{agent.strategyCid}</span>
                <a className="btn-app btn-ghost btn-sm" href={lighthouseGateway(agent.strategyCid)} target="_blank" rel="noreferrer">Open ↗</a>
              </div>
            </div>
          </div>

          <div className="a-card-head" style={{ borderTop: '1px solid var(--line)' }}>
            <h2>Recent transactions</h2>
            <span className="a-eyebrow">on-chain</span>
          </div>
          <div className="agent-tx-scroll" style={{ height: 220, maxHeight: 220, flex: 'none' }}>
            {txs.length === 0 ? (
              <div
                style={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  textAlign: 'center',
                  gap: 6,
                  padding: '0 24px',
                }}
              >
                <div>No transactions yet</div>
                <div className="a-muted">{AGENT_EMPTY_HINTS[agent.key]}</div>
              </div>
            ) : (
              txs.map((e) => (
                <div className="a-tx" key={e.id}>
                  <span className="txic" style={{ color: `var(${agent.color})` }}>{agent.glyph}</span>
                  <span className="txmain">
                    <div className="t1">{e.verb} {e.obj}</div>
                    <div className="t2">{e.detail || agent.shortRole} · {relTime(e.ts)}</div>
                  </span>
                  {e.verdict ? <span className={`verdict ${e.verdict}`}>{e.verdict}</span> : <span />}
                  <span className="txhash">{e.hash}</span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
