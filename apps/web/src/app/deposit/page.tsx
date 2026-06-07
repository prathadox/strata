'use client';

import { useState } from 'react';
import { useAccount, useDisconnect } from 'wagmi';
import { WalletPicker } from '../../components/WalletPicker';
import { MarkMini } from '../../components/Mark';
import { useComplianceReceipt } from '@/hooks/useComplianceReceipt';
import { DepositGate } from '@/components/app/DepositGate';
import { isDemoDepositsEnabled } from '@/lib/demoDeposits';

const DEMO_WALLET = '0x000000000000000000000000000000000000dEaD' as const;

export default function DepositPage() {
  const { address, isConnected } = useAccount();
  const { disconnect } = useDisconnect();
  const [pickerOpen, setPickerOpen] = useState(false);

  const { tokenId, loading } = useComplianceReceipt(isConnected ? address : undefined);
  const whitelisted = tokenId !== null && tokenId > 0n;
  const demoMode = isDemoDepositsEnabled();
  const effectiveWallet = (isConnected && address ? address : DEMO_WALLET) as `0x${string}`;
  const showGate = demoMode || (isConnected && address && whitelisted);

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
          {showGate ? (
            <div className="deposit-section" style={{ padding: '12px 4px 8px' }}>
              <div style={{ textAlign: 'center', marginBottom: 18 }}>
                <span
                  className="chip"
                  style={{
                    display: 'inline-flex', alignItems: 'center', gap: 8,
                    padding: '6px 12px', borderRadius: 999,
                    background: demoMode
                      ? 'color-mix(in srgb, var(--accent) 14%, transparent)'
                      : 'color-mix(in srgb, var(--green) 14%, transparent)',
                    border: demoMode
                      ? '1px solid color-mix(in srgb, var(--accent) 40%, transparent)'
                      : '1px solid color-mix(in srgb, var(--green) 40%, transparent)',
                    color: demoMode ? 'var(--accent)' : 'var(--green)',
                    fontFamily: 'var(--mono)', fontSize: 11,
                    letterSpacing: '.08em', textTransform: 'uppercase'
                  }}
                >
                  <span className="gdot" />
                  {demoMode ? 'Demo mode · simulated deposit' : `Receipt #${tokenId?.toString()} · whitelisted`}
                </span>
                <h2 className="deposit-title" style={{ marginTop: 10 }}>Deposit USDC</h2>
                <p className="deposit-desc" style={{ maxWidth: 460, margin: '4px auto 0' }}>
                  {demoMode
                    ? 'No wallet or USDC required. Synthetic deposit, recorded locally, appears in the activity feed.'
                    : 'Pick a tranche and deposit. Allowance, deposit, and post-tx shares are all live reads.'}
                </p>
              </div>
              <DepositGate wallet={effectiveWallet} />
            </div>
          ) : (
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
              {isConnected && address && !loading && !whitelisted && (
                <p className="deposit-desc" style={{ maxWidth: 460, margin: '0 auto 18px', fontSize: 12.5, color: 'var(--paper-mute)' }}>
                  This wallet is not yet whitelisted for the beta deposit. Contact the team to be added.
                </p>
              )}
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
          )}
        </div>
      </main>
      <WalletPicker open={pickerOpen} onClose={() => setPickerOpen(false)} />
    </div>
  );
}
