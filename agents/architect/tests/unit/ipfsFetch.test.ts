import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest';
import { setupServer } from 'msw/node';
import { http, HttpResponse } from 'msw';
import { YieldMapSchema } from '@strata/scout/types';
import { fetchYieldMapByCid } from '../../src/ipfs/fetch.js';

const server = setupServer();
beforeAll(() => server.listen({ onUnhandledRequest: 'error' }));
afterAll(() => server.close());
beforeEach(() => server.resetHandlers());

const TEST_CID = 'bafkreitestcidabcdef1234567890';

// Minimal valid YieldMap fixture that satisfies YieldMapSchema.
const VALID_MAP = {
  version: '1.0' as const,
  publishedAtMs: 1_700_000_000_000,
  publisher: {
    address: '0xabcdefabcdefabcdefabcdefabcdefabcdefabcd',
    identityNFT: 'ipfs://QmTest'
  },
  methodologyHash: 'sha256:abc123',
  codeCommit: 'a1b2c3d4e5f6',
  sourcesQueried: ['aave' as const],
  sourcesDegraded: [],
  opportunities: [],
  perTranche: {
    senior: [],
    mezzanine: [],
    junior: []
  },
  signature: '0xdeadbeef'
};

// Verify the fixture is valid before trusting it in tests.
const fixtureCheck = YieldMapSchema.safeParse(VALID_MAP);
if (!fixtureCheck.success) {
  throw new Error(`Test fixture is not a valid YieldMap: ${JSON.stringify(fixtureCheck.error.flatten())}`);
}

describe('fetchYieldMapByCid', () => {
  it('returns the parsed map when Lighthouse returns a valid YieldMap (200)', async () => {
    server.use(
      http.get(`https://gateway.lighthouse.storage/ipfs/${TEST_CID}`, () =>
        HttpResponse.json(VALID_MAP)
      )
    );
    const result = await fetchYieldMapByCid(TEST_CID);
    expect(result.version).toBe('1.0');
    expect(result.publishedAtMs).toBe(VALID_MAP.publishedAtMs);
    expect(result.signature).toBe(VALID_MAP.signature);
  });

  it('falls back to ipfs.io when Lighthouse returns 500', async () => {
    server.use(
      http.get(`https://gateway.lighthouse.storage/ipfs/${TEST_CID}`, () =>
        new HttpResponse(null, { status: 500 })
      ),
      http.get(`https://ipfs.io/ipfs/${TEST_CID}`, () =>
        HttpResponse.json(VALID_MAP)
      )
    );
    const result = await fetchYieldMapByCid(TEST_CID);
    expect(result.version).toBe('1.0');
    expect(result.signature).toBe(VALID_MAP.signature);
  });

  it('throws an error mentioning the CID when all three gateways return 500', async () => {
    server.use(
      http.get(`https://gateway.lighthouse.storage/ipfs/${TEST_CID}`, () =>
        new HttpResponse(null, { status: 500 })
      ),
      http.get(`https://ipfs.io/ipfs/${TEST_CID}`, () =>
        new HttpResponse(null, { status: 500 })
      ),
      http.get(`https://dweb.link/ipfs/${TEST_CID}`, () =>
        new HttpResponse(null, { status: 500 })
      )
    );
    await expect(fetchYieldMapByCid(TEST_CID)).rejects.toThrow(TEST_CID);
  });

  it('falls through to dweb.link when both Lighthouse and ipfs.io return 500', async () => {
    server.use(
      http.get(`https://gateway.lighthouse.storage/ipfs/${TEST_CID}`, () =>
        new HttpResponse(null, { status: 500 })
      ),
      http.get(`https://ipfs.io/ipfs/${TEST_CID}`, () =>
        new HttpResponse(null, { status: 500 })
      ),
      http.get(`https://dweb.link/ipfs/${TEST_CID}`, () =>
        HttpResponse.json(VALID_MAP)
      )
    );
    const result = await fetchYieldMapByCid(TEST_CID);
    expect(result.version).toBe('1.0');
    expect(result.signature).toBe(VALID_MAP.signature);
  });

  it('advances past Lighthouse on schema mismatch and returns map from ipfs.io', async () => {
    const badBody = { unrelated: 'shape', missing: 'required fields' };
    server.use(
      http.get(`https://gateway.lighthouse.storage/ipfs/${TEST_CID}`, () =>
        HttpResponse.json(badBody)
      ),
      http.get(`https://ipfs.io/ipfs/${TEST_CID}`, () =>
        HttpResponse.json(VALID_MAP)
      )
    );
    const result = await fetchYieldMapByCid(TEST_CID);
    expect(result.version).toBe('1.0');
    expect(result.signature).toBe(VALID_MAP.signature);
  });
}, { timeout: 15_000 });
