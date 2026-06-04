# Strata Contracts — Onboarding & Handoff (for Pratham)

> Hey Pratham — this is everything you need to know about the **contracts** to (a) point the agents at
> them, and (b) help unblock the mainnet deploy. Aaron owns the contracts; you own the agent brains +
> ERC-8004 + frontend. This doc is the seam between our two halves.
>
> _Updated 2026-05-30. Companion docs: `ARCHITECTURE.md` (full component reference) and
> `strata-docs/STATUS.md` (live status / addresses)._

---

## 1. TL;DR — what's built

The full contract stack is **done, tested, and pushed** to `Aaronvern/strata` (`main`):

- 3 ERC-4626 tranche vaults + `TrancheController` (custody, verdict-gated allocation, harvest waterfall,
  per-tranche autonomy gate).
- `AgentEventBus` — the typed on-chain message bus your agents emit to.
- `ComplianceRegistry` — EIP-712 claims → soulbound receipt NFT + jurisdiction policies.
- 7 yield adapters: **Aave, Ondo USDY, mETH, Ethena sUSDe, Agni USDC/USDe LP** (all live-fork-validated),
  plus **perp-basis escrow** (operator-driven) and **Mortgage CMO** (demo). INIT adapter is parked.
- Deploy + GrantRoles scripts, proven by a dry-run test on a live Mantle fork.

**96 default tests green; all fork tests green** except the 2 intentionally-red parked-INIT ones.
**Nothing is on mainnet yet** — see §5.

---

## 2. How to run it yourself

```bash
# Foundry lives here (NOT /usr/bin/forge — that's an unrelated tool called "ZOE")
export PATH="$HOME/.foundry/bin:$PATH"
cd contracts
forge install                      # lib/ is gitignored — fetch forge-std + OpenZeppelin
forge clean && forge test          # 96 tests, all green (clean first — cache can go stale here)

# live-Mantle fork tests (real protocol calls)
MANTLE_RPC_URL=https://rpc.mantle.xyz FOUNDRY_NO_MATCH_PATH= forge test --match-path 'test/fork/*' -vv
```

---

## 3. The integration seam — your agents ↔ the bus

This is the part that matters most for your lane. Your five agents act through **`AgentEventBus`** (and the
Operator also through the perp adapter). Each agent's wallet must be **granted its role first** (done by
`GrantRoles.s.sol` at deploy). Roles are checked on every call — an un-granted caller reverts
`NotAuthorized`.

| Agent | Role granted | What it calls on-chain | Emits |
|---|---|---|---|
| **Scout** | `Scout` | `publishYieldMap(ipfsCid)` | `YieldMapPublished` |
| **Architect** | `Architect` | `proposeAllocation(id, seniorBps, mezzBps, juniorBps, cid)` — bps must sum to 10000 | `AllocationProposed` |
| **Sentinel** | `Sentinel` | `issueRiskVerdict(id, approved, cid)`, `setAssetRiskRating(id, tranche, asset, rating)`, `emitHedgeSignal(asset, delta, cid)→signalId` | `RiskVerdictIssued`, `AssetRiskRated`, `HedgeSignalEmitted` |
| **Operator** | `Operator` | `logHedge(signalId, asset, netPos, proof)`; **also** `PerpBasisEscrowAdapter.reportHedgeValue(value, signalId)` | `HedgeLogged`, `HedgeValueReported` |
| **Compliance** | (not a bus role) | signs EIP-712 claims **off-chain**; user redeems via `ComplianceRegistry.claimReceipt` | `ComplianceVerified` |

**Execution** (moving capital) is separate from proposing it:
- The Architect proposes; the Sentinel approves (`issueRiskVerdict(approved=true)`).
- Whoever holds the controller's **`executor`** role then calls
  `TrancheController.executeAllocation(proposalId, senior[], mezz[], junior[])` (each an `AdapterTarget[]`).
  The controller re-checks `bus.isProposalApproved(id)` + TTL before moving anything.
- Each `targets[]` is `[(adapter, bps), …]` summing to 10000 — i.e. *which adapter* each tranche's slice
  goes into. Use the adapter addresses written to `deployments/5000.json` after deploy.

**Two key sequencing rules your agents must respect:**
1. A verdict can't be issued for a proposal that doesn't exist; a proposal id can't be reused.
2. `logHedge` requires a real `signalId` returned by a prior `emitHedgeSignal` (it reverts on unknown ids).
   This is the audit chain the doc's "verifiable not narrative" claim rests on — keep it intact.

The **autonomy gate**: if a tranche is set to `Multisig` mode and a single execution moves more than its
`threshold`, the approver must `confirmAllocation(proposalId, tranche)` first, or execution reverts
`MultisigApprovalRequired`. Junior is typically `Autonomous` (no extra step). Decide per-tranche defaults
with Aaron.

