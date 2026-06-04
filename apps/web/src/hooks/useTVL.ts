'use client';

import { useEffect, useState } from 'react';
import { createPublicClient, http, formatUnits } from 'viem';
import { mantle } from 'viem/chains';
import { VAULTS, CORE } from '@/lib/onchain';

const VAULT_ABI = [
  {
    type: 'function',
    name: 'totalAssets',
    stateMutability: 'view',
    inputs: [],
    outputs: [{ name: '', type: 'uint256' }]
  }
] as const;

const USDC_ABI = [
  {
    type: 'function',
    name: 'balanceOf',
    stateMutability: 'view',
    inputs: [{ name: '', type: 'address' }],
    outputs: [{ name: '', type: 'uint256' }]
  }
] as const;

const USDC_ADDRESS = '0x09Bc4E0D864854c6aFB6eB9A9cdF58aC190D0dF9' as const;
const CONTROLLER_ADDRESS = '0xF65C36F0a8DB43edAb9d70Ab7eec025eA61BCecA' as const;

export interface TVLData {
  senior: number;
  mezz: number;
  junior: number;
  controllerIdle: number;
  total: number;
  loading: boolean;
  error: string | null;
}

const initial: TVLData = {
  senior: 0, mezz: 0, junior: 0, controllerIdle: 0, total: 0,
  loading: true, error: null
};

export function useTVL(): TVLData {
  const [data, setData] = useState<TVLData>(initial);

  useEffect(() => {
    let cancelled = false;
    const client = createPublicClient({ chain: mantle, transport: http('https://rpc.mantle.xyz') });

    async function load() {
      try {
        const [senior, mezz, junior, idle] = await Promise.all([
          client.readContract({ address: VAULTS[0].address, abi: VAULT_ABI, functionName: 'totalAssets' }),
          client.readContract({ address: VAULTS[1].address, abi: VAULT_ABI, functionName: 'totalAssets' }),
          client.readContract({ address: VAULTS[2].address, abi: VAULT_ABI, functionName: 'totalAssets' }),
          client.readContract({ address: USDC_ADDRESS, abi: USDC_ABI, functionName: 'balanceOf', args: [CONTROLLER_ADDRESS] })
        ]);
        if (cancelled) return;
        const s = Number(formatUnits(senior as bigint, 6));
        const m = Number(formatUnits(mezz as bigint, 6));
        const j = Number(formatUnits(junior as bigint, 6));
        const ci = Number(formatUnits(idle as bigint, 6));
        setData({ senior: s, mezz: m, junior: j, controllerIdle: ci, total: s + m + j + ci, loading: false, error: null });
      } catch (err) {
        if (cancelled) return;
        setData({ ...initial, loading: false, error: err instanceof Error ? err.message : 'read failed' });
      }
    }

    load();
    const id = setInterval(load, 30_000);
    return () => { cancelled = true; clearInterval(id); };
  }, []);

  return data;
}

// Voids the unused import warning for CORE; we may surface "contracts deployed" elsewhere.
void CORE;
