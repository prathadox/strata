import { describe, it, expect } from 'vitest';
import type { JurisdictionPolicy } from '../../src/types.js';
import { routeTranches } from '../../src/pipeline/trancheRouter.js';

const usPolicy = {
  permittedTranchesByKycTier: { none: 4, basic: 3, enhanced: 7 }
} as JurisdictionPolicy;

const permissionlessPolicy = {
  permittedTranchesByKycTier: { none: 4, basic: 4, enhanced: 4 }
} as JurisdictionPolicy;

const blockedPolicy = {
  permittedTranchesByKycTier: { none: 0, basic: 0, enhanced: 0 }
} as JurisdictionPolicy;

describe('routeTranches', () => {
  it('US policy, basic tier, sanctions clear - senior + mezzanine', () => {
    const result = routeTranches(usPolicy, 'basic', true);
    expect(result).toEqual({ permitted: true, mask: 3 });
  });

  it('US policy, none tier, sanctions clear - junior only', () => {
    const result = routeTranches(usPolicy, 'none', true);
    expect(result).toEqual({ permitted: true, mask: 4 });
  });

  it('US policy, enhanced tier, sanctions clear - all tranches', () => {
    const result = routeTranches(usPolicy, 'enhanced', true);
    expect(result).toEqual({ permitted: true, mask: 7 });
  });

  it('permissionless policy, enhanced tier, sanctions clear - junior only', () => {
    const result = routeTranches(permissionlessPolicy, 'enhanced', true);
    expect(result).toEqual({ permitted: true, mask: 4 });
  });

  it('sanctioned wallet returns mask=0 regardless of policy or tier', () => {
    const result = routeTranches(usPolicy, 'enhanced', false);
    expect(result).toEqual({ permitted: false, mask: 0 });
  });

  it('all-zero policy returns permitted=false even with sanctions clear', () => {
    const result = routeTranches(blockedPolicy, 'enhanced', true);
    expect(result).toEqual({ permitted: false, mask: 0 });
  });
});
