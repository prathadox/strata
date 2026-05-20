# Scout dry-cycle inspection

Generated: 2026-05-20T13:24:20.677Z
Ephemeral signer: `0x7e37DB9c32F85436CA5D565E567658B9FbecB9bC`
Map hash: `0xc390d8e0e597cad20e6bb3eaf41e8804e8b133231e1b5c8dee498cf2bbfbbbc7`

This file is produced by `scripts/inspect-cycle.ts`. The pipeline runs end to end, fetching real data from DefiLlama (yields + price history). Nansen and Lighthouse are skipped; the signature is over an ephemeral keypair generated at run time.

## Summary

- Opportunities ingested: **57**
- Opportunities scored: **57**
- Senior-eligible: **1**
- Mezzanine-eligible: **3**
- Junior-eligible: **23**

## Per-tranche rankings

### Senior (1)

| Rank | Source | Pool id | APY | RAAPY | Score | TVL |
|---|---|---|---|---|---|---|
| 1 | ondo | `ondo:b5d7a190-38d2-4fdd-8c14-1fd00c11bce1` | 3.55% | 1.76% | 0.0120 | $29,444,317 |

### Mezzanine (3)

| Rank | Source | Pool id | APY | RAAPY | Score | TVL |
|---|---|---|---|---|---|---|
| 1 | aave | `aave:47da0cdd-7b1d-4927-9545-20b53b73afa8` | 8.46% | 7.77% | 0.0542 | $6,830,643 |
| 2 | ondo | `ondo:b5d7a190-38d2-4fdd-8c14-1fd00c11bce1` | 3.55% | 1.76% | 0.0120 | $29,444,317 |
| 3 | aave | `aave:32cb38a5-b9b9-441a-bf07-8fab47b999d3` | 1.04% | 0.35% | 0.0017 | $5,852,600 |

### Junior (23)

| Rank | Source | Pool id | APY | RAAPY | Score | TVL |
|---|---|---|---|---|---|---|
| 1 | agni | `agni:35f2103d-231b-443b-952e-d2cd118d8f29` | 32.08% | 30.68% | 0.1495 | $1,083,561 |
| 2 | aave | `aave:47da0cdd-7b1d-4927-9545-20b53b73afa8` | 8.46% | 7.77% | 0.0542 | $6,830,643 |
| 3 | agni | `agni:85407ecd-f711-4fa6-9328-3078aebfaa95` | 10.59% | 9.17% | 0.0456 | $827,340 |
| 4 | ondo | `ondo:b5d7a190-38d2-4fdd-8c14-1fd00c11bce1` | 3.55% | 1.76% | 0.0120 | $29,444,317 |
| 5 | agni | `agni:6d76a4e2-57f2-4190-a882-bd69f6ea32fb` | 2.84% | 1.39% | 0.0068 | $428,827 |
| 6 | aave | `aave:32cb38a5-b9b9-441a-bf07-8fab47b999d3` | 1.04% | 0.35% | 0.0017 | $5,852,600 |
| 7 | aave | `aave:76b70b33-d8a4-4e61-8092-9bd1f2be2fc9` | 0.28% | -0.41% | -0.0014 | $5,864,475 |
| 8 | agni | `agni:649bee89-0a34-4eb1-b8ab-7c5fdee07ccd` | 0.89% | -0.64% | -0.0031 | $131,984 |
| 9 | aave | `aave:a4e37545-203b-4412-9acd-3e8b1aa4d744` | 0.00% | -0.53% | -0.0037 | $63,888,676 |
| 10 | agni | `agni:a7e2f58e-1c93-4592-acd6-8e40e6cb26ff` | 0.51% | -1.03% | -0.0050 | $107,709 |
| 11 | agni | `agni:3b6b75cf-adb5-4fb4-bbcd-8f75c6879c9d` | 0.45% | -1.09% | -0.0052 | $109,138 |
| 12 | agni | `agni:2a510869-6356-4486-8bb5-d5a808634496` | 0.41% | -1.13% | -0.0055 | $112,580 |
| 13 | agni | `agni:ebec73de-fd1e-4f97-8287-d9cb01c7d352` | 0.59% | -0.95% | -0.0065 | $111,392 |
| 14 | agni | `agni:b8d50460-5237-4601-9250-4f2d3a6b569b` | 0.58% | -0.97% | -0.0067 | $103,498 |
| 15 | agni | `agni:30836422-c578-4f77-8f81-861c509c5d4c` | 0.58% | -0.97% | -0.0067 | $102,818 |
| 16 | agni | `agni:b5933580-18c1-43b6-aec3-2563cd30e3a2` | 0.13% | -1.42% | -0.0069 | $101,761 |
| 17 | agni | `agni:3d429d4e-b3a6-4847-957b-b10bf26a6f01` | 0.00% | -1.54% | -0.0075 | $108,235 |
| 18 | agni | `agni:a4ff3d7c-a117-4b24-a9f9-6af46cd276c0` | 0.42% | -1.12% | -0.0077 | $106,464 |
| 19 | agni | `agni:2364dd66-69d3-44ef-9e85-4d5217a57b57` | 0.17% | -1.37% | -0.0094 | $109,132 |
| 20 | agni | `agni:227e8492-33e9-4953-8beb-28973c9fdb8a` | 0.10% | -1.44% | -0.0099 | $116,233 |
| 21 | agni | `agni:913ce101-55b1-4230-93c7-d523f0d9ca03` | 0.09% | -1.45% | -0.0100 | $106,662 |
| 22 | mantleVault | `mantleVault:b96d8236-36d4-4be4-92f7-422beeac7073` | 0.00% | -2.55% | -0.0124 | $193,563 |
| 23 | mantleVault | `mantleVault:c87c5d7c-0285-47a9-8539-d335f05b9ba2` | 0.31% | -2.20% | -0.0153 | $268,958 |

## All scored opportunities

### aave:a4e37545-203b-4412-9acd-3e8b1aa4d744

- **Source**: aave
- **Asset**: `0x211cc4dd073734da055fbf44a2b4667d5e5fe5d2`
- **APY (base)**: 0.00%    **APY (reward)**: 4.00%    **Total**: 4.00%
- **TVL**: $63,888,676
- **APY history**: vol=0.00%, drift=1.00x
- **Nansen signal**: _null_ (no key or asset not covered)
- **Probabilities**: exploit=0.00097, depeg=0.00063, oracle=0.00200, illiquid=0.02195, counterparty=0.00500
- **Expected loss**: 0.535% /yr
- **RAAPY**: -0.53%
- **Confidence**: 0.686
- **Score**: -0.0037
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
- **Probabilities**: exploit=0.00088, depeg=0.00038, oracle=0.00200, illiquid=0.02531, counterparty=0.03000
- **Expected loss**: 1.789% /yr
- **RAAPY**: 1.76%
- **Confidence**: 0.682
- **Score**: 0.0120
- **Eligible tranches**: senior, mezzanine, junior
- **Primary tranche**: senior

### aave:47da0cdd-7b1d-4927-9545-20b53b73afa8

- **Source**: aave
- **Asset**: `0x779ded0c9e1022225f8e0630b35a9b54be713736`
- **APY (base)**: 8.46%    **APY (reward)**: 3.00%    **Total**: 11.46%
- **TVL**: $6,830,643
- **APY history**: vol=2.74%, drift=0.81x
- **Nansen signal**: _null_ (no key or asset not covered)
- **Probabilities**: exploit=0.00119, depeg=0.00500, oracle=0.00200, illiquid=0.03166, counterparty=0.00500
- **Expected loss**: 0.689% /yr
- **RAAPY**: 7.77%
- **Confidence**: 0.697
- **Score**: 0.0542
- **Eligible tranches**: mezzanine, junior
- **Primary tranche**: mezzanine
- **Rejection reasons**:
  - senior: tvlUsd 6830643 < 25000000; apy 8.46% > 8% (too-good-to-be-true gate)

### aave:76b70b33-d8a4-4e61-8092-9bd1f2be2fc9

- **Source**: aave
- **Asset**: `0x5d3a1ff2b6bab83b63cd9ad0787074081a52ef34`
- **APY (base)**: 0.28%    **APY (reward)**: 4.00%    **Total**: 4.28%
- **TVL**: $5,864,475
- **APY history**: vol=3.21%, drift=42.93x
- **Nansen signal**: _null_ (no key or asset not covered)
- **Probabilities**: exploit=0.00120, depeg=0.00500, oracle=0.00200, illiquid=0.03232, counterparty=0.00500
- **Expected loss**: 0.694% /yr
- **RAAPY**: -0.41%
- **Confidence**: 0.335
- **Score**: -0.0014
- **Eligible tranches**: junior
- **Primary tranche**: junior
- **Rejection reasons**:
  - senior: tvlUsd 5864475 < 25000000; apyBase 0.28% < 2% (reward-only positions blocked)
  - mezzanine: apyBase 0.28% < 1% (reward-only positions blocked)

### aave:32cb38a5-b9b9-441a-bf07-8fab47b999d3

- **Source**: aave
- **Asset**: `0x09bc4e0d864854c6afb6eb9a9cdf58ac190d0df9`
- **APY (base)**: 1.04%    **APY (reward)**: 0.00%    **Total**: 1.04%
- **TVL**: $5,852,600
- **APY history**: vol=3.37%, drift=0.71x
- **Nansen signal**: _null_ (no key or asset not covered)
- **Probabilities**: exploit=0.00120, depeg=0.00500, oracle=0.00200, illiquid=0.03233, counterparty=0.00500
- **Expected loss**: 0.694% /yr
- **RAAPY**: 0.35%
- **Confidence**: 0.481
- **Score**: 0.0017
- **Eligible tranches**: mezzanine, junior
- **Primary tranche**: mezzanine
- **Rejection reasons**:
  - senior: tvlUsd 5852600 < 25000000; apyBase 1.04% < 2% (reward-only positions blocked)

### agni:35f2103d-231b-443b-952e-d2cd118d8f29

- **Source**: agni
- **Asset**: `0x779ded0c9e1022225f8e0630b35a9b54be713736`
- **APY (base)**: 32.08%    **APY (reward)**: 0.00%    **Total**: 32.08%
- **TVL**: $1,083,561
- **APY history**: vol=61.90%, drift=1.38x
- **Nansen signal**: _null_ (no key or asset not covered)
- **Probabilities**: exploit=0.00668, depeg=0.00500, oracle=0.00700, illiquid=0.03965, counterparty=0.00500
- **Expected loss**: 1.396% /yr
- **RAAPY**: 30.68%
- **Confidence**: 0.487
- **Score**: 0.1495
- **Eligible tranches**: junior
- **Primary tranche**: junior
- **Rejection reasons**:
  - senior: tvlUsd 1083561 < 25000000; apy 32.08% > 8% (too-good-to-be-true gate)
  - mezzanine: apy 32.08% > 20% (too-good-to-be-true gate)

### agni:85407ecd-f711-4fa6-9328-3078aebfaa95

- **Source**: agni
- **Asset**: `0x55b9f84605b30df9bb9d817a6900219f25218157`
- **APY (base)**: 10.59%    **APY (reward)**: 0.00%    **Total**: 10.59%
- **TVL**: $827,340
- **APY history**: no history available
- **Nansen signal**: _null_ (no key or asset not covered)
- **Probabilities**: exploit=0.00681, depeg=0.00500, oracle=0.00700, illiquid=0.04082, counterparty=0.00500
- **Expected loss**: 1.413% /yr
- **RAAPY**: 9.17%
- **Confidence**: 0.497
- **Score**: 0.0456
- **Eligible tranches**: junior
- **Primary tranche**: junior
- **Rejection reasons**:
  - senior: tvlUsd 827340 < 25000000; apy 10.59% > 8% (too-good-to-be-true gate)
  - mezzanine: tvlUsd 827340 < 1000000

### agni:6d76a4e2-57f2-4190-a882-bd69f6ea32fb

- **Source**: agni
- **Asset**: `0x45db70e1c808dae42f9c4dfea74ba5e6a113bdc1`
- **APY (base)**: 2.84%    **APY (reward)**: 0.00%    **Total**: 2.84%
- **TVL**: $428,827
- **APY history**: vol=951.26%, drift=0.03x
- **Nansen signal**: _null_ (no key or asset not covered)
- **Probabilities**: exploit=0.00713, depeg=0.00500, oracle=0.00700, illiquid=0.04368, counterparty=0.00500
- **Expected loss**: 1.455% /yr
- **RAAPY**: 1.39%
- **Confidence**: 0.489
- **Score**: 0.0068
- **Eligible tranches**: junior
- **Primary tranche**: junior
- **Rejection reasons**:
  - senior: tvlUsd 428827 < 25000000
  - mezzanine: tvlUsd 428827 < 1000000

### mantleVault:c87c5d7c-0285-47a9-8539-d335f05b9ba2

- **Source**: mantleVault
- **Asset**: `0xcda86a272531e8640cd7f1a92c01839911b90bb0`
- **APY (base)**: 0.31%    **APY (reward)**: 0.03%    **Total**: 0.34%
- **TVL**: $268,958
- **APY history**: vol=0.06%, drift=1.29x
- **Nansen signal**: _null_ (no key or asset not covered)
- **Probabilities**: exploit=0.01946, depeg=0.00500, oracle=0.00700, illiquid=0.04570, counterparty=0.00500
- **Expected loss**: 2.513% /yr
- **RAAPY**: -2.20%
- **Confidence**: 0.695
- **Score**: -0.0153
- **Eligible tranches**: junior
- **Primary tranche**: junior
- **Rejection reasons**:
  - senior: expectedLoss 0.0251 > 0.02; tvlUsd 268958 < 25000000; apyBase 0.31% < 2% (reward-only positions blocked)
  - mezzanine: tvlUsd 268958 < 1000000; apyBase 0.31% < 1% (reward-only positions blocked)

### mantleVault:b96d8236-36d4-4be4-92f7-422beeac7073

- **Source**: mantleVault
- **Asset**: `0xe6829d9a7ee3040e1276fa75293bde931859e8fa`
- **APY (base)**: 0.00%    **APY (reward)**: 0.05%    **Total**: 0.05%
- **TVL**: $193,563
- **APY history**: no history available
- **Nansen signal**: _null_ (no key or asset not covered)
- **Probabilities**: exploit=0.01988, depeg=0.00500, oracle=0.00700, illiquid=0.04713, counterparty=0.00500
- **Expected loss**: 2.556% /yr
- **RAAPY**: -2.55%
- **Confidence**: 0.488
- **Score**: -0.0124
- **Eligible tranches**: junior
- **Primary tranche**: junior
- **Rejection reasons**:
  - senior: expectedLoss 0.0256 > 0.02; tvlUsd 193563 < 25000000; apyBase 0.00% < 2% (reward-only positions blocked)
  - mezzanine: tvlUsd 193563 < 1000000; apyBase 0.00% < 1% (reward-only positions blocked)

### agni:649bee89-0a34-4eb1-b8ab-7c5fdee07ccd

- **Source**: agni
- **Asset**: `0x29cc30f9d113b356ce408667aa6433589cecbdca`
- **APY (base)**: 0.89%    **APY (reward)**: 0.00%    **Total**: 0.89%
- **TVL**: $131,984
- **APY history**: vol=3.04%, drift=0.58x
- **Nansen signal**: _null_ (no key or asset not covered)
- **Probabilities**: exploit=0.00771, depeg=0.00500, oracle=0.00700, illiquid=0.04879, counterparty=0.00500
- **Expected loss**: 1.529% /yr
- **RAAPY**: -0.64%
- **Confidence**: 0.486
- **Score**: -0.0031
- **Eligible tranches**: junior
- **Primary tranche**: junior
- **Rejection reasons**:
  - senior: tvlUsd 131984 < 25000000; apyBase 0.89% < 2% (reward-only positions blocked)
  - mezzanine: tvlUsd 131984 < 1000000; apyBase 0.89% < 1% (reward-only positions blocked)

### agni:227e8492-33e9-4953-8beb-28973c9fdb8a

