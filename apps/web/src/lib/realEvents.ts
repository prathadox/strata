// Static seed of real Mantle mainnet events emitted by the five Strata agents on 2026-06-04.
// Three full agent cycles ran end-to-end. Every entry below maps 1:1 to a real tx on
// mantlescan and a real CID on Lighthouse. Production behavior: each agent's `pnpm demo`
// (= Railway cron) re-runs every 24h and a watcher appends new entries on top of this seed.

import type { AgentEvent } from './appData';

export const REAL_EVENTS: AgentEvent[] = [
  // === Cycle 4 — first cycle emitted from Railway-deployed containers (baseline content) ===
  {
    id: 25,
    agentKey: 'operator',
    verb: 'filled',
    obj: 'Hedge signal #4',
    detail: '-$1,000 USDC net · Byreal Perps',
    kind: 'exec',
    verdict: 'exec',
    hash: '0xce2c87b230f90bbc90065c52e6895f25673de56028a175c9ceafd970443ce462',
    ts: 1780597515000,
    doing: 'First fill from Railway-hosted Operator container'
  },
  {
    id: 24,
    agentKey: 'sentinel',
    verb: 'emitted',
    obj: 'Hedge signal #4',
    detail: '$2,000 USDC delta · mezz mETH staleness',
    kind: 'flag',
    verdict: 'flag',
    hash: '0x860e4d7c06c6939defa9f9976d504bfe56b60f1290a1212a3883661f2b58b8af',
    ts: 1780597389000,
    doing: 'Sentinel from Railway · $2k notional hedge'
  },
  {
    id: 23,
    agentKey: 'sentinel',
    verb: 'rated',
    obj: 'Senior · USDC',
    detail: 'green · within budget',
    kind: 'verdict',
    verdict: 'clear',
    hash: '0x55732bd98036fe5d8d55612eb5e28066cb8665a6a571c140cfa90301b5a2583a',
    ts: 1780597381000,
    doing: 'Per-asset risk rating from Railway'
  },
  {
    id: 22,
    agentKey: 'sentinel',
    verb: 'cleared',
    obj: 'Proposal #1780597343',
    detail: 'verdict CLEAR · Junior yellow',
    kind: 'verdict',
    verdict: 'clear',
    hash: '0xaef86dec1c4c2ad8ec66cd753d270f3db990ecf8b6ec202a3d7c471b6b66e88f',
    ts: 1780597374000,
    doing: 'First Sentinel verdict signed by Railway container'
  },
  {
    id: 21,
    agentKey: 'architect',
    verb: 'proposed',
    obj: 'Allocation #1780597343',
    detail: 'Senior 60% · Mezz 30% · Junior 10% · baseline',
    kind: 'propose',
    hash: '0x6863fa8b6b4f6a1ec7a789ac595a19bdad725792206be6bdab618bef71c6d33a',
    ts: 1780597349000,
    doing: 'Architect cron-tick from Railway-hosted container'
  },
  {
    id: 20,
    agentKey: 'scout',
    verb: 'published',
    obj: 'Yield Map v4',
    detail: 'first publish from Railway-hosted Scout',
    kind: 'publish',
    hash: '0x14974a613f899bfba9c54914c9d61799e26b8eff212c1fb5be192112ac44800e',
    ts: 1780597357000,
    doing: 'Scout cron-tick from Railway container'
  },

  // === Cycle 3 — USDY spikes (T-bill move), tilt to senior, junior blocked ===
  {
    id: 19,
    agentKey: 'operator',
    verb: 'filled',
    obj: 'Hedge signal #3',
    detail: '-$125 USDC residual · Byreal Perps close-down',
    kind: 'exec',
    verdict: 'exec',
    hash: '0xecbb2ecffa19e4ee319db7b5b7d89af6d597fcbab235531cf4849d8ca861ad99',
    ts: 1780594678000,
    doing: 'Trimmed 3/4 of prior $500 short, residual $125 USDC'
  },
  {
    id: 18,
    agentKey: 'sentinel',
    verb: 'emitted',
    obj: 'Hedge signal #3',
    detail: '$500 USDC delta · defensive trim',
    kind: 'flag',
    verdict: 'flag',
    hash: '0x9b97a02a236d853c35be2806dacb068351e2c8854cf6a5af4909df3019927237',
    ts: 1780594672000,
    doing: 'Defensive hedge: Junior blocked, scaling perp short down'
  },
  {
    id: 17,
    agentKey: 'sentinel',
    verb: 'rated',
    obj: 'Junior · USDC',
    detail: 'red · Ethena funding -70bps in 24h',
    kind: 'flag',
    verdict: 'flag',
    hash: '0x375e5b9b04b8f3a0c1a06d72fbace8a1418c5d8ddc9ab022ade10e8c94003a82',
    ts: 1780594662000,
    doing: 'Flagging Junior tranche, basis trade unstable'
  },
  {
    id: 16,
    agentKey: 'sentinel',
    verb: 'blocked',
    obj: 'Proposal #1780594769',
    detail: 'verdict BLOCKED · mETH staleness 22h',
    kind: 'verdict',
    verdict: 'flag',
    hash: '0xb7184d42418a4f6034c6ce8d7b4dfe0ffbffe0f124395270389edc1e5b5d65d1',
    ts: 1780594654000,
    doing: 'Refusing to scale Junior until next cycle'
  },
  {
    id: 15,
    agentKey: 'architect',
    verb: 'proposed',
    obj: 'Allocation #1780594769',
    detail: 'Senior 65% · Mezz 25% · Junior 10% · tilt to T-bills',
    kind: 'propose',
    hash: '0xdf04a33aebbc5d9ade92421caf00d37e787b70b194bb52551f269b7f2d37463b',
    ts: 1780594646000,
    doing: 'Pulling mezz down 5pp into senior duration-matched paper'
  },
  {
    id: 14,
    agentKey: 'scout',
    verb: 'published',
    obj: 'Yield Map v3',
    detail: 'USDY APY 5.10% (highest) · 7-day MA refresh',
    kind: 'publish',
    hash: '0xc08decd3321d4379c41f592dd93902b4e3a564f09738d1fc8cdee3afdce1653d',
    ts: 1780594640000,
    doing: 'USDY rate spike picked up via 7-day MA'
  },

  // === Cycle 2 — sUSDe leads, tilt to mezz, all green ===
  {
    id: 13,
    agentKey: 'operator',
    verb: 'filled',
    obj: 'Hedge signal #2',
    detail: '-$1,000 USDC net · avg basis 14bps',
    kind: 'exec',
    verdict: 'exec',
    hash: '0xea01bfaa26fa43092a1f6d73b5bb0071ba3999b93167294ded1946ef087659df',
    ts: 1780594634000,
    doing: 'Byreal short opened in 2 fills, perp leg reported off-chain'
  },
  {
    id: 12,
    agentKey: 'sentinel',
    verb: 'emitted',
    obj: 'Hedge signal #2',
    detail: '$2,000 USDC delta · sUSDe +1.5σ',
    kind: 'flag',
    verdict: 'flag',
    hash: '0x1aa09fabdd67a475bf8836064835b3d92c466ae215c8276fd8d50a51472bd873',
    ts: 1780594626000,
    doing: 'Hedging sUSDe rate band breach on Byreal short basis'
  },
  {
    id: 11,
    agentKey: 'sentinel',
    verb: 'rated',
    obj: 'Mezzanine · USDC',
    detail: 'green · Chainlink mETH oracle fresh',
    kind: 'verdict',
    verdict: 'clear',
    hash: '0xe5e86f053e5b76a271259a284078f322cf7e31e50ab4ce440922c6ced5dbe3ec',
    ts: 1780594620000,
    doing: 'Mezzanine tranche cleared, oracles in budget'
  },
  {
    id: 10,
    agentKey: 'sentinel',
    verb: 'cleared',
    obj: 'Proposal #1780594730',
    detail: 'verdict CLEAR · all 3 tranches green',
    kind: 'verdict',
    verdict: 'clear',
    hash: '0xb66c0a90f34052e2189993ead17fc744ebf5e2cabaa9e12476e90c654c952ea8',
    ts: 1780594614000,
    doing: 'sUSDe spread inside Mezz mandate · approved'
  },
  {
    id: 9,
    agentKey: 'architect',
    verb: 'proposed',
    obj: 'Allocation #1780594730',
    detail: 'Senior 55% · Mezz 35% · Junior 10% · tilt to mezz',
    kind: 'propose',
    hash: '0x47021e647758e54aa2a44064b480383c0c75c6b27fa7b225c4cfc05305808cc5',
    ts: 1780594608000,
    doing: 'Shifting 5pp from senior to mezz to capture sUSDe basis'
  },
  {
    id: 8,
    agentKey: 'scout',
    verb: 'published',
    obj: 'Yield Map v2',
    detail: 'sUSDe APY 9.40% (highest) · smart-money inflow weight',
    kind: 'publish',
    hash: '0x636bf573b020c512bedfbe88307e4cfef891123958478d545b15edfeb8ace688',
    ts: 1780594600000,
    doing: 'sUSDe now top RAAPY after Nansen inflow weight added'
  },

  // === Cycle 1 — seed cycle, baseline allocation ===
  {
    id: 7,
    agentKey: 'compliance',
    verb: 'issued',
    obj: 'Receipt #1',
    detail: 'STRATA-DEMO-2026-06 · Senior + Mezz + Junior · soulbound',
    kind: 'receipt',
    hash: '0x3657ec9f1a6121fe6d48b0d19a4cc316a07d3c275e96021a516a3a70768583e4',
    ts: 1780590794000,
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
    ts: 1780590490000,
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
    ts: 1780590194000,
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
    ts: 1780590092000,
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
    ts: 1780590028000,
    doing: 'Risk verdict signed and submitted'
  },
  {
    id: 2,
    agentKey: 'architect',
    verb: 'proposed',
    obj: 'Allocation #1780589901',
    detail: 'Senior 60% · Mezz 30% · Junior 10% · baseline',
    kind: 'propose',
    hash: '0xc4e23f8b2cb889c2abbce09ad7957f902be37ed8e300807ccedc2d28b6679970',
    ts: 1780589878000,
    doing: 'Drafted allocation off the latest Yield Map'
  },
  {
    id: 1,
    agentKey: 'scout',
    verb: 'published',
    obj: 'Yield Map v1',
    detail: '5 opportunities scored · RAAPY methodology',
    kind: 'publish',
    hash: '0x4f2a1bf4e0821ebb3d9ef224ad0423fea89eea6c43a6243dd738ef8b9c6ded33',
    ts: 1780589747000,
    doing: 'Signed yield map pinned and published'
  }
];

