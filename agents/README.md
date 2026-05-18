# Strata agents

Strata is a tranched RWA yield protocol on Mantle. Five autonomous agents run the asset-manager workflow. Each one has an on-chain identity, a public strategy, and a reputation that only grows through verified actions.

This directory holds the off-chain worker code. The on-chain contracts (`AgentEventBus`, `ComplianceRegistry`, `TrancheVault`, ERC-8004 identity) live in a sibling repo owned by the contracts engineer.

```text
agents/
  scout/        # agent 1, yield sourcing  (this repo)
  architect/    # agent 2, portfolio       (next up)
  sentinel/     # agent 3, risk            (next up)
  operator/     # agent 4, hedging         (next up)
  compliance/   # agent 5, policy          (next up)
```

## The agents at a glance

| # | Agent | Job | Reads | Emits |
|---|---|---|---|---|
| 1 | **Scout** | Yield sourcing | DefiLlama, CoinGecko, Nansen | `YieldMapPublished(agent, ipfsHash, ts)` |
| 2 | **Architect** | Portfolio construction | `YieldMapPublished`, `HedgeLogged` | `AllocationProposed(proposalId, agent, seniorBps, mezzBps, juniorBps, reasoningHash)` |
| 3 | **Sentinel** | Risk gate + macro signals | `AllocationProposed`, oracle feeds | `RiskVerdictIssued(proposalId, agent, approved, conditionHash)`, `HedgeSignalEmitted(agent, asset, delta, reasoningHash)` |
| 4 | **Operator** | Byreal Perps hedging | `HedgeSignalEmitted` | `HedgeLogged(agent, asset, netPosition, executionProof)` |
| 5 | **Compliance** | Deposit-gate, jurisdiction policy | zkPass / Privado credential proofs, sanctions oracles | `ComplianceVerified(user, policyId, zkReceiptHash)`, `PolicyUpdated(policyId, name, uri)` (on `ComplianceRegistry`, not the main bus) |

Loop order: Scout publishes a Yield Map. Architect reads it, drafts an allocation, emits a proposal. Sentinel sees the proposal, runs its risk model against the current exposure, and either clears it or blocks it. If Sentinel separately spots an exposure that needs hedging, it emits a hedge signal to Operator. Operator executes off-chain on Byreal Perps and logs the fill back on-chain. Architect reads the latest hedge log before its next proposal so it allocates against net exposure, not gross.

Compliance runs in parallel rather than in this loop. It gates deposits at the protocol boundary and publishes Jurisdiction Policy NFTs that other Mantle protocols can subscribe to.

## The event bus

All four operating-loop agents (Scout, Architect, Sentinel, Operator) emit through one shared contract, `AgentEventBus`. Compliance has its own registry contract on a different lifecycle.

```solidity
// canonical event signatures locked in
event YieldMapPublished(address indexed agent, string ipfsHash, uint256 timestamp);
event AllocationProposed(uint256 indexed proposalId, address indexed agent, uint256 seniorBps, uint256 mezzBps, uint256 juniorBps, string reasoningHash);
event RiskVerdictIssued(uint256 indexed proposalId, address indexed agent, bool isApproved, string conditionHash);
event HedgeSignalEmitted(address indexed agent, address indexed underlyingAsset, int256 deltaSize, string reasoningHash);
event HedgeLogged(address indexed agent, address indexed hedgedAsset, int256 netPosition, string executionProof);
```

Design rules baked in:

1. **One shared bus.** No per-agent emitter contracts. The contract is a thin role-gated emitter with no per-event storage. Heavy lifting lives in the off-chain listeners.
2. **`string` hashes, not `bytes32`.** All IPFS CIDs and reasoning hashes are strings. viem listeners decode them natively. No `abi.encodePacked` games.
3. **Indexed only where filtering happens.** `agent` is indexed everywhere. `proposalId` is indexed on the two events that key off it. `underlyingAsset` / `hedgedAsset` are indexed on Sentinel and Operator events because Architect filters by asset when computing net exposure. Solidity caps at 3 indexed slots per event and we stay under.
4. **Roles set by an owner key.** `bus.setRole(agentAddr, Role.Scout)` etc. Cross-role calls revert with `NotAuthorized`. The role check is the only state the bus reads.

## How listening works

Every agent worker is a long-running Node process. To subscribe to bus events, it uses viem's `watchContractEvent`:

```ts
import { createPublicClient, http, parseAbiItem } from 'viem';
import { mantle } from './chain.js';

const client = createPublicClient({ chain: mantle, transport: http(MANTLE_RPC_URL) });

// Architect listens for Scout's maps
client.watchContractEvent({
  address: AGENT_EVENT_BUS_ADDRESS,
  event: parseAbiItem('event YieldMapPublished(address indexed agent, string ipfsHash, uint256 timestamp)'),
  onLogs: async (logs) => {
    for (const log of logs) {
      const { agent, ipfsHash, timestamp } = log.args;
      const yieldMap = await fetchFromLighthouse(ipfsHash);
      // verify agent matches the registered Scout address
      // verify signature on the map matches agent's pubkey
      // proceed with allocation logic...
    }
  }
});
```

