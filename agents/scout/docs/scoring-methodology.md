# Scout Scoring Methodology, v1

This is the algorithm Scout uses to rank yield opportunities. The sha256 of this file is included as `methodologyHash` on every published Yield Map, so anyone replaying a published map can verify the score was computed under exactly the rules described here.

## What we want

For every opportunity, produce one number: a risk-adjusted, confidence-weighted score that other agents and humans can compare across protocols. The score should be readable: a higher score means a better risk-adjusted return given what Scout could observe at publish time.

## Expected loss

Risk is modeled as five independent failure modes. Each one has an annualized probability `p_i` and a severity `α_i` (fraction of principal lost given the event happens). Annual expected loss is:

```
ExpectedLoss = p_exploit * α_exploit
             + p_depeg   * α_depeg
             + p_oracle  * α_oracle
             + p_illiquid* α_illiquid
             + p_counterparty * α_counterparty
```

Severities (constant for v1):

| Failure mode | α (fraction lost given event) |
|---|---|
| Exploit | 0.85 |
| Depeg | 0.20 |
| Oracle failure | 0.40 |
| Illiquidity | 0.05 |
| Counterparty | 0.50 |

## Probability estimators

**Exploit probability.** Newer code is riskier, audits help, larger TVL is a mixed signal (more eyes but also more incentive). Scout uses:

```
p_exploit = baseExploit * exp(-contractAgeDays / halfLife)
          * auditFactor
          * tvlFactor

baseExploit = 0.30
halfLife    = 180 days
auditFactor in { 0.30 (top tier audit: Trail of Bits, OpenZeppelin, Spearbit),
                 0.60 (other reputable),
                 1.00 (none) }
tvlFactor   = clamp(1.5 - log10(max(tvlUsd,1))/8, 0.5, 1.5)
```

If `contractAgeDays` is missing, Scout uses 0.30 as the exploit probability rather than inventing a value.

If Nansen returns a strong sybil-farming signal (smart holder share below 5% combined with fresh-wallet inflows above 50%), `p_exploit` is bumped by +0.05 capped at 1.0.

**Depeg probability.** For stable underlyings, Scout pulls 365 daily prices from CoinGecko and compresses deviations into events. A deviation of more than 2% from the peg starts an event; recovery within 0.5% ends it. Each event contributes `maxDeviation * (1 / max(1, recoveryDays))` to an annual aggregate which is then normalized:

```
p_depeg = clamp(sum(severities) / 365, 0, 1)
```

