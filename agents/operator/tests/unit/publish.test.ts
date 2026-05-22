import { describe, it, expect, vi } from 'vitest';
import { makePublisher } from '../../src/publication/publish.js';

describe('publishIntent (dry-run)', () => {
  it('signs + pins + skips onchain', async () => {
    const pin = vi.fn().mockResolvedValue('bafyIntent');
    const onchain = vi.fn();
    const publisher = makePublisher({
      wallet: {} as any,
      publicClient: {} as any,
      account: {
        address: '0x' + 'a'.repeat(40),
        signMessage: vi.fn().mockResolvedValue('0xsig')
      } as any,
      eventBus: '0xbus',
      lighthouseApiKey: 'k',
      dryRun: true,
      pinOverride: pin,
      onChainOverride: onchain
    });
    const draft = {
      version: '1.0' as const,
      intentId: '1',
      sourceSignalCid: 'bafySignal',
      sourceSignalBlock: '12345',
      hedgedAsset: '0x' + 'a'.repeat(40),
      direction: 'short' as const,
      notionalUsd: '1000000',
      contractSize: '500',
      spotPriceUsd: '2000',
      spotPriceSource: 'coingecko' as const,
      spotPriceTimestampMs: 1_700_000_000_000,
      slippageToleranceBps: 50,
      publisher: { address: '0x' + 'a'.repeat(40), identityNFT: 'ipfs://x' },
      methodologyHash: '0x' + '1'.repeat(64),
      codeCommit: 'c',
      publishedAtMs: 0
    };
    const out = await publisher.publishIntent(draft);
    expect(out.cid).toBe('bafyIntent');
    expect(onchain).not.toHaveBeenCalled();
    expect(pin).toHaveBeenCalledTimes(1);
  });
});
