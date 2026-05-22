import { describe, it, expect, beforeAll, afterAll, afterEach } from 'vitest';
import { setupServer } from 'msw/node';
import { http, HttpResponse } from 'msw';
import { fetchAllocationProposalByCid, fetchYieldMapByCid } from '../../src/ipfs/fetch.js';

const validProposal = {
  version: '1.0',
  proposalId: '1',
  sourceMapCid: 'bafyMap',
  publishedAtMs: 1_700_000_000_000,
  publisher: { address: '0x' + 'a'.repeat(40), identityNFT: 'ipfs://x' },
  methodologyHash: '0x' + '1'.repeat(64),
  codeCommit: 'deadbeef',
  tranches: {
    senior:    { bps: 10000, positions: { 'opp-1': 10000 } },
    mezzanine: { bps: 0,     positions: {} },
    junior:    { bps: 0,     positions: {} }
  },
  netExposureAtProposalMs: {},
  narrative: null,
  signature: '0xsig'
};

const server = setupServer(
  http.get('https://gateway.lighthouse.storage/ipfs/:cid', () => HttpResponse.text('boom', { status: 500 })),
  http.get('https://ipfs.io/ipfs/:cid', () => HttpResponse.json(validProposal)),
  http.get('https://dweb.link/ipfs/:cid', () => HttpResponse.text('unused', { status: 500 }))
);
beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe('fetchAllocationProposalByCid', () => {
  it('falls back to ipfs.io when lighthouse fails', async () => {
    const got = await fetchAllocationProposalByCid('bafyProp');
    expect(got?.proposalId).toBe('1');
  });
});
