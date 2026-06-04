'use client';

// Small modal that lists every connector wagmi has — both explicitly configured and
// auto-discovered via EIP-6963 (MetaMask, Exodus, Phantom, etc.). User picks the wallet
// they actually want, no guessing about which one window.ethereum points to.

import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { useAccount, useConnect, useConnectors } from 'wagmi';

interface WalletPickerProps {
  open: boolean;
  onClose: () => void;
}

export function WalletPicker({ open, onClose }: WalletPickerProps) {
  const { connect, isPending, error } = useConnect();
  // useConnectors() returns EIP-6963 discoveries too; useConnect().connectors sometimes lags.
  const connectors = useConnectors();
  const { isConnected } = useAccount();
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  // Auto-close once the wallet is connected.
  useEffect(() => {
    if (open && isConnected) onClose();
  }, [open, isConnected, onClose]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  if (!open || !mounted) return null;

  return createPortal((
    <div
      role="dialog"
      aria-modal="true"
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0, background: 'rgba(6, 4, 8, 0.78)',
        backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)', zIndex: 1000,
        display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: '#13101a', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 14,
          padding: 22, minWidth: 320, maxWidth: 380, color: '#f3eef8',
          boxShadow: '0 24px 60px rgba(0,0,0,0.55)'
        }}
      >
        <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 6 }}>Connect a wallet</div>
        <div style={{ fontSize: 12, color: 'rgba(243,238,248,0.55)', marginBottom: 14 }}>
          {connectors.length} wallet{connectors.length === 1 ? '' : 's'} detected on this browser.
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {connectors.length === 0 && (
            <div style={{ fontSize: 12, color: 'rgba(243,238,248,0.55)' }}>
              No wallets detected. Install one to continue.
            </div>
          )}
          {connectors.map((c) => (
            <button
              key={c.uid ?? c.id}
              type="button"
              disabled={isPending}
              onClick={() => { connect({ connector: c }); }}
              style={{
                display: 'flex', alignItems: 'center', gap: 10,
                padding: '10px 12px', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 10,
                background: '#1a1623', color: 'inherit', cursor: isPending ? 'wait' : 'pointer',
                fontSize: 13, textAlign: 'left'
              }}
            >
              {c.icon ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={c.icon} alt="" width={22} height={22} style={{ borderRadius: 5 }} />
              ) : (
                <span style={{ width: 22, height: 22, borderRadius: 5, background: '#241e2f', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: 10 }}>
                  {(c.name?.[0] ?? '?').toUpperCase()}
                </span>
              )}
              <span style={{ flex: 1 }}>{c.name}</span>
              <span className="mono" style={{ fontSize: 10, color: 'rgba(243,238,248,0.45)' }}>{c.id}</span>
            </button>
          ))}
        </div>
        {error && (
          <div style={{ marginTop: 12, fontSize: 11.5, color: '#ff7a8c' }}>
            {error.message}
          </div>
        )}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 14 }}>
          <a
            href="https://metamask.io/download/"
            target="_blank"
            rel="noreferrer"
            style={{ fontSize: 11.5, color: 'rgba(243,238,248,0.55)' }}
          >
            Install MetaMask ↗
          </a>
          <button type="button" onClick={onClose} style={{
            background: 'transparent', border: 'none', color: 'rgba(243,238,248,0.7)',
            fontSize: 12, cursor: 'pointer'
          }}>Close</button>
        </div>
      </div>
    </div>
  ), document.body);
}
