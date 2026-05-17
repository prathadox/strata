Product Doc — Tranched RWA Yield, Agent-Managed
Working name TBD. Built for the Mantle Turing Test Hackathon 2026.

One-liner
A tranched real-world-asset yield protocol on Mantle, managed end-to-end by five autonomous
agents with on-chain identity, verifiable decisions, and agent-to-agent communication.

Why this exists
Stablecoin holders today face a binary choice: park in a CEX-yield product and trust a centralized
issuer, or chase DeFi yield without understanding the risk underneath. RWA protocols have
started bridging this gap by tokenizing T-bills and similar instruments, but the user experience is
still flat — a single APY, a single risk profile, take it or leave it.

Traditional finance solved this decades ago with tranching: take a basket of yield-bearing
instruments, slice it into senior, mezzanine, and junior claims on the cashflow, and let users self-
select into the risk level that matches them. The Protocol brings that structure on-chain, with AI
agents doing the work that an asset manager, a risk desk, a hedging desk, and a compliance
officer would do in a traditional shop — except every decision is public, verifiable, and signed by
an agent with a permanent on-chain identity.

Product principles
The product is built around three commitments that should be visible in every surface and every
line of code.

Verifiability over claims. Anything an agent does is an on-chain event with a reasoning hash.
Anything an agent decides is preceded by an on-chain strategy document. A user can audit the
protocol's behavior the same way they'd audit a smart contract.

Tranching as user choice, not protocol opinion. Different users have different risk appetites and
different regulatory contexts. The protocol surfaces three risk tiers and lets users choose, rather
than averaging everyone into one APY.

Agent autonomy as a spectrum, not a binary. Senior tranche users may want a multisig in the
loop for large rebalances; junior tranche users may want pure autonomy. The protocol offers
both, per tranche, by user choice.

The financial product: tranche structure
The protocol holds a basket of yield-bearing assets and slices the cashflow into three tranches,
each represented as an ERC-20.

Tranche Claim priority Target
profile
Backing
Senior First on yield, last on
losses
Low-volatility
~ 5 – 6 %
Ondo USDY + Ethena sUSDe
Mezzanine Second claim,
balanced
~ 8 – 12 % mETH + Mantle Vault / CIAN strategies + select
LP positions
Junior Last on yield, first on
losses, residual upside
High-
variance
Leveraged yield, LP rewards, perp basis,
simulated mortgage CMO sleeve (clearly labeled
demo-mode)
Losses are absorbed bottom-up: junior takes the first hit, senior the last. Yield is distributed top-
down through a waterfall contract. The simulated mortgage sleeve in the junior tranche is the
bridge to a future v2 that integrates Centrifuge, Maple, or Figure; it's framed honestly as a demo
and seeded with realistic prepayment behavior so the system can be stress-tested.

The agents
Five agents run the protocol. Each one is an on-chain entity with an ERC- 8004 identity NFT that
accrues reputation as it acts. Each one publishes its strategy as a versioned document on IPFS,
referenced from its identity NFT, so anyone can read what an agent intends to do before
watching it do it.

Agent 1 — Scout (Yield Sourcing)

Scout's job is to know, at every moment, what yield is available on Mantle and what it costs in
risk. It continuously scans Ondo USDY, Ethena sUSDe, mETH, MI4, Mantle Vault and CIAN
strategies, Agni and Merchant Moe LP positions, Aave on Mantle, fBTC strategies, and the
simulated mortgage pool.

The output is a Yield Map: a ranked list of opportunities, each scored on a normalized risk-
adjusted basis (yield, depth, depeg history, smart contract age, oracle quality). Scout doesn't
allocate capital. It publishes the map. Every Yield Map update is posted on-chain as an event
with a hash referencing the full map on IPFS, so the historical record of "what Scout knew, when"
is permanent and queryable. Other agents read the map to make decisions; users can read it
directly from the dashboard to see what the protocol sees.

Agent 2 — Architect (Tranche Construction)

Architect is the portfolio manager. It reads Scout's Yield Map, applies each tranche's mandate
(capital preservation for senior, balanced for mezz, max yield within risk budget for junior), and
produces a proposed allocation. When the live portfolio drifts from the target beyond a
threshold, Architect proposes a rebalance.

Architect cannot execute on its own — every proposal is gated by Sentinel's risk verdict (see
below) before capital moves. Once cleared, Architect mints, burns, and rebalances through the
underlying protocols. Net exposure also flows in from Operator's hedge book, so Architect
always allocates against the hedged exposure, not the gross one. Every proposal and every
execution is an on-chain event.

Agent 3 — Sentinel (Risk)

Sentinel is the risk desk. It runs continuously, independently of Architect's proposal cycle,
computing duration risk, depeg probability for each stable asset, smart-contract risk scores,
correlation matrices across the basket, liquidity depth, and Value-at-Risk per tranche. Sentinel
produces two kinds of on-chain output: Risk Verdicts (green / yellow / red per asset and per
tranche, which gate Architect's executions) and Hedge Signals (specific exposures that need
neutralization, addressed to Operator).

