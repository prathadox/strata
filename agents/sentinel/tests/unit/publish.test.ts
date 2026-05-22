import { describe, it, expect, vi } from 'vitest';
import { makePublisher } from '../../src/publication/publish.js';

describe('publishVerdict (dry-run)', () => {
  it('signs + pins + skips onchain', async () => {
    const pin = vi.fn().mockResolvedValue('bafyVerdict');
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
      issueOnChainOverride: onchain,
      emitHedgeOnChainOverride: vi.fn()
    });
    const draft = {
      version: '1.0' as const, verdictId: '1', proposalId: '2',
      sourceMapCid: 'm', sourceProposalCid: 'p', publishedAtMs: 0,
      publisher: { address: '0x' + 'a'.repeat(40), identityNFT: 'ipfs://x' },
      methodologyHash: '0x' + '1'.repeat(64), codeCommit: 'c',
      tranches: { senior: 'green' as const, mezzanine: 'green' as const, junior: 'green' as const },
      perPositionVerdicts: {}, reasons: []
    };
    const out = await publisher.publishVerdict(draft);
    expect(out.cid).toBe('bafyVerdict');
    expect(onchain).not.toHaveBeenCalled();
    expect(pin).toHaveBeenCalledTimes(1);
  });
});
