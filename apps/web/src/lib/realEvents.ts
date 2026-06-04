// Static seed of real Mantle mainnet events emitted by the five Strata agents on 2026-06-04.
// Every entry below maps 1:1 to a row in agents/.demo-seed.json and to a real tx on mantlescan.
// Production behavior: each agent's `pnpm demo` (= Railway cron) re-runs every 24h and a watcher
// appends new entries on top of this seed. Today the seed is the entire dataset.

import type { AgentEvent } from './appData';

export const REAL_EVENTS: AgentEvent[] = [
  {
    id: 7,
    agentKey: 'compliance',
    verb: 'issued',
    obj: 'Receipt #1',
    detail: 'STRATA-DEMO-2026-06 · Senior + Mezz + Junior · soulbound',
    kind: 'receipt',
    hash: '0x3657ec9f1a6121fe6d48b0d19a4cc316a07d3c275e96021a516a3a70768583e4',
    ts: 1748988560000,
    doing: 'EIP-712 ClaimData signed · soulbound NFT minted'
  },
  {
    id: 6,
    agentKey: 'operator',
    verb: 'filled',
    obj: 'Hedge signal #1',
    detail: '-$500 USDC net · Byreal Perps',
    kind: 'exec',
    verdict: 'exec',
    hash: '0x63b12b2e40933ffc446ded47a0bfa899f4da4fe98d58f374194b5b3b219e9ee6',
    ts: 1748988440000,
    doing: 'Logged hedge fill back to signalId 1'
  },
  {
    id: 5,
    agentKey: 'sentinel',
    verb: 'emitted',
    obj: 'Hedge signal #1',
    detail: '$1,000 USDC delta · mezz mETH staleness',
    kind: 'flag',
    verdict: 'flag',
    hash: '0x92080627f6e50ab4beee83339eedd124550bf52427277fc608ab57eea7383119',
    ts: 1748988320000,
    doing: 'Telling Operator to hedge $1k notional'
  },
  {
    id: 4,
    agentKey: 'sentinel',
    verb: 'rated',
    obj: 'Senior · USDC',
    detail: 'green · within risk budget',
    kind: 'verdict',
    verdict: 'clear',
    hash: '0x1d05ee86ac141ef23225711d657cf756add26c807ea5bec95fc03ebb7f44f0e4',
    ts: 1748988260000,
    doing: 'Per-asset risk rating published'
  },
  {
    id: 3,
    agentKey: 'sentinel',
    verb: 'cleared',
    obj: 'Proposal #1780589901',
    detail: 'verdict CLEAR · Junior yellow',
    kind: 'verdict',
    verdict: 'clear',
    hash: '0x91250f676098d64e1d6b749f3aac0742ccf0f99c8c5538b6981edb43bd5761db',
    ts: 1748988200000,
    doing: 'Risk verdict signed and submitted'
  },
  {
    id: 2,
    agentKey: 'architect',
    verb: 'proposed',
    obj: 'Allocation #1780589901',
    detail: 'Senior 60% · Mezz 30% · Junior 10%',
    kind: 'propose',
    hash: '0xc4e23f8b2cb889c2abbce09ad7957f902be37ed8e300807ccedc2d28b6679970',
    ts: 1748988120000,
    doing: 'Drafted allocation off the latest Yield Map'
  },
  {
    id: 1,
    agentKey: 'scout',
    verb: 'published',
    obj: 'Yield Map',
    detail: '5 opportunities scored · RAAPY methodology',
    kind: 'publish',
    hash: '0x4f2a1bf4e0821ebb3d9ef224ad0423fea89eea6c43a6243dd738ef8b9c6ded33',
    ts: 1748988000000,
    doing: 'Signed yield map pinned and published'
  }
];

// CID per event so the dashboard can fetch the underlying signed JSON from Lighthouse.
export const REAL_EVENT_CIDS: Record<number, string> = {
  1: 'QmTMcLP23Yzi4cpW5XaVpjo1zH5Kdq74hiNgs9racZjt1s',
  2: 'QmTr1ekpVQE7tnADqnx2JKV26zwNEtDoJpRX2qdPMdQzyD',
  3: 'QmY73bjzmW6sL3XrTBVKFmeGf5Usa8Cs3TLd4s4hktdgez',
  4: 'QmPnpTBiLC2CMc7bPx988LChKdvGBcQf9wgKXRYceCQvSL',
  5: 'Qma6GLpMwVP47qL5mSMoXDu8CTnyqU5dh1biesWSY1nPvU',
  6: 'QmUcwKAkxvARKecsBZTUsBTgBGWyp9kB3LuTCu5XRmeYxv',
  7: 'QmUEVWAMJz15BmppMCP2d9wcjKHW7iRHJx8GCvsCwEhDgX'
};
