'use client';

import { useState } from 'react';
import { TIERS, fmtCompact, fmtUSD } from '@/lib/appData';

interface DepositViewProps {
  initialTier?: string | null;
}

export function DepositView({ initialTier }: DepositViewProps) {
  const [selected, setSelected] = useState<string | null>(initialTier ?? null);

  return (
    <div className="app-content narrow">
      <div className="stepper" style={{ display: 'flex', alignItems: 'center', gap: 0, marginBottom: 26 }}>
        {['Tranche', 'Amount', 'Review', 'Done'].map((label, i) => (
          <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 11 }}>
            <span
              className={`sx ${i === 0 ? 'active' : ''}`}
              style={{
                width: 26, height: 26, borderRadius: 999,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontFamily: 'var(--mono)', fontSize: 11,
                border: i === 0 ? '1px solid var(--accent)' : '1px solid var(--line-2)',
                color: i === 0 ? 'var(--accent)' : 'var(--paper-mute)',
                background: i === 0 ? 'color-mix(in srgb, var(--accent) 12%, transparent)' : 'rgba(255,255,255,.02)'
              }}
            >{i + 1}</span>
            <span style={{ fontSize: 12.5, color: i === 0 ? 'var(--paper)' : 'var(--paper-mute)' }}>{label}</span>
            {i < 3 && <span style={{ flex: 1, height: 1, background: 'var(--line-2)', margin: '0 14px', minWidth: 18 }} />}
          </div>
        ))}
      </div>

      <div className="a-row-between" style={{ marginBottom: 18 }}>
        <div className="a-flex-col a-gap-6">
          <span className="a-eyebrow">Step 1 of 4</span>
          <h2 style={{ margin: 0, fontSize: 20, fontWeight: 500 }}>Choose your tranche</h2>
        </div>
        <span className="chip"><span className="gdot" /> Mantle mainnet</span>
      </div>

      <div className="a-grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
        {TIERS.map((t) => (
          <button
            key={t.key}
            className={`tcard ${selected === t.key ? 'sel' : ''}`}
            onClick={() => setSelected(t.key)}
            style={{
              ['--tier' as any]: `var(${t.cssVar})`,
              position: 'relative', textAlign: 'left',
              border: selected === t.key
                ? `1px solid color-mix(in srgb, var(${t.cssVar}) 60%, transparent)`
                : '1px solid var(--line)',
              borderRadius: 16, padding: 18,
              background: 'linear-gradient(180deg, rgba(255,255,255,.02), rgba(255,255,255,0)), rgba(20,8,18,.5)',
              boxShadow: selected === t.key
                ? `0 0 0 1px color-mix(in srgb, var(${t.cssVar}) 45%, transparent), 0 14px 40px -16px color-mix(in srgb, var(${t.cssVar}) 50%, transparent)`
                : 'none',
              display: 'flex', flexDirection: 'column', gap: 12,
              cursor: 'pointer', color: 'inherit', font: 'inherit'
            }}
          >
            <span
              aria-hidden="true"
              style={{
                position: 'absolute', top: 14, right: 14,
                width: 18, height: 18, borderRadius: 999,
                border: '1px solid var(--line-2)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: selected === t.key ? `var(${t.cssVar})` : 'transparent',
                borderColor: selected === t.key ? `var(${t.cssVar})` : 'var(--line-2)'
              }}
            >
              {selected === t.key && (
                <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                  <path d="M2 5l2 2 4-4" stroke="#170a10" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              )}
            </span>
            <div style={{ display: 'flex', alignItems: 'center', gap: 9, fontSize: 17, fontWeight: 500, letterSpacing: '-.015em' }}>
              <span className="tier-dot" style={{ background: `var(${t.cssVar})` }} />
              {t.name}
            </div>
            <div style={{ fontFamily: 'var(--mono)', fontSize: 10, letterSpacing: '.08em', textTransform: 'uppercase', color: 'var(--paper-mute)' }}>
              {t.role}
            </div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 7 }}>
              <span style={{ fontSize: 34, fontWeight: 500, letterSpacing: '-.03em' }}>{t.apy}</span>
              <span style={{ fontFamily: 'var(--mono)', fontSize: 10, letterSpacing: '.08em', textTransform: 'uppercase', color: 'var(--paper-mute)' }}>% target APY</span>
            </div>
            <div style={{ fontSize: 12.5, color: 'var(--paper-dim)', lineHeight: 1.45 }}>{t.note}</div>
            <div className="a-divider" />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: 'var(--mono)', fontSize: 11, color: 'var(--paper-mute)' }}>
              <span>Pool TVL</span>
              <span style={{ color: 'var(--paper)' }}>{fmtCompact(t.poolTvl)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: 'var(--mono)', fontSize: 11, color: 'var(--paper-mute)' }}>
              <span>Capacity</span>
              <span>{((t.poolTvl / t.capacity) * 100).toFixed(0)}% full</span>
            </div>
            <div style={{ fontFamily: 'var(--mono)', fontSize: 10, color: 'var(--paper-mute)', marginTop: 4 }}>
              Backing: {t.backing.join(' · ')}
            </div>
          </button>
        ))}
      </div>

      <div className="a-row-between a-section-gap" style={{ marginTop: 32 }}>
        <span className="a-muted mono" style={{ fontSize: 11 }}>
          The full deposit wizard with KYC verification + on-chain compliance receipt is at /deposit.
        </span>
        <a href={`/deposit${selected ? `?tier=${selected}` : ''}`} className="btn-app btn-primary" aria-disabled={!selected}>
          {selected ? `Continue with ${TIERS.find((t) => t.key === selected)?.name}` : 'Pick a tranche'}
          <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
            <path d="M2 6.5h8M7 3l3 3-3 3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </a>
      </div>
    </div>
  );
}
