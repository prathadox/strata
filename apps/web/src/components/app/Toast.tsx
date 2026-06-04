'use client';

import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import type { AgentEvent } from '@/lib/appData';
import { agentByKey } from '@/lib/onchain';

export interface ToastItem {
  id: number;
  tone?: 'default' | 'green' | 'amber';
  glyph: string;
  title: string;
  desc?: string;
  meta?: string;
  ttl?: number;
}

interface ToastContextValue {
  push: (t: Omit<ToastItem, 'id'>) => void;
  pushEvent: (e: AgentEvent) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

export function useToasts(): ToastContextValue {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToasts must be used within ToastProvider');
  return ctx;
}

let toastSeq = 0;

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<ToastItem[]>([]);

  const remove = useCallback((id: number) => {
    setItems((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const push = useCallback((t: Omit<ToastItem, 'id'>) => {
    const id = ++toastSeq;
    setItems((prev) => [...prev, { id, ...t }]);
    const ttl = t.ttl ?? 6000;
    setTimeout(() => remove(id), ttl);
  }, [remove]);

  const pushEvent = useCallback((e: AgentEvent) => {
    const a = agentByKey(e.agentKey);
    const tone: ToastItem['tone'] =
      e.verdict === 'clear' ? 'green' : e.verdict === 'flag' ? 'amber' : 'default';
    push({
      tone,
      glyph: a?.glyph ?? '··',
      title: `${a?.role ?? e.agentKey} · ${e.verb}`,
      desc: `${e.obj}${e.detail ? ` · ${e.detail}` : ''}`,
      meta: e.hash,
      ttl: 6000
    });
  }, [push]);

  return (
    <ToastContext.Provider value={{ push, pushEvent }}>
      {children}
      <div className="toast-wrap" aria-live="polite" aria-atomic="false">
        {items.map((t) => (
          <Toast key={t.id} item={t} onClose={() => remove(t.id)} />
        ))}
      </div>
    </ToastContext.Provider>
  );
}

function Toast({ item, onClose }: { item: ToastItem; onClose: () => void }) {
  const [out, setOut] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setOut(true), (item.ttl ?? 6000) - 300);
    return () => clearTimeout(t);
  }, [item.ttl]);
  return (
    <div className={`a-toast ${item.tone ?? ''} ${out ? 'out' : ''}`}>
      <span className="tic">{item.glyph}</span>
      <div className="tbody">
        <div className="ttitle">{item.title}</div>
        {item.desc && <div className="tdesc">{item.desc}</div>}
        {item.meta && <div className="tmeta">{item.meta}</div>}
      </div>
      <button className="tclose" onClick={onClose} aria-label="Dismiss notification">
        <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
          <path d="M2 2l7 7M9 2l-7 7" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
        </svg>
      </button>
      <span className="tbar" />
    </div>
  );
}
