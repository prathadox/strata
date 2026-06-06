// CID-keyed view of our seeded agent docs. The Architect pinned every cycle's
// JSON to Lighthouse, but the free-tier gateway 402s and other public gateways
// fail too, so we serve content directly from the local seed table whenever a
// CID matches. realEvents.ts maps cycle -> CID; seedDocs.ts maps cycle -> doc;
// this module crosses them so /api/doc/[cid] can answer without any network hop.

import { SEED_DOCS } from './seedDocs';
import { REAL_EVENT_CIDS } from './realEvents';

const CID_TO_DOC: Map<string, unknown> = (() => {
  const m = new Map<string, unknown>();
  for (const cycleStr of Object.keys(REAL_EVENT_CIDS)) {
    const cycle = Number(cycleStr);
    const cid = REAL_EVENT_CIDS[cycle];
    const doc = SEED_DOCS[cycle];
    if (cid && doc) m.set(cid, doc);
  }
  return m;
})();

export function getDocByCid(cid: string): unknown | null {
  return CID_TO_DOC.get(cid) ?? null;
}

export function knownCids(): string[] {
  return Array.from(CID_TO_DOC.keys());
}