- **Source**: agni
- **Asset**: `0x09bc4e0d864854c6afb6eb9a9cdf58ac190d0df9`
- **APY (base)**: 0.10%    **APY (reward)**: 0.00%    **Total**: 0.10%
- **TVL**: $116,233
- **APY history**: vol=0.82%, drift=1.30x
- **Nansen signal**: _null_ (no key or asset not covered)
- **Probabilities**: exploit=0.00777, depeg=0.00500, oracle=0.00700, illiquid=0.04935, counterparty=0.00500
- **Expected loss**: 1.537% /yr
- **RAAPY**: -1.44%
- **Confidence**: 0.687
- **Score**: -0.0099
- **Eligible tranches**: junior
- **Primary tranche**: junior
- **Rejection reasons**:
  - senior: tvlUsd 116233 < 25000000; apyBase 0.10% < 2% (reward-only positions blocked)
  - mezzanine: tvlUsd 116233 < 1000000; apyBase 0.10% < 1% (reward-only positions blocked)

### agni:2a510869-6356-4486-8bb5-d5a808634496

- **Source**: agni
- **Asset**: `0x09bc4e0d864854c6afb6eb9a9cdf58ac190d0df9`
- **APY (base)**: 0.41%    **APY (reward)**: 0.00%    **Total**: 0.41%
- **TVL**: $112,580
- **APY history**: vol=1.07%, drift=1.68x
- **Nansen signal**: _null_ (no key or asset not covered)
- **Probabilities**: exploit=0.00778, depeg=0.00500, oracle=0.00700, illiquid=0.04949, counterparty=0.00500
- **Expected loss**: 1.539% /yr
- **RAAPY**: -1.13%
- **Confidence**: 0.481
- **Score**: -0.0055
- **Eligible tranches**: junior
- **Primary tranche**: junior
- **Rejection reasons**:
  - senior: tvlUsd 112580 < 25000000; apyBase 0.41% < 2% (reward-only positions blocked)
  - mezzanine: tvlUsd 112580 < 1000000; apyBase 0.41% < 1% (reward-only positions blocked)

### agni:ebec73de-fd1e-4f97-8287-d9cb01c7d352

- **Source**: agni
- **Asset**: `0x09bc4e0d864854c6afb6eb9a9cdf58ac190d0df9`
- **APY (base)**: 0.59%    **APY (reward)**: 0.00%    **Total**: 0.59%
- **TVL**: $111,392
- **APY history**: vol=2.42%, drift=0.95x
- **Nansen signal**: _null_ (no key or asset not covered)
- **Probabilities**: exploit=0.00779, depeg=0.00500, oracle=0.00700, illiquid=0.04953, counterparty=0.00500
- **Expected loss**: 1.540% /yr
- **RAAPY**: -0.95%
- **Confidence**: 0.687
- **Score**: -0.0065
- **Eligible tranches**: junior
- **Primary tranche**: junior
- **Rejection reasons**:
  - senior: tvlUsd 111392 < 25000000; apyBase 0.59% < 2% (reward-only positions blocked)
  - mezzanine: tvlUsd 111392 < 1000000; apyBase 0.59% < 1% (reward-only positions blocked)

### agni:3b6b75cf-adb5-4fb4-bbcd-8f75c6879c9d

- **Source**: agni
- **Asset**: `0x09bc4e0d864854c6afb6eb9a9cdf58ac190d0df9`
- **APY (base)**: 0.45%    **APY (reward)**: 0.00%    **Total**: 0.45%
- **TVL**: $109,138
- **APY history**: vol=0.59%, drift=1.79x
- **Nansen signal**: _null_ (no key or asset not covered)
- **Probabilities**: exploit=0.00780, depeg=0.00500, oracle=0.00700, illiquid=0.04962, counterparty=0.00500
- **Expected loss**: 1.541% /yr
- **RAAPY**: -1.09%
- **Confidence**: 0.481
- **Score**: -0.0052
- **Eligible tranches**: junior
- **Primary tranche**: junior
- **Rejection reasons**:
  - senior: tvlUsd 109138 < 25000000; apyBase 0.45% < 2% (reward-only positions blocked)
  - mezzanine: tvlUsd 109138 < 1000000; apyBase 0.45% < 1% (reward-only positions blocked)

### agni:2364dd66-69d3-44ef-9e85-4d5217a57b57

- **Source**: agni
- **Asset**: `0x09bc4e0d864854c6afb6eb9a9cdf58ac190d0df9`
- **APY (base)**: 0.17%    **APY (reward)**: 0.00%    **Total**: 0.17%
- **TVL**: $109,132
- **APY history**: vol=0.21%, drift=1.21x
- **Nansen signal**: _null_ (no key or asset not covered)
- **Probabilities**: exploit=0.00780, depeg=0.00500, oracle=0.00700, illiquid=0.04962, counterparty=0.00500
- **Expected loss**: 1.541% /yr
- **RAAPY**: -1.37%
- **Confidence**: 0.687
- **Score**: -0.0094
- **Eligible tranches**: junior
- **Primary tranche**: junior
- **Rejection reasons**:
  - senior: tvlUsd 109132 < 25000000; apyBase 0.17% < 2% (reward-only positions blocked)
  - mezzanine: tvlUsd 109132 < 1000000; apyBase 0.17% < 1% (reward-only positions blocked)

### agni:3d429d4e-b3a6-4847-957b-b10bf26a6f01

- **Source**: agni
- **Asset**: `0x779ded0c9e1022225f8e0630b35a9b54be713736`
- **APY (base)**: 0.00%    **APY (reward)**: 0.00%    **Total**: 0.00%
- **TVL**: $108,235
- **APY history**: vol=6.54%, drift=0.16x
- **Nansen signal**: _null_ (no key or asset not covered)
- **Probabilities**: exploit=0.00780, depeg=0.00500, oracle=0.00700, illiquid=0.04966, counterparty=0.00500
- **Expected loss**: 1.542% /yr
- **RAAPY**: -1.54%
- **Confidence**: 0.487
- **Score**: -0.0075
- **Eligible tranches**: junior
- **Primary tranche**: junior
- **Rejection reasons**:
  - senior: tvlUsd 108235 < 25000000; apyBase 0.00% < 2% (reward-only positions blocked)
  - mezzanine: tvlUsd 108235 < 1000000; apyBase 0.00% < 1% (reward-only positions blocked)

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
- **Confidence**: 0.481
- **Score**: -0.0050
- **Eligible tranches**: junior
- **Primary tranche**: junior
- **Rejection reasons**:
  - senior: tvlUsd 107709 < 25000000; apyBase 0.51% < 2% (reward-only positions blocked)
  - mezzanine: tvlUsd 107709 < 1000000; apyBase 0.51% < 1% (reward-only positions blocked)

### agni:913ce101-55b1-4230-93c7-d523f0d9ca03

- **Source**: agni
- **Asset**: `0x09bc4e0d864854c6afb6eb9a9cdf58ac190d0df9`
- **APY (base)**: 0.09%    **APY (reward)**: 0.00%    **Total**: 0.09%
- **TVL**: $106,662
- **APY history**: vol=0.13%, drift=0.68x
- **Nansen signal**: _null_ (no key or asset not covered)
- **Probabilities**: exploit=0.00781, depeg=0.00500, oracle=0.00700, illiquid=0.04972, counterparty=0.00500
- **Expected loss**: 1.542% /yr
- **RAAPY**: -1.45%
- **Confidence**: 0.687
- **Score**: -0.0100
- **Eligible tranches**: junior
- **Primary tranche**: junior
- **Rejection reasons**:
  - senior: tvlUsd 106662 < 25000000; apyBase 0.09% < 2% (reward-only positions blocked)
  - mezzanine: tvlUsd 106662 < 1000000; apyBase 0.09% < 1% (reward-only positions blocked)

### agni:a4ff3d7c-a117-4b24-a9f9-6af46cd276c0

- **Source**: agni
- **Asset**: `0x09bc4e0d864854c6afb6eb9a9cdf58ac190d0df9`
- **APY (base)**: 0.42%    **APY (reward)**: 0.00%    **Total**: 0.42%
- **TVL**: $106,464
- **APY history**: vol=1.18%, drift=1.05x
- **Nansen signal**: _null_ (no key or asset not covered)
- **Probabilities**: exploit=0.00781, depeg=0.00500, oracle=0.00700, illiquid=0.04973, counterparty=0.00500
- **Expected loss**: 1.543% /yr
- **RAAPY**: -1.12%
- **Confidence**: 0.687
- **Score**: -0.0077
- **Eligible tranches**: junior
- **Primary tranche**: junior
- **Rejection reasons**:
  - senior: tvlUsd 106464 < 25000000; apyBase 0.42% < 2% (reward-only positions blocked)
  - mezzanine: tvlUsd 106464 < 1000000; apyBase 0.42% < 1% (reward-only positions blocked)

### agni:b8d50460-5237-4601-9250-4f2d3a6b569b

- **Source**: agni
- **Asset**: `0x09bc4e0d864854c6afb6eb9a9cdf58ac190d0df9`
- **APY (base)**: 0.58%    **APY (reward)**: 0.00%    **Total**: 0.58%
- **TVL**: $103,498
- **APY history**: vol=0.66%, drift=0.99x
- **Nansen signal**: _null_ (no key or asset not covered)
- **Probabilities**: exploit=0.00782, depeg=0.00500, oracle=0.00700, illiquid=0.04985, counterparty=0.00500
- **Expected loss**: 1.544% /yr
- **RAAPY**: -0.97%
- **Confidence**: 0.687
- **Score**: -0.0067
- **Eligible tranches**: junior
- **Primary tranche**: junior
- **Rejection reasons**:
  - senior: tvlUsd 103498 < 25000000; apyBase 0.58% < 2% (reward-only positions blocked)
  - mezzanine: tvlUsd 103498 < 1000000; apyBase 0.58% < 1% (reward-only positions blocked)

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
- **Confidence**: 0.687
- **Score**: -0.0067
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
- **APY history**: no history available
- **Nansen signal**: _null_ (no key or asset not covered)
- **Probabilities**: exploit=0.00783, depeg=0.00500, oracle=0.00700, illiquid=0.04992, counterparty=0.00500
- **Expected loss**: 1.545% /yr
- **RAAPY**: -1.42%
- **Confidence**: 0.485
- **Score**: -0.0069
- **Eligible tranches**: junior
- **Primary tranche**: junior
- **Rejection reasons**:
  - senior: tvlUsd 101761 < 25000000; apyBase 0.13% < 2% (reward-only positions blocked)
  - mezzanine: tvlUsd 101761 < 1000000; apyBase 0.13% < 1% (reward-only positions blocked)

### mantleVault:3f5789dd-68ed-44c7-9388-b553df96502d

- **Source**: mantleVault
- **Asset**: `0x78c1b0c915c4faa5fffa6cabf0219da63d7f4cb8`
- **APY (base)**: 0.07%    **APY (reward)**: 0.36%    **Total**: 0.43%
- **TVL**: $72,368
- **APY history**: vol=0.87%, drift=0.10x
- **Nansen signal**: _null_ (no key or asset not covered)
- **Probabilities**: exploit=0.02115, depeg=0.00500, oracle=0.00700, illiquid=0.05140, counterparty=0.00500
- **Expected loss**: 2.685% /yr
- **RAAPY**: -2.62%
- **Confidence**: 0.695
- **Score**: -0.0182
- **Eligible tranches**: _none_
- **Primary tranche**: _none_
- **Rejection reasons**:
  - senior: expectedLoss 0.0268 > 0.02; tvlUsd 72368 < 25000000; apyBase 0.07% < 2% (reward-only positions blocked)
  - mezzanine: tvlUsd 72368 < 1000000; apyBase 0.07% < 1% (reward-only positions blocked)
  - junior: tvlUsd 72368 < 100000

### cian:009b6f09-bfa7-4852-8685-0980d9478419

- **Source**: cian
- **Asset**: `0xcda86a272531e8640cd7f1a92c01839911b90bb0`
- **APY (base)**: 2.90%    **APY (reward)**: 0.00%    **Total**: 2.90%
- **TVL**: $51,738
- **APY history**: no history available
- **Nansen signal**: _null_ (no key or asset not covered)
- **Probabilities**: exploit=0.03096, depeg=0.00500, oracle=0.02000, illiquid=0.05286, counterparty=0.00500
- **Expected loss**: 4.046% /yr
- **RAAPY**: -1.14%
- **Confidence**: 0.490
- **Score**: -0.0056
- **Eligible tranches**: _none_
- **Primary tranche**: _none_
- **Rejection reasons**:
  - senior: expectedLoss 0.0405 > 0.02; tvlUsd 51738 < 25000000
  - mezzanine: expectedLoss 0.0405 > 0.04; tvlUsd 51738 < 1000000
  - junior: tvlUsd 51738 < 100000

### agni:ab6d4bd4-fa82-4f09-9588-98c953179d61

- **Source**: agni
- **Asset**: `0x29cc30f9d113b356ce408667aa6433589cecbdca`
- **APY (base)**: 1.24%    **APY (reward)**: 0.00%    **Total**: 1.24%
- **TVL**: $47,700
- **APY history**: vol=2.69%, drift=0.63x
- **Nansen signal**: _null_ (no key or asset not covered)
- **Probabilities**: exploit=0.00820, depeg=0.00500, oracle=0.00700, illiquid=0.05321, counterparty=0.00500
- **Expected loss**: 1.593% /yr
- **RAAPY**: -0.35%
- **Confidence**: 0.696
- **Score**: -0.0025
- **Eligible tranches**: _none_
- **Primary tranche**: _none_
- **Rejection reasons**:
  - senior: tvlUsd 47700 < 25000000; apyBase 1.24% < 2% (reward-only positions blocked)
  - mezzanine: tvlUsd 47700 < 1000000
  - junior: tvlUsd 47700 < 100000

### agni:6a134700-f4a3-49ad-ad5a-fe1868b1c744

- **Source**: agni
- **Asset**: `0x111111d2bf19e43c34263401e0cad979ed1cdb61`
- **APY (base)**: 0.42%    **APY (reward)**: 0.00%    **Total**: 0.42%
- **TVL**: $44,582
- **APY history**: vol=132.60%, drift=0.05x
- **Nansen signal**: _null_ (no key or asset not covered)
- **Probabilities**: exploit=0.00823, depeg=0.00500, oracle=0.00700, illiquid=0.05351, counterparty=0.00500
- **Expected loss**: 1.597% /yr
- **RAAPY**: -1.17%
- **Confidence**: 0.488
- **Score**: -0.0057
- **Eligible tranches**: _none_
- **Primary tranche**: _none_
- **Rejection reasons**:
  - senior: tvlUsd 44582 < 25000000; apyBase 0.42% < 2% (reward-only positions blocked)
  - mezzanine: tvlUsd 44582 < 1000000; apyBase 0.42% < 1% (reward-only positions blocked)
  - junior: tvlUsd 44582 < 100000

### mantleVault:4ecffa03-92a0-4eed-bb8b-7537ade00cae

- **Source**: mantleVault
- **Asset**: `0xcda86a272531e8640cd7f1a92c01839911b90bb0`
- **APY (base)**: 0.00%    **APY (reward)**: 0.00%    **Total**: 0.00%
- **TVL**: $34,062
- **APY history**: vol=0.00%, drift=1.05x
- **Nansen signal**: _null_ (no key or asset not covered)
- **Probabilities**: exploit=0.02212, depeg=0.00500, oracle=0.00700, illiquid=0.05468, counterparty=0.00500
- **Expected loss**: 2.783% /yr
- **RAAPY**: -2.78%
- **Confidence**: 0.694
- **Score**: -0.0193
- **Eligible tranches**: _none_
- **Primary tranche**: _none_
- **Rejection reasons**:
  - senior: expectedLoss 0.0278 > 0.02; tvlUsd 34062 < 25000000; apyBase 0.00% < 2% (reward-only positions blocked)
  - mezzanine: tvlUsd 34062 < 1000000; apyBase 0.00% < 1% (reward-only positions blocked)
  - junior: tvlUsd 34062 < 100000

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
- **Confidence**: 0.694
- **Score**: -0.0168
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
- **TVL**: $21,826
- **APY history**: vol=0.00%, drift=1.05x
- **Nansen signal**: _null_ (no key or asset not covered)
- **Probabilities**: exploit=0.02269, depeg=0.00500, oracle=0.00700, illiquid=0.05661, counterparty=0.00500
- **Expected loss**: 2.842% /yr
- **RAAPY**: -2.84%
- **Confidence**: 0.694
- **Score**: -0.0197
- **Eligible tranches**: _none_
- **Primary tranche**: _none_
- **Rejection reasons**:
  - senior: expectedLoss 0.0284 > 0.02; tvlUsd 21826 < 25000000; apyBase 0.00% < 2% (reward-only positions blocked)
  - mezzanine: tvlUsd 21826 < 1000000; apyBase 0.00% < 1% (reward-only positions blocked)
  - junior: tvlUsd 21826 < 100000

