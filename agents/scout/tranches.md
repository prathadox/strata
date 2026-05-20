# Strata yield map, tranches

Generated 2026-05-20T20:25:54.528Z from real DefiLlama data on Mantle.
Total opportunities ingested: **57**. Senior **1**, Mezzanine **3**, Junior **24**, fully rejected **33**.

Each tranche has its own mandate. An opportunity that passes the senior mandate also passes mezz and junior (nested), so the same opportunity can show up in multiple lists. The "primary tranche" for any opportunity is the most-senior one it qualifies for.

## Senior, capital preservation

**Mandate**: expected-loss ≤ 2.00%/yr · p_exploit ≤ 5.00% · p_depeg ≤ 1.00% · TVL ≥ $25.00M · APY ∈ [2.00%, 8.00%] · no wash-trade flag

Per product.md: backed by **Ondo USDY** (tokenized T-bill yield) and **Ethena sUSDe** (synthetic dollar with delta-neutral basis). First on yield, last on loss.

### Eligible positions (1)

| Rank | Protocol | Asset symbol | APY (base) | APY (reward) | TVL | RAAPY | Score | Pool id |
|---|---|---|---|---|---|---|---|---|
| 1 | ondo | USDY | 3.55% | 0.00% | $29.44M | 1.76% | 0.0141 | `b5d7a190-38d2-4fdd-8c14-1fd00c11bce1` |

## Mezzanine, balanced

**Mandate**: expected-loss ≤ 4.00%/yr · p_exploit ≤ 15.00% · p_depeg ≤ 5.00% · TVL ≥ $1.00M · APY ∈ [1.00%, 20.00%] · no wash-trade flag

Per product.md: **mETH + Mantle Vault + CIAN strategies**, plus select stablecoin lending. Second claim, balanced risk and yield.

### Eligible positions (3)

| Rank | Protocol | Asset symbol | APY (base) | APY (reward) | TVL | RAAPY | Score | Pool id |
|---|---|---|---|---|---|---|---|---|
| 1 | aave | USDT0 | 3.14% | 2.96% | $19.69M | 2.48% | 0.0198 | `47da0cdd-7b1d-4927-9545-20b53b73afa8` |
| 2 | ondo | USDY | 3.55% | 0.00% | $29.44M | 1.76% | 0.0141 | `b5d7a190-38d2-4fdd-8c14-1fd00c11bce1` |
| 3 | aave | USDC | 2.42% | 5.28% | $2.95M | 1.70% | 0.0095 | `32cb38a5-b9b9-441a-bf07-8fab47b999d3` |

## Junior, residual upside

**Mandate**: expected-loss ≤ 15.00%/yr · p_exploit ≤ 100% · TVL ≥ $100.0K · APY uncapped

Per product.md: **leveraged positions, LP rewards, perp basis, and the CMO sleeve (demo)**. Last on yield, first on loss. Highest expected return.

### Eligible positions (24)