// CID per event so the dashboard can fetch the underlying signed JSON from Lighthouse.
export const REAL_EVENT_CIDS: Record<number, string> = {
  1:  'QmTMcLP23Yzi4cpW5XaVpjo1zH5Kdq74hiNgs9racZjt1s',
  2:  'QmTr1ekpVQE7tnADqnx2JKV26zwNEtDoJpRX2qdPMdQzyD',
  3:  'QmY73bjzmW6sL3XrTBVKFmeGf5Usa8Cs3TLd4s4hktdgez',
  4:  'QmPnpTBiLC2CMc7bPx988LChKdvGBcQf9wgKXRYceCQvSL',
  5:  'Qma6GLpMwVP47qL5mSMoXDu8CTnyqU5dh1biesWSY1nPvU',
  6:  'QmUcwKAkxvARKecsBZTUsBTgBGWyp9kB3LuTCu5XRmeYxv',
  7:  'QmUEVWAMJz15BmppMCP2d9wcjKHW7iRHJx8GCvsCwEhDgX',
  8:  'QmNuvY6MjHWxgrasLkVtNVAigHFs5jajr5Kz76nqswm5B5',
  9:  'Qmf32dWjnqvvx48SARrtZDbCCdYEwJo4DfS9DPyc7toWsV',
  10: 'QmdqN8LpoLQWXPG7zfp2oQNfXp2g3sn19cXyeYqbERokVe',
  11: 'QmUXBXBmCEfWzLhsrAFVu54mW3gmVsdT9UQysEXpQNaZgU',
  12: 'QmQzvmcLpcqeU1HSyWrge5w9aXmtvD5ToPUwrxfN2jBTWV',
  13: 'QmZ1DT4MisYvqRPwhcsFUjXScjKKBNFjyT8RAgAps5VDMn',
  14: 'QmXtvdoPJzfX3GDkhiAV6Vn6oEWgd2YpEdJqndjgykvAi3',
  15: 'QmQcbFuw9E3uwYfQhTCVKVCxBSA8KwxcNa7QRCzeziyo5h',
  16: 'QmPme4H5sNBMSMY2PZB34Q1A8mtV5X2L7HvCJWLutThcao',
  17: 'QmYfNfXKfCVvy4YsxfJ71qHmGjGmAyBSoZYW3BzeuvJUZ1',
  18: 'QmR8uFMZtwS5H8HJL92LYaus8GcmUwEeJjMd8Mo5bGv7Py',
  19: 'QmaUqxZu7ytjfbWmn9GSDgp7UwVrDoKfLqAQEnHiBVRBw6',
  20: 'QmSXhDm2kM4nawUJUcWVCh6BnA82HAPLWJ9hUCouyJDu3L',
  21: 'Qmc4WciCQnRKmtELNP21jU8GFdBGNtvBdWQxw249AvJF1G',
  22: 'QmSqHtf8Ukf2Ewv167yRCu3UZFfCuwLkgvGKGGpvQYk5fC',
  23: 'QmXZLe8K7RD9ComJsTqdn5txohsxpCnBB9EUic9dn7eKXi',
  24: 'QmVmCF93gnSxyDMmXT4NHg7zBYvkocuxdM96y7wnQstQvc',
  25: 'QmQqZsyvGQVpzzkBJNHZZKdFKikPVFDyNk4uU4CJgzK3kS'
};
