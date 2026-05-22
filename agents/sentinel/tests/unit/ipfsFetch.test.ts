import { describe, it, expect, beforeAll, afterAll, afterEach, beforeEach } from 'vitest';
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

const validYieldMap = {
  version: '1.0',
  publishedAtMs: 1_700_000_000_000,
  publisher: { address: '0x' + 'a'.repeat(40), identityNFT: 'ipfs://x' },
  methodologyHash: '0x' + '1'.repeat(64),
  codeCommit: 'deadbeef',
  sourcesQueried: [],
  sourcesDegraded: [],
  opportunities: [],
  perTranche: { senior: [], mezzanine: [], junior: [] },
  signature: '0xsig'
};

const calls: string[] = [];

const server = setupServer(
  http.get('https://gateway.lighthouse.storage/ipfs/:cid', () => {
    calls.push('lighthouse');
    return HttpResponse.text('boom', { status: 500 });
  }),
  http.get('https://ipfs.io/ipfs/:cid', () => {
    calls.push('ipfs.io');
    return HttpResponse.json(validProposal);
  }),
  http.get('https://dweb.link/ipfs/:cid', () => {
    calls.push('dweb.link');
    return HttpResponse.text('unused', { status: 500 });
  })
);
beforeAll(() => server.listen());
beforeEach(() => { calls.length = 0; });
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe('fetchAllocationProposalByCid', () => {
  it('falls back to ipfs.io when lighthouse fails', async () => {
    const got = await fetchAllocationProposalByCid('bafyProp');
    expect(got.proposalId).toBe('1');
    expect(calls[0]).toBe('lighthouse');
    expect(calls.includes('ipfs.io')).toBe(true);
  });
});

describe('fetchYieldMapByCid', () => {
  it('returns parsed yield map when lighthouse returns 200', async () => {
    server.use(
      http.get('https://gateway.lighthouse.storage/ipfs/:cid', () => {
        calls.push('lighthouse');
        return HttpResponse.json(validYieldMap);
      })
    );
    const got = await fetchYieldMapByCid('bafyMap');
    expect(got.version).toBe('1.0');
  });
});
