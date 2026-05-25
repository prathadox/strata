import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { parseArgs } from 'node:util';
import pino from 'pino';
import { z } from 'zod';
import { keccak256, toBytes, encodePacked } from 'viem';
import { pinJsonToLighthouse } from '@strata/scout/ipfs';
import { JurisdictionPolicySchema } from './types.js';

const log = pino({ level: 'info' });

const PolicyInputSchema = z.object({
  jurisdictionCode: z.string().min(1),
  effectiveFromSec: z.number().int().positive(),
  effectiveUntilSec: z.number().int().positive().nullable(),
  permittedTranchesByKycTier: z.object({
    none: z.number().int().min(0).max(7),
    basic: z.number().int().min(0).max(7),
    enhanced: z.number().int().min(0).max(7)
  }),
  sourceTextPath: z.string().min(1).optional()
});

async function main(): Promise<void> {
  const { values } = parseArgs({
    options: {
      'policy-file': { type: 'string' },
      'lighthouse-api-key': { type: 'string' },
      'dry-run': { type: 'boolean', default: true }
    }
  });

  const policyFile = values['policy-file'];
  const apiKey = values['lighthouse-api-key'] ?? process.env.LIGHTHOUSE_API_KEY;
  const dryRun = values['dry-run'] ?? true;

  if (!policyFile) {
    console.error('Usage: compliance-publisher --policy-file <path> [--lighthouse-api-key <key>] [--dry-run]');
    process.exit(1);
  }

  if (!apiKey) {
    console.error('LIGHTHOUSE_API_KEY required (env or --lighthouse-api-key)');
    process.exit(1);
  }

  const rawText = readFileSync(policyFile, 'utf-8');
  const input = PolicyInputSchema.parse(JSON.parse(rawText));
  log.info({ jurisdictionCode: input.jurisdictionCode }, 'parsed policy input');

  const sourceTextHash = '0x' + createHash('sha256').update(rawText).digest('hex');
  const policyHashSeed = encodePacked(
    ['string', 'uint8', 'uint8', 'uint8', 'uint64', 'uint64'],
    [
      input.jurisdictionCode,
      input.permittedTranchesByKycTier.none,
      input.permittedTranchesByKycTier.basic,
      input.permittedTranchesByKycTier.enhanced,
      BigInt(input.effectiveFromSec),
      BigInt(input.effectiveUntilSec ?? 0)
    ]
  );
  const policyHash = keccak256(policyHashSeed);

  const nowSec = Math.floor(Date.now() / 1000);
  const jurisdictionCodeHash = keccak256(toBytes(input.jurisdictionCode));

  const policy = {
    version: '1.0' as const,
    policyTokenId: '0',
    jurisdictionCode: input.jurisdictionCode,
    effectiveFromSec: input.effectiveFromSec,
    effectiveUntilSec: input.effectiveUntilSec,
    permittedTranchesByKycTier: input.permittedTranchesByKycTier,
    sourceTextHash,
    sourceTextCid: null,
    aiInterpretationCid: null,
    aiInterpretationHash: null,
    aiModel: null,
    aiPromptHash: null,
    policyHash,
    publisher: {
      multisigAddress: '0x0000000000000000000000000000000000000000',
      identityNFT: 'ipfs://placeholder'
    },
    publishedAtSec: nowSec,
    signatures: [] as string[]
  };

  JurisdictionPolicySchema.parse(policy);
  log.info('policy schema validation passed');

  if (dryRun) {
    console.log(JSON.stringify(policy, null, 2));
    console.log('\n[dry-run] Policy validated. Pass --no-dry-run and a Lighthouse key to pin.');
    return;
  }

  const cid = await pinJsonToLighthouse(JSON.stringify(policy), apiKey);
  log.info({ cid, jurisdictionCodeHash, policyHash }, 'policy pinned to Lighthouse');

  console.log(JSON.stringify({ cid, jurisdictionCodeHash, policyHash, sourceTextHash }, null, 2));
  console.log('\nNext: coworker calls mintPolicy(jurisdictionCodeHash, effectiveFromSec, effectiveUntilSec, tokenURI=cid) via multisig.');
}

main().catch((e) => { console.error(e); process.exit(1); });
