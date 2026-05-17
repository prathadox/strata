import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest';
import { setupServer } from 'msw/node';
import { http, HttpResponse } from 'msw';
import { pinYieldMap } from '../../src/publication/ipfs.js';

const server = setupServer();
beforeAll(() => server.listen({ onUnhandledRequest: 'error' }));
afterAll(() => server.close());
beforeEach(() => server.resetHandlers());

describe('pinYieldMap (lighthouse)', () => {
  it('returns the Hash on a 200 response', async () => {
    server.use(
      http.post('https://node.lighthouse.storage/api/v0/add', () =>
        HttpResponse.json({ Name: 'data', Hash: 'bafkreigh2akiscaildc...', Size: '42' })
      )
    );
    const result = await pinYieldMap({ foo: 'bar' }, { lighthouseApiKey: 'lh-key' });
    expect(result.cid).toBe('bafkreigh2akiscaildc...');
  });

  it('retries on 500 then succeeds on 200', async () => {
    let calls = 0;
    server.use(
      http.post('https://node.lighthouse.storage/api/v0/add', () => {
        calls++;
        if (calls === 1) return new HttpResponse(null, { status: 500 });
        return HttpResponse.json({ Name: 'data', Hash: 'bafkrei-retry', Size: '0' });
      })
    );
    const result = await pinYieldMap({ x: 1 }, { lighthouseApiKey: 'lh-key' });
    expect(result.cid).toBe('bafkrei-retry');
    expect(calls).toBe(2);
  });

  it('throws after all retries fail', async () => {
    server.use(
      http.post('https://node.lighthouse.storage/api/v0/add', () =>
        new HttpResponse(null, { status: 503 })
      )
    );
    await expect(pinYieldMap({ x: 1 }, { lighthouseApiKey: 'lh-key' })).rejects.toThrow(/lighthouse/);
  });

  it('throws on unexpected response shape', async () => {
    server.use(
      http.post('https://node.lighthouse.storage/api/v0/add', () =>
        HttpResponse.json({ unrelated: 'shape' })
      )
    );
    await expect(pinYieldMap({ x: 1 }, { lighthouseApiKey: 'lh-key' })).rejects.toThrow();
  });
}, { timeout: 15_000 });