If no depeg events observed in the 365 day window, `p_depeg = 0.005` (we don't claim zero risk). If CoinGecko data is unavailable, `p_depeg = 0.05` (conservative).

For non-stable underlyings (ETH, BTC, MNT, LP tokens), depeg is not modeled and the events list is empty, giving `p_depeg = 0.005`.

**Oracle probability.** Read directly from the per-protocol config:

| Oracle type | p_oracle |
|---|---|
| Chainlink decentralized | 0.002 |
| Pyth | 0.005 |
| Redstone | 0.007 |
| Custom multi-source | 0.02 |
| Single oracle | 0.10 |

Missing oracle type means `p_oracle = 0.05`.

**Illiquidity probability.** No external slippage API in v1. Scout uses TVL as a proxy: bigger pool, lower implied exit slippage.

```
p_illiquid = clamp(0.10 - 0.01 * log10(max(tvlUsd,1)), 0.001, 0.20)
```

The shape: at `$1` TVL, p is 0.10; at `$1B`, p is around 0.01; at `$1T` or higher, p clamps at 0.001. This is less accurate than a real aggregator quote, but it is monotone and defensible without adding an integration.

**Counterparty probability.** From the per-protocol config.

| Counterparty class | p_counterparty |
|---|---|
| Permissionless (no custodian) | 0.005 |
| Attested centralized (with on-chain proofs of reserves) | 0.03 |
| Custodial (off-chain custody) | 0.08 |

Missing counterparty class gives `p_counterparty = 0.03`.

## Risk-adjusted APY

```
RAAPY = APY - ExpectedLoss
```

This can be negative for highly risky opportunities. Negative RAAPY is fine, it shows up in the Yield Map for inspection but is unlikely to be eligible for any tranche.

## Confidence

```
freshness  = exp(-stalenessMs / 300_000)        // half-life 5 minutes
completeness = (count of non-null risk fields) / total risk field count
confidence = clamp(freshness * completeness, 0, 1)
```

`Score = RAAPY * confidence`. An opportunity with poor data quality has its score scaled down even if the headline RAAPY looks attractive.

## Tranche mandates

Mandates are filters, not penalties. An opportunity that fails the senior mandate simply does not appear in the senior list. They are nested by design: anything senior-eligible is also mezzanine and junior eligible.

| Mandate | Max ExpectedLoss | Max p_exploit | Max p_depeg | Min TVL (USD) |
|---|---|---|---|---|
| Senior | 0.01 | 0.05 | 0.01 | 50,000,000 |
| Mezzanine | 0.04 | 0.15 | 0.05 | 5,000,000 |
| Junior | 0.15 | 1.00 | 1.00 | 100,000 |

Each scored opportunity is tagged with `eligibleTranches`, `primaryTranche` (the most senior tranche it qualifies for, the natural home for Architect's default allocation), and `rejectionReasons` (the predicate-by-predicate failures for the tranches it didn't qualify for, so the dashboard can explain "USDY rejected from senior: tvlUsd 40000000 < 50000000").

## Worked examples

**Aave USDC on Mantle, hypothetical.**

```
APY = 0.05
TVL = $100M
contractAge = 700 days, audit = top-tier (0.30), oracle = chainlink, counterparty = permissionless
depegEvents = []

p_exploit  = 0.30 * exp(-700/180) * 0.30 * tvlFactor
           = 0.30 * 0.020 * 0.30 * clamp(1.5 - 8.0/8, 0.5, 1.5)
           = 0.30 * 0.020 * 0.30 * 0.50  = 0.0009
p_depeg    = 0.005
p_oracle   = 0.002
p_illiquid = clamp(0.10 - 0.01 * 8.0, 0.001, 0.20) = clamp(0.02, ...) = 0.02
p_counterp = 0.005

ExpectedLoss = 0.0009*0.85 + 0.005*0.20 + 0.002*0.40 + 0.02*0.05 + 0.005*0.50
             ~= 0.00076 + 0.001 + 0.0008 + 0.001 + 0.0025
             ~= 0.0061

RAAPY = 0.05 - 0.0061 = 0.0439
confidence ~ 0.6 to 0.9 depending on enrichment population
Score      = 0.026 to 0.040
Tranche    = senior eligible (ExpectedLoss < 0.01, all p caps met, TVL > $50M)
```

**Junior-tier perp basis play, hypothetical.**

```
APY = 0.30
TVL = $1M
contractAge = 60 days, audit = none (1.0), oracle = single (0.10), counterparty = permissionless
depegEvents = []

p_exploit  = 0.30 * exp(-60/180) * 1.00 * clamp(1.5 - 6.0/8, 0.5, 1.5)
           = 0.30 * 0.717 * 1.00 * 0.75  = 0.161
p_depeg    = 0.005
p_oracle   = 0.10
p_illiquid = clamp(0.10 - 0.01*6.0, 0.001, 0.20) = 0.04
p_counterp = 0.005

ExpectedLoss = 0.161*0.85 + 0.005*0.20 + 0.10*0.40 + 0.04*0.05 + 0.005*0.50
             ~= 0.137 + 0.001 + 0.040 + 0.002 + 0.0025
             ~= 0.183

RAAPY = 0.30 - 0.183 = 0.117
Score = RAAPY * confidence
Tranche = none eligible (ExpectedLoss 0.183 > 0.15 junior cap, p_exploit 0.161 > 0.15 mezz cap)
```

This second example illustrates that headline yield doesn't survive the mandate filter when expected loss is high. It would show up in the Yield Map under `opportunities` with `eligibleTranches: []` and explicit `rejectionReasons` for each tranche.

## Constants

All scoring constants live in `agents/scout/src/pipeline/scoring.ts` under `SCORING_CONSTANTS`. They are frozen at module load. If a constant changes, the methodology hash changes, which means downstream consumers can detect that this v1 contract has been replaced.
