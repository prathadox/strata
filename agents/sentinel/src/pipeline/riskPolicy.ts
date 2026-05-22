import type { YieldMap, ScoredOpportunity as Opportunity, VerdictLevel } from '@strata/scout/types';
import type { AllocationProposal } from '../ipfs/fetch.js';
import type { RiskReason } from '../types.js';

export const RISK_CONSTANTS = Object.freeze({
  depegBpsThresholdByTranche:    Object.freeze({ senior: 50,         mezzanine: 200,       junior: 500       }),
  tvlFloorUsdByTranche:          Object.freeze({ senior: 50_000_000, mezzanine: 10_000_000, junior: 1_000_000 }),
  concentrationWarnBpsByTranche: Object.freeze({ senior: 4500,       mezzanine: 3500,      junior: 2000      }),
  smartMoneyOutflow7dRedUsd:     -5_000_000,
  hedgeDeltaCapUsd:              250_000
});

export interface RiskEvaluationInput {
  proposal: AllocationProposal;
  map: YieldMap;
  netExposure: Record<string, bigint>;
  totalDepositsBaselineUsd: number;
}

export interface PendingHedgeSignal {
  hedgedAsset: `0x${string}`;
  targetNotionalUsd: bigint;
  direction: 'long' | 'short';
}

export interface RiskEvaluation {
  tranches: { senior: VerdictLevel; mezzanine: VerdictLevel; junior: VerdictLevel };
  perPositionVerdicts: Record<string, VerdictLevel>;
  reasons: RiskReason[];
  hedgeSignals: PendingHedgeSignal[];
}

type TrancheKey = 'senior' | 'mezzanine' | 'junior';

function worst(a: VerdictLevel, b: VerdictLevel): VerdictLevel {
  const rank = { green: 0, yellow: 1, red: 2 } as const;
  return rank[a] >= rank[b] ? a : b;
}

export function evaluateRisk(input: RiskEvaluationInput): RiskEvaluation {
  const { proposal, map, netExposure, totalDepositsBaselineUsd } = input;
  const oppById = new Map<string, Opportunity>(map.opportunities.map((o) => [o.id, o]));
  const perPositionVerdicts: Record<string, VerdictLevel> = {};
  const reasons: RiskReason[] = [];
  const trancheVerdicts: Record<TrancheKey, VerdictLevel> = { senior: 'green', mezzanine: 'green', junior: 'green' };

  const tKeys: TrancheKey[] = ['senior', 'mezzanine', 'junior'];
  for (const T of tKeys) {
    const trAlloc = proposal.tranches[T];
    if (trAlloc.bps === 0) { trancheVerdicts[T] = 'green'; continue; }
    let yellowCount = 0;
    let redCount = 0;
    const positionEntries = Object.entries(trAlloc.positions);
    // Concentration warn applies only when the proposer had a real choice
    // (2+ positions). A solo position is treated as intentional consolidation.
    const concentrationApplies = positionEntries.length >= 2;
    for (const [oppId, bps] of positionEntries) {
      const opp = oppById.get(oppId);
      let v: VerdictLevel = 'green';
      if (!opp) {
        v = 'red';
        reasons.push({ severity: 'red', code: 'unknown-opportunity', target: oppId, message: `position ${oppId} not in source YieldMap` });
      } else {
        if ((opp as any).depegHistory && (opp as any).depegHistory.maxDeviationBps > RISK_CONSTANTS.depegBpsThresholdByTranche[T]) {
          v = worst(v, 'yellow');
          reasons.push({ severity: 'yellow', code: 'depeg-history-breach', target: oppId, message: `maxDeviationBps=${(opp as any).depegHistory.maxDeviationBps} > ${RISK_CONSTANTS.depegBpsThresholdByTranche[T]} (${T} threshold)` });
        }
        if (opp.tvlUsd < RISK_CONSTANTS.tvlFloorUsdByTranche[T]) {
          v = worst(v, 'yellow');
          reasons.push({ severity: 'yellow', code: 'tvl-below-floor', target: oppId, message: `tvlUsd=${opp.tvlUsd} < ${RISK_CONSTANTS.tvlFloorUsdByTranche[T]} (${T} floor)` });
        }
        if (concentrationApplies && bps > RISK_CONSTANTS.concentrationWarnBpsByTranche[T]) {
          v = worst(v, 'yellow');
          reasons.push({ severity: 'yellow', code: 'concentration-warn', target: oppId, message: `bps=${bps} > ${RISK_CONSTANTS.concentrationWarnBpsByTranche[T]} warn cap (${T})` });
        }
        const flow = (opp as any).nansenNetFlow7dUsd ?? 0;
        if (flow < RISK_CONSTANTS.smartMoneyOutflow7dRedUsd) {
          v = worst(v, 'red');
          reasons.push({ severity: 'red', code: 'smart-money-outflow', target: oppId, message: `nansenNetFlow7dUsd=${flow} < ${RISK_CONSTANTS.smartMoneyOutflow7dRedUsd}` });
        }
      }
      perPositionVerdicts[oppId] = v;
      if (v === 'yellow') yellowCount++;
      if (v === 'red') redCount++;
    }
    if (redCount >= 1 || yellowCount >= 2) trancheVerdicts[T] = 'red';
    else if (yellowCount === 1) trancheVerdicts[T] = 'yellow';
    else trancheVerdicts[T] = 'green';
  }

  // Hedge-signal detection
  const grossUsdByAsset = new Map<string, number>();
  for (const T of tKeys) {
    const trAlloc = proposal.tranches[T];
    if (trAlloc.bps === 0) continue;
    const trancheUsd = totalDepositsBaselineUsd * (trAlloc.bps / 10_000);
    for (const [oppId, posBps] of Object.entries(trAlloc.positions)) {
      const opp = oppById.get(oppId);
      if (!opp) continue;
      const asset = ((opp as any).tokenAddress as string).toLowerCase();
      const posUsd = trancheUsd * (posBps / 10_000);
      grossUsdByAsset.set(asset, (grossUsdByAsset.get(asset) ?? 0) + posUsd);
    }
  }

  const hedgeSignals: PendingHedgeSignal[] = [];
  for (const [asset, grossUsd] of grossUsdByAsset.entries()) {
    const hedgeRaw = netExposure[asset] ?? 0n;
    const hedgeUsd = Number(hedgeRaw);
    const deltaUsd = grossUsd - hedgeUsd;
    if (Math.abs(deltaUsd) > RISK_CONSTANTS.hedgeDeltaCapUsd) {
      hedgeSignals.push({
        hedgedAsset: asset as `0x${string}`,
        targetNotionalUsd: BigInt(Math.round(deltaUsd)),
        direction: deltaUsd > 0 ? 'short' : 'long'
      });
    }
  }
  hedgeSignals.sort((a, b) => a.hedgedAsset.localeCompare(b.hedgedAsset));

  return { tranches: trancheVerdicts, perPositionVerdicts, reasons, hedgeSignals };
}
