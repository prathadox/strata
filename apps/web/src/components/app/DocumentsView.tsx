'use client';

export function DocumentsView() {
  return (
    <div className="app-content narrow">
      <div className="a-card">
        <div className="a-card-head">
          <h2>Documents &amp; strategies</h2>
          <span className="a-eyebrow">IPFS · public</span>
        </div>
        <div style={{ padding: '40px 24px', textAlign: 'center' }}>
          <div style={{ fontWeight: 600, marginBottom: 8 }}>No documents pinned yet.</div>
          <div className="a-muted" style={{ fontSize: 13, lineHeight: 1.6 }}>
            Each agent&apos;s strategy + methodology will be pinned to Lighthouse and content-addressed; this list populates from on-chain CID events as agents publish.
          </div>
        </div>
      </div>
      <p className="a-muted mono a-mt-14" style={{ fontSize: 11, textAlign: 'center' }}>
        Every strategy is signed and content-addressed. Read what an agent intends before it acts.
      </p>
    </div>
  );
}
