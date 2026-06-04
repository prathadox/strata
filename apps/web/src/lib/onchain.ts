// Live Mantle mainnet addresses for the Strata stack. Broadcast 2026-06-04 from deployer
// 0x6Bce9223A8ee13B7FA4108e9E9F0B65574D27355. Mirrored in contracts/deployments/5000.json.

export const MANTLE = {
  chainId: 5000,
  name: 'Mantle',
  explorer: 'https://mantlescan.xyz',
  rpc: 'https://rpc.mantle.xyz'
} as const;

export const explorer = {
  tx: (h: string) => `${MANTLE.explorer}/tx/${h}`,
  address: (a: string) => `${MANTLE.explorer}/address/${a}`,
  token: (a: string, id: number | string) => `${MANTLE.explorer}/token/${a}?a=${id}`
} as const;

export const lighthouseGateway = (cid: string) =>
  `https://gateway.lighthouse.storage/ipfs/${cid}`;

export interface DeployedContract {
  name: string;
  short: string;
  address: `0x${string}`;
  deployTx?: `0x${string}`;
  desc: string;
}

export const CORE: DeployedContract[] = [
  {
    name: 'AgentEventBus',
    short: 'Bus',
    address: '0x0E6F30bC6D9b08cD20d422D634d565d3300D0A62',
    deployTx: '0x0e77fb2e6a5f65ea2108475b8c9e1c60aa69a89844da83d2e280eb532291038a',
    desc: 'Role-gated emitter. One tx from a Strata agent becomes an auditable on-chain event the dashboard can verify.'
  },
  {
    name: 'TrancheController',
    short: 'Controller',
    address: '0xF65C36F0a8DB43edAb9d70Ab7eec025eA61BCecA',
    deployTx: '0x086c8181a5cdf6882e61cb14904899a8a37e81b492f9e70353150cbec0128f4c',
    desc: 'USDC custodian. Per-tranche NAV + verdict-gated allocation into adapters; runs the harvest waterfall.'
  },
  {
    name: 'ComplianceRegistry',
    short: 'Compliance',
    address: '0x0481bE75687b3d4daAc6fc0ED2c3b51DC85E7550',
    deployTx: '0xbc4d9e8c06b8c519363e8b728fcc9240bb74a2f75ce4ce29dc9cffb93191f303',
    desc: 'EIP-712 verifier-signed claims → soulbound receipt NFT. Vaults gate deposits through isAllowed(user, tranche).'
  },
  {
    name: 'ERC-8004 Identity Registry',
    short: '8004',
    address: '0x8004A169FB4a3325136EB29fA0ceB6D2e539a432',
    desc: 'Canonical agent identities. Tokens #101–#105 owned by the five Strata agent wallets.'
  }
];

export const VAULTS: DeployedContract[] = [
  {
    name: 'Senior Vault',
    short: 'sSTRATA',
    address: '0x7B70cd25c86E10F144f5D73A94f7F22c20aAA5db',
    deployTx: '0x654496c6b55dd2311c0bfda104130e272a540b4470f51e80a60fc2e6a969b52d',
    desc: 'ERC-4626 · first on yield, last on loss · target 6%'
  },
  {
    name: 'Mezzanine Vault',
    short: 'mSTRATA',
    address: '0xa076cF50656621BdcB5e4a8bfc991294615be37C',
    deployTx: '0x75159868b59683884648ddfbb11d0477f015d2e4d86cce66eb115f75fb621c3f',
    desc: 'ERC-4626 · second claim, balanced exposure · target 10%'
  },
  {
    name: 'Junior Vault',
    short: 'jSTRATA',
    address: '0xCaedb62edC3C49Fe9c1A2F77c307fE92844ACc2F',
    deployTx: '0xbe21471afa1504f80b20049197b584ce5974f5ab575de62366cb51650b09dfbe',
    desc: 'ERC-4626 · residual upside, first loss · target 18%+'
  }
];

export interface YieldAdapter extends DeployedContract {
  trustModel: 'trustless' | 'oracle' | 'operator' | 'demo';
  serves: ('senior' | 'mezzanine' | 'junior')[];
  cap: string;
}