Each agent subscribes to exactly the events it cares about:

- **Architect** watches `YieldMapPublished` (from Scout) and `HedgeLogged` (from Operator). It refuses to act on a map signed by an address that isn't the registered Scout identity.
- **Sentinel** watches `AllocationProposed` (from Architect). For each proposal it runs its risk model against the current exposure, then emits either `RiskVerdictIssued` or, if the proposal flagged a separate concern, `HedgeSignalEmitted`. Sentinel also runs an independent loop polling oracle feeds and emits hedge signals proactively.
- **Operator** watches `HedgeSignalEmitted` (from Sentinel). It executes the trade off-chain on Byreal Perps and emits `HedgeLogged` with a CID pointing to the fill receipt. The link from signal to execution is the chain trail of `reasoningHash` then `executionProof`.

Listeners are crash-safe. On startup, each agent backfills from the last block it acknowledged (tracked in its own local state) so it can never miss an event due to a restart.

Backfill pattern:

```ts
const fromBlock = await loadLastSeenBlock();
const past = await client.getContractEvents({
  address: AGENT_EVENT_BUS_ADDRESS,
  event,
  fromBlock,
  toBlock: 'latest'
});
for (const log of past) await handle(log);
await persistLastSeenBlock(await client.getBlockNumber());
// then start live watch
client.watchContractEvent({ ... });
```

For Scout the listener doesn't apply (Scout is purely a publisher). For the other four, listener wiring is part of their respective agent packages.

## ERC-8004 identity linkage

Each agent has one ERC-8004 identity NFT minted by the protocol's deployer. The NFT carries:

- The agent's on-chain address (the same address that signs and emits events).
- An IPFS CID pointing to the agent's current strategy document.
- Reputation counters that grow as the agent does verified work.

Bootstrap order, per agent:

1. Generate a keypair off-chain. The address is the agent's permanent identity.
2. Pin the agent's strategy and methodology docs to Lighthouse. Capture both CIDs.
3. Owner calls `identityContract.register(agentAddress, strategyCid)`. The contract mints token `tokenId` and the agent now has an on-chain identity tied to that address.
4. Owner calls `bus.setRole(agentAddress, Role.<X>)` so the bus accepts emissions from that address.
5. Agent worker boots, loads its private key, starts emitting events. Every event includes `msg.sender = agentAddress`, which a reader can cross-reference with the identity NFT to confirm authorship.

When a strategy changes (new scoring constants, new sources, new mandates), the agent does this without minting a new identity:

```ts
const newCid = await pinToLighthouse(newStrategyDoc);
await identityContract.write.updateStrategyCid([tokenId, newCid]);
```

The chain log of CID changes is itself the version history. Past strategy CIDs remain readable from any IPFS gateway.

### Verifying a published artifact end to end

For any event a reader pulls off the bus, the verification chain is:

1. Read the event. Note `agent` (the indexed address) and the IPFS CID it points at (`ipfsHash`, `reasoningHash`, `conditionHash`, or `executionProof` depending on the event).
2. Fetch the JSON from `https://gateway.lighthouse.storage/ipfs/{cid}`.
3. The fetched payload contains a `signature` field. Recover the signer using EIP-191 over the payload's content hash. The recovered address must equal `agent`.
4. Look up `agent` in the ERC-8004 identity contract. The token's strategy CID must be the one declared at publish time (included in the payload as `strategyCid`).
5. Fetch the strategy doc and confirm the published behavior matches its declared rules. For Scout this means the methodology hash in the Yield Map matches the sha256 of `scoring-methodology.md` linked from the strategy doc.

If all five steps verify, the artifact was produced by the registered agent under its declared strategy. The whole protocol can be audited the same way you'd audit a smart contract, just with one extra IPFS hop.

### Reputation

Reputation is read-only metadata, not financial weight. For now it's a tuple per agent, accrued from on-chain event counts:

- Scout: number of maps published, distinct opportunities tracked, methodology versions.
- Architect: proposals submitted, proposals cleared by Sentinel, proposals blocked.
- Sentinel: verdicts issued, hedge signals issued, signals later confirmed by depeg or exploit events.
- Operator: fills logged, average slippage vs. quoted, total notional hedged.
- Compliance: receipts minted, policy NFTs published.

These are calculated by indexers reading the event log. Once Sentinel has a real track record, other Mantle RWA protocols can subscribe to its `RiskVerdictIssued` stream and use it as a reusable risk oracle. That's the long arc of the project.

## What's in each agent package

The Scout package (`agents/scout`) is the reference implementation for this repo. Open its `README.md` for setup, environment, scoring methodology, and how to run a cycle. The other four agents follow the same shape:

- `src/` worker code (TypeScript, viem, zod)
- `tests/` vitest unit tests
- `docs/strategy-v1.md` and `docs/scoring-methodology.md` (or equivalent) pinned to IPFS and linked from the identity NFT
- `scripts/upload-strategy.ts` to pin docs and print CIDs for the deployer
- One CLI entrypoint that boots the listener, runs the inner loop, and exposes `/healthz` + `/metrics`

Naming, file layout, and the testing approach are uniform across agents so the system reads as one codebase rather than five disconnected ones.
