'use client';

import { useState } from 'react';
import { useAccount, useDisconnect } from 'wagmi';
import { WalletPicker } from '@/components/WalletPicker';
import { MarkMini } from '../Mark';
import { Icon } from './Icon';
import type { Route } from './shellTypes';

interface NavItem {
  key: Route;
  label: string;
  icon: 'grid' | 'deposit' | 'agents' | 'activity' | 'docs' | 'shield';
  badge?: number;
  live?: boolean;
}

const NAV: NavItem[] = [
  { key: 'dashboard', label: 'Dashboard', icon: 'grid' },
  { key: 'deposit', label: 'Deposit', icon: 'deposit' },
  { key: 'agents', label: 'Agents', icon: 'agents', badge: 5 },
  { key: 'activity', label: 'Activity', icon: 'activity', live: true }
];

const NAV2: NavItem[] = [
  { key: 'documents', label: 'Documents', icon: 'docs' },
  { key: 'verify', label: 'Verification', icon: 'shield' }
];

interface SidebarProps {
  route: Route;
  onNav: (r: Route) => void;
}

function short(addr: string): string {
  if (!addr) return '';
  return `${addr.slice(0, 6)}…${addr.slice(-4)}`;
}

export function Sidebar({ route, onNav }: SidebarProps) {
  const { address, isConnected } = useAccount();
  const { disconnect } = useDisconnect();
  const [pickerOpen, setPickerOpen] = useState(false);

  const renderItem = (n: NavItem) => (
    <button key={n.key} className={`sb-item ${route === n.key ? 'active' : ''}`} onClick={() => onNav(n.key)}>
      <Icon name={n.icon} />
      <span>{n.label}</span>
      {n.badge !== undefined && <span className="badge">{n.badge}</span>}
      {n.live && <span className="live-dot" />}
    </button>
  );

  return (
    <aside className="sidebar">
      <div className="sb-brand">
        <MarkMini />
        <b>Strata</b>
        <span className="net">Mainnet</span>
      </div>
      <nav className="sb-nav">
        {NAV.map(renderItem)}
        <div className="sb-sec">Protocol</div>
        {NAV2.map(renderItem)}
      </nav>
      <div className="sb-spacer" />
      {isConnected && address ? (
        <div className="sb-wallet">
          <div className="row">
            <span className="avatar" />
            <span className="who">
              <span className="addr">{short(address)}</span>
              <span className="meta">Mantle mainnet</span>
            </span>
          </div>
          <button className="sb-connect" onClick={() => disconnect()}>Disconnect</button>
          <div className="disc">Not investment advice</div>
        </div>
      ) : (
        <div className="sb-wallet">
          <div className="row">
            <span className="avatar" />
            <span className="who">
              <span className="addr">Not connected</span>
              <span className="meta">Mantle mainnet</span>
            </span>
          </div>
          <button className="sb-connect" onClick={() => setPickerOpen(true)}>
            Connect wallet
          </button>
          <div className="disc">Read-only until connected</div>
        </div>
      )}
      <WalletPicker open={pickerOpen} onClose={() => setPickerOpen(false)} />
    </aside>
  );
}
