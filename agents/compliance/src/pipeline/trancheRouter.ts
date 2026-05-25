import type { JurisdictionPolicy, KycTier } from '../types.js';

export interface RouteResult {
  permitted: boolean;
  mask: number;
}

export function routeTranches(
  policy: JurisdictionPolicy,
  kycTier: KycTier,
  sanctionsClear: boolean
): RouteResult {
  if (!sanctionsClear) return { permitted: false, mask: 0 };
  const mask = policy.permittedTranchesByKycTier[kycTier];
  return { permitted: mask > 0, mask };
}