export const ADAPTERS: YieldAdapter[] = [
  {
    name: 'Aave V3 USDC',
    short: 'aUSDC',
    address: '0xd8E4A25eab6de5D504E0A53d9Daec3687B3959a7',
    deployTx: '0x16e1f68987d4f87b7ceee9dd0696a832c9a5162087309f70f0ee5b887e707888',
    desc: 'Supplies USDC to Aave V3 on Mantle. aUSDC balance is the live position value.',
    trustModel: 'trustless',
    serves: ['senior', 'mezzanine'],
    cap: '$1,000'
  },
  {
    name: 'Ondo USDY',
    short: 'USDY',
    address: '0x0CDaea9582CF886Df9E359fD2435B86c9415Ba9b',
    deployTx: '0xe4b2320c5ffe621d6cb3fc079089f5d37a9aab0072d223246f818c2e1848dfb4',
    desc: 'Real-world T-bill exposure via Ondo USDY. Valued via on-chain oracle.',
    trustModel: 'oracle',
    serves: ['senior'],
    cap: '$1,000'
  },
  {
    name: 'mETH (Chainlink)',
    short: 'mETH',
    address: '0xd526DD02366F9DA22232Ed8cDD1db197bc51F2be',
    deployTx: '0xb64dbdd3e52145939ae0d12a4f84a45709c2e23bccb6d935afbad02ebfeb9046',
    desc: 'Mantle LST. Valued via Chainlink mETH/USD with a 1-day staleness bound. FX-labeled.',
    trustModel: 'oracle',
    serves: ['mezzanine'],
    cap: '$1,000'
  },
  {
    name: 'Ethena sUSDe',
    short: 'sUSDe',
    address: '0xfA8240669B9fC8A697F1595d7ceAe9e81c480663',
    deployTx: '0x2ce4cc9eaabfab25c71ceb4dbd84d1fa0295b78789aec88d949dc1f7ec565bb7',
    desc: 'USDC → USDe → sUSDe via Agni. Conservative owner-maintained rate, never marked to pool.',
    trustModel: 'oracle',
    serves: ['mezzanine', 'junior'],
    cap: '$1,000'
  },
  {
    name: 'Agni USDC/USDe LP',
    short: 'AgniLP',
    address: '0x755D0BA62C10dae194091F395c96E9d14CF879F2',
    deployTx: '0x4d08e08a383599f649373fbf3529019b342573c8d3c3c83cd10bc7dd274144a7',
    desc: 'Full-range V3 NFT LP. NAV = cost-basis + idle, peg-clamped at $1 USDe.',
    trustModel: 'operator',
    serves: ['junior'],
    cap: '$1,000'
  },
  {
    name: 'Perp basis escrow',
    short: 'Perp',
    address: '0x55F90908eFe0E8e78a4CDE445d57a1EDB26d3f32',
    deployTx: '0xde9c792d744514e8fc6ab3a90496b7da1f7490d8b8c9d3e5052939a6f3417b23',
    desc: 'Spot leg escrow. Off-chain Byreal/Hyperliquid perp value reported by Operator agent.',
    trustModel: 'operator',
    serves: ['junior'],
    cap: '$1,000'
  }
];

export type AgentRole = 'Scout' | 'Architect' | 'Sentinel' | 'Operator' | 'Compliance';

export interface AgentArtifact {
  label: string;
  detail: string;
  cid?: string;
  txHash?: `0x${string}`;
}

export interface Agent {
  id: number;
  key: 'scout' | 'architect' | 'sentinel' | 'operator' | 'compliance';
  role: AgentRole;
  shortRole: string;
  glyph: string;
  color: '--senior' | '--mezz' | '--junior' | '--pink' | '--paper-dim';
  wallet: `0x${string}`;
  roleGrantTx?: `0x${string}`;
  registryAddress: `0x${string}`;
  strategyCid: string;
  reputation: number;
  actions: number;
  verified: boolean;
  status: 'working' | 'idle';
  doing: string;
  output: string;
  desc: string;
  emits: string;
  reads: string;
  artifacts: AgentArtifact[];
}

