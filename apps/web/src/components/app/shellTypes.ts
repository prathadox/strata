export type Route = 'dashboard' | 'deposit' | 'agents' | 'activity' | 'documents' | 'verify';

export const TITLES: Record<Route, { h: string; crumb: string }> = {
  dashboard: { h: 'Live Holdings', crumb: 'Overview' },
  deposit: { h: 'Deposit', crumb: 'Deposit Confirm' },
  agents: { h: 'Agents', crumb: 'ERC-8004 · Identity' },
  activity: { h: 'Activity', crumb: 'Real-time events' },
  documents: { h: 'Documents', crumb: 'Strategies · Audits' },
  verify: { h: 'Verification', crumb: 'Public addresses' }
};
