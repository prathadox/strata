import { describe, it, expect, vi, afterEach } from 'vitest';
import { buildServer } from '../../src/api/server.js';

function mockDeps(gateResult: any) {
  return {
    orchestrator: { runGateCycle: vi.fn().mockResolvedValue(gateResult) },
    health: {
      recordReceipt: vi.fn(),
      recordDenial: vi.fn(),
      asJson: () => ({ status: 'ok', lastReceiptAt: null, lastDenialAt: null })
    },
    metrics: {
      registry: { metrics: vi.fn().mockResolvedValue(''), contentType: 'text/plain' },
      checksTotal: { inc: vi.fn() },
      receiptsTotal: { inc: vi.fn() },
      denialsTotal: { inc: vi.fn() },
      verificationFailures: { inc: vi.fn() },
      lastReceiptMs: { set: vi.fn() }
    }
  } as any;
}

const validBody = {
  wallet: '0x' + 'aa'.repeat(20),
  credentialProof: {
    issuer: '0x' + 'bb'.repeat(20),
    wallet: '0x' + 'aa'.repeat(20),
    kycTier: 'basic',
    jurisdictionCode: 'US',
    issuedAtSec: 1700000000,
    expiresAtSec: 1800000000,
    signature: '0x' + 'cc'.repeat(65)
  },
  depositorAuthSignature: '0x' + 'dd'.repeat(65),
  deadline: 1800000000
};

describe('POST /api/v1/compliance/check', () => {
  it('returns 200 with approved result', async () => {
    const deps = mockDeps({
      status: 'approved',
      receiptCid: 'bafyreceipt',
      evidenceCid: 'bafyevidence',
      receipt: {
        permittedTranchesMask: 3,
        kycExpiresAtSec: 1800000000,
        sanctionsScreenExpiresAtSec: 1700086400
      }
    });
    const app = await buildServer(deps);

    const res = await app.inject({
      method: 'POST',
      url: '/api/v1/compliance/check',
      payload: validBody
    });

    expect(res.statusCode).toBe(200);
    const body = res.json();
    expect(body.status).toBe('approved');
    expect(body.receiptCid).toBe('bafyreceipt');
    expect(body.permittedTranchesMask).toBe(3);
    expect(deps.metrics.checksTotal.inc).toHaveBeenCalled();
    expect(deps.metrics.receiptsTotal.inc).toHaveBeenCalled();
    expect(deps.health.recordReceipt).toHaveBeenCalled();

    await app.close();
  });

  it('returns 403 with denied result', async () => {
    const deps = mockDeps({
      status: 'denied',
      reason: 'sanctions-hit'
    });
    const app = await buildServer(deps);

    const res = await app.inject({
      method: 'POST',
      url: '/api/v1/compliance/check',
      payload: validBody
    });

    expect(res.statusCode).toBe(403);
    const body = res.json();
    expect(body.status).toBe('denied');
    expect(body.reason).toBe('sanctions-hit');
    expect(deps.metrics.denialsTotal.inc).toHaveBeenCalled();
    expect(deps.health.recordDenial).toHaveBeenCalled();

    await app.close();
  });

  it('returns 400 for invalid body (missing wallet)', async () => {
    const deps = mockDeps({ status: 'approved' });
    const app = await buildServer(deps);

    const { wallet, ...noWallet } = validBody;
    const res = await app.inject({
      method: 'POST',
      url: '/api/v1/compliance/check',
      payload: noWallet
    });

    expect(res.statusCode).toBe(400);
    const body = res.json();
    expect(body.error).toBe('invalid_request');
    expect(deps.orchestrator.runGateCycle).not.toHaveBeenCalled();

    await app.close();
  });
});

describe('GET /healthz', () => {
  it('returns 200 with health status', async () => {
    const deps = mockDeps({});
    const app = await buildServer(deps);

    const res = await app.inject({ method: 'GET', url: '/healthz' });

    expect(res.statusCode).toBe(200);
    const body = res.json();
    expect(body.status).toBe('ok');

    await app.close();
  });
});

describe('GET /metrics', () => {
  it('returns 200 with prometheus metrics', async () => {
    const deps = mockDeps({});
    const app = await buildServer(deps);

    const res = await app.inject({ method: 'GET', url: '/metrics' });

    expect(res.statusCode).toBe(200);
    expect(res.headers['content-type']).toBe('text/plain');

    await app.close();
  });
});
