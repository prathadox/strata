# Scout dry-cycle inspection

Generated: 2026-05-20T19:55:15.309Z
Ephemeral signer: `0x034d6c95d1a1D3abaBBe2FFD7cAb5970517A065c`
Map hash: `0x81b7d0ecda784c6a1a4618d71d989cb77c372bba23e0d5a0a0356eb18309b280`

This file is produced by `scripts/inspect-cycle.ts`. The pipeline runs end to end, fetching real data from DefiLlama (yields + price history). Nansen and Lighthouse are skipped; the signature is over an ephemeral keypair generated at run time.

## Summary

- Opportunities ingested: **57**
- Opportunities scored: **57**
- Senior-eligible: **1**
- Mezzanine-eligible: **3**
- Junior-eligible: **24**

## Per-tranche rankings

### Senior (1)

| Rank | Source | Pool id | APY | RAAPY | Score | TVL |
|---|---|---|---|---|---|---|
| 1 | ondo | `ondo:b5d7a190-38d2-4fdd-8c14-1fd00c11bce1` | 3.55% | 1.67% | 0.0117 | $29,444,317 |

### Mezzanine (3)

| Rank | Source | Pool id | APY | RAAPY | Score | TVL |
|---|---|---|---|---|---|---|
| 1 | aave | `aave:47da0cdd-7b1d-4927-9545-20b53b73afa8` | 3.15% | 2.49% | 0.0174 | $19,363,509 |
| 2 | ondo | `ondo:b5d7a190-38d2-4fdd-8c14-1fd00c11bce1` | 3.55% | 1.67% | 0.0117 | $29,444,317 |
| 3 | aave | `aave:32cb38a5-b9b9-441a-bf07-8fab47b999d3` | 2.45% | 1.73% | 0.0085 | $2,868,113 |

### Junior (24)

| Rank | Source | Pool id | APY | RAAPY | Score | TVL |
|---|---|---|---|---|---|---|
| 1 | agni | `agni:35f2103d-231b-443b-952e-d2cd118d8f29` | 46.24% | 44.88% | 0.2198 | $1,752,765 |
| 2 | agni | `agni:85407ecd-f711-4fa6-9328-3078aebfaa95` | 12.27% | 10.85% | 0.0542 | $808,798 |
| 3 | aave | `aave:4a0e9f84-09a0-491a-aa5e-269813d31a59` | 8.57% | 7.79% | 0.0382 | $376,791 |
| 4 | aave | `aave:47da0cdd-7b1d-4927-9545-20b53b73afa8` | 3.15% | 2.49% | 0.0174 | $19,363,509 |
| 5 | ondo | `ondo:b5d7a190-38d2-4fdd-8c14-1fd00c11bce1` | 3.55% | 1.67% | 0.0117 | $29,444,317 |
| 6 | agni | `agni:6d76a4e2-57f2-4190-a882-bd69f6ea32fb` | 3.36% | 1.90% | 0.0093 | $423,182 |
| 7 | aave | `aave:32cb38a5-b9b9-441a-bf07-8fab47b999d3` | 2.45% | 1.73% | 0.0085 | $2,868,113 |
| 8 | agni | `agni:ebec73de-fd1e-4f97-8287-d9cb01c7d352` | 2.45% | 0.91% | 0.0063 | $111,132 |
| 9 | agni | `agni:649bee89-0a34-4eb1-b8ab-7c5fdee07ccd` | 1.91% | 0.38% | 0.0019 | $133,062 |
| 10 | agni | `agni:2a510869-6356-4486-8bb5-d5a808634496` | 1.34% | -0.20% | -0.0010 | $112,344 |
| 11 | aave | `aave:76b70b33-d8a4-4e61-8092-9bd1f2be2fc9` | 0.28% | -0.41% | -0.0014 | $5,862,590 |
| 12 | agni | `agni:a4ff3d7c-a117-4b24-a9f9-6af46cd276c0` | 1.26% | -0.28% | -0.0019 | $107,152 |
| 13 | aave | `aave:a4e37545-203b-4412-9acd-3e8b1aa4d744` | 0.00% | -0.62% | -0.0044 | $63,883,998 |
| 14 | agni | `agni:a7e2f58e-1c93-4592-acd6-8e40e6cb26ff` | 0.51% | -1.03% | -0.0051 | $107,709 |
| 15 | agni | `agni:3b6b75cf-adb5-4fb4-bbcd-8f75c6879c9d` | 0.50% | -1.04% | -0.0051 | $109,753 |
| 16 | agni | `agni:3d429d4e-b3a6-4847-957b-b10bf26a6f01` | 0.50% | -1.04% | -0.0051 | $110,072 |
| 17 | agni | `agni:227e8492-33e9-4953-8beb-28973c9fdb8a` | 0.76% | -0.78% | -0.0054 | $115,881 |
| 18 | agni | `agni:30836422-c578-4f77-8f81-861c509c5d4c` | 0.58% | -0.97% | -0.0068 | $102,818 |
| 19 | agni | `agni:2364dd66-69d3-44ef-9e85-4d5217a57b57` | 0.36% | -1.18% | -0.0083 | $109,507 |
| 20 | agni | `agni:b8d50460-5237-4601-9250-4f2d3a6b569b` | 0.31% | -1.24% | -0.0086 | $103,663 |
| 21 | agni | `agni:b5933580-18c1-43b6-aec3-2563cd30e3a2` | 0.13% | -1.42% | -0.0099 | $101,761 |
| 22 | agni | `agni:913ce101-55b1-4230-93c7-d523f0d9ca03` | 0.11% | -1.43% | -0.0100 | $106,878 |
| 23 | mantleVault | `mantleVault:c87c5d7c-0285-47a9-8539-d335f05b9ba2` | 0.31% | -2.20% | -0.0154 | $268,408 |
| 24 | mantleVault | `mantleVault:b96d8236-36d4-4be4-92f7-422beeac7073` | 0.00% | -2.55% | -0.0179 | $193,897 |

## All scored opportunities

### aave:a4e37545-203b-4412-9acd-3e8b1aa4d744

- **Source**: aave
- **Asset**: `0x211cc4dd073734da055fbf44a2b4667d5e5fe5d2`
- **APY (base)**: 0.00%    **APY (reward)**: 4.00%    **Total**: 4.00%
- **TVL**: $63,883,998
- **APY history**: vol=0.00%, drift=1.00x
- **Nansen signal**: _null_ (no key or asset not covered)
- **Probabilities**: exploit=0.00097, depeg=0.00500, oracle=0.00200, illiquid=0.02195, counterparty=0.00500
- **Expected loss**: 0.622% /yr
- **RAAPY**: -0.62%
- **Confidence**: 0.700
- **Score**: -0.0044
- **Eligible tranches**: junior
- **Primary tranche**: junior
- **Rejection reasons**:
  - senior: apyBase 0.00% < 2% (reward-only positions blocked)
  - mezzanine: apyBase 0.00% < 1% (reward-only positions blocked)

### ondo:b5d7a190-38d2-4fdd-8c14-1fd00c11bce1

- **Source**: ondo
- **Asset**: `0x5be26527e817998a7206475496fde1e68957c5a6`
- **APY (base)**: 3.55%    **APY (reward)**: 0.00%    **Total**: 3.55%
- **TVL**: $29,444,317
- **APY history**: vol=0.01%, drift=1.00x
- **Nansen signal**: _null_ (no key or asset not covered)
- **Probabilities**: exploit=0.00088, depeg=0.00500, oracle=0.00200, illiquid=0.02531, counterparty=0.03000
- **Expected loss**: 1.882% /yr
- **RAAPY**: 1.67%
- **Confidence**: 0.700
- **Score**: 0.0117
- **Eligible tranches**: senior, mezzanine, junior
- **Primary tranche**: senior

### aave:47da0cdd-7b1d-4927-9545-20b53b73afa8

- **Source**: aave
- **Asset**: `0x779ded0c9e1022225f8e0630b35a9b54be713736`
- **APY (base)**: 3.15%    **APY (reward)**: 2.93%    **Total**: 6.08%
- **TVL**: $19,363,509
- **APY history**: vol=2.65%, drift=0.76x
- **Nansen signal**: _null_ (no key or asset not covered)
- **Probabilities**: exploit=0.00109, depeg=0.00500, oracle=0.00200, illiquid=0.02713, counterparty=0.00500
- **Expected loss**: 0.658% /yr
- **RAAPY**: 2.49%
- **Confidence**: 0.700
- **Score**: 0.0174
- **Eligible tranches**: mezzanine, junior
- **Primary tranche**: mezzanine
- **Rejection reasons**:
  - senior: tvlUsd 19363509 < 25000000

### aave:76b70b33-d8a4-4e61-8092-9bd1f2be2fc9

- **Source**: aave
- **Asset**: `0x5d3a1ff2b6bab83b63cd9ad0787074081a52ef34`
- **APY (base)**: 0.28%    **APY (reward)**: 4.00%    **Total**: 4.28%
- **TVL**: $5,862,590
- **APY history**: vol=3.21%, drift=42.93x
- **Nansen signal**: _null_ (no key or asset not covered)
- **Probabilities**: exploit=0.00120, depeg=0.00500, oracle=0.00200, illiquid=0.03232, counterparty=0.00500
- **Expected loss**: 0.694% /yr
- **RAAPY**: -0.41%
- **Confidence**: 0.343
- **Score**: -0.0014
- **Eligible tranches**: junior
- **Primary tranche**: junior
- **Rejection reasons**:
  - senior: tvlUsd 5862590 < 25000000; apyBase 0.28% < 2% (reward-only positions blocked)
  - mezzanine: apyBase 0.28% < 1% (reward-only positions blocked)

### aave:32cb38a5-b9b9-441a-bf07-8fab47b999d3

- **Source**: aave
- **Asset**: `0x09bc4e0d864854c6afb6eb9a9cdf58ac190d0df9`
- **APY (base)**: 2.45%    **APY (reward)**: 5.26%    **Total**: 7.71%
- **TVL**: $2,868,113
- **APY history**: vol=3.35%, drift=0.73x
- **Nansen signal**: _null_ (no key or asset not covered)
- **Probabilities**: exploit=0.00128, depeg=0.00500, oracle=0.00200, illiquid=0.03542, counterparty=0.00500
- **Expected loss**: 0.716% /yr
- **RAAPY**: 1.73%
- **Confidence**: 0.489
- **Score**: 0.0085
- **Eligible tranches**: mezzanine, junior
- **Primary tranche**: mezzanine
- **Rejection reasons**:
  - senior: tvlUsd 2868113 < 25000000

### agni:35f2103d-231b-443b-952e-d2cd118d8f29

- **Source**: agni
- **Asset**: `0x779ded0c9e1022225f8e0630b35a9b54be713736`
- **APY (base)**: 46.24%    **APY (reward)**: 0.00%    **Total**: 46.24%
- **TVL**: $1,752,765
- **APY history**: vol=61.81%, drift=1.39x
- **Nansen signal**: _null_ (no key or asset not covered)
- **Probabilities**: exploit=0.00645, depeg=0.00500, oracle=0.00700, illiquid=0.03756, counterparty=0.00500
- **Expected loss**: 1.366% /yr
- **RAAPY**: 44.88%
- **Confidence**: 0.490
- **Score**: 0.2198
- **Eligible tranches**: junior
- **Primary tranche**: junior
- **Rejection reasons**:
  - senior: tvlUsd 1752765 < 25000000; apy 46.24% > 8% (too-good-to-be-true gate)
  - mezzanine: apy 46.24% > 20% (too-good-to-be-true gate)

### agni:85407ecd-f711-4fa6-9328-3078aebfaa95

- **Source**: agni
- **Asset**: `0x55b9f84605b30df9bb9d817a6900219f25218157`
- **APY (base)**: 12.27%    **APY (reward)**: 0.00%    **Total**: 12.27%
- **TVL**: $808,798
- **APY history**: no history available
- **Nansen signal**: _null_ (no key or asset not covered)
- **Probabilities**: exploit=0.00682, depeg=0.00500, oracle=0.00700, illiquid=0.04092, counterparty=0.00500
- **Expected loss**: 1.415% /yr
- **RAAPY**: 10.85%
- **Confidence**: 0.500
- **Score**: 0.0542
- **Eligible tranches**: junior
- **Primary tranche**: junior
- **Rejection reasons**:
  - senior: tvlUsd 808798 < 25000000; apy 12.27% > 8% (too-good-to-be-true gate)
  - mezzanine: tvlUsd 808798 < 1000000

### agni:6d76a4e2-57f2-4190-a882-bd69f6ea32fb

- **Source**: agni
- **Asset**: `0x45db70e1c808dae42f9c4dfea74ba5e6a113bdc1`
- **APY (base)**: 3.36%    **APY (reward)**: 0.00%    **Total**: 3.36%
- **TVL**: $423,182
- **APY history**: vol=951.25%, drift=0.03x
- **Nansen signal**: _null_ (no key or asset not covered)
- **Probabilities**: exploit=0.00714, depeg=0.00500, oracle=0.00700, illiquid=0.04373, counterparty=0.00500
- **Expected loss**: 1.456% /yr
- **RAAPY**: 1.90%
- **Confidence**: 0.490
- **Score**: 0.0093
- **Eligible tranches**: junior
- **Primary tranche**: junior
- **Rejection reasons**:
  - senior: tvlUsd 423182 < 25000000
  - mezzanine: tvlUsd 423182 < 1000000

### aave:4a0e9f84-09a0-491a-aa5e-269813d31a59

- **Source**: aave
- **Asset**: `0xdeaddeaddeaddeaddeaddeaddeaddeaddead1111`
- **APY (base)**: 8.57%    **APY (reward)**: 0.00%    **Total**: 8.57%
- **TVL**: $376,791
- **APY history**: vol=2.15%, drift=2.24x
- **Nansen signal**: _null_ (no key or asset not covered)
- **Probabilities**: exploit=0.00148, depeg=0.00500, oracle=0.00200, illiquid=0.04424, counterparty=0.00500
- **Expected loss**: 0.777% /yr
- **RAAPY**: 7.79%
- **Confidence**: 0.490
- **Score**: 0.0382
- **Eligible tranches**: junior
- **Primary tranche**: junior
- **Rejection reasons**:
  - senior: tvlUsd 376791 < 25000000; apy 8.57% > 8% (too-good-to-be-true gate)
  - mezzanine: tvlUsd 376791 < 1000000

### mantleVault:c87c5d7c-0285-47a9-8539-d335f05b9ba2

- **Source**: mantleVault
- **Asset**: `0xcda86a272531e8640cd7f1a92c01839911b90bb0`
- **APY (base)**: 0.31%    **APY (reward)**: 0.03%    **Total**: 0.34%
- **TVL**: $268,408
- **APY history**: vol=0.06%, drift=1.29x
- **Nansen signal**: _null_ (no key or asset not covered)
- **Probabilities**: exploit=0.01946, depeg=0.00500, oracle=0.00700, illiquid=0.04571, counterparty=0.00500
- **Expected loss**: 2.513% /yr
- **RAAPY**: -2.20%
- **Confidence**: 0.700
- **Score**: -0.0154
- **Eligible tranches**: junior
- **Primary tranche**: junior
- **Rejection reasons**:
  - senior: expectedLoss 0.0251 > 0.02; tvlUsd 268408 < 25000000; apyBase 0.31% < 2% (reward-only positions blocked)
  - mezzanine: tvlUsd 268408 < 1000000; apyBase 0.31% < 1% (reward-only positions blocked)

### mantleVault:b96d8236-36d4-4be4-92f7-422beeac7073

- **Source**: mantleVault
- **Asset**: `0xe6829d9a7ee3040e1276fa75293bde931859e8fa`
- **APY (base)**: 0.00%    **APY (reward)**: 0.05%    **Total**: 0.05%
- **TVL**: $193,897
- **APY history**: vol=0.15%, drift=0.10x
- **Nansen signal**: _null_ (no key or asset not covered)
- **Probabilities**: exploit=0.01988, depeg=0.00500, oracle=0.00700, illiquid=0.04712, counterparty=0.00500
- **Expected loss**: 2.555% /yr
- **RAAPY**: -2.55%
- **Confidence**: 0.700
- **Score**: -0.0179
- **Eligible tranches**: junior
- **Primary tranche**: junior
- **Rejection reasons**:
  - senior: expectedLoss 0.0256 > 0.02; tvlUsd 193897 < 25000000; apyBase 0.00% < 2% (reward-only positions blocked)
  - mezzanine: tvlUsd 193897 < 1000000; apyBase 0.00% < 1% (reward-only positions blocked)

### agni:649bee89-0a34-4eb1-b8ab-7c5fdee07ccd

- **Source**: agni
- **Asset**: `0x29cc30f9d113b356ce408667aa6433589cecbdca`
- **APY (base)**: 1.91%    **APY (reward)**: 0.00%    **Total**: 1.91%
- **TVL**: $133,062
- **APY history**: vol=3.02%, drift=0.59x
- **Nansen signal**: _null_ (no key or asset not covered)
- **Probabilities**: exploit=0.00770, depeg=0.00500, oracle=0.00700, illiquid=0.04876, counterparty=0.00500
- **Expected loss**: 1.529% /yr
- **RAAPY**: 0.38%
- **Confidence**: 0.490
- **Score**: 0.0019
- **Eligible tranches**: junior
- **Primary tranche**: junior
- **Rejection reasons**:
  - senior: tvlUsd 133062 < 25000000; apyBase 1.91% < 2% (reward-only positions blocked)
  - mezzanine: tvlUsd 133062 < 1000000

### agni:227e8492-33e9-4953-8beb-28973c9fdb8a

- **Source**: agni
- **Asset**: `0x09bc4e0d864854c6afb6eb9a9cdf58ac190d0df9`
- **APY (base)**: 0.76%    **APY (reward)**: 0.00%    **Total**: 0.76%
- **TVL**: $115,881
- **APY history**: vol=0.81%, drift=1.35x
- **Nansen signal**: _null_ (no key or asset not covered)
- **Probabilities**: exploit=0.00777, depeg=0.00500, oracle=0.00700, illiquid=0.04936, counterparty=0.00500
- **Expected loss**: 1.537% /yr
- **RAAPY**: -0.78%
- **Confidence**: 0.699
- **Score**: -0.0054
- **Eligible tranches**: junior
- **Primary tranche**: junior
- **Rejection reasons**:
  - senior: tvlUsd 115881 < 25000000; apyBase 0.76% < 2% (reward-only positions blocked)
  - mezzanine: tvlUsd 115881 < 1000000; apyBase 0.76% < 1% (reward-only positions blocked)

### agni:2a510869-6356-4486-8bb5-d5a808634496

- **Source**: agni
- **Asset**: `0x09bc4e0d864854c6afb6eb9a9cdf58ac190d0df9`
- **APY (base)**: 1.34%    **APY (reward)**: 0.00%    **Total**: 1.34%
- **TVL**: $112,344
- **APY history**: vol=1.06%, drift=1.73x
- **Nansen signal**: _null_ (no key or asset not covered)
- **Probabilities**: exploit=0.00778, depeg=0.00500, oracle=0.00700, illiquid=0.04949, counterparty=0.00500
- **Expected loss**: 1.539% /yr
- **RAAPY**: -0.20%
- **Confidence**: 0.489
- **Score**: -0.0010
- **Eligible tranches**: junior
- **Primary tranche**: junior
- **Rejection reasons**:
  - senior: tvlUsd 112344 < 25000000; apyBase 1.34% < 2% (reward-only positions blocked)
  - mezzanine: tvlUsd 112344 < 1000000

### agni:ebec73de-fd1e-4f97-8287-d9cb01c7d352

- **Source**: agni
- **Asset**: `0x09bc4e0d864854c6afb6eb9a9cdf58ac190d0df9`
- **APY (base)**: 2.45%    **APY (reward)**: 0.00%    **Total**: 2.45%
- **TVL**: $111,132
- **APY history**: vol=2.38%, drift=0.97x
- **Nansen signal**: _null_ (no key or asset not covered)
- **Probabilities**: exploit=0.00779, depeg=0.00500, oracle=0.00700, illiquid=0.04954, counterparty=0.00500
- **Expected loss**: 1.540% /yr
- **RAAPY**: 0.91%
- **Confidence**: 0.699
- **Score**: 0.0063
- **Eligible tranches**: junior
- **Primary tranche**: junior
- **Rejection reasons**:
  - senior: tvlUsd 111132 < 25000000
  - mezzanine: tvlUsd 111132 < 1000000

### agni:3d429d4e-b3a6-4847-957b-b10bf26a6f01

- **Source**: agni
- **Asset**: `0x779ded0c9e1022225f8e0630b35a9b54be713736`
- **APY (base)**: 0.50%    **APY (reward)**: 0.00%    **Total**: 0.50%
- **TVL**: $110,072
- **APY history**: vol=6.54%, drift=0.17x
- **Nansen signal**: _null_ (no key or asset not covered)
- **Probabilities**: exploit=0.00779, depeg=0.00500, oracle=0.00700, illiquid=0.04958, counterparty=0.00500
- **Expected loss**: 1.540% /yr
- **RAAPY**: -1.04%
- **Confidence**: 0.490
- **Score**: -0.0051
- **Eligible tranches**: junior
- **Primary tranche**: junior
- **Rejection reasons**:
  - senior: tvlUsd 110072 < 25000000; apyBase 0.50% < 2% (reward-only positions blocked)
  - mezzanine: tvlUsd 110072 < 1000000; apyBase 0.50% < 1% (reward-only positions blocked)

### agni:3b6b75cf-adb5-4fb4-bbcd-8f75c6879c9d

- **Source**: agni
- **Asset**: `0x09bc4e0d864854c6afb6eb9a9cdf58ac190d0df9`
- **APY (base)**: 0.50%    **APY (reward)**: 0.00%    **Total**: 0.50%
- **TVL**: $109,753
- **APY history**: vol=0.59%, drift=1.79x
- **Nansen signal**: _null_ (no key or asset not covered)
- **Probabilities**: exploit=0.00780, depeg=0.00500, oracle=0.00700, illiquid=0.04960, counterparty=0.00500
- **Expected loss**: 1.541% /yr
- **RAAPY**: -1.04%
- **Confidence**: 0.489
- **Score**: -0.0051
- **Eligible tranches**: junior
- **Primary tranche**: junior
- **Rejection reasons**:
  - senior: tvlUsd 109753 < 25000000; apyBase 0.50% < 2% (reward-only positions blocked)
  - mezzanine: tvlUsd 109753 < 1000000; apyBase 0.50% < 1% (reward-only positions blocked)

### agni:2364dd66-69d3-44ef-9e85-4d5217a57b57

- **Source**: agni
- **Asset**: `0x09bc4e0d864854c6afb6eb9a9cdf58ac190d0df9`
- **APY (base)**: 0.36%    **APY (reward)**: 0.00%    **Total**: 0.36%
- **TVL**: $109,507
- **APY history**: vol=0.21%, drift=1.24x
- **Nansen signal**: _null_ (no key or asset not covered)
- **Probabilities**: exploit=0.00780, depeg=0.00500, oracle=0.00700, illiquid=0.04961, counterparty=0.00500
- **Expected loss**: 1.541% /yr
- **RAAPY**: -1.18%
- **Confidence**: 0.699
- **Score**: -0.0083
- **Eligible tranches**: junior
- **Primary tranche**: junior
- **Rejection reasons**:
  - senior: tvlUsd 109507 < 25000000; apyBase 0.36% < 2% (reward-only positions blocked)
  - mezzanine: tvlUsd 109507 < 1000000; apyBase 0.36% < 1% (reward-only positions blocked)

### agni:a7e2f58e-1c93-4592-acd6-8e40e6cb26ff

- **Source**: agni
- **Asset**: `0x09bc4e0d864854c6afb6eb9a9cdf58ac190d0df9`
- **APY (base)**: 0.51%    **APY (reward)**: 0.00%    **Total**: 0.51%
- **TVL**: $107,709
- **APY history**: vol=1.66%, drift=1.83x
- **Nansen signal**: _null_ (no key or asset not covered)
- **Probabilities**: exploit=0.00781, depeg=0.00500, oracle=0.00700, illiquid=0.04968, counterparty=0.00500
- **Expected loss**: 1.542% /yr
- **RAAPY**: -1.03%
- **Confidence**: 0.489
- **Score**: -0.0051
- **Eligible tranches**: junior
- **Primary tranche**: junior
- **Rejection reasons**:
  - senior: tvlUsd 107709 < 25000000; apyBase 0.51% < 2% (reward-only positions blocked)
  - mezzanine: tvlUsd 107709 < 1000000; apyBase 0.51% < 1% (reward-only positions blocked)

### agni:a4ff3d7c-a117-4b24-a9f9-6af46cd276c0

- **Source**: agni
- **Asset**: `0x09bc4e0d864854c6afb6eb9a9cdf58ac190d0df9`
- **APY (base)**: 1.26%    **APY (reward)**: 0.00%    **Total**: 1.26%
- **TVL**: $107,152
- **APY history**: vol=1.17%, drift=1.08x
- **Nansen signal**: _null_ (no key or asset not covered)
- **Probabilities**: exploit=0.00781, depeg=0.00500, oracle=0.00700, illiquid=0.04970, counterparty=0.00500
- **Expected loss**: 1.542% /yr
- **RAAPY**: -0.28%
- **Confidence**: 0.699
- **Score**: -0.0019
- **Eligible tranches**: junior
- **Primary tranche**: junior
- **Rejection reasons**:
  - senior: tvlUsd 107152 < 25000000; apyBase 1.26% < 2% (reward-only positions blocked)
  - mezzanine: tvlUsd 107152 < 1000000

