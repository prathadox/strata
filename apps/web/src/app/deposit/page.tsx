'use client';

import { useState } from 'react';
import { useAccount, useDisconnect } from 'wagmi';
import { WalletPicker } from '../../components/WalletPicker';
import { MarkMini } from '../../components/Mark';

export default function DepositPage() {
  const { address, isConnected } = useAccount();
  const { disconnect } = useDisconnect();
  const [pickerOpen, setPickerOpen] = useState(false);

  const handleConnect = () => setPickerOpen(true);

  return (
    <div className="deposit-page">
      <header className="deposit-nav">
        <div className="wrap deposit-nav-inner">
          <a href="/" className="brand" aria-label="Strata, home">
            <MarkMini />
            <span className="brand-word"><b>STRATA</b></span>
          </a>
          {isConnected && address ? (
            <div className="deposit-nav-wallet">
              <span className="deposit-nav-addr">{`${address.slice(0, 6)}…${address.slice(-4)}`}</span>
              <button className="deposit-nav-disconnect" onClick={() => disconnect()}>Disconnect</button>
            </div>
          ) : (
            <button className="btn-ghost" onClick={handleConnect}>
              Connect wallet
            </button>
          )}
        </div>
      </header>

      <main className="wrap deposit-main">
        <div className="deposit-card">
          <div className="deposit-section deposit-center" style={{ padding: '12px 4px 8px', textAlign: 'center' }}>
            <span
              className="chip"
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 8,
                padding: '6px 12px', borderRadius: 999,
                background: 'color-mix(in srgb, var(--accent) 14%, transparent)',
                border: '1px solid color-mix(in srgb, var(--accent) 40%, transparent)',
                color: 'var(--accent)', fontFamily: 'var(--mono)', fontSize: 11,
                letterSpacing: '.08em', textTransform: 'uppercase', marginBottom: 18
              }}
            >
              <span className="gdot" /> In beta · coming soon
            </span>
            <h2 className="deposit-title" style={{ marginBottom: 10 }}>Deposits are in private beta</h2>
            <p className="deposit-desc" style={{ maxWidth: 460, margin: '0 auto 18px' }}>
              The compliance flow and the on-chain deposit path are wired end-to-end but gated for the
              public preview. Watch the dashboard for live agent activity meanwhile, and follow updates
              for when deposits open.
            </p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: 12, flexWrap: 'wrap' }}>
              <a href="/app" className="btn-cta">View live dashboard
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                  <path d="M2 6h8M7 3l3 3-3 3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </a>
              <a href="/" className="btn-ghost">Back to landing</a>
            </div>
            <div className="deposit-note" style={{ marginTop: 22 }}>
              <p style={{ fontSize: 11.5, color: 'var(--paper-mute)' }}>
                {isConnected && address
                  ? `Wallet ${address.slice(0, 6)}…${address.slice(-4)} is verified for the waitlist. You'll be notified when deposits open.`
                  : 'No wallet required to view live activity. Connect a wallet here to join the waitlist when deposits open.'}
              </p>
            </div>
          </div>
        </div>
      </main>
      <WalletPicker open={pickerOpen} onClose={() => setPickerOpen(false)} />
    </div>
  );
}
