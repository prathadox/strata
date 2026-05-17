import pLimit from 'p-limit';
import type { SourceFetcher } from './sourceFetcher.js';
import type { YieldOpportunity, SourceProtocol } from '../../types.js';
import { YieldOpportunitySchema } from '../../types.js';

export interface IngestionResult {
  opportunities: YieldOpportunity[];
  attempted: (SourceProtocol | 'defillama')[];
  degraded: (SourceProtocol | 'defillama')[];
  errors: Record<string, string>;
}

function withTimeout<T>(p: Promise<T>, ms: number): Promise<T> {
  return new Promise((resolve, reject) => {
    const t = setTimeout(() => reject(new Error('timeout')), ms);
    p.then((v) => { clearTimeout(t); resolve(v); }, (e) => { clearTimeout(t); reject(e); });
  });
}

export async function runIngestion(
  fetchers: SourceFetcher[],
  opts: { perSourceTimeoutMs: number; concurrency?: number } = { perSourceTimeoutMs: 15_000 }
): Promise<IngestionResult> {
  const limit = pLimit(opts.concurrency ?? 8);
  const attempted: (SourceProtocol | 'defillama')[] = [];
  const degraded: (SourceProtocol | 'defillama')[] = [];
  const errors: Record<string, string> = {};
  const all: YieldOpportunity[] = [];

  await Promise.all(
    fetchers.map((f) =>
      limit(async () => {
        const src = f.source;
        attempted.push(src);
        try {
          const raw = await withTimeout(f.fetch(), opts.perSourceTimeoutMs);
          for (const o of raw) {
            const parsed = YieldOpportunitySchema.safeParse(o);
            if (parsed.success) all.push(parsed.data);
            else errors[`${src}:${o.id ?? '?'}`] = parsed.error.message;
          }
        } catch (e) {
          degraded.push(src);
          errors[src] = (e as Error).message;
        }
      })
    )
  );

  return { opportunities: all, attempted, degraded, errors };
}
