'use client';

import { useState } from 'react';
import { ToastProvider } from '@/components/app/Toast';
import { Sidebar } from '@/components/app/Sidebar';
import { Topbar } from '@/components/app/Topbar';
import { Dashboard } from '@/components/app/Dashboard';
import { AgentsView } from '@/components/app/AgentsView';
import { ActivityView } from '@/components/app/ActivityView';
import { DocumentsView } from '@/components/app/DocumentsView';
import { VerifyView } from '@/components/app/VerifyView';
import { DepositView } from '@/components/app/DepositView';
import { REAL_EVENTS } from '@/lib/realEvents';
import { AGENTS } from '@/lib/onchain';
import type { Route } from '@/components/app/shellTypes';

function AppInner() {
  const [route, setRoute] = useState<Route>('dashboard');
  const [depTier, setDepTier] = useState<string | null>(null);

  // Events are sourced exclusively from /lib/realEvents.ts — no mock engine, no random churn.
  // Empty by default; populated when the on-chain indexer subscription is wired or when txs
  // are pasted into realEvents.ts by the demo script.
  const events = REAL_EVENTS;
  const statuses = Object.fromEntries(
    AGENTS.map((a) => [a.key, { status: a.status, doing: a.doing }])
  ) as Record<string, { status: 'working' | 'idle'; doing: string }>;

  const nav = (to: Route, tier?: string) => {
    if (tier) setDepTier(tier);
    setRoute(to);
    if (typeof window !== 'undefined') window.scrollTo({ top: 0 });
  };

  return (
    <div className="app">
      <Sidebar route={route} onNav={nav} />
      <div className="app-main">
        <Topbar route={route} onNav={nav} />
        {route === 'dashboard' && <Dashboard events={events} statuses={statuses} onNav={nav} />}
        {route === 'deposit' && <DepositView initialTier={depTier} />}
        {route === 'agents' && <AgentsView events={events} />}
        {route === 'activity' && <ActivityView events={events} />}
        {route === 'documents' && <DocumentsView />}
        {route === 'verify' && <VerifyView />}
      </div>
    </div>
  );
}

export default function Page() {
  return (
    <ToastProvider>
      <AppInner />
    </ToastProvider>
  );
}
