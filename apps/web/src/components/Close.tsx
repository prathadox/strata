'use client';
import { useState } from 'react';
import { Reveal } from './Reveal';

const CTA_COPY = 'Request early access';

export function Close() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);

  function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!email.includes('@')) return;
    // TODO: wire to real waitlist provider (Resend, Loops, etc.) before launch
    setSent(true);
  }

  return (
    <section id="access" className="close">
      <div className="inner wrap">
        <Reveal>
          <h2>Yield, structured the way it should be.</h2>
        </Reveal>
        <Reveal delay={80}>
          <p>
            Strata is launching on Mantle. Early access opens with onboarding for all three
            tiers and your first Compliance Receipt.
          </p>
        </Reveal>
        <Reveal delay={160}>
          {!sent ? (
            <form className="email-form" onSubmit={submit}>
              <input
                type="email"
                placeholder="you@wallet.xyz"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                aria-label="Email address"
                required
              />
              <button type="submit" className="btn-cta" style={{ padding: '10px 18px' }}>
                {CTA_COPY}
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                  <path d="M2 7h10M8 3l4 4-4 4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </form>
          ) : (
            <p style={{ color: 'var(--green)', fontFamily: 'var(--mono)', fontSize: 13, letterSpacing: '.06em' }}>
              You&apos;re on the list.
            </p>
          )}
        </Reveal>
        <Reveal delay={240}>
          <p className="close-meta">
            v1 testnet · senior tranche US-restricted at launch
          </p>
        </Reveal>
      </div>
    </section>
  );
}
