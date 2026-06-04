'use client';

import { useEffect, useState } from 'react';
import { REAL_EVENTS, REAL_EVENT_CIDS } from '@/lib/realEvents';
import { fetchDocByEventId, summarize, type ParsedDoc } from '@/lib/docParser';
import { AGENTS, agentByKey, explorer, lighthouseGateway } from '@/lib/onchain';
import { clockTime } from '@/lib/appData';

interface DocRow {
  id: number;
  agentKey: string;
  title: string;
  cid: string;
  txHash: string;
  ts: number;
}

const ROWS: DocRow[] = REAL_EVENTS
  .filter((e) => REAL_EVENT_CIDS[e.id])
  .map((e) => ({
    id: e.id,
    agentKey: e.agentKey,
    title: `${e.verb} ${e.obj}`,
    cid: REAL_EVENT_CIDS[e.id],
    txHash: e.hash,
    ts: e.ts
  }));

export function DocumentsView() {
  const [open, setOpen] = useState<number | null>(null);
  const [docs, setDocs] = useState<Record<number, { state: 'loading' | 'ready' | 'error'; doc?: ParsedDoc; err?: string }>>({});

  useEffect(() => {
    if (open == null) return;
    const row = ROWS.find((r) => r.id === open);
    if (!row || docs[open]) return;
    setDocs((s) => ({ ...s, [open]: { state: 'loading' } }));
    const controller = new AbortController();
    fetchDocByEventId(row.id, row.cid, controller.signal)
      .then((doc) => setDocs((s) => ({ ...s, [open]: { state: 'ready', doc } })))
      .catch((err) => setDocs((s) => ({ ...s, [open]: { state: 'error', err: String(err) } })));
    return () => controller.abort();
  }, [open]);

  return (
    <div className="app-content narrow">
      <div className="a-card">
        <div className="a-card-head">
          <h2>Documents &amp; strategies</h2>
          <span className="a-eyebrow">Lighthouse · {ROWS.length} pinned</span>
        </div>
        <div style={{ padding: 0 }}>
          {ROWS.length === 0 ? (
            <div style={{ padding: '40px 24px', textAlign: 'center' }}>
              <div style={{ fontWeight: 600, marginBottom: 8 }}>No documents pinned yet.</div>
              <div className="a-muted" style={{ fontSize: 13 }}>
                Documents land here automatically once an agent publishes its first cycle.
              </div>
            </div>
          ) : (
            ROWS.map((row) => {
              const agent = agentByKey(row.agentKey);
              const entry = docs[row.id];
              const isOpen = open === row.id;
              return (
                <div key={row.id} style={{ borderTop: '1px solid var(--line)' }}>
                  <button
                    type="button"
                    onClick={() => setOpen(isOpen ? null : row.id)}
                    style={{
                      width: '100%',
                      display: 'grid',
                      gridTemplateColumns: '32px 1fr auto auto',
                      gap: 12,
                      alignItems: 'center',
                      padding: '14px 18px',
                      background: 'transparent',
                      border: 0,
                      color: 'inherit',
                      cursor: 'pointer',
                      textAlign: 'left'
                    }}
                  >
                    <span style={{ color: `var(${agent?.color})`, fontSize: 13, fontWeight: 600 }}>{agent?.glyph}</span>
                    <span>
                      <div style={{ fontSize: 13.5 }}>{row.title}</div>
                      <div className="a-muted" style={{ fontSize: 11.5, marginTop: 2 }}>{agent?.role} · {clockTime(row.ts)}</div>
                    </span>
                    <span className="mono a-dim" style={{ fontSize: 11 }}>{row.cid.slice(0, 10)}…{row.cid.slice(-4)}</span>
                    <span className="a-muted" style={{ fontSize: 11 }}>{isOpen ? '▾' : '▸'}</span>
                  </button>
                  {isOpen && (
                    <div style={{ padding: '0 18px 18px 62px' }}>
                      <div style={{ display: 'flex', gap: 14, marginBottom: 10 }}>
                        <a href={lighthouseGateway(row.cid)} target="_blank" rel="noreferrer" className="btn-app btn-ghost btn-sm">Open on Lighthouse ↗</a>
                        <a href={explorer.tx(row.txHash)} target="_blank" rel="noreferrer" className="btn-app btn-ghost btn-sm">Tx on Mantlescan ↗</a>
                      </div>
                      {entry?.state === 'loading' && <div className="a-muted" style={{ fontSize: 12 }}>Loading from IPFS…</div>}
                      {entry?.state === 'error' && <div className="a-muted" style={{ fontSize: 12, color: 'var(--danger)' }}>Failed to load: {entry.err}</div>}
                      {entry?.state === 'ready' && entry.doc && (
                        <>
                          <div className="mono" style={{ fontSize: 12, marginBottom: 8 }}>{summarize(entry.doc)}</div>
                          <pre style={{ background: 'var(--paper-bg)', border: '1px solid var(--line)', borderRadius: 8, padding: 12, fontSize: 11, lineHeight: 1.5, overflowX: 'auto', maxHeight: 320 }}>
{JSON.stringify(entry.doc, null, 2)}
                          </pre>
                        </>
                      )}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>
      <p className="a-muted mono a-mt-14" style={{ fontSize: 11, textAlign: 'center' }}>
        Every strategy is signed and content-addressed. Read what an agent intends before it acts.
      </p>
    </div>
  );
}

void AGENTS; // keep import side-effect-free across HMR
