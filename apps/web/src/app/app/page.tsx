'use client';

import { useEffect, useMemo, useState } from 'react';
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
import { demoDepositsToEvents, isDemoDepositsEnabled } from '@/lib/demoDeposits';
import type { Route } from '@/components/app/shellTypes';
import type { AgentEvent } from '@/lib/appData';

function AppInner() {
  const [route, setRoute] = useState<Route>('dashboard');
  const [depTier, setDepTier] = useState<string | null>(null);
  const [demoEvents, setDemoEvents] = useState<AgentEvent[]>([]);

  useEffect(() => {
    if (!isDemoDepositsEnabled()) return;
    const refresh = () => setDemoEvents(demoDepositsToEvents());
    refresh();
    window.addEventListener('strata:demo-deposit', refresh);
    window.addEventListener('storage', refresh);
    return () => {
      window.removeEventListener('strata:demo-deposit', refresh);
      window.removeEventListener('storage', refresh);
    };
  }, []);

  // Events are sourced from /lib/realEvents.ts (no mock engine, no random churn). When
  // NEXT_PUBLIC_DEMO_DEPOSITS=1, synthetic deposit entries from localStorage are merged in
  // newest-first so the dashboard can demo the full deposit -> propose -> verify -> allocate
  // loop without needing real USDC on chain.
  const events = useMemo<AgentEvent[]>(
    () => [...demoEvents].sort((a, b) => b.ts - a.ts).concat(REAL_EVENTS),
    [demoEvents]
  );
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
