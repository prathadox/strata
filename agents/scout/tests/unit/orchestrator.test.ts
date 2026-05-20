import { describe, it, expect, vi } from 'vitest';
import { runCycle } from '../../src/pipeline/orchestrator.js';
import { LastPublished } from '../../src/cache/lastPublished.js';
import type { SourceFetcher } from '../../src/pipeline/ingestion/sourceFetcher.js';
import type { RiskFactors } from '../../src/types.js';

const oneOpp: SourceFetcher = {
  source: 'aave',
  fetch: async () => [{
    id: 'aave:usdc', source: 'aave', asset: '0x' + 'a'.repeat(40),
    apy: 0.05, apyType: 'variable', tvlUsd: 100_000_000, lastUpdatedMs: Date.now(), raw: {}
  }]
};

const noEnrichers = {
  depegHistory: async (): Promise<RiskFactors['depegEvents']> => [],
  smartMoneyFlow: async (): Promise<RiskFactors['smartMoneySignal']> => null,
  apyHistory: async () => null,
  yieldAccrual: async (): Promise<RiskFactors['yieldAccrualEvents']> => null
};

const stubPublisher = {
  pinYieldMap: vi.fn(async () => ({ cid: 'bafkrei-stub' })),
  signYieldMap: vi.fn(async (payload: unknown) => ({
    mapHash: '0x' + 'a'.repeat(64) as `0x${string}`,
    signature: '0x' + 'b'.repeat(130) as `0x${string}`,
    canonicalBytes: new Uint8Array([1, 2, 3])
  })),
  publishOnChain: vi.fn(async () => '0xtxhash' as `0x${string}`)
};

describe('runCycle', () => {
  it('runs ingest -> score -> aggregate -> sign -> pin -> publish in order', async () => {
    const lp = new LastPublished();
    const result = await runCycle({
      fetchers: [oneOpp],
      enrichers: noEnrichers,
      publisher: stubPublisher,
      lastPublished: lp,
      methodologyHash: '0xmethhash',
      codeCommit: 'abc1234',
      publisherAddress: '0x' + '1'.repeat(40),
      identityNFT: 'token-1'
    });

    expect(result).not.toBeNull();
    expect(result!.opportunities.length).toBe(1);
    expect(result!.opportunities[0]!.eligibleTranches.length).toBeGreaterThan(0);
    expect(result!.perTranche.senior).toContain('aave:usdc');

    expect(stubPublisher.signYieldMap).toHaveBeenCalledTimes(1);
    expect(stubPublisher.pinYieldMap).toHaveBeenCalledTimes(1);
    expect(stubPublisher.publishOnChain).toHaveBeenCalledWith(expect.objectContaining({ ipfsHash: 'bafkrei-stub' }));
    expect(lp.get()?.cid).toBe('bafkrei-stub');
  });

  it('returns null and skips publication when ingestion produces zero opportunities (Rule 7)', async () => {
    const empty: SourceFetcher = { source: 'aave', fetch: async () => [] };
    const lp = new LastPublished();
    const localPub = {
      pinYieldMap: vi.fn(), signYieldMap: vi.fn(), publishOnChain: vi.fn()
    };
    const result = await runCycle({
      fetchers: [empty],
      enrichers: noEnrichers,
      publisher: localPub,
      lastPublished: lp,
      methodologyHash: '0x0', codeCommit: '0',
      publisherAddress: '0x' + '1'.repeat(40), identityNFT: '0'
    });
    expect(result).toBeNull();
    expect(localPub.pinYieldMap).not.toHaveBeenCalled();
    expect(localPub.publishOnChain).not.toHaveBeenCalled();
  });

  it('skips publication when lastPublished cid matches new cid (dedup)', async () => {
    const lp = new LastPublished();
    lp.record({ cid: 'bafkrei-stub', mapHash: '0xprev', publishedAtMs: 0 });
    const localPub = {
      pinYieldMap: vi.fn(async () => ({ cid: 'bafkrei-stub' })),
      signYieldMap: vi.fn(async () => ({
        mapHash: '0x' + 'a'.repeat(64) as `0x${string}`,
        signature: '0x' + 'b'.repeat(130) as `0x${string}`,
        canonicalBytes: new Uint8Array()
      })),
      publishOnChain: vi.fn()
    };
    const result = await runCycle({
      fetchers: [oneOpp],
      enrichers: noEnrichers,
      publisher: localPub,
      lastPublished: lp,
      methodologyHash: '0xm', codeCommit: 'c',
      publisherAddress: '0x' + '1'.repeat(40), identityNFT: 't'
    });
    expect(result).not.toBeNull();
    expect(localPub.publishOnChain).not.toHaveBeenCalled();
  });
});
