# Agent Wallet Addresses

Generated 2026-05-27. Private keys are in each agent's `.env` (gitignored).

| Agent | Address | ERC-8004 ID | Health Port |
|-------|---------|-------------|-------------|
| Scout | `0x7CAC071f0F59dEe64509ea1C3BD8245bE529fcdE` | #1 | 9090 (default) |
| Architect | `0xbFDb8d132358b2f46D3104Ef484048Bb916De714` | #2 | 9091 |
| Sentinel | `0xfE7EB19092F03E00B6eD0a248D38E80e0aA8708f` | #3 | 9092 |
| Operator | `0xB342B41A68a3c6C36Efb8f224CDd252F90aD519E` | #4 | 9093 |
| Compliance | `0x59767a3E91998A07D11aBE13CD460Fa3249CA628` | #5 | 9094 |

## Deployed contracts (Mantle mainnet, chain ID 5000)

| Contract | Address |
|----------|---------|
| StrataIdentity (ERC-8004) | `0xE7d646467Dd317B58448dD421C207b1199F482bd` |
| Deployer | `0x6Bce9223A8ee13B7FA4108e9E9F0B65574D27355` |

## Cross-references

Agents that verify upstream signatures need the upstream agent's address in their `.env`:

- **Architect** needs `SCOUT_ADDRESS` (Scout's address)
- **Sentinel** needs `ARCHITECT_ADDRESS` + `SCOUT_ADDRESS`
- **Operator** needs `SENTINEL_ADDRESS`
- **Compliance** is standalone (deposit gate, no upstream agent dependency)

These cross-references are already wired in the `.env` files above.

## For remaining contract deployment

Your coworker needs these addresses to:

1. Grant `EMITTER_ROLE` on `AgentEventBus` to all 5 addresses
2. Grant `MINTER_ROLE` on `ComplianceRegistry` to Compliance's address
3. Grant `MINTER_ROLE` on `JurisdictionPolicyNFT` to Compliance's address

## Funding

Each address needs a small amount of MNT for gas on Mantle mainnet (chain ID 5000). In dry-run mode, no gas is consumed.
