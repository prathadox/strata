'use client';

// Compliance-gated deposit branch. Shared by the in-app DepositView and the standalone
// /deposit page. When the connected wallet has a ComplianceRegistry receipt (receiptOf
// returns non-zero) we surface a minimal Senior/Mezz/Junior deposit form wired to the
// ERC-4626 vaults. Otherwise the caller continues to render its "in beta" panel; this
// component only renders when the wallet IS whitelisted.

import { useEffect, useMemo, useState } from 'react';
import { parseUnits, formatUnits } from 'viem';
import { useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { VAULTS, explorer } from '@/lib/onchain';
import { appendDemoDeposit, isDemoDepositsEnabled, totalByTranche, type DemoDeposit, type TrancheKey as DemoTrancheKey } from '@/lib/demoDeposits';

// Mirrors contracts/deployments/5000.json; kept inline so the Vercel build doesn't
// need to reach outside apps/web (its tsconfig include is src-only).
const USDC_ADDRESS = '0x09Bc4E0D864854c6aFB6eB9A9cdF58aC190D0dF9' as const;
const USDC_DECIMALS = 6;

type TrancheKey = 'senior' | 'mezz' | 'junior';

const VAULT_ADDRESSES: Record<TrancheKey, `0x${string}`> = {
  senior: '0x7B70cd25c86E10F144f5D73A94f7F22c20aAA5db',
  mezz:   '0xa076cF50656621BdcB5e4a8bfc991294615be37C',
  junior: '0xCaedb62edC3C49Fe9c1A2F77c307fE92844ACc2F'
};

const ERC20_ABI = [
  {
    type: 'function', name: 'approve', stateMutability: 'nonpayable',
    inputs: [{ name: 'spender', type: 'address' }, { name: 'amount', type: 'uint256' }],
    outputs: [{ name: '', type: 'bool' }]
  },
  {
    type: 'function', name: 'allowance', stateMutability: 'view',
    inputs: [{ name: 'owner', type: 'address' }, { name: 'spender', type: 'address' }],
    outputs: [{ name: '', type: 'uint256' }]
  }
] as const;

const VAULT_ABI = [
  {
    type: 'function', name: 'deposit', stateMutability: 'nonpayable',
    inputs: [{ name: 'assets', type: 'uint256' }, { name: 'receiver', type: 'address' }],
    outputs: [{ name: '', type: 'uint256' }]
  },
  {
    type: 'function', name: 'balanceOf', stateMutability: 'view',
    inputs: [{ name: 'account', type: 'address' }],
    outputs: [{ name: '', type: 'uint256' }]
  }
] as const;

const TRANCHE_LABEL: Record<TrancheKey, string> = {
  senior: 'Senior',
  mezz: 'Mezzanine',
  junior: 'Junior'
};

const VAULT_META = {
  senior: VAULTS.find((v) => v.short === 'sSTRATA')!,
  mezz:   VAULTS.find((v) => v.short === 'mSTRATA')!,
  junior: VAULTS.find((v) => v.short === 'jSTRATA')!
};

interface DepositGateProps {
  wallet: `0x${string}`;
}

export function DepositGate({ wallet }: DepositGateProps) {
  const demoMode = isDemoDepositsEnabled();
  const [tranche, setTranche] = useState<TrancheKey>('senior');
  const [amount, setAmount] = useState<string>(demoMode ? '10' : '0.01');
  const [error, setError] = useState<string | null>(null);
  const [demoTotals, setDemoTotals] = useState<Record<DemoTrancheKey, number>>({ senior: 0, mezz: 0, junior: 0 });
  const [lastDemo, setLastDemo] = useState<DemoDeposit | null>(null);

  useEffect(() => {
    if (!demoMode) return;
    setDemoTotals(totalByTranche());
  }, [demoMode, lastDemo]);

  const vault = VAULT_ADDRESSES[tranche];

  const parsedAmount = useMemo(() => {
    try {
      const v = amount.trim();
      if (!v) return null;
      const n = parseUnits(v, USDC_DECIMALS);
      return n > 0n ? n : null;
    } catch {
      return null;
    }
  }, [amount]);

  const { data: allowance, refetch: refetchAllowance } = useReadContract({
    address: USDC_ADDRESS,
    abi: ERC20_ABI,
    functionName: 'allowance',
    args: [wallet, vault],
    query: { refetchInterval: 8_000 }
  });

  const { data: shares, refetch: refetchShares } = useReadContract({
    address: vault,
    abi: VAULT_ABI,
    functionName: 'balanceOf',
    args: [wallet],
    query: { refetchInterval: 8_000 }
  });

  const needsApproval = parsedAmount !== null && (allowance === undefined || (allowance as bigint) < parsedAmount);

  const approve = useWriteContract();
  const deposit = useWriteContract();

  const approveReceipt = useWaitForTransactionReceipt({ hash: approve.data });
  const depositReceipt = useWaitForTransactionReceipt({ hash: deposit.data });

  useEffect(() => {
    if (approveReceipt.isSuccess) {
      refetchAllowance();
    }
  }, [approveReceipt.isSuccess, refetchAllowance]);

  useEffect(() => {
    if (depositReceipt.isSuccess) {
      refetchShares();
      refetchAllowance();
    }
  }, [depositReceipt.isSuccess, refetchShares, refetchAllowance]);

  function handleApprove() {
    setError(null);
    if (!parsedAmount) { setError('Enter a positive USDC amount.'); return; }
    approve.writeContract({
      address: USDC_ADDRESS,
      abi: ERC20_ABI,
      functionName: 'approve',
      args: [vault, parsedAmount]
    });
  }

  function handleDeposit() {
    setError(null);
    if (!parsedAmount) { setError('Enter a positive USDC amount.'); return; }
    if (demoMode) {
      const entry = appendDemoDeposit({ tranche: tranche as DemoTrancheKey, amountUsdc: amount.trim() });
      setLastDemo(entry);
      return;
    }
    deposit.writeContract({
      address: vault,
      abi: VAULT_ABI,
      functionName: 'deposit',
      args: [parsedAmount, wallet]
    });
  }

  const approveBusy = approve.isPending || approveReceipt.isLoading;
  const depositBusy = deposit.isPending || depositReceipt.isLoading;
  const disabled = !parsedAmount;

  return (
    <div className="deposit-form" style={{ width: '100%', maxWidth: 460, margin: '0 auto' }}>
      <label className="deposit-label">
        <span>Tranche</span>
        <select
          className="deposit-select"
          value={tranche}
          onChange={(e) => setTranche(e.target.value as TrancheKey)}
        >
          <option value="senior">Senior · sSTRATA</option>
          <option value="mezz">Mezzanine · mSTRATA</option>
          <option value="junior">Junior · jSTRATA</option>
        </select>
      </label>

      <label className="deposit-label">
        <span>USDC amount</span>
        <input
          className="deposit-select"
          type="text"
          inputMode="decimal"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="0.01"
          style={{ backgroundImage: 'none', cursor: 'text' }}
        />
      </label>

      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
        {!demoMode && (
          <button
            type="button"
            className="btn-app btn-ghost"
            disabled={disabled || approveBusy || !needsApproval}
            onClick={handleApprove}
          >
            {approveBusy ? 'Approving…' : needsApproval ? 'Approve USDC' : 'Approved'}
          </button>
        )}
        <button
          type="button"
          className="btn-app btn-primary"
          disabled={disabled || (!demoMode && (depositBusy || needsApproval))}
          onClick={handleDeposit}
        >
          {demoMode
            ? `Simulate deposit to ${TRANCHE_LABEL[tranche]}`
            : depositBusy
              ? 'Depositing…'
              : `Deposit to ${TRANCHE_LABEL[tranche]}`}
        </button>
      </div>

      {error && <div className="deposit-error">{error}</div>}
      {approve.error && <div className="deposit-error">approve: {approve.error.message}</div>}
      {deposit.error && <div className="deposit-error">deposit: {deposit.error.message}</div>}

      <div className="deposit-note" style={{ textAlign: 'left', marginTop: 6 }}>
        <div>
          Vault: <a className="hash" href={explorer.address(vault)} target="_blank" rel="noreferrer">{VAULT_META[tranche].short}</a>
          {!demoMode && (
            <>
              {' · '}
              Allowance: {allowance !== undefined ? formatUnits(allowance as bigint, USDC_DECIMALS) : '…'} USDC
            </>
          )}
        </div>
        <div>
          Your shares:{' '}
          {demoMode
            ? `${demoTotals[tranche as DemoTrancheKey].toFixed(4)} ${VAULT_META[tranche].short} (sim)`
            : `${shares !== undefined ? formatUnits(shares as bigint, USDC_DECIMALS) : '…'} ${VAULT_META[tranche].short}`}
        </div>
        {demoMode && lastDemo && (
          <div>
            sim tx: <span className="hash">{lastDemo.txHash.slice(0, 10)}…{lastDemo.txHash.slice(-6)}</span> · recorded
          </div>
        )}
        {approve.data && (
          <div>
            approve tx: <a className="hash" href={explorer.tx(approve.data)} target="_blank" rel="noreferrer">{approve.data.slice(0, 10)}…{approve.data.slice(-6)}</a>
            {approveReceipt.isSuccess && ' · confirmed'}
          </div>
        )}
        {deposit.data && (
          <div>
            deposit tx: <a className="hash" href={explorer.tx(deposit.data)} target="_blank" rel="noreferrer">{deposit.data.slice(0, 10)}…{deposit.data.slice(-6)}</a>
            {depositReceipt.isSuccess && ' · confirmed'}
          </div>
        )}
      </div>
    </div>
  );
}
