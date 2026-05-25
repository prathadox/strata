'use client';

import { useState } from 'react';
import { useAccount, useSignTypedData } from 'wagmi';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { generateStubCredential } from '../../lib/stub';
import { checkCompliance, decodeMask, type ComplianceResponse } from '../../lib/compliance';
import { MarkMini } from '../../components/Mark';

const COMPLIANCE_DOMAIN = {
  name: 'StrataCompliance',
  version: '1',
  chainId: 5000
} as const;

const DEPOSITOR_AUTH_TYPES = {
  DepositorAuth: [
    { name: 'wallet', type: 'address' },
    { name: 'credentialEvidenceHash', type: 'bytes32' },
    { name: 'deadline', type: 'uint256' }
  ]
} as const;

type Step = 'connect' | 'verify' | 'processing' | 'result';

const JURISDICTIONS = [
  { code: 'US', label: 'United States' },
  { code: 'EU', label: 'European Union' },
  { code: 'GB', label: 'United Kingdom' },
  { code: 'permissionless', label: 'Other (permissionless)' }
];

const KYC_TIERS = [
  { value: 'enhanced' as const, label: 'Enhanced KYC', desc: 'Full verification, all tranches' },
  { value: 'basic' as const, label: 'Basic KYC', desc: 'Standard verification, senior + mezzanine' },
  { value: 'none' as const, label: 'No KYC', desc: 'Sanctions screen only, junior tranche' }
];

