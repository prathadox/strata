import { createHash } from 'node:crypto';
import { z } from 'zod';
import { callGeminiJson } from './gemini.js';
import { callClaudeJson } from './claude.js';

const PolicyTableSchema = z.object({
  jurisdictionCode: z.string().min(1),
  permittedTranchesByKycTier: z.object({
    none: z.number().int().min(0).max(7),
    basic: z.number().int().min(0).max(7),
    enhanced: z.number().int().min(0).max(7)
  }),
  reasoning: z.string().optional(),
  errors: z.array(z.string()).optional()
});

const CrossCheckSchema = z.object({
  agree: z.boolean(),
  specific_clauses: z.array(z.string()).optional(),
  recommended_changes: z.array(z.string()).optional()
});

export type PolicyTable = z.infer<typeof PolicyTableSchema>;

export interface CrossCheckResult {
  agree: boolean;
  specificClauses: string[];
  recommendedChanges: string[];
}

export interface InterpretResult {
  draft: PolicyTable | null;
  crossCheck: CrossCheckResult | null;
  approved: boolean;
  geminiRaw: string | null;
  claudeRaw: string | null;
  promptHash: string;
}

const PESSIMISTIC_PROMPT = `You are an adversarial securities lawyer reviewing this jurisdiction policy for a tokenized RWA fund on Mantle. The fund will be sued if it admits a depositor who should have been excluded. For every clause in the source text, identify (a) the strictest plausible reading, (b) at least one edge case where the clause is silent, and (c) a recommended deny-by-default rule for that edge case. Output a JSON policy table with the strictest readings as defaults. The JSON must match this schema: {"jurisdictionCode": string, "permittedTranchesByKycTier": {"none": uint8_bitmask, "basic": uint8_bitmask, "enhanced": uint8_bitmask}, "reasoning": string, "errors": string[]}. Bitmask encoding: bit 0 = senior, bit 1 = mezzanine, bit 2 = junior. If a clause cannot be reduced to a deny-by-default rule, add the clause text to the "errors" array. Output ONLY valid JSON. Do not output explanations outside the JSON.`;

const CROSS_CHECK_SYSTEM = `You are an independent compliance reviewer. You receive a source policy text and a draft structured rule table produced by another LLM. Verify: (1) does the rule table faithfully represent the source text's strictest reading? (2) are there edge cases the draft missed? (3) are there clauses where the draft is more permissive than the source text allows? Return ONLY valid JSON matching: {"agree": boolean, "specific_clauses": string[], "recommended_changes": string[]}. If the draft is correct, return {"agree": true}. Be pessimistic.`;

export function getPromptHash(): string {
  return '0x' + createHash('sha256').update(PESSIMISTIC_PROMPT).digest('hex');
}

function extractJson(raw: string): string {
  const fenced = raw.match(/```(?:json)?\s*([\s\S]*?)```/);
  if (fenced?.[1]) return fenced[1].trim();
  const braced = raw.match(/\{[\s\S]*\}/);
  if (braced) return braced[0];
  return raw;
}

export async function interpretPolicy(
  sourceText: string,
  opts: {
    geminiApiKey: string;
    geminiModel?: string;
    anthropicApiKey?: string;
    claudeModel?: string;
  }
): Promise<InterpretResult> {
  const geminiModel = opts.geminiModel ?? 'gemini-2.5-flash';
  const claudeModel = opts.claudeModel ?? 'claude-sonnet-4-6';
  const promptHash = getPromptHash();

  const geminiPrompt = `${PESSIMISTIC_PROMPT}\n\nSource policy text:\n\n${sourceText}`;
  const geminiRaw = await callGeminiJson(geminiPrompt, opts.geminiApiKey, geminiModel);

  if (!geminiRaw) {
    return { draft: null, crossCheck: null, approved: false, geminiRaw: null, claudeRaw: null, promptHash };
  }

  let draft: PolicyTable | null = null;
  try {
    const cleaned = extractJson(geminiRaw);
    draft = PolicyTableSchema.parse(JSON.parse(cleaned));
  } catch {
    return { draft: null, crossCheck: null, approved: false, geminiRaw, claudeRaw: null, promptHash };
  }

  if (draft.errors && draft.errors.length > 0) {
    return { draft, crossCheck: null, approved: false, geminiRaw, claudeRaw: null, promptHash };
  }

  if (!opts.anthropicApiKey) {
    return { draft, crossCheck: null, approved: true, geminiRaw, claudeRaw: null, promptHash };
  }

  const crossCheckMessage = [
    'Source policy text:',
    sourceText,
    '',
    'Draft rule table (produced by Gemini):',
    JSON.stringify(draft, null, 2)
  ].join('\n');

  const claudeRaw = await callClaudeJson(CROSS_CHECK_SYSTEM, crossCheckMessage, opts.anthropicApiKey, claudeModel);

  if (!claudeRaw) {
    return { draft, crossCheck: null, approved: false, geminiRaw, claudeRaw: null, promptHash };
  }

  let crossCheck: CrossCheckResult;
  try {
    const cleaned = extractJson(claudeRaw);
    const parsed = CrossCheckSchema.parse(JSON.parse(cleaned));
    crossCheck = {
      agree: parsed.agree,
      specificClauses: parsed.specific_clauses ?? [],
      recommendedChanges: parsed.recommended_changes ?? []
    };
  } catch {
    return { draft, crossCheck: null, approved: false, geminiRaw, claudeRaw, promptHash };
  }

  return {
    draft,
    crossCheck,
    approved: crossCheck.agree,
    geminiRaw,
    claudeRaw,
    promptHash
  };
}