### agni:913ce101-55b1-4230-93c7-d523f0d9ca03

- **Source**: agni
- **Asset**: `0x09bc4e0d864854c6afb6eb9a9cdf58ac190d0df9`
- **APY (base)**: 0.11%    **APY (reward)**: 0.00%    **Total**: 0.11%
- **TVL**: $106,878
- **APY history**: vol=0.12%, drift=0.69x
- **Nansen signal**: _null_ (no key or asset not covered)
- **Probabilities**: exploit=0.00781, depeg=0.00500, oracle=0.00700, illiquid=0.04971, counterparty=0.00500
- **Expected loss**: 1.542% /yr
- **RAAPY**: -1.43%
- **Confidence**: 0.699
- **Score**: -0.0100
- **Eligible tranches**: junior
- **Primary tranche**: junior
- **Rejection reasons**:
  - senior: tvlUsd 106878 < 25000000; apyBase 0.11% < 2% (reward-only positions blocked)
  - mezzanine: tvlUsd 106878 < 1000000; apyBase 0.11% < 1% (reward-only positions blocked)

### agni:b8d50460-5237-4601-9250-4f2d3a6b569b

- **Source**: agni
- **Asset**: `0x09bc4e0d864854c6afb6eb9a9cdf58ac190d0df9`
- **APY (base)**: 0.31%    **APY (reward)**: 0.00%    **Total**: 0.31%
- **TVL**: $103,663
- **APY history**: vol=0.67%, drift=0.97x
- **Nansen signal**: _null_ (no key or asset not covered)
- **Probabilities**: exploit=0.00782, depeg=0.00500, oracle=0.00700, illiquid=0.04984, counterparty=0.00500
- **Expected loss**: 1.544% /yr
- **RAAPY**: -1.24%
- **Confidence**: 0.699
- **Score**: -0.0086
- **Eligible tranches**: junior
- **Primary tranche**: junior
- **Rejection reasons**:
  - senior: tvlUsd 103663 < 25000000; apyBase 0.31% < 2% (reward-only positions blocked)
  - mezzanine: tvlUsd 103663 < 1000000; apyBase 0.31% < 1% (reward-only positions blocked)

### agni:30836422-c578-4f77-8f81-861c509c5d4c

- **Source**: agni
- **Asset**: `0x09bc4e0d864854c6afb6eb9a9cdf58ac190d0df9`
- **APY (base)**: 0.58%    **APY (reward)**: 0.00%    **Total**: 0.58%
- **TVL**: $102,818
- **APY history**: vol=0.84%, drift=0.61x
- **Nansen signal**: _null_ (no key or asset not covered)
- **Probabilities**: exploit=0.00783, depeg=0.00500, oracle=0.00700, illiquid=0.04988, counterparty=0.00500
- **Expected loss**: 1.545% /yr
- **RAAPY**: -0.97%
- **Confidence**: 0.699
- **Score**: -0.0068
- **Eligible tranches**: junior
- **Primary tranche**: junior
- **Rejection reasons**:
  - senior: tvlUsd 102818 < 25000000; apyBase 0.58% < 2% (reward-only positions blocked)
  - mezzanine: tvlUsd 102818 < 1000000; apyBase 0.58% < 1% (reward-only positions blocked)

### agni:b5933580-18c1-43b6-aec3-2563cd30e3a2

- **Source**: agni
- **Asset**: `0x779ded0c9e1022225f8e0630b35a9b54be713736`
- **APY (base)**: 0.13%    **APY (reward)**: 0.00%    **Total**: 0.13%
- **TVL**: $101,761
- **APY history**: vol=0.48%, drift=0.50x
- **Nansen signal**: _null_ (no key or asset not covered)
- **Probabilities**: exploit=0.00783, depeg=0.00500, oracle=0.00700, illiquid=0.04992, counterparty=0.00500
- **Expected loss**: 1.545% /yr
- **RAAPY**: -1.42%
- **Confidence**: 0.700
- **Score**: -0.0099
- **Eligible tranches**: junior
- **Primary tranche**: junior
- **Rejection reasons**:
  - senior: tvlUsd 101761 < 25000000; apyBase 0.13% < 2% (reward-only positions blocked)
  - mezzanine: tvlUsd 101761 < 1000000; apyBase 0.13% < 1% (reward-only positions blocked)

### mantleVault:3f5789dd-68ed-44c7-9388-b553df96502d

- **Source**: mantleVault
- **Asset**: `0x78c1b0c915c4faa5fffa6cabf0219da63d7f4cb8`
- **APY (base)**: 0.07%    **APY (reward)**: 0.35%    **Total**: 0.42%
- **TVL**: $74,444
- **APY history**: vol=0.87%, drift=0.10x
- **Nansen signal**: _null_ (no key or asset not covered)
- **Probabilities**: exploit=0.02111, depeg=0.00500, oracle=0.00700, illiquid=0.05128, counterparty=0.00500
- **Expected loss**: 2.681% /yr
- **RAAPY**: -2.61%
- **Confidence**: 0.700
- **Score**: -0.0183
- **Eligible tranches**: _none_
- **Primary tranche**: _none_
- **Rejection reasons**:
  - senior: expectedLoss 0.0268 > 0.02; tvlUsd 74444 < 25000000; apyBase 0.07% < 2% (reward-only positions blocked)
  - mezzanine: tvlUsd 74444 < 1000000; apyBase 0.07% < 1% (reward-only positions blocked)
  - junior: tvlUsd 74444 < 100000

### cian:009b6f09-bfa7-4852-8685-0980d9478419

- **Source**: cian
- **Asset**: `0xcda86a272531e8640cd7f1a92c01839911b90bb0`
- **APY (base)**: 2.90%    **APY (reward)**: 0.00%    **Total**: 2.90%
- **TVL**: $51,751
- **APY history**: vol=0.31%, drift=0.88x
- **Nansen signal**: _null_ (no key or asset not covered)
- **Probabilities**: exploit=0.03096, depeg=0.00500, oracle=0.02000, illiquid=0.05286, counterparty=0.00500
- **Expected loss**: 4.046% /yr
- **RAAPY**: -1.14%
- **Confidence**: 0.700
- **Score**: -0.0080
- **Eligible tranches**: _none_
- **Primary tranche**: _none_
- **Rejection reasons**:
  - senior: expectedLoss 0.0405 > 0.02; tvlUsd 51751 < 25000000
  - mezzanine: expectedLoss 0.0405 > 0.04; tvlUsd 51751 < 1000000
  - junior: tvlUsd 51751 < 100000

### agni:ab6d4bd4-fa82-4f09-9588-98c953179d61

- **Source**: agni
- **Asset**: `0x29cc30f9d113b356ce408667aa6433589cecbdca`
- **APY (base)**: 1.92%    **APY (reward)**: 0.00%    **Total**: 1.92%
- **TVL**: $49,036
- **APY history**: vol=2.67%, drift=0.63x
- **Nansen signal**: _null_ (no key or asset not covered)
- **Probabilities**: exploit=0.00819, depeg=0.00500, oracle=0.00700, illiquid=0.05309, counterparty=0.00500
- **Expected loss**: 1.591% /yr
- **RAAPY**: 0.33%
- **Confidence**: 0.700
- **Score**: 0.0023
- **Eligible tranches**: _none_
- **Primary tranche**: _none_
- **Rejection reasons**:
  - senior: tvlUsd 49036 < 25000000; apyBase 1.92% < 2% (reward-only positions blocked)
  - mezzanine: tvlUsd 49036 < 1000000
  - junior: tvlUsd 49036 < 100000

### agni:6a134700-f4a3-49ad-ad5a-fe1868b1c744

- **Source**: agni
- **Asset**: `0x111111d2bf19e43c34263401e0cad979ed1cdb61`
- **APY (base)**: 0.44%    **APY (reward)**: 0.00%    **Total**: 0.44%
- **TVL**: $44,583
- **APY history**: vol=132.60%, drift=0.05x
- **Nansen signal**: _null_ (no key or asset not covered)
- **Probabilities**: exploit=0.00823, depeg=0.00500, oracle=0.00700, illiquid=0.05351, counterparty=0.00500
- **Expected loss**: 1.597% /yr
- **RAAPY**: -1.16%
- **Confidence**: 0.490
- **Score**: -0.0057
- **Eligible tranches**: _none_
- **Primary tranche**: _none_
- **Rejection reasons**:
  - senior: tvlUsd 44583 < 25000000; apyBase 0.44% < 2% (reward-only positions blocked)
  - mezzanine: tvlUsd 44583 < 1000000; apyBase 0.44% < 1% (reward-only positions blocked)
  - junior: tvlUsd 44583 < 100000

### mantleVault:4ecffa03-92a0-4eed-bb8b-7537ade00cae

- **Source**: mantleVault
- **Asset**: `0xcda86a272531e8640cd7f1a92c01839911b90bb0`
- **APY (base)**: 0.00%    **APY (reward)**: 0.00%    **Total**: 0.00%
- **TVL**: $33,993
- **APY history**: vol=0.00%, drift=1.05x
- **Nansen signal**: _null_ (no key or asset not covered)
- **Probabilities**: exploit=0.02212, depeg=0.00500, oracle=0.00700, illiquid=0.05469, counterparty=0.00500
- **Expected loss**: 2.784% /yr
- **RAAPY**: -2.78%
- **Confidence**: 0.700
- **Score**: -0.0195
- **Eligible tranches**: _none_
- **Primary tranche**: _none_
- **Rejection reasons**:
  - senior: expectedLoss 0.0278 > 0.02; tvlUsd 33993 < 25000000; apyBase 0.00% < 2% (reward-only positions blocked)
  - mezzanine: tvlUsd 33993 < 1000000; apyBase 0.00% < 1% (reward-only positions blocked)
  - junior: tvlUsd 33993 < 100000

### mantleVault:dc732e3d-d65b-4087-8d48-53e50bb47732

- **Source**: mantleVault
- **Asset**: `0xc96de26018a54d51c097160568752c4e3bd6c364`
- **APY (base)**: 0.38%    **APY (reward)**: 1.25%    **Total**: 1.63%
- **TVL**: $28,256
- **APY history**: vol=0.07%, drift=1.29x
- **Nansen signal**: _null_ (no key or asset not covered)
- **Probabilities**: exploit=0.02236, depeg=0.00500, oracle=0.00700, illiquid=0.05549, counterparty=0.00500
- **Expected loss**: 2.808% /yr
- **RAAPY**: -2.43%
- **Confidence**: 0.700
- **Score**: -0.0170
- **Eligible tranches**: _none_
- **Primary tranche**: _none_
- **Rejection reasons**:
  - senior: expectedLoss 0.0281 > 0.02; tvlUsd 28256 < 25000000; apyBase 0.38% < 2% (reward-only positions blocked)
  - mezzanine: tvlUsd 28256 < 1000000; apyBase 0.38% < 1% (reward-only positions blocked)
  - junior: tvlUsd 28256 < 100000

### mantleVault:d6c5fcec-1f1f-40e8-b732-076ece1462fc

- **Source**: mantleVault
- **Asset**: `0x78c1b0c915c4faa5fffa6cabf0219da63d7f4cb8`
- **APY (base)**: 0.00%    **APY (reward)**: 0.00%    **Total**: 0.00%
- **TVL**: $22,452
- **APY history**: vol=0.00%, drift=1.05x
- **Nansen signal**: _null_ (no key or asset not covered)
- **Probabilities**: exploit=0.02265, depeg=0.00500, oracle=0.00700, illiquid=0.05649, counterparty=0.00500
- **Expected loss**: 2.838% /yr
- **RAAPY**: -2.84%
- **Confidence**: 0.700
- **Score**: -0.0199
- **Eligible tranches**: _none_
- **Primary tranche**: _none_
- **Rejection reasons**:
  - senior: expectedLoss 0.0284 > 0.02; tvlUsd 22452 < 25000000; apyBase 0.00% < 2% (reward-only positions blocked)
  - mezzanine: tvlUsd 22452 < 1000000; apyBase 0.00% < 1% (reward-only positions blocked)
  - junior: tvlUsd 22452 < 100000

### cian:6eec4d69-bcad-48b9-aa3a-31005778de19

- **Source**: cian
- **Asset**: `0xcda86a272531e8640cd7f1a92c01839911b90bb0`
- **APY (base)**: 0.44%    **APY (reward)**: 0.00%    **Total**: 0.44%
- **TVL**: $17,582
- **APY history**: vol=4.63%, drift=0.16x
- **Nansen signal**: _null_ (no key or asset not covered)
- **Probabilities**: exploit=0.03296, depeg=0.00500, oracle=0.02000, illiquid=0.05755, counterparty=0.00500
- **Expected loss**: 4.239% /yr
- **RAAPY**: -3.79%
- **Confidence**: 0.490
- **Score**: -0.0186
- **Eligible tranches**: _none_
- **Primary tranche**: _none_
- **Rejection reasons**:
  - senior: expectedLoss 0.0424 > 0.02; tvlUsd 17582 < 25000000; apyBase 0.44% < 2% (reward-only positions blocked)
  - mezzanine: expectedLoss 0.0424 > 0.04; tvlUsd 17582 < 1000000; apyBase 0.44% < 1% (reward-only positions blocked)
  - junior: tvlUsd 17582 < 100000

### mantleVault:e118b8cb-a7f6-4619-8844-791956db623b

- **Source**: mantleVault
- **Asset**: `0xcda86a272531e8640cd7f1a92c01839911b90bb0`
- **APY (base)**: 0.00%    **APY (reward)**: 0.00%    **Total**: 0.00%
- **TVL**: $14,707
- **APY history**: vol=0.00%, drift=1.00x
- **Nansen signal**: _null_ (no key or asset not covered)
- **Probabilities**: exploit=0.02320, depeg=0.00500, oracle=0.00700, illiquid=0.05832, counterparty=0.00500
- **Expected loss**: 2.893% /yr
- **RAAPY**: -2.89%
- **Confidence**: 0.700
- **Score**: -0.0202
- **Eligible tranches**: _none_
- **Primary tranche**: _none_
- **Rejection reasons**:
  - senior: expectedLoss 0.0289 > 0.02; tvlUsd 14707 < 25000000; apyBase 0.00% < 2% (reward-only positions blocked)
  - mezzanine: tvlUsd 14707 < 1000000; apyBase 0.00% < 1% (reward-only positions blocked)
  - junior: tvlUsd 14707 < 100000

### fbtc:d8733ab8-a147-4e31-a668-2c9dff24ea56

- **Source**: fbtc
- **Asset**: `0x201eba5cc46d216ce6dc03f6a759e8e766e956ae`
- **APY (base)**: 10.79%    **APY (reward)**: 2.01%    **Total**: 12.81%
- **TVL**: $14,659
- **APY history**: vol=3.32%, drift=1.20x
- **Nansen signal**: _null_ (no key or asset not covered)
- **Probabilities**: exploit=0.02320, depeg=0.00500, oracle=0.02000, illiquid=0.05834, counterparty=0.08000
- **Expected loss**: 7.164% /yr
- **RAAPY**: 3.63%
- **Confidence**: 0.489
- **Score**: 0.0178
- **Eligible tranches**: _none_
- **Primary tranche**: _none_
- **Rejection reasons**:
  - senior: expectedLoss 0.0716 > 0.02; tvlUsd 14659 < 25000000; apy 10.79% > 8% (too-good-to-be-true gate)
  - mezzanine: expectedLoss 0.0716 > 0.04; tvlUsd 14659 < 1000000
  - junior: tvlUsd 14659 < 100000

### mantleVault:edc32e93-0feb-4d38-bb73-366bb4a2aace

- **Source**: mantleVault
- **Asset**: `0xdeaddeaddeaddeaddeaddeaddeaddeaddead1111`
- **APY (base)**: 0.00%    **APY (reward)**: 0.00%    **Total**: 0.00%
- **TVL**: $10,495
- **APY history**: vol=0.00%, drift=0.96x
- **Nansen signal**: _null_ (no key or asset not covered)
- **Probabilities**: exploit=0.02363, depeg=0.00500, oracle=0.00700, illiquid=0.05979, counterparty=0.00500
- **Expected loss**: 2.938% /yr
- **RAAPY**: -2.93%
- **Confidence**: 0.700
- **Score**: -0.0205
- **Eligible tranches**: _none_
- **Primary tranche**: _none_
- **Rejection reasons**:
  - senior: expectedLoss 0.0294 > 0.02; tvlUsd 10495 < 25000000; apyBase 0.00% < 2% (reward-only positions blocked)
  - mezzanine: tvlUsd 10495 < 1000000; apyBase 0.00% < 1% (reward-only positions blocked)
  - junior: tvlUsd 10495 < 100000

### mantleVault:ae619265-65fd-4584-8934-16a66dc50af3

- **Source**: mantleVault
- **Asset**: `0x09bc4e0d864854c6afb6eb9a9cdf58ac190d0df9`
- **APY (base)**: 0.02%    **APY (reward)**: 0.00%    **Total**: 0.02%
- **TVL**: $10,373
- **APY history**: vol=0.00%, drift=1.01x
- **Nansen signal**: _null_ (no key or asset not covered)
- **Probabilities**: exploit=0.02365, depeg=0.00500, oracle=0.00700, illiquid=0.05984, counterparty=0.00500
- **Expected loss**: 2.939% /yr
- **RAAPY**: -2.92%
- **Confidence**: 0.699
- **Score**: -0.0204
- **Eligible tranches**: _none_
- **Primary tranche**: _none_
- **Rejection reasons**:
  - senior: expectedLoss 0.0294 > 0.02; tvlUsd 10373 < 25000000; apyBase 0.02% < 2% (reward-only positions blocked)
  - mezzanine: tvlUsd 10373 < 1000000; apyBase 0.02% < 1% (reward-only positions blocked)
  - junior: tvlUsd 10373 < 100000

### mantleVault:3441a15d-5f50-4a52-af27-597c182c5c4a

- **Source**: mantleVault
- **Asset**: `0x201eba5cc46d216ce6dc03f6a759e8e766e956ae`
- **APY (base)**: 0.04%    **APY (reward)**: 0.00%    **Total**: 0.04%
- **TVL**: $6,368
- **APY history**: vol=0.00%, drift=1.06x
- **Nansen signal**: _null_ (no key or asset not covered)
- **Probabilities**: exploit=0.02427, depeg=0.00500, oracle=0.00700, illiquid=0.06196, counterparty=0.00500
- **Expected loss**: 3.003% /yr
- **RAAPY**: -2.96%
- **Confidence**: 0.699
- **Score**: -0.0207
- **Eligible tranches**: _none_
- **Primary tranche**: _none_
- **Rejection reasons**:
  - senior: expectedLoss 0.0300 > 0.02; tvlUsd 6368 < 25000000; apyBase 0.04% < 2% (reward-only positions blocked)
  - mezzanine: tvlUsd 6368 < 1000000; apyBase 0.04% < 1% (reward-only positions blocked)
  - junior: tvlUsd 6368 < 100000

### mantleVault:7be673f4-8b41-4d3f-a533-45d20d62e8fa

- **Source**: mantleVault
- **Asset**: `0xcabae6f6ea1ecab08ad02fe02ce9a44f09aebfa2`
- **APY (base)**: 0.71%    **APY (reward)**: 0.02%    **Total**: 0.74%
- **TVL**: $5,896
- **APY history**: vol=0.22%, drift=2.67x
- **Nansen signal**: _null_ (no key or asset not covered)
- **Probabilities**: exploit=0.02437, depeg=0.00500, oracle=0.00700, illiquid=0.06229, counterparty=0.00500
- **Expected loss**: 3.013% /yr
- **RAAPY**: -2.30%
- **Confidence**: 0.490
- **Score**: -0.0113
- **Eligible tranches**: _none_
- **Primary tranche**: _none_
- **Rejection reasons**:
  - senior: expectedLoss 0.0301 > 0.02; tvlUsd 5896 < 25000000; apyBase 0.71% < 2% (reward-only positions blocked)
  - mezzanine: tvlUsd 5896 < 1000000; apyBase 0.71% < 1% (reward-only positions blocked)
  - junior: tvlUsd 5896 < 100000

### mantleVault:f7150467-f302-41e8-9f9a-1f73d2b49df4

- **Source**: mantleVault
- **Asset**: `0x5d3a1ff2b6bab83b63cd9ad0787074081a52ef34`
- **APY (base)**: 49.21%    **APY (reward)**: 0.54%    **Total**: 49.75%
- **TVL**: $3,146
- **APY history**: vol=19.39%, drift=119.43x
- **Nansen signal**: _null_ (no key or asset not covered)
- **Probabilities**: exploit=0.02518, depeg=0.00500, oracle=0.00700, illiquid=0.06502, counterparty=0.00500
- **Expected loss**: 3.095% /yr
- **RAAPY**: 46.11%
- **Confidence**: 0.343
- **Score**: 0.1579
- **Eligible tranches**: _none_
- **Primary tranche**: _none_
- **Rejection reasons**:
  - senior: expectedLoss 0.0310 > 0.02; tvlUsd 3146 < 25000000; apy 49.21% > 8% (too-good-to-be-true gate)
  - mezzanine: tvlUsd 3146 < 1000000; apy 49.21% > 20% (too-good-to-be-true gate)
  - junior: tvlUsd 3146 < 100000

### mantleVault:4f9047f1-ca9f-4b30-b5ad-c7a900c38cae

- **Source**: mantleVault
- **Asset**: `0xdeaddeaddeaddeaddeaddeaddeaddeaddead1111`
- **APY (base)**: 43.35%    **APY (reward)**: 1.50%    **Total**: 44.85%
- **TVL**: $2,944
- **APY history**: vol=30.24%, drift=3.69x
- **Nansen signal**: _null_ (no key or asset not covered)
- **Probabilities**: exploit=0.02527, depeg=0.00500, oracle=0.00700, illiquid=0.06531, counterparty=0.00500
- **Expected loss**: 3.104% /yr
- **RAAPY**: 40.25%
- **Confidence**: 0.343
- **Score**: 0.1380
- **Eligible tranches**: _none_
- **Primary tranche**: _none_
- **Rejection reasons**:
  - senior: expectedLoss 0.0310 > 0.02; tvlUsd 2944 < 25000000; apy 43.35% > 8% (too-good-to-be-true gate)
  - mezzanine: tvlUsd 2944 < 1000000; apy 43.35% > 20% (too-good-to-be-true gate)
  - junior: tvlUsd 2944 < 100000

### mantleVault:a5a47cdc-2ca5-4348-ade9-4adddb1d12d5

- **Source**: mantleVault
- **Asset**: `0xe6829d9a7ee3040e1276fa75293bde931859e8fa`
- **APY (base)**: 0.02%    **APY (reward)**: 0.00%    **Total**: 0.02%
- **TVL**: $2,313
- **APY history**: vol=0.00%, drift=1.04x
- **Nansen signal**: _null_ (no key or asset not covered)
- **Probabilities**: exploit=0.02558, depeg=0.00500, oracle=0.00700, illiquid=0.06636, counterparty=0.00500
- **Expected loss**: 3.136% /yr
- **RAAPY**: -3.11%
- **Confidence**: 0.700
- **Score**: -0.0218
- **Eligible tranches**: _none_
- **Primary tranche**: _none_
- **Rejection reasons**:
  - senior: expectedLoss 0.0314 > 0.02; tvlUsd 2313 < 25000000; apyBase 0.02% < 2% (reward-only positions blocked)
  - mezzanine: tvlUsd 2313 < 1000000; apyBase 0.02% < 1% (reward-only positions blocked)
  - junior: tvlUsd 2313 < 100000

### mantleVault:dce58852-9976-4141-b26a-a832c5edc34e

- **Source**: mantleVault
- **Asset**: `0x201eba5cc46d216ce6dc03f6a759e8e766e956ae`
- **APY (base)**: 50.97%    **APY (reward)**: 1.47%    **Total**: 52.45%
- **TVL**: $2,134
- **APY history**: vol=22.48%, drift=3.55x
- **Nansen signal**: _null_ (no key or asset not covered)
- **Probabilities**: exploit=0.02568, depeg=0.00500, oracle=0.00700, illiquid=0.06671, counterparty=0.00500
- **Expected loss**: 3.146% /yr
- **RAAPY**: 47.82%
- **Confidence**: 0.342
- **Score**: 0.1638
- **Eligible tranches**: _none_
- **Primary tranche**: _none_
- **Rejection reasons**:
  - senior: expectedLoss 0.0315 > 0.02; tvlUsd 2134 < 25000000; apy 50.97% > 8% (too-good-to-be-true gate)
  - mezzanine: tvlUsd 2134 < 1000000; apy 50.97% > 20% (too-good-to-be-true gate)
  - junior: tvlUsd 2134 < 100000

### mantleVault:f988235b-39ab-43b4-a0e9-5ce2cd1924cb

