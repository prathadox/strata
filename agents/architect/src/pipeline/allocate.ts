import type { YieldMap, ScoredOpportunity, Tranche } from '@strata/scout/types';

export const ALLOCATION_CONSTANTS = Object.freeze({
  trancheTargetBps: Object.freeze({ senior: 5000, mezzanine: 3000, junior: 2000 }),
  concentrationCapBps: Object.freeze({ senior: 6000, mezzanine: 4000, junior: 2500 })
});

export interface TrancheAllocation { bps: number; positions: Record<string, number>; }

export function allocate(map: YieldMap): Record<Tranche, TrancheAllocation> {
  const out = {
    senior: allocateOneTranche('senior', map.opportunities),
    mezzanine: allocateOneTranche('mezzanine', map.opportunities),
    junior: allocateOneTranche('junior', map.opportunities)
  };

  // Re-zero a tranche's bps if it ended up with no positions.
  const present = (Object.entries(out) as [Tranche, TrancheAllocation][])
    .filter(([, a]) => Object.keys(a.positions).length > 0);

  if (present.length === 0) return out;

  // Normalize the present tranches' bps to sum to 10000.
  const totalRaw = present.reduce((s, [t]) => s + ALLOCATION_CONSTANTS.trancheTargetBps[t], 0);
  for (const [t, alloc] of present) {
    alloc.bps = Math.floor((ALLOCATION_CONSTANTS.trancheTargetBps[t] / totalRaw) * 10_000);
  }

  // Top up rounding error to one of the tranches.
  const sum = (Object.values(out) as TrancheAllocation[]).reduce((s, a) => s + a.bps, 0);
  if (sum < 10_000 && present.length > 0) present[0]![1].bps += (10_000 - sum);

  return out;
}

function allocateOneTranche(t: Tranche, all: ScoredOpportunity[]): TrancheAllocation {
  const eligible = all
    .filter((o) => o.eligibleTranches.includes(t) && o.score > 0)
    // Sort descending by score so the top-up goes to the highest-score position.
    .sort((a, b) => b.score - a.score);

  if (eligible.length === 0) return { bps: 0, positions: {} };

  // First pass: pure score-weighted bps.
  const totalScore = eligible.reduce((s, o) => s + o.score, 0);
  const bpsByOpp: Record<string, number> = {};
  for (const o of eligible) bpsByOpp[o.id] = Math.floor((o.score / totalScore) * 10_000);

  // Apply concentration cap.
  const cap = ALLOCATION_CONSTANTS.concentrationCapBps[t];
  let overflow = 0;
  const uncapped: string[] = [];
  for (const id of Object.keys(bpsByOpp)) {
    if (bpsByOpp[id]! > cap) {
      overflow += bpsByOpp[id]! - cap;
      bpsByOpp[id] = cap;
    } else {
      uncapped.push(id);
    }
  }

  // Redistribute overflow proportionally across uncapped positions.
  while (overflow > 0 && uncapped.length > 0) {
    const totalUncappedScore = uncapped.reduce(
      (s, id) => s + eligible.find((o) => o.id === id)!.score,
      0
    );
    const next: string[] = [];
    let remaining = 0;
    for (const id of uncapped) {
      const o = eligible.find((x) => x.id === id)!;
      const share = Math.floor((o.score / totalUncappedScore) * overflow);
      const candidate = bpsByOpp[id]! + share;
      if (candidate > cap) {
        remaining += candidate - cap;
        bpsByOpp[id] = cap;
      } else {
        bpsByOpp[id] = candidate;
        next.push(id);
      }
    }
    overflow = remaining;
    uncapped.length = 0;
    uncapped.push(...next);
    if (next.length === 0) break;
  }

  // Top up rounding error to the highest-score position that is below the cap.
  // When the tranche has fewer than ceil(10000/cap) eligible positions, every
  // position is at the cap and there is no headroom: the sum-to-10000 invariant
  // (required by AllocationProposalSchema) takes precedence and the top-up lands
  // on the highest-score position even though it pushes that position above the
  // cap. This is intentional: in a sparse tranche, breaching the cap is the only
  // way to preserve the canonical bps-sum invariant.
  const positionSum = Object.values(bpsByOpp).reduce((s, v) => s + v, 0);
  if (positionSum < 10_000) {
    const topId = eligible.find((o) => bpsByOpp[o.id]! < cap)?.id ?? eligible[0]!.id;
    bpsByOpp[topId] = bpsByOpp[topId]! + (10_000 - positionSum);
  }

  return { bps: ALLOCATION_CONSTANTS.trancheTargetBps[t], positions: bpsByOpp };
}
