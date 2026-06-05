# Keeper

Closes the bus -> controller -> adapter loop. Watches `RiskVerdictIssued` on the AgentEventBus, pairs each approved verdict with its `AllocationProposed`, fetches the Architect's pinned allocation JSON from IPFS, resolves adapter names to addresses, and calls `TrancheController.executeAllocation(...)`.

Sixth Railway service. Runs with its own EOA (the deployer key is reserved for admin). Cycle interval matches the other agents (24h).

## Environment

| Variable | Required | Default | Notes |
|---|---|---|---|
| `KEEPER_PRIVATE_KEY` | yes | | 0x-prefixed 32-byte hex; needs the executor role (see setup) |
| `MANTLE_RPC_URL` | yes | | Mantle mainnet RPC |
| `AGENT_EVENT_BUS_ADDRESS` | yes | | `0x0E6F30bC6D9b08cD20d422D634d565d3300D0A62` |
| `TRANCHE_CONTROLLER_ADDRESS` | yes | | `0xF65C36F0a8DB43edAb9d70Ab7eec025eA61BCecA` |
| `MAX_LOOKBACK_BLOCKS` | no | `50000` | RiskVerdictIssued scan window per cycle |

## One-time setup

1. Generate a fresh keeper EOA, set `KEEPER_PRIVATE_KEY` on the Railway service.
2. Fund the keeper address with ~0.05 MNT for gas.
3. From the deployer key, grant executor authority:

```bash
DEPLOYER_PRIVATE_KEY=0x... \
MANTLE_RPC_URL=https://... \
TRANCHE_CONTROLLER_ADDRESS=0xF65C36F0a8DB43edAb9d70Ab7eec025eA61BCecA \
KEEPER_ADDRESS=0x... \
pnpm tsx agents/keeper/scripts/grant-executor.ts
```

The script reads the current executor, verifies the caller is the controller owner, and writes the new executor in a single tx. The previous executor (the deployer per `Deploy.s.sol`) is replaced cleanly.

## Run

```bash
pnpm install
pnpm --filter @strata/keeper build
pnpm --filter @strata/keeper dev   # local: tsx watch loop
```

Railway uses the shared `nixpacks.toml`; setting `AGENT_NAME=keeper` on the service dispatches to `pnpm --filter @strata/keeper demo`.

## Adapter name mapping

The Architect's pinned JSON references adapters by these names. They map to deployed addresses in `contracts/deployments/5000.json`. Update the table in `src/demo.ts` if a new adapter ships.

| Name | Address |
|---|---|
| `AaveV3UsdcAdapter` | `0xd8E4A25eab6de5D504E0A53d9Daec3687B3959a7` |
| `OndoUsdyAdapter` | `0x0CDaea9582CF886Df9E359fD2435B86c9415Ba9b` |
| `MethAdapter` | `0xd526DD02366F9DA22232Ed8cDD1db197bc51F2be` |
| `AgniLpUsdcUsdeAdapter` | `0x755D0BA62C10dae194091F395c96E9d14CF879F2` |
| `EthenaSusdeAdapter` | `0xfA8240669B9fC8A697F1595d7ceAe9e81c480663` |
| `PerpBasisEscrowAdapter` | `0x55F90908eFe0E8e78a4CDE445d57a1EDB26d3f32` |

Unknown adapter names are logged and skipped, never thrown.

## Failure modes

| Cause | Behavior |
|---|---|
| IPFS fetch fails after 3-gateway fallback | log + skip proposal, continue cycle |
| Unknown adapter name in allocation JSON | log + skip that target, build the rest |
| `executeAllocation` reverts (TTL, bps invalid, liquidity) | log + skip proposal, continue cycle |
| Missing env | crash at boot |

The cycle never aborts on a per-proposal error. The keeper runs against real mainnet money, so failures are surfaced via structured logs and retried on the next cycle.
