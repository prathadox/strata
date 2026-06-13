# Strata contracts

Foundry workspace for the Strata Mantle deployment. Source for the 14 contracts referenced from the [root README](../README.md), plus deploy scripts, tests, and the broadcast artifact at [`deployments/5000.json`](deployments/5000.json).

## Deployed addresses (Mantle mainnet, chain 5000)

| Contract | Address |
|---|---|
| AgentEventBus | [`0x0E6F30bC6D9b08cD20d422D634d565d3300D0A62`](https://mantlescan.xyz/address/0x0E6F30bC6D9b08cD20d422D634d565d3300D0A62) |
| TrancheController | [`0xF65C36F0a8DB43edAb9d70Ab7eec025eA61BCecA`](https://mantlescan.xyz/address/0xF65C36F0a8DB43edAb9d70Ab7eec025eA61BCecA) |
| ComplianceRegistry | [`0x0481bE75687b3d4daAc6fc0ED2c3b51DC85E7550`](https://mantlescan.xyz/address/0x0481bE75687b3d4daAc6fc0ED2c3b51DC85E7550) |
| ComplianceGate | [`0x0481bE75687b3d4daAc6fc0ED2c3b51DC85E7550`](https://mantlescan.xyz/address/0x0481bE75687b3d4daAc6fc0ED2c3b51DC85E7550) |
| ERC-8004 Identity Registry | [`0x8004A169FB4a3325136EB29fA0ceB6D2e539a432`](https://mantlescan.xyz/address/0x8004A169FB4a3325136EB29fA0ceB6D2e539a432) |
| Senior Vault (sSTRATA) | [`0x7B70cd25c86E10F144f5D73A94f7F22c20aAA5db`](https://mantlescan.xyz/address/0x7B70cd25c86E10F144f5D73A94f7F22c20aAA5db) |
| Mezzanine Vault (mSTRATA) | [`0xa076cF50656621BdcB5e4a8bfc991294615be37C`](https://mantlescan.xyz/address/0xa076cF50656621BdcB5e4a8bfc991294615be37C) |
| Junior Vault (jSTRATA) | [`0xCaedb62edC3C49Fe9c1A2F77c307fE92844ACc2F`](https://mantlescan.xyz/address/0xCaedb62edC3C49Fe9c1A2F77c307fE92844ACc2F) |
| Aave V3 USDC adapter | [`0xd8E4A25eab6de5D504E0A53d9Daec3687B3959a7`](https://mantlescan.xyz/address/0xd8E4A25eab6de5D504E0A53d9Daec3687B3959a7) |
| Ondo USDY adapter | [`0x0CDaea9582CF886Df9E359fD2435B86c9415Ba9b`](https://mantlescan.xyz/address/0x0CDaea9582CF886Df9E359fD2435B86c9415Ba9b) |
| mETH adapter | [`0xd526DD02366F9DA22232Ed8cDD1db197bc51F2be`](https://mantlescan.xyz/address/0xd526DD02366F9DA22232Ed8cDD1db197bc51F2be) |
| Ethena sUSDe adapter | [`0xfA8240669B9fC8A697F1595d7ceAe9e81c480663`](https://mantlescan.xyz/address/0xfA8240669B9fC8A697F1595d7ceAe9e81c480663) |
| Agni LP adapter | [`0x755D0BA62C10dae194091F395c96E9d14CF879F2`](https://mantlescan.xyz/address/0x755D0BA62C10dae194091F395c96E9d14CF879F2) |
| Perp basis escrow | [`0x55F90908eFe0E8e78a4CDE445d57a1EDB26d3f32`](https://mantlescan.xyz/address/0x55F90908eFe0E8e78a4CDE445d57a1EDB26d3f32) |
| USDC (Mantle) | [`0x09Bc4E0D864854c6aFB6eB9A9cdF58aC190D0dF9`](https://mantlescan.xyz/address/0x09Bc4E0D864854c6aFB6eB9A9cdF58aC190D0dF9) |

ComplianceGate and ComplianceRegistry share the same address: `ComplianceRegistry.sol` implements both interfaces.

## Build and test

```bash
forge install && forge build && forge test -vv
```

## Re-deploy

```bash
forge script script/Deploy.s.sol --rpc-url $MANTLE_RPC --broadcast --verify
```

## Verify an existing deploy

```bash
forge verify-contract --chain 5000 --etherscan-api-key $MANTLESCAN_KEY <address> src/<Contract>.sol:<Contract>
```

Mantlescan verification is being driven separately by the contracts engineer (Aaron). Don't read the absence of a green check as a missing contract; cross-reference [`deployments/5000.json`](deployments/5000.json) for the authoritative address list.

## Layout

- `src/` - Solidity sources (AgentEventBus, TrancheController, vaults, adapters, ComplianceRegistry, ERC-8004 IdentityRegistry under `contracts/StrataIdentity.sol`).
- `script/` - Foundry deploy + role-grant scripts.
- `test/` - Foundry unit, fork, and invariant tests.
- `abis/` - ABIs consumed by off-chain workers.
- `deployments/5000.json` - Mantle mainnet broadcast artifact.
- `scripts/` - TypeScript helpers for ERC-8004 identity bootstrap.
- `ARCHITECTURE.md`, `ONBOARDING.md` - longer-form contract docs.
