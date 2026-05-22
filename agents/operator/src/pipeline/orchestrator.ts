import type { HedgeSignal } from '../ipfs/fetch.js';
import { sizeHedge } from './sizeHedge.js';
import { buildIntent } from './buildIntent.js';
import type { HedgeIntent } from '../types.js';

export type RunResult =
  | { status: 'published'; cid: string; intent: HedgeIntent }
  | { status: 'skipped'; reason: 'duplicate' | 'verification-failed' | 'below-floor' | 'price-unavailable' };

export interface OrchestratorDeps {
  fetchSignal: (cid: string) => Promise<HedgeSignal | null>;
  verifySignal: (s: HedgeSignal) => Promise<void>;
  fetchSpotUsd: (tokenAddress: string) => Promise<number>;
  methodologyHash: string;
  codeCommit: string;
  publisher: {
    publishIntent: (draft: Omit<HedgeIntent, 'signature'>) => Promise<{ cid: string; intent: HedgeIntent }>;
  };
  publisherAddress: string;
  identityNFT: string;
  now?: () => number;
}

export class Orchestrator {
  private lastProcessedCid: string | null = null;
  constructor(private deps: OrchestratorDeps) {}

  async runHedgeCycle(signalCid: string, signalBlock: bigint): Promise<RunResult> {
    if (signalCid === this.lastProcessedCid) {
      return { status: 'skipped', reason: 'duplicate' };
    }
    const now = this.deps.now ?? (() => Date.now());

    let signal: HedgeSignal | null;
    try {
      signal = await this.deps.fetchSignal(signalCid);
      if (!signal) return { status: 'skipped', reason: 'verification-failed' };
      await this.deps.verifySignal(signal);
    } catch {
      return { status: 'skipped', reason: 'verification-failed' };
    }

    let spotPriceUsd: number;
    try {
      spotPriceUsd = await this.deps.fetchSpotUsd(signal.hedgedAsset);
    } catch {
      return { status: 'skipped', reason: 'price-unavailable' };
    }
    const spotPriceTimestampMs = now();

    const targetNotionalUsd = BigInt(signal.targetNotionalUsd);
    const sizing = sizeHedge({ targetNotionalUsd, hedgedAsset: signal.hedgedAsset as `0x${string}` }, spotPriceUsd);
    if (sizing.kind === 'skip') {
      return { status: 'skipped', reason: 'below-floor' };
    }

    const draft = buildIntent({
      sourceSignalCid: signalCid,
      sourceSignalBlock: signalBlock,
      hedgedAsset: signal.hedgedAsset,
      sizing,
      spotPriceUsd,
      spotPriceTimestampMs,
      publisherAddress: this.deps.publisherAddress,
      identityNFT: this.deps.identityNFT,
      methodologyHash: this.deps.methodologyHash,
      codeCommit: this.deps.codeCommit,
      now
    });

    const published = await this.deps.publisher.publishIntent(draft);
    this.lastProcessedCid = signalCid;
    return { status: 'published', cid: published.cid, intent: published.intent };
  }
}
