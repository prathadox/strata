import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { setupServer } from 'msw/node';
import { http, HttpResponse } from 'msw';
import { fetchSmartMoneyFlow } from '../../src/pipeline/enrichment/smartMoneyFlow.js';

const addr = '0x' + 'a'.repeat(40);

const server = setupServer();
beforeAll(() => server.listen({ onUnhandledRequest: 'error' }));
afterAll(() => server.close());

describe('fetchSmartMoneyFlow', () => {
  it('maps Nansen response to canonical signal', async () => {
    server.use(
      http.get(`https://api.nansen.ai/v1/tokens/mantle/${addr}/holders-summary`, () =>
        HttpResponse.json({
          smart_holder_pct: 0.18,
          fresh_wallet_inflow_pct: 0.07,
          wash_trade_flag: false
        })
      )
    );
    const out = await fetchSmartMoneyFlow(addr, 'nansen-key');
    expect(out).not.toBeNull();
    expect(out!.smartHolderPct).toBeCloseTo(0.18);
    expect(out!.freshWalletInflowPct).toBeCloseTo(0.07);
    expect(out!.washTradeFlag).toBe(false);
  });

  it('returns null on 429 (rate limit)', async () => {
    server.use(
      http.get(`https://api.nansen.ai/v1/tokens/mantle/${addr}/holders-summary`, () =>
        new HttpResponse(null, { status: 429 })
      )
    );
    const out = await fetchSmartMoneyFlow(addr, 'nansen-key');
    expect(out).toBeNull();
  });

  it('returns null on other non-2xx responses', async () => {
    server.use(
      http.get(`https://api.nansen.ai/v1/tokens/mantle/${addr}/holders-summary`, () =>
        new HttpResponse(null, { status: 500 })
      )
    );
    const out = await fetchSmartMoneyFlow(addr, 'nansen-key');
    expect(out).toBeNull();
  });

  it('returns null when response shape is unexpected', async () => {
    server.use(
      http.get(`https://api.nansen.ai/v1/tokens/mantle/${addr}/holders-summary`, () =>
        HttpResponse.json({ unrelated: 'shape' })
      )
    );
    const out = await fetchSmartMoneyFlow(addr, 'nansen-key');
    expect(out).toBeNull();
  });
});
