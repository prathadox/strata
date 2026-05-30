# Strata Contracts — Architecture

> On-chain risk-tranched yield protocol on **Mantle**, coordinated by autonomous agents and gated by
> on-chain compliance. This document covers the **contracts** (Aaron's lane). Agents (off-chain brains +
> ERC-8004 identities) and the frontend surfaces are separate workstreams.

---

## Design principles

1. **Verifiable, not narrative.** Every state change an agent drives is an on-chain event: proposals,
   risk verdicts, per-asset risk ratings, allocation executions (tied to their `proposalId`), harvests,
   and hedge signal→fill pairs. The Transparency Dashboard reads these directly — nothing is asserted
   off-chain that can't be traced on-chain.
2. **Tranched risk waterfall.** Three ERC-4626 vaults (Senior / Mezzanine / Junior) share one pool of
   capital. Yield flows **top-down, capped** per tranche; losses are absorbed **bottom-up** (Junior
   first). The `TrancheController` is the single custodian and accountant.
3. **Pluggable yield adapters.** Every yield source implements `IYieldAdapter`. The controller never
   hard-codes a protocol; adapters are registered/removed at runtime.
4. **Swappable compliance.** Each vault holds an `IComplianceGate`. Today an allow-all stub or the full
   `ComplianceRegistry` (EIP-712 claims + soulbound receipt NFT) — swappable per vault with no redeploy.
5. **Honest demo-mode labels.** Where a real on-chain integration isn't viable on Mantle, the piece is
   explicitly `DEMO_MODE` (e.g. the mortgage CMO sleeve) and its NAV is kept fully USDC-backed — never
   faked.

---

## Component diagram

```mermaid
flowchart TB
    User([Depositor]):::ext

    subgraph Vaults["TrancheVaults — ERC-4626 (×3)"]
        SV[Senior]:::core
        MV[Mezzanine]:::core
        JV[Junior]:::core
    end

    Gate["IComplianceGate<br/>OpenComplianceGate · ComplianceRegistry"]:::core
    Ctrl["TrancheController<br/>USDC custody · per-tranche NAV<br/>verdict-gated allocation · harvest waterfall"]:::core
    Bus["AgentEventBus<br/>roles · proposals · verdicts<br/>risk ratings · hedge signal→fill"]:::core

    subgraph Adapters["Yield Adapters — IYieldAdapter (BaseYieldAdapter)"]
        Aave["AaveV3UsdcAdapter"]:::live
        Ondo["OndoUsdyAdapter<br/>hold-only, oracle-valued"]:::live
        CMO["MortgageCMOSleeve<br/>DEMO_MODE"]:::demo
    end

    Agents[["Agents (off-chain brains + ERC-8004 IDs)<br/>Scout · Architect · Sentinel · Operator"]]:::ext

    User -->|"deposit / withdraw USDC"| Vaults
    Vaults -->|"isAllowed(user, tranche)"| Gate
    Vaults -->|"USDC + notifyDeposit/Withdraw"| Ctrl
    Ctrl -->|"isProposalApproved? (gate)"| Bus
    Ctrl <-->|"deposit / withdraw / value"| Adapters

    Aave -->|"supply / withdraw"| AavePool[("Aave V3 Pool · aUSDC<br/>Mantle mainnet")]:::onchain
    Ondo -->|"getPrice()"| OndoOracle[("Ondo USDY<br/>Redemption Price Oracle")]:::onchain
    Ondo -.->|"custodies"| USDY[("USDY token")]:::onchain

    Agents -->|"role-gated calls"| Bus
    Agents -.->|"executor: executeAllocation"| Ctrl
    Agents -->|"identity / ownerOf"| Reg[("ERC-8004 Identity Registry")]:::onchain

    classDef core fill:#1f2937,stroke:#6366f1,color:#fff;
    classDef live fill:#064e3b,stroke:#10b981,color:#fff;
    classDef demo fill:#4a2a00,stroke:#f59e0b,color:#fff;
    classDef onchain fill:#0f172a,stroke:#38bdf8,color:#fff;
    classDef ext fill:#111827,stroke:#9ca3af,color:#fff;
```

**Legend:** blue = Strata core · green = live real integration · amber = labelled demo-mode · cyan =
external Mantle-mainnet contract · grey = off-chain / actor.

### Layered view (text fallback)

