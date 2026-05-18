import type { Metadata, Viewport } from 'next';
import { GeistSans } from 'geist/font/sans';
import { GeistMono } from 'geist/font/mono';
import './globals.css';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
};

export const metadata: Metadata = {
  title: 'Strata, tranched yield on Mantle',
  description:
    'One pool of yield, sliced into three tiers. Pick the one that fits. Audit every move the protocol makes on-chain.',
  openGraph: {
    title: 'Strata, tranched yield on Mantle',
    description: 'Tranched real-world-asset yield managed by autonomous on-chain agents.',
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${GeistSans.variable} ${GeistMono.variable}`}>
      <body className="grain">{children}</body>
    </html>
  );
}
