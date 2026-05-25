import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { interpretPolicy, getPromptHash } from '../../src/llm/policyInterpreter.js';

const VALID_DRAFT = {
  jurisdictionCode: 'US',
  permittedTranchesByKycTier: { none: 4, basic: 3, enhanced: 7 },
  reasoning: 'Strictest reading applied'
};

const AGREE_RESPONSE = { agree: true };
const DISAGREE_RESPONSE = {
  agree: false,
  specific_clauses: ['Clause 3.1 is ambiguous'],
  recommended_changes: ['Set basic to junior-only (4) instead of senior+mezzanine (3)']
};

function mockFetch(geminiBody: unknown, claudeBody: unknown) {
  let callCount = 0;
  return vi.fn(async (url: string | URL | Request) => {
    callCount++;
    const urlStr = typeof url === 'string' ? url : url.toString();
    if (urlStr.includes('generativelanguage.googleapis.com')) {
      return {
        ok: true,
        json: async () => ({
          candidates: [{ content: { parts: [{ text: JSON.stringify(geminiBody) }] } }]
        })
      };
    }
    if (urlStr.includes('api.anthropic.com')) {
      return {
        ok: true,
        json: async () => ({
          content: [{ type: 'text', text: JSON.stringify(claudeBody) }]
        })
      };
    }
    return { ok: false };
  }) as any;
}

describe('policyInterpreter', () => {
  const originalFetch = globalThis.fetch;

  afterEach(() => {
    globalThis.fetch = originalFetch;
  });

  it('returns approved when Gemini produces valid table and Claude agrees', async () => {
    globalThis.fetch = mockFetch(VALID_DRAFT, AGREE_RESPONSE);
    const result = await interpretPolicy('Policy text for US jurisdiction', {
      geminiApiKey: 'test-gemini-key',
      anthropicApiKey: 'test-anthropic-key'
    });
    expect(result.approved).toBe(true);
    expect(result.draft).not.toBeNull();
    expect(result.draft!.jurisdictionCode).toBe('US');
    expect(result.draft!.permittedTranchesByKycTier.basic).toBe(3);
    expect(result.crossCheck).not.toBeNull();
    expect(result.crossCheck!.agree).toBe(true);
  });

  it('returns not approved when Claude disagrees', async () => {
    globalThis.fetch = mockFetch(VALID_DRAFT, DISAGREE_RESPONSE);
    const result = await interpretPolicy('Policy text', {
      geminiApiKey: 'test-gemini-key',
      anthropicApiKey: 'test-anthropic-key'
    });
    expect(result.approved).toBe(false);
    expect(result.draft).not.toBeNull();
    expect(result.crossCheck).not.toBeNull();
    expect(result.crossCheck!.agree).toBe(false);
    expect(result.crossCheck!.specificClauses).toHaveLength(1);
    expect(result.crossCheck!.recommendedChanges).toHaveLength(1);
  });

  it('returns not approved when Gemini fails', async () => {
    globalThis.fetch = vi.fn(async () => ({ ok: false })) as any;
    const result = await interpretPolicy('Policy text', {
      geminiApiKey: 'bad-key'
    });
    expect(result.approved).toBe(false);
    expect(result.draft).toBeNull();
    expect(result.geminiRaw).toBeNull();
  });

  it('returns not approved when Gemini returns errors array', async () => {
    const draftWithErrors = { ...VALID_DRAFT, errors: ['Clause 5.2 cannot be reduced to a rule'] };
    globalThis.fetch = mockFetch(draftWithErrors, AGREE_RESPONSE);
    const result = await interpretPolicy('Policy text', {
      geminiApiKey: 'test-key'
    });
    expect(result.approved).toBe(false);
    expect(result.draft).not.toBeNull();
    expect(result.draft!.errors).toHaveLength(1);
  });

  it('skips Claude cross-check when no anthropicApiKey provided', async () => {
    globalThis.fetch = mockFetch(VALID_DRAFT, null);
    const result = await interpretPolicy('Policy text', {
      geminiApiKey: 'test-key'
    });
    expect(result.approved).toBe(true);
    expect(result.crossCheck).toBeNull();
    expect(result.claudeRaw).toBeNull();
  });

  it('getPromptHash returns a stable bytes32 hex', () => {
    const hash = getPromptHash();
    expect(hash).toMatch(/^0x[a-f0-9]{64}$/);
    expect(getPromptHash()).toBe(hash);
  });
});