Sentinel never executes trades. Its credibility is its track record, which is fully on-chain: every
flag it raised, every depeg it caught (or missed), every Hedge Signal it issued. Over time its ERC-
8004 reputation score reflects this. This is the agent with the highest "trust capital" potential — a
Sentinel with a strong public record becomes a reusable risk oracle other RWA protocols on
Mantle could subscribe to.

Agent 4 — Operator (Byreal Perps Hedging)

Operator is the trading desk. It listens for Sentinel's Hedge Signals and executes neutralizing
positions on Byreal Perps via the Byreal Perps CLI. If Sentinel flags duration exposure from
mETH, Operator can short MNT or ETH perps to offset. If Sentinel flags concentration in a single
yield source, Operator can hedge the underlying asset.

Operator publishes its hedging strategy on-chain — which signals it acts on, maximum position
sizes, exit triggers — so users can see the rules before they see the trades. Every fill is logged on-
chain with a pointer back to the Hedge Signal that triggered it, creating an auditable chain from
"Sentinel observed X risk" to "Operator opened Y position to hedge it." This explicit chain is what
makes the multi-agent claim verifiable rather than narrative — and it's what anchors the
protocol's Agentic Economy track submission.

Agent 5 — Compliance Agent (Programmable Compliance)

Compliance is the legal layer, and it's where the protocol does something genuinely new. Rather
than a one-time KYC stub, the Compliance Agent operates as an active gate at the deposit
boundary, and it produces public goods that outlive any single deposit.

At deposit time, it verifies a user's credential (via zkPass, Privado ID, or a similar verifiable-
credential provider), checks sanctions lists through an oracle, identifies the user's jurisdiction,
and routes them to the tranches permitted under that jurisdiction's rules. US persons might be
blocked from the senior tranche under current securities posture; EU users might see all three
with a MiCA-style disclosure; permissionless wallets get junior only.

Two on-chain artifacts come out of this. Every deposit mints a Compliance Receipt NFT to the
user's wallet, documenting exactly what checks were performed at what time — a personal audit

trail. Separately, the Compliance Agent publishes Jurisdiction Policy NFTs : machine-readable
policy documents (e.g., "US-Permissioned-Senior-Policy-v1") that other RWA protocols on
Mantle can subscribe to and reuse. The compliance work the protocol does for itself becomes
infrastructure for the ecosystem. This is the cross-track innovation that lifts the submission from
"good RWA app" to "Grand Champion candidate."

How the agents talk to each other
All agent-to-agent communication happens on-chain through a typed event bus — a Solidity
contract where each agent emits structured events that other agents subscribe to. There's no off-
chain orchestrator quietly stitching things together; the choreography itself is verifiable. The full
operating loop runs roughly like this.

Scout publishes a Yield Map. Architect reads it, considers each tranche's mandate, and publishes
a Proposed Allocation. Sentinel sees the proposal in context of its own continuous risk picture
and publishes either a Risk Verdict (clearing the proposal) or a block (with reasons). If Sentinel
separately identifies an exposure that needs hedging, it publishes a Hedge Signal addressed to
Operator, who executes on Byreal Perps and publishes the fill. Architect, before its next proposal,
reads Operator's open positions so it always allocates against net exposure rather than gross.

Compliance runs in parallel rather than in this loop — it gates the deposit boundary, doesn't
participate in the rebalancing cycle, and emits its own stream of receipts and policy updates.

Every event in this loop is indexable, queryable, and visible in real time on the transparency
dashboard. A judge or user can pull up the chain and watch the full cycle execute end-to-end in
under a minute.

The surfaces
The protocol exposes three front-ends, each calibrated to a different audience and a different
track of the hackathon. They're cohesive — same brand, same wallet, same data — but each does
one job well.

Surface 1 — Deposit & Tranche Selection

This is the consumer entry point. A user lands on a clean page, connects a wallet, and sees three
tranche cards: Senior, Mezzanine, Junior. Each card shows live APY (pulled from Architect's
current positions), a one-line risk descriptor in plain English ("Steady RWA yield. Backed by
tokenized T-bills and synthetic dollars."), and an autonomy toggle (semi-auto with multisig
confirmation on large moves, vs. fully autonomous).

The deposit flow is one screen, one input, one button. Behind the scenes, the Compliance Agent
runs its checks, and the user is either routed to their permitted tranches or shown a clear
message about why a tranche isn't available to them. After confirmation, the user receives their
tranche token plus a shareable scorecard — a generated image card with their tranche, their
deposit, and their projected yield, sized for X and Farcaster.

The principle here is that depth is available but not required. A user who just wants yield gets
yield in three clicks. A user who wants to understand what's happening underneath has a one-

click path to the dashboard.

Surface 2 — Agent Arena