export default function DepositPage() {
  const { address, isConnected } = useAccount();
  const { signTypedDataAsync } = useSignTypedData();

  const [step, setStep] = useState<Step>('connect');
  const [jurisdiction, setJurisdiction] = useState('US');
  const [kycTier, setKycTier] = useState<'none' | 'basic' | 'enhanced'>('basic');
  const [result, setResult] = useState<ComplianceResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);

  if (isConnected && step === 'connect') {
    setStep('verify');
  }
  if (!isConnected && step !== 'connect') {
    setStep('connect');
    setResult(null);
    setError(null);
  }

  async function handleVerify() {
    if (!address) return;
    setProcessing(true);
    setError(null);
    setStep('processing');

    try {
      const { proof, credentialEvidenceHash } = await generateStubCredential(
        address,
        jurisdiction,
        kycTier
      );

      const deadline = Math.floor(Date.now() / 1000) + 3600;
      const depositorAuthSignature = await signTypedDataAsync({
        domain: COMPLIANCE_DOMAIN,
        types: DEPOSITOR_AUTH_TYPES,
        primaryType: 'DepositorAuth',
        message: {
          wallet: address,
          credentialEvidenceHash: credentialEvidenceHash as `0x${string}`,
          deadline: BigInt(deadline)
        }
      });

      const response = await checkCompliance({
        wallet: address,
        credentialProof: proof,
        depositorAuthSignature,
        deadline
      });

      setResult(response);
      setStep('result');
    } catch (err: any) {
      setError(err?.shortMessage ?? err?.message ?? 'Something went wrong');
      setStep('verify');
    } finally {
      setProcessing(false);
    }
  }

  return (
    <div className="deposit-page">
      <header className="deposit-nav">
        <div className="wrap deposit-nav-inner">
          <a href="/" className="brand" aria-label="Strata, home">
            <MarkMini />
            <span className="brand-word"><b>STRATA</b></span>
          </a>
          <ConnectButton showBalance={false} chainStatus="icon" accountStatus="address" />
        </div>
      </header>

      <main className="wrap deposit-main">
        <div className="deposit-card">
          <div className="deposit-steps">
            <StepIndicator num={1} label="Connect" active={step === 'connect'} done={step !== 'connect'} />
            <div className="step-line" />
            <StepIndicator num={2} label="Verify" active={step === 'verify' || step === 'processing'} done={step === 'result'} />
            <div className="step-line" />
            <StepIndicator num={3} label="Deposit" active={step === 'result'} done={false} />
          </div>

          {step === 'connect' && (
            <div className="deposit-section">
              <h2 className="deposit-title">Connect your wallet</h2>
              <p className="deposit-desc">Connect your wallet to begin the compliance verification process.</p>
              <div className="deposit-connect-wrap">
                <ConnectButton />
              </div>
            </div>
          )}

          {step === 'verify' && (
            <div className="deposit-section">
              <h2 className="deposit-title">Verify your identity</h2>
              <p className="deposit-desc">
                Select your jurisdiction and KYC tier. You will be asked to sign an authorization message in your wallet.
              </p>

              <div className="deposit-form">
                <label className="deposit-label">
                  <span>Jurisdiction</span>
                  <select
                    className="deposit-select"
                    value={jurisdiction}
                    onChange={(e) => setJurisdiction(e.target.value)}
                  >
                    {JURISDICTIONS.map((j) => (
                      <option key={j.code} value={j.code}>{j.label}</option>
                    ))}
                  </select>
                </label>

                <div className="tier-grid">
                  {KYC_TIERS.map((t) => (
                    <button
                      key={t.value}
                      className={`tier-card ${kycTier === t.value ? 'tier-active' : ''}`}
                      onClick={() => setKycTier(t.value)}
                    >
                      <span className="tier-name">{t.label}</span>
                      <span className="tier-desc">{t.desc}</span>
                    </button>
                  ))}
                </div>

                {error && <div className="deposit-error">{error}</div>}

                <button className="btn-cta deposit-submit" onClick={handleVerify}>
                  Sign and verify
                  <svg className="arrow" width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                    <path d="M2 6h8M7 3l3 3-3 3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
              </div>

              <div className="deposit-note">
                <p>This is a hackathon demo using stub credentials. No real identity data is collected or stored.</p>
              </div>
            </div>
          )}

          {step === 'processing' && (
            <div className="deposit-section deposit-center">
              <div className="spinner" />
              <h2 className="deposit-title">Verifying...</h2>
              <p className="deposit-desc">Running credential verification, sanctions screening, and policy lookup.</p>
            </div>
          )}

          {step === 'result' && result && (
            <div className="deposit-section">
              {result.status === 'denied' ? (
                <>
                  <div className="result-icon result-denied">X</div>
                  <h2 className="deposit-title">Verification denied</h2>
                  <p className="deposit-desc">Reason: {result.reason}</p>
                  <button className="btn-ghost" onClick={() => { setStep('verify'); setResult(null); }}>
                    Try again
                  </button>
                </>
              ) : (
                <>
                  <div className="result-icon result-approved">&#10003;</div>
                  <h2 className="deposit-title">Verification approved</h2>
                  {result.status === 'approved' && (
                    <p className="deposit-desc deposit-mono">Receipt CID: {result.receiptCid}</p>
                  )}
                  <div className="tranche-results">
                    {(() => {
                      const mask = result.permittedTranchesMask;
                      const decoded = decodeMask(mask);
                      return (
                        <>
                          <TrancheCard
                            name="Senior"
                            tier="senior"
                            apy="5.4%"
                            desc="First on yield, last on loss"
                            permitted={decoded.senior}
                          />
                          <TrancheCard
                            name="Mezzanine"
                            tier="mezz"
                            apy="9.2%"
                            desc="Balanced risk and return"
                            permitted={decoded.mezzanine}
                          />
                          <TrancheCard
                            name="Junior"
                            tier="junior"
                            apy="18%+"
                            desc="First loss, highest yield"
                            permitted={decoded.junior}
                          />
                        </>
                      );
                    })()}
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

function StepIndicator({ num, label, active, done }: { num: number; label: string; active: boolean; done: boolean }) {
  return (
    <div className={`step-ind ${active ? 'step-active' : ''} ${done ? 'step-done' : ''}`}>
      <div className="step-circle">{done ? '✓' : num}</div>
      <span className="step-label">{label}</span>
    </div>
  );
}

function TrancheCard({ name, tier, apy, desc, permitted }: {
  name: string;
  tier: string;
  apy: string;
  desc: string;
  permitted: boolean;
}) {
  return (
    <div className={`tranche-result-card ${tier} ${permitted ? 'tranche-permitted' : 'tranche-blocked'}`}>
      <div className="trc-header">
        <span className="trc-name">{name}</span>
        <span className={`trc-badge ${permitted ? 'trc-yes' : 'trc-no'}`}>
          {permitted ? 'Permitted' : 'Not available'}
        </span>
      </div>
      <div className="trc-apy">{apy}</div>
      <p className="trc-desc">{desc}</p>
      {permitted && (
        <button className="btn-cta trc-deposit" disabled>
          Deposit (coming soon)
        </button>
      )}
    </div>
  );
}
