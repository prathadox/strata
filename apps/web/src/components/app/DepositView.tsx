'use client';

// In-app Deposit view — gated behind a "coming soon · in beta" panel for the public preview.
// The full tranche wizard + KYC + on-chain receipt path stays in the codebase; we just hide
// it from the UI until the public release.

export function DepositView(_props: { initialTier?: string | null }) {
  return (
    <div className="app-content narrow">
      <div
        className="a-card"
        style={{
          padding: '36px 28px',
          textAlign: 'center',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 14
        }}
      >
        <span
          className="chip"
          style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            padding: '6px 12px', borderRadius: 999,
            background: 'color-mix(in srgb, var(--accent) 14%, transparent)',
            border: '1px solid color-mix(in srgb, var(--accent) 40%, transparent)',
            color: 'var(--accent)', fontFamily: 'var(--mono)', fontSize: 11,
            letterSpacing: '.08em', textTransform: 'uppercase'
          }}
        >
          <span className="gdot" /> In beta · coming soon
        </span>
        <h2 style={{ margin: 0, fontSize: 22, fontWeight: 500, letterSpacing: '-.015em' }}>
          Deposits are in private beta
        </h2>
        <p className="a-muted" style={{ maxWidth: 460, lineHeight: 1.55, margin: 0 }}>
          The compliance flow and the on-chain deposit path are wired end-to-end but gated for the
          public preview. Watch the dashboard for live agent activity meanwhile.
        </p>
        <div style={{ display: 'flex', justifyContent: 'center', gap: 12, marginTop: 10, flexWrap: 'wrap' }}>
          <a href="/app" className="btn-app btn-primary">
            View live dashboard
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
              <path d="M2 6h8M7 3l3 3-3 3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </a>
          <a href="/" className="btn-app btn-ghost">Back to landing</a>
        </div>
        <p className="a-muted mono" style={{ fontSize: 11, marginTop: 8 }}>
          You can still connect a wallet from the topbar to join the waitlist.
        </p>
      </div>
    </div>
  );
}
