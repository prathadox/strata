import { describe, it, expect } from 'vitest';
import { AllocationProposalSchema } from '../../src/types.js';

const VALID_ADDRESS = '0xAbCdEf0123456789AbCdEf0123456789AbCdEf01';
const VALID_BYTES32 = '0x' + 'ab'.repeat(32);

const validProposal = {
  version: '1.0' as const,
  proposalId: '42',
  sourceMapCid: 'bafkreiabc123',
  publishedAtMs: 1700000000000,
  publisher: { address: VALID_ADDRESS, identityNFT: 'nft-1' },
  methodologyHash: VALID_BYTES32,
  codeCommit: 'abc123',
  tranches: {
    senior: {
      bps: 5000,
      positions: { poolA: 6000, poolB: 4000 }
    },
    mezzanine: {
      bps: 3000,
      positions: { poolC: 10000 }
    },
    junior: {
      bps: 2000,
      positions: { poolD: 5000, poolE: 5000 }
    }
  },
  netExposureAtProposalMs: {},
  signature: '0xsig'
};

describe('AllocationProposalSchema', () => {
  it('parses a well-formed proposal where senior+mezz+junior bps sum to 10000 and each tranche positions sum to 10000', () => {
    expect(() => AllocationProposalSchema.parse(validProposal)).not.toThrow();
  });

  it('fails when senior+mezz+junior bps sum to something other than 0 or 10000', () => {
    const badSum = {
      ...validProposal,
      tranches: {
        senior: { bps: 5000, positions: { poolA: 10000 } },
        mezzanine: { bps: 3000, positions: { poolC: 10000 } },
        junior: { bps: 1000, positions: { poolD: 10000 } }  // total = 9000
      }
    };
    const result = AllocationProposalSchema.safeParse(badSum);
    expect(result.success).toBe(false);
  });

  it('parses a zero-state proposal (all tranche bps = 0, all positions empty)', () => {
    const zeroState = {
      ...validProposal,
      tranches: {
        senior: { bps: 0, positions: {} },
        mezzanine: { bps: 0, positions: {} },
        junior: { bps: 0, positions: {} }
      }
    };
    expect(() => AllocationProposalSchema.parse(zeroState)).not.toThrow();
  });

  it('fails when a tranche has bps > 0 but its positions sum to != 10000', () => {
    const mismatch = {
      ...validProposal,
      tranches: {
        senior: { bps: 5000, positions: { poolA: 6000, poolB: 3000 } },  // sum = 9000, not 10000
        mezzanine: { bps: 3000, positions: { poolC: 10000 } },
        junior: { bps: 2000, positions: { poolD: 5000, poolE: 5000 } }
      }
    };
    const result = AllocationProposalSchema.safeParse(mismatch);
    expect(result.success).toBe(false);
  });
});
