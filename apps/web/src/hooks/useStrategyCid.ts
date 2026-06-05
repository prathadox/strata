'use client';

import { useEffect, useState } from 'react';
import { fetchStrategyCid, FALLBACK_STRATEGY_CIDS } from '@/lib/onchain';

// Resolves an agent's strategy CID from ERC-8004 `Identity.tokenURI(agentId)` and
// falls back to the hardcoded constant if the chain read fails. Cached in-module
// across the page lifetime by `fetchStrategyCid`.
export function useStrategyCid(agentId: number): { cid: string; loading: boolean } {
  const fallback = FALLBACK_STRATEGY_CIDS[agentId] ?? '';
  const [cid, setCid] = useState<string>(fallback);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    let cancelled = false;
    fetchStrategyCid(agentId).then((resolved) => {
      if (cancelled) return;
      setCid(resolved);
      setLoading(false);
    });
    return () => { cancelled = true; };
  }, [agentId]);

  return { cid, loading };
}