---

## 4. Compliance flow (Surface 1 deposit gate)

At deposit, the vault calls `gate.isAllowed(user, tranche)`. With `ComplianceRegistry` wired:
1. Your Compliance agent (wallet #105) verifies the user off-chain (zkPass/Privado/etc.), then **EIP-712
   signs** a `ClaimData` (user, trancheMask, expiry, policyId, zkReceiptCid, nonce, signedAt).
   - `trancheMask` bits: `bit0=Junior, bit1=Mezz, bit2=Senior` (e.g. permissionless wallet → `0x01` = Junior only).
   - The signature is only valid for **1 hour** (`signedAt` window) and the **nonce is single-use**.
2. The user submits `claimReceipt(data, sig)` → gets a **soulbound** receipt NFT; `isAllowed` now passes
   for their permitted tranches.
3. The verifier address must equal Compliance #105 (`0x5976…A628`) — set at deploy, rotatable via
   `setVerifier`.

The EIP-712 domain is `("StrataCompliance", "1")` on the registry address — your signer must use the
deployed registry's domain separator. Ping Aaron for the exact typehash/struct (it's in
`ComplianceRegistry.sol`).

---

## 5. ⛔ What's blocking mainnet — I need two things from you

The code is done; the deploy is gated on inputs only you/the team can give:

1. **A funded deployer key** — an address with MNT for gas on Mantle mainnet. Launch is capped at **$1000
   per adapter**, so it's a small-value deploy, but it still needs gas.

2. **Confirm each agent's bus-sending address.** `GrantRoles` currently grants roles to the agents'
   **ERC-8004 identity-owner EOAs** (Scout `0x7CAC…`, Architect `0xbFDb…`, Sentinel `0xfE7E…`, Operator
   `0xB342…`). **Question: do your agents emit to the bus from those same EOAs, or from smart-contract
   wallets?** If SC-wallets, tell me the addresses — they go in the
   `{SCOUT,ARCHITECT,SENTINEL,OPERATOR}_ADDRESS` env vars and get the roles instead. **If we grant the
   wrong address, the agents can't post to the bus.**

Once both are in hand the deploy is two commands (no code changes):
```bash
DEPLOYER_PRIVATE_KEY=…   forge script script/Deploy.s.sol      --rpc-url mantle --broadcast
AGENT_EVENT_BUS_ADDRESS=… forge script script/GrantRoles.s.sol  --rpc-url mantle --broadcast
# then commit deployments/5000.json so the frontend + agents read the addresses from it
```

> Also confirm: should the controller's `executor` be the Operator agent, a relayer, or a multisig? And
> the per-tranche autonomy modes (which tranches need an approver, and the threshold)? These are product
> calls, not code blockers — defaults are Autonomous + no approver.

---

## 6. Honest caveats (please keep these in the demo narrative)

- **Unaudited**, with single-owner god-powers (`emergencyWithdraw`, `applyDefault`, `setSusdeUsdeRate`,
  `reportHedgeValue`). Fine for a capped hackathon launch — say so plainly.
- **Not every backing is trustless.** Aave is. Ondo/mETH are oracle+custody. Ethena/Agni use conservative
  peg-clamped NAV. Perp-basis is fully operator-custodied (`TRUSTLESS()==false`). CMO is demo-mode. The
  per-adapter trust model is tabulated in `ARCHITECTURE.md` — don't claim more than that table.
- **The leverage loop the doc lists for Junior is deferred to v2** — it's genuinely not trustless on Mantle
  today (no LST is a usable Aave collateral; only INIT has it, and INIT's supply path is unsolved). The
  ≥5-primitive bar is already met without it (Aave, Ondo, Ethena, Agni, mETH+Chainlink).
- **The dry-run proves wiring, not the live broadcast.** We'll only know the real deploy is good once it's
  broadcast and confirmed.

---

## 7. Where things live

| Thing | Path |
|---|---|
| Contracts (Foundry project) | `contracts/` in `Aaronvern/strata` (`main`) |
| Full architecture reference | `contracts/ARCHITECTURE.md` |
| This onboarding doc | `contracts/ONBOARDING.md` |
| Live status / addresses / handoff | `strata-docs/STATUS.md` (separate docs repo) |
| Backing-source research (verdicts, addresses) | `strata-docs/research/2026-05-30-tranche-backing-integrations.md` |
| Product doc (PDF + extracted text) | `strata-docs/product-doc.pdf` |
| Deploy scripts | `contracts/script/Deploy.s.sol`, `GrantRoles.s.sol` |
| Deploy output (after broadcast) | `contracts/deployments/<chainid>.json` |

Ping Aaron for anything under-specified — happy to walk through the bus interface or the compliance signing
flow live.