| Rank | Protocol | Asset symbol | APY (base) | APY (reward) | TVL | RAAPY | Score | Pool id |
|---|---|---|---|---|---|---|---|---|
| 1 | agni | USDT0-BSB | 89.79% | 0.00% | $1.49M | 88.42% | 0.4934 | `35f2103d-231b-443b-952e-d2cd118d8f29` |
| 2 | agni | BILL-USDT0 | 12.77% | 0.00% | $789.6K | 11.36% | 0.0679 | `85407ecd-f711-4fa6-9328-3078aebfaa95` |
| 3 | aave | WETH | 8.57% | 0.00% | $376.8K | 7.79% | 0.0435 | `4a0e9f84-09a0-491a-aa5e-269813d31a59` |
| 4 | aave | USDT0 | 3.14% | 2.96% | $19.69M | 2.48% | 0.0198 | `47da0cdd-7b1d-4927-9545-20b53b73afa8` |
| 5 | ondo | USDY | 3.55% | 0.00% | $29.44M | 1.76% | 0.0141 | `b5d7a190-38d2-4fdd-8c14-1fd00c11bce1` |
| 6 | agni | OPG-USDT0 | 3.36% | 0.00% | $423.2K | 1.90% | 0.0106 | `6d76a4e2-57f2-4190-a882-bd69f6ea32fb` |
| 7 | aave | USDC | 2.42% | 5.28% | $2.95M | 1.70% | 0.0095 | `32cb38a5-b9b9-441a-bf07-8fab47b999d3` |
| 8 | agni | USDC-WMSTRX | 2.58% | 0.00% | $111.0K | 1.05% | 0.0083 | `ebec73de-fd1e-4f97-8287-d9cb01c7d352` |
| 9 | agni | ELSA-USDT0 | 2.01% | 0.00% | $133.0K | 0.48% | 0.0027 | `649bee89-0a34-4eb1-b8ab-7c5fdee07ccd` |
| 10 | agni | USDC-WTSLAX | 1.44% | 0.00% | $107.5K | -0.10% | -0.0008 | `a4ff3d7c-a117-4b24-a9f9-6af46cd276c0` |
| 11 | agni | USDC-WNVDAX | 1.34% | 0.00% | $112.3K | -0.20% | -0.0011 | `2a510869-6356-4486-8bb5-d5a808634496` |
| 12 | aave | USDE | 0.28% | 4.00% | $5.86M | -0.41% | -0.0016 | `76b70b33-d8a4-4e61-8092-9bd1f2be2fc9` |
| 13 | agni | USDT0-SCOR | 0.73% | 0.00% | $111.0K | -0.81% | -0.0045 | `3d429d4e-b3a6-4847-957b-b10bf26a6f01` |
| 14 | aave | SUSDE | 0.00% | 4.00% | $63.70M | -0.62% | -0.0050 | `a4e37545-203b-4412-9acd-3e8b1aa4d744` |
| 15 | agni | USDC-WGOOGLX | 0.86% | 0.00% | $116.1K | -0.68% | -0.0054 | `227e8492-33e9-4953-8beb-28973c9fdb8a` |
| 16 | agni | USDC-WCRCLX | 0.51% | 0.00% | $107.7K | -1.03% | -0.0058 | `a7e2f58e-1c93-4592-acd6-8e40e6cb26ff` |
| 17 | agni | USDC-WAAPLX | 0.50% | 0.00% | $109.8K | -1.04% | -0.0058 | `3b6b75cf-adb5-4fb4-bbcd-8f75c6879c9d` |
| 18 | agni | USDC-WHOODX | 0.58% | 0.00% | $102.8K | -0.97% | -0.0077 | `30836422-c578-4f77-8f81-861c509c5d4c` |
| 19 | agni | USDC-WQQQX | 0.38% | 0.00% | $109.9K | -1.16% | -0.0092 | `2364dd66-69d3-44ef-9e85-4d5217a57b57` |
| 20 | agni | USDC-WMETAX | 0.31% | 0.00% | $103.7K | -1.24% | -0.0099 | `b8d50460-5237-4601-9250-4f2d3a6b569b` |
| 21 | agni | USDC-WSPYX | 0.14% | 0.00% | $106.9K | -1.41% | -0.0112 | `913ce101-55b1-4230-93c7-d523f0d9ca03` |
| 22 | agni | USDT0-VOOI | 0.13% | 0.00% | $101.8K | -1.42% | -0.0113 | `b5933580-18c1-43b6-aec3-2563cd30e3a2` |
| 23 | mantleVault | METH | 0.31% | 0.03% | $269.9K | -2.20% | -0.0175 | `c87c5d7c-0285-47a9-8539-d335f05b9ba2` |
| 24 | mantleVault | CMETH | 0.00% | 0.05% | $195.1K | -2.55% | -0.0203 | `b96d8236-36d4-4be4-92f7-422beeac7073` |

## Fully rejected

Opportunities that failed every mandate. These get tracked in the published Yield Map under `opportunities` but appear in no `perTranche` list.

