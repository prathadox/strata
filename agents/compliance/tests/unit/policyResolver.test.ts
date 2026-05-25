import { describe, it, expect } from 'vitest';
import {
  createStubPolicyResolver,
  STUB_POLICIES,
} from '../../src/pipeline/policyResolver.js';
import { JurisdictionPolicySchema } from '../../src/types.js';

describe('createStubPolicyResolver', () => {
  const resolver = createStubPolicyResolver();

  it('resolves US with correct tranche masks', async () => {
    const policy = await resolver.resolve('US');
    expect(policy).not.toBeNull();
    expect(policy!.jurisdictionCode).toBe('US');
    expect(policy!.permittedTranchesByKycTier).toEqual({
      none: 4,
      basic: 3,
      enhanced: 7,
    });
  });

  it('resolves EU with correct tranche masks', async () => {
    const policy = await resolver.resolve('EU');
    expect(policy).not.toBeNull();
    expect(policy!.jurisdictionCode).toBe('EU');
    expect(policy!.permittedTranchesByKycTier).toEqual({
      none: 4,
      basic: 3,
      enhanced: 7,
    });
  });

  it('resolves GB with correct tranche masks', async () => {
    const policy = await resolver.resolve('GB');
    expect(policy).not.toBeNull();
    expect(policy!.jurisdictionCode).toBe('GB');
    expect(policy!.permittedTranchesByKycTier).toEqual({
      none: 4,
      basic: 3,
      enhanced: 7,
    });
  });

  it('resolves permissionless with junior-only for all tiers', async () => {
    const policy = await resolver.resolve('permissionless');
    expect(policy).not.toBeNull();
    expect(policy!.jurisdictionCode).toBe('permissionless');
    expect(policy!.permittedTranchesByKycTier).toEqual({
      none: 4,
      basic: 4,
      enhanced: 4,
    });
  });

  it('returns null for unknown jurisdiction', async () => {
    const policy = await resolver.resolve('UNKNOWN');
    expect(policy).toBeNull();
  });

  it('all stub policies pass JurisdictionPolicySchema validation', () => {
    for (const [code, policy] of Object.entries(STUB_POLICIES)) {
      const result = JurisdictionPolicySchema.safeParse(policy);
      expect(result.success, `policy for ${code} should validate`).toBe(true);
    }
  });
});