- **Source**: mantleVault
- **Asset**: `0x00000000efe302beaa2b3e6e1b18d08d69a9012a`
- **APY (base)**: 398.39%    **APY (reward)**: 35.75%    **Total**: 434.13%
- **TVL**: $857
- **APY history**: vol=109.89%, drift=5.85x
- **Nansen signal**: _null_ (no key or asset not covered)
- **Probabilities**: exploit=0.02685, depeg=0.00500, oracle=0.00700, illiquid=0.07067, counterparty=0.00500
- **Expected loss**: 3.266% /yr
- **RAAPY**: 395.12%
- **Confidence**: 0.343
- **Score**: 1.3545
- **Eligible tranches**: _none_
- **Primary tranche**: _none_
- **Rejection reasons**:
  - senior: expectedLoss 0.0327 > 0.02; tvlUsd 857 < 25000000; apy 398.39% > 8% (too-good-to-be-true gate)
  - mezzanine: tvlUsd 857 < 1000000; apy 398.39% > 20% (too-good-to-be-true gate)
  - junior: tvlUsd 857 < 100000

### mantleVault:46cbb5d7-5462-443b-886a-f371349a5d8c

- **Source**: mantleVault
- **Asset**: `0x5be26527e817998a7206475496fde1e68957c5a6`
- **APY (base)**: 1.17%    **APY (reward)**: 0.00%    **Total**: 1.17%
- **TVL**: $822
- **APY history**: vol=0.49%, drift=9.96x
- **Nansen signal**: _null_ (no key or asset not covered)
- **Probabilities**: exploit=0.02691, depeg=0.00500, oracle=0.00700, illiquid=0.07085, counterparty=0.00500
- **Expected loss**: 3.271% /yr
- **RAAPY**: -2.10%
- **Confidence**: 0.490
- **Score**: -0.0103
- **Eligible tranches**: _none_
- **Primary tranche**: _none_
- **Rejection reasons**:
  - senior: expectedLoss 0.0327 > 0.02; tvlUsd 822 < 25000000; apyBase 1.17% < 2% (reward-only positions blocked)
  - mezzanine: tvlUsd 822 < 1000000
  - junior: tvlUsd 822 < 100000

### fbtc:c5f53253-269e-4b61-a9b8-b9b76cfa8480

- **Source**: fbtc
- **Asset**: `0x201eba5cc46d216ce6dc03f6a759e8e766e956ae`
- **APY (base)**: 0.00%    **APY (reward)**: 0.00%    **Total**: 0.00%
- **TVL**: $124
- **APY history**: vol=7.34%, drift=0.00x
- **Nansen signal**: _null_ (no key or asset not covered)
- **Probabilities**: exploit=0.02934, depeg=0.00500, oracle=0.02000, illiquid=0.07907, counterparty=0.08000
- **Expected loss**: 7.789% /yr
- **RAAPY**: -7.79%
- **Confidence**: 0.489
- **Score**: -0.0381
- **Eligible tranches**: _none_
- **Primary tranche**: _none_
- **Rejection reasons**:
  - senior: expectedLoss 0.0779 > 0.02; tvlUsd 124 < 25000000; apyBase 0.00% < 2% (reward-only positions blocked)
  - mezzanine: expectedLoss 0.0779 > 0.04; tvlUsd 124 < 1000000; apyBase 0.00% < 1% (reward-only positions blocked)
  - junior: tvlUsd 124 < 100000

### mantleVault:c91016e0-d075-4bb4-a1c7-465f1c11dc14

- **Source**: mantleVault
- **Asset**: `0x211cc4dd073734da055fbf44a2b4667d5e5fe5d2`
- **APY (base)**: 0.00%    **APY (reward)**: 7.62%    **Total**: 7.62%
- **TVL**: $26
- **APY history**: vol=0.00%, drift=1.00x
- **Nansen signal**: _null_ (no key or asset not covered)
- **Probabilities**: exploit=0.03135, depeg=0.00500, oracle=0.00700, illiquid=0.08585, counterparty=0.00500
- **Expected loss**: 3.724% /yr
- **RAAPY**: -3.72%
- **Confidence**: 0.700
- **Score**: -0.0261
- **Eligible tranches**: _none_
- **Primary tranche**: _none_
- **Rejection reasons**:
  - senior: expectedLoss 0.0372 > 0.02; tvlUsd 26 < 25000000; apyBase 0.00% < 2% (reward-only positions blocked)
  - mezzanine: tvlUsd 26 < 1000000; apyBase 0.00% < 1% (reward-only positions blocked)
  - junior: tvlUsd 26 < 100000

### mantleVault:341123b4-b690-4d10-b2f8-b8fa64119220

- **Source**: mantleVault
- **Asset**: `0x09bc4e0d864854c6afb6eb9a9cdf58ac190d0df9`
- **APY (base)**: 70.38%    **APY (reward)**: 1.21%    **Total**: 71.59%
- **TVL**: $3
- **APY history**: vol=29.69%, drift=7.26x
- **Nansen signal**: _null_ (no key or asset not covered)
- **Probabilities**: exploit=0.03413, depeg=0.00500, oracle=0.00700, illiquid=0.09523, counterparty=0.00500
- **Expected loss**: 4.007% /yr
- **RAAPY**: 66.37%
- **Confidence**: 0.343
- **Score**: 0.2273
- **Eligible tranches**: _none_
- **Primary tranche**: _none_
- **Rejection reasons**:
  - senior: expectedLoss 0.0401 > 0.02; tvlUsd 3 < 25000000; apy 70.38% > 8% (too-good-to-be-true gate)
  - mezzanine: expectedLoss 0.0401 > 0.04; tvlUsd 3 < 1000000; apy 70.38% > 20% (too-good-to-be-true gate)
  - junior: tvlUsd 3 < 100000

### fbtc:098dd57e-f57a-4715-b408-65472b61afe8

- **Source**: fbtc
- **Asset**: `0x201eba5cc46d216ce6dc03f6a759e8e766e956ae`
- **APY (base)**: 17.50%    **APY (reward)**: 0.00%    **Total**: 17.50%
- **TVL**: $0
- **APY history**: no history available
- **Nansen signal**: _null_ (no key or asset not covered)
- **Probabilities**: exploit=0.03554, depeg=0.00500, oracle=0.02000, illiquid=0.10000, counterparty=0.08000
- **Expected loss**: 8.421% /yr
- **RAAPY**: 9.08%
- **Confidence**: 0.499
- **Score**: 0.0453
- **Eligible tranches**: _none_
- **Primary tranche**: _none_
- **Rejection reasons**:
  - senior: expectedLoss 0.0842 > 0.02; tvlUsd 0 < 25000000; apy 17.50% > 8% (too-good-to-be-true gate)
  - mezzanine: expectedLoss 0.0842 > 0.04; tvlUsd 0 < 1000000
  - junior: tvlUsd 0 < 100000

### fbtc:df8d41a4-23cf-4276-8bb9-f49e0939fe97

- **Source**: fbtc
- **Asset**: `0x09bc4e0d864854c6afb6eb9a9cdf58ac190d0df9`
- **APY (base)**: 10.00%    **APY (reward)**: 0.00%    **Total**: 10.00%
- **TVL**: $0
- **APY history**: no history available
- **Nansen signal**: _null_ (no key or asset not covered)
- **Probabilities**: exploit=0.03554, depeg=0.00500, oracle=0.02000, illiquid=0.10000, counterparty=0.08000
- **Expected loss**: 8.421% /yr
- **RAAPY**: 1.58%
- **Confidence**: 0.499
- **Score**: 0.0079
- **Eligible tranches**: _none_
- **Primary tranche**: _none_
- **Rejection reasons**:
  - senior: expectedLoss 0.0842 > 0.02; tvlUsd 0 < 25000000; apy 10.00% > 8% (too-good-to-be-true gate)
  - mezzanine: expectedLoss 0.0842 > 0.04; tvlUsd 0 < 1000000
  - junior: tvlUsd 0 < 100000

### fbtc:8952653d-b613-4610-acaa-3df8a2466a0b

- **Source**: fbtc
- **Asset**: `0x201eba5cc46d216ce6dc03f6a759e8e766e956ae`
- **APY (base)**: 13.00%    **APY (reward)**: 0.00%    **Total**: 13.00%
- **TVL**: $0
- **APY history**: no history available
- **Nansen signal**: _null_ (no key or asset not covered)
- **Probabilities**: exploit=0.03554, depeg=0.00500, oracle=0.02000, illiquid=0.10000, counterparty=0.08000
- **Expected loss**: 8.421% /yr
- **RAAPY**: 4.58%
- **Confidence**: 0.499
- **Score**: 0.0229
- **Eligible tranches**: _none_
- **Primary tranche**: _none_
- **Rejection reasons**:
  - senior: expectedLoss 0.0842 > 0.02; tvlUsd 0 < 25000000; apy 13.00% > 8% (too-good-to-be-true gate)
  - mezzanine: expectedLoss 0.0842 > 0.04; tvlUsd 0 < 1000000
  - junior: tvlUsd 0 < 100000

### fbtc:0fada348-2868-4f64-bc63-39473133aa59

- **Source**: fbtc
- **Asset**: `0x201eba5cc46d216ce6dc03f6a759e8e766e956ae`
- **APY (base)**: 15.00%    **APY (reward)**: 0.00%    **Total**: 15.00%
- **TVL**: $0
- **APY history**: no history available
- **Nansen signal**: _null_ (no key or asset not covered)
- **Probabilities**: exploit=0.03554, depeg=0.00500, oracle=0.02000, illiquid=0.10000, counterparty=0.08000
- **Expected loss**: 8.421% /yr
- **RAAPY**: 6.58%
- **Confidence**: 0.499
- **Score**: 0.0328
- **Eligible tranches**: _none_
- **Primary tranche**: _none_
- **Rejection reasons**:
  - senior: expectedLoss 0.0842 > 0.02; tvlUsd 0 < 25000000; apy 15.00% > 8% (too-good-to-be-true gate)
  - mezzanine: expectedLoss 0.0842 > 0.04; tvlUsd 0 < 1000000
  - junior: tvlUsd 0 < 100000

### fbtc:3f061e97-8cc5-4ddc-a791-a11d449c022b

- **Source**: fbtc
- **Asset**: `0x09bc4e0d864854c6afb6eb9a9cdf58ac190d0df9`
- **APY (base)**: 10.00%    **APY (reward)**: 0.00%    **Total**: 10.00%
- **TVL**: $0
- **APY history**: no history available
- **Nansen signal**: _null_ (no key or asset not covered)
- **Probabilities**: exploit=0.03554, depeg=0.00500, oracle=0.02000, illiquid=0.10000, counterparty=0.08000
- **Expected loss**: 8.421% /yr
- **RAAPY**: 1.58%
- **Confidence**: 0.499
- **Score**: 0.0079
- **Eligible tranches**: _none_
- **Primary tranche**: _none_
- **Rejection reasons**:
  - senior: expectedLoss 0.0842 > 0.02; tvlUsd 0 < 25000000; apy 10.00% > 8% (too-good-to-be-true gate)
  - mezzanine: expectedLoss 0.0842 > 0.04; tvlUsd 0 < 1000000
  - junior: tvlUsd 0 < 100000

### fbtc:edbe8cf2-8d94-4126-b775-0d7d45cc4a23

- **Source**: fbtc
- **Asset**: `0x201eba5cc46d216ce6dc03f6a759e8e766e956ae`
- **APY (base)**: 13.00%    **APY (reward)**: 0.00%    **Total**: 13.00%
- **TVL**: $0
- **APY history**: vol=0.44%, drift=1.01x
- **Nansen signal**: _null_ (no key or asset not covered)
- **Probabilities**: exploit=0.03554, depeg=0.00500, oracle=0.02000, illiquid=0.10000, counterparty=0.08000
- **Expected loss**: 8.421% /yr
- **RAAPY**: 4.58%
- **Confidence**: 0.699
- **Score**: 0.0320
- **Eligible tranches**: _none_
- **Primary tranche**: _none_
- **Rejection reasons**:
  - senior: expectedLoss 0.0842 > 0.02; tvlUsd 0 < 25000000; apy 13.00% > 8% (too-good-to-be-true gate)
  - mezzanine: expectedLoss 0.0842 > 0.04; tvlUsd 0 < 1000000
  - junior: tvlUsd 0 < 100000

### fbtc:8ddf841e-5849-4bca-b291-374b600be6e4

- **Source**: fbtc
- **Asset**: `0x201eba5cc46d216ce6dc03f6a759e8e766e956ae`
- **APY (base)**: 10.00%    **APY (reward)**: 0.00%    **Total**: 10.00%
- **TVL**: $0
- **APY history**: no history available
- **Nansen signal**: _null_ (no key or asset not covered)
- **Probabilities**: exploit=0.03554, depeg=0.00500, oracle=0.02000, illiquid=0.10000, counterparty=0.08000
- **Expected loss**: 8.421% /yr
- **RAAPY**: 1.58%
- **Confidence**: 0.499
- **Score**: 0.0079
- **Eligible tranches**: _none_
- **Primary tranche**: _none_
- **Rejection reasons**:
  - senior: expectedLoss 0.0842 > 0.02; tvlUsd 0 < 25000000; apy 10.00% > 8% (too-good-to-be-true gate)
  - mezzanine: expectedLoss 0.0842 > 0.04; tvlUsd 0 < 1000000
  - junior: tvlUsd 0 < 100000

### fbtc:b283d8ef-8342-4932-a345-155be63c6f84

- **Source**: fbtc
- **Asset**: `0x09bc4e0d864854c6afb6eb9a9cdf58ac190d0df9`
- **APY (base)**: 9.75%    **APY (reward)**: 0.00%    **Total**: 9.75%
- **TVL**: $0
- **APY history**: no history available
- **Nansen signal**: _null_ (no key or asset not covered)
- **Probabilities**: exploit=0.03554, depeg=0.00500, oracle=0.02000, illiquid=0.10000, counterparty=0.08000
- **Expected loss**: 8.421% /yr
- **RAAPY**: 1.33%
- **Confidence**: 0.499
- **Score**: 0.0066
- **Eligible tranches**: _none_
- **Primary tranche**: _none_
- **Rejection reasons**:
  - senior: expectedLoss 0.0842 > 0.02; tvlUsd 0 < 25000000; apy 9.75% > 8% (too-good-to-be-true gate)
  - mezzanine: expectedLoss 0.0842 > 0.04; tvlUsd 0 < 1000000
  - junior: tvlUsd 0 < 100000

### aave:125974d5-ad17-4a3a-b967-ebbf721fca22

- **Source**: aave
- **Asset**: `0xfc421ad3c883bf9e7c4f42de845c4e4405799e73`
- **APY (base)**: 2.12%    **APY (reward)**: 4.40%    **Total**: 6.51%
- **TVL**: $0
- **APY history**: vol=4.17%, drift=0.95x
- **Nansen signal**: _null_ (no key or asset not covered)
- **Probabilities**: exploit=0.00276, depeg=0.00500, oracle=0.00200, illiquid=0.10000, counterparty=0.00500
- **Expected loss**: 1.165% /yr
- **RAAPY**: 0.95%
- **Confidence**: 0.490
- **Score**: 0.0047
- **Eligible tranches**: _none_
- **Primary tranche**: _none_
- **Rejection reasons**:
  - senior: tvlUsd 0 < 25000000
  - mezzanine: tvlUsd 0 < 1000000
  - junior: tvlUsd 0 < 100000

### mantleVault:1362a09f-4853-492b-8083-34e0df20e17b

- **Source**: mantleVault
- **Asset**: `0xc96de26018a54d51c097160568752c4e3bd6c364`
- **APY (base)**: 0.00%    **APY (reward)**: 0.00%    **Total**: 0.00%
- **TVL**: $0
- **APY history**: vol=0.00%, drift=1.01x
- **Nansen signal**: _null_ (no key or asset not covered)
- **Probabilities**: exploit=0.03554, depeg=0.00500, oracle=0.00700, illiquid=0.10000, counterparty=0.00500
- **Expected loss**: 4.151% /yr
- **RAAPY**: -4.15%
- **Confidence**: 0.700
- **Score**: -0.0290
- **Eligible tranches**: _none_
- **Primary tranche**: _none_
- **Rejection reasons**:
  - senior: expectedLoss 0.0415 > 0.02; tvlUsd 0 < 25000000; apyBase 0.00% < 2% (reward-only positions blocked)
  - mezzanine: expectedLoss 0.0415 > 0.04; tvlUsd 0 < 1000000; apyBase 0.00% < 1% (reward-only positions blocked)
  - junior: tvlUsd 0 < 100000

## Signed canonical Yield Map

