import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Dashboard - Strata',
  description: 'Live agent + contract state on Mantle mainnet.'
};

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return children;
}
