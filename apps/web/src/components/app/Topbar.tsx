'use client';

import { useAccount, useConnect } from 'wagmi';
import { TITLES, type Route } from './shellTypes';

function short(addr: string): string {
  if (!addr) return '';
  return `${addr.slice(0, 6)}…${addr.slice(-4)}`;
}

interface TopbarProps {
  route: Route;
  onNav: (r: Route) => void;
}

export function Topbar({ route, onNav }: TopbarProps) {
  const t = TITLES[route] ?? TITLES.dashboard;
  const { address, isConnected } = useAccount();
  const { connect, connectors, isPending } = useConnect();
  const injected = connectors[0];
  const handleConnect = () => {
    if (injected) connect({ connector: injected });
  };

  return (
    <div className="topbar">
      <div className="tb-title">
        <span className="crumb">{t.crumb}</span>
        <h1>{t.h}</h1>
      </div>
      <div className="tb-right">
        <span className="chip"><span className="gdot" /> <b>5</b>&nbsp;agents live</span>
        {isConnected && address ? (
          <button className="wallet-pill" onClick={() => onNav('verify')} aria-label="View connected wallet">
            <span className="avatar" />
            <span className="addr">{short(address)}</span>
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" style={{ opacity: 0.5 }} aria-hidden="true">
              <path d="M3 4.5L6 7.5l3-3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        ) : (
          <button className="btn-app btn-ghost btn-sm" onClick={handleConnect} disabled={isPending}>
            {isPending ? 'Opening…' : 'Connect MetaMask'}
          </button>
        )}
        {route !== 'deposit' && (
          <button className="btn-app btn-primary btn-sm" onClick={() => onNav('deposit')}>Deposit</button>
        )}
      </div>
    </div>
  );
}
