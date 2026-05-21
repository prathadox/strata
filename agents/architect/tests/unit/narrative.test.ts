import { describe, it, expect, vi, afterEach } from 'vitest';
import type { AllocationProposal } from '../../src/types.js';

// Build a minimal proposal fixture (Omit<AllocationProposal, 'signature' | 'narrative'>)
const PROPOSAL: Omit<AllocationProposal, 'signature' | 'narrative'> = {
  version: '1.0',
  proposalId: '12345',
  sourceMapCid: 'bafy_source_cid',
  publishedAtMs: 1_700_000_000_000,
  publisher: { address: `0x${'a'.repeat(40)}`, identityNFT: 'nft-1' },
  methodologyHash: `0x${'c'.repeat(64)}`,
  codeCommit: 'deadbeef',
  tranches: {
    senior: { bps: 5000, positions: { pool1: 6000, pool2: 4000 } },
    mezzanine: { bps: 3000, positions: { pool3: 10_000 } },
    junior: { bps: 2000, positions: { pool4: 5000, pool5: 5000 } }
  },
  netExposureAtProposalMs: {}
};

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('generateNarrative', () => {
  it('test 1: no API key returns null without calling fetch', async () => {
    const fetchSpy = vi.fn();
    vi.stubGlobal('fetch', fetchSpy);

    const { generateNarrative } = await import('../../src/llm/narrative.js');
    const result = await generateNarrative(PROPOSAL, undefined, 'gemini-2.5-flash');

    expect(result).toBeNull();
    expect(fetchSpy).not.toHaveBeenCalled();
  });

  it('test 2: network error returns null, does not throw', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('network down')));

    const { generateNarrative } = await import('../../src/llm/narrative.js');
    const result = await generateNarrative(PROPOSAL, 'test-api-key', 'gemini-2.5-flash');

    expect(result).toBeNull();
  });

  it('test 3: HTTP 500 returns null', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: false, status: 500 }));

    const { generateNarrative } = await import('../../src/llm/narrative.js');
    const result = await generateNarrative(PROPOSAL, 'test-api-key', 'gemini-2.5-flash');

    expect(result).toBeNull();
  });

  it('test 4: bad JSON in response body returns null', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: vi.fn().mockRejectedValue(new SyntaxError('bad json'))
    }));

    const { generateNarrative } = await import('../../src/llm/narrative.js');
    const result = await generateNarrative(PROPOSAL, 'test-api-key', 'gemini-2.5-flash');

    expect(result).toBeNull();
  });

  it('test 5: response with unexpected schema returns null', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: vi.fn().mockResolvedValue({ unrelated: 'shape' })
    }));

    const { generateNarrative } = await import('../../src/llm/narrative.js');
    const result = await generateNarrative(PROPOSAL, 'test-api-key', 'gemini-2.5-flash');

    expect(result).toBeNull();
  });

  it('test 6: happy path returns trimmed text from first candidate', async () => {
    const geminiBody = {
      candidates: [
        {
          content: {
            parts: [{ text: '  here is the narrative.  ' }]
          }
        }
      ]
    };
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: vi.fn().mockResolvedValue(geminiBody)
    }));

    const { generateNarrative } = await import('../../src/llm/narrative.js');
    const result = await generateNarrative(PROPOSAL, 'test-api-key', 'gemini-2.5-flash');

    expect(result).toBe('here is the narrative.');
  });

  it('test 7: prompt body contains YieldMap CID, methodology hash, and all three tranches bps + positions', async () => {
    let capturedBody: unknown;
    vi.stubGlobal('fetch', vi.fn().mockImplementation((_url: unknown, init: RequestInit) => {
      capturedBody = JSON.parse(init.body as string);
      return Promise.resolve({
        ok: true,
        status: 200,
        json: () => Promise.resolve({
          candidates: [{ content: { parts: [{ text: 'ok' }] } }]
        })
      });
    }));

    const { generateNarrative } = await import('../../src/llm/narrative.js');
    await generateNarrative(PROPOSAL, 'test-api-key', 'gemini-2.5-flash');

    // body is the Gemini request payload
    const body = capturedBody as { contents: Array<{ parts: Array<{ text: string }> }> };
    const promptText = body.contents[0]?.parts[0]?.text ?? '';

    // CID and methodology hash present
    expect(promptText).toContain('bafy_source_cid');
    expect(promptText).toContain(`0x${'c'.repeat(64)}`);

    // All three tranches bps
    expect(promptText).toContain('5000');
    expect(promptText).toContain('3000');
    expect(promptText).toContain('2000');

    // Position pool IDs from each tranche
    expect(promptText).toContain('pool1');
    expect(promptText).toContain('pool3');
    expect(promptText).toContain('pool4');
  });
});