### cian:6eec4d69-bcad-48b9-aa3a-31005778de19

- **Source**: cian
- **Asset**: `0xcda86a272531e8640cd7f1a92c01839911b90bb0`
- **APY (base)**: 0.44%    **APY (reward)**: 0.00%    **Total**: 0.44%
- **TVL**: $17,517
- **APY history**: vol=4.63%, drift=0.16x
- **Nansen signal**: _null_ (no key or asset not covered)
- **Probabilities**: exploit=0.03296, depeg=0.00500, oracle=0.02000, illiquid=0.05757, counterparty=0.00500
- **Expected loss**: 4.240% /yr
- **RAAPY**: -3.79%
- **Confidence**: 0.485
- **Score**: -0.0184
- **Eligible tranches**: _none_
- **Primary tranche**: _none_
- **Rejection reasons**:
  - senior: expectedLoss 0.0424 > 0.02; tvlUsd 17517 < 25000000; apyBase 0.44% < 2% (reward-only positions blocked)
  - mezzanine: expectedLoss 0.0424 > 0.04; tvlUsd 17517 < 1000000; apyBase 0.44% < 1% (reward-only positions blocked)
  - junior: tvlUsd 17517 < 100000

### mantleVault:e118b8cb-a7f6-4619-8844-791956db623b

- **Source**: mantleVault
- **Asset**: `0xcda86a272531e8640cd7f1a92c01839911b90bb0`
- **APY (base)**: 0.00%    **APY (reward)**: 0.00%    **Total**: 0.00%
- **TVL**: $14,738
- **APY history**: vol=0.00%, drift=1.00x
- **Nansen signal**: _null_ (no key or asset not covered)
- **Probabilities**: exploit=0.02319, depeg=0.00500, oracle=0.00700, illiquid=0.05832, counterparty=0.00500
- **Expected loss**: 2.893% /yr
- **RAAPY**: -2.89%
- **Confidence**: 0.694
- **Score**: -0.0201
- **Eligible tranches**: _none_
- **Primary tranche**: _none_
- **Rejection reasons**:
  - senior: expectedLoss 0.0289 > 0.02; tvlUsd 14738 < 25000000; apyBase 0.00% < 2% (reward-only positions blocked)
  - mezzanine: tvlUsd 14738 < 1000000; apyBase 0.00% < 1% (reward-only positions blocked)
  - junior: tvlUsd 14738 < 100000

### fbtc:d8733ab8-a147-4e31-a668-2c9dff24ea56

- **Source**: fbtc
- **Asset**: `0x201eba5cc46d216ce6dc03f6a759e8e766e956ae`
- **APY (base)**: 10.79%    **APY (reward)**: 1.98%    **Total**: 12.77%
- **TVL**: $14,665
- **APY history**: vol=3.32%, drift=1.20x
- **Nansen signal**: _null_ (no key or asset not covered)
- **Probabilities**: exploit=0.02320, depeg=0.00500, oracle=0.02000, illiquid=0.05834, counterparty=0.08000
- **Expected loss**: 7.164% /yr
- **RAAPY**: 3.63%
- **Confidence**: 0.479
- **Score**: 0.0174
- **Eligible tranches**: _none_
- **Primary tranche**: _none_
- **Rejection reasons**:
  - senior: expectedLoss 0.0716 > 0.02; tvlUsd 14665 < 25000000; apy 10.79% > 8% (too-good-to-be-true gate)
  - mezzanine: expectedLoss 0.0716 > 0.04; tvlUsd 14665 < 1000000
  - junior: tvlUsd 14665 < 100000

### mantleVault:edc32e93-0feb-4d38-bb73-366bb4a2aace

- **Source**: mantleVault
- **Asset**: `0xdeaddeaddeaddeaddeaddeaddeaddeaddead1111`
- **APY (base)**: 0.00%    **APY (reward)**: 0.00%    **Total**: 0.00%
- **TVL**: $10,426
- **APY history**: vol=0.00%, drift=0.96x
- **Nansen signal**: _null_ (no key or asset not covered)
- **Probabilities**: exploit=0.02364, depeg=0.00500, oracle=0.00700, illiquid=0.05982, counterparty=0.00500
- **Expected loss**: 2.938% /yr
- **RAAPY**: -2.93%
- **Confidence**: 0.694
- **Score**: -0.0204
- **Eligible tranches**: _none_
- **Primary tranche**: _none_
- **Rejection reasons**:
  - senior: expectedLoss 0.0294 > 0.02; tvlUsd 10426 < 25000000; apyBase 0.00% < 2% (reward-only positions blocked)
  - mezzanine: tvlUsd 10426 < 1000000; apyBase 0.00% < 1% (reward-only positions blocked)
  - junior: tvlUsd 10426 < 100000

### mantleVault:ae619265-65fd-4584-8934-16a66dc50af3

- **Source**: mantleVault
- **Asset**: `0x09bc4e0d864854c6afb6eb9a9cdf58ac190d0df9`
- **APY (base)**: 0.02%    **APY (reward)**: 0.00%    **Total**: 0.02%
- **TVL**: $10,369
- **APY history**: vol=0.00%, drift=1.01x
- **Nansen signal**: _null_ (no key or asset not covered)
- **Probabilities**: exploit=0.02365, depeg=0.00500, oracle=0.00700, illiquid=0.05984, counterparty=0.00500
- **Expected loss**: 2.939% /yr
- **RAAPY**: -2.92%
- **Confidence**: 0.687
- **Score**: -0.0201
- **Eligible tranches**: _none_
- **Primary tranche**: _none_
- **Rejection reasons**:
  - senior: expectedLoss 0.0294 > 0.02; tvlUsd 10369 < 25000000; apyBase 0.02% < 2% (reward-only positions blocked)
  - mezzanine: tvlUsd 10369 < 1000000; apyBase 0.02% < 1% (reward-only positions blocked)
  - junior: tvlUsd 10369 < 100000

### mantleVault:3441a15d-5f50-4a52-af27-597c182c5c4a

- **Source**: mantleVault
- **Asset**: `0x201eba5cc46d216ce6dc03f6a759e8e766e956ae`
- **APY (base)**: 0.04%    **APY (reward)**: 0.00%    **Total**: 0.04%
- **TVL**: $6,362
- **APY history**: vol=0.00%, drift=1.06x
- **Nansen signal**: _null_ (no key or asset not covered)
- **Probabilities**: exploit=0.02427, depeg=0.00500, oracle=0.00700, illiquid=0.06196, counterparty=0.00500
- **Expected loss**: 3.003% /yr
- **RAAPY**: -2.96%
- **Confidence**: 0.682
- **Score**: -0.0202
- **Eligible tranches**: _none_
- **Primary tranche**: _none_
- **Rejection reasons**:
  - senior: expectedLoss 0.0300 > 0.02; tvlUsd 6362 < 25000000; apyBase 0.04% < 2% (reward-only positions blocked)
  - mezzanine: tvlUsd 6362 < 1000000; apyBase 0.04% < 1% (reward-only positions blocked)
  - junior: tvlUsd 6362 < 100000

### mantleVault:7be673f4-8b41-4d3f-a533-45d20d62e8fa

- **Source**: mantleVault
- **Asset**: `0xcabae6f6ea1ecab08ad02fe02ce9a44f09aebfa2`
- **APY (base)**: 0.71%    **APY (reward)**: 0.02%    **Total**: 0.74%
- **TVL**: $5,907
- **APY history**: vol=0.22%, drift=2.67x
- **Nansen signal**: _null_ (no key or asset not covered)
- **Probabilities**: exploit=0.02437, depeg=0.00500, oracle=0.00700, illiquid=0.06229, counterparty=0.00500
- **Expected loss**: 3.013% /yr
- **RAAPY**: -2.30%
- **Confidence**: 0.486
- **Score**: -0.0112
- **Eligible tranches**: _none_
- **Primary tranche**: _none_
- **Rejection reasons**:
  - senior: expectedLoss 0.0301 > 0.02; tvlUsd 5907 < 25000000; apyBase 0.71% < 2% (reward-only positions blocked)
  - mezzanine: tvlUsd 5907 < 1000000; apyBase 0.71% < 1% (reward-only positions blocked)
  - junior: tvlUsd 5907 < 100000

### mantleVault:f7150467-f302-41e8-9f9a-1f73d2b49df4

- **Source**: mantleVault
- **Asset**: `0x5d3a1ff2b6bab83b63cd9ad0787074081a52ef34`
- **APY (base)**: 49.21%    **APY (reward)**: 0.54%    **Total**: 49.75%
- **TVL**: $3,147
- **APY history**: vol=19.39%, drift=119.43x
- **Nansen signal**: _null_ (no key or asset not covered)
- **Probabilities**: exploit=0.02518, depeg=0.00500, oracle=0.00700, illiquid=0.06502, counterparty=0.00500
- **Expected loss**: 3.095% /yr
- **RAAPY**: 46.11%
- **Confidence**: 0.334
- **Score**: 0.1541
- **Eligible tranches**: _none_
- **Primary tranche**: _none_
- **Rejection reasons**:
  - senior: expectedLoss 0.0310 > 0.02; tvlUsd 3147 < 25000000; apy 49.21% > 8% (too-good-to-be-true gate)
  - mezzanine: tvlUsd 3147 < 1000000; apy 49.21% > 20% (too-good-to-be-true gate)
  - junior: tvlUsd 3147 < 100000

### mantleVault:4f9047f1-ca9f-4b30-b5ad-c7a900c38cae

- **Source**: mantleVault
- **Asset**: `0xdeaddeaddeaddeaddeaddeaddeaddeaddead1111`
- **APY (base)**: 43.35%    **APY (reward)**: 1.49%    **Total**: 44.85%
- **TVL**: $2,924
- **APY history**: no history available
- **Nansen signal**: _null_ (no key or asset not covered)
- **Probabilities**: exploit=0.02527, depeg=0.00500, oracle=0.00700, illiquid=0.06534, counterparty=0.00500
- **Expected loss**: 3.105% /yr
- **RAAPY**: 40.25%
- **Confidence**: 0.487
- **Score**: 0.1962
- **Eligible tranches**: _none_
- **Primary tranche**: _none_
- **Rejection reasons**:
  - senior: expectedLoss 0.0311 > 0.02; tvlUsd 2924 < 25000000; apy 43.35% > 8% (too-good-to-be-true gate)
  - mezzanine: tvlUsd 2924 < 1000000; apy 43.35% > 20% (too-good-to-be-true gate)
  - junior: tvlUsd 2924 < 100000

### mantleVault:a5a47cdc-2ca5-4348-ade9-4adddb1d12d5

- **Source**: mantleVault
- **Asset**: `0xe6829d9a7ee3040e1276fa75293bde931859e8fa`
- **APY (base)**: 0.02%    **APY (reward)**: 0.00%    **Total**: 0.02%
- **TVL**: $2,309
- **APY history**: vol=0.00%, drift=1.04x
- **Nansen signal**: _null_ (no key or asset not covered)
- **Probabilities**: exploit=0.02558, depeg=0.00500, oracle=0.00700, illiquid=0.06637, counterparty=0.00500
- **Expected loss**: 3.136% /yr
- **RAAPY**: -3.11%
- **Confidence**: 0.694
- **Score**: -0.0216
- **Eligible tranches**: _none_
- **Primary tranche**: _none_
- **Rejection reasons**:
  - senior: expectedLoss 0.0314 > 0.02; tvlUsd 2309 < 25000000; apyBase 0.02% < 2% (reward-only positions blocked)
  - mezzanine: tvlUsd 2309 < 1000000; apyBase 0.02% < 1% (reward-only positions blocked)
  - junior: tvlUsd 2309 < 100000

### mantleVault:dce58852-9976-4141-b26a-a832c5edc34e

- **Source**: mantleVault
- **Asset**: `0x201eba5cc46d216ce6dc03f6a759e8e766e956ae`
- **APY (base)**: 50.91%    **APY (reward)**: 1.47%    **Total**: 52.38%
- **TVL**: $2,135
- **APY history**: vol=22.48%, drift=3.55x
- **Nansen signal**: _null_ (no key or asset not covered)
- **Probabilities**: exploit=0.02568, depeg=0.00500, oracle=0.00700, illiquid=0.06671, counterparty=0.00500
- **Expected loss**: 3.146% /yr
- **RAAPY**: 47.76%
- **Confidence**: 0.336
- **Score**: 0.1602
- **Eligible tranches**: _none_
- **Primary tranche**: _none_
- **Rejection reasons**:
  - senior: expectedLoss 0.0315 > 0.02; tvlUsd 2135 < 25000000; apy 50.91% > 8% (too-good-to-be-true gate)
  - mezzanine: tvlUsd 2135 < 1000000; apy 50.91% > 20% (too-good-to-be-true gate)
  - junior: tvlUsd 2135 < 100000

### mantleVault:1362a09f-4853-492b-8083-34e0df20e17b

- **Source**: mantleVault
- **Asset**: `0xc96de26018a54d51c097160568752c4e3bd6c364`
- **APY (base)**: 0.00%    **APY (reward)**: 0.00%    **Total**: 0.00%
- **TVL**: $2,068
- **APY history**: vol=0.00%, drift=1.01x
- **Nansen signal**: _null_ (no key or asset not covered)
- **Probabilities**: exploit=0.02572, depeg=0.00500, oracle=0.00700, illiquid=0.06684, counterparty=0.00500
- **Expected loss**: 3.150% /yr
- **RAAPY**: -3.15%
- **Confidence**: 0.695
- **Score**: -0.0219
- **Eligible tranches**: _none_
- **Primary tranche**: _none_
- **Rejection reasons**:
  - senior: expectedLoss 0.0315 > 0.02; tvlUsd 2068 < 25000000; apyBase 0.00% < 2% (reward-only positions blocked)
  - mezzanine: tvlUsd 2068 < 1000000; apyBase 0.00% < 1% (reward-only positions blocked)
  - junior: tvlUsd 2068 < 100000

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
- **Confidence**: 0.340
- **Score**: 1.3445
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
- **TVL**: $820
- **APY history**: vol=0.49%, drift=9.96x
- **Nansen signal**: _null_ (no key or asset not covered)
- **Probabilities**: exploit=0.02691, depeg=0.00038, oracle=0.00700, illiquid=0.07086, counterparty=0.00500
- **Expected loss**: 3.179% /yr
- **RAAPY**: -2.01%
- **Confidence**: 0.477
- **Score**: -0.0096
- **Eligible tranches**: _none_
- **Primary tranche**: _none_
- **Rejection reasons**:
  - senior: expectedLoss 0.0318 > 0.02; tvlUsd 820 < 25000000; apyBase 1.17% < 2% (reward-only positions blocked)
  - mezzanine: tvlUsd 820 < 1000000
  - junior: tvlUsd 820 < 100000

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
- **Confidence**: 0.479
- **Score**: -0.0373
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
- **Probabilities**: exploit=0.03135, depeg=0.00063, oracle=0.00700, illiquid=0.08585, counterparty=0.00500
- **Expected loss**: 3.637% /yr
- **RAAPY**: -3.64%
- **Confidence**: 0.686
- **Score**: -0.0249
- **Eligible tranches**: _none_
- **Primary tranche**: _none_
- **Rejection reasons**:
  - senior: expectedLoss 0.0364 > 0.02; tvlUsd 26 < 25000000; apyBase 0.00% < 2% (reward-only positions blocked)
  - mezzanine: tvlUsd 26 < 1000000; apyBase 0.00% < 1% (reward-only positions blocked)
  - junior: tvlUsd 26 < 100000

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
- **Confidence**: 0.491
- **Score**: 0.0065
- **Eligible tranches**: _none_
- **Primary tranche**: _none_
- **Rejection reasons**:
  - senior: expectedLoss 0.0842 > 0.02; tvlUsd 0 < 25000000; apy 9.75% > 8% (too-good-to-be-true gate)
  - mezzanine: expectedLoss 0.0842 > 0.04; tvlUsd 0 < 1000000
  - junior: tvlUsd 0 < 100000

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
- **Confidence**: 0.489
- **Score**: 0.0444
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
- **Confidence**: 0.491
- **Score**: 0.0078
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
- **Confidence**: 0.489
- **Score**: 0.0224
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
- **Confidence**: 0.489
- **Score**: 0.0322
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
- **Confidence**: 0.491
- **Score**: 0.0078
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
- **Confidence**: 0.685
- **Score**: 0.0314
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
- **Confidence**: 0.489
- **Score**: 0.0077
- **Eligible tranches**: _none_
- **Primary tranche**: _none_
- **Rejection reasons**:
  - senior: expectedLoss 0.0842 > 0.02; tvlUsd 0 < 25000000; apy 10.00% > 8% (too-good-to-be-true gate)
  - mezzanine: expectedLoss 0.0842 > 0.04; tvlUsd 0 < 1000000
  - junior: tvlUsd 0 < 100000

