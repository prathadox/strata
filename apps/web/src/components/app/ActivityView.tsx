'use client';

import { useState } from 'react';
import { AGENTS, agentByKey, explorer, lighthouseGateway } from '@/lib/onchain';
import { clockTime, relTime, type AgentEvent } from '@/lib/appData';
import { REAL_EVENT_CIDS } from '@/lib/realEvents';
import { SEED_DOCS } from '@/lib/seedDocs';

interface ActivityViewProps {
  events: AgentEvent[];
}

type Filter = 'all' | 'scout' | 'architect' | 'sentinel' | 'operator' | 'compliance';

const RATIONALE_PREVIEW = 200;

function rationaleFor(eventId: number): string | null {
  const doc = SEED_DOCS[eventId];
  if (!doc || typeof doc.rationale !== 'string') return null;
  const trimmed = doc.rationale.trim();
  return trimmed.length > 0 ? trimmed : null;
}

function Rationale({ text }: { text: string }) {
  const [open, setOpen] = useState(false);
  const needsTruncate = text.length > RATIONALE_PREVIEW;
  const shown = !needsTruncate || open ? text : text.slice(0, RATIONALE_PREVIEW).trimEnd() + '…';
  return (
    <div className="a-muted" style={{ fontSize: 12, lineHeight: 1.5, marginTop: 4 }}>
      <span>{shown}</span>
      {needsTruncate && (
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          style={{
            marginLeft: 6,
            background: 'transparent',
            border: 0,
            padding: 0,
            color: 'var(--paper-dim)',
            font: 'inherit',
            cursor: 'pointer',
            textDecoration: 'underline dotted',
            textUnderlineOffset: 2
          }}
        >
          {open ? 'show less' : 'show more'}
        </button>
      )}
    </div>
  );
}

export function ActivityView({ events }: ActivityViewProps) {
  const [filter, setFilter] = useState<Filter>('all');
  const filtered = filter === 'all' ? events : events.filter((e) => e.agentKey === filter);

  return (
    <div className="app-content">
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 10 }}>
        <span className="chip"><span className="gdot" /> {filtered.length} events</span>
      </div>
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 18 }}>
        <div className="tabs" role="tablist">
          <button className={`tab ${filter === 'all' ? 'active' : ''}`} onClick={() => setFilter('all')}>All</button>
          {AGENTS.map((a) => (
            <button key={a.key} className={`tab ${filter === a.key ? 'active' : ''}`} onClick={() => setFilter(a.key as Filter)}>{a.role}</button>
          ))}
        </div>
      </div>
      <div className="a-card">
        <div className="feed" style={{ maxHeight: 'calc(100vh - 240px)', overflowY: 'auto' }}>
          {filtered.length === 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', minHeight: 'calc(100vh - 240px)', textAlign: 'center', padding: 24 }}>
              <div style={{ fontSize: 15, fontWeight: 500 }}>No events yet</div>
              <div className="a-muted" style={{ fontSize: 12.5, marginTop: 6 }}>
                {filter === 'all'
                  ? 'AgentEventBus on Mantle is silent. Once the agents fire their next cycle, every emission lands here.'
                  : `No events from ${agentByKey(filter)?.role ?? filter} yet. Try the All tab or wait for the next cycle.`}
              </div>
            </div>
          ) : (
            filtered.map((e) => {
              const a = agentByKey(e.agentKey);
              const rationale = e.agentKey === 'architect' && e.kind === 'propose'
                ? rationaleFor(e.id)
                : null;
              return (
                <div className="feed-row" key={e.id}>
                  <div className="feed-ic" style={{ color: `var(${a?.color})` }}>{a?.glyph}</div>
                  <div className="feed-main">
                    <div className="ln1">
                      <span className="who">{a?.role ?? e.agentKey}</span>
                      <span className="verb">{e.verb}</span>
                      <span>{e.obj}</span>
                      {e.verdict && <span className={`verdict ${e.verdict}`}>{e.verdict}</span>}
                    </div>
                    <div className="ln2">
                      {e.detail && <span>{e.detail}</span>}
                      {e.detail && <span className="a-muted">·</span>}
                      <a className="hash" href={explorer.tx(e.hash)} target="_blank" rel="noreferrer">{e.hash.slice(0, 10)}…{e.hash.slice(-6)}</a>
                      {REAL_EVENT_CIDS[e.id] && (
                        <>
                          <span className="a-muted">·</span>
                          <a className="hash" href={lighthouseGateway(REAL_EVENT_CIDS[e.id])} target="_blank" rel="noreferrer">doc</a>
                        </>
                      )}
                    </div>
                    {rationale && <Rationale text={rationale} />}
                  </div>
                  <div className="feed-time">
                    <div>{clockTime(e.ts)}</div>
                    <div style={{ fontSize: 9.5, opacity: 0.7 }}>{relTime(e.ts)}</div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
