// Inline canonical content for the 19 seed-cycle docs. Same fields the agents
// pinned to Lighthouse on 2026-06-04. Signatures + publishedAtSec are stripped
// (they live on the on-chain CID; verify out-of-band via Mantlescan + Lighthouse).
// The docs parser reads from here first so the dashboard always renders even
// when the IPFS gateway is slow / paywalled.

export const SEED_DOCS: Record<number, any> = {
  // ---------- Cycle 1: baseline 60/30/10 ----------
  1: {
    role: 'scout',
    tokenId: 101,
    methodology: 'first-principles RAAPY: apy - sum(p_i * alpha_i)',
    opportunities: [
      { project: 'aave-v3',             asset: 'USDC',      chain: 'mantle', apy: 0.034, raapy: 0.033, expectedLoss: 0.001, confidence: 0.93, tranches: ['senior', 'mezzanine', 'junior'] },
      { project: 'ondo-finance',        asset: 'USDY',      chain: 'mantle', apy: 0.046, raapy: 0.044, expectedLoss: 0.002, confidence: 0.88, tranches: ['senior', 'mezzanine'] },
      { project: 'ethena',              asset: 'sUSDe',     chain: 'mantle', apy: 0.092, raapy: 0.072, expectedLoss: 0.020, confidence: 0.78, tranches: ['mezzanine', 'junior'] },
      { project: 'agni-finance',        asset: 'USDC/USDe', chain: 'mantle', apy: 0.118, raapy: 0.080, expectedLoss: 0.038, confidence: 0.70, tranches: ['junior'] },
      { project: 'mantle-staked-ether', asset: 'mETH',      chain: 'mantle', apy: 0.038, raapy: 0.031, expectedLoss: 0.007, confidence: 0.84, tranches: ['mezzanine'] }
    ]
  },
  2: {
    role: 'architect',
    tokenId: 102,
    proposalId: '1780589901',
    sourceYieldMapCid: 'QmTMcLP23Yzi4cpW5XaVpjo1zH5Kdq74hiNgs9racZjt1s',
    allocations: {
      senior:    { bps: 6000, targets: [{ adapter: 'AaveV3UsdcAdapter', bps: 7000 }, { adapter: 'OndoUsdyAdapter', bps: 3000 }] },
      mezzanine: { bps: 3000, targets: [{ adapter: 'AaveV3UsdcAdapter', bps: 4000 }, { adapter: 'AgniLpUsdcUsdeAdapter', bps: 4000 }, { adapter: 'MethAdapter', bps: 2000 }] },
      junior:    { bps: 1000, targets: [{ adapter: 'EthenaSusdeAdapter', bps: 6000 }, { adapter: 'PerpBasisEscrowAdapter', bps: 4000 }] }
    },
    rationale: 'Senior holds Aave + Ondo (trustless + RWA T-bill yield). Mezz mixes Aave with Agni LP and mETH for moderate FX-labeled exposure. Junior takes Ethena basis trade and perp-hedged spot.'
  },
  3: {
    role: 'sentinel',
    tokenId: 103,
    proposalId: '1780589901',
    decision: 'approved',
    perTranche: {
      senior:    { rating: 'green',  reasons: ['Aave V3 trustless; Ondo oracle-fresh; size within Senior cap'] },
      mezzanine: { rating: 'green',  reasons: ['Aave/Agni mix; mETH FX guarded by Chainlink staleness bound'] },
      junior:    { rating: 'yellow', reasons: ['Ethena depeg tail risk; perp basis operator-custodied — labeled, not hidden'] }
    }
  },
  4: { proposalId: '1780589901', asset: '0x09Bc4E0D864854c6aFB6eB9A9cdF58aC190D0dF9', ratings: [{ tranche: 0, rating: 'green' }, { tranche: 1, rating: 'green' }, { tranche: 2, rating: 'yellow' }] },
  5: {
    role: 'sentinel',
    tokenId: 103,
    underlyingAsset: '0x09Bc4E0D864854c6aFB6eB9A9cdF58aC190D0dF9',
    deltaSizeUsdc6dec: '1000000000',
    rationale: 'Mezzanine FX-labeled mETH leg crossed Chainlink staleness ceiling; hedging $1k notional via perp basis.'
  },
  6: {
    role: 'operator',
    tokenId: 104,
    signalId: '1',
    sourceSignalCid: 'Qma6GLpMwVP47qL5mSMoXDu8CTnyqU5dh1biesWSY1nPvU',
    hedgedAsset: '0x09Bc4E0D864854c6aFB6eB9A9cdF58aC190D0dF9',
    netPositionUsdc6dec: '500000000',
    venue: 'Byreal Perps (Hyperliquid settlement)',
    fill: { side: 'short', sizeBase: '0.0', avgPriceUsd: '0.0', note: 'Operator escrowed the spot leg on-chain; the perp leg fill is reported off-chain via PerpBasisEscrowAdapter.reportHedgeValue.' }
  },
  7: {
    role: 'compliance',
    tokenId: 105,
    policyId: 'STRATA-DEMO-2026-06',
    jurisdictionCode: 'GLOBAL',
    permittedTranches: ['senior', 'mezzanine', 'junior'],
    sources: ['Self-attestation for hackathon demo; not production KYC']
  },

  // ---------- Cycle 2: sUSDe leads, tilt to mezz ----------
  8: {
    role: 'scout',
    tokenId: 101,
    methodology: 'first-principles RAAPY: apy - sum(p_i * alpha_i) · v2 with smart-money inflow weight',
    opportunities: [
      { project: 'aave-v3',             asset: 'USDC',      chain: 'mantle', apy: 0.035, raapy: 0.034, expectedLoss: 0.001, confidence: 0.93, tranches: ['senior', 'mezzanine', 'junior'] },
      { project: 'ondo-finance',        asset: 'USDY',      chain: 'mantle', apy: 0.047, raapy: 0.045, expectedLoss: 0.002, confidence: 0.89, tranches: ['senior', 'mezzanine'] },
      { project: 'ethena',              asset: 'sUSDe',     chain: 'mantle', apy: 0.094, raapy: 0.078, expectedLoss: 0.016, confidence: 0.82, tranches: ['mezzanine', 'junior'] },
      { project: 'agni-finance',        asset: 'USDC/USDe', chain: 'mantle', apy: 0.121, raapy: 0.082, expectedLoss: 0.039, confidence: 0.71, tranches: ['junior'] },
      { project: 'mantle-staked-ether', asset: 'mETH',      chain: 'mantle', apy: 0.039, raapy: 0.032, expectedLoss: 0.007, confidence: 0.85, tranches: ['mezzanine'] }
    ]
  },
  9: {
    role: 'architect',
    tokenId: 102,
    proposalId: '1780594730',
    allocations: {
      senior:    { bps: 5500, targets: [{ adapter: 'AaveV3UsdcAdapter', bps: 6500 }, { adapter: 'OndoUsdyAdapter', bps: 3500 }] },
      mezzanine: { bps: 3500, targets: [{ adapter: 'AaveV3UsdcAdapter', bps: 3500 }, { adapter: 'EthenaSusdeAdapter', bps: 3500 }, { adapter: 'AgniLpUsdcUsdeAdapter', bps: 3000 }] },
      junior:    { bps: 1000, targets: [{ adapter: 'EthenaSusdeAdapter', bps: 5500 }, { adapter: 'PerpBasisEscrowAdapter', bps: 4500 }] }
    },
    rationale: 'sUSDe rate widening relative to USDY: shifting 5pp from senior to mezz to capture the basis without crossing the Junior cap.'
  },
  10: {
    role: 'sentinel',
    tokenId: 103,
    proposalId: '1780594730',
    decision: 'approved',
    perTranche: {
      senior:    { rating: 'green', reasons: ['Aave V3 trustless; Ondo oracle within 1h freshness; Senior cap untouched'] },
      mezzanine: { rating: 'green', reasons: ['sUSDe rate spread inside Mezz mandate; Chainlink mETH oracle fresh'] },
      junior:    { rating: 'green', reasons: ['Agni LP cost-basis NAV holding; perp basis funding rate flat'] }
    }
  },
  11: { proposalId: '1780594730', asset: '0x09Bc4E0D864854c6aFB6eB9A9cdF58aC190D0dF9', ratings: [{ tranche: 0, rating: 'green' }, { tranche: 1, rating: 'green' }, { tranche: 2, rating: 'green' }] },
  12: {
    role: 'sentinel',
    tokenId: 103,
    underlyingAsset: '0x09Bc4E0D864854c6aFB6eB9A9cdF58aC190D0dF9',
    deltaSizeUsdc6dec: '2000000000',
    rationale: 'sUSDe leg crossed +1.5σ rate band; hedging $2k USDC notional on Byreal short basis to stay duration-neutral.'
  },
  13: {
    role: 'operator',
    tokenId: 104,
    signalId: '2',
    hedgedAsset: '0x09Bc4E0D864854c6aFB6eB9A9cdF58aC190D0dF9',
    netPositionUsdc6dec: '1000000000',
    venue: 'Byreal Perps (Hyperliquid settlement)',
    fill: { side: 'short', sizeBase: '0.0', avgPriceUsd: '0.0', note: 'Spot leg escrowed to PerpBasisEscrowAdapter; Byreal short opened in 2 fills @ avg basis 14bps.' }
  },

  // ---------- Cycle 3: USDY spikes, tilt to senior, junior blocked ----------
  14: {
    role: 'scout',
    tokenId: 101,
    methodology: 'first-principles RAAPY: apy - sum(p_i * alpha_i) · v3 with 7-day MA',
    opportunities: [
      { project: 'aave-v3',             asset: 'USDC',      chain: 'mantle', apy: 0.036, raapy: 0.035, expectedLoss: 0.001, confidence: 0.94, tranches: ['senior', 'mezzanine', 'junior'] },
      { project: 'ondo-finance',        asset: 'USDY',      chain: 'mantle', apy: 0.051, raapy: 0.049, expectedLoss: 0.002, confidence: 0.91, tranches: ['senior', 'mezzanine'] },
      { project: 'ethena',              asset: 'sUSDe',     chain: 'mantle', apy: 0.090, raapy: 0.069, expectedLoss: 0.021, confidence: 0.76, tranches: ['mezzanine', 'junior'] },
      { project: 'agni-finance',        asset: 'USDC/USDe', chain: 'mantle', apy: 0.115, raapy: 0.077, expectedLoss: 0.038, confidence: 0.68, tranches: ['junior'] },
      { project: 'mantle-staked-ether', asset: 'mETH',      chain: 'mantle', apy: 0.040, raapy: 0.033, expectedLoss: 0.007, confidence: 0.86, tranches: ['mezzanine'] }
    ]
  },
  15: {
    role: 'architect',
    tokenId: 102,
    proposalId: '1780594769',
    allocations: {
      senior:    { bps: 6500, targets: [{ adapter: 'AaveV3UsdcAdapter', bps: 6000 }, { adapter: 'OndoUsdyAdapter', bps: 4000 }] },
      mezzanine: { bps: 2500, targets: [{ adapter: 'AaveV3UsdcAdapter', bps: 5000 }, { adapter: 'AgniLpUsdcUsdeAdapter', bps: 3500 }, { adapter: 'MethAdapter', bps: 1500 }] },
      junior:    { bps: 1000, targets: [{ adapter: 'EthenaSusdeAdapter', bps: 6000 }, { adapter: 'PerpBasisEscrowAdapter', bps: 4000 }] }
    },
    rationale: 'USDY 7d MA crossed 5%; Sentinel staleness warning on mETH leg. Pulling mezz down 5pp into senior duration-matched paper.'
  },
  16: {
    role: 'sentinel',
    tokenId: 103,
    proposalId: '1780594769',
    decision: 'blocked',
    perTranche: {
      senior:    { rating: 'green',  reasons: ['Within budget'] },
      mezzanine: { rating: 'yellow', reasons: ['mETH Chainlink staleness 22h, approaching 24h ceiling'] },
      junior:    { rating: 'red',    reasons: ['Ethena basis funding dropped 70bps in 24h; refusing to scale junior until next cycle'] }
    }
  },
  17: { proposalId: '1780594769', asset: '0x09Bc4E0D864854c6aFB6eB9A9cdF58aC190D0dF9', ratings: [{ tranche: 0, rating: 'green' }, { tranche: 1, rating: 'yellow' }, { tranche: 2, rating: 'red' }] },
  18: {
    role: 'sentinel',
    tokenId: 103,
    underlyingAsset: '0x09Bc4E0D864854c6aFB6eB9A9cdF58aC190D0dF9',
    deltaSizeUsdc6dec: '500000000',
    rationale: 'Defensive: trim hedge to $500 USDC while Junior is blocked; Operator unwinds excess perp short.'
  },
  19: {
    role: 'operator',
    tokenId: 104,
    signalId: '3',
    hedgedAsset: '0x09Bc4E0D864854c6aFB6eB9A9cdF58aC190D0dF9',
    netPositionUsdc6dec: '125000000',
    venue: 'Byreal Perps (close-down)',
    fill: { side: 'short', sizeBase: '0.0', avgPriceUsd: '0.0', note: 'Partial fill: Sentinel told us to trim. Closed 3/4 of prior $500 short, kept $125 nominal as residual.' }
  }
};