```json
{
  "version": "1.0",
  "publishedAtMs": 1779306915299,
  "publisher": {
    "address": "0x034d6c95d1a1D3abaBBe2FFD7cAb5970517A065c",
    "identityNFT": "dry-run"
  },
  "methodologyHash": "0xdddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd",
  "codeCommit": "dry-run-inspect",
  "sourcesQueried": [],
  "sourcesDegraded": [],
  "opportunities": [
    {
      "id": "aave:a4e37545-203b-4412-9acd-3e8b1aa4d744",
      "source": "aave",
      "asset": "0x211cc4dd073734da055fbf44a2b4667d5e5fe5d2",
      "apy": 0,
      "apyReward": 0.04,
      "apyType": "variable",
      "tvlUsd": 63883998,
      "lastUpdatedMs": 1779306914842,
      "raw": {
        "chain": "Mantle",
        "project": "aave-v3",
        "symbol": "SUSDE",
        "underlyingTokens": [
          "0x211Cc4DD073734dA055fbF44a2b4667d5E5fE5d2"
        ],
        "apy": 4,
        "apyBase": 0,
        "apyReward": 4,
        "tvlUsd": 63883998,
        "pool": "a4e37545-203b-4412-9acd-3e8b1aa4d744"
      },
      "risk": {
        "contractAgeDays": 700,
        "auditFactor": 0.3,
        "tvlFactor": null,
        "depegEvents": [],
        "oracleType": "chainlink_dec",
        "liquiditySlippageBps": null,
        "counterpartyClass": "permissionless",
        "smartMoneySignal": null,
        "apyVolatility": 0,
        "apyDrift": 1
      },
      "probabilities": {
        "exploit": 0.0009658749639019247,
        "depeg": 0.005,
        "oracle": 0.002,
        "illiquid": 0.021946079125866783,
        "counterparty": 0.005
      },
      "severities": {
        "exploit": 0.85,
        "depeg": 0.2,
        "oracle": 0.4,
        "illiquid": 0.05,
        "counterparty": 0.5
      },
      "expectedLoss": 0.006218297675609975,
      "raapy": -0.006218297675609975,
      "confidence": 0.6999393359621462,
      "score": -0.004352431145881404,
      "eligibleTranches": [
        "junior"
      ],
      "primaryTranche": "junior",
      "rejectionReasons": [
        {
          "tranche": "senior",
          "reasons": [
            "apyBase 0.00% < 2% (reward-only positions blocked)"
          ]
        },
        {
          "tranche": "mezzanine",
          "reasons": [
            "apyBase 0.00% < 1% (reward-only positions blocked)"
          ]
        }
      ]
    },
    {
      "id": "ondo:b5d7a190-38d2-4fdd-8c14-1fd00c11bce1",
      "source": "ondo",
      "asset": "0x5be26527e817998a7206475496fde1e68957c5a6",
      "apy": 0.0355,
      "apyReward": 0,
      "apyType": "variable",
      "tvlUsd": 29444317,
      "lastUpdatedMs": 1779306914842,
      "raw": {
        "chain": "Mantle",
        "project": "ondo-yield-assets",
        "symbol": "USDY",
        "underlyingTokens": [
          "0x5be26527e817998a7206475496fde1e68957c5a6"
        ],
        "apy": 3.55,
        "apyBase": 3.55,
        "apyReward": null,
        "tvlUsd": 29444317,
        "pool": "b5d7a190-38d2-4fdd-8c14-1fd00c11bce1"
      },
      "risk": {
        "contractAgeDays": 730,
        "auditFactor": 0.3,
        "tvlFactor": null,
        "depegEvents": [],
        "oracleType": "chainlink_dec",
        "liquiditySlippageBps": null,
        "counterpartyClass": "attested_centralized",
        "smartMoneySignal": null,
        "apyVolatility": 0.00010599978800063698,
        "apyDrift": 0.9985935302390987
      },
      "probabilities": {
        "exploit": 0.0008831633608151709,
        "depeg": 0.005,
        "oracle": 0.002,
        "illiquid": 0.0253099851526421,
        "counterparty": 0.03
      },
      "severities": {
        "exploit": 0.85,
        "depeg": 0.2,
        "oracle": 0.4,
        "illiquid": 0.05,
        "counterparty": 0.5
      },
      "expectedLoss": 0.018816188114325,
      "raapy": 0.016683811885675,
      "confidence": 0.6996734095437002,
      "score": 0.011673219546235935,
      "eligibleTranches": [
        "senior",
        "mezzanine",
        "junior"
      ],
      "primaryTranche": "senior",
      "rejectionReasons": []
    },
    {
      "id": "aave:47da0cdd-7b1d-4927-9545-20b53b73afa8",
      "source": "aave",
      "asset": "0x779ded0c9e1022225f8e0630b35a9b54be713736",
      "apy": 0.0314917,
      "apyReward": 0.0293008,
      "apyType": "variable",
      "tvlUsd": 19363509,
      "lastUpdatedMs": 1779306914842,
      "raw": {
        "chain": "Mantle",
        "project": "aave-v3",
        "symbol": "USDT0",
        "underlyingTokens": [
          "0x779Ded0c9e1022225f8E0630b35a9b54bE713736"
        ],
        "apy": 6.07926,
        "apyBase": 3.14917,
        "apyReward": 2.93008,
        "tvlUsd": 19363509,
        "pool": "47da0cdd-7b1d-4927-9545-20b53b73afa8"
      },
      "risk": {
        "contractAgeDays": 700,
        "auditFactor": 0.3,
        "tvlFactor": null,
        "depegEvents": [],
        "oracleType": "chainlink_dec",
        "liquiditySlippageBps": null,
        "counterpartyClass": "permissionless",
        "smartMoneySignal": null,
        "apyVolatility": 0.026457301472066194,
        "apyDrift": 0.7578453045727985
      },
      "probabilities": {
        "exploit": 0.0010852466295124025,
        "depeg": 0.005,
        "oracle": 0.002,
        "illiquid": 0.027130159382855457,
        "counterparty": 0.005
      },
      "severities": {
        "exploit": 0.85,
        "depeg": 0.2,
        "oracle": 0.4,
        "illiquid": 0.05,
        "counterparty": 0.5
      },
      "expectedLoss": 0.006578967604228315,
      "raapy": 0.024912732395771683,
      "confidence": 0.6996710773028887,
      "score": 0.017430718313908147,
      "eligibleTranches": [
        "mezzanine",
        "junior"
      ],
      "primaryTranche": "mezzanine",
      "rejectionReasons": [
        {
          "tranche": "senior",
          "reasons": [
            "tvlUsd 19363509 < 25000000"
          ]
        }
      ]
    },
    {
      "id": "aave:76b70b33-d8a4-4e61-8092-9bd1f2be2fc9",
      "source": "aave",
      "asset": "0x5d3a1ff2b6bab83b63cd9ad0787074081a52ef34",
      "apy": 0.0028000000000000004,
      "apyReward": 0.04,
      "apyType": "variable",
      "tvlUsd": 5862590,
      "lastUpdatedMs": 1779306914842,
      "raw": {
        "chain": "Mantle",
        "project": "aave-v3",
        "symbol": "USDE",
        "underlyingTokens": [
          "0x5d3a1Ff2b6BAb83b63cd9AD0787074081a52ef34"
        ],
        "apy": 4.28,
        "apyBase": 0.28,
        "apyReward": 4,
        "tvlUsd": 5862590,
        "pool": "76b70b33-d8a4-4e61-8092-9bd1f2be2fc9"
      },
      "risk": {
        "contractAgeDays": 700,
        "auditFactor": 0.3,
        "tvlFactor": null,
        "depegEvents": [],
        "oracleType": "chainlink_dec",
        "liquiditySlippageBps": null,
        "counterpartyClass": "permissionless",
        "smartMoneySignal": null,
        "apyVolatility": 0.03212299270423797,
        "apyDrift": 42.93405938369027
      },
      "probabilities": {
        "exploit": 0.0012047303224845987,
        "depeg": 0.005,
        "oracle": 0.002,
        "illiquid": 0.03231910477120639,
        "counterparty": 0.005
      },
      "severities": {
        "exploit": 0.85,
        "depeg": 0.2,
        "oracle": 0.4,
        "illiquid": 0.05,
        "counterparty": 0.5
      },
      "expectedLoss": 0.006939976012672228,
      "raapy": -0.004139976012672228,
      "confidence": 0.3425064354517626,
      "score": -0.001417968426956166,
      "eligibleTranches": [
        "junior"
      ],
      "primaryTranche": "junior",
      "rejectionReasons": [
        {
          "tranche": "senior",
          "reasons": [
            "tvlUsd 5862590 < 25000000",
            "apyBase 0.28% < 2% (reward-only positions blocked)"
          ]
        },
        {
          "tranche": "mezzanine",
          "reasons": [
            "apyBase 0.28% < 1% (reward-only positions blocked)"
          ]
        }
      ]
    },
    {
      "id": "aave:32cb38a5-b9b9-441a-bf07-8fab47b999d3",
      "source": "aave",
      "asset": "0x09bc4e0d864854c6afb6eb9a9cdf58ac190d0df9",
      "apy": 0.024489200000000003,
      "apyReward": 0.0526267,
      "apyType": "variable",
      "tvlUsd": 2868113,
      "lastUpdatedMs": 1779306914842,
      "raw": {
        "chain": "Mantle",
        "project": "aave-v3",
        "symbol": "USDC",
        "underlyingTokens": [
          "0x09Bc4E0D864854c6aFB6eB9A9cdF58aC190D0dF9"
        ],
        "apy": 7.71159,
        "apyBase": 2.44892,
        "apyReward": 5.26267,
        "tvlUsd": 2868113,
        "pool": "32cb38a5-b9b9-441a-bf07-8fab47b999d3"
      },
      "risk": {
        "contractAgeDays": 700,
        "auditFactor": 0.3,
        "tvlFactor": null,
        "depegEvents": [],
        "oracleType": "chainlink_dec",
        "liquiditySlippageBps": null,
        "counterpartyClass": "permissionless",
        "smartMoneySignal": null,
        "apyVolatility": 0.03353681367510239,
        "apyDrift": 0.725340099559253
      },
      "probabilities": {
        "exploit": 0.0012762263186000503,
        "depeg": 0.005,
        "oracle": 0.002,
        "illiquid": 0.035424037420175955,
        "counterparty": 0.005
      },
      "severities": {
        "exploit": 0.85,
        "depeg": 0.2,
        "oracle": 0.4,
        "illiquid": 0.05,
        "counterparty": 0.5
      },
      "expectedLoss": 0.00715599424181884,
      "raapy": 0.01733320575818116,
      "confidence": 0.48929816976515755,
      "score": 0.008481105853640931,
      "eligibleTranches": [
        "mezzanine",
        "junior"
      ],
      "primaryTranche": "mezzanine",
      "rejectionReasons": [
        {
          "tranche": "senior",
          "reasons": [
            "tvlUsd 2868113 < 25000000"
          ]
        }
      ]
    },
    {
      "id": "agni:35f2103d-231b-443b-952e-d2cd118d8f29",
      "source": "agni",
      "asset": "0x779ded0c9e1022225f8e0630b35a9b54be713736",
      "apy": 0.4624451,
      "apyReward": 0,
      "apyType": "variable",
      "tvlUsd": 1752765,
      "lastUpdatedMs": 1779306914842,
      "raw": {
        "chain": "Mantle",
        "project": "fluxion-network",
        "symbol": "USDT0-BSB",
        "underlyingTokens": [
          "0x779ded0c9e1022225f8e0630b35a9b54be713736",
          "0xe5c330addf7aa9c7838da836436142c56a15aa95"
        ],
        "apy": 46.24451,
        "apyBase": 46.24451,
        "apyReward": null,
        "tvlUsd": 1752765,
        "pool": "35f2103d-231b-443b-952e-d2cd118d8f29"
      },
      "risk": {
        "contractAgeDays": 540,
        "auditFactor": 0.6,
        "tvlFactor": null,
        "depegEvents": [],
        "oracleType": "redstone",
        "liquiditySlippageBps": null,
        "counterpartyClass": "permissionless",
        "smartMoneySignal": null,
        "apyVolatility": 0.6181358083858305,
        "apyDrift": 1.3946852106657823
      },
      "probabilities": {
        "exploit": 0.006448232746535065,
        "depeg": 0.005,
        "oracle": 0.007,
        "illiquid": 0.03756276307548349,
        "counterparty": 0.005
      },
      "severities": {
        "exploit": 0.85,
        "depeg": 0.2,
        "oracle": 0.4,
        "illiquid": 0.05,
        "counterparty": 0.5
      },
      "expectedLoss": 0.013659135988328982,
      "raapy": 0.44878596401167103,
      "confidence": 0.48977138668059006,
      "score": 0.2198025239167815,
      "eligibleTranches": [
        "junior"
      ],
      "primaryTranche": "junior",
      "rejectionReasons": [
        {
          "tranche": "senior",
          "reasons": [
            "tvlUsd 1752765 < 25000000",
            "apy 46.24% > 8% (too-good-to-be-true gate)"
          ]
        },
        {
          "tranche": "mezzanine",
          "reasons": [
            "apy 46.24% > 20% (too-good-to-be-true gate)"
          ]
        }
      ]
    },
    {
      "id": "agni:85407ecd-f711-4fa6-9328-3078aebfaa95",
      "source": "agni",
      "asset": "0x55b9f84605b30df9bb9d817a6900219f25218157",
      "apy": 0.12265359999999999,
      "apyReward": 0,
      "apyType": "variable",
      "tvlUsd": 808798,
      "lastUpdatedMs": 1779306914842,
      "raw": {
        "chain": "Mantle",
        "project": "fluxion-network",
        "symbol": "BILL-USDT0",
        "underlyingTokens": [
          "0x55b9f84605b30df9bb9d817a6900219f25218157",
          "0x779ded0c9e1022225f8e0630b35a9b54be713736"
        ],
        "apy": 12.26536,
        "apyBase": 12.26536,
        "apyReward": null,
        "tvlUsd": 808798,
        "pool": "85407ecd-f711-4fa6-9328-3078aebfaa95"
      },
      "risk": {
        "contractAgeDays": 540,
        "auditFactor": 0.6,
        "tvlFactor": null,
        "depegEvents": [],
        "oracleType": "redstone",
        "liquiditySlippageBps": null,
        "counterpartyClass": "permissionless",
        "smartMoneySignal": null,
        "apyVolatility": null,
        "apyDrift": null
      },
      "probabilities": {
        "exploit": 0.006824492617717289,
        "depeg": 0.005,
        "oracle": 0.007,
        "illiquid": 0.04092159931341435,
        "counterparty": 0.005
      },
      "severities": {
        "exploit": 0.85,
        "depeg": 0.2,
        "oracle": 0.4,
        "illiquid": 0.05,
        "counterparty": 0.5
      },
      "expectedLoss": 0.014146898690730415,
      "raapy": 0.10850670130926957,
      "confidence": 0.4997650552163491,
      "score": 0.054227857571171004,
      "eligibleTranches": [
        "junior"
      ],
      "primaryTranche": "junior",
      "rejectionReasons": [
        {
          "tranche": "senior",
          "reasons": [
            "tvlUsd 808798 < 25000000",
            "apy 12.27% > 8% (too-good-to-be-true gate)"
          ]
        },
        {
          "tranche": "mezzanine",
          "reasons": [
            "tvlUsd 808798 < 1000000"
          ]
        }
      ]
    },
    {
      "id": "agni:6d76a4e2-57f2-4190-a882-bd69f6ea32fb",
      "source": "agni",
      "asset": "0x45db70e1c808dae42f9c4dfea74ba5e6a113bdc1",
      "apy": 0.0335772,
      "apyReward": 0,
      "apyType": "variable",
      "tvlUsd": 423182,
      "lastUpdatedMs": 1779306914842,
      "raw": {
        "chain": "Mantle",
        "project": "fluxion-network",
        "symbol": "OPG-USDT0",
        "underlyingTokens": [
          "0x45db70e1c808dae42f9c4dfea74ba5e6a113bdc1",
          "0x779ded0c9e1022225f8e0630b35a9b54be713736"
        ],
        "apy": 3.35772,
        "apyBase": 3.35772,
        "apyReward": null,
        "tvlUsd": 423182,
        "pool": "6d76a4e2-57f2-4190-a882-bd69f6ea32fb"
      },
      "risk": {
        "contractAgeDays": 540,
        "auditFactor": 0.6,
        "tvlFactor": null,
        "depegEvents": [],
        "oracleType": "redstone",
        "liquiditySlippageBps": null,
        "counterpartyClass": "permissionless",
        "smartMoneySignal": null,
        "apyVolatility": 9.512485640219698,
        "apyDrift": 0.03413563727028446
      },
      "probabilities": {
        "exploit": 0.007139621850612998,
        "depeg": 0.005,
        "oracle": 0.007,
        "illiquid": 0.04373472813248216,
        "counterparty": 0.005
      },
      "severities": {
        "exploit": 0.85,
        "depeg": 0.2,
        "oracle": 0.4,
        "illiquid": 0.05,
        "counterparty": 0.5
      },
      "expectedLoss": 0.014555414979645158,
      "raapy": 0.019021785020354842,
      "confidence": 0.48977138668059006,
      "score": 0.009316326026559267,
      "eligibleTranches": [
        "junior"
      ],
      "primaryTranche": "junior",
      "rejectionReasons": [
        {
          "tranche": "senior",
          "reasons": [
            "tvlUsd 423182 < 25000000"
          ]
        },
        {
          "tranche": "mezzanine",
          "reasons": [
            "tvlUsd 423182 < 1000000"
          ]
        }
      ]
    },
    {
      "id": "aave:4a0e9f84-09a0-491a-aa5e-269813d31a59",
      "source": "aave",
      "asset": "0xdeaddeaddeaddeaddeaddeaddeaddeaddead1111",
      "apy": 0.08568540000000001,
      "apyReward": 0,
      "apyType": "variable",
      "tvlUsd": 376791,
      "lastUpdatedMs": 1779306914842,
      "raw": {
        "chain": "Mantle",
        "project": "aave-v3",
        "symbol": "WETH",
        "underlyingTokens": [
          "0xdEAddEaDdeadDEadDEADDEAddEADDEAddead1111"
        ],
        "apy": 8.56854,
        "apyBase": 8.56854,
        "apyReward": null,
        "tvlUsd": 376791,
        "pool": "4a0e9f84-09a0-491a-aa5e-269813d31a59"
      },
      "risk": {
        "contractAgeDays": 700,
        "auditFactor": 0.3,
        "tvlFactor": null,
        "depegEvents": [],
        "oracleType": "chainlink_dec",
        "liquiditySlippageBps": null,
        "counterpartyClass": "permissionless",
        "smartMoneySignal": null,
        "apyVolatility": 0.021459645329348687,
        "apyDrift": 2.2372289695789473
      },
      "probabilities": {
        "exploit": 0.0014792046853866403,
        "depeg": 0.005,
        "oracle": 0.002,
        "illiquid": 0.04423899479278889,
        "counterparty": 0.005
      },
      "severities": {
        "exploit": 0.85,
        "depeg": 0.2,
        "oracle": 0.4,
        "illiquid": 0.05,
        "counterparty": 0.5
      },
      "expectedLoss": 0.007769273722218089,
      "raapy": 0.07791612627778192,
      "confidence": 0.48977138668059006,
      "score": 0.038161089211849214,
      "eligibleTranches": [
        "junior"
      ],
      "primaryTranche": "junior",
      "rejectionReasons": [
        {
          "tranche": "senior",
          "reasons": [
            "tvlUsd 376791 < 25000000",
            "apy 8.57% > 8% (too-good-to-be-true gate)"
          ]
        },
        {
          "tranche": "mezzanine",
          "reasons": [
            "tvlUsd 376791 < 1000000"
          ]
        }
      ]
    },
    {
      "id": "mantleVault:c87c5d7c-0285-47a9-8539-d335f05b9ba2",
      "source": "mantleVault",
      "asset": "0xcda86a272531e8640cd7f1a92c01839911b90bb0",
      "apy": 0.0031143,
      "apyReward": 0.0002956,
      "apyType": "variable",
      "tvlUsd": 268408,
      "lastUpdatedMs": 1779306914842,
      "raw": {
        "chain": "Mantle",
        "project": "lendle-pooled-markets",
        "symbol": "METH",
        "underlyingTokens": [
          "0xcDA86A272531e8640cD7F1a92c01839911B90bb0"
        ],
        "apy": 0.341,
        "apyBase": 0.31143,
        "apyReward": 0.02956,
        "tvlUsd": 268408,
        "pool": "c87c5d7c-0285-47a9-8539-d335f05b9ba2"
      },
      "risk": {
        "contractAgeDays": 365,
        "auditFactor": 0.6,
        "tvlFactor": null,
        "depegEvents": [],
        "oracleType": "redstone",
        "liquiditySlippageBps": null,
        "counterpartyClass": "permissionless",
        "smartMoneySignal": null,
        "apyVolatility": 0.0006006337193957362,
        "apyDrift": 1.2934737671305583
      },
      "probabilities": {
        "exploit": 0.01946143251105418,
        "depeg": 0.005,
        "oracle": 0.007,
        "illiquid": 0.045712045440020124,
        "counterparty": 0.005
      },
      "severities": {
        "exploit": 0.85,
        "depeg": 0.2,
        "oracle": 0.4,
        "illiquid": 0.05,
        "counterparty": 0.5
      },
      "expectedLoss": 0.025127819906397057,
      "raapy": -0.022013519906397057,
      "confidence": 0.6996640806270992,
      "score": -0.015402069166675643,
      "eligibleTranches": [
        "junior"
      ],
      "primaryTranche": "junior",
      "rejectionReasons": [
        {
          "tranche": "senior",
          "reasons": [
            "expectedLoss 0.0251 > 0.02",
            "tvlUsd 268408 < 25000000",
            "apyBase 0.31% < 2% (reward-only positions blocked)"
          ]
        },
        {
          "tranche": "mezzanine",
          "reasons": [
            "tvlUsd 268408 < 1000000",
            "apyBase 0.31% < 1% (reward-only positions blocked)"
          ]
        }
      ]
    },
    {
      "id": "mantleVault:b96d8236-36d4-4be4-92f7-422beeac7073",
      "source": "mantleVault",
      "asset": "0xe6829d9a7ee3040e1276fa75293bde931859e8fa",
      "apy": 0.0000339,
      "apyReward": 0.0004777,
      "apyType": "variable",
      "tvlUsd": 193897,
      "lastUpdatedMs": 1779306914842,
      "raw": {
        "chain": "Mantle",
        "project": "lendle-pooled-markets",
        "symbol": "CMETH",
        "underlyingTokens": [
          "0xE6829d9a7eE3040e1276Fa75293Bde931859e8fA"
        ],
        "apy": 0.05116,
        "apyBase": 0.00339,
        "apyReward": 0.04777,
        "tvlUsd": 193897,
        "pool": "b96d8236-36d4-4be4-92f7-422beeac7073"
      },
      "risk": {
        "contractAgeDays": 365,
        "auditFactor": 0.6,
        "tvlFactor": null,
        "depegEvents": [],
        "oracleType": "redstone",
        "liquiditySlippageBps": null,
        "counterpartyClass": "permissionless",
        "smartMoneySignal": null,
        "apyVolatility": 0.0015096890105314252,
        "apyDrift": 0.0987103434168527
      },
      "probabilities": {
        "exploit": 0.01987968588542752,
        "depeg": 0.005,
        "oracle": 0.007,
        "illiquid": 0.047124289103309125,
        "counterparty": 0.005
      },
      "severities": {
        "exploit": 0.85,
        "depeg": 0.2,
        "oracle": 0.4,
        "illiquid": 0.05,
        "counterparty": 0.5
      },
      "expectedLoss": 0.02555394745777885,
      "raapy": -0.02552004745777885,
      "confidence": 0.6996664128445882,
      "score": -0.01785552006040778,
      "eligibleTranches": [
        "junior"
      ],
      "primaryTranche": "junior",
      "rejectionReasons": [
        {
          "tranche": "senior",
          "reasons": [
            "expectedLoss 0.0256 > 0.02",
            "tvlUsd 193897 < 25000000",
            "apyBase 0.00% < 2% (reward-only positions blocked)"
          ]
        },
        {
          "tranche": "mezzanine",
          "reasons": [
            "tvlUsd 193897 < 1000000",
            "apyBase 0.00% < 1% (reward-only positions blocked)"
          ]
        }
      ]
    },
    {
      "id": "agni:649bee89-0a34-4eb1-b8ab-7c5fdee07ccd",
      "source": "agni",
      "asset": "0x29cc30f9d113b356ce408667aa6433589cecbdca",
      "apy": 0.019094800000000002,
      "apyReward": 0,
      "apyType": "variable",
      "tvlUsd": 133062,
      "lastUpdatedMs": 1779306914842,
      "raw": {
        "chain": "Mantle",
        "project": "fluxion-network",
        "symbol": "ELSA-USDT0",
        "underlyingTokens": [
          "0x29cc30f9d113b356ce408667aa6433589cecbdca",
          "0x779ded0c9e1022225f8e0630b35a9b54be713736"
        ],
        "apy": 1.90948,
        "apyBase": 1.90948,
        "apyReward": null,
        "tvlUsd": 133062,
        "pool": "649bee89-0a34-4eb1-b8ab-7c5fdee07ccd"
      },
      "risk": {
        "contractAgeDays": 540,
        "auditFactor": 0.6,
        "tvlFactor": null,
        "depegEvents": [],
        "oracleType": "redstone",
        "liquiditySlippageBps": null,
        "counterpartyClass": "permissionless",
        "smartMoneySignal": null,
        "apyVolatility": 0.030157818836081342,
        "apyDrift": 0.5856145770655262
      },
      "probabilities": {
        "exploit": 0.007702496803410957,
        "depeg": 0.005,
        "oracle": 0.007,
        "illiquid": 0.04875945953139812,
        "counterparty": 0.005
      },
      "severities": {
        "exploit": 0.85,
        "depeg": 0.2,
        "oracle": 0.4,
        "illiquid": 0.05,
        "counterparty": 0.5
      },
      "expectedLoss": 0.01528509525946922,
      "raapy": 0.0038097047405307814,
      "confidence": 0.48977138668059006,
      "score": 0.0018658843736133782,
      "eligibleTranches": [
        "junior"
      ],
      "primaryTranche": "junior",
      "rejectionReasons": [
        {
          "tranche": "senior",
          "reasons": [
            "tvlUsd 133062 < 25000000",
            "apyBase 1.91% < 2% (reward-only positions blocked)"
          ]
        },
        {
          "tranche": "mezzanine",
          "reasons": [
            "tvlUsd 133062 < 1000000"
          ]
        }
      ]
    },
    {
      "id": "agni:227e8492-33e9-4953-8beb-28973c9fdb8a",
      "source": "agni",
      "asset": "0x09bc4e0d864854c6afb6eb9a9cdf58ac190d0df9",
      "apy": 0.0076093,
      "apyReward": 0,
      "apyType": "variable",
      "tvlUsd": 115881,
      "lastUpdatedMs": 1779306914842,
      "raw": {
        "chain": "Mantle",
        "project": "fluxion-network",
        "symbol": "USDC-WGOOGLX",
        "underlyingTokens": [
          "0x09bc4e0d864854c6afb6eb9a9cdf58ac190d0df9",
          "0x1630f08370917e79df0b7572395a5e907508bbbc"
        ],
        "apy": 0.76093,
        "apyBase": 0.76093,
        "apyReward": null,
        "tvlUsd": 115881,
        "pool": "227e8492-33e9-4953-8beb-28973c9fdb8a"
      },
      "risk": {
        "contractAgeDays": 540,
        "auditFactor": 0.6,
        "tvlFactor": null,
        "depegEvents": [],
        "oracleType": "redstone",
        "liquiditySlippageBps": null,
        "counterpartyClass": "permissionless",
        "smartMoneySignal": null,
        "apyVolatility": 0.008145614228736239,
        "apyDrift": 1.3455806174453302
      },
      "probabilities": {
        "exploit": 0.007769756184503614,
        "depeg": 0.005,
        "oracle": 0.007,
        "illiquid": 0.0493598776568947,
        "counterparty": 0.005
      },
      "severities": {
        "exploit": 0.85,
        "depeg": 0.2,
        "oracle": 0.4,
        "illiquid": 0.05,
        "counterparty": 0.5
      },
      "expectedLoss": 0.015372286639672807,
      "raapy": -0.007762986639672806,
      "confidence": 0.699009035432303,
      "score": -0.005426397803071544,
      "eligibleTranches": [
        "junior"
      ],
      "primaryTranche": "junior",
      "rejectionReasons": [
        {
          "tranche": "senior",
          "reasons": [
            "tvlUsd 115881 < 25000000",
            "apyBase 0.76% < 2% (reward-only positions blocked)"
          ]
        },
        {
          "tranche": "mezzanine",
          "reasons": [
            "tvlUsd 115881 < 1000000",
            "apyBase 0.76% < 1% (reward-only positions blocked)"
          ]
        }
      ]
    },
    {
      "id": "agni:2a510869-6356-4486-8bb5-d5a808634496",
      "source": "agni",
      "asset": "0x09bc4e0d864854c6afb6eb9a9cdf58ac190d0df9",
      "apy": 0.0133965,
      "apyReward": 0,
      "apyType": "variable",
      "tvlUsd": 112344,
      "lastUpdatedMs": 1779306914842,
      "raw": {
        "chain": "Mantle",
        "project": "fluxion-network",
        "symbol": "USDC-WNVDAX",
        "underlyingTokens": [
          "0x09bc4e0d864854c6afb6eb9a9cdf58ac190d0df9",
          "0x93e62845c1dd5822ebc807ab71a5fb750decd15a"
        ],
        "apy": 1.33965,
        "apyBase": 1.33965,
        "apyReward": null,
        "tvlUsd": 112344,
        "pool": "2a510869-6356-4486-8bb5-d5a808634496"
      },
      "risk": {
        "contractAgeDays": 540,
        "auditFactor": 0.6,
        "tvlFactor": null,
        "depegEvents": [],
        "oracleType": "redstone",
        "liquiditySlippageBps": null,
        "counterpartyClass": "permissionless",
        "smartMoneySignal": null,
        "apyVolatility": 0.01058046537580218,
        "apyDrift": 1.731309637752833
      },
      "probabilities": {
        "exploit": 0.007784836832298429,
        "depeg": 0.005,
        "oracle": 0.007,
        "illiquid": 0.04949450117160952,
        "counterparty": 0.005
      },
      "severities": {
        "exploit": 0.85,
        "depeg": 0.2,
        "oracle": 0.4,
        "illiquid": 0.05,
        "counterparty": 0.5
      },
      "expectedLoss": 0.015391836366034141,
      "raapy": -0.001995336366034141,
      "confidence": 0.48930143176382923,
      "score": -0.0009763209407509412,
      "eligibleTranches": [
        "junior"
      ],
      "primaryTranche": "junior",
      "rejectionReasons": [
        {
          "tranche": "senior",
          "reasons": [
            "tvlUsd 112344 < 25000000",
            "apyBase 1.34% < 2% (reward-only positions blocked)"
          ]
        },
        {
          "tranche": "mezzanine",
          "reasons": [
            "tvlUsd 112344 < 1000000"
          ]
        }
      ]
    },
    {
      "id": "agni:ebec73de-fd1e-4f97-8287-d9cb01c7d352",
      "source": "agni",
      "asset": "0x09bc4e0d864854c6afb6eb9a9cdf58ac190d0df9",
      "apy": 0.024468800000000002,
      "apyReward": 0,
      "apyType": "variable",
      "tvlUsd": 111132,
      "lastUpdatedMs": 1779306914842,
      "raw": {
        "chain": "Mantle",
        "project": "fluxion-network",
        "symbol": "USDC-WMSTRX",
        "underlyingTokens": [
          "0x09bc4e0d864854c6afb6eb9a9cdf58ac190d0df9",
          "0x266e5923f6118f8b340ca5a23ae7f71897361476"
        ],
        "apy": 2.44688,
        "apyBase": 2.44688,
        "apyReward": null,
        "tvlUsd": 111132,
        "pool": "ebec73de-fd1e-4f97-8287-d9cb01c7d352"
      },
      "risk": {
        "contractAgeDays": 540,
        "auditFactor": 0.6,
        "tvlFactor": null,
        "depegEvents": [],
        "oracleType": "redstone",
        "liquiditySlippageBps": null,
        "counterpartyClass": "permissionless",
        "smartMoneySignal": null,
        "apyVolatility": 0.023780099185109007,
        "apyDrift": 0.9747356903189156
      },
      "probabilities": {
        "exploit": 0.007790113859926459,
        "depeg": 0.005,
        "oracle": 0.007,
        "illiquid": 0.04954160869750618,
        "counterparty": 0.005
      },
      "severities": {
        "exploit": 0.85,
        "depeg": 0.2,
        "oracle": 0.4,
        "illiquid": 0.05,
        "counterparty": 0.5
      },
      "expectedLoss": 0.0153986772158128,
      "raapy": 0.009070122784187203,
      "confidence": 0.6989973853787965,
      "score": 0.006339992111211505,
      "eligibleTranches": [
        "junior"
      ],
      "primaryTranche": "junior",
      "rejectionReasons": [
        {
          "tranche": "senior",
          "reasons": [
            "tvlUsd 111132 < 25000000"
          ]
        },
        {
          "tranche": "mezzanine",
          "reasons": [
            "tvlUsd 111132 < 1000000"
          ]
        }
      ]
    },
    {
      "id": "agni:3d429d4e-b3a6-4847-957b-b10bf26a6f01",
      "source": "agni",
      "asset": "0x779ded0c9e1022225f8e0630b35a9b54be713736",
      "apy": 0.0049757000000000004,
      "apyReward": 0,
      "apyType": "variable",
      "tvlUsd": 110072,
      "lastUpdatedMs": 1779306914842,
      "raw": {
        "chain": "Mantle",
        "project": "fluxion-network",
        "symbol": "USDT0-SCOR",
        "underlyingTokens": [
          "0x779ded0c9e1022225f8e0630b35a9b54be713736",
          "0x8ddb986b11c039a6cc1dbcabd62bae911b348f33"
        ],
        "apy": 0.49757,
        "apyBase": 0.49757,
        "apyReward": null,
        "tvlUsd": 110072,
        "pool": "3d429d4e-b3a6-4847-957b-b10bf26a6f01"
      },
      "risk": {
        "contractAgeDays": 540,
        "auditFactor": 0.6,
        "tvlFactor": null,
        "depegEvents": [],
        "oracleType": "redstone",
        "liquiditySlippageBps": null,
        "counterpartyClass": "permissionless",
        "smartMoneySignal": null,
        "apyVolatility": 0.06539795888132911,
        "apyDrift": 0.16843876331015792
      },
      "probabilities": {
        "exploit": 0.007794776475317072,
        "depeg": 0.005,
        "oracle": 0.007,
        "illiquid": 0.049583231423544746,
        "counterparty": 0.005
      },
      "severities": {
        "exploit": 0.85,
        "depeg": 0.2,
        "oracle": 0.4,
        "illiquid": 0.05,
        "counterparty": 0.5
      },
      "expectedLoss": 0.01540472157519675,
      "raapy": -0.010429021575196748,
      "confidence": 0.48976975411202206,
      "score": -0.005107819332513084,
      "eligibleTranches": [
        "junior"
      ],
      "primaryTranche": "junior",
      "rejectionReasons": [
        {
          "tranche": "senior",
          "reasons": [
            "tvlUsd 110072 < 25000000",
            "apyBase 0.50% < 2% (reward-only positions blocked)"
          ]
        },
        {
          "tranche": "mezzanine",
          "reasons": [
            "tvlUsd 110072 < 1000000",
            "apyBase 0.50% < 1% (reward-only positions blocked)"
          ]
        }
      ]
    },
    {
      "id": "agni:3b6b75cf-adb5-4fb4-bbcd-8f75c6879c9d",
      "source": "agni",
      "asset": "0x09bc4e0d864854c6afb6eb9a9cdf58ac190d0df9",
      "apy": 0.0050387,
      "apyReward": 0,
      "apyType": "variable",
      "tvlUsd": 109753,
      "lastUpdatedMs": 1779306914842,
      "raw": {
        "chain": "Mantle",
        "project": "fluxion-network",
        "symbol": "USDC-WAAPLX",
        "underlyingTokens": [
          "0x09bc4e0d864854c6afb6eb9a9cdf58ac190d0df9",
          "0x5aa7649fdbda47de64a07ac81d64b682af9c0724"
        ],
        "apy": 0.50387,
        "apyBase": 0.50387,
        "apyReward": null,
        "tvlUsd": 109753,
        "pool": "3b6b75cf-adb5-4fb4-bbcd-8f75c6879c9d"
      },
      "risk": {
        "contractAgeDays": 540,
        "auditFactor": 0.6,
        "tvlFactor": null,
        "depegEvents": [],
        "oracleType": "redstone",
        "liquiditySlippageBps": null,
        "counterpartyClass": "permissionless",
        "smartMoneySignal": null,
        "apyVolatility": 0.005921275817726916,
        "apyDrift": 1.793557237317725
      },
      "probabilities": {
        "exploit": 0.007796188451221386,
        "depeg": 0.005,
        "oracle": 0.007,
        "illiquid": 0.0495958359987273,
        "counterparty": 0.005
      },
      "severities": {
        "exploit": 0.85,
        "depeg": 0.2,
        "oracle": 0.4,
        "illiquid": 0.05,
        "counterparty": 0.5
      },
      "expectedLoss": 0.015406551983474544,
      "raapy": -0.010367851983474544,
      "confidence": 0.4893079558264131,
      "score": -0.0050730724603447516,
      "eligibleTranches": [
        "junior"
      ],
      "primaryTranche": "junior",
      "rejectionReasons": [
        {
          "tranche": "senior",
          "reasons": [
            "tvlUsd 109753 < 25000000",
            "apyBase 0.50% < 2% (reward-only positions blocked)"
          ]
        },
        {
          "tranche": "mezzanine",
          "reasons": [
            "tvlUsd 109753 < 1000000",
            "apyBase 0.50% < 1% (reward-only positions blocked)"
          ]
        }
      ]
    },
    {
      "id": "agni:2364dd66-69d3-44ef-9e85-4d5217a57b57",
      "source": "agni",
      "asset": "0x09bc4e0d864854c6afb6eb9a9cdf58ac190d0df9",
      "apy": 0.0036052000000000002,
      "apyReward": 0,
      "apyType": "variable",
      "tvlUsd": 109507,
      "lastUpdatedMs": 1779306914842,
      "raw": {
        "chain": "Mantle",
        "project": "fluxion-network",
        "symbol": "USDC-WQQQX",
        "underlyingTokens": [
          "0x09bc4e0d864854c6afb6eb9a9cdf58ac190d0df9",
          "0xdbd9232fee15351068fe02f0683146e16d9f2cea"
        ],
        "apy": 0.36052,
        "apyBase": 0.36052,
        "apyReward": null,
        "tvlUsd": 109507,
        "pool": "2364dd66-69d3-44ef-9e85-4d5217a57b57"
      },
      "risk": {
        "contractAgeDays": 540,
        "auditFactor": 0.6,
        "tvlFactor": null,
        "depegEvents": [],
        "oracleType": "redstone",
        "liquiditySlippageBps": null,
        "counterpartyClass": "permissionless",
        "smartMoneySignal": null,
        "apyVolatility": 0.002093297181735306,
        "apyDrift": 1.2397450470457099
      },
      "probabilities": {
        "exploit": 0.007797280115900549,
        "depeg": 0.005,
        "oracle": 0.007,
        "illiquid": 0.049605581185936665,
        "counterparty": 0.005
      },
      "severities": {
        "exploit": 0.85,
        "depeg": 0.2,
        "oracle": 0.4,
        "illiquid": 0.05,
        "counterparty": 0.5
      },
      "expectedLoss": 0.015407967157812301,
      "raapy": -0.0118027671578123,
      "confidence": 0.6990067054060682,
      "score": -0.00825021338565732,
      "eligibleTranches": [
        "junior"
      ],
      "primaryTranche": "junior",
      "rejectionReasons": [
        {
          "tranche": "senior",
          "reasons": [
            "tvlUsd 109507 < 25000000",
            "apyBase 0.36% < 2% (reward-only positions blocked)"
          ]
        },
        {
          "tranche": "mezzanine",
          "reasons": [
            "tvlUsd 109507 < 1000000",
            "apyBase 0.36% < 1% (reward-only positions blocked)"
          ]
        }
      ]
    },
    {
      "id": "agni:a7e2f58e-1c93-4592-acd6-8e40e6cb26ff",
      "source": "agni",
      "asset": "0x09bc4e0d864854c6afb6eb9a9cdf58ac190d0df9",
      "apy": 0.0050831,
      "apyReward": 0,
      "apyType": "variable",
      "tvlUsd": 107709,
      "lastUpdatedMs": 1779306914842,
      "raw": {
        "chain": "Mantle",
        "project": "fluxion-network",
        "symbol": "USDC-WCRCLX",
        "underlyingTokens": [
          "0x09bc4e0d864854c6afb6eb9a9cdf58ac190d0df9",
          "0xa90872aca656ebe47bdebf3b19ec9dd9c5adc7f8"
        ],
        "apy": 0.50831,
        "apyBase": 0.50831,
        "apyReward": null,
        "tvlUsd": 107709,
        "pool": "a7e2f58e-1c93-4592-acd6-8e40e6cb26ff"
      },
      "risk": {
        "contractAgeDays": 540,
        "auditFactor": 0.6,
        "tvlFactor": null,
        "depegEvents": [],
        "oracleType": "redstone",
        "liquiditySlippageBps": null,
        "counterpartyClass": "permissionless",
        "smartMoneySignal": null,
        "apyVolatility": 0.01662051505849792,
        "apyDrift": 1.8328470269881803
      },
      "probabilities": {
        "exploit": 0.007805334292981726,
        "depeg": 0.005,
        "oracle": 0.007,
        "illiquid": 0.04967748006200328,
        "counterparty": 0.005
      },
      "severities": {
        "exploit": 0.85,
        "depeg": 0.2,
        "oracle": 0.4,
        "illiquid": 0.05,
        "counterparty": 0.5
      },
      "expectedLoss": 0.015418408152134633,
      "raapy": -0.010335308152134633,
      "confidence": 0.4893030627713202,
      "score": -0.005057097933524869,
      "eligibleTranches": [
        "junior"
      ],
      "primaryTranche": "junior",
      "rejectionReasons": [
        {
          "tranche": "senior",
          "reasons": [
            "tvlUsd 107709 < 25000000",
            "apyBase 0.51% < 2% (reward-only positions blocked)"
          ]
        },
        {
          "tranche": "mezzanine",
          "reasons": [
            "tvlUsd 107709 < 1000000",
            "apyBase 0.51% < 1% (reward-only positions blocked)"
          ]
        }
      ]
    },
    {
      "id": "agni:a4ff3d7c-a117-4b24-a9f9-6af46cd276c0",
      "source": "agni",
      "asset": "0x09bc4e0d864854c6afb6eb9a9cdf58ac190d0df9",
      "apy": 0.0126333,
      "apyReward": 0,
      "apyType": "variable",
      "tvlUsd": 107152,
      "lastUpdatedMs": 1779306914842,
      "raw": {
        "chain": "Mantle",
        "project": "fluxion-network",
        "symbol": "USDC-WTSLAX",
        "underlyingTokens": [
          "0x09bc4e0d864854c6afb6eb9a9cdf58ac190d0df9",
          "0x43680abf18cf54898be84c6ef78237cfbd441883"
        ],
        "apy": 1.26333,
        "apyBase": 1.26333,
        "apyReward": null,
        "tvlUsd": 107152,
        "pool": "a4ff3d7c-a117-4b24-a9f9-6af46cd276c0"
      },
      "risk": {
        "contractAgeDays": 540,
        "auditFactor": 0.6,
        "tvlFactor": null,
        "depegEvents": [],
        "oracleType": "redstone",
        "liquiditySlippageBps": null,
        "counterpartyClass": "permissionless",
        "smartMoneySignal": null,
        "apyVolatility": 0.011695976460455296,
        "apyDrift": 1.0761218407360666
      },
      "probabilities": {
        "exploit": 0.007807856681348243,
        "depeg": 0.005,
        "oracle": 0.007,
        "illiquid": 0.049699997184078956,
        "counterparty": 0.005
      },
      "severities": {
        "exploit": 0.85,
        "depeg": 0.2,
        "oracle": 0.4,
        "illiquid": 0.05,
        "counterparty": 0.5
      },
      "expectedLoss": 0.015421678038349955,
      "raapy": -0.0027883780383499545,
      "confidence": 0.699009035432303,
      "score": -0.0019491014430076188,
      "eligibleTranches": [
        "junior"
      ],
      "primaryTranche": "junior",
      "rejectionReasons": [
        {
          "tranche": "senior",
          "reasons": [
            "tvlUsd 107152 < 25000000",
            "apyBase 1.26% < 2% (reward-only positions blocked)"
          ]
        },
        {
          "tranche": "mezzanine",
          "reasons": [
            "tvlUsd 107152 < 1000000"
          ]
        }
      ]
    },
    {
      "id": "agni:913ce101-55b1-4230-93c7-d523f0d9ca03",
      "source": "agni",
      "asset": "0x09bc4e0d864854c6afb6eb9a9cdf58ac190d0df9",
      "apy": 0.0011366,
      "apyReward": 0,
      "apyType": "variable",
      "tvlUsd": 106878,
      "lastUpdatedMs": 1779306914842,
      "raw": {
        "chain": "Mantle",
        "project": "fluxion-network",
        "symbol": "USDC-WSPYX",
        "underlyingTokens": [
          "0x09bc4e0d864854c6afb6eb9a9cdf58ac190d0df9",
          "0xc88fcd8b874fdb3256e8b55b3decb8c24eab4c02"
        ],
        "apy": 0.11366,
        "apyBase": 0.11366,
        "apyReward": null,
        "tvlUsd": 106878,
        "pool": "913ce101-55b1-4230-93c7-d523f0d9ca03"
      },
      "risk": {
        "contractAgeDays": 540,
        "auditFactor": 0.6,
        "tvlFactor": null,
        "depegEvents": [],
        "oracleType": "redstone",
        "liquiditySlippageBps": null,
        "counterpartyClass": "permissionless",
        "smartMoneySignal": null,
        "apyVolatility": 0.0012496281609723438,
        "apyDrift": 0.6865764254360768
      },
      "probabilities": {
        "exploit": 0.007809102312692368,
        "depeg": 0.005,
        "oracle": 0.007,
        "illiquid": 0.04971111681712567,
        "counterparty": 0.005
      },
      "severities": {
        "exploit": 0.85,
        "depeg": 0.2,
        "oracle": 0.4,
        "illiquid": 0.05,
        "counterparty": 0.5
      },
      "expectedLoss": 0.015423292806644798,
      "raapy": -0.014286692806644798,
      "confidence": 0.6990067054060682,
      "score": -0.009986494069921354,
      "eligibleTranches": [
        "junior"
      ],
      "primaryTranche": "junior",
      "rejectionReasons": [
        {
          "tranche": "senior",
          "reasons": [
            "tvlUsd 106878 < 25000000",
            "apyBase 0.11% < 2% (reward-only positions blocked)"
          ]
        },
        {
          "tranche": "mezzanine",
          "reasons": [
            "tvlUsd 106878 < 1000000",
            "apyBase 0.11% < 1% (reward-only positions blocked)"
          ]
        }
      ]
    },
    {
      "id": "agni:b8d50460-5237-4601-9250-4f2d3a6b569b",
      "source": "agni",
      "asset": "0x09bc4e0d864854c6afb6eb9a9cdf58ac190d0df9",
      "apy": 0.0030788,
      "apyReward": 0,
      "apyType": "variable",
      "tvlUsd": 103663,
      "lastUpdatedMs": 1779306914842,
      "raw": {
        "chain": "Mantle",
        "project": "fluxion-network",
        "symbol": "USDC-WMETAX",
        "underlyingTokens": [
          "0x09bc4e0d864854c6afb6eb9a9cdf58ac190d0df9",
          "0x4e41a262caa93c6575d336e0a4eb79f3c67caa06"
        ],
        "apy": 0.30788,
        "apyBase": 0.30788,
        "apyReward": null,
        "tvlUsd": 103663,
        "pool": "b8d50460-5237-4601-9250-4f2d3a6b569b"
      },
      "risk": {
        "contractAgeDays": 540,
        "auditFactor": 0.6,
        "tvlFactor": null,
        "depegEvents": [],
        "oracleType": "redstone",
        "liquiditySlippageBps": null,
        "counterpartyClass": "permissionless",
        "smartMoneySignal": null,
        "apyVolatility": 0.0066774528930345235,
        "apyDrift": 0.9739426830050358
      },
      "probabilities": {
        "exploit": 0.007823961376058024,
        "depeg": 0.005,
        "oracle": 0.007,
        "illiquid": 0.049843762268625615,
        "counterparty": 0.005
      },
      "severities": {
        "exploit": 0.85,
        "depeg": 0.2,
        "oracle": 0.4,
        "illiquid": 0.05,
        "counterparty": 0.5
      },
      "expectedLoss": 0.015442555283080603,
      "raapy": -0.012363755283080603,
      "confidence": 0.6990043753876003,
      "score": -0.0086423190390949,
      "eligibleTranches": [
        "junior"
      ],
      "primaryTranche": "junior",
      "rejectionReasons": [
        {
          "tranche": "senior",
          "reasons": [
            "tvlUsd 103663 < 25000000",
            "apyBase 0.31% < 2% (reward-only positions blocked)"
          ]
        },
        {
          "tranche": "mezzanine",
          "reasons": [
            "tvlUsd 103663 < 1000000",
            "apyBase 0.31% < 1% (reward-only positions blocked)"
          ]
        }
      ]
    },
    {
      "id": "agni:30836422-c578-4f77-8f81-861c509c5d4c",
      "source": "agni",
      "asset": "0x09bc4e0d864854c6afb6eb9a9cdf58ac190d0df9",
      "apy": 0.0057585,
      "apyReward": 0,
      "apyType": "variable",
      "tvlUsd": 102818,
      "lastUpdatedMs": 1779306914842,
      "raw": {
        "chain": "Mantle",
        "project": "fluxion-network",
        "symbol": "USDC-WHOODX",
        "underlyingTokens": [
          "0x09bc4e0d864854c6afb6eb9a9cdf58ac190d0df9",
          "0x953707d7a1cb30cc5c636bda8eaebe410341eb14"
        ],
        "apy": 0.57585,
        "apyBase": 0.57585,
        "apyReward": null,
        "tvlUsd": 102818,
        "pool": "30836422-c578-4f77-8f81-861c509c5d4c"
      },
      "risk": {
        "contractAgeDays": 540,
        "auditFactor": 0.6,
        "tvlFactor": null,
        "depegEvents": [],
        "oracleType": "redstone",
        "liquiditySlippageBps": null,
        "counterpartyClass": "permissionless",
        "smartMoneySignal": null,
        "apyVolatility": 0.008402490280750687,
        "apyDrift": 0.6071845154612759
      },
      "probabilities": {
        "exploit": 0.00782794329502649,
        "depeg": 0.005,
        "oracle": 0.007,
        "illiquid": 0.04987930848216618,
        "counterparty": 0.005
      },
      "severities": {
        "exploit": 0.85,
        "depeg": 0.2,
        "oracle": 0.4,
        "illiquid": 0.05,
        "counterparty": 0.5
      },
      "expectedLoss": 0.015447717224880827,
      "raapy": -0.009689217224880827,
      "confidence": 0.6989950553913952,
      "score": -0.006772714930804834,
      "eligibleTranches": [
        "junior"
      ],
      "primaryTranche": "junior",
      "rejectionReasons": [
        {
          "tranche": "senior",
          "reasons": [
            "tvlUsd 102818 < 25000000",
            "apyBase 0.58% < 2% (reward-only positions blocked)"
          ]
        },
        {
          "tranche": "mezzanine",
          "reasons": [
            "tvlUsd 102818 < 1000000",
            "apyBase 0.58% < 1% (reward-only positions blocked)"
          ]
        }
      ]
    },
    {
      "id": "agni:b5933580-18c1-43b6-aec3-2563cd30e3a2",
      "source": "agni",
      "asset": "0x779ded0c9e1022225f8e0630b35a9b54be713736",
      "apy": 0.0013026,
      "apyReward": 0,
      "apyType": "variable",
      "tvlUsd": 101761,
      "lastUpdatedMs": 1779306914842,
      "raw": {
        "chain": "Mantle",
        "project": "fluxion-network",
        "symbol": "USDT0-VOOI",
        "underlyingTokens": [
          "0x779ded0c9e1022225f8e0630b35a9b54be713736",
          "0xd81a4adea9932a6bdba0bdbc8c5fd4c78e5a09f1"
        ],
        "apy": 0.13026,
        "apyBase": 0.13026,
        "apyReward": null,
        "tvlUsd": 101761,
        "pool": "b5933580-18c1-43b6-aec3-2563cd30e3a2"
      },
      "risk": {
        "contractAgeDays": 540,
        "auditFactor": 0.6,
        "tvlFactor": null,
        "depegEvents": [],
        "oracleType": "redstone",
        "liquiditySlippageBps": null,
        "counterpartyClass": "permissionless",
        "smartMoneySignal": null,
        "apyVolatility": 0.004787985991134986,
        "apyDrift": 0.4999311172074711
      },
      "probabilities": {
        "exploit": 0.007832970553094776,
        "depeg": 0.005,
        "oracle": 0.007,
        "illiquid": 0.04992418633885638,
        "counterparty": 0.005
      },
      "severities": {
        "exploit": 0.85,
        "depeg": 0.2,
        "oracle": 0.4,
        "illiquid": 0.05,
        "counterparty": 0.5
      },
      "expectedLoss": 0.015454234287073378,
      "raapy": -0.014151634287073379,
      "confidence": 0.6996710773028887,
      "score": -0.009901489207233128,
      "eligibleTranches": [
        "junior"
      ],
      "primaryTranche": "junior",
      "rejectionReasons": [
        {
          "tranche": "senior",
          "reasons": [
            "tvlUsd 101761 < 25000000",
            "apyBase 0.13% < 2% (reward-only positions blocked)"
          ]
        },
        {
          "tranche": "mezzanine",
          "reasons": [
            "tvlUsd 101761 < 1000000",
            "apyBase 0.13% < 1% (reward-only positions blocked)"
          ]
        }
      ]
    },
    {
      "id": "mantleVault:3f5789dd-68ed-44c7-9388-b553df96502d",
      "source": "mantleVault",
      "asset": "0x78c1b0c915c4faa5fffa6cabf0219da63d7f4cb8",
      "apy": 0.0006751999999999999,
      "apyReward": 0.0035419,
      "apyType": "variable",
      "tvlUsd": 74444,
      "lastUpdatedMs": 1779306914842,
      "raw": {
        "chain": "Mantle",
        "project": "lendle-pooled-markets",
        "symbol": "WMNT",
        "underlyingTokens": [
          "0x78c1b0C915c4FAA5FffA6CAbf0219DA63d7f4cb8"
        ],
        "apy": 0.4217,
        "apyBase": 0.06752,
        "apyReward": 0.35419,
        "tvlUsd": 74444,
        "pool": "3f5789dd-68ed-44c7-9388-b553df96502d"
      },
      "risk": {
        "contractAgeDays": 365,
        "auditFactor": 0.6,
        "tvlFactor": null,
        "depegEvents": [],
        "oracleType": "redstone",
        "liquiditySlippageBps": null,
        "counterpartyClass": "permissionless",
        "smartMoneySignal": null,
        "apyVolatility": 0.008652849914996543,
        "apyDrift": 0.10282734499421897
      },
      "probabilities": {
        "exploit": 0.02111095527205879,
        "depeg": 0.005,
        "oracle": 0.007,
        "illiquid": 0.05128170299549115,
        "counterparty": 0.005
      },
      "severities": {
        "exploit": 0.85,
        "depeg": 0.2,
        "oracle": 0.4,
        "illiquid": 0.05,
        "counterparty": 0.5
      },
      "expectedLoss": 0.02680839713102453,
      "raapy": -0.02613319713102453,
      "confidence": 0.699661748417384,
      "score": -0.018284398396428786,
      "eligibleTranches": [],
      "primaryTranche": null,
      "rejectionReasons": [
        {
          "tranche": "senior",
          "reasons": [
            "expectedLoss 0.0268 > 0.02",
            "tvlUsd 74444 < 25000000",
            "apyBase 0.07% < 2% (reward-only positions blocked)"
          ]
        },
        {
          "tranche": "mezzanine",
          "reasons": [
            "tvlUsd 74444 < 1000000",
            "apyBase 0.07% < 1% (reward-only positions blocked)"
          ]
        },
        {
          "tranche": "junior",
          "reasons": [
            "tvlUsd 74444 < 100000"
          ]
        }
      ]
    },
    {
      "id": "cian:009b6f09-bfa7-4852-8685-0980d9478419",
      "source": "cian",
      "asset": "0xcda86a272531e8640cd7f1a92c01839911b90bb0",
      "apy": 0.029014099999999998,
      "apyReward": 0,
      "apyType": "variable",
      "tvlUsd": 51751,
      "lastUpdatedMs": 1779306914842,
      "raw": {
        "chain": "Mantle",
        "project": "circuit-protocol",
        "symbol": "METH",
        "underlyingTokens": [
          "0xcDA86A272531e8640cD7F1a92c01839911B90bb0"
        ],
        "apy": 2.90141,
        "apyBase": null,
        "apyReward": null,
        "tvlUsd": 51751,
        "pool": "009b6f09-bfa7-4852-8685-0980d9478419"
      },
      "risk": {
        "contractAgeDays": 300,
        "auditFactor": 0.6,
        "tvlFactor": null,
        "depegEvents": [],
        "oracleType": "custom_multi",
        "liquiditySlippageBps": null,
        "counterpartyClass": "permissionless",
        "smartMoneySignal": null,
        "apyVolatility": 0.003124783264647721,
        "apyDrift": 0.8849439345639647
      },
      "probabilities": {
        "exploit": 0.030963667255485963,
        "depeg": 0.005,
        "oracle": 0.02,
        "illiquid": 0.05286081253788227,
        "counterparty": 0.005
      },
      "severities": {
        "exploit": 0.85,
        "depeg": 0.2,
        "oracle": 0.4,
        "illiquid": 0.05,
        "counterparty": 0.5
      },
      "expectedLoss": 0.04046215779405719,
      "raapy": -0.011448057794057189,
      "confidence": 0.699661748417384,
      "score": -0.008009768132173314,
      "eligibleTranches": [],
      "primaryTranche": null,
      "rejectionReasons": [
        {
          "tranche": "senior",
          "reasons": [
            "expectedLoss 0.0405 > 0.02",
            "tvlUsd 51751 < 25000000"
          ]
        },
        {
          "tranche": "mezzanine",
          "reasons": [
            "expectedLoss 0.0405 > 0.04",
            "tvlUsd 51751 < 1000000"
          ]
        },
        {
          "tranche": "junior",
          "reasons": [
            "tvlUsd 51751 < 100000"
          ]
        }
      ]
    },
    {
      "id": "agni:ab6d4bd4-fa82-4f09-9588-98c953179d61",
      "source": "agni",
      "asset": "0x29cc30f9d113b356ce408667aa6433589cecbdca",
      "apy": 0.0192329,
      "apyReward": 0,
      "apyType": "variable",
      "tvlUsd": 49036,
      "lastUpdatedMs": 1779306914842,
      "raw": {
        "chain": "Mantle",
        "project": "fluxion-network",
        "symbol": "ELSA-WMNT",
        "underlyingTokens": [
          "0x29cc30f9d113b356ce408667aa6433589cecbdca",
          "0x78c1b0c915c4faa5fffa6cabf0219da63d7f4cb8"
        ],
        "apy": 1.92329,
        "apyBase": 1.92329,
        "apyReward": null,
        "tvlUsd": 49036,
        "pool": "ab6d4bd4-fa82-4f09-9588-98c953179d61"
      },
      "risk": {
        "contractAgeDays": 540,
        "auditFactor": 0.6,
        "tvlFactor": null,
        "depegEvents": [],
        "oracleType": "redstone",
        "liquiditySlippageBps": null,
        "counterpartyClass": "permissionless",
        "smartMoneySignal": null,
        "apyVolatility": 0.026747435344847643,
        "apyDrift": 0.6334953991167706
      },
      "probabilities": {
        "exploit": 0.008188151121405323,
        "depeg": 0.005,
        "oracle": 0.007,
        "illiquid": 0.053094849636278724,
        "counterparty": 0.005
      },
      "severities": {
        "exploit": 0.85,
        "depeg": 0.2,
        "oracle": 0.4,
        "illiquid": 0.05,
        "counterparty": 0.5
      },
      "expectedLoss": 0.015914670935008462,
      "raapy": 0.003318229064991539,
      "confidence": 0.6996710773028887,
      "score": 0.002321668904640387,
      "eligibleTranches": [],
      "primaryTranche": null,
      "rejectionReasons": [
        {
          "tranche": "senior",
          "reasons": [
            "tvlUsd 49036 < 25000000",
            "apyBase 1.92% < 2% (reward-only positions blocked)"
          ]
        },
        {
          "tranche": "mezzanine",
          "reasons": [
            "tvlUsd 49036 < 1000000"
          ]
        },
        {
          "tranche": "junior",
          "reasons": [
            "tvlUsd 49036 < 100000"
          ]
        }
      ]
    },
    {
      "id": "agni:6a134700-f4a3-49ad-ad5a-fe1868b1c744",
      "source": "agni",
      "asset": "0x111111d2bf19e43c34263401e0cad979ed1cdb61",
      "apy": 0.0043825,
      "apyReward": 0,
      "apyType": "variable",
      "tvlUsd": 44583,
      "lastUpdatedMs": 1779306914842,
      "raw": {
        "chain": "Mantle",
        "project": "fluxion-network",
        "symbol": "USD1-USDT0",
        "underlyingTokens": [
          "0x111111d2bf19e43c34263401e0cad979ed1cdb61",
          "0x779ded0c9e1022225f8e0630b35a9b54be713736"
        ],
        "apy": 0.43825,
        "apyBase": 0.43825,
        "apyReward": null,
        "tvlUsd": 44583,
        "pool": "6a134700-f4a3-49ad-ad5a-fe1868b1c744"
      },
      "risk": {
        "contractAgeDays": 540,
        "auditFactor": 0.6,
        "tvlFactor": null,
        "depegEvents": [],
        "oracleType": "redstone",
        "liquiditySlippageBps": null,
        "counterpartyClass": "permissionless",
        "smartMoneySignal": null,
        "apyVolatility": 1.325984098520467,
        "apyDrift": 0.049963845226056645
      },
      "probabilities": {
        "exploit": 0.008234467001418009,
        "depeg": 0.005,
        "oracle": 0.007,
        "illiquid": 0.053508307111000825,
        "counterparty": 0.005
      },
      "severities": {
        "exploit": 0.85,
        "depeg": 0.2,
        "oracle": 0.4,
        "illiquid": 0.05,
        "counterparty": 0.5
      },
      "expectedLoss": 0.01597471230675535,
      "raapy": -0.011592212306755348,
      "confidence": 0.4897501637136682,
      "score": -0.005677287875037031,
      "eligibleTranches": [],
      "primaryTranche": null,
      "rejectionReasons": [
        {
          "tranche": "senior",
          "reasons": [
            "tvlUsd 44583 < 25000000",
            "apyBase 0.44% < 2% (reward-only positions blocked)"
          ]
        },
        {
          "tranche": "mezzanine",
          "reasons": [
            "tvlUsd 44583 < 1000000",
            "apyBase 0.44% < 1% (reward-only positions blocked)"
          ]
        },
        {
          "tranche": "junior",
          "reasons": [
            "tvlUsd 44583 < 100000"
          ]
        }
      ]
    },
    {
      "id": "mantleVault:4ecffa03-92a0-4eed-bb8b-7537ade00cae",
      "source": "mantleVault",
      "asset": "0xcda86a272531e8640cd7f1a92c01839911b90bb0",
      "apy": 0.0000072999999999999996,
      "apyReward": 0,
      "apyType": "variable",
      "tvlUsd": 33993,
      "lastUpdatedMs": 1779306914842,
      "raw": {
        "chain": "Mantle",
        "project": "minterest",
        "symbol": "METH",
        "underlyingTokens": [
          "0xcDA86A272531e8640cD7F1a92c01839911B90bb0"
        ],
        "apy": 0.00073,
        "apyBase": 0.00073,
        "apyReward": null,
        "tvlUsd": 33993,
        "pool": "4ecffa03-92a0-4eed-bb8b-7537ade00cae"
      },
      "risk": {
        "contractAgeDays": 365,
        "auditFactor": 0.6,
        "tvlFactor": null,
        "depegEvents": [],
        "oracleType": "redstone",
        "liquiditySlippageBps": null,
        "counterpartyClass": "permissionless",
        "smartMoneySignal": null,
        "apyVolatility": 3.231863830705852e-7,
        "apyDrift": 1.0488505747126424
      },
      "probabilities": {
        "exploit": 0.022119210920218072,
        "depeg": 0.005,
        "oracle": 0.007,
        "illiquid": 0.054686105057331506,
        "counterparty": 0.005
      },
      "severities": {
        "exploit": 0.85,
        "depeg": 0.2,
        "oracle": 0.4,
        "illiquid": 0.05,
        "counterparty": 0.5
      },
      "expectedLoss": 0.027835634535051935,
      "raapy": -0.027828334535051936,
      "confidence": 0.6996290982976333,
      "score": -0.019469512597883275,
      "eligibleTranches": [],
      "primaryTranche": null,
      "rejectionReasons": [
        {
          "tranche": "senior",
          "reasons": [
            "expectedLoss 0.0278 > 0.02",
            "tvlUsd 33993 < 25000000",
            "apyBase 0.00% < 2% (reward-only positions blocked)"
          ]
        },
        {
          "tranche": "mezzanine",
          "reasons": [
            "tvlUsd 33993 < 1000000",
            "apyBase 0.00% < 1% (reward-only positions blocked)"
          ]
        },
        {
          "tranche": "junior",
          "reasons": [
            "tvlUsd 33993 < 100000"
          ]
        }
      ]
    },
    {
      "id": "mantleVault:dc732e3d-d65b-4087-8d48-53e50bb47732",
      "source": "mantleVault",
      "asset": "0xc96de26018a54d51c097160568752c4e3bd6c364",
      "apy": 0.003801,
      "apyReward": 0.0124761,
      "apyType": "variable",
      "tvlUsd": 28256,
      "lastUpdatedMs": 1779306914842,
      "raw": {
        "chain": "Mantle",
        "project": "lendle-pooled-markets",
        "symbol": "FBTC",
        "underlyingTokens": [
          "0xC96dE26018A54D51c097160568752c4E3BD6C364"
        ],
        "apy": 1.6277,
        "apyBase": 0.3801,
        "apyReward": 1.24761,
        "tvlUsd": 28256,
        "pool": "dc732e3d-d65b-4087-8d48-53e50bb47732"
      },
      "risk": {
        "contractAgeDays": 365,
        "auditFactor": 0.6,
        "tvlFactor": null,
        "depegEvents": [],
        "oracleType": "redstone",
        "liquiditySlippageBps": null,
        "counterpartyClass": "permissionless",
        "smartMoneySignal": null,
        "apyVolatility": 0.0006570859264455708,
        "apyDrift": 1.2913625955141148
      },
      "probabilities": {
        "exploit": 0.022356966521726508,
        "depeg": 0.005,
        "oracle": 0.007,
        "illiquid": 0.05548889318102526,
        "counterparty": 0.005
      },
      "severities": {
        "exploit": 0.85,
        "depeg": 0.2,
        "oracle": 0.4,
        "illiquid": 0.05,
        "counterparty": 0.5
      },
      "expectedLoss": 0.028077866202518793,
      "raapy": -0.024276866202518795,
      "confidence": 0.6996127738091261,
      "score": -0.0169844057033372,
      "eligibleTranches": [],
      "primaryTranche": null,
      "rejectionReasons": [
        {
          "tranche": "senior",
          "reasons": [
            "expectedLoss 0.0281 > 0.02",
            "tvlUsd 28256 < 25000000",
            "apyBase 0.38% < 2% (reward-only positions blocked)"
          ]
        },
        {
          "tranche": "mezzanine",
          "reasons": [
            "tvlUsd 28256 < 1000000",
            "apyBase 0.38% < 1% (reward-only positions blocked)"
          ]
        },
        {
          "tranche": "junior",
          "reasons": [
            "tvlUsd 28256 < 100000"
          ]
        }
      ]
    },
    {
      "id": "mantleVault:d6c5fcec-1f1f-40e8-b732-076ece1462fc",
      "source": "mantleVault",
      "asset": "0x78c1b0c915c4faa5fffa6cabf0219da63d7f4cb8",
      "apy": 0.0000011,
      "apyReward": 0,
      "apyType": "variable",
      "tvlUsd": 22452,
      "lastUpdatedMs": 1779306914842,
      "raw": {
        "chain": "Mantle",
        "project": "minterest",
        "symbol": "WMNT",
        "underlyingTokens": [
          "0x78c1b0C915c4FAA5FffA6CAbf0219DA63d7f4cb8"
        ],
        "apy": 0.00011,
        "apyBase": 0.00011,
        "apyReward": null,
        "tvlUsd": 22452,
        "pool": "d6c5fcec-1f1f-40e8-b732-076ece1462fc"
      },
      "risk": {
        "contractAgeDays": 365,
        "auditFactor": 0.6,
        "tvlFactor": null,
        "depegEvents": [],
        "oracleType": "redstone",
        "liquiditySlippageBps": null,
        "counterpartyClass": "permissionless",
        "smartMoneySignal": null,
        "apyVolatility": 4.7404546313997834e-8,
        "apyDrift": 1.0476190476190477
      },
      "probabilities": {
        "exploit": 0.022652701336887873,
        "depeg": 0.005,
        "oracle": 0.007,
        "illiquid": 0.05648744966452365,
        "counterparty": 0.005
      },
      "severities": {
        "exploit": 0.85,
        "depeg": 0.2,
        "oracle": 0.4,
        "illiquid": 0.05,
        "counterparty": 0.5
      },
      "expectedLoss": 0.028379168619580876,
      "raapy": -0.028378068619580876,
      "confidence": 0.6996267662045258,
      "score": -0.0198540563794475,
      "eligibleTranches": [],
      "primaryTranche": null,
      "rejectionReasons": [
        {
          "tranche": "senior",
          "reasons": [
            "expectedLoss 0.0284 > 0.02",
            "tvlUsd 22452 < 25000000",
            "apyBase 0.00% < 2% (reward-only positions blocked)"
          ]
        },
        {
          "tranche": "mezzanine",
          "reasons": [
            "tvlUsd 22452 < 1000000",
            "apyBase 0.00% < 1% (reward-only positions blocked)"
          ]
        },
        {
          "tranche": "junior",
          "reasons": [
            "tvlUsd 22452 < 100000"
          ]
        }
      ]
    },
    {
      "id": "cian:6eec4d69-bcad-48b9-aa3a-31005778de19",
      "source": "cian",
      "asset": "0xcda86a272531e8640cd7f1a92c01839911b90bb0",
      "apy": 0.0044471,
      "apyReward": 0,
      "apyType": "variable",
      "tvlUsd": 17582,
      "lastUpdatedMs": 1779306914842,
      "raw": {
        "chain": "Mantle",
        "project": "beefy",
        "symbol": "METH-WETH",
        "underlyingTokens": [
          "0xcDA86A272531e8640cD7F1a92c01839911B90bb0",
          "0xdEAddEaDdeadDEadDEADDEAddEADDEAddead1111"
        ],
        "apy": 0.44471,
        "apyBase": null,
        "apyReward": null,
        "tvlUsd": 17582,
        "pool": "6eec4d69-bcad-48b9-aa3a-31005778de19"
      },
      "risk": {
        "contractAgeDays": 300,
        "auditFactor": 0.6,
        "tvlFactor": null,
        "depegEvents": [],
        "oracleType": "custom_multi",
        "liquiditySlippageBps": null,
        "counterpartyClass": "permissionless",
        "smartMoneySignal": null,
        "apyVolatility": 0.04626106733673326,
        "apyDrift": 0.15973448824243033
      },
      "probabilities": {
        "exploit": 0.03295614159872595,
        "depeg": 0.005,
        "oracle": 0.02,
        "illiquid": 0.05754931724281601,
        "counterparty": 0.005
      },
      "severities": {
        "exploit": 0.85,
        "depeg": 0.2,
        "oracle": 0.4,
        "illiquid": 0.05,
        "counterparty": 0.5
      },
      "expectedLoss": 0.04239018622105786,
      "raapy": -0.03794308622105786,
      "confidence": 0.48974363375501845,
      "score": -0.018582384921780846,
      "eligibleTranches": [],
      "primaryTranche": null,
      "rejectionReasons": [
        {
          "tranche": "senior",
          "reasons": [
            "expectedLoss 0.0424 > 0.02",
            "tvlUsd 17582 < 25000000",
            "apyBase 0.44% < 2% (reward-only positions blocked)"
          ]
        },
        {
          "tranche": "mezzanine",
          "reasons": [
            "expectedLoss 0.0424 > 0.04",
            "tvlUsd 17582 < 1000000",
            "apyBase 0.44% < 1% (reward-only positions blocked)"
          ]
        },
        {
          "tranche": "junior",
          "reasons": [
            "tvlUsd 17582 < 100000"
          ]
        }
      ]
    },
    {
      "id": "mantleVault:e118b8cb-a7f6-4619-8844-791956db623b",
      "source": "mantleVault",
      "asset": "0xcda86a272531e8640cd7f1a92c01839911b90bb0",
      "apy": 1.0000000000000001e-7,
      "apyReward": 0,
      "apyType": "variable",
      "tvlUsd": 14707,
      "lastUpdatedMs": 1779306914842,
      "raw": {
        "chain": "Mantle",
        "project": "aurelius",
        "symbol": "METH",
        "underlyingTokens": [
          "0xcDA86A272531e8640cD7F1a92c01839911B90bb0"
        ],
        "apy": 0.00001,
        "apyBase": 0.00001,
        "apyReward": 0,
        "tvlUsd": 14707,
        "pool": "e118b8cb-a7f6-4619-8844-791956db623b"
      },
      "risk": {
        "contractAgeDays": 365,
        "auditFactor": 0.6,
        "tvlFactor": null,
        "depegEvents": [],
        "oracleType": "redstone",
        "liquiditySlippageBps": null,
        "counterpartyClass": "permissionless",
        "smartMoneySignal": null,
        "apyVolatility": 5.32361416875841e-23,
        "apyDrift": 1.0000000000000007
      },
      "probabilities": {
        "exploit": 0.023196843173746023,
        "depeg": 0.005,
        "oracle": 0.007,
        "illiquid": 0.058324759075797906,
        "counterparty": 0.005
      },
      "severities": {
        "exploit": 0.85,
        "depeg": 0.2,
        "oracle": 0.4,
        "illiquid": 0.05,
        "counterparty": 0.5
      },
      "expectedLoss": 0.028933554651474014,
      "raapy": -0.028933454651474014,
      "confidence": 0.6996687450698513,
      "score": -0.020243833906532276,
      "eligibleTranches": [],
      "primaryTranche": null,
      "rejectionReasons": [
        {
          "tranche": "senior",
          "reasons": [
            "expectedLoss 0.0289 > 0.02",
            "tvlUsd 14707 < 25000000",
            "apyBase 0.00% < 2% (reward-only positions blocked)"
          ]
        },
        {
          "tranche": "mezzanine",
          "reasons": [
            "tvlUsd 14707 < 1000000",
            "apyBase 0.00% < 1% (reward-only positions blocked)"
          ]
        },
        {
          "tranche": "junior",
          "reasons": [
            "tvlUsd 14707 < 100000"
          ]
        }
      ]
    },
    {
      "id": "fbtc:d8733ab8-a147-4e31-a668-2c9dff24ea56",
      "source": "fbtc",
      "asset": "0x201eba5cc46d216ce6dc03f6a759e8e766e956ae",
      "apy": 0.1079249,
      "apyReward": 0.0201292,
      "apyType": "variable",
      "tvlUsd": 14659,
      "lastUpdatedMs": 1779306914842,
      "raw": {
        "chain": "Mantle",
        "project": "clearpool-lending",
        "symbol": "USDT",
        "underlyingTokens": [
          "0x201eba5cc46d216ce6dc03f6a759e8e766e956ae"
        ],
        "apy": 12.80541,
        "apyBase": 10.79249,
        "apyReward": 2.01292,
        "tvlUsd": 14659,
        "pool": "d8733ab8-a147-4e31-a668-2c9dff24ea56"
      },
      "risk": {
        "contractAgeDays": 365,
        "auditFactor": 0.6,
        "tvlFactor": null,
        "depegEvents": [],
        "oracleType": "custom_multi",
        "liquiditySlippageBps": null,
        "counterpartyClass": "custodial",
        "smartMoneySignal": null,
        "apyVolatility": 0.03324704508115632,
        "apyDrift": 1.2014583167248043
      },
      "probabilities": {
        "exploit": 0.02320104793126019,
        "depeg": 0.005,
        "oracle": 0.02,
        "illiquid": 0.05833895655158384,
        "counterparty": 0.08
      },
      "severities": {
        "exploit": 0.85,
        "depeg": 0.2,
        "oracle": 0.4,
        "illiquid": 0.05,
        "counterparty": 0.5
      },
      "expectedLoss": 0.07163783856915035,
      "raapy": 0.03628706143084966,
      "confidence": 0.48925576576131125,
      "score": 0.01775365402757809,
      "eligibleTranches": [],
      "primaryTranche": null,
      "rejectionReasons": [
        {
          "tranche": "senior",
          "reasons": [
            "expectedLoss 0.0716 > 0.02",
            "tvlUsd 14659 < 25000000",
            "apy 10.79% > 8% (too-good-to-be-true gate)"
          ]
        },
        {
          "tranche": "mezzanine",
          "reasons": [
            "expectedLoss 0.0716 > 0.04",
            "tvlUsd 14659 < 1000000"
          ]
        },
        {
          "tranche": "junior",
          "reasons": [
            "tvlUsd 14659 < 100000"
          ]
        }
      ]
    },
    {
      "id": "mantleVault:edc32e93-0feb-4d38-bb73-366bb4a2aace",
      "source": "mantleVault",
      "asset": "0xdeaddeaddeaddeaddeaddeaddeaddeaddead1111",
      "apy": 0.000047600000000000005,
      "apyReward": 0,
      "apyType": "variable",
      "tvlUsd": 10495,
      "lastUpdatedMs": 1779306914842,
      "raw": {
        "chain": "Mantle",
        "project": "minterest",
        "symbol": "WETH",
        "underlyingTokens": [
          "0xdEAddEaDdeadDEadDEADDEAddEADDEAddead1111"
        ],
        "apy": 0.00476,
        "apyBase": 0.00476,
        "apyReward": null,
        "tvlUsd": 10495,
        "pool": "edc32e93-0feb-4d38-bb73-366bb4a2aace"
      },
      "risk": {
        "contractAgeDays": 365,
        "auditFactor": 0.6,
        "tvlFactor": null,
        "depegEvents": [],
        "oracleType": "redstone",
        "liquiditySlippageBps": null,
        "counterpartyClass": "permissionless",
        "smartMoneySignal": null,
        "apyVolatility": 0.000002877001013461878,
        "apyDrift": 0.9596095590710197
      },
      "probabilities": {
        "exploit": 0.023630844337876697,
        "depeg": 0.005,
        "oracle": 0.007,
        "illiquid": 0.05979017557081581,
        "counterparty": 0.005
      },
      "severities": {
        "exploit": 0.85,
        "depeg": 0.2,
        "oracle": 0.4,
        "illiquid": 0.05,
        "counterparty": 0.5
      },
      "expectedLoss": 0.029375726465735986,
      "raapy": -0.029328126465735987,
      "confidence": 0.6996290982976333,
      "score": -0.020518810673981824,
      "eligibleTranches": [],
      "primaryTranche": null,
      "rejectionReasons": [
        {
          "tranche": "senior",
          "reasons": [
            "expectedLoss 0.0294 > 0.02",
            "tvlUsd 10495 < 25000000",
            "apyBase 0.00% < 2% (reward-only positions blocked)"
          ]
        },
        {
          "tranche": "mezzanine",
          "reasons": [
            "tvlUsd 10495 < 1000000",
            "apyBase 0.00% < 1% (reward-only positions blocked)"
          ]
        },
        {
          "tranche": "junior",
          "reasons": [
            "tvlUsd 10495 < 100000"
          ]
        }
      ]
    },
    {
      "id": "mantleVault:ae619265-65fd-4584-8934-16a66dc50af3",
      "source": "mantleVault",
      "asset": "0x09bc4e0d864854c6afb6eb9a9cdf58ac190d0df9",
      "apy": 0.0002029,
      "apyReward": 0,
      "apyType": "variable",
      "tvlUsd": 10373,
      "lastUpdatedMs": 1779306914842,
      "raw": {
        "chain": "Mantle",
        "project": "minterest",
        "symbol": "USDC",
        "underlyingTokens": [
          "0x09Bc4E0D864854c6aFB6eB9A9cdF58aC190D0dF9"
        ],
        "apy": 0.02029,
        "apyBase": 0.02029,
        "apyReward": null,
        "tvlUsd": 10373,
        "pool": "ae619265-65fd-4584-8934-16a66dc50af3"
      },
      "risk": {
        "contractAgeDays": 365,
        "auditFactor": 0.6,
        "tvlFactor": null,
        "depegEvents": [],
        "oracleType": "redstone",
        "liquiditySlippageBps": null,
        "counterpartyClass": "permissionless",
        "smartMoneySignal": null,
        "apyVolatility": 0.0000014545481642240123,
        "apyDrift": 1.007331159911958
      },
      "probabilities": {
        "exploit": 0.023645883653586244,
        "depeg": 0.005,
        "oracle": 0.007,
        "illiquid": 0.059840956221044475,
        "counterparty": 0.005
      },
      "severities": {
        "exploit": 0.85,
        "depeg": 0.2,
        "oracle": 0.4,
        "illiquid": 0.05,
        "counterparty": 0.5
      },
      "expectedLoss": 0.02939104891660053,
      "raapy": -0.029188148916600532,
      "confidence": 0.6990020453768989,
      "score": -0.02040257579346929,
      "eligibleTranches": [],
      "primaryTranche": null,
      "rejectionReasons": [
        {
          "tranche": "senior",
          "reasons": [
            "expectedLoss 0.0294 > 0.02",
            "tvlUsd 10373 < 25000000",
            "apyBase 0.02% < 2% (reward-only positions blocked)"
          ]
        },
        {
          "tranche": "mezzanine",
          "reasons": [
            "tvlUsd 10373 < 1000000",
            "apyBase 0.02% < 1% (reward-only positions blocked)"
          ]
        },
        {
          "tranche": "junior",
          "reasons": [
            "tvlUsd 10373 < 100000"
          ]
        }
      ]
    },
    {
      "id": "mantleVault:3441a15d-5f50-4a52-af27-597c182c5c4a",
      "source": "mantleVault",
      "asset": "0x201eba5cc46d216ce6dc03f6a759e8e766e956ae",
      "apy": 0.00042009999999999997,
      "apyReward": 0,
      "apyType": "variable",
      "tvlUsd": 6368,
      "lastUpdatedMs": 1779306914842,
      "raw": {
        "chain": "Mantle",
        "project": "minterest",
        "symbol": "USDT",
        "underlyingTokens": [
          "0x201EBa5CC46D216Ce6DC03F6a759e8E766e956aE"
        ],
        "apy": 0.04201,
        "apyBase": 0.04201,
        "apyReward": null,
        "tvlUsd": 6368,
        "pool": "3441a15d-5f50-4a52-af27-597c182c5c4a"
      },
      "risk": {
        "contractAgeDays": 365,
        "auditFactor": 0.6,
        "tvlFactor": null,
        "depegEvents": [],
        "oracleType": "redstone",
        "liquiditySlippageBps": null,
        "counterpartyClass": "permissionless",
        "smartMoneySignal": null,
        "apyVolatility": 0.000013941865611498642,
        "apyDrift": 1.0597836369675537
      },
      "probabilities": {
        "exploit": 0.024273455550364465,
        "depeg": 0.005,
        "oracle": 0.007,
        "illiquid": 0.06195996945270388,
        "counterparty": 0.005
      },
      "severities": {
        "exploit": 0.85,
        "depeg": 0.2,
        "oracle": 0.4,
        "illiquid": 0.05,
        "counterparty": 0.5
      },
      "expectedLoss": 0.03003043569044499,
      "raapy": -0.02961033569044499,
      "confidence": 0.6989391380236885,
      "score": -0.02069582250407168,
      "eligibleTranches": [],
      "primaryTranche": null,
      "rejectionReasons": [
        {
          "tranche": "senior",
          "reasons": [
            "expectedLoss 0.0300 > 0.02",
            "tvlUsd 6368 < 25000000",
            "apyBase 0.04% < 2% (reward-only positions blocked)"
          ]
        },
        {
          "tranche": "mezzanine",
          "reasons": [
            "tvlUsd 6368 < 1000000",
            "apyBase 0.04% < 1% (reward-only positions blocked)"
          ]
        },
        {
          "tranche": "junior",
          "reasons": [
            "tvlUsd 6368 < 100000"
          ]
        }
      ]
    },
    {
      "id": "mantleVault:7be673f4-8b41-4d3f-a533-45d20d62e8fa",
      "source": "mantleVault",
      "asset": "0xcabae6f6ea1ecab08ad02fe02ce9a44f09aebfa2",
      "apy": 0.0071475,
      "apyReward": 0.0002391,
      "apyType": "variable",
      "tvlUsd": 5896,
      "lastUpdatedMs": 1779306914842,
      "raw": {
        "chain": "Mantle",
        "project": "lendle-pooled-markets",
        "symbol": "WBTC",
        "underlyingTokens": [
          "0xCAbAE6f6Ea1ecaB08Ad02fE02ce9A44F09aebfA2"
        ],
        "apy": 0.73866,
        "apyBase": 0.71475,
        "apyReward": 0.02391,
        "tvlUsd": 5896,
        "pool": "7be673f4-8b41-4d3f-a533-45d20d62e8fa"
      },
      "risk": {
        "contractAgeDays": 365,
        "auditFactor": 0.6,
        "tvlFactor": null,
        "depegEvents": [],
        "oracleType": "redstone",
        "liquiditySlippageBps": null,
        "counterpartyClass": "permissionless",
        "smartMoneySignal": null,
        "apyVolatility": 0.002154469108754064,
        "apyDrift": 2.66859676081612
      },
      "probabilities": {
        "exploit": 0.024372508759139544,
        "depeg": 0.005,
        "oracle": 0.007,
        "illiquid": 0.06229442525149005,
        "counterparty": 0.005
      },
      "severities": {
        "exploit": 0.85,
        "depeg": 0.2,
        "oracle": 0.4,
        "illiquid": 0.05,
        "counterparty": 0.5
      },
      "expectedLoss": 0.030131353707843114,
      "raapy": -0.022983853707843113,
      "confidence": 0.48972567681765994,
      "score": -0.011255783312951552,
      "eligibleTranches": [],
      "primaryTranche": null,
      "rejectionReasons": [
        {
          "tranche": "senior",
          "reasons": [
            "expectedLoss 0.0301 > 0.02",
            "tvlUsd 5896 < 25000000",
            "apyBase 0.71% < 2% (reward-only positions blocked)"
          ]
        },
        {
          "tranche": "mezzanine",
          "reasons": [
            "tvlUsd 5896 < 1000000",
            "apyBase 0.71% < 1% (reward-only positions blocked)"
          ]
        },
        {
          "tranche": "junior",
          "reasons": [
            "tvlUsd 5896 < 100000"
          ]
        }
      ]
    },
    {
      "id": "mantleVault:f7150467-f302-41e8-9f9a-1f73d2b49df4",
      "source": "mantleVault",
      "asset": "0x5d3a1ff2b6bab83b63cd9ad0787074081a52ef34",
      "apy": 0.4920572,
      "apyReward": 0.005412,
      "apyType": "variable",
      "tvlUsd": 3146,
      "lastUpdatedMs": 1779306914842,
      "raw": {
        "chain": "Mantle",
        "project": "lendle-pooled-markets",
        "symbol": "USDE",
        "underlyingTokens": [
          "0x5d3a1Ff2b6BAb83b63cd9AD0787074081a52ef34"
        ],
        "apy": 49.74693,
        "apyBase": 49.20572,
        "apyReward": 0.5412,
        "tvlUsd": 3146,
        "pool": "f7150467-f302-41e8-9f9a-1f73d2b49df4"
      },
      "risk": {
        "contractAgeDays": 365,
        "auditFactor": 0.6,
        "tvlFactor": null,
        "depegEvents": [],
        "oracleType": "redstone",
        "liquiditySlippageBps": null,
        "counterpartyClass": "permissionless",
        "smartMoneySignal": null,
        "apyVolatility": 0.19389728248687932,
        "apyDrift": 119.43284928264706
      },
      "probabilities": {
        "exploit": 0.02518043591380564,
        "depeg": 0.005,
        "oracle": 0.007,
        "illiquid": 0.06502241281712733,
        "counterparty": 0.005
      },
      "severities": {
        "exploit": 0.85,
        "depeg": 0.2,
        "oracle": 0.4,
        "illiquid": 0.05,
        "counterparty": 0.5
      },
      "expectedLoss": 0.03095449116759116,
      "raapy": 0.46110270883240884,
      "confidence": 0.3425075771417836,
      "score": 0.15793117161570164,
      "eligibleTranches": [],
      "primaryTranche": null,
      "rejectionReasons": [
        {
          "tranche": "senior",
          "reasons": [
            "expectedLoss 0.0310 > 0.02",
            "tvlUsd 3146 < 25000000",
            "apy 49.21% > 8% (too-good-to-be-true gate)"
          ]
        },
        {
          "tranche": "mezzanine",
          "reasons": [
            "tvlUsd 3146 < 1000000",
            "apy 49.21% > 20% (too-good-to-be-true gate)"
          ]
        },
        {
          "tranche": "junior",
          "reasons": [
            "tvlUsd 3146 < 100000"
          ]
        }
      ]
    },
    {
      "id": "mantleVault:4f9047f1-ca9f-4b30-b5ad-c7a900c38cae",
      "source": "mantleVault",
      "asset": "0xdeaddeaddeaddeaddeaddeaddeaddeaddead1111",
      "apy": 0.4335303,
      "apyReward": 0.0149853,
      "apyType": "variable",
      "tvlUsd": 2944,
      "lastUpdatedMs": 1779306914842,
      "raw": {
        "chain": "Mantle",
        "project": "lendle-pooled-markets",
        "symbol": "WETH",
        "underlyingTokens": [
          "0xdEAddEaDdeadDEadDEADDEAddEADDEAddead1111"
        ],
        "apy": 44.85157,
        "apyBase": 43.35303,
        "apyReward": 1.49853,
        "tvlUsd": 2944,
        "pool": "4f9047f1-ca9f-4b30-b5ad-c7a900c38cae"
      },
      "risk": {
        "contractAgeDays": 365,
        "auditFactor": 0.6,
        "tvlFactor": null,
        "depegEvents": [],
        "oracleType": "redstone",
        "liquiditySlippageBps": null,
        "counterpartyClass": "permissionless",
        "smartMoneySignal": null,
        "apyVolatility": 0.3024342641750305,
        "apyDrift": 3.694840342820245
      },
      "probabilities": {
        "exploit": 0.025265792600260982,
        "depeg": 0.005,
        "oracle": 0.007,
        "illiquid": 0.06531062194334539,
        "counterparty": 0.005
      },
      "severities": {
        "exploit": 0.85,
        "depeg": 0.2,
        "oracle": 0.4,
        "illiquid": 0.05,
        "counterparty": 0.5
      },
      "expectedLoss": 0.031041454807389103,
      "raapy": 0.40248884519261086,
      "confidence": 0.34280683108102056,
      "score": 0.13797592556593838,
      "eligibleTranches": [],
      "primaryTranche": null,
      "rejectionReasons": [
        {
          "tranche": "senior",
          "reasons": [
            "expectedLoss 0.0310 > 0.02",
            "tvlUsd 2944 < 25000000",
            "apy 43.35% > 8% (too-good-to-be-true gate)"
          ]
        },
        {
          "tranche": "mezzanine",
          "reasons": [
            "tvlUsd 2944 < 1000000",
            "apy 43.35% > 20% (too-good-to-be-true gate)"
          ]
        },
        {
          "tranche": "junior",
          "reasons": [
            "tvlUsd 2944 < 100000"
          ]
        }
      ]
    },
    {
      "id": "mantleVault:a5a47cdc-2ca5-4348-ade9-4adddb1d12d5",
      "source": "mantleVault",
      "asset": "0xe6829d9a7ee3040e1276fa75293bde931859e8fa",
      "apy": 0.0002103,
      "apyReward": 0,
      "apyType": "variable",
      "tvlUsd": 2313,
      "lastUpdatedMs": 1779306914842,
      "raw": {
        "chain": "Mantle",
        "project": "minterest",
        "symbol": "CMETH",
        "underlyingTokens": [
          "0xE6829d9a7eE3040e1276Fa75293Bde931859e8fA"
        ],
        "apy": 0.02103,
        "apyBase": 0.02103,
        "apyReward": null,
        "tvlUsd": 2313,
        "pool": "a5a47cdc-2ca5-4348-ade9-4adddb1d12d5"
      },
      "risk": {
        "contractAgeDays": 365,
        "auditFactor": 0.6,
        "tvlFactor": null,
        "depegEvents": [],
        "oracleType": "redstone",
        "liquiditySlippageBps": null,
        "counterpartyClass": "permissionless",
        "smartMoneySignal": null,
        "apyVolatility": 0.000004652750787183899,
        "apyDrift": 1.039913520705139
      },
      "probabilities": {
        "exploit": 0.025576058692855123,
        "depeg": 0.005,
        "oracle": 0.007,
        "illiquid": 0.06635824367229382,
        "counterparty": 0.005
      },
      "severities": {
        "exploit": 0.85,
        "depeg": 0.2,
        "oracle": 0.4,
        "illiquid": 0.05,
        "counterparty": 0.5
      },
      "expectedLoss": 0.03135756207254155,
      "raapy": -0.031147262072541548,
      "confidence": 0.6996384267478001,
      "score": -0.02179182143393439,
      "eligibleTranches": [],
      "primaryTranche": null,
      "rejectionReasons": [
        {
          "tranche": "senior",
          "reasons": [
            "expectedLoss 0.0314 > 0.02",
            "tvlUsd 2313 < 25000000",
            "apyBase 0.02% < 2% (reward-only positions blocked)"
          ]
        },
        {
          "tranche": "mezzanine",
          "reasons": [
            "tvlUsd 2313 < 1000000",
            "apyBase 0.02% < 1% (reward-only positions blocked)"
          ]
        },
        {
          "tranche": "junior",
          "reasons": [
            "tvlUsd 2313 < 100000"
          ]
        }
      ]
    },
    {
      "id": "mantleVault:dce58852-9976-4141-b26a-a832c5edc34e",
      "source": "mantleVault",
      "asset": "0x201eba5cc46d216ce6dc03f6a759e8e766e956ae",
      "apy": 0.5097100999999999,
      "apyReward": 0.0147463,
      "apyType": "variable",
      "tvlUsd": 2134,
      "lastUpdatedMs": 1779306914842,
      "raw": {
        "chain": "Mantle",
        "project": "lendle-pooled-markets",
        "symbol": "USDT",
        "underlyingTokens": [
          "0x201EBa5CC46D216Ce6DC03F6a759e8E766e956aE"
        ],
        "apy": 52.44564,
        "apyBase": 50.97101,
        "apyReward": 1.47463,
        "tvlUsd": 2134,
        "pool": "dce58852-9976-4141-b26a-a832c5edc34e"
      },
      "risk": {
        "contractAgeDays": 365,
        "auditFactor": 0.6,
        "tvlFactor": null,
        "depegEvents": [],
        "oracleType": "redstone",
        "liquiditySlippageBps": null,
        "counterpartyClass": "permissionless",
        "smartMoneySignal": null,
        "apyVolatility": 0.22481687264705344,
        "apyDrift": 3.550185237991232
      },
      "probabilities": {
        "exploit": 0.025679659882335275,
        "depeg": 0.005,
        "oracle": 0.007,
        "illiquid": 0.06670805584911549,
        "counterparty": 0.005
      },
      "severities": {
        "exploit": 0.85,
        "depeg": 0.2,
        "oracle": 0.4,
        "illiquid": 0.05,
        "counterparty": 0.5
      },
      "expectedLoss": 0.03146311369244076,
      "raapy": 0.4782469863075592,
      "confidence": 0.34247903603291785,
      "score": 0.16378956685626092,
      "eligibleTranches": [],
      "primaryTranche": null,
      "rejectionReasons": [
        {
          "tranche": "senior",
          "reasons": [
            "expectedLoss 0.0315 > 0.02",
            "tvlUsd 2134 < 25000000",
            "apy 50.97% > 8% (too-good-to-be-true gate)"
          ]
        },
        {
          "tranche": "mezzanine",
          "reasons": [
            "tvlUsd 2134 < 1000000",
            "apy 50.97% > 20% (too-good-to-be-true gate)"
          ]
        },
        {
          "tranche": "junior",
          "reasons": [
            "tvlUsd 2134 < 100000"
          ]
        }
      ]
    },
    {
      "id": "mantleVault:f988235b-39ab-43b4-a0e9-5ce2cd1924cb",
      "source": "mantleVault",
      "asset": "0x00000000efe302beaa2b3e6e1b18d08d69a9012a",
      "apy": 3.9838749,
      "apyReward": 0.3574606,
      "apyType": "variable",
      "tvlUsd": 857,
      "lastUpdatedMs": 1779306914842,
      "raw": {
        "chain": "Mantle",
        "project": "lendle-pooled-markets",
        "symbol": "AUSD",
        "underlyingTokens": [
          "0x00000000eFE302BEAA2b3e6e1b18d08D69a9012a"
        ],
        "apy": 434.13355,
        "apyBase": 398.38749,
        "apyReward": 35.74606,
        "tvlUsd": 857,
        "pool": "f988235b-39ab-43b4-a0e9-5ce2cd1924cb"
      },
      "risk": {
        "contractAgeDays": 365,
        "auditFactor": 0.6,
        "tvlFactor": null,
        "depegEvents": [],
        "oracleType": "redstone",
        "liquiditySlippageBps": null,
        "counterpartyClass": "permissionless",
        "smartMoneySignal": null,
        "apyVolatility": 1.098949651217116,
        "apyDrift": 5.845534361800809
      },
      "probabilities": {
        "exploit": 0.026853095293105755,
        "depeg": 0.005,
        "oracle": 0.007,
        "illiquid": 0.07067019178076803,
        "counterparty": 0.005
      },
      "severities": {
        "exploit": 0.85,
        "depeg": 0.2,
        "oracle": 0.4,
        "illiquid": 0.05,
        "counterparty": 0.5
      },
      "expectedLoss": 0.03265864058817829,
      "raapy": 3.951216259411822,
      "confidence": 0.342813687286204,
      "score": 1.354531015154169,
      "eligibleTranches": [],
      "primaryTranche": null,
      "rejectionReasons": [
        {
          "tranche": "senior",
          "reasons": [
            "expectedLoss 0.0327 > 0.02",
            "tvlUsd 857 < 25000000",
            "apy 398.39% > 8% (too-good-to-be-true gate)"
          ]
        },
        {
          "tranche": "mezzanine",
          "reasons": [
            "tvlUsd 857 < 1000000",
            "apy 398.39% > 20% (too-good-to-be-true gate)"
          ]
        },
        {
          "tranche": "junior",
          "reasons": [
            "tvlUsd 857 < 100000"
          ]
        }
      ]
    },
    {
      "id": "mantleVault:46cbb5d7-5462-443b-886a-f371349a5d8c",
      "source": "mantleVault",
      "asset": "0x5be26527e817998a7206475496fde1e68957c5a6",
      "apy": 0.011708799999999998,
      "apyReward": 0,
      "apyType": "variable",
      "tvlUsd": 822,
      "lastUpdatedMs": 1779306914842,
      "raw": {
        "chain": "Mantle",
        "project": "minterest",
        "symbol": "USDY",
        "underlyingTokens": [
          "0x5bE26527e817998A7206475496fDE1E68957c5A6"
        ],
        "apy": 1.17088,
        "apyBase": 1.17088,
        "apyReward": null,
        "tvlUsd": 822,
        "pool": "46cbb5d7-5462-443b-886a-f371349a5d8c"
      },
      "risk": {
        "contractAgeDays": 365,
        "auditFactor": 0.6,
        "tvlFactor": null,
        "depegEvents": [],
        "oracleType": "redstone",
        "liquiditySlippageBps": null,
        "counterpartyClass": "permissionless",
        "smartMoneySignal": null,
        "apyVolatility": 0.004936482284246207,
        "apyDrift": 9.95816035914269
      },
      "probabilities": {
        "exploit": 0.026906727342494132,
        "depeg": 0.005,
        "oracle": 0.007,
        "illiquid": 0.0708512818245995,
        "counterparty": 0.005
      },
      "severities": {
        "exploit": 0.85,
        "depeg": 0.2,
        "oracle": 0.4,
        "illiquid": 0.05,
        "counterparty": 0.5
      },
      "expectedLoss": 0.03271328233234999,
      "raapy": -0.021004482332349993,
      "confidence": 0.48974363375501845,
      "score": -0.01028681150258817,
      "eligibleTranches": [],
      "primaryTranche": null,
      "rejectionReasons": [
        {
          "tranche": "senior",
          "reasons": [
            "expectedLoss 0.0327 > 0.02",
            "tvlUsd 822 < 25000000",
            "apyBase 1.17% < 2% (reward-only positions blocked)"
          ]
        },
        {
          "tranche": "mezzanine",
          "reasons": [
            "tvlUsd 822 < 1000000"
          ]
        },
        {
          "tranche": "junior",
          "reasons": [
            "tvlUsd 822 < 100000"
          ]
        }
      ]
    },
    {
      "id": "fbtc:c5f53253-269e-4b61-a9b8-b9b76cfa8480",
      "source": "fbtc",
      "asset": "0x201eba5cc46d216ce6dc03f6a759e8e766e956ae",
      "apy": 1.0000000000000001e-7,
      "apyReward": 0,
      "apyType": "variable",
      "tvlUsd": 124,
      "lastUpdatedMs": 1779306914842,
      "raw": {
        "chain": "Mantle",
        "project": "clearpool-lending",
        "symbol": "USDT",
        "underlyingTokens": [
          "0x201eba5cc46d216ce6dc03f6a759e8e766e956ae"
        ],
        "apy": 0.00001,
        "apyBase": 0.00001,
        "apyReward": 0,
        "tvlUsd": 124,
        "pool": "c5f53253-269e-4b61-a9b8-b9b76cfa8480"
      },
      "risk": {
        "contractAgeDays": 365,
        "auditFactor": 0.6,
        "tvlFactor": null,
        "depegEvents": [],
        "oracleType": "custom_multi",
        "liquiditySlippageBps": null,
        "counterpartyClass": "custodial",
        "smartMoneySignal": null,
        "apyVolatility": 0.07337505040530395,
        "apyDrift": 1.1313184062280439e-7
      },
      "probabilities": {
        "exploit": 0.029339553197391528,
        "depeg": 0.005,
        "oracle": 0.02,
        "illiquid": 0.07906578314837766,
        "counterparty": 0.08
      },
      "severities": {
        "exploit": 0.85,
        "depeg": 0.2,
        "oracle": 0.4,
        "illiquid": 0.05,
        "counterparty": 0.5
      },
      "expectedLoss": 0.07789190937520168,
      "raapy": -0.07789180937520168,
      "confidence": 0.4892590274772887,
      "score": -0.038109270903357535,
      "eligibleTranches": [],
      "primaryTranche": null,
      "rejectionReasons": [
        {
          "tranche": "senior",
          "reasons": [
            "expectedLoss 0.0779 > 0.02",
            "tvlUsd 124 < 25000000",
            "apyBase 0.00% < 2% (reward-only positions blocked)"
          ]
        },
        {
          "tranche": "mezzanine",
          "reasons": [
            "expectedLoss 0.0779 > 0.04",
            "tvlUsd 124 < 1000000",
            "apyBase 0.00% < 1% (reward-only positions blocked)"
          ]
        },
        {
          "tranche": "junior",
          "reasons": [
            "tvlUsd 124 < 100000"
          ]
        }
      ]
    },
    {
      "id": "mantleVault:c91016e0-d075-4bb4-a1c7-465f1c11dc14",
      "source": "mantleVault",
      "asset": "0x211cc4dd073734da055fbf44a2b4667d5e5fe5d2",
      "apy": 0,
      "apyReward": 0.0762024,
      "apyType": "variable",
      "tvlUsd": 26,
      "lastUpdatedMs": 1779306914842,
      "raw": {
        "chain": "Mantle",
        "project": "lendle-pooled-markets",
        "symbol": "SUSDE",
        "underlyingTokens": [
          "0x211Cc4DD073734dA055fbF44a2b4667d5E5fE5d2"
        ],
        "apy": 7.62024,
        "apyBase": 0,
        "apyReward": 7.62024,
        "tvlUsd": 26,
        "pool": "c91016e0-d075-4bb4-a1c7-465f1c11dc14"
      },
      "risk": {
        "contractAgeDays": 365,
        "auditFactor": 0.6,
        "tvlFactor": null,
        "depegEvents": [],
        "oracleType": "redstone",
        "liquiditySlippageBps": null,
        "counterpartyClass": "permissionless",
        "smartMoneySignal": null,
        "apyVolatility": 0,
        "apyDrift": 1
      },
      "probabilities": {
        "exploit": 0.03134886160319051,
        "depeg": 0.005,
        "oracle": 0.007,
        "illiquid": 0.08585026652029182,
        "counterparty": 0.005
      },
      "severities": {
        "exploit": 0.85,
        "depeg": 0.2,
        "oracle": 0.4,
        "illiquid": 0.05,
        "counterparty": 0.5
      },
      "expectedLoss": 0.037239045688726526,
      "raapy": -0.037239045688726526,
      "confidence": 0.6996151058555922,
      "score": -0.02605299889147964,
      "eligibleTranches": [],
      "primaryTranche": null,
      "rejectionReasons": [
        {
          "tranche": "senior",
          "reasons": [
            "expectedLoss 0.0372 > 0.02",
            "tvlUsd 26 < 25000000",
            "apyBase 0.00% < 2% (reward-only positions blocked)"
          ]
        },
        {
          "tranche": "mezzanine",
          "reasons": [
            "tvlUsd 26 < 1000000",
            "apyBase 0.00% < 1% (reward-only positions blocked)"
          ]
        },
        {
          "tranche": "junior",
          "reasons": [
            "tvlUsd 26 < 100000"
          ]
        }
      ]
    },
    {
      "id": "mantleVault:341123b4-b690-4d10-b2f8-b8fa64119220",
      "source": "mantleVault",
      "asset": "0x09bc4e0d864854c6afb6eb9a9cdf58ac190d0df9",
      "apy": 0.7037528000000001,
      "apyReward": 0.0121312,
      "apyType": "variable",
      "tvlUsd": 3,
      "lastUpdatedMs": 1779306914842,
      "raw": {
        "chain": "Mantle",
        "project": "lendle-pooled-markets",
        "symbol": "USDC",
        "underlyingTokens": [
          "0x09Bc4E0D864854c6aFB6eB9A9cdF58aC190D0dF9"
        ],
        "apy": 71.58839,
        "apyBase": 70.37528,
        "apyReward": 1.21312,
        "tvlUsd": 3,
        "pool": "341123b4-b690-4d10-b2f8-b8fa64119220"
      },
      "risk": {
        "contractAgeDays": 365,
        "auditFactor": 0.6,
        "tvlFactor": null,
        "depegEvents": [],
        "oracleType": "redstone",
        "liquiditySlippageBps": null,
        "counterpartyClass": "permissionless",
        "smartMoneySignal": null,
        "apyVolatility": 0.2969386727114919,
        "apyDrift": 7.255646017528937
      },
      "probabilities": {
        "exploit": 0.03412642621800958,
        "depeg": 0.005,
        "oracle": 0.007,
        "illiquid": 0.09522878745280339,
        "counterparty": 0.005
      },
      "severities": {
        "exploit": 0.85,
        "depeg": 0.2,
        "oracle": 0.4,
        "illiquid": 0.05,
        "counterparty": 0.5
      },
      "expectedLoss": 0.04006890165794831,
      "raapy": 0.6636838983420518,
      "confidence": 0.3425075771417836,
      "score": 0.22731676400914996,
      "eligibleTranches": [],
      "primaryTranche": null,
      "rejectionReasons": [
        {
          "tranche": "senior",
          "reasons": [
            "expectedLoss 0.0401 > 0.02",
            "tvlUsd 3 < 25000000",
            "apy 70.38% > 8% (too-good-to-be-true gate)"
          ]
        },
        {
          "tranche": "mezzanine",
          "reasons": [
            "expectedLoss 0.0401 > 0.04",
            "tvlUsd 3 < 1000000",
            "apy 70.38% > 20% (too-good-to-be-true gate)"
          ]
        },
        {
          "tranche": "junior",
          "reasons": [
            "tvlUsd 3 < 100000"
          ]
        }
      ]
    },
    {
      "id": "fbtc:098dd57e-f57a-4715-b408-65472b61afe8",
      "source": "fbtc",
      "asset": "0x201eba5cc46d216ce6dc03f6a759e8e766e956ae",
      "apy": 0.175,
      "apyReward": 0,
      "apyType": "variable",
      "tvlUsd": 0,
      "lastUpdatedMs": 1779306914842,
      "raw": {
        "chain": "Mantle",
        "project": "clearpool-lending",
        "symbol": "USDT",
        "underlyingTokens": [
          "0x201eba5cc46d216ce6dc03f6a759e8e766e956ae"
        ],
        "apy": 17.5,
        "apyBase": 17.5,
        "apyReward": null,
        "tvlUsd": 0,
        "pool": "098dd57e-f57a-4715-b408-65472b61afe8"
      },
      "risk": {
        "contractAgeDays": 365,
        "auditFactor": 0.6,
        "tvlFactor": null,
        "depegEvents": [],
        "oracleType": "custom_multi",
        "liquiditySlippageBps": null,
        "counterpartyClass": "custodial",
        "smartMoneySignal": null,
        "apyVolatility": null,
        "apyDrift": null
      },
      "probabilities": {
        "exploit": 0.03553947964468942,
        "depeg": 0.005,
        "oracle": 0.02,
        "illiquid": 0.1,
        "counterparty": 0.08
      },
      "severities": {
        "exploit": 0.85,
        "depeg": 0.2,
        "oracle": 0.4,
        "illiquid": 0.05,
        "counterparty": 0.5
      },
      "expectedLoss": 0.08420855769798602,
      "raapy": 0.09079144230201397,
      "confidence": 0.49924390558907017,
      "score": 0.045327074248922176,
      "eligibleTranches": [],
      "primaryTranche": null,
      "rejectionReasons": [
        {
          "tranche": "senior",
          "reasons": [
            "expectedLoss 0.0842 > 0.02",
            "tvlUsd 0 < 25000000",
            "apy 17.50% > 8% (too-good-to-be-true gate)"
          ]
        },
        {
          "tranche": "mezzanine",
          "reasons": [
            "expectedLoss 0.0842 > 0.04",
            "tvlUsd 0 < 1000000"
          ]
        },
        {
          "tranche": "junior",
          "reasons": [
            "tvlUsd 0 < 100000"
          ]
        }
      ]
    },
    {
      "id": "fbtc:df8d41a4-23cf-4276-8bb9-f49e0939fe97",
      "source": "fbtc",
      "asset": "0x09bc4e0d864854c6afb6eb9a9cdf58ac190d0df9",
      "apy": 0.1,
      "apyReward": 0,
      "apyType": "variable",
      "tvlUsd": 0,
      "lastUpdatedMs": 1779306914842,
      "raw": {
        "chain": "Mantle",
        "project": "clearpool-lending",
        "symbol": "USDC",
        "underlyingTokens": [
          "0x09bc4e0d864854c6afb6eb9a9cdf58ac190d0df9"
        ],
        "apy": 10,
        "apyBase": 10,
        "apyReward": null,
        "tvlUsd": 0,
        "pool": "df8d41a4-23cf-4276-8bb9-f49e0939fe97"
      },
      "risk": {
        "contractAgeDays": 365,
        "auditFactor": 0.6,
        "tvlFactor": null,
        "depegEvents": [],
        "oracleType": "custom_multi",
        "liquiditySlippageBps": null,
        "counterpartyClass": "custodial",
        "smartMoneySignal": null,
        "apyVolatility": null,
        "apyDrift": null
      },
      "probabilities": {
        "exploit": 0.03553947964468942,
        "depeg": 0.005,
        "oracle": 0.02,
        "illiquid": 0.1,
        "counterparty": 0.08
      },
      "severities": {
        "exploit": 0.85,
        "depeg": 0.2,
        "oracle": 0.4,
        "illiquid": 0.05,
        "counterparty": 0.5
      },
      "expectedLoss": 0.08420855769798602,
      "raapy": 0.015791442302013986,
      "confidence": 0.49929216816593075,
      "score": 0.00788454346543976,
      "eligibleTranches": [],
      "primaryTranche": null,
      "rejectionReasons": [
        {
          "tranche": "senior",
          "reasons": [
            "expectedLoss 0.0842 > 0.02",
            "tvlUsd 0 < 25000000",
            "apy 10.00% > 8% (too-good-to-be-true gate)"
          ]
        },
        {
          "tranche": "mezzanine",
          "reasons": [
            "expectedLoss 0.0842 > 0.04",
            "tvlUsd 0 < 1000000"
          ]
        },
        {
          "tranche": "junior",
          "reasons": [
            "tvlUsd 0 < 100000"
          ]
        }
      ]
    },
    {
      "id": "fbtc:8952653d-b613-4610-acaa-3df8a2466a0b",
      "source": "fbtc",
      "asset": "0x201eba5cc46d216ce6dc03f6a759e8e766e956ae",
      "apy": 0.13,
      "apyReward": 0,
      "apyType": "variable",
      "tvlUsd": 0,
      "lastUpdatedMs": 1779306914842,
      "raw": {
        "chain": "Mantle",
        "project": "clearpool-lending",
        "symbol": "USDT",
        "underlyingTokens": [
          "0x201eba5cc46d216ce6dc03f6a759e8e766e956ae"
        ],
        "apy": 13,
        "apyBase": 13,
        "apyReward": null,
        "tvlUsd": 0,
        "pool": "8952653d-b613-4610-acaa-3df8a2466a0b"
      },
      "risk": {
        "contractAgeDays": 365,
        "auditFactor": 0.6,
        "tvlFactor": null,
        "depegEvents": [],
        "oracleType": "custom_multi",
        "liquiditySlippageBps": null,
        "counterpartyClass": "custodial",
        "smartMoneySignal": null,
        "apyVolatility": null,
        "apyDrift": null
      },
      "probabilities": {
        "exploit": 0.03553947964468942,
        "depeg": 0.005,
        "oracle": 0.02,
        "illiquid": 0.1,
        "counterparty": 0.08
      },
      "severities": {
        "exploit": 0.85,
        "depeg": 0.2,
        "oracle": 0.4,
        "illiquid": 0.05,
        "counterparty": 0.5
      },
      "expectedLoss": 0.08420855769798602,
      "raapy": 0.045791442302013985,
      "confidence": 0.4992405773074605,
      "score": 0.02286094609059873,
      "eligibleTranches": [],
      "primaryTranche": null,
      "rejectionReasons": [
        {
          "tranche": "senior",
          "reasons": [
            "expectedLoss 0.0842 > 0.02",
            "tvlUsd 0 < 25000000",
            "apy 13.00% > 8% (too-good-to-be-true gate)"
          ]
        },
        {
          "tranche": "mezzanine",
          "reasons": [
            "expectedLoss 0.0842 > 0.04",
            "tvlUsd 0 < 1000000"
          ]
        },
        {
          "tranche": "junior",
          "reasons": [
            "tvlUsd 0 < 100000"
          ]
        }
      ]
    },
    {
      "id": "fbtc:0fada348-2868-4f64-bc63-39473133aa59",
      "source": "fbtc",
      "asset": "0x201eba5cc46d216ce6dc03f6a759e8e766e956ae",
      "apy": 0.15,
      "apyReward": 0,
      "apyType": "variable",
      "tvlUsd": 0,
      "lastUpdatedMs": 1779306914842,
      "raw": {
        "chain": "Mantle",
        "project": "clearpool-lending",
        "symbol": "USDT",
        "underlyingTokens": [
          "0x201eba5cc46d216ce6dc03f6a759e8e766e956ae"
        ],
        "apy": 15,
        "apyBase": 15,
        "apyReward": null,
        "tvlUsd": 0,
        "pool": "0fada348-2868-4f64-bc63-39473133aa59"
      },
      "risk": {
        "contractAgeDays": 365,
        "auditFactor": 0.6,
        "tvlFactor": null,
        "depegEvents": [],
        "oracleType": "custom_multi",
        "liquiditySlippageBps": null,
        "counterpartyClass": "custodial",
        "smartMoneySignal": null,
        "apyVolatility": null,
        "apyDrift": null
      },
      "probabilities": {
        "exploit": 0.03553947964468942,
        "depeg": 0.005,
        "oracle": 0.02,
        "illiquid": 0.1,
        "counterparty": 0.08
      },
      "severities": {
        "exploit": 0.85,
        "depeg": 0.2,
        "oracle": 0.4,
        "illiquid": 0.05,
        "counterparty": 0.5
      },
      "expectedLoss": 0.08420855769798602,
      "raapy": 0.06579144230201397,
      "confidence": 0.4992422414454918,
      "score": 0.0328458671227892,
      "eligibleTranches": [],
      "primaryTranche": null,
      "rejectionReasons": [
        {
          "tranche": "senior",
          "reasons": [
            "expectedLoss 0.0842 > 0.02",
            "tvlUsd 0 < 25000000",
            "apy 15.00% > 8% (too-good-to-be-true gate)"
          ]
        },
        {
          "tranche": "mezzanine",
          "reasons": [
            "expectedLoss 0.0842 > 0.04",
            "tvlUsd 0 < 1000000"
          ]
        },
        {
          "tranche": "junior",
          "reasons": [
            "tvlUsd 0 < 100000"
          ]
        }
      ]
    },
    {
      "id": "fbtc:3f061e97-8cc5-4ddc-a791-a11d449c022b",
      "source": "fbtc",
      "asset": "0x09bc4e0d864854c6afb6eb9a9cdf58ac190d0df9",
      "apy": 0.1,
      "apyReward": 0,
      "apyType": "variable",
      "tvlUsd": 0,
      "lastUpdatedMs": 1779306914842,
      "raw": {
        "chain": "Mantle",
        "project": "clearpool-lending",
        "symbol": "USDC",
        "underlyingTokens": [
          "0x09bc4e0d864854c6afb6eb9a9cdf58ac190d0df9"
        ],
        "apy": 10,
        "apyBase": 10,
        "apyReward": null,
        "tvlUsd": 0,
        "pool": "3f061e97-8cc5-4ddc-a791-a11d449c022b"
      },
      "risk": {
        "contractAgeDays": 365,
        "auditFactor": 0.6,
        "tvlFactor": null,
        "depegEvents": [],
        "oracleType": "custom_multi",
        "liquiditySlippageBps": null,
        "counterpartyClass": "custodial",
        "smartMoneySignal": null,
        "apyVolatility": null,
        "apyDrift": null
      },
      "probabilities": {
        "exploit": 0.03553947964468942,
        "depeg": 0.005,
        "oracle": 0.02,
        "illiquid": 0.1,
        "counterparty": 0.08
      },
      "severities": {
        "exploit": 0.85,
        "depeg": 0.2,
        "oracle": 0.4,
        "illiquid": 0.05,
        "counterparty": 0.5
      },
      "expectedLoss": 0.08420855769798602,
      "raapy": 0.015791442302013986,
      "confidence": 0.49928218242242517,
      "score": 0.007884385776147348,
      "eligibleTranches": [],
      "primaryTranche": null,
      "rejectionReasons": [
        {
          "tranche": "senior",
          "reasons": [
            "expectedLoss 0.0842 > 0.02",
            "tvlUsd 0 < 25000000",
            "apy 10.00% > 8% (too-good-to-be-true gate)"
          ]
        },
        {
          "tranche": "mezzanine",
          "reasons": [
            "expectedLoss 0.0842 > 0.04",
            "tvlUsd 0 < 1000000"
          ]
        },
        {
          "tranche": "junior",
          "reasons": [
            "tvlUsd 0 < 100000"
          ]
        }
      ]
    },
    {
      "id": "fbtc:edbe8cf2-8d94-4126-b775-0d7d45cc4a23",
      "source": "fbtc",
      "asset": "0x201eba5cc46d216ce6dc03f6a759e8e766e956ae",
      "apy": 0.13,
      "apyReward": 0,
      "apyType": "variable",
      "tvlUsd": 0,
      "lastUpdatedMs": 1779306914842,
      "raw": {
        "chain": "Mantle",
        "project": "clearpool-lending",
        "symbol": "USDT",
        "underlyingTokens": [
          "0x201eba5cc46d216ce6dc03f6a759e8e766e956ae"
        ],
        "apy": 13,
        "apyBase": 13,
        "apyReward": 0,
        "tvlUsd": 0,
        "pool": "edbe8cf2-8d94-4126-b775-0d7d45cc4a23"
      },
      "risk": {
        "contractAgeDays": 365,
        "auditFactor": 0.6,
        "tvlFactor": null,
        "depegEvents": [],
        "oracleType": "custom_multi",
        "liquiditySlippageBps": null,
        "counterpartyClass": "custodial",
        "smartMoneySignal": null,
        "apyVolatility": 0.004423258684646909,
        "apyDrift": 1.0101351351351349
      },
      "probabilities": {
        "exploit": 0.03553947964468942,
        "depeg": 0.005,
        "oracle": 0.02,
        "illiquid": 0.1,
        "counterparty": 0.08
      },
      "severities": {
        "exploit": 0.85,
        "depeg": 0.2,
        "oracle": 0.4,
        "illiquid": 0.05,
        "counterparty": 0.5
      },
      "expectedLoss": 0.08420855769798602,
      "raapy": 0.045791442302013985,
      "confidence": 0.6989391380236885,
      "score": 0.032005431211431117,
      "eligibleTranches": [],
      "primaryTranche": null,
      "rejectionReasons": [
        {
          "tranche": "senior",
          "reasons": [
            "expectedLoss 0.0842 > 0.02",
            "tvlUsd 0 < 25000000",
            "apy 13.00% > 8% (too-good-to-be-true gate)"
          ]
        },
        {
          "tranche": "mezzanine",
          "reasons": [
            "expectedLoss 0.0842 > 0.04",
            "tvlUsd 0 < 1000000"
          ]
        },
        {
          "tranche": "junior",
          "reasons": [
            "tvlUsd 0 < 100000"
          ]
        }
      ]
    },
    {
      "id": "fbtc:8ddf841e-5849-4bca-b291-374b600be6e4",
      "source": "fbtc",
      "asset": "0x201eba5cc46d216ce6dc03f6a759e8e766e956ae",
      "apy": 0.1,
      "apyReward": 0,
      "apyType": "variable",
      "tvlUsd": 0,
      "lastUpdatedMs": 1779306914842,
      "raw": {
        "chain": "Mantle",
        "project": "clearpool-lending",
        "symbol": "USDT",
        "underlyingTokens": [
          "0x201eba5cc46d216ce6dc03f6a759e8e766e956ae"
        ],
        "apy": 10,
        "apyBase": 10,
        "apyReward": 0,
        "tvlUsd": 0,
        "pool": "8ddf841e-5849-4bca-b291-374b600be6e4"
      },
      "risk": {
        "contractAgeDays": 365,
        "auditFactor": 0.6,
        "tvlFactor": null,
        "depegEvents": [],
        "oracleType": "custom_multi",
        "liquiditySlippageBps": null,
        "counterpartyClass": "custodial",
        "smartMoneySignal": null,
        "apyVolatility": null,
        "apyDrift": null
      },
      "probabilities": {
        "exploit": 0.03553947964468942,
        "depeg": 0.005,
        "oracle": 0.02,
        "illiquid": 0.1,
        "counterparty": 0.08
      },
      "severities": {
        "exploit": 0.85,
        "depeg": 0.2,
        "oracle": 0.4,
        "illiquid": 0.05,
        "counterparty": 0.5
      },
      "expectedLoss": 0.08420855769798602,
      "raapy": 0.015791442302013986,
      "confidence": 0.49924390558907017,
      "score": 0.007883781329741919,
      "eligibleTranches": [],
      "primaryTranche": null,
      "rejectionReasons": [
        {
          "tranche": "senior",
          "reasons": [
            "expectedLoss 0.0842 > 0.02",
            "tvlUsd 0 < 25000000",
            "apy 10.00% > 8% (too-good-to-be-true gate)"
          ]
        },
        {
          "tranche": "mezzanine",
          "reasons": [
            "expectedLoss 0.0842 > 0.04",
            "tvlUsd 0 < 1000000"
          ]
        },
        {
          "tranche": "junior",
          "reasons": [
            "tvlUsd 0 < 100000"
          ]
        }
      ]
    },
    {
      "id": "fbtc:b283d8ef-8342-4932-a345-155be63c6f84",
      "source": "fbtc",
      "asset": "0x09bc4e0d864854c6afb6eb9a9cdf58ac190d0df9",
      "apy": 0.0975,
      "apyReward": 0,
      "apyType": "variable",
      "tvlUsd": 0,
      "lastUpdatedMs": 1779306914842,
      "raw": {
        "chain": "Mantle",
        "project": "clearpool-lending",
        "symbol": "USDC",
        "underlyingTokens": [
          "0x09bc4e0d864854c6afb6eb9a9cdf58ac190d0df9"
        ],
        "apy": 9.75,
        "apyBase": 9.75,
        "apyReward": null,
        "tvlUsd": 0,
        "pool": "b283d8ef-8342-4932-a345-155be63c6f84"
      },
      "risk": {
        "contractAgeDays": 365,
        "auditFactor": 0.6,
        "tvlFactor": null,
        "depegEvents": [],
        "oracleType": "custom_multi",
        "liquiditySlippageBps": null,
        "counterpartyClass": "custodial",
        "smartMoneySignal": null,
        "apyVolatility": null,
        "apyDrift": null
      },
      "probabilities": {
        "exploit": 0.03553947964468942,
        "depeg": 0.005,
        "oracle": 0.02,
        "illiquid": 0.1,
        "counterparty": 0.08
      },
      "severities": {
        "exploit": 0.85,
        "depeg": 0.2,
        "oracle": 0.4,
        "illiquid": 0.05,
        "counterparty": 0.5
      },
      "expectedLoss": 0.08420855769798602,
      "raapy": 0.013291442302013984,
      "confidence": 0.49929050386147733,
      "score": 0.006636290924018316,
      "eligibleTranches": [],
      "primaryTranche": null,
      "rejectionReasons": [
        {
          "tranche": "senior",
          "reasons": [
            "expectedLoss 0.0842 > 0.02",
            "tvlUsd 0 < 25000000",
            "apy 9.75% > 8% (too-good-to-be-true gate)"
          ]
        },
        {
          "tranche": "mezzanine",
          "reasons": [
            "expectedLoss 0.0842 > 0.04",
            "tvlUsd 0 < 1000000"
          ]
        },
        {
          "tranche": "junior",
          "reasons": [
            "tvlUsd 0 < 100000"
          ]
        }
      ]
    },
    {
      "id": "aave:125974d5-ad17-4a3a-b967-ebbf721fca22",
      "source": "aave",
      "asset": "0xfc421ad3c883bf9e7c4f42de845c4e4405799e73",
      "apy": 0.0211843,
      "apyReward": 0.043957800000000005,
      "apyType": "variable",
      "tvlUsd": 0,
      "lastUpdatedMs": 1779306914842,
      "raw": {
        "chain": "Mantle",
        "project": "aave-v3",
        "symbol": "GHO",
        "underlyingTokens": [
          "0xfc421aD3C883Bf9E7C4f42dE845C4e4405799e73"
        ],
        "apy": 6.51421,
        "apyBase": 2.11843,
        "apyReward": 4.39578,
        "tvlUsd": 0,
        "pool": "125974d5-ad17-4a3a-b967-ebbf721fca22"
      },
      "risk": {
        "contractAgeDays": 700,
        "auditFactor": 0.3,
        "tvlFactor": null,
        "depegEvents": [],
        "oracleType": "chainlink_dec",
        "liquiditySlippageBps": null,
        "counterpartyClass": "permissionless",
        "smartMoneySignal": null,
        "apyVolatility": 0.04168779882027279,
        "apyDrift": 0.9537617310567953
      },
      "probabilities": {
        "exploit": 0.002763190221437315,
        "depeg": 0.005,
        "oracle": 0.002,
        "illiquid": 0.1,
        "counterparty": 0.005
      },
      "severities": {
        "exploit": 0.85,
        "depeg": 0.2,
        "oracle": 0.4,
        "illiquid": 0.05,
        "counterparty": 0.5
      },
      "expectedLoss": 0.01164871168822172,
      "raapy": 0.00953558831177828,
      "confidence": 0.4897224119906973,
      "score": 0.004669791307794361,
      "eligibleTranches": [],
      "primaryTranche": null,
      "rejectionReasons": [
        {
          "tranche": "senior",
          "reasons": [
            "tvlUsd 0 < 25000000"
          ]
        },
        {
          "tranche": "mezzanine",
          "reasons": [
            "tvlUsd 0 < 1000000"
          ]
        },
        {
          "tranche": "junior",
          "reasons": [
            "tvlUsd 0 < 100000"
          ]
        }
      ]
    },
    {
      "id": "mantleVault:1362a09f-4853-492b-8083-34e0df20e17b",
      "source": "mantleVault",
      "asset": "0xc96de26018a54d51c097160568752c4e3bd6c364",
      "apy": 0.0000064000000000000006,
      "apyReward": 0,
      "apyType": "variable",
      "tvlUsd": 0,
      "lastUpdatedMs": 1779306914842,
      "raw": {
        "chain": "Mantle",
        "project": "minterest",
        "symbol": "FBTC",
        "underlyingTokens": [
          "0xC96dE26018A54D51c097160568752c4E3BD6C364"
        ],
        "apy": 0.00064,
        "apyBase": 0.00064,
        "apyReward": null,
        "tvlUsd": 0,
        "pool": "1362a09f-4853-492b-8083-34e0df20e17b"
      },
      "risk": {
        "contractAgeDays": 365,
        "auditFactor": 0.6,
        "tvlFactor": null,
        "depegEvents": [],
        "oracleType": "redstone",
        "liquiditySlippageBps": null,
        "counterpartyClass": "permissionless",
        "smartMoneySignal": null,
        "apyVolatility": 2.4868191858117323e-7,
        "apyDrift": 1.012658227848102
      },
      "probabilities": {
        "exploit": 0.03553947964468942,
        "depeg": 0.005,
        "oracle": 0.007,
        "illiquid": 0.1,
        "counterparty": 0.005
      },
      "severities": {
        "exploit": 0.85,
        "depeg": 0.2,
        "oracle": 0.4,
        "illiquid": 0.05,
        "counterparty": 0.5
      },
      "expectedLoss": 0.04150855769798602,
      "raapy": -0.04150215769798602,
      "confidence": 0.6996011136933972,
      "score": -0.029034955746190017,
      "eligibleTranches": [],
      "primaryTranche": null,
      "rejectionReasons": [
        {
          "tranche": "senior",
          "reasons": [
            "expectedLoss 0.0415 > 0.02",
            "tvlUsd 0 < 25000000",
            "apyBase 0.00% < 2% (reward-only positions blocked)"
          ]
        },
        {
          "tranche": "mezzanine",
          "reasons": [
            "expectedLoss 0.0415 > 0.04",
            "tvlUsd 0 < 1000000",
            "apyBase 0.00% < 1% (reward-only positions blocked)"
          ]
        },
        {
          "tranche": "junior",
          "reasons": [
            "tvlUsd 0 < 100000"
          ]
        }
      ]
    }
  ],
  "perTranche": {
    "senior": [
      "ondo:b5d7a190-38d2-4fdd-8c14-1fd00c11bce1"
    ],
    "mezzanine": [
      "aave:47da0cdd-7b1d-4927-9545-20b53b73afa8",
      "ondo:b5d7a190-38d2-4fdd-8c14-1fd00c11bce1",
      "aave:32cb38a5-b9b9-441a-bf07-8fab47b999d3"
    ],
    "junior": [
      "agni:35f2103d-231b-443b-952e-d2cd118d8f29",
      "agni:85407ecd-f711-4fa6-9328-3078aebfaa95",
      "aave:4a0e9f84-09a0-491a-aa5e-269813d31a59",
      "aave:47da0cdd-7b1d-4927-9545-20b53b73afa8",
      "ondo:b5d7a190-38d2-4fdd-8c14-1fd00c11bce1",
      "agni:6d76a4e2-57f2-4190-a882-bd69f6ea32fb",
      "aave:32cb38a5-b9b9-441a-bf07-8fab47b999d3",
      "agni:ebec73de-fd1e-4f97-8287-d9cb01c7d352",
      "agni:649bee89-0a34-4eb1-b8ab-7c5fdee07ccd",
      "agni:2a510869-6356-4486-8bb5-d5a808634496",
      "aave:76b70b33-d8a4-4e61-8092-9bd1f2be2fc9",
      "agni:a4ff3d7c-a117-4b24-a9f9-6af46cd276c0",
      "aave:a4e37545-203b-4412-9acd-3e8b1aa4d744",
      "agni:a7e2f58e-1c93-4592-acd6-8e40e6cb26ff",
      "agni:3b6b75cf-adb5-4fb4-bbcd-8f75c6879c9d",
      "agni:3d429d4e-b3a6-4847-957b-b10bf26a6f01",
      "agni:227e8492-33e9-4953-8beb-28973c9fdb8a",
      "agni:30836422-c578-4f77-8f81-861c509c5d4c",
      "agni:2364dd66-69d3-44ef-9e85-4d5217a57b57",
      "agni:b8d50460-5237-4601-9250-4f2d3a6b569b",
      "agni:b5933580-18c1-43b6-aec3-2563cd30e3a2",
      "agni:913ce101-55b1-4230-93c7-d523f0d9ca03",
      "mantleVault:c87c5d7c-0285-47a9-8539-d335f05b9ba2",
      "mantleVault:b96d8236-36d4-4be4-92f7-422beeac7073"
    ]
  },
  "signature": "0xf1fd7fd48700f3adc098f0db6579a2b4c23534c30f3b51cdf493cbd58a2f26150ee5ee333e0aead9e8021aa1ee7947de3d4d761028549277a1bc1d423fca3ad81b"
}
```