```
            ┌──────────────────────────────────────────────────────────┐
  ACTORS    │  Depositors        Agents (Scout/Architect/Sentinel/Op)   │
            └─────────┬───────────────────────┬────────────────────────┘
                      │ deposit/withdraw       │ role-gated calls
            ┌─────────▼──────────┐   ┌─────────▼────────────────────────┐
  SURFACE   │  TrancheVault ×3   │   │  AgentEventBus                    │
            │  (ERC-4626)        │   │  roles, proposals, verdicts,      │
            │   └─ IComplianceGate│  │  risk ratings, hedge signal→fill  │
            └─────────┬──────────┘   └─────────┬────────────────────────┘
                      │ USDC + notify           │ isProposalApproved (gate)
            ┌─────────▼─────────────────────────▼────────────────────────┐
  CORE      │  TrancheController                                          │
            │  USDC custody · per-tranche NAV · verdict-gated allocation  │
            │  harvest waterfall (gains top-down capped / losses bottom-up)│
            └─────────┬──────────────────────────────────────────────────┘
                      │ deposit/withdraw/value (IYieldAdapter)
            ┌─────────▼──────────────────────────────────────────────────┐
  YIELD     │  AaveV3UsdcAdapter   OndoUsdyAdapter   MortgageCMOSleeve     │
            │  (live)              (live, oracle)    (DEMO_MODE)           │
            └─────────┬───────────────────┬──────────────────────────────┘
                      │                    │
            ┌─────────▼────────┐ ┌─────────▼────────┐   ┌─────────────────┐
  MANTLE    │ Aave V3 Pool /   │ │ USDY token +     │   │ ERC-8004        │
  MAINNET   │ aUSDC            │ │ Price Oracle     │   │ Identity Reg.   │
            └──────────────────┘ └──────────────────┘   └─────────────────┘
```

---

## Component reference

| Contract | Responsibility | Key surface |
|---|---|---|
| **`TrancheController`** | Single USDC custodian + accountant. Tracks per-tranche NAV, routes capital into adapters on an **approved** proposal (within TTL), runs the harvest waterfall, sources withdrawal liquidity from adapters. | `executeAllocation`, `harvest`, `notifyDeposit/Withdraw`, `addAdapter/removeAdapter`; emits `AllocationExecuted`, `Harvested` |
| **`TrancheVault`** ×3 | ERC-4626 share token per tranche. Custodies nothing itself — forwards USDC to the controller and reads NAV back. Holds a per-vault compliance gate. | `deposit/withdraw` (ERC-4626), `setComplianceGate` |
| **`AgentEventBus`** | Role-gated coordination + audit log between agents and the controller. Stores proposals, risk verdicts, per-asset/per-tranche ratings, and hedge signal→fill links. | `proposeAllocation`, `issueRiskVerdict`, `setAssetRiskRating`, `emitHedgeSignal`→`logHedge`, `isProposalApproved` |
| **`IComplianceGate`** | Pluggable allow/deny per (user, tranche). | `OpenComplianceGate` (allow-all) · `ComplianceRegistry` |
| **`ComplianceRegistry`** | EIP-712 verifier-signed claims → **soulbound Receipt NFT**, tranche bitmask, expiry/revocation, jurisdiction-policy records. | `claimReceipt`, `revokeReceipt`, `isAllowed`, `publishPolicy` |
| **`BaseYieldAdapter`** | Shared adapter base: owner, pause, deposit cap, `emergencyWithdraw`. | `setCap`, `setPaused`, `emergencyWithdraw` |
| **`AaveV3UsdcAdapter`** | **Live.** Supplies USDC to Aave V3; aUSDC balance is the live position value. | `deposit`, `withdraw`, `totalAssetsFor` |
| **`OndoUsdyAdapter`** | **Live, hold-only.** Custodies bridged USDY (real RWA T-bills); values it in USDC terms via Ondo's on-chain oracle. USDC in/out reverts by design (no on-chain conversion on Mantle). | `depositUsdy/withdrawUsdy` (owner), `totalAssetsFor` (oracle) |
| **`MortgageCMOSleeve`** | **Demo-mode** Junior adapter: WAC coupon + CPR prepayment (yield deceleration) + `applyDefault` first-loss. Simulated coupon is capped by a seeded USDC reserve, so **NAV ≤ USDC balance always**. | `deposit/withdraw`, `seedReserve`, `applyDefault`, `setPrepaymentSpeed` |

---

## Roles & permissions (`AgentEventBus.Role`)

| Role | Who | Can call | Produces |
|---|---|---|---|
| **Scout** | yield-discovery agent | `publishYieldMap` | `YieldMapPublished` |
| **Architect** | allocation agent | `proposeAllocation` | `Proposal` + `AllocationProposed` |
| **Sentinel** | risk agent | `issueRiskVerdict`, `setAssetRiskRating`, `emitHedgeSignal` | `Verdict`, `AssetRiskRated` (🟢🟡🔴), `HedgeSignalEmitted(signalId)` |
| **Operator** | execution agent | `logHedge(signalId, …)` | `HedgeLogged(signalId)` |
| *Executor* | controller-level role (set by owner) | `TrancheController.executeAllocation` | `AllocationExecuted` |
| *Owner* | protocol admin / multisig | role + vault + adapter + target config | — |

> The execution gate stays **binary** (`isProposalApproved`): the controller only acts on a Sentinel
> **approval** within the proposal TTL. The green/yellow/red ratings are the *richer model alongside*
> the gate — consumed by the dashboard, not a second gate.

---

## Lifecycle — allocation cycle

