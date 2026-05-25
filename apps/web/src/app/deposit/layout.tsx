import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Deposit - Strata',
  description: 'Verify your identity and deposit into Strata tranches.'
};

export default function DepositLayout({ children }: { children: React.ReactNode }) {
  return children;
}
