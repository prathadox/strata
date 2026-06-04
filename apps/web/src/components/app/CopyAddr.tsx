'use client';

import { useState } from 'react';

interface CopyAddrProps {
  value: string;
  display?: string;
}

export function CopyAddr({ value, display }: CopyAddrProps) {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    try {
      navigator.clipboard?.writeText(value);
    } catch {
      /* ignore */
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 1400);
  };
  return (
    <div className="addr-box">
      <span className="a">{display ?? value}</span>
      <button className={`copybtn ${copied ? 'copied' : ''}`} onClick={copy} aria-label="Copy address">
        {copied ? (
          <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
            <path d="M3 7l2.5 2.5L10 4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        ) : (
          <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
            <rect x="3" y="3" width="7" height="7" rx="1.6" stroke="currentColor" strokeWidth="1.2" />
            <path d="M3 6.5V2.4A1 1 0 014 1.4h4.2" stroke="currentColor" strokeWidth="1.2" />
          </svg>
        )}
      </button>
    </div>
  );
}