| Protocol | Asset | TVL | APY (base) | Why rejected from junior |
|---|---|---|---|---|
| mantleVault | WMNT | $75.1K | 0.07% | tvlUsd 75095 < 100000 |
| cian | METH | $51.8K | 2.90% | tvlUsd 51818 < 100000 |
| agni | ELSA-WMNT | $49.2K | 2.32% | tvlUsd 49235 < 100000 |
| agni | USD1-USDT0 | $44.6K | 0.44% | tvlUsd 44583 < 100000 |
| mantleVault | METH | $34.2K | 0.00% | tvlUsd 34175 < 100000 |
| mantleVault | FBTC | $28.3K | 0.38% | tvlUsd 28256 < 100000 |
| mantleVault | WMNT | $22.6K | 0.00% | tvlUsd 22648 < 100000 |
| cian | METH-WETH | $17.6K | 0.44% | tvlUsd 17582 < 100000 |
| mantleVault | METH | $14.8K | 0.00% | tvlUsd 14786 < 100000 |
| fbtc | USDT | $14.7K | 10.79% | tvlUsd 14658 < 100000 |
| mantleVault | WETH | $10.5K | 0.00% | tvlUsd 10524 < 100000 |
| mantleVault | USDC | $10.4K | 0.02% | tvlUsd 10388 < 100000 |
| mantleVault | USDT | $6.4K | 0.04% | tvlUsd 6382 < 100000 |
| mantleVault | WBTC | $5.9K | 0.71% | tvlUsd 5911 < 100000 |
| mantleVault | USDE | $3.1K | 49.21% | tvlUsd 3146 < 100000 |
| mantleVault | WETH | $3.0K | 43.35% | tvlUsd 2952 < 100000 |
| mantleVault | CMETH | $2.3K | 0.02% | tvlUsd 2327 < 100000 |
| mantleVault | USDT | $2.1K | 50.97% | tvlUsd 2138 < 100000 |
| mantleVault | AUSD | $857 | 398.39% | tvlUsd 857 < 100000 |
| mantleVault | USDY | $822 | 1.17% | tvlUsd 822 < 100000 |
| fbtc | USDT | $124 | 0.00% | tvlUsd 124 < 100000 |
| mantleVault | SUSDE | $26 | 0.00% | tvlUsd 26 < 100000 |
| aave | GHO | $0 | 2.12% | tvlUsd 0 < 100000 |
| mantleVault | USDC | $0 | 70.40% | tvlUsd 0 < 100000 |
| fbtc | USDT | $0 | 10.00% | tvlUsd 0 < 100000 |
| fbtc | USDC | $0 | 9.75% | tvlUsd 0 < 100000 |
| fbtc | USDT | $0 | 17.50% | tvlUsd 0 < 100000 |
| fbtc | USDC | $0 | 10.00% | tvlUsd 0 < 100000 |
| fbtc | USDT | $0 | 13.00% | tvlUsd 0 < 100000 |
| fbtc | USDT | $0 | 15.00% | tvlUsd 0 < 100000 |
| fbtc | USDC | $0 | 10.00% | tvlUsd 0 < 100000 |
| fbtc | USDT | $0 | 13.00% | tvlUsd 0 < 100000 |
| mantleVault | FBTC | $0 | 0.00% | tvlUsd 0 < 100000 |

## Notes on the data

- Source: DefiLlama `/pools` filtered to chain=Mantle, project mapped through PROJECT_TO_SOURCE.
- Depeg history via **CoinGecko Demo**.
- Yield-accrual consistency (for USDY, sUSDe) via the same source, baselined against fitted exponential growth.
- Smart-money signal via Nansen: **disabled**, set NANSEN_API_KEY to activate.
- APY split into `apy` (real protocol yield, apyBase) and `apyReward` (token emissions). Senior + mezz score against base only.

This report is informational. The signed canonical Yield Map (with full per-opportunity scoring breakdown) is at `dry-cycle-output.md`. Both are generated from the same pipeline; this file just slices the data by tranche. Ephemeral run signer: `0xf72eF6069EA958bcA82C5263B56bcC7265aF4C35`.
