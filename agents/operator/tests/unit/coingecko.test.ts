import { describe, it, expect, beforeAll, afterAll, afterEach } from 'vitest';
import { setupServer } from 'msw/node';
import { http, HttpResponse } from 'msw';
import { fetchSpotUsd } from '../../src/market/coingecko.js';

const server = setupServer(
  http.get('https://api.coingecko.com/api/v3/simple/token_price/mantle', ({ request }) => {
    const u = new URL(request.url);
    const addr = u.searchParams.get('contract_addresses')!;
    return HttpResponse.json({ [addr.toLowerCase()]: { usd: 2000.5 } });
  })
);
beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe('fetchSpotUsd', () => {
  it('returns the price for a known token', async () => {
    const price = await fetchSpotUsd('0xAbC' + '0'.repeat(37), 'demo-key');
    expect(price).toBe(2000.5);
  });

  it('throws when CoinGecko returns no price', async () => {
    server.use(
      http.get('https://api.coingecko.com/api/v3/simple/token_price/mantle', () => HttpResponse.json({}))
    );
    await expect(fetchSpotUsd('0xDeAd' + '0'.repeat(36), 'demo-key')).rejects.toThrow(/no price/);
  });
});
