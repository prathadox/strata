import Fastify from 'fastify';
import cors from '@fastify/cors';
import rateLimit from '@fastify/rate-limit';
import { z } from 'zod';
import type { GateOrchestrator } from '../pipeline/gateOrchestrator.js';
import type { HealthState } from '../monitor/health.js';
import type { ComplianceMetrics } from '../monitor/metrics.js';

const Address = z.string().regex(/^0x[a-fA-F0-9]{40}$/);
const HexString = z.string().regex(/^0x[a-fA-F0-9]+$/);

const CheckRequestSchema = z.object({
  wallet: Address,
  credentialProof: z.object({
    issuer: Address,
    wallet: Address,
    kycTier: z.enum(['none', 'basic', 'enhanced']),
    jurisdictionCode: z.string().min(1),
    issuedAtSec: z.number().int().positive(),
    expiresAtSec: z.number().int().positive(),
    signature: HexString
  }),
  depositorAuthSignature: HexString,
  deadline: z.number().int().positive()
});

export interface ServerDeps {
  orchestrator: GateOrchestrator;
  health: HealthState;
  metrics: ComplianceMetrics;
}

export async function buildServer(deps: ServerDeps) {
  const app = Fastify({ logger: false });

  await app.register(cors, { origin: true });
  await app.register(rateLimit, { max: 100, timeWindow: '1 minute' });

  app.post('/api/v1/compliance/check', async (request, reply) => {
    const parsed = CheckRequestSchema.safeParse(request.body);
    if (!parsed.success) {
      return reply.status(400).send({
        error: 'invalid_request',
        details: parsed.error.issues.map(i => i.path.join('.'))
      });
    }
    const { wallet, credentialProof, depositorAuthSignature, deadline } = parsed.data;

    deps.metrics.checksTotal.inc();

    try {
      const result = await deps.orchestrator.runGateCycle(
        wallet as `0x${string}`,
        credentialProof as any,
        depositorAuthSignature as `0x${string}`,
        deadline
      );

      if (result.status === 'approved') {
        deps.metrics.receiptsTotal.inc();
        const ts = Date.now();
        deps.metrics.lastReceiptMs.set(ts);
        deps.health.recordReceipt(ts);
        return reply.status(200).send({
          status: 'approved',
          receiptCid: result.receiptCid,
          permittedTranchesMask: result.receipt.permittedTranchesMask,
          kycExpiresAtSec: result.receipt.kycExpiresAtSec,
          sanctionsScreenExpiresAtSec: result.receipt.sanctionsScreenExpiresAtSec
        });
      }

      if (result.status === 'existing') {
        return reply.status(200).send({
          status: 'existing',
          receiptId: result.receipt.receiptId,
          permittedTranchesMask: result.receipt.mask,
          kycExpiresAtSec: result.receipt.kycExp,
          sanctionsScreenExpiresAtSec: result.receipt.sanctionsExp
        });
      }

      deps.metrics.denialsTotal.inc();
      deps.health.recordDenial(Date.now());
      return reply.status(403).send({
        status: 'denied',
        reason: result.reason
      });
    } catch (err) {
      deps.metrics.verificationFailures.inc();
      return reply.status(500).send({ error: 'internal_error' });
    }
  });

  app.get('/healthz', async (_request, reply) => {
    return reply.status(200).send(deps.health.asJson());
  });

  app.get('/metrics', async (_request, reply) => {
    const body = await deps.metrics.registry.metrics();
    return reply.header('content-type', deps.metrics.registry.contentType).status(200).send(body);
  });

  return app;
}