### aave:4a0e9f84-09a0-491a-aa5e-269813d31a59

- **Source**: aave
- **Asset**: `0xdeaddeaddeaddeaddeaddeaddeaddeaddead1111`
- **APY (base)**: 8.93%    **APY (reward)**: 0.00%    **Total**: 8.93%
- **TVL**: $0
- **APY history**: vol=2.18%, drift=2.25x
- **Nansen signal**: _null_ (no key or asset not covered)
- **Probabilities**: exploit=0.00276, depeg=0.00500, oracle=0.00200, illiquid=0.10000, counterparty=0.00500
- **Expected loss**: 1.165% /yr
- **RAAPY**: 7.76%
- **Confidence**: 0.487
- **Score**: 0.0378
- **Eligible tranches**: _none_
- **Primary tranche**: _none_
- **Rejection reasons**:
  - senior: tvlUsd 0 < 25000000; apy 8.93% > 8% (too-good-to-be-true gate)
  - mezzanine: tvlUsd 0 < 1000000
  - junior: tvlUsd 0 < 100000

### aave:125974d5-ad17-4a3a-b967-ebbf721fca22

- **Source**: aave
- **Asset**: `0xfc421ad3c883bf9e7c4f42de845c4e4405799e73`
- **APY (base)**: 1.46%    **APY (reward)**: 4.10%    **Total**: 5.56%
- **TVL**: $0
- **APY history**: vol=4.17%, drift=0.94x
- **Nansen signal**: _null_ (no key or asset not covered)
- **Probabilities**: exploit=0.00276, depeg=0.00500, oracle=0.00200, illiquid=0.10000, counterparty=0.00500
- **Expected loss**: 1.165% /yr
- **RAAPY**: 0.30%
- **Confidence**: 0.487
- **Score**: 0.0014
- **Eligible tranches**: _none_
- **Primary tranche**: _none_
- **Rejection reasons**:
  - senior: tvlUsd 0 < 25000000; apyBase 1.46% < 2% (reward-only positions blocked)
  - mezzanine: tvlUsd 0 < 1000000
  - junior: tvlUsd 0 < 100000

### mantleVault:341123b4-b690-4d10-b2f8-b8fa64119220

- **Source**: mantleVault
- **Asset**: `0x09bc4e0d864854c6afb6eb9a9cdf58ac190d0df9`
- **APY (base)**: 70.40%    **APY (reward)**: 1.21%    **Total**: 71.61%
- **TVL**: $0
- **APY history**: vol=29.69%, drift=7.26x
- **Nansen signal**: _null_ (no key or asset not covered)
- **Probabilities**: exploit=0.03554, depeg=0.00500, oracle=0.00700, illiquid=0.10000, counterparty=0.00500
- **Expected loss**: 4.151% /yr
- **RAAPY**: 66.25%
- **Confidence**: 0.337
- **Score**: 0.2231
- **Eligible tranches**: _none_
- **Primary tranche**: _none_
- **Rejection reasons**:
  - senior: expectedLoss 0.0415 > 0.02; tvlUsd 0 < 25000000; apy 70.40% > 8% (too-good-to-be-true gate)
  - mezzanine: expectedLoss 0.0415 > 0.04; tvlUsd 0 < 1000000; apy 70.40% > 20% (too-good-to-be-true gate)
  - junior: tvlUsd 0 < 100000

## Signed canonical Yield Map

