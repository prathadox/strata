import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('@strata/scout/signer', () => ({
  signYieldMap: vi.fn()
}));
vi.mock('@strata/scout/ipfs', () => ({
  pinYieldMap: vi.fn()
}));
vi.mock('../../src/publication/onchain.js', () => ({
  proposeAllocationOnChain: vi.fn()
}));

import { signYieldMap } from '@strata/scout/signer';
import { pinYieldMap } from '@strata/scout/ipfs';
import { proposeAllocationOnChain } from '../../src/publication/onchain.js';
import { makePublisher } from '../../src/publication/publish.js';
import type { AllocationProposal } from '../../src/types.js';

const signMock = signYieldMap as ReturnType<typeof vi.fn>;
const pinMock = pinYieldMap as ReturnType<typeof vi.fn>;
const onchainMock = proposeAllocationOnChain as ReturnType<typeof vi.fn>;

const EVENT_BUS = `0x${'e'.repeat(40)}` as `0x${string}`;

const unsigned: Omit<AllocationProposal, 'signature'> = {
  version: '1.0',
  proposalId: '42',
  sourceMapCid: 'bafy_source',
  publishedAtMs: 1_700_000_000_000,
  publisher: { address: `0x${'a'.repeat(40)}`, identityNFT: 'nft-1' },
  methodologyHash: `0x${'c'.repeat(64)}`,
  codeCommit: 'abc1234',
  tranches: {
    senior: { bps: 5000, positions: { pool1: 10_000 } },
    mezzanine: { bps: 3000, positions: { pool2: 10_000 } },
    junior: { bps: 2000, positions: { pool3: 10_000 } }
  },
  netExposureAtProposalMs: {},
  narrative: null
};

// withNarrative is what the publisher folds narrative into before signing
const withNarrative = { ...unsigned, narrative: null };

const makeDeps = (dryRun: boolean) => ({
  wallet: {} as any,
  publicClient: {} as any,
  account: {} as any,
  lighthouseApiKey: 'lh-key',
  eventBus: EVENT_BUS,
  dryRun,
  geminiModel: 'gemini-2.5-flash'
});

beforeEach(() => {
  vi.clearAllMocks();
});

describe('makePublisher - publishProposal', () => {
  it('happy path (live mode): signs, pins, and emits on chain', async () => {
    signMock.mockResolvedValueOnce({ signature: '0xdeadbeef' });
    pinMock.mockResolvedValueOnce({ cid: 'bafy123' });
    onchainMock.mockResolvedValueOnce('0xabc...tx' as `0x${string}`);

    const deps = makeDeps(false);
    const publisher = makePublisher(deps);
    const result = await publisher.publishProposal(unsigned);

    // signer called with unsigned, wallet, account
    expect(signMock).toHaveBeenCalledOnce();
    expect(signMock).toHaveBeenCalledWith(unsigned, deps.wallet, deps.account);

    // pin called with the signed proposal (signature filled in)
    const expectedProposal: AllocationProposal = { ...unsigned, signature: '0xdeadbeef' };
    expect(pinMock).toHaveBeenCalledOnce();
    expect(pinMock).toHaveBeenCalledWith(expectedProposal, { lighthouseApiKey: 'lh-key' });

    // onchain called with correct bigints and reasoningHash=cid
    expect(onchainMock).toHaveBeenCalledOnce();
    const onchainArgs = onchainMock.mock.calls[0][0];
    expect(onchainArgs.proposalId).toBe(42n);
    expect(onchainArgs.seniorBps).toBe(5000n);
    expect(onchainArgs.mezzBps).toBe(3000n);
    expect(onchainArgs.juniorBps).toBe(2000n);
    expect(onchainArgs.reasoningHash).toBe('bafy123');
    expect(onchainArgs.wallet).toBe(deps.wallet);
    expect(onchainArgs.publicClient).toBe(deps.publicClient);
    expect(onchainArgs.account).toBe(deps.account);
    expect(onchainArgs.eventBus).toBe(EVENT_BUS);

    // result contains signed proposal, cid, txHash
    expect(result.proposal).toEqual(expectedProposal);
    expect(result.cid).toBe('bafy123');
    expect(result.txHash).toBe('0xabc...tx');
  });

  it('dry-run path: signs and pins but does NOT call onchain', async () => {
    signMock.mockResolvedValueOnce({ signature: '0xdeadbeef' });
    pinMock.mockResolvedValueOnce({ cid: 'bafy123' });

    const deps = makeDeps(true);
    const publisher = makePublisher(deps);
    const result = await publisher.publishProposal(unsigned);

    expect(signMock).toHaveBeenCalledOnce();
    expect(pinMock).toHaveBeenCalledOnce();
    expect(onchainMock).not.toHaveBeenCalled();

    expect(result.proposal).toEqual({ ...unsigned, signature: '0xdeadbeef' });
    expect(result.cid).toBe('bafy123');
    expect(result.txHash).toBeNull();
  });

  it('sign failure surfaces: rejects with same error, pin and onchain not called', async () => {
    const sigError = new Error('sign failed');
    signMock.mockRejectedValueOnce(sigError);

    const publisher = makePublisher(makeDeps(false));

    await expect(publisher.publishProposal(unsigned)).rejects.toThrow('sign failed');
    expect(pinMock).not.toHaveBeenCalled();
    expect(onchainMock).not.toHaveBeenCalled();
  });

  it('pin failure surfaces: rejects with same error, onchain not called', async () => {
    signMock.mockResolvedValueOnce({ signature: '0xdeadbeef' });
    const pinError = new Error('pin failed');
    pinMock.mockRejectedValueOnce(pinError);

    const publisher = makePublisher(makeDeps(false));

    await expect(publisher.publishProposal(unsigned)).rejects.toThrow('pin failed');
    expect(signMock).toHaveBeenCalledOnce();
    expect(onchainMock).not.toHaveBeenCalled();
  });
});
