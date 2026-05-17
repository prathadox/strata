import type { YieldOpportunity, SourceProtocol } from '../../types.js';

export interface SourceFetcher {
  readonly source: SourceProtocol | 'defillama';
  fetch(): Promise<YieldOpportunity[]>;
}