export const AGENTS: Agent[] = [
  {
    id: 101,
    key: 'scout',
    role: 'Scout',
    shortRole: 'Yield sourcing',
    glyph: 'SC',
    color: '--senior',
    wallet: '0x7CAC071f0F59dEe64509ea1C3BD8245bE529fcdE',
    roleGrantTx: '0x7b00fa8a8ad101964d05e2834cf0165cbf89f237103d83422e383bbb722f6ed0',
    registryAddress: '0x8004A169FB4a3325136EB29fA0ceB6D2e539a432',
    strategyCid: 'bafybeih…scout412',
    reputation: 0.94,
    actions: 4128,
    verified: true,
    status: 'working',
    doing: 'Scanning Mantle for yield positions',
    output: 'Yield Map',
    desc: 'Scans the Mantle yield universe, scores each pool on risk-adjusted RAAPY, and publishes a signed Yield Map to IPFS.',
    emits: 'YieldMapPublished',
    reads: 'DefiLlama, CoinGecko, Nansen',
    artifacts: [
      {
        label: 'Latest Yield Map',
        detail: 'v412 · 24 opportunities scored · methodology hash 0x8f4c…',
        cid: 'bafkreigh6scoutyieldmapdemoplaceholder000000000000000000',
        txHash: '0x9a2c4f0e8b1d7a3e2f6c5b4a9d8c7e6f5a4b3c2d1e0f9a8b7c6d5e4f3a2b1c0d'
      }
    ]
  },
  {
    id: 102,
    key: 'architect',
    role: 'Architect',
    shortRole: 'Portfolio',
    glyph: 'AR',
    color: '--mezz',
    wallet: '0xbFDb8d132358b2f46D3104Ef484048Bb916De714',
    roleGrantTx: '0x5690677701ca4ed036343e551f6c05d24f0640b59b5d425cd33fff394899bd53',
    registryAddress: '0x8004A169FB4a3325136EB29fA0ceB6D2e539a432',
    strategyCid: 'bafybeig…arch088',
    reputation: 0.91,
    actions: 2740,
    verified: true,
    status: 'working',
    doing: 'Proposing senior rebalance +0.4% USDY',
    output: 'Allocation',
    desc: 'Reads the Yield Map plus Operator hedge logs, then proposes a per-tranche allocation gated by Sentinel.',
    emits: 'AllocationProposed',
    reads: 'YieldMapPublished, HedgeLogged',
    artifacts: [
      {
        label: 'Latest proposal',
        detail: 'id #4128 · Senior 60% · Mezz 30% · Junior 10%',
        cid: 'bafkreiarchitectallocationdemoplaceholder000000000000',
        txHash: '0x4d1130a8f9c2b7d4e1a0c5b8e3d6f9a2c5b8e1d4f7a0c3b6e9d2f5a8b1c4e7d0'
      }
    ]
  },
  {
    id: 103,
    key: 'sentinel',
    role: 'Sentinel',
    shortRole: 'Risk',
    glyph: 'SN',
    color: '--pink',
    wallet: '0xfE7EB19092F03E00B6eD0a248D38E80e0aA8708f',
    roleGrantTx: '0x3c4a3ee8e8e1e6cf1f6c563a66f0cfcb6fbfd8f00fb6177ac3a8bd0e234a418e',
    registryAddress: '0x8004A169FB4a3325136EB29fA0ceB6D2e539a432',
    strategyCid: 'bafybeik…sent229',
    reputation: 0.97,
    actions: 6310,
    verified: true,
    status: 'working',
    doing: 'Running duration + depeg models',
    output: 'Risk verdict',
    desc: 'Independent risk desk. Issues binary verdicts and per-asset green/yellow/red ratings on every Architect proposal.',
    emits: 'RiskVerdictIssued, AssetRiskRated, HedgeSignalEmitted',
    reads: 'AllocationProposed, oracle feeds',
    artifacts: [
      {
        label: 'Latest verdict',
        detail: 'id #4128 · CLEAR · Senior green · Mezz green · Junior yellow',
        cid: 'bafkreisentinelverdictdemoplaceholder0000000000000000',
        txHash: '0x71f80c190a3b5d7e1f4a6c8b2d5e7f9a1c3b5d7e9f1a3c5b7d9e1f3a5b7c9d1e'
      }
    ]
  },
  {
    id: 104,
    key: 'operator',
    role: 'Operator',
    shortRole: 'Hedging',
    glyph: 'OP',
    color: '--junior',
    wallet: '0xB342B41A68a3c6C36Efb8f224CDd252F90aD519E',
    roleGrantTx: '0x9fbbbc5a8ec71051fb562ed370eaef20d69e79bfc28ad7c030679963b3650b37',
    registryAddress: '0x8004A169FB4a3325136EB29fA0ceB6D2e539a432',
    strategyCid: 'bafybeil…oper170',
    reputation: 0.88,
    actions: 1894,
    verified: true,
    status: 'idle',
    doing: 'Awaiting hedge signal from Sentinel',
    output: 'Hedge fill',
    desc: 'Executes hedge signals on Byreal Perps off-chain, then logs the fill with a pointer back to the originating signalId.',
    emits: 'HedgeLogged, HedgeValueReported',
    reads: 'HedgeSignalEmitted',
    artifacts: [
      {
        label: 'Latest hedge log',
        detail: 'signalId #312 · -$50K MNT short · slippage 4 bps',
        cid: 'bafkreioperatorhedgelogdemoplaceholder000000000000000',
        txHash: '0xc3027e1209a3b5d7e1f4a6c8b2d5e7f9a1c3b5d7e9f1a3c5b7d9e1f3a5b7c9d1'
      }
    ]
  },
  {
    id: 105,
    key: 'compliance',
    role: 'Compliance',
    shortRole: 'Policy',
    glyph: 'CO',
    color: '--paper-dim',
    wallet: '0x59767a3E91998A07D11aBE13CD460Fa3249CA628',
    registryAddress: '0x8004A169FB4a3325136EB29fA0ceB6D2e539a432',
    strategyCid: 'bafybeim…comp054',
    reputation: 0.99,
    actions: 982,
    verified: true,
    status: 'idle',
    doing: 'Policy registry synced · idle',
    output: 'Receipt + Policy',
    desc: 'EIP-712 verifier on ComplianceRegistry. Signs ClaimData off-chain; depositors redeem for a soulbound receipt NFT.',
    emits: 'ComplianceVerified, PolicyUpdated',
    reads: 'zkPass / Privado credential proofs, sanctions oracles',
    artifacts: [
      {
        label: 'Latest receipt',
        detail: '#2184 · EU-MiCA · Senior + Mezz + Junior · soulbound',
        cid: 'bafkreicompliancereceiptdemoplaceholder0000000000000',
        txHash: '0xee04b9a1f8d2a5c7e0b3d6f9a2c5b8e1d4f7a0c3b6e9d2f5a8b1c4e7d0a3c6b9'
      }
    ]
  }
];

export function agentByKey(key: string) {
  return AGENTS.find((a) => a.key === key);
}