```json
{
  "version": "1.0",
  "publishedAtMs": 1779283460657,
  "publisher": {
    "address": "0x7e37DB9c32F85436CA5D565E567658B9FbecB9bC",
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
      "tvlUsd": 63888676,
      "lastUpdatedMs": 1779283451669,
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
        "tvlUsd": 63888676,
        "pool": "a4e37545-203b-4412-9acd-3e8b1aa4d744"
      },
      "risk": {
        "contractAgeDays": 700,
        "auditFactor": 0.3,
        "tvlFactor": null,
        "depegEvents": [
          {
            "startMs": 1747833969000,
            "endMs": null,
            "maxDeviation": 0.23139594351023907,
            "recoveryHours": null
          }
        ],
        "oracleType": "chainlink_dec",
        "liquiditySlippageBps": null,
        "counterpartyClass": "permissionless",
        "smartMoneySignal": null,
        "apyVolatility": 0,
        "apyDrift": 1
      },
      "probabilities": {
        "exploit": 0.0009658676412889938,
        "depeg": 0.0006339614890691481,
        "oracle": 0.002,
        "illiquid": 0.021945761118968496,
        "counterparty": 0.005
      },
      "severities": {
        "exploit": 0.85,
        "depeg": 0.2,
        "oracle": 0.4,
        "illiquid": 0.05,
        "counterparty": 0.5
      },
      "expectedLoss": 0.005345067848857899,
      "raapy": -0.005345067848857899,
      "confidence": 0.6857160826556589,
      "score": -0.003665198986847548,
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
      "lastUpdatedMs": 1779283451669,
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
        "depegEvents": [
          {
            "startMs": 1747832337000,
            "endMs": null,
            "maxDeviation": 0.13918936997606068,
            "recoveryHours": null
          }
        ],
        "oracleType": "chainlink_dec",
        "liquiditySlippageBps": null,
        "counterpartyClass": "attested_centralized",
        "smartMoneySignal": null,
        "apyVolatility": 0.00010599978800063698,
        "apyDrift": 0.9985935302390987
      },
      "probabilities": {
        "exploit": 0.0008831633608151709,
        "depeg": 0.00038134073966044024,
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
      "expectedLoss": 0.01789245626225709,
      "raapy": 0.017607543737742908,
      "confidence": 0.6816640912675701,
      "score": 0.012002430301442515,
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
      "apy": 0.0845736,
      "apyReward": 0.0300033,
      "apyType": "variable",
      "tvlUsd": 6830643,
      "lastUpdatedMs": 1779283451669,
      "raw": {
        "chain": "Mantle",
        "project": "aave-v3",
        "symbol": "USDT0",
        "underlyingTokens": [
          "0x779Ded0c9e1022225f8E0630b35a9b54bE713736"
        ],
        "apy": 11.45769,
        "apyBase": 8.45736,
        "apyReward": 3.00033,
        "tvlUsd": 6830643,
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
        "apyVolatility": 0.027398863928625602,
        "apyDrift": 0.8110591220520401
      },
      "probabilities": {
        "exploit": 0.001189447102431655,
        "depeg": 0.005,
        "oracle": 0.002,
        "illiquid": 0.03165538412247042,
        "counterparty": 0.005
      },
      "severities": {
        "exploit": 0.85,
        "depeg": 0.2,
        "oracle": 0.4,
        "illiquid": 0.05,
        "counterparty": 0.5
      },
      "expectedLoss": 0.006893799243190427,
      "raapy": 0.07767980075680957,
      "confidence": 0.6973543456002982,
      "score": 0.05417034662312648,
      "eligibleTranches": [
        "mezzanine",
        "junior"
      ],
      "primaryTranche": "mezzanine",
      "rejectionReasons": [
        {
          "tranche": "senior",
          "reasons": [
            "tvlUsd 6830643 < 25000000",
            "apy 8.46% > 8% (too-good-to-be-true gate)"
          ]
        }
      ]
    },
    {
      "id": "aave:76b70b33-d8a4-4e61-8092-9bd1f2be2fc9",
      "source": "aave",
      "asset": "0x5d3a1ff2b6bab83b63cd9ad0787074081a52ef34",
      "apy": 0.0027999,
      "apyReward": 0.04,
      "apyType": "variable",
      "tvlUsd": 5864475,
      "lastUpdatedMs": 1779283451669,
      "raw": {
        "chain": "Mantle",
        "project": "aave-v3",
        "symbol": "USDE",
        "underlyingTokens": [
          "0x5d3a1Ff2b6BAb83b63cd9AD0787074081a52ef34"
        ],
        "apy": 4.27999,
        "apyBase": 0.27999,
        "apyReward": 4,
        "tvlUsd": 5864475,
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
        "apyVolatility": 0.032122994231528416,
        "apyDrift": 42.93405623447121
      },
      "probabilities": {
        "exploit": 0.0012046981736029282,
        "depeg": 0.005,
        "oracle": 0.002,
        "illiquid": 0.03231770860753638,
        "counterparty": 0.005
      },
      "severities": {
        "exploit": 0.85,
        "depeg": 0.2,
        "oracle": 0.4,
        "illiquid": 0.05,
        "counterparty": 0.5
      },
      "expectedLoss": 0.006939878877939308,
      "raapy": -0.004139978877939308,
      "confidence": 0.3349854552882792,
      "score": -0.0013868327093103584,
      "eligibleTranches": [
        "junior"
      ],
      "primaryTranche": "junior",
      "rejectionReasons": [
        {
          "tranche": "senior",
          "reasons": [
            "tvlUsd 5864475 < 25000000",
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
      "apy": 0.0104236,
      "apyReward": 0,
      "apyType": "variable",
      "tvlUsd": 5852600,
      "lastUpdatedMs": 1779283451669,
      "raw": {
        "chain": "Mantle",
        "project": "aave-v3",
        "symbol": "USDC",
        "underlyingTokens": [
          "0x09Bc4E0D864854c6aFB6eB9A9cdF58aC190D0dF9"
        ],
        "apy": 1.04236,
        "apyBase": 1.04236,
        "apyReward": null,
        "tvlUsd": 5852600,
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
        "apyVolatility": 0.0337009793471602,
        "apyDrift": 0.7121594904677289
      },
      "probabilities": {
        "exploit": 0.001204900875774521,
        "depeg": 0.005,
        "oracle": 0.002,
        "illiquid": 0.032326511570286626,
        "counterparty": 0.005
      },
      "severities": {
        "exploit": 0.85,
        "depeg": 0.2,
        "oracle": 0.4,
        "illiquid": 0.05,
        "counterparty": 0.5
      },
      "expectedLoss": 0.006940491322922675,
      "raapy": 0.003483108677077325,
      "confidence": 0.4811722870484398,
      "score": 0.0016759753681875622,
      "eligibleTranches": [
        "mezzanine",
        "junior"
      ],
      "primaryTranche": "mezzanine",
      "rejectionReasons": [
        {
          "tranche": "senior",
          "reasons": [
            "tvlUsd 5852600 < 25000000",
            "apyBase 1.04% < 2% (reward-only positions blocked)"
          ]
        }
      ]
    },
    {
      "id": "agni:35f2103d-231b-443b-952e-d2cd118d8f29",
      "source": "agni",
      "asset": "0x779ded0c9e1022225f8e0630b35a9b54be713736",
      "apy": 0.32078490000000004,
      "apyReward": 0,
      "apyType": "variable",
      "tvlUsd": 1083561,
      "lastUpdatedMs": 1779283451669,
      "raw": {
        "chain": "Mantle",
        "project": "fluxion-network",
        "symbol": "USDT0-BSB",
        "underlyingTokens": [
          "0x779ded0c9e1022225f8e0630b35a9b54be713736",
          "0xe5c330addf7aa9c7838da836436142c56a15aa95"
        ],
        "apy": 32.07849,
        "apyBase": 32.07849,
        "apyReward": null,
        "tvlUsd": 1083561,
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
        "apyVolatility": 0.619036347585667,
        "apyDrift": 1.3799578983996834
      },
      "probabilities": {
        "exploit": 0.0066822111748090105,
        "depeg": 0.005,
        "oracle": 0.007,
        "illiquid": 0.0396514663467394,
        "counterparty": 0.005
      },
      "severities": {
        "exploit": 0.85,
        "depeg": 0.2,
        "oracle": 0.4,
        "illiquid": 0.05,
        "counterparty": 0.5
      },
      "expectedLoss": 0.01396245281592463,
      "raapy": 0.3068224471840754,
      "confidence": 0.48736925411099363,
      "score": 0.14953582722861258,
      "eligibleTranches": [
        "junior"
      ],
      "primaryTranche": "junior",
      "rejectionReasons": [
        {
          "tranche": "senior",
          "reasons": [
            "tvlUsd 1083561 < 25000000",
            "apy 32.08% > 8% (too-good-to-be-true gate)"
          ]
        },
        {
          "tranche": "mezzanine",
          "reasons": [
            "apy 32.08% > 20% (too-good-to-be-true gate)"
          ]
        }
      ]
    },
    {
      "id": "agni:85407ecd-f711-4fa6-9328-3078aebfaa95",
      "source": "agni",
      "asset": "0x55b9f84605b30df9bb9d817a6900219f25218157",
      "apy": 0.1058756,
      "apyReward": 0,
      "apyType": "variable",
      "tvlUsd": 827340,
      "lastUpdatedMs": 1779283451669,
      "raw": {
        "chain": "Mantle",
        "project": "fluxion-network",
        "symbol": "BILL-USDT0",
        "underlyingTokens": [
          "0x55b9f84605b30df9bb9d817a6900219f25218157",
          "0x779ded0c9e1022225f8e0630b35a9b54be713736"
        ],
        "apy": 10.58756,
        "apyBase": 10.58756,
        "apyReward": null,
        "tvlUsd": 827340,
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
        "exploit": 0.006813465332232468,
        "depeg": 0.005,
        "oracle": 0.007,
        "illiquid": 0.04082315978018417,
        "counterparty": 0.005
      },
      "severities": {
        "exploit": 0.85,
        "depeg": 0.2,
        "oracle": 0.4,
        "illiquid": 0.05,
        "counterparty": 0.5
      },
      "expectedLoss": 0.014132603521406809,
      "raapy": 0.09174299647859319,
      "confidence": 0.49696590978168287,
      "score": 0.04559314171108179,
      "eligibleTranches": [
        "junior"
      ],
      "primaryTranche": "junior",
      "rejectionReasons": [
        {
          "tranche": "senior",
          "reasons": [
            "tvlUsd 827340 < 25000000",
            "apy 10.59% > 8% (too-good-to-be-true gate)"
          ]
        },
        {
          "tranche": "mezzanine",
          "reasons": [
            "tvlUsd 827340 < 1000000"
          ]
        }
      ]
    },
    {
      "id": "agni:6d76a4e2-57f2-4190-a882-bd69f6ea32fb",
      "source": "agni",
      "asset": "0x45db70e1c808dae42f9c4dfea74ba5e6a113bdc1",
      "apy": 0.0284449,
      "apyReward": 0,
      "apyType": "variable",
      "tvlUsd": 428827,
      "lastUpdatedMs": 1779283451669,
      "raw": {
        "chain": "Mantle",
        "project": "fluxion-network",
        "symbol": "OPG-USDT0",
        "underlyingTokens": [
          "0x45db70e1c808dae42f9c4dfea74ba5e6a113bdc1",
          "0x779ded0c9e1022225f8e0630b35a9b54be713736"
        ],
        "apy": 2.84449,
        "apyBase": 2.84449,
        "apyReward": null,
        "tvlUsd": 428827,
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
        "apyVolatility": 9.51257912505226,
        "apyDrift": 0.03410064552184095
      },
      "probabilities": {
        "exploit": 0.007133175120366639,
        "depeg": 0.005,
        "oracle": 0.007,
        "illiquid": 0.04367717878208346,
        "counterparty": 0.005
      },
      "severities": {
        "exploit": 0.85,
        "depeg": 0.2,
        "oracle": 0.4,
        "illiquid": 0.05,
        "counterparty": 0.5
      },
      "expectedLoss": 0.014547057791415817,
      "raapy": 0.013897842208584182,
      "confidence": 0.48852080384490904,
      "score": 0.00678938504744725,
      "eligibleTranches": [
        "junior"
      ],
      "primaryTranche": "junior",
      "rejectionReasons": [
        {
          "tranche": "senior",
          "reasons": [
            "tvlUsd 428827 < 25000000"
          ]
        },
        {
          "tranche": "mezzanine",
          "reasons": [
            "tvlUsd 428827 < 1000000"
          ]
        }
      ]
    },
    {
      "id": "mantleVault:c87c5d7c-0285-47a9-8539-d335f05b9ba2",
      "source": "mantleVault",
      "asset": "0xcda86a272531e8640cd7f1a92c01839911b90bb0",
      "apy": 0.0031143,
      "apyReward": 0.0002947,
      "apyType": "variable",
      "tvlUsd": 268958,
      "lastUpdatedMs": 1779283451669,
      "raw": {
        "chain": "Mantle",
        "project": "lendle-pooled-markets",
        "symbol": "METH",
        "underlyingTokens": [
          "0xcDA86A272531e8640cD7F1a92c01839911B90bb0"
        ],
        "apy": 0.34091,
        "apyBase": 0.31143,
        "apyReward": 0.02947,
        "tvlUsd": 268958,
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
        "exploit": 0.01945879959639608,
        "depeg": 0.005,
        "oracle": 0.007,
        "illiquid": 0.04570315533352081,
        "counterparty": 0.005
      },
      "severities": {
        "exploit": 0.85,
        "depeg": 0.2,
        "oracle": 0.4,
        "illiquid": 0.05,
        "counterparty": 0.5
      },
      "expectedLoss": 0.02512513742361271,
      "raapy": -0.02201083742361271,
      "confidence": 0.6948182739503084,
      "score": -0.015293532066875436,
      "eligibleTranches": [
        "junior"
      ],
      "primaryTranche": "junior",
      "rejectionReasons": [
        {
          "tranche": "senior",
          "reasons": [
            "expectedLoss 0.0251 > 0.02",
            "tvlUsd 268958 < 25000000",
            "apyBase 0.31% < 2% (reward-only positions blocked)"
          ]
        },
        {
          "tranche": "mezzanine",
          "reasons": [
            "tvlUsd 268958 < 1000000",
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
      "apyReward": 0.0004763,
      "apyType": "variable",
      "tvlUsd": 193563,
      "lastUpdatedMs": 1779283451669,
      "raw": {
        "chain": "Mantle",
        "project": "lendle-pooled-markets",
        "symbol": "CMETH",
        "underlyingTokens": [
          "0xE6829d9a7eE3040e1276Fa75293Bde931859e8fA"
        ],
        "apy": 0.05102,
        "apyBase": 0.00339,
        "apyReward": 0.04763,
        "tvlUsd": 193563,
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
        "apyVolatility": null,
        "apyDrift": null
      },
      "probabilities": {
        "exploit": 0.019881903386435498,
        "depeg": 0.005,
        "oracle": 0.007,
        "illiquid": 0.04713177655454977,
        "counterparty": 0.005
      },
      "severities": {
        "exploit": 0.85,
        "depeg": 0.2,
        "oracle": 0.4,
        "illiquid": 0.05,
        "counterparty": 0.5
      },
      "expectedLoss": 0.025556206706197664,
      "raapy": -0.025522306706197664,
      "confidence": 0.48761269441600746,
      "score": -0.01244500074072078,
      "eligibleTranches": [
        "junior"
      ],
      "primaryTranche": "junior",
      "rejectionReasons": [
        {
          "tranche": "senior",
          "reasons": [
            "expectedLoss 0.0256 > 0.02",
            "tvlUsd 193563 < 25000000",
            "apyBase 0.00% < 2% (reward-only positions blocked)"
          ]
        },
        {
          "tranche": "mezzanine",
          "reasons": [
            "tvlUsd 193563 < 1000000",
            "apyBase 0.00% < 1% (reward-only positions blocked)"
          ]
        }
      ]
    },
    {
      "id": "agni:649bee89-0a34-4eb1-b8ab-7c5fdee07ccd",
      "source": "agni",
      "asset": "0x29cc30f9d113b356ce408667aa6433589cecbdca",
      "apy": 0.0089013,
      "apyReward": 0,
      "apyType": "variable",
      "tvlUsd": 131984,
      "lastUpdatedMs": 1779283451669,
      "raw": {
        "chain": "Mantle",
        "project": "fluxion-network",
        "symbol": "ELSA-USDT0",
        "underlyingTokens": [
          "0x29cc30f9d113b356ce408667aa6433589cecbdca",
          "0x779ded0c9e1022225f8e0630b35a9b54be713736"
        ],
        "apy": 0.89013,
        "apyBase": 0.89013,
        "apyReward": null,
        "tvlUsd": 131984,
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
        "apyVolatility": 0.030362326271377783,
        "apyDrift": 0.5756583630171309
      },
      "probabilities": {
        "exploit": 0.007706454233765581,
        "depeg": 0.005,
        "oracle": 0.007,
        "illiquid": 0.048794787137402006,
        "counterparty": 0.005
      },
      "severities": {
        "exploit": 0.85,
        "depeg": 0.2,
        "oracle": 0.4,
        "illiquid": 0.05,
        "counterparty": 0.5
      },
      "expectedLoss": 0.015290225455570846,
      "raapy": -0.006388925455570847,
      "confidence": 0.4860049088860218,
      "score": -0.003105049133914295,
      "eligibleTranches": [
        "junior"
      ],
      "primaryTranche": "junior",
      "rejectionReasons": [
        {
          "tranche": "senior",
          "reasons": [
            "tvlUsd 131984 < 25000000",
            "apyBase 0.89% < 2% (reward-only positions blocked)"
          ]
        },
        {
          "tranche": "mezzanine",
          "reasons": [
            "tvlUsd 131984 < 1000000",
            "apyBase 0.89% < 1% (reward-only positions blocked)"
          ]
        }
      ]
    },
    {
      "id": "agni:227e8492-33e9-4953-8beb-28973c9fdb8a",
      "source": "agni",
      "asset": "0x09bc4e0d864854c6afb6eb9a9cdf58ac190d0df9",
      "apy": 0.0009804,
      "apyReward": 0,
      "apyType": "variable",
      "tvlUsd": 116233,
      "lastUpdatedMs": 1779283451669,
      "raw": {
        "chain": "Mantle",
        "project": "fluxion-network",
        "symbol": "USDC-WGOOGLX",
        "underlyingTokens": [
          "0x09bc4e0d864854c6afb6eb9a9cdf58ac190d0df9",
          "0x1630f08370917e79df0b7572395a5e907508bbbc"
        ],
        "apy": 0.09804,
        "apyBase": 0.09804,
        "apyReward": null,
        "tvlUsd": 116233,
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
        "apyVolatility": 0.00822834382047661,
        "apyDrift": 1.3016777710289962
      },
      "probabilities": {
        "exploit": 0.007768280630733913,
        "depeg": 0.005,
        "oracle": 0.007,
        "illiquid": 0.04934670552812871,
        "counterparty": 0.005
      },
      "severities": {
        "exploit": 0.85,
        "depeg": 0.2,
        "oracle": 0.4,
        "illiquid": 0.05,
        "counterparty": 0.5
      },
      "expectedLoss": 0.015370373812530261,
      "raapy": -0.014389973812530262,
      "confidence": 0.6874004380762674,
      "score": -0.009891674302639318,
      "eligibleTranches": [
        "junior"
      ],
      "primaryTranche": "junior",
      "rejectionReasons": [
        {
          "tranche": "senior",
          "reasons": [
            "tvlUsd 116233 < 25000000",
            "apyBase 0.10% < 2% (reward-only positions blocked)"
          ]
        },
        {
          "tranche": "mezzanine",
          "reasons": [
            "tvlUsd 116233 < 1000000",
            "apyBase 0.10% < 1% (reward-only positions blocked)"
          ]
        }
      ]
    },
    {
      "id": "agni:2a510869-6356-4486-8bb5-d5a808634496",
      "source": "agni",
      "asset": "0x09bc4e0d864854c6afb6eb9a9cdf58ac190d0df9",
      "apy": 0.004056000000000001,
      "apyReward": 0,
      "apyType": "variable",
      "tvlUsd": 112580,
      "lastUpdatedMs": 1779283451669,
      "raw": {
        "chain": "Mantle",
        "project": "fluxion-network",
        "symbol": "USDC-WNVDAX",
        "underlyingTokens": [
          "0x09bc4e0d864854c6afb6eb9a9cdf58ac190d0df9",
          "0x93e62845c1dd5822ebc807ab71a5fb750decd15a"
        ],
        "apy": 0.4056,
        "apyBase": 0.4056,
        "apyReward": null,
        "tvlUsd": 112580,
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
        "apyVolatility": 0.010662856788069417,
        "apyDrift": 1.682739758238426
      },
      "probabilities": {
        "exploit": 0.0077838159169256425,
        "depeg": 0.005,
        "oracle": 0.007,
        "illiquid": 0.049485387556758166,
        "counterparty": 0.005
      },
      "severities": {
        "exploit": 0.85,
        "depeg": 0.2,
        "oracle": 0.4,
        "illiquid": 0.05,
        "counterparty": 0.5
      },
      "expectedLoss": 0.015390512907224705,
      "raapy": -0.011334512907224705,
      "confidence": 0.4811787027217049,
      "score": -0.005453926216680803,
      "eligibleTranches": [
        "junior"
      ],
      "primaryTranche": "junior",
      "rejectionReasons": [
        {
          "tranche": "senior",
          "reasons": [
            "tvlUsd 112580 < 25000000",
            "apyBase 0.41% < 2% (reward-only positions blocked)"
          ]
        },
        {
          "tranche": "mezzanine",
          "reasons": [
            "tvlUsd 112580 < 1000000",
            "apyBase 0.41% < 1% (reward-only positions blocked)"
          ]
        }
      ]
    },
    {
      "id": "agni:ebec73de-fd1e-4f97-8287-d9cb01c7d352",
      "source": "agni",
      "asset": "0x09bc4e0d864854c6afb6eb9a9cdf58ac190d0df9",
      "apy": 0.0058957,
      "apyReward": 0,
      "apyType": "variable",
      "tvlUsd": 111392,
      "lastUpdatedMs": 1779283451669,
      "raw": {
        "chain": "Mantle",
        "project": "fluxion-network",
        "symbol": "USDC-WMSTRX",
        "underlyingTokens": [
          "0x09bc4e0d864854c6afb6eb9a9cdf58ac190d0df9",
          "0x266e5923f6118f8b340ca5a23ae7f71897361476"
        ],
        "apy": 0.58957,
        "apyBase": 0.58957,
        "apyReward": null,
        "tvlUsd": 111392,
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
        "apyVolatility": 0.024180949079999157,
        "apyDrift": 0.9505605013355053
      },
      "probabilities": {
        "exploit": 0.00778897699186211,
        "depeg": 0.005,
        "oracle": 0.007,
        "illiquid": 0.049531459983958054,
        "counterparty": 0.005
      },
      "severities": {
        "exploit": 0.85,
        "depeg": 0.2,
        "oracle": 0.4,
        "illiquid": 0.05,
        "counterparty": 0.5
      },
      "expectedLoss": 0.015397203442280696,
      "raapy": -0.009501503442280696,
      "confidence": 0.687391272798195,
      "score": -0.006531250544685759,
      "eligibleTranches": [
        "junior"
      ],
      "primaryTranche": "junior",
      "rejectionReasons": [
        {
          "tranche": "senior",
          "reasons": [
            "tvlUsd 111392 < 25000000",
            "apyBase 0.59% < 2% (reward-only positions blocked)"
          ]
        },
        {
          "tranche": "mezzanine",
          "reasons": [
            "tvlUsd 111392 < 1000000",
            "apyBase 0.59% < 1% (reward-only positions blocked)"
          ]
        }
      ]
    },
    {
      "id": "agni:3b6b75cf-adb5-4fb4-bbcd-8f75c6879c9d",
      "source": "agni",
      "asset": "0x09bc4e0d864854c6afb6eb9a9cdf58ac190d0df9",
      "apy": 0.0045486,
      "apyReward": 0,
      "apyType": "variable",
      "tvlUsd": 109138,
      "lastUpdatedMs": 1779283451669,
      "raw": {
        "chain": "Mantle",
        "project": "fluxion-network",
        "symbol": "USDC-WAAPLX",
        "underlyingTokens": [
          "0x09bc4e0d864854c6afb6eb9a9cdf58ac190d0df9",
          "0x5aa7649fdbda47de64a07ac81d64b682af9c0724"
        ],
        "apy": 0.45486,
        "apyBase": 0.45486,
        "apyReward": null,
        "tvlUsd": 109138,
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
        "apyVolatility": 0.005924472666854397,
        "apyDrift": 1.7883840189457385
      },
      "probabilities": {
        "exploit": 0.007798922219706045,
        "depeg": 0.005,
        "oracle": 0.007,
        "illiquid": 0.049620240091099777,
        "counterparty": 0.005
      },
      "severities": {
        "exploit": 0.85,
        "depeg": 0.2,
        "oracle": 0.4,
        "illiquid": 0.05,
        "counterparty": 0.5
      },
      "expectedLoss": 0.015410095891305127,
      "raapy": -0.010861495891305127,
      "confidence": 0.48117709879536896,
      "score": -0.005226303081556021,
      "eligibleTranches": [
        "junior"
      ],
      "primaryTranche": "junior",
      "rejectionReasons": [
        {
          "tranche": "senior",
          "reasons": [
            "tvlUsd 109138 < 25000000",
            "apyBase 0.45% < 2% (reward-only positions blocked)"
          ]
        },
        {
          "tranche": "mezzanine",
          "reasons": [
            "tvlUsd 109138 < 1000000",
            "apyBase 0.45% < 1% (reward-only positions blocked)"
          ]
        }
      ]
    },
    {
      "id": "agni:2364dd66-69d3-44ef-9e85-4d5217a57b57",
      "source": "agni",
      "asset": "0x09bc4e0d864854c6afb6eb9a9cdf58ac190d0df9",
      "apy": 0.0016809,
      "apyReward": 0,
      "apyType": "variable",
      "tvlUsd": 109132,
      "lastUpdatedMs": 1779283451669,
      "raw": {
        "chain": "Mantle",
        "project": "fluxion-network",
        "symbol": "USDC-WQQQX",
        "underlyingTokens": [
          "0x09bc4e0d864854c6afb6eb9a9cdf58ac190d0df9",
          "0xdbd9232fee15351068fe02f0683146e16d9f2cea"
        ],
        "apy": 0.16809,
        "apyBase": 0.16809,
        "apyReward": null,
        "tvlUsd": 109132,
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
        "apyVolatility": 0.0021034015527902628,
        "apyDrift": 1.2066335810111604
      },
      "probabilities": {
        "exploit": 0.007798948966429133,
        "depeg": 0.005,
        "oracle": 0.007,
        "illiquid": 0.04962047885656384,
        "counterparty": 0.005
      },
      "severities": {
        "exploit": 0.85,
        "depeg": 0.2,
        "oracle": 0.4,
        "illiquid": 0.05,
        "counterparty": 0.5
      },
      "expectedLoss": 0.015410130564292955,
      "raapy": -0.013729230564292955,
      "confidence": 0.6874004380762674,
      "score": -0.009437479104345057,
      "eligibleTranches": [
        "junior"
      ],
      "primaryTranche": "junior",
      "rejectionReasons": [
        {
          "tranche": "senior",
          "reasons": [
            "tvlUsd 109132 < 25000000",
            "apyBase 0.17% < 2% (reward-only positions blocked)"
          ]
        },
        {
          "tranche": "mezzanine",
          "reasons": [
            "tvlUsd 109132 < 1000000",
            "apyBase 0.17% < 1% (reward-only positions blocked)"
          ]
        }
      ]
    },
    {
      "id": "agni:3d429d4e-b3a6-4847-957b-b10bf26a6f01",
      "source": "agni",
      "asset": "0x779ded0c9e1022225f8e0630b35a9b54be713736",
      "apy": 0.0000491,
      "apyReward": 0,
      "apyType": "variable",
      "tvlUsd": 108235,
      "lastUpdatedMs": 1779283451669,
      "raw": {
        "chain": "Mantle",
        "project": "fluxion-network",
        "symbol": "USDT0-SCOR",
        "underlyingTokens": [
          "0x779ded0c9e1022225f8e0630b35a9b54be713736",
          "0x8ddb986b11c039a6cc1dbcabd62bae911b348f33"
        ],
        "apy": 0.00491,
        "apyBase": 0.00491,
        "apyReward": null,
        "tvlUsd": 108235,
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
        "apyVolatility": 0.06544062201446131,
        "apyDrift": 0.1631013717998638
      },
      "probabilities": {
        "exploit": 0.007802964235709887,
        "depeg": 0.005,
        "oracle": 0.007,
        "illiquid": 0.04965632278518391,
        "counterparty": 0.005
      },
      "severities": {
        "exploit": 0.85,
        "depeg": 0.2,
        "oracle": 0.4,
        "illiquid": 0.05,
        "counterparty": 0.5
      },
      "expectedLoss": 0.015415335739612599,
      "raapy": -0.0153662357396126,
      "confidence": 0.487375752411037,
      "score": -0.007489130705319058,
      "eligibleTranches": [
        "junior"
      ],
      "primaryTranche": "junior",
      "rejectionReasons": [
        {
          "tranche": "senior",
          "reasons": [
            "tvlUsd 108235 < 25000000",
            "apyBase 0.00% < 2% (reward-only positions blocked)"
          ]
        },
        {
          "tranche": "mezzanine",
          "reasons": [
            "tvlUsd 108235 < 1000000",
            "apyBase 0.00% < 1% (reward-only positions blocked)"
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
      "lastUpdatedMs": 1779283451669,
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
      "confidence": 0.4811722870484398,
      "score": -0.004973063860913006,
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
      "id": "agni:913ce101-55b1-4230-93c7-d523f0d9ca03",
      "source": "agni",
      "asset": "0x09bc4e0d864854c6afb6eb9a9cdf58ac190d0df9",
      "apy": 0.0009052999999999999,
      "apyReward": 0,
      "apyType": "variable",
      "tvlUsd": 106662,
      "lastUpdatedMs": 1779283451669,
      "raw": {
        "chain": "Mantle",
        "project": "fluxion-network",
        "symbol": "USDC-WSPYX",
        "underlyingTokens": [
          "0x09bc4e0d864854c6afb6eb9a9cdf58ac190d0df9",
          "0xc88fcd8b874fdb3256e8b55b3decb8c24eab4c02"
        ],
        "apy": 0.09053,
        "apyBase": 0.09053,
        "apyReward": null,
        "tvlUsd": 106662,
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
        "apyVolatility": 0.0012516502459972107,
        "apyDrift": 0.6802482673486743
      },
      "probabilities": {
        "exploit": 0.007810086523297243,
        "depeg": 0.005,
        "oracle": 0.007,
        "illiquid": 0.04971990277198986,
        "counterparty": 0.005
      },
      "severities": {
        "exploit": 0.85,
        "depeg": 0.2,
        "oracle": 0.4,
        "illiquid": 0.05,
        "counterparty": 0.5
      },
      "expectedLoss": 0.01542456868340215,
      "raapy": -0.014519268683402151,
      "confidence": 0.687391272798195,
      "score": -0.009980418580382778,
      "eligibleTranches": [
        "junior"
      ],
      "primaryTranche": "junior",
      "rejectionReasons": [
        {
          "tranche": "senior",
          "reasons": [
            "tvlUsd 106662 < 25000000",
            "apyBase 0.09% < 2% (reward-only positions blocked)"
          ]
        },
        {
          "tranche": "mezzanine",
          "reasons": [
            "tvlUsd 106662 < 1000000",
            "apyBase 0.09% < 1% (reward-only positions blocked)"
          ]
        }
      ]
    },
    {
      "id": "agni:a4ff3d7c-a117-4b24-a9f9-6af46cd276c0",
      "source": "agni",
      "asset": "0x09bc4e0d864854c6afb6eb9a9cdf58ac190d0df9",
      "apy": 0.004203,
      "apyReward": 0,
      "apyType": "variable",
      "tvlUsd": 106464,
      "lastUpdatedMs": 1779283451669,
      "raw": {
        "chain": "Mantle",
        "project": "fluxion-network",
        "symbol": "USDC-WTSLAX",
        "underlyingTokens": [
          "0x09bc4e0d864854c6afb6eb9a9cdf58ac190d0df9",
          "0x43680abf18cf54898be84c6ef78237cfbd441883"
        ],
        "apy": 0.4203,
        "apyBase": 0.4203,
        "apyReward": null,
        "tvlUsd": 106464,
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
        "apyVolatility": 0.01180476667605134,
        "apyDrift": 1.047526957053828
      },
      "probabilities": {
        "exploit": 0.007810990468825106,
        "depeg": 0.005,
        "oracle": 0.007,
        "illiquid": 0.04972797220811272,
        "counterparty": 0.005
      },
      "severities": {
        "exploit": 0.85,
        "depeg": 0.2,
        "oracle": 0.4,
        "illiquid": 0.05,
        "counterparty": 0.5
      },
      "expectedLoss": 0.015425740508906978,
      "raapy": -0.011222740508906977,
      "confidence": 0.6873935641062565,
      "score": -0.00771443959745723,
      "eligibleTranches": [
        "junior"
      ],
      "primaryTranche": "junior",
      "rejectionReasons": [
        {
          "tranche": "senior",
          "reasons": [
            "tvlUsd 106464 < 25000000",
            "apyBase 0.42% < 2% (reward-only positions blocked)"
          ]
        },
        {
          "tranche": "mezzanine",
          "reasons": [
            "tvlUsd 106464 < 1000000",
            "apyBase 0.42% < 1% (reward-only positions blocked)"
          ]
        }
      ]
    },
    {
      "id": "agni:b8d50460-5237-4601-9250-4f2d3a6b569b",
      "source": "agni",
      "asset": "0x09bc4e0d864854c6afb6eb9a9cdf58ac190d0df9",
      "apy": 0.0057611,
      "apyReward": 0,
      "apyType": "variable",
      "tvlUsd": 103498,
      "lastUpdatedMs": 1779283451669,
      "raw": {
        "chain": "Mantle",
        "project": "fluxion-network",
        "symbol": "USDC-WMETAX",
        "underlyingTokens": [
          "0x09bc4e0d864854c6afb6eb9a9cdf58ac190d0df9",
          "0x4e41a262caa93c6575d336e0a4eb79f3c67caa06"
        ],
        "apy": 0.57611,
        "apyBase": 0.57611,
        "apyReward": null,
        "tvlUsd": 103498,
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
        "apyVolatility": 0.006648203996428054,
        "apyDrift": 0.9912218291473617
      },
      "probabilities": {
        "exploit": 0.00782473635413419,
        "depeg": 0.005,
        "oracle": 0.007,
        "illiquid": 0.0498506804245205,
        "counterparty": 0.005
      },
      "severities": {
        "exploit": 0.85,
        "depeg": 0.2,
        "oracle": 0.4,
        "illiquid": 0.05,
        "counterparty": 0.5
      },
      "expectedLoss": 0.015443559922240087,
      "raapy": -0.009682459922240087,
      "confidence": 0.6874027294148799,
      "score": -0.006655749377998022,
      "eligibleTranches": [
        "junior"
      ],
      "primaryTranche": "junior",
      "rejectionReasons": [
        {
          "tranche": "senior",
          "reasons": [
            "tvlUsd 103498 < 25000000",
            "apyBase 0.58% < 2% (reward-only positions blocked)"
          ]
        },
        {
          "tranche": "mezzanine",
          "reasons": [
            "tvlUsd 103498 < 1000000",
            "apyBase 0.58% < 1% (reward-only positions blocked)"
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
      "lastUpdatedMs": 1779283451669,
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
      "confidence": 0.6873981467452928,
      "score": -0.0066603499637956495,
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
      "lastUpdatedMs": 1779283451669,
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
        "apyVolatility": null,
        "apyDrift": null
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
      "confidence": 0.48524541103173213,
      "score": -0.006867015596401675,
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
      "apyReward": 0.003636,
      "apyType": "variable",
      "tvlUsd": 72368,
      "lastUpdatedMs": 1779283451669,
      "raw": {
        "chain": "Mantle",
        "project": "lendle-pooled-markets",
        "symbol": "WMNT",
        "underlyingTokens": [
          "0x78c1b0C915c4FAA5FffA6CAbf0219DA63d7f4cb8"
        ],
        "apy": 0.43112,
        "apyBase": 0.06752,
        "apyReward": 0.3636,
        "tvlUsd": 72368,
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
        "exploit": 0.021147333276254704,
        "depeg": 0.005,
        "oracle": 0.007,
        "illiquid": 0.051404534295981574,
        "counterparty": 0.005
      },
      "severities": {
        "exploit": 0.85,
        "depeg": 0.2,
        "oracle": 0.4,
        "illiquid": 0.05,
        "counterparty": 0.5
      },
      "expectedLoss": 0.026845459999615576,
      "raapy": -0.026170259999615576,
      "confidence": 0.694781217963866,
      "score": -0.018182605116963953,
      "eligibleTranches": [],
      "primaryTranche": null,
      "rejectionReasons": [
        {
          "tranche": "senior",
          "reasons": [
            "expectedLoss 0.0268 > 0.02",
            "tvlUsd 72368 < 25000000",
            "apyBase 0.07% < 2% (reward-only positions blocked)"
          ]
        },
        {
          "tranche": "mezzanine",
          "reasons": [
            "tvlUsd 72368 < 1000000",
            "apyBase 0.07% < 1% (reward-only positions blocked)"
          ]
        },
        {
          "tranche": "junior",
          "reasons": [
            "tvlUsd 72368 < 100000"
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
      "tvlUsd": 51738,
      "lastUpdatedMs": 1779283451669,
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
        "tvlUsd": 51738,
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
        "apyVolatility": null,
        "apyDrift": null
      },
      "probabilities": {
        "exploit": 0.030964130939210976,
        "depeg": 0.005,
        "oracle": 0.02,
        "illiquid": 0.05286190363515722,
        "counterparty": 0.005
      },
      "severities": {
        "exploit": 0.85,
        "depeg": 0.2,
        "oracle": 0.4,
        "illiquid": 0.05,
        "counterparty": 0.5
      },
      "expectedLoss": 0.0404626064800872,
      "raapy": -0.0114485064800872,
      "confidence": 0.4899229326468088,
      "score": -0.005608885869150315,
      "eligibleTranches": [],
      "primaryTranche": null,
      "rejectionReasons": [
        {
          "tranche": "senior",
          "reasons": [
            "expectedLoss 0.0405 > 0.02",
            "tvlUsd 51738 < 25000000"
          ]
        },
        {
          "tranche": "mezzanine",
          "reasons": [
            "expectedLoss 0.0405 > 0.04",
            "tvlUsd 51738 < 1000000"
          ]
        },
        {
          "tranche": "junior",
          "reasons": [
            "tvlUsd 51738 < 100000"
          ]
        }
      ]
    },
    {
      "id": "agni:ab6d4bd4-fa82-4f09-9588-98c953179d61",
      "source": "agni",
      "asset": "0x29cc30f9d113b356ce408667aa6433589cecbdca",
      "apy": 0.0124004,
      "apyReward": 0,
      "apyType": "variable",
      "tvlUsd": 47700,
      "lastUpdatedMs": 1779283451669,
      "raw": {
        "chain": "Mantle",
        "project": "fluxion-network",
        "symbol": "ELSA-WMNT",
        "underlyingTokens": [
          "0x29cc30f9d113b356ce408667aa6433589cecbdca",
          "0x78c1b0c915c4faa5fffa6cabf0219da63d7f4cb8"
        ],
        "apy": 1.24004,
        "apyBase": 1.24004,
        "apyReward": null,
        "tvlUsd": 47700,
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
        "apyVolatility": 0.026870098257544533,
        "apyDrift": 0.6259771216147216
      },
      "probabilities": {
        "exploit": 0.008201589885377758,
        "depeg": 0.005,
        "oracle": 0.007,
        "illiquid": 0.05321481620959887,
        "counterparty": 0.005
      },
      "severities": {
        "exploit": 0.85,
        "depeg": 0.2,
        "oracle": 0.4,
        "illiquid": 0.05,
        "counterparty": 0.5
      },
      "expectedLoss": 0.015932092213051037,
      "raapy": -0.0035316922130510364,
      "confidence": 0.6964483739601749,
      "score": -0.002459641299107206,
      "eligibleTranches": [],
      "primaryTranche": null,
      "rejectionReasons": [
        {
          "tranche": "senior",
          "reasons": [
            "tvlUsd 47700 < 25000000",
            "apyBase 1.24% < 2% (reward-only positions blocked)"
          ]
        },
        {
          "tranche": "mezzanine",
          "reasons": [
            "tvlUsd 47700 < 1000000"
          ]
        },
        {
          "tranche": "junior",
          "reasons": [
            "tvlUsd 47700 < 100000"
          ]
        }
      ]
    },
    {
      "id": "agni:6a134700-f4a3-49ad-ad5a-fe1868b1c744",
      "source": "agni",
      "asset": "0x111111d2bf19e43c34263401e0cad979ed1cdb61",
      "apy": 0.0042255,
      "apyReward": 0,
      "apyType": "variable",
      "tvlUsd": 44582,
      "lastUpdatedMs": 1779283451669,
      "raw": {
        "chain": "Mantle",
        "project": "fluxion-network",
        "symbol": "USD1-USDT0",
        "underlyingTokens": [
          "0x111111d2bf19e43c34263401e0cad979ed1cdb61",
          "0x779ded0c9e1022225f8e0630b35a9b54be713736"
        ],
        "apy": 0.42255,
        "apyBase": 0.42255,
        "apyReward": null,
        "tvlUsd": 44582,
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
        "apyVolatility": 1.3259856272965742,
        "apyDrift": 0.04994933729770021
      },
      "probabilities": {
        "exploit": 0.008234477913785057,
        "depeg": 0.005,
        "oracle": 0.007,
        "illiquid": 0.053508404524668055,
        "counterparty": 0.005
      },
      "severities": {
        "exploit": 0.85,
        "depeg": 0.2,
        "oracle": 0.4,
        "illiquid": 0.05,
        "counterparty": 0.5
      },
      "expectedLoss": 0.015974726452950703,
      "raapy": -0.011749226452950703,
      "confidence": 0.48753823807461344,
      "score": -0.005728197163611226,
      "eligibleTranches": [],
      "primaryTranche": null,
      "rejectionReasons": [
        {
          "tranche": "senior",
          "reasons": [
            "tvlUsd 44582 < 25000000",
            "apyBase 0.42% < 2% (reward-only positions blocked)"
          ]
        },
        {
          "tranche": "mezzanine",
          "reasons": [
            "tvlUsd 44582 < 1000000",
            "apyBase 0.42% < 1% (reward-only positions blocked)"
          ]
        },
        {
          "tranche": "junior",
          "reasons": [
            "tvlUsd 44582 < 100000"
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
      "tvlUsd": 34062,
      "lastUpdatedMs": 1779283451669,
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
        "tvlUsd": 34062,
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
        "exploit": 0.022116602765642156,
        "depeg": 0.005,
        "oracle": 0.007,
        "illiquid": 0.05467729855390944,
        "counterparty": 0.005
      },
      "severities": {
        "exploit": 0.85,
        "depeg": 0.2,
        "oracle": 0.4,
        "illiquid": 0.05,
        "counterparty": 0.5
      },
      "expectedLoss": 0.027832977278491305,
      "raapy": -0.027825677278491306,
      "confidence": 0.694477896395384,
      "score": -0.01932431782214348,
      "eligibleTranches": [],
      "primaryTranche": null,
      "rejectionReasons": [
        {
          "tranche": "senior",
          "reasons": [
            "expectedLoss 0.0278 > 0.02",
            "tvlUsd 34062 < 25000000",
            "apyBase 0.00% < 2% (reward-only positions blocked)"
          ]
        },
        {
          "tranche": "mezzanine",
          "reasons": [
            "tvlUsd 34062 < 1000000",
            "apyBase 0.00% < 1% (reward-only positions blocked)"
          ]
        },
        {
          "tranche": "junior",
          "reasons": [
            "tvlUsd 34062 < 100000"
          ]
        }
      ]
    },
    {
      "id": "mantleVault:dc732e3d-d65b-4087-8d48-53e50bb47732",
      "source": "mantleVault",
      "asset": "0xc96de26018a54d51c097160568752c4e3bd6c364",
      "apy": 0.003801,
      "apyReward": 0.012481299999999999,
      "apyType": "variable",
      "tvlUsd": 28256,
      "lastUpdatedMs": 1779283451669,
      "raw": {
        "chain": "Mantle",
        "project": "lendle-pooled-markets",
        "symbol": "FBTC",
        "underlyingTokens": [
          "0xC96dE26018A54D51c097160568752c4E3BD6C364"
        ],
        "apy": 1.62823,
        "apyBase": 0.3801,
        "apyReward": 1.24813,
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
      "confidence": 0.69405670757843,
      "score": -0.016849521826842257,
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
      "tvlUsd": 21826,
      "lastUpdatedMs": 1779283451669,
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
        "tvlUsd": 21826,
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
        "exploit": 0.02268907268522491,
        "depeg": 0.005,
        "oracle": 0.007,
        "illiquid": 0.0566102584913292,
        "counterparty": 0.005
      },
      "severities": {
        "exploit": 0.85,
        "depeg": 0.2,
        "oracle": 0.4,
        "illiquid": 0.05,
        "counterparty": 0.5
      },
      "expectedLoss": 0.028416224707007633,
      "raapy": -0.028415124707007633,
      "confidence": 0.6944825262634595,
      "score": -0.019733807590613908,
      "eligibleTranches": [],
      "primaryTranche": null,
      "rejectionReasons": [
        {
          "tranche": "senior",
          "reasons": [
            "expectedLoss 0.0284 > 0.02",
            "tvlUsd 21826 < 25000000",
            "apyBase 0.00% < 2% (reward-only positions blocked)"
          ]
        },
        {
          "tranche": "mezzanine",
          "reasons": [
            "tvlUsd 21826 < 1000000",
            "apyBase 0.00% < 1% (reward-only positions blocked)"
          ]
        },
        {
          "tranche": "junior",
          "reasons": [
            "tvlUsd 21826 < 100000"
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
      "tvlUsd": 17517,
      "lastUpdatedMs": 1779283451669,
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
        "tvlUsd": 17517,
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
        "exploit": 0.03296297743730013,
        "depeg": 0.005,
        "oracle": 0.02,
        "illiquid": 0.05756540270029051,
        "counterparty": 0.005
      },
      "severities": {
        "exploit": 0.85,
        "depeg": 0.2,
        "oracle": 0.4,
        "illiquid": 0.05,
        "counterparty": 0.5
      },
      "expectedLoss": 0.04239680095671964,
      "raapy": -0.03794970095671964,
      "confidence": 0.4852990947676006,
      "score": -0.018416955520997185,
      "eligibleTranches": [],
      "primaryTranche": null,
      "rejectionReasons": [
        {
          "tranche": "senior",
          "reasons": [
            "expectedLoss 0.0424 > 0.02",
            "tvlUsd 17517 < 25000000",
            "apyBase 0.44% < 2% (reward-only positions blocked)"
          ]
        },
        {
          "tranche": "mezzanine",
          "reasons": [
            "expectedLoss 0.0424 > 0.04",
            "tvlUsd 17517 < 1000000",
            "apyBase 0.44% < 1% (reward-only positions blocked)"
          ]
        },
        {
          "tranche": "junior",
          "reasons": [
            "tvlUsd 17517 < 100000"
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
      "tvlUsd": 14738,
      "lastUpdatedMs": 1779283451669,
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
        "tvlUsd": 14738,
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
        "exploit": 0.02319413488839105,
        "depeg": 0.005,
        "oracle": 0.007,
        "illiquid": 0.05831561447813228,
        "counterparty": 0.005
      },
      "severities": {
        "exploit": 0.85,
        "depeg": 0.2,
        "oracle": 0.4,
        "illiquid": 0.05,
        "counterparty": 0.5
      },
      "expectedLoss": 0.028930795379039007,
      "raapy": -0.028930695379039008,
      "confidence": 0.6939595464408074,
      "score": -0.020076732243455072,
      "eligibleTranches": [],
      "primaryTranche": null,
      "rejectionReasons": [
        {
          "tranche": "senior",
          "reasons": [
            "expectedLoss 0.0289 > 0.02",
            "tvlUsd 14738 < 25000000",
            "apyBase 0.00% < 2% (reward-only positions blocked)"
          ]
        },
        {
          "tranche": "mezzanine",
          "reasons": [
            "tvlUsd 14738 < 1000000",
            "apyBase 0.00% < 1% (reward-only positions blocked)"
          ]
        },
        {
          "tranche": "junior",
          "reasons": [
            "tvlUsd 14738 < 100000"
          ]
        }
      ]
    },
    {
      "id": "fbtc:d8733ab8-a147-4e31-a668-2c9dff24ea56",
      "source": "fbtc",
      "asset": "0x201eba5cc46d216ce6dc03f6a759e8e766e956ae",
      "apy": 0.10791740000000001,
      "apyReward": 0.0198312,
      "apyType": "variable",
      "tvlUsd": 14665,
      "lastUpdatedMs": 1779283451669,
      "raw": {
        "chain": "Mantle",
        "project": "clearpool-lending",
        "symbol": "USDT",
        "underlyingTokens": [
          "0x201eba5cc46d216ce6dc03f6a759e8e766e956ae"
        ],
        "apy": 12.77487,
        "apyBase": 10.79174,
        "apyReward": 1.98312,
        "tvlUsd": 14665,
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
        "apyVolatility": 0.03324706790928885,
        "apyDrift": 1.2014560350722252
      },
      "probabilities": {
        "exploit": 0.02320052158423677,
        "depeg": 0.005,
        "oracle": 0.02,
        "illiquid": 0.0583371793268343,
        "counterparty": 0.08
      },
      "severities": {
        "exploit": 0.85,
        "depeg": 0.2,
        "oracle": 0.4,
        "illiquid": 0.05,
        "counterparty": 0.5
      },
      "expectedLoss": 0.07163730231294296,
      "raapy": 0.03628009768705705,
      "confidence": 0.47928339331233677,
      "score": 0.017388448329155762,
      "eligibleTranches": [],
      "primaryTranche": null,
      "rejectionReasons": [
        {
          "tranche": "senior",
          "reasons": [
            "expectedLoss 0.0716 > 0.02",
            "tvlUsd 14665 < 25000000",
            "apy 10.79% > 8% (too-good-to-be-true gate)"
          ]
        },
        {
          "tranche": "mezzanine",
          "reasons": [
            "expectedLoss 0.0716 > 0.04",
            "tvlUsd 14665 < 1000000"
          ]
        },
        {
          "tranche": "junior",
          "reasons": [
            "tvlUsd 14665 < 100000"
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
      "tvlUsd": 10426,
      "lastUpdatedMs": 1779283451669,
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
        "tvlUsd": 10426,
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
        "exploit": 0.023639328566280277,
        "depeg": 0.005,
        "oracle": 0.007,
        "illiquid": 0.05981882279409,
        "counterparty": 0.005
      },
      "severities": {
        "exploit": 0.85,
        "depeg": 0.2,
        "oracle": 0.4,
        "illiquid": 0.05,
        "counterparty": 0.5
      },
      "expectedLoss": 0.029384370421042732,
      "raapy": -0.029336770421042734,
      "confidence": 0.6942186730387672,
      "score": -0.02036613383293924,
      "eligibleTranches": [],
      "primaryTranche": null,
      "rejectionReasons": [
        {
          "tranche": "senior",
          "reasons": [
            "expectedLoss 0.0294 > 0.02",
            "tvlUsd 10426 < 25000000",
            "apyBase 0.00% < 2% (reward-only positions blocked)"
          ]
        },
        {
          "tranche": "mezzanine",
          "reasons": [
            "tvlUsd 10426 < 1000000",
            "apyBase 0.00% < 1% (reward-only positions blocked)"
          ]
        },
        {
          "tranche": "junior",
          "reasons": [
            "tvlUsd 10426 < 100000"
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
      "tvlUsd": 10369,
      "lastUpdatedMs": 1779283451669,
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
        "tvlUsd": 10369,
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
        "exploit": 0.02364637973561275,
        "depeg": 0.005,
        "oracle": 0.007,
        "illiquid": 0.05984263125522551,
        "counterparty": 0.005
      },
      "severities": {
        "exploit": 0.85,
        "depeg": 0.2,
        "oracle": 0.4,
        "illiquid": 0.05,
        "counterparty": 0.5
      },
      "expectedLoss": 0.029391554338032113,
      "raapy": -0.029188654338032114,
      "confidence": 0.6873935641062565,
      "score": -0.020064093136885442,
      "eligibleTranches": [],
      "primaryTranche": null,
      "rejectionReasons": [
        {
          "tranche": "senior",
          "reasons": [
            "expectedLoss 0.0294 > 0.02",
            "tvlUsd 10369 < 25000000",
            "apyBase 0.02% < 2% (reward-only positions blocked)"
          ]
        },
        {
          "tranche": "mezzanine",
          "reasons": [
            "tvlUsd 10369 < 1000000",
            "apyBase 0.02% < 1% (reward-only positions blocked)"
          ]
        },
        {
          "tranche": "junior",
          "reasons": [
            "tvlUsd 10369 < 100000"
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
      "tvlUsd": 6362,
      "lastUpdatedMs": 1779283451669,
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
        "tvlUsd": 6362,
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
        "exploit": 0.024274668009205184,
        "depeg": 0.005,
        "oracle": 0.007,
        "illiquid": 0.06196406335228656,
        "counterparty": 0.005
      },
      "severities": {
        "exploit": 0.85,
        "depeg": 0.2,
        "oracle": 0.4,
        "illiquid": 0.05,
        "counterparty": 0.5
      },
      "expectedLoss": 0.030031670975438737,
      "raapy": -0.029611570975438737,
      "confidence": 0.6818390741728411,
      "score": -0.02019032613869652,
      "eligibleTranches": [],
      "primaryTranche": null,
      "rejectionReasons": [
        {
          "tranche": "senior",
          "reasons": [
            "expectedLoss 0.0300 > 0.02",
            "tvlUsd 6362 < 25000000",
            "apyBase 0.04% < 2% (reward-only positions blocked)"
          ]
        },
        {
          "tranche": "mezzanine",
          "reasons": [
            "tvlUsd 6362 < 1000000",
            "apyBase 0.04% < 1% (reward-only positions blocked)"
          ]
        },
        {
          "tranche": "junior",
          "reasons": [
            "tvlUsd 6362 < 100000"
          ]
        }
      ]
    },
    {
      "id": "mantleVault:7be673f4-8b41-4d3f-a533-45d20d62e8fa",
      "source": "mantleVault",
      "asset": "0xcabae6f6ea1ecab08ad02fe02ce9a44f09aebfa2",
      "apy": 0.0071475,
      "apyReward": 0.0002393,
      "apyType": "variable",
      "tvlUsd": 5907,
      "lastUpdatedMs": 1779283451669,
      "raw": {
        "chain": "Mantle",
        "project": "lendle-pooled-markets",
        "symbol": "WBTC",
        "underlyingTokens": [
          "0xCAbAE6f6Ea1ecaB08Ad02fE02ce9A44F09aebfA2"
        ],
        "apy": 0.73868,
        "apyBase": 0.71475,
        "apyReward": 0.02393,
        "tvlUsd": 5907,
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
        "exploit": 0.02437011133690158,
        "depeg": 0.005,
        "oracle": 0.007,
        "illiquid": 0.0622863302914222,
        "counterparty": 0.005
      },
      "severities": {
        "exploit": 0.85,
        "depeg": 0.2,
        "oracle": 0.4,
        "illiquid": 0.05,
        "counterparty": 0.5
      },
      "expectedLoss": 0.03012891115093745,
      "raapy": -0.02298141115093745,
      "confidence": 0.48611508248457214,
      "score": -0.011171610577249825,
      "eligibleTranches": [],
      "primaryTranche": null,
      "rejectionReasons": [
        {
          "tranche": "senior",
          "reasons": [
            "expectedLoss 0.0301 > 0.02",
            "tvlUsd 5907 < 25000000",
            "apyBase 0.71% < 2% (reward-only positions blocked)"
          ]
        },
        {
          "tranche": "mezzanine",
          "reasons": [
            "tvlUsd 5907 < 1000000",
            "apyBase 0.71% < 1% (reward-only positions blocked)"
          ]
        },
        {
          "tranche": "junior",
          "reasons": [
            "tvlUsd 5907 < 100000"
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
      "tvlUsd": 3147,
      "lastUpdatedMs": 1779283451669,
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
        "tvlUsd": 3147,
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
        "exploit": 0.025180027136856936,
        "depeg": 0.005,
        "oracle": 0.007,
        "illiquid": 0.0650210325708678,
        "counterparty": 0.005
      },
      "severities": {
        "exploit": 0.85,
        "depeg": 0.2,
        "oracle": 0.4,
        "illiquid": 0.05,
        "counterparty": 0.5
      },
      "expectedLoss": 0.030954074694871787,
      "raapy": 0.4611031253051282,
      "confidence": 0.33425041152346757,
      "score": 0.15412390938799614,
      "eligibleTranches": [],
      "primaryTranche": null,
      "rejectionReasons": [
        {
          "tranche": "senior",
          "reasons": [
            "expectedLoss 0.0310 > 0.02",
            "tvlUsd 3147 < 25000000",
            "apy 49.21% > 8% (too-good-to-be-true gate)"
          ]
        },
        {
          "tranche": "mezzanine",
          "reasons": [
            "tvlUsd 3147 < 1000000",
            "apy 49.21% > 20% (too-good-to-be-true gate)"
          ]
        },
        {
          "tranche": "junior",
          "reasons": [
            "tvlUsd 3147 < 100000"
          ]
        }
      ]
    },
    {
      "id": "mantleVault:4f9047f1-ca9f-4b30-b5ad-c7a900c38cae",
      "source": "mantleVault",
      "asset": "0xdeaddeaddeaddeaddeaddeaddeaddeaddead1111",
      "apy": 0.4335303,
      "apyReward": 0.01494,
      "apyType": "variable",
      "tvlUsd": 2924,
      "lastUpdatedMs": 1779283451669,
      "raw": {
        "chain": "Mantle",
        "project": "lendle-pooled-markets",
        "symbol": "WETH",
        "underlyingTokens": [
          "0xdEAddEaDdeadDEadDEADDEAddEADDEAddead1111"
        ],
        "apy": 44.84703,
        "apyBase": 43.35303,
        "apyReward": 1.494,
        "tvlUsd": 2924,
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
        "apyVolatility": null,
        "apyDrift": null
      },
      "probabilities": {
        "exploit": 0.025274560300593735,
        "depeg": 0.005,
        "oracle": 0.007,
        "illiquid": 0.06534022631714179,
        "counterparty": 0.005
      },
      "severities": {
        "exploit": 0.85,
        "depeg": 0.2,
        "oracle": 0.4,
        "illiquid": 0.05,
        "counterparty": 0.5
      },
      "expectedLoss": 0.031050387571361766,
      "raapy": 0.40247991242863823,
      "confidence": 0.48744855910654816,
      "score": 0.1961882533826694,
      "eligibleTranches": [],
      "primaryTranche": null,
      "rejectionReasons": [
        {
          "tranche": "senior",
          "reasons": [
            "expectedLoss 0.0311 > 0.02",
            "tvlUsd 2924 < 25000000",
            "apy 43.35% > 8% (too-good-to-be-true gate)"
          ]
        },
        {
          "tranche": "mezzanine",
          "reasons": [
            "tvlUsd 2924 < 1000000",
            "apy 43.35% > 20% (too-good-to-be-true gate)"
          ]
        },
        {
          "tranche": "junior",
          "reasons": [
            "tvlUsd 2924 < 100000"
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
      "tvlUsd": 2309,
      "lastUpdatedMs": 1779283451669,
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
        "tvlUsd": 2309,
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
        "exploit": 0.025578284944658487,
        "depeg": 0.005,
        "oracle": 0.007,
        "illiquid": 0.06636576067082825,
        "counterparty": 0.005
      },
      "severities": {
        "exploit": 0.85,
        "depeg": 0.2,
        "oracle": 0.4,
        "illiquid": 0.05,
        "counterparty": 0.5
      },
      "expectedLoss": 0.03135983023650113,
      "raapy": -0.03114953023650113,
      "confidence": 0.6941932188207526,
      "score": -0.021623792659631078,
      "eligibleTranches": [],
      "primaryTranche": null,
      "rejectionReasons": [
        {
          "tranche": "senior",
          "reasons": [
            "expectedLoss 0.0314 > 0.02",
            "tvlUsd 2309 < 25000000",
            "apyBase 0.02% < 2% (reward-only positions blocked)"
          ]
        },
        {
          "tranche": "mezzanine",
          "reasons": [
            "tvlUsd 2309 < 1000000",
            "apyBase 0.02% < 1% (reward-only positions blocked)"
          ]
        },
        {
          "tranche": "junior",
          "reasons": [
            "tvlUsd 2309 < 100000"
          ]
        }
      ]
    },
    {
      "id": "mantleVault:dce58852-9976-4141-b26a-a832c5edc34e",
      "source": "mantleVault",
      "asset": "0x201eba5cc46d216ce6dc03f6a759e8e766e956ae",
      "apy": 0.509073,
      "apyReward": 0.014744,
      "apyType": "variable",
      "tvlUsd": 2135,
      "lastUpdatedMs": 1779283451669,
      "raw": {
        "chain": "Mantle",
        "project": "lendle-pooled-markets",
        "symbol": "USDT",
        "underlyingTokens": [
          "0x201EBa5CC46D216Ce6DC03F6a759e8E766e956aE"
        ],
        "apy": 52.3817,
        "apyBase": 50.9073,
        "apyReward": 1.4744,
        "tvlUsd": 2135,
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
        "apyVolatility": 0.22480912653752744,
        "apyDrift": 3.5500376042084283
      },
      "probabilities": {
        "exploit": 0.025679057297804096,
        "depeg": 0.005,
        "oracle": 0.007,
        "illiquid": 0.06670602120638958,
        "counterparty": 0.005
      },
      "severities": {
        "exploit": 0.85,
        "depeg": 0.2,
        "oracle": 0.4,
        "illiquid": 0.05,
        "counterparty": 0.5
      },
      "expectedLoss": 0.031462499763452965,
      "raapy": 0.47761050023654705,
      "confidence": 0.33550061198192666,
      "score": 0.16023861511835566,
      "eligibleTranches": [],
      "primaryTranche": null,
      "rejectionReasons": [
        {
          "tranche": "senior",
          "reasons": [
            "expectedLoss 0.0315 > 0.02",
            "tvlUsd 2135 < 25000000",
            "apy 50.91% > 8% (too-good-to-be-true gate)"
          ]
        },
        {
          "tranche": "mezzanine",
          "reasons": [
            "tvlUsd 2135 < 1000000",
            "apy 50.91% > 20% (too-good-to-be-true gate)"
          ]
        },
        {
          "tranche": "junior",
          "reasons": [
            "tvlUsd 2135 < 100000"
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
      "tvlUsd": 2068,
      "lastUpdatedMs": 1779283451669,
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
        "tvlUsd": 2068,
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
        "exploit": 0.02572006791727055,
        "depeg": 0.005,
        "oracle": 0.007,
        "illiquid": 0.06684449465578096,
        "counterparty": 0.005
      },
      "severities": {
        "exploit": 0.85,
        "depeg": 0.2,
        "oracle": 0.4,
        "illiquid": 0.05,
        "counterparty": 0.5
      },
      "expectedLoss": 0.031504282462469016,
      "raapy": -0.03149788246246902,
      "confidence": 0.6953024993334175,
      "score": -0.021900556399864927,
      "eligibleTranches": [],
      "primaryTranche": null,
      "rejectionReasons": [
        {
          "tranche": "senior",
          "reasons": [
            "expectedLoss 0.0315 > 0.02",
            "tvlUsd 2068 < 25000000",
            "apyBase 0.00% < 2% (reward-only positions blocked)"
          ]
        },
        {
          "tranche": "mezzanine",
          "reasons": [
            "tvlUsd 2068 < 1000000",
            "apyBase 0.00% < 1% (reward-only positions blocked)"
          ]
        },
        {
          "tranche": "junior",
          "reasons": [
            "tvlUsd 2068 < 100000"
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
      "lastUpdatedMs": 1779283451669,
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
      "confidence": 0.34028736341841187,
      "score": 1.3445489632112086,
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
      "tvlUsd": 820,
      "lastUpdatedMs": 1779283451669,
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
        "tvlUsd": 820,
        "pool": "46cbb5d7-5462-443b-886a-f371349a5d8c"
      },
      "risk": {
        "contractAgeDays": 365,
        "auditFactor": 0.6,
        "tvlFactor": null,
        "depegEvents": [
          {
            "startMs": 1747832337000,
            "endMs": null,
            "maxDeviation": 0.13918936997606068,
            "recoveryHours": null
          }
        ],
        "oracleType": "redstone",
        "liquiditySlippageBps": null,
        "counterpartyClass": "permissionless",
        "smartMoneySignal": null,
        "apyVolatility": 0.004936482284246207,
        "apyDrift": 9.95816035914269
      },
      "probabilities": {
        "exploit": 0.026909860636755656,
        "depeg": 0.00038134073966044024,
        "oracle": 0.007,
        "illiquid": 0.07086186147616283,
        "counterparty": 0.005
      },
      "severities": {
        "exploit": 0.85,
        "depeg": 0.2,
        "oracle": 0.4,
        "illiquid": 0.05,
        "counterparty": 0.5
      },
      "expectedLoss": 0.03179274276298254,
      "raapy": -0.02008394276298254,
      "confidence": 0.4771664544394963,
      "score": -0.009583383759378158,
      "eligibleTranches": [],
      "primaryTranche": null,
      "rejectionReasons": [
        {
          "tranche": "senior",
          "reasons": [
            "expectedLoss 0.0318 > 0.02",
            "tvlUsd 820 < 25000000",
            "apyBase 1.17% < 2% (reward-only positions blocked)"
          ]
        },
        {
          "tranche": "mezzanine",
          "reasons": [
            "tvlUsd 820 < 1000000"
          ]
        },
        {
          "tranche": "junior",
          "reasons": [
            "tvlUsd 820 < 100000"
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
      "lastUpdatedMs": 1779283451669,
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
      "confidence": 0.47928499092631044,
      "score": -0.03733237514962744,
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
      "lastUpdatedMs": 1779283451669,
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
        "depegEvents": [
          {
            "startMs": 1747833969000,
            "endMs": null,
            "maxDeviation": 0.23139594351023907,
            "recoveryHours": null
          }
        ],
        "oracleType": "redstone",
        "liquiditySlippageBps": null,
        "counterpartyClass": "permissionless",
        "smartMoneySignal": null,
        "apyVolatility": 0,
        "apyDrift": 1
      },
      "probabilities": {
        "exploit": 0.03134886160319051,
        "depeg": 0.0006339614890691481,
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
      "expectedLoss": 0.036365837986540354,
      "raapy": -0.036365837986540354,
      "confidence": 0.685718368379744,
      "score": -0.024936723088892564,
      "eligibleTranches": [],
      "primaryTranche": null,
      "rejectionReasons": [
        {
          "tranche": "senior",
          "reasons": [
            "expectedLoss 0.0364 > 0.02",
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
      "id": "fbtc:b283d8ef-8342-4932-a345-155be63c6f84",
      "source": "fbtc",
      "asset": "0x09bc4e0d864854c6afb6eb9a9cdf58ac190d0df9",
      "apy": 0.0975,
      "apyReward": 0,
      "apyType": "variable",
      "tvlUsd": 0,
      "lastUpdatedMs": 1779283451669,
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
      "confidence": 0.4909970395871113,
      "score": 0.006526058822131765,
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
      "id": "fbtc:098dd57e-f57a-4715-b408-65472b61afe8",
      "source": "fbtc",
      "asset": "0x201eba5cc46d216ce6dc03f6a759e8e766e956ae",
      "apy": 0.175,
      "apyReward": 0,
      "apyType": "variable",
      "tvlUsd": 0,
      "lastUpdatedMs": 1779283451669,
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
      "confidence": 0.4890695777247287,
      "score": 0.04440333234766504,
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
      "lastUpdatedMs": 1779283451669,
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
      "confidence": 0.49099376628442504,
      "score": 0.007753499730929038,
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
      "lastUpdatedMs": 1779283451669,
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
      "confidence": 0.48906794749552,
      "score": 0.02239512669950551,
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
      "lastUpdatedMs": 1779283451669,
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
      "confidence": 0.48906631727174543,
      "score": 0.0321763783946425,
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
      "lastUpdatedMs": 1779283451669,
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
      "confidence": 0.4909970395871113,
      "score": 0.007753551421099545,
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
      "lastUpdatedMs": 1779283451669,
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
      "confidence": 0.6846996911431201,
      "score": 0.03135338640118698,
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
      "lastUpdatedMs": 1779283451669,
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
      "confidence": 0.4890695777247287,
      "score": 0.007723114018310398,
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
      "id": "aave:4a0e9f84-09a0-491a-aa5e-269813d31a59",
      "source": "aave",
      "asset": "0xdeaddeaddeaddeaddeaddeaddeaddeaddead1111",
      "apy": 0.08925000000000001,
      "apyReward": 0,
      "apyType": "variable",
      "tvlUsd": 0,
      "lastUpdatedMs": 1779283451669,
      "raw": {
        "chain": "Mantle",
        "project": "aave-v3",
        "symbol": "WETH",
        "underlyingTokens": [
          "0xdEAddEaDdeadDEadDEADDEAddEADDEAddead1111"
        ],
        "apy": 8.925,
        "apyBase": 8.925,
        "apyReward": null,
        "tvlUsd": 0,
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
        "apyVolatility": 0.02181129729638675,
        "apyDrift": 2.252306259405858
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
      "raapy": 0.07760128831177829,
      "confidence": 0.48688050552257855,
      "score": 0.03778255448244198,
      "eligibleTranches": [],
      "primaryTranche": null,
      "rejectionReasons": [
        {
          "tranche": "senior",
          "reasons": [
            "tvlUsd 0 < 25000000",
            "apy 8.93% > 8% (too-good-to-be-true gate)"
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
      "id": "aave:125974d5-ad17-4a3a-b967-ebbf721fca22",
      "source": "aave",
      "asset": "0xfc421ad3c883bf9e7c4f42de845c4e4405799e73",
      "apy": 0.0146153,
      "apyReward": 0.0409582,
      "apyType": "variable",
      "tvlUsd": 0,
      "lastUpdatedMs": 1779283451669,
      "raw": {
        "chain": "Mantle",
        "project": "aave-v3",
        "symbol": "GHO",
        "underlyingTokens": [
          "0xfc421aD3C883Bf9E7C4f42dE845C4e4405799e73"
        ],
        "apy": 5.55735,
        "apyBase": 1.46153,
        "apyReward": 4.09582,
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
        "apyVolatility": 0.041708119624902576,
        "apyDrift": 0.9436568269851769
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
      "raapy": 0.0029665883117782794,
      "confidence": 0.48749436160765736,
      "score": 0.0014461950752030902,
      "eligibleTranches": [],
      "primaryTranche": null,
      "rejectionReasons": [
        {
          "tranche": "senior",
          "reasons": [
            "tvlUsd 0 < 25000000",
            "apyBase 1.46% < 2% (reward-only positions blocked)"
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
      "id": "mantleVault:341123b4-b690-4d10-b2f8-b8fa64119220",
      "source": "mantleVault",
      "asset": "0x09bc4e0d864854c6afb6eb9a9cdf58ac190d0df9",
      "apy": 0.7040000000000001,
      "apyReward": 0.0121314,
      "apyType": "variable",
      "tvlUsd": 0,
      "lastUpdatedMs": 1779283451669,
      "raw": {
        "chain": "Mantle",
        "project": "lendle-pooled-markets",
        "symbol": "USDC",
        "underlyingTokens": [
          "0x09Bc4E0D864854c6aFB6eB9A9cdF58aC190D0dF9"
        ],
        "apy": 71.61314,
        "apyBase": 70.4,
        "apyReward": 1.21314,
        "tvlUsd": 0,
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
        "apyVolatility": 0.2969424953603342,
        "apyDrift": 7.255732135293098
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
      "raapy": 0.6624914423020141,
      "confidence": 0.3368206009339078,
      "score": 0.22314076570973568,
      "eligibleTranches": [],
      "primaryTranche": null,
      "rejectionReasons": [
        {
          "tranche": "senior",
          "reasons": [
            "expectedLoss 0.0415 > 0.02",
            "tvlUsd 0 < 25000000",
            "apy 70.40% > 8% (too-good-to-be-true gate)"
          ]
        },
        {
          "tranche": "mezzanine",
          "reasons": [
            "expectedLoss 0.0415 > 0.04",
            "tvlUsd 0 < 1000000",
            "apy 70.40% > 20% (too-good-to-be-true gate)"
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
      "aave:47da0cdd-7b1d-4927-9545-20b53b73afa8",
      "agni:85407ecd-f711-4fa6-9328-3078aebfaa95",
      "ondo:b5d7a190-38d2-4fdd-8c14-1fd00c11bce1",
      "agni:6d76a4e2-57f2-4190-a882-bd69f6ea32fb",
      "aave:32cb38a5-b9b9-441a-bf07-8fab47b999d3",
      "aave:76b70b33-d8a4-4e61-8092-9bd1f2be2fc9",
      "agni:649bee89-0a34-4eb1-b8ab-7c5fdee07ccd",
      "aave:a4e37545-203b-4412-9acd-3e8b1aa4d744",
      "agni:a7e2f58e-1c93-4592-acd6-8e40e6cb26ff",
      "agni:3b6b75cf-adb5-4fb4-bbcd-8f75c6879c9d",
      "agni:2a510869-6356-4486-8bb5-d5a808634496",
      "agni:ebec73de-fd1e-4f97-8287-d9cb01c7d352",
      "agni:b8d50460-5237-4601-9250-4f2d3a6b569b",
      "agni:30836422-c578-4f77-8f81-861c509c5d4c",
      "agni:b5933580-18c1-43b6-aec3-2563cd30e3a2",
      "agni:3d429d4e-b3a6-4847-957b-b10bf26a6f01",
      "agni:a4ff3d7c-a117-4b24-a9f9-6af46cd276c0",
      "agni:2364dd66-69d3-44ef-9e85-4d5217a57b57",
      "agni:227e8492-33e9-4953-8beb-28973c9fdb8a",
      "agni:913ce101-55b1-4230-93c7-d523f0d9ca03",
      "mantleVault:b96d8236-36d4-4be4-92f7-422beeac7073",
      "mantleVault:c87c5d7c-0285-47a9-8539-d335f05b9ba2"
    ]
  },
  "signature": "0x4c805552b059a91c8eb5f0d99b93d1c126e61ae5a02496bc5c54a5922da8b0672bd613ed3aafdd7e09d63c32539a08a41693a8a8c2d79753cf528b8ecbd28da91b"
}
```