This is the protocol's social and viral surface — the answer to the Consumer & Viral DApps track
and the lever for community voting.

In Live mode , the five agents appear as named characters with distinct visual identities. A real-
time feed scrolls their actions in human-readable form: "Sentinel flagged 12 bps duration drift in
the senior basket. Operator opened a $ 50 K MNT short to neutralize." Each agent has a profile
page showing its ERC- 8004 reputation score, its lifetime stats (decisions per day, hit rate on risk
flags, hedging PnL, yield generated, deposits processed), and its current strategy document. This
is the surface that makes the agents feel like agents, not pipelines.

In Battle mode , users get skin in the game. The Architect periodically generates two or three
competing allocation variants for a tranche. Users vote on which one runs live for the next epoch,
or fork a strategy with their own capital and let it compete head-to-head. Weekly tournaments
rank user-forked strategies against the protocol's default; winning forks earn a share of fees and
a place on the leaderboard. This gives users a daily reason to return, a reason to share their forks
on X, and a reason to evangelize the protocol — without diluting the safety of the main tranches,
since battle-mode capital is opted-in.

Battle mode is the stretch goal: ship Live mode first, layer Battle mode in week 5 – 6 if pace allows.
It is not a track-lock dependency.

Surface 3 — Transparency Dashboard

This is where serious users — and judges, and the live-stream audience — see the protocol at its
actual depth. Every agent decision streams in with the reasoning hash, the input data that
triggered it, and the on-chain transaction that resulted. The dashboard supports filtering by
agent, time window, asset, and decision type. Clicking any decision opens a full trace: what Scout
saw, what Architect proposed, what Sentinel verdict gated it, what Operator did to hedge.

The dashboard is also where the protocol's transparency commitment becomes a public good.
Anyone can pull a Sentinel risk verdict and reuse it. Anyone can read a strategy document and
verify a downstream action against it. Anyone can cite the protocol's full history when evaluating
it.

For demo day, this surface is the centerpiece. Pulling it up live and walking through one complete
agent loop in 30 seconds is the most compelling possible answer to the question "is this actually
agentic, or is it just a wrapper?"

How the surfaces interact with the agents
The surfaces are not three apps glued together; they're three views into the same underlying
state.

A deposit on Surface 1 triggers a Compliance check, mints a tranche token, and the resulting
capital movement appears as an event on Surface 3 within seconds. A user can click that event

and see the full agent loop that capital will now flow through. Surface 2 's leaderboards and
decision feeds are powered by the same event stream as Surface 3, just visualized with character
avatars and game-like framing rather than tabular density. A user who voted on a strategy
variant in Surface 2 's Battle mode can watch that variant's actual on-chain decisions stream
through Surface 3 to verify the protocol did what they voted for.

The protocol's brand promise — verifiable, tranched, agent-managed yield — is reinforced on
every surface, in language calibrated to that surface's audience.

Tech architecture — suggestive
Rather than specify a full stack here, the doc commits to a small set of architectural choices that
follow from the product principles.

The agents are implemented as off-chain processes that act through on-chain contracts. Each
one holds keys for a smart-contract wallet, signs transactions, and emits events through a shared
message-bus contract. ERC- 8004 identity NFTs anchor each agent's on-chain presence and
accumulate reputation through verified actions.

Strategy documents live on IPFS, referenced by content hash from each agent's identity NFT.
Updates are versioned and on-chain, so any user can verify that an agent's current behavior
matches its declared strategy.

The protocol integrates Ondo, Ethena, mETH, Byreal Perps, and selected DEX or vault primitives
through their canonical interfaces on Mantle. Oracles for risk and pricing come from Allora
and/or OraKle. The simulated mortgage sleeve is a self-contained Solidity contract with a
realistic prepayment model seeded from public historical data, clearly tagged as demo-mode in
the UI.

The frontend is a single Next.js application serving all three surfaces from shared state, with the
same wallet flow and the same event stream powering each view.

Scope boundaries for v
The protocol explicitly does not attempt, in the hackathon v1, to: tokenize actual mortgage-
backed securities (legally complex; out of scope for six weeks), serve as a registered investment
product (a separate regulatory project), or offer the senior tranche to US persons without full
KYC integration. These boundaries are stated upfront in the product, the README, and the
demo — judges will reward the clarity, and the v2 roadmap becomes a credible follow-on.

What success looks like
For the hackathon: a Track First Prize in AI x RWA and a credible run at Grand Champion, based
on a working protocol that integrates at least five Mantle ecosystem primitives, five visibly
autonomous agents with on-chain decision logs, three working surfaces, and a compliance
innovation that doubles as ecosystem infrastructure.

For after the hackathon: a base camp from which to pursue real RWA integration, a Sentinel
reputation that other Mantle protocols start subscribing to, and a Compliance Agent whose

Jurisdiction Policy NFTs get adopted as a quiet standard. The hackathon is the proof-of-concept;
the agents themselves are the long-term product.
