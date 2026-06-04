'use client';

import { useAccount } from 'wagmi';
import { AGENTS, CORE, VAULTS, ADAPTERS, explorer } from '@/lib/onchain';
import { CopyAddr } from './CopyAddr';

function short(addr: string): string {
  if (!addr) return '';
  return `${addr.slice(0, 6)}…${addr.slice(-4)}`;
}

export function VerifyView() {
  const { address, isConnected } = useAccount();
  return (
    <div className="app-content">
      <div className="a-card a-section-gap" style={{ marginTop: 0 }}>
        <div className="a-card-head">
          <h2>Connected wallet</h2>
          <span className={`badge-soft ${isConnected ? 'green' : ''}`}>{isConnected ? 'connected' : 'not connected'}</span>
        </div>
        <div className="agent-meta">
          <div className="meta-cell"><div className="mk">Network</div><div className="mv">Mantle mainnet · chainid 5000</div></div>
          <div className="meta-cell">
            <div className="mk">Status</div>
            <div className="mv">{isConnected ? 'Wallet connected' : 'No wallet connected'}</div>
          </div>
          {isConnected && address && (
            <div className="meta-cell" style={{ gridColumn: '1 / -1', borderRight: 0, borderBottom: 0 }}>
              <div className="mk">Public address</div>
              <CopyAddr value={address} display={address} />
            </div>
          )}
        </div>
      </div>

      <div className="a-card a-section-gap">
        <div className="a-card-head">
          <h2>Agent public addresses</h2>
          <span className="a-eyebrow">verify on MantleScan</span>
        </div>
        <div>
          {AGENTS.map((a) => (
            <div className="a-tx" key={a.key}>
              <span className="txic" style={{ color: `var(${a.color})` }}>{a.glyph}</span>
              <span className="txmain">
                <div className="t1">
                  {a.role} <span className="a-dim" style={{ fontWeight: 400 }}>· #{a.id}</span>
                </div>
                <div className="t2">{a.shortRole} · {a.actions.toLocaleString()} actions · {(a.reputation * 100).toFixed(0)} rep</div>
              </span>
              <span />
              <a href={explorer.address(a.wallet)} target="_blank" rel="noreferrer" style={{ color: 'var(--paper-mute)' }}>
                <CopyAddr value={a.wallet} display={short(a.wallet)} />
              </a>
            </div>
          ))}
        </div>
      </div>

      <div className="a-card a-section-gap">
        <div className="a-card-head">
          <h2>Core contracts</h2>
          <span className="a-eyebrow">{CORE.length} deployed on Mantle</span>
        </div>
        <div>
          {CORE.map((c) => (
            <div className="contract" key={c.address}>
              <span>
                <div className="cn">{c.name}</div>
                <div className="cd">{c.desc}</div>
              </span>
              <span className="badge-soft green">live</span>
              <CopyAddr value={c.address} display={short(c.address)} />
            </div>
          ))}
        </div>
      </div>

      <div className="a-card a-section-gap">
        <div className="a-card-head">
          <h2>Tranche vaults</h2>
          <span className="a-eyebrow">ERC-4626 · USDC underlying</span>
        </div>
        <div>
          {VAULTS.map((v) => (
            <div className="contract" key={v.address}>
              <span>
                <div className="cn">{v.name}</div>
                <div className="cd">{v.desc}</div>
              </span>
              <span className="badge-soft green">live</span>
              <CopyAddr value={v.address} display={short(v.address)} />
            </div>
          ))}
        </div>
      </div>

      <div className="a-card a-section-gap">
        <div className="a-card-head">
          <h2>Yield adapters</h2>
          <span className="a-eyebrow">{ADAPTERS.length} registered · $1k cap each</span>
        </div>
        <div>
          {ADAPTERS.map((ad) => (
            <div className="contract" key={ad.address}>
              <span>
                <div className="cn">{ad.name}</div>
                <div className="cd">{ad.desc}</div>
              </span>
              <span className={`badge-soft ${ad.trustModel === 'trustless' ? 'green' : ad.trustModel === 'oracle' ? 'amber' : ''}`}>
                {ad.trustModel}
              </span>
              <CopyAddr value={ad.address} display={short(ad.address)} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
