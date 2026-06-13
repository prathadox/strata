import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { parseArgs } from 'node:util';
import pino from 'pino';
import { z } from 'zod';
import { keccak256, toBytes, encodePacked } from 'viem';
import { pinJsonToLighthouse } from '@strata/scout/ipfs';
import { JurisdictionPolicySchema } from './types.js';
import { interpretPolicy, getPromptHash } from './llm/policyInterpreter.js';

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
  sourceTextPath: z.string().min(1).optional(),
  sourceText: z.string().min(1).optional()
});

async function main(): Promise<void> {
  const { values } = parseArgs({
    options: {
      'policy-file': { type: 'string' },
      'source-text': { type: 'string' },
      'lighthouse-api-key': { type: 'string' },
      'interpret': { type: 'boolean', default: false },
      'dry-run': { type: 'boolean', default: true }
    }
  });

  const policyFile = values['policy-file'];
  const sourceTextFile = values['source-text'];
  const apiKey = values['lighthouse-api-key'] ?? process.env.PINATA_JWT;
  const shouldInterpret = values['interpret'] ?? false;
  const dryRun = values['dry-run'] ?? true;

  if (!policyFile) {
    console.error('Usage: compliance-publisher --policy-file <path> [--source-text <path>] [--interpret] [--lighthouse-api-key <key>] [--dry-run]');
    process.exit(1);
  }

  if (!apiKey) {
    console.error('PINATA_JWT required (env or --lighthouse-api-key)');
    process.exit(1);
  }

  const rawText = readFileSync(policyFile, 'utf-8');
  const input = PolicyInputSchema.parse(JSON.parse(rawText));
  log.info({ jurisdictionCode: input.jurisdictionCode }, 'parsed policy input');

  let aiInterpretationCid: string | null = null;
  let aiInterpretationHash: string | null = null;
  let aiModel: string | null = null;
  let aiPromptHash: string | null = null;

  if (shouldInterpret) {
    const geminiApiKey = process.env.GEMINI_API_KEY;
    if (!geminiApiKey) {
      console.error('GEMINI_API_KEY required when --interpret is set');
      process.exit(1);
    }
    const anthropicApiKey = process.env.ANTHROPIC_API_KEY;
    const geminiModel = process.env.GEMINI_MODEL ?? 'gemini-2.5-flash';
    const claudeModel = process.env.CLAUDE_MODEL ?? 'claude-sonnet-4-6';

    const sourceText = sourceTextFile
      ? readFileSync(sourceTextFile, 'utf-8')
      : (input.sourceText ?? rawText);

    log.info({ geminiModel, hasClaude: !!anthropicApiKey }, 'running AI policy interpretation');
    const interpretation = await interpretPolicy(sourceText, {
      geminiApiKey,
      geminiModel,
      ...(anthropicApiKey ? { anthropicApiKey, claudeModel } : {})
    });

    aiPromptHash = interpretation.promptHash;
    aiModel = geminiModel;

    if (!interpretation.approved) {
      console.error('\n[BLOCKED] AI interpretation not approved.');
      if (interpretation.draft?.errors) {
        console.error('Gemini flagged unresolvable clauses:', interpretation.draft.errors);
      }
      if (interpretation.crossCheck && !interpretation.crossCheck.agree) {
        console.error('Claude disagreed:', interpretation.crossCheck.specificClauses);
        console.error('Recommended changes:', interpretation.crossCheck.recommendedChanges);
      }
      if (!interpretation.draft) {
        console.error('Gemini failed to produce a valid draft.');
      }
      console.error('\nHuman review required before policy can proceed.');
      process.exit(1);
    }

    log.info('AI interpretation approved');
    if (interpretation.draft) {
      log.info({ aiDraft: interpretation.draft }, 'Gemini draft (approved by Claude)');
      const draftJson = JSON.stringify(interpretation.draft);
      aiInterpretationHash = '0x' + createHash('sha256').update(draftJson).digest('hex');

      if (!dryRun) {
        aiInterpretationCid = await pinJsonToLighthouse(draftJson, apiKey);
        log.info({ aiInterpretationCid }, 'AI draft pinned to Lighthouse');
      }
    }
  }

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
    aiInterpretationCid,
    aiInterpretationHash,
    aiModel,
    aiPromptHash,
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

  console.log(JSON.stringify({ cid, jurisdictionCodeHash, policyHash, sourceTextHash, aiInterpretationCid, aiInterpretationHash }, null, 2));
  console.log('\nNext: coworker calls mintPolicy(jurisdictionCodeHash, effectiveFromSec, effectiveUntilSec, tokenURI=cid) via multisig.');
}

main().catch((e) => { console.error(e); process.exit(1); });
