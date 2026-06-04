// Real on-chain events surfaced on the app dashboard. THIS REPLACES THE OLD MOCK ENGINE.
//
// To populate the dashboard/agents/activity views with real activity, paste entries into
// REAL_EVENTS below. Each entry corresponds to one tx emitted by an agent on AgentEventBus
// (or ComplianceRegistry). The dashboard reads this list as-is — no random churn, no
// dummy hashes.
//
// Format reminder (one event per real tx):
//
//   {
//     id: 1,                                  // any monotonically increasing integer
//     agentKey: 'scout',                       // 'scout' | 'architect' | 'sentinel' | 'operator' | 'compliance'
//     verb: 'published',
//     obj: 'Yield Map',
//     detail: 'cid bafybeih…',                 // optional
//     kind: 'publish',                         // 'publish' | 'propose' | 'verdict' | 'flag' | 'exec' | 'receipt'
//     verdict: 'clear',                        // optional, for sentinel/operator only
//     hash: '0xabc…123',                       // tx hash (short or full)
//     ts: 1717520000000,                       // epoch ms when the tx was mined
//     doing: 'Publishing updated Yield Map'    // status string shown on the dashboard while live
//   }
//
// Once we wire the live indexer / `viem.watchContractEvent` subscription, this file becomes
// the seed and new events stream in on top.

import type { AgentEvent } from './appData';

export const REAL_EVENTS: AgentEvent[] = [];