```mermaid
sequenceDiagram
    participant Sc as Scout
    participant Ar as Architect
    participant Se as Sentinel
    participant Op as Operator/Executor
    participant Bus as AgentEventBus
    participant Ctrl as TrancheController
    participant Ad as Adapter (e.g. Aave)

    Sc->>Bus: publishYieldMap(cid)
    Ar->>Bus: proposeAllocation(id, senior/mezz/junior bps, cid)
    Se->>Bus: setAssetRiskRating(id, tranche, asset, 🟢/🟡/🔴)
    Se->>Bus: issueRiskVerdict(id, approved=true, cid)
    Op->>Ctrl: executeAllocation(id, targets[])
    Ctrl->>Bus: isProposalApproved(id)?  (+ TTL check)
    Bus-->>Ctrl: true
    Ctrl->>Ad: deposit(amount)  (per-tranche, per-target bps)
    Ctrl-->>Bus: emit AllocationExecuted(id, deployed per tranche)
```

**Other flows**
- **Deposit:** `User → TrancheVault.deposit → gate.isAllowed → USDC to controller → notifyDeposit (NAV credited)`.
- **Harvest:** `anyone → controller.harvest → snapshot Σ adapter.totalAssetsFor + idle → waterfall (gains top-down capped at per-tranche target·elapsed/yr; losses bottom-up Junior→Mezz→Senior) → update NAV → emit Harvested`.
- **Withdraw:** `User → TrancheVault.withdraw → controller.notifyWithdraw → _ensureLiquidity (pull from adapters by instant liquidity) → USDC to user`.
- **Hedge (agentic):** `Sentinel.emitHedgeSignal → signalId` ; `Operator.logHedge(signalId, proof)` — auditable signal→fill chain.

---

## Integrations (Mantle mainnet, chainid 5000)

| Integration | Address | Status | Used by |
|---|---|---|---|
| **USDC** (6 dec) | `0x09Bc4E0D864854c6aFB6eB9A9cdF58aC190D0dF9` | live | protocol base asset |
| **Aave V3 Pool** | `0x458F293454fE0d67EC0655f3672301301DD51422` | ✅ live, fork-validated | `AaveV3UsdcAdapter` |
| **aUSDC** | `0xcb8164415274515867ec43CbD284ab5d6d2b304F` | live | position valuation |
| **Aave PoolAddressesProvider** | `0xba50Cd2A20f6DA35D788639E581bca8d0B5d4D5f` | live | reference |
| **Ondo USDY** (18 dec, accruing) | `0x5bE26527e817998A7206475496fDE1E68957c5A6` | ✅ live, hold-only | `OndoUsdyAdapter` custody |
| **Ondo USDY Price Oracle** (`getPrice()`→1e18) | `0xA96abbe61AfEdEB0D14a20440Ae7100D9aB4882f` | ✅ live, fork-validated | `OndoUsdyAdapter` valuation |
| **ERC-8004 Identity Registry** | `0x8004A169FB4a3325136EB29fA0ceB6D2e539a432` | live | agent identities (prathadox) |
| **mETH** | `0xd5F7838F5C461fefF7FE49ea5ebaF7728bB0ADfa` | optional (FX-labeled Junior) | future `MethAdapter` |

### Dropped / not viable on Mantle (validated)
| Source | Why dropped |
|---|---|
| **Lendle** | Not in the backing table; on-chain it's an Aave **V2** fork with **every reserve frozen** (no deposits). Removed. |
| **Ethena sUSDe** | OFT bridge tokens only — no Mantle staking vault. Dropped from v1. |

### Tranche → backing (working model)
| Tranche | Profile | Backing |
|---|---|---|
| **Senior** | first on yield, last on loss (~5–6%) | Aave USDC + Ondo USDY (hold, oracle-valued) |
| **Mezzanine** | balanced (~8–12%) | Aave USDC (+ CIAN / Mantle-Vault / LP **once on-chain viability is validated**) |
| **Junior** | first loss, residual upside | mETH (FX-labeled) + `MortgageCMOSleeve` (demo) + leveraged loop |

---

## Test coverage

- **79 default tests** (`forge test`): unit + end-to-end lifecycle + harvest waterfall invariants +
  CMO↔controller integration (default → Junior-first-loss).
- **3 live-Mantle fork tests** (`MANTLE_RPC_URL=… FOUNDRY_NO_MATCH_PATH= forge test --match-path 'test/fork/*'`):
  Aave supply/withdraw, Ondo USDY valuation against the live oracle, Ondo hold-only guards.

---

## Deferred / next

- **Autonomy spectrum** — per-deposit *multisig vs. fully-autonomous* gating in the controller (core
  product principle; not yet built).
- **CIAN / Mantle-Vault + LP adapters** — on-chain viability not yet validated (Mezz backing).
- **Allora / OraKle oracle** integration for risk/FX pricing (mETH and any FX-priced asset).
- **Jurisdiction-Policy NFTs** (currently a mapping — spec-faithful; NFT framing optional).
- **Deploy wiring** — swap `OpenComplianceGate`→`ComplianceRegistry`, grant agent roles, capped
  mainnet deploy (needs funded deployer key + agent bus-sending addresses).

> Nothing is deployed to mainnet yet. See `strata-docs/STATUS.md` for the live handoff state.
