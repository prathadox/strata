# Scout dry-cycle inspection

Generated: 2026-05-20T09:04:45.872Z
Ephemeral signer: `0xE5D42a62D677C86cE9f9406BB31dd31f2E153201`
Map hash: `0xd08442cacc6638b0c5b0f7383ac39b3887bb418193166c3615cf22f2627c56a6`

This file is produced by `scripts/inspect-cycle.ts`. The pipeline runs end to end, fetching real data from DefiLlama (yields + price history). Nansen and Lighthouse are skipped; the signature is over an ephemeral keypair generated at run time.

## Summary

- Opportunities ingested: **57**
- Opportunities scored: **57**
- Senior-eligible: **1**
- Mezzanine-eligible: **4**
- Junior-eligible: **23**

## Per-tranche rankings

### Senior (1)

| Rank | Source | Pool id | APY | RAAPY | Score | TVL |
|---|---|---|---|---|---|---|
| 1 | ondo | `ondo:b5d7a190-38d2-4fdd-8c14-1fd00c11bce1` | 3.55% | 1.76% | 0.0120 | $29,444,317 |

### Mezzanine (4)

| Rank | Source | Pool id | APY | RAAPY | Score | TVL |
|---|---|---|---|---|---|---|
| 1 | agni | `agni:35f2103d-231b-443b-952e-d2cd118d8f29` | 18.93% | 17.54% | 0.0855 | $1,071,059 |
| 2 | aave | `aave:47da0cdd-7b1d-4927-9545-20b53b73afa8` | 3.29% | 2.62% | 0.0182 | $17,462,078 |
| 3 | ondo | `ondo:b5d7a190-38d2-4fdd-8c14-1fd00c11bce1` | 3.55% | 1.76% | 0.0120 | $29,444,317 |
| 4 | aave | `aave:32cb38a5-b9b9-441a-bf07-8fab47b999d3` | 1.85% | 1.14% | 0.0054 | $3,836,761 |

### Junior (23)

| Rank | Source | Pool id | APY | RAAPY | Score | TVL |
|---|---|---|---|---|---|---|
| 1 | agni | `agni:35f2103d-231b-443b-952e-d2cd118d8f29` | 18.93% | 17.54% | 0.0855 | $1,071,059 |
| 2 | agni | `agni:85407ecd-f711-4fa6-9328-3078aebfaa95` | 6.64% | 5.23% | 0.0260 | $857,280 |
| 3 | aave | `aave:47da0cdd-7b1d-4927-9545-20b53b73afa8` | 3.29% | 2.62% | 0.0182 | $17,462,078 |
| 4 | ondo | `ondo:b5d7a190-38d2-4fdd-8c14-1fd00c11bce1` | 3.55% | 1.76% | 0.0120 | $29,444,317 |
| 5 | aave | `aave:32cb38a5-b9b9-441a-bf07-8fab47b999d3` | 1.85% | 1.14% | 0.0054 | $3,836,761 |
| 6 | agni | `agni:6d76a4e2-57f2-4190-a882-bd69f6ea32fb` | 1.96% | 0.50% | 0.0024 | $432,075 |
| 7 | aave | `aave:76b70b33-d8a4-4e61-8092-9bd1f2be2fc9` | 0.09% | -0.60% | -0.0020 | $6,868,042 |
| 8 | agni | `agni:649bee89-0a34-4eb1-b8ab-7c5fdee07ccd` | 0.78% | -0.75% | -0.0036 | $131,791 |
| 9 | aave | `aave:a4e37545-203b-4412-9acd-3e8b1aa4d744` | 0.00% | -0.53% | -0.0037 | $63,886,192 |
| 10 | agni | `agni:a7e2f58e-1c93-4592-acd6-8e40e6cb26ff` | 0.51% | -1.03% | -0.0049 | $107,709 |
| 11 | agni | `agni:3b6b75cf-adb5-4fb4-bbcd-8f75c6879c9d` | 0.45% | -1.09% | -0.0051 | $109,138 |
| 12 | agni | `agni:2a510869-6356-4486-8bb5-d5a808634496` | 0.24% | -1.30% | -0.0062 | $112,241 |
| 13 | agni | `agni:30836422-c578-4f77-8f81-861c509c5d4c` | 0.58% | -0.97% | -0.0066 | $102,818 |
| 14 | agni | `agni:b8d50460-5237-4601-9250-4f2d3a6b569b` | 0.58% | -0.97% | -0.0066 | $103,498 |
| 15 | agni | `agni:ebec73de-fd1e-4f97-8287-d9cb01c7d352` | 0.48% | -1.06% | -0.0072 | $111,174 |
| 16 | agni | `agni:3d429d4e-b3a6-4847-957b-b10bf26a6f01` | 0.00% | -1.54% | -0.0075 | $108,235 |
| 17 | agni | `agni:a4ff3d7c-a117-4b24-a9f9-6af46cd276c0` | 0.18% | -1.37% | -0.0092 | $105,999 |
| 18 | agni | `agni:913ce101-55b1-4230-93c7-d523f0d9ca03` | 0.09% | -1.45% | -0.0098 | $106,662 |
| 19 | agni | `agni:227e8492-33e9-4953-8beb-28973c9fdb8a` | 0.07% | -1.46% | -0.0099 | $116,182 |
| 20 | agni | `agni:2364dd66-69d3-44ef-9e85-4d5217a57b57` | 0.07% | -1.47% | -0.0099 | $108,945 |
| 21 | agni | `agni:b5933580-18c1-43b6-aec3-2563cd30e3a2` | 0.08% | -1.46% | -0.0102 | $101,921 |
| 22 | mantleVault | `mantleVault:c87c5d7c-0285-47a9-8539-d335f05b9ba2` | 0.31% | -2.20% | -0.0153 | $267,869 |
| 23 | mantleVault | `mantleVault:b96d8236-36d4-4be4-92f7-422beeac7073` | 0.00% | -2.55% | -0.0177 | $193,106 |

## All scored opportunities

### aave:a4e37545-203b-4412-9acd-3e8b1aa4d744

- **Source**: aave
- **Asset**: `0x211cc4dd073734da055fbf44a2b4667d5e5fe5d2`
- **APY (base)**: 0.00%    **APY (reward)**: 4.00%    **Total**: 4.00%
- **TVL**: $63,886,192
- **APY history**: vol=0.00%, drift=1.00x
- **Nansen signal**: _null_ (no key or asset not covered)
- **Probabilities**: exploit=0.00097, depeg=0.00063, oracle=0.00200, illiquid=0.02195, counterparty=0.00500
- **Expected loss**: 0.534% /yr
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
- **Probabilities**: exploit=0.00088, depeg=0.00037, oracle=0.00200, illiquid=0.02531, counterparty=0.03000
- **Expected loss**: 1.789% /yr
- **RAAPY**: 1.76%
- **Confidence**: 0.682
- **Score**: 0.0120
- **Eligible tranches**: senior, mezzanine, junior
- **Primary tranche**: senior

### aave:47da0cdd-7b1d-4927-9545-20b53b73afa8

- **Source**: aave
- **Asset**: `0x779ded0c9e1022225f8e0630b35a9b54be713736`
- **APY (base)**: 3.29%    **APY (reward)**: 0.00%    **Total**: 3.29%
- **TVL**: $17,462,078
- **APY history**: vol=2.65%, drift=0.76x
- **Nansen signal**: _null_ (no key or asset not covered)
- **Probabilities**: exploit=0.00110, depeg=0.00500, oracle=0.00200, illiquid=0.02758, counterparty=0.00500
- **Expected loss**: 0.661% /yr
- **RAAPY**: 2.62%
- **Confidence**: 0.692
- **Score**: 0.0182
- **Eligible tranches**: mezzanine, junior
- **Primary tranche**: mezzanine
- **Rejection reasons**:
  - senior: tvlUsd 17462078 < 25000000

### aave:76b70b33-d8a4-4e61-8092-9bd1f2be2fc9

- **Source**: aave
- **Asset**: `0x5d3a1ff2b6bab83b63cd9ad0787074081a52ef34`
- **APY (base)**: 0.09%    **APY (reward)**: 4.00%    **Total**: 4.09%
- **TVL**: $6,868,042
- **APY history**: vol=3.22%, drift=42.87x
- **Nansen signal**: _null_ (no key or asset not covered)
- **Probabilities**: exploit=0.00119, depeg=0.00500, oracle=0.00200, illiquid=0.03163, counterparty=0.00500
- **Expected loss**: 0.689% /yr
- **RAAPY**: -0.60%
- **Confidence**: 0.333
- **Score**: -0.0020
- **Eligible tranches**: junior
- **Primary tranche**: junior
- **Rejection reasons**:
  - senior: tvlUsd 6868042 < 25000000; apyBase 0.09% < 2% (reward-only positions blocked)
  - mezzanine: apyBase 0.09% < 1% (reward-only positions blocked)

### aave:32cb38a5-b9b9-441a-bf07-8fab47b999d3

- **Source**: aave
- **Asset**: `0x09bc4e0d864854c6afb6eb9a9cdf58ac190d0df9`
- **APY (base)**: 1.85%    **APY (reward)**: 0.00%    **Total**: 1.85%
- **TVL**: $3,836,761
- **APY history**: vol=3.36%, drift=0.72x
- **Nansen signal**: _null_ (no key or asset not covered)
- **Probabilities**: exploit=0.00125, depeg=0.00500, oracle=0.00200, illiquid=0.03416, counterparty=0.00500
- **Expected loss**: 0.707% /yr
- **RAAPY**: 1.14%
- **Confidence**: 0.474
- **Score**: 0.0054
- **Eligible tranches**: mezzanine, junior
- **Primary tranche**: mezzanine
- **Rejection reasons**:
  - senior: tvlUsd 3836761 < 25000000; apyBase 1.85% < 2% (reward-only positions blocked)

### agni:35f2103d-231b-443b-952e-d2cd118d8f29

- **Source**: agni
- **Asset**: `0x779ded0c9e1022225f8e0630b35a9b54be713736`
- **APY (base)**: 18.93%    **APY (reward)**: 0.00%    **Total**: 18.93%
- **TVL**: $1,071,059
- **APY history**: vol=62.06%, drift=1.37x
- **Nansen signal**: _null_ (no key or asset not covered)
- **Probabilities**: exploit=0.00669, depeg=0.00500, oracle=0.00700, illiquid=0.03970, counterparty=0.00500
- **Expected loss**: 1.397% /yr
- **RAAPY**: 17.54%
- **Confidence**: 0.488
- **Score**: 0.0855
- **Eligible tranches**: mezzanine, junior
- **Primary tranche**: mezzanine
- **Rejection reasons**:
  - senior: tvlUsd 1071059 < 25000000; apy 18.93% > 8% (too-good-to-be-true gate)

### agni:85407ecd-f711-4fa6-9328-3078aebfaa95

- **Source**: agni
- **Asset**: `0x55b9f84605b30df9bb9d817a6900219f25218157`
- **APY (base)**: 6.64%    **APY (reward)**: 0.00%    **Total**: 6.64%
- **TVL**: $857,280
- **APY history**: no history available
- **Nansen signal**: _null_ (no key or asset not covered)
- **Probabilities**: exploit=0.00680, depeg=0.00500, oracle=0.00700, illiquid=0.04067, counterparty=0.00500
- **Expected loss**: 1.411% /yr
- **RAAPY**: 5.23%
- **Confidence**: 0.498
- **Score**: 0.0260
- **Eligible tranches**: junior
- **Primary tranche**: junior
- **Rejection reasons**:
  - senior: tvlUsd 857280 < 25000000
  - mezzanine: tvlUsd 857280 < 1000000

### agni:6d76a4e2-57f2-4190-a882-bd69f6ea32fb

- **Source**: agni
- **Asset**: `0x45db70e1c808dae42f9c4dfea74ba5e6a113bdc1`
- **APY (base)**: 1.96%    **APY (reward)**: 0.00%    **Total**: 1.96%
- **TVL**: $432,075
- **APY history**: vol=951.27%, drift=0.03x
- **Nansen signal**: _null_ (no key or asset not covered)
- **Probabilities**: exploit=0.00713, depeg=0.00500, oracle=0.00700, illiquid=0.04364, counterparty=0.00500
- **Expected loss**: 1.454% /yr
- **RAAPY**: 0.50%
- **Confidence**: 0.487
- **Score**: 0.0024
- **Eligible tranches**: junior
- **Primary tranche**: junior
- **Rejection reasons**:
  - senior: tvlUsd 432075 < 25000000; apyBase 1.96% < 2% (reward-only positions blocked)
  - mezzanine: tvlUsd 432075 < 1000000

### mantleVault:c87c5d7c-0285-47a9-8539-d335f05b9ba2

- **Source**: mantleVault
- **Asset**: `0xcda86a272531e8640cd7f1a92c01839911b90bb0`
- **APY (base)**: 0.31%    **APY (reward)**: 0.03%    **Total**: 0.34%
- **TVL**: $267,869
- **APY history**: vol=0.06%, drift=1.29x
- **Nansen signal**: _null_ (no key or asset not covered)
- **Probabilities**: exploit=0.01946, depeg=0.00500, oracle=0.00700, illiquid=0.04572, counterparty=0.00500
- **Expected loss**: 2.513% /yr
- **RAAPY**: -2.20%
- **Confidence**: 0.696
- **Score**: -0.0153
- **Eligible tranches**: junior
- **Primary tranche**: junior
- **Rejection reasons**:
  - senior: expectedLoss 0.0251 > 0.02; tvlUsd 267869 < 25000000; apyBase 0.31% < 2% (reward-only positions blocked)
  - mezzanine: tvlUsd 267869 < 1000000; apyBase 0.31% < 1% (reward-only positions blocked)

### mantleVault:b96d8236-36d4-4be4-92f7-422beeac7073

- **Source**: mantleVault
- **Asset**: `0xe6829d9a7ee3040e1276fa75293bde931859e8fa`
- **APY (base)**: 0.00%    **APY (reward)**: 0.05%    **Total**: 0.05%
- **TVL**: $193,106
- **APY history**: vol=0.15%, drift=0.10x
- **Nansen signal**: _null_ (no key or asset not covered)
- **Probabilities**: exploit=0.01988, depeg=0.00500, oracle=0.00700, illiquid=0.04714, counterparty=0.00500
- **Expected loss**: 2.556% /yr
- **RAAPY**: -2.55%
- **Confidence**: 0.694
- **Score**: -0.0177
- **Eligible tranches**: junior
- **Primary tranche**: junior
- **Rejection reasons**:
  - senior: expectedLoss 0.0256 > 0.02; tvlUsd 193106 < 25000000; apyBase 0.00% < 2% (reward-only positions blocked)
  - mezzanine: tvlUsd 193106 < 1000000; apyBase 0.00% < 1% (reward-only positions blocked)

### agni:649bee89-0a34-4eb1-b8ab-7c5fdee07ccd

- **Source**: agni
- **Asset**: `0x29cc30f9d113b356ce408667aa6433589cecbdca`
- **APY (base)**: 0.78%    **APY (reward)**: 0.00%    **Total**: 0.78%
- **TVL**: $131,791
- **APY history**: vol=3.04%, drift=0.57x
- **Nansen signal**: _null_ (no key or asset not covered)
- **Probabilities**: exploit=0.00771, depeg=0.00500, oracle=0.00700, illiquid=0.04880, counterparty=0.00500
- **Expected loss**: 1.529% /yr
- **RAAPY**: -0.75%
- **Confidence**: 0.488
- **Score**: -0.0036
- **Eligible tranches**: junior
- **Primary tranche**: junior
- **Rejection reasons**:
  - senior: tvlUsd 131791 < 25000000; apyBase 0.78% < 2% (reward-only positions blocked)
  - mezzanine: tvlUsd 131791 < 1000000; apyBase 0.78% < 1% (reward-only positions blocked)

### agni:227e8492-33e9-4953-8beb-28973c9fdb8a

- **Source**: agni
- **Asset**: `0x09bc4e0d864854c6afb6eb9a9cdf58ac190d0df9`
- **APY (base)**: 0.07%    **APY (reward)**: 0.00%    **Total**: 0.07%
- **TVL**: $116,182
- **APY history**: vol=0.82%, drift=1.30x
- **Nansen signal**: _null_ (no key or asset not covered)
- **Probabilities**: exploit=0.00777, depeg=0.00500, oracle=0.00700, illiquid=0.04935, counterparty=0.00500
- **Expected loss**: 1.537% /yr
- **RAAPY**: -1.46%
- **Confidence**: 0.676
- **Score**: -0.0099
- **Eligible tranches**: junior
- **Primary tranche**: junior
- **Rejection reasons**:
  - senior: tvlUsd 116182 < 25000000; apyBase 0.07% < 2% (reward-only positions blocked)
  - mezzanine: tvlUsd 116182 < 1000000; apyBase 0.07% < 1% (reward-only positions blocked)

### agni:2a510869-6356-4486-8bb5-d5a808634496

- **Source**: agni
- **Asset**: `0x09bc4e0d864854c6afb6eb9a9cdf58ac190d0df9`
- **APY (base)**: 0.24%    **APY (reward)**: 0.00%    **Total**: 0.24%
- **TVL**: $112,241
- **APY history**: vol=1.07%, drift=1.68x
- **Nansen signal**: _null_ (no key or asset not covered)
- **Probabilities**: exploit=0.00779, depeg=0.00500, oracle=0.00700, illiquid=0.04950, counterparty=0.00500
- **Expected loss**: 1.539% /yr
- **RAAPY**: -1.30%
- **Confidence**: 0.474
- **Score**: -0.0062
- **Eligible tranches**: junior
- **Primary tranche**: junior
- **Rejection reasons**:
  - senior: tvlUsd 112241 < 25000000; apyBase 0.24% < 2% (reward-only positions blocked)
  - mezzanine: tvlUsd 112241 < 1000000; apyBase 0.24% < 1% (reward-only positions blocked)

### agni:ebec73de-fd1e-4f97-8287-d9cb01c7d352

- **Source**: agni
- **Asset**: `0x09bc4e0d864854c6afb6eb9a9cdf58ac190d0df9`
- **APY (base)**: 0.48%    **APY (reward)**: 0.00%    **Total**: 0.48%
- **TVL**: $111,174
- **APY history**: vol=2.42%, drift=0.95x
- **Nansen signal**: _null_ (no key or asset not covered)
- **Probabilities**: exploit=0.00779, depeg=0.00500, oracle=0.00700, illiquid=0.04954, counterparty=0.00500
- **Expected loss**: 1.540% /yr
- **RAAPY**: -1.06%
- **Confidence**: 0.677
- **Score**: -0.0072
- **Eligible tranches**: junior
- **Primary tranche**: junior
- **Rejection reasons**:
  - senior: tvlUsd 111174 < 25000000; apyBase 0.48% < 2% (reward-only positions blocked)
  - mezzanine: tvlUsd 111174 < 1000000; apyBase 0.48% < 1% (reward-only positions blocked)

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
- **Confidence**: 0.474
- **Score**: -0.0051
- **Eligible tranches**: junior
- **Primary tranche**: junior
- **Rejection reasons**:
  - senior: tvlUsd 109138 < 25000000; apyBase 0.45% < 2% (reward-only positions blocked)
  - mezzanine: tvlUsd 109138 < 1000000; apyBase 0.45% < 1% (reward-only positions blocked)

### agni:2364dd66-69d3-44ef-9e85-4d5217a57b57

- **Source**: agni
- **Asset**: `0x09bc4e0d864854c6afb6eb9a9cdf58ac190d0df9`
- **APY (base)**: 0.07%    **APY (reward)**: 0.00%    **Total**: 0.07%
- **TVL**: $108,945
- **APY history**: vol=0.21%, drift=1.19x
- **Nansen signal**: _null_ (no key or asset not covered)
- **Probabilities**: exploit=0.00780, depeg=0.00500, oracle=0.00700, illiquid=0.04963, counterparty=0.00500
- **Expected loss**: 1.541% /yr
- **RAAPY**: -1.47%
- **Confidence**: 0.677
- **Score**: -0.0099
- **Eligible tranches**: junior
- **Primary tranche**: junior
- **Rejection reasons**:
  - senior: tvlUsd 108945 < 25000000; apyBase 0.07% < 2% (reward-only positions blocked)
  - mezzanine: tvlUsd 108945 < 1000000; apyBase 0.07% < 1% (reward-only positions blocked)

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
- **Confidence**: 0.488
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
- **Confidence**: 0.474
- **Score**: -0.0049
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
- **Confidence**: 0.677
- **Score**: -0.0098
- **Eligible tranches**: junior
- **Primary tranche**: junior
- **Rejection reasons**:
  - senior: tvlUsd 106662 < 25000000; apyBase 0.09% < 2% (reward-only positions blocked)
  - mezzanine: tvlUsd 106662 < 1000000; apyBase 0.09% < 1% (reward-only positions blocked)

### agni:a4ff3d7c-a117-4b24-a9f9-6af46cd276c0

- **Source**: agni
- **Asset**: `0x09bc4e0d864854c6afb6eb9a9cdf58ac190d0df9`
- **APY (base)**: 0.18%    **APY (reward)**: 0.00%    **Total**: 0.18%
- **TVL**: $105,999
- **APY history**: vol=1.18%, drift=1.05x
- **Nansen signal**: _null_ (no key or asset not covered)
- **Probabilities**: exploit=0.00781, depeg=0.00500, oracle=0.00700, illiquid=0.04975, counterparty=0.00500
- **Expected loss**: 1.543% /yr
- **RAAPY**: -1.37%
- **Confidence**: 0.677
- **Score**: -0.0092
- **Eligible tranches**: junior
- **Primary tranche**: junior
- **Rejection reasons**:
  - senior: tvlUsd 105999 < 25000000; apyBase 0.18% < 2% (reward-only positions blocked)
  - mezzanine: tvlUsd 105999 < 1000000; apyBase 0.18% < 1% (reward-only positions blocked)

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
- **Confidence**: 0.677
- **Score**: -0.0066
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
- **Confidence**: 0.676
- **Score**: -0.0066
- **Eligible tranches**: junior
- **Primary tranche**: junior
- **Rejection reasons**:
  - senior: tvlUsd 102818 < 25000000; apyBase 0.58% < 2% (reward-only positions blocked)
  - mezzanine: tvlUsd 102818 < 1000000; apyBase 0.58% < 1% (reward-only positions blocked)

### agni:b5933580-18c1-43b6-aec3-2563cd30e3a2

- **Source**: agni
- **Asset**: `0x779ded0c9e1022225f8e0630b35a9b54be713736`
- **APY (base)**: 0.08%    **APY (reward)**: 0.00%    **Total**: 0.08%
- **TVL**: $101,921
- **APY history**: vol=0.48%, drift=0.50x
- **Nansen signal**: _null_ (no key or asset not covered)
- **Probabilities**: exploit=0.00783, depeg=0.00500, oracle=0.00700, illiquid=0.04992, counterparty=0.00500
- **Expected loss**: 1.545% /yr
- **RAAPY**: -1.46%
- **Confidence**: 0.697
- **Score**: -0.0102
- **Eligible tranches**: junior
- **Primary tranche**: junior
- **Rejection reasons**:
  - senior: tvlUsd 101921 < 25000000; apyBase 0.08% < 2% (reward-only positions blocked)
  - mezzanine: tvlUsd 101921 < 1000000; apyBase 0.08% < 1% (reward-only positions blocked)

### mantleVault:3f5789dd-68ed-44c7-9388-b553df96502d

- **Source**: mantleVault
- **Asset**: `0x78c1b0c915c4faa5fffa6cabf0219da63d7f4cb8`
- **APY (base)**: 0.07%    **APY (reward)**: 0.36%    **Total**: 0.43%
- **TVL**: $72,070
- **APY history**: vol=0.87%, drift=0.10x
- **Nansen signal**: _null_ (no key or asset not covered)
- **Probabilities**: exploit=0.02115, depeg=0.00500, oracle=0.00700, illiquid=0.05142, counterparty=0.00500
- **Expected loss**: 2.685% /yr
- **RAAPY**: -2.62%
- **Confidence**: 0.694
- **Score**: -0.0182
- **Eligible tranches**: _none_
- **Primary tranche**: _none_
- **Rejection reasons**:
  - senior: expectedLoss 0.0269 > 0.02; tvlUsd 72070 < 25000000; apyBase 0.07% < 2% (reward-only positions blocked)
  - mezzanine: tvlUsd 72070 < 1000000; apyBase 0.07% < 1% (reward-only positions blocked)
  - junior: tvlUsd 72070 < 100000

### cian:009b6f09-bfa7-4852-8685-0980d9478419

- **Source**: cian
- **Asset**: `0xcda86a272531e8640cd7f1a92c01839911b90bb0`
- **APY (base)**: 2.90%    **APY (reward)**: 0.00%    **Total**: 2.90%
- **TVL**: $51,664
- **APY history**: vol=0.31%, drift=0.88x
- **Nansen signal**: _null_ (no key or asset not covered)
- **Probabilities**: exploit=0.03097, depeg=0.00500, oracle=0.02000, illiquid=0.05287, counterparty=0.00500
- **Expected loss**: 4.047% /yr
- **RAAPY**: -1.15%
- **Confidence**: 0.694
- **Score**: -0.0079
- **Eligible tranches**: _none_
- **Primary tranche**: _none_
- **Rejection reasons**:
  - senior: expectedLoss 0.0405 > 0.02; tvlUsd 51664 < 25000000
  - mezzanine: expectedLoss 0.0405 > 0.04; tvlUsd 51664 < 1000000
  - junior: tvlUsd 51664 < 100000

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
- **Confidence**: 0.487
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
- **TVL**: $33,924
- **APY history**: vol=0.00%, drift=1.05x
- **Nansen signal**: _null_ (no key or asset not covered)
- **Probabilities**: exploit=0.02212, depeg=0.00500, oracle=0.00700, illiquid=0.05469, counterparty=0.00500
- **Expected loss**: 2.784% /yr
- **RAAPY**: -2.78%
- **Confidence**: 0.695
- **Score**: -0.0193
- **Eligible tranches**: _none_
- **Primary tranche**: _none_
- **Rejection reasons**:
  - senior: expectedLoss 0.0278 > 0.02; tvlUsd 33924 < 25000000; apyBase 0.00% < 2% (reward-only positions blocked)
  - mezzanine: tvlUsd 33924 < 1000000; apyBase 0.00% < 1% (reward-only positions blocked)
  - junior: tvlUsd 33924 < 100000

### mantleVault:dc732e3d-d65b-4087-8d48-53e50bb47732

- **Source**: mantleVault
- **Asset**: `0xc96de26018a54d51c097160568752c4e3bd6c364`
- **APY (base)**: 0.38%    **APY (reward)**: 1.25%    **Total**: 1.63%
- **TVL**: $28,254
- **APY history**: vol=0.07%, drift=1.29x
- **Nansen signal**: _null_ (no key or asset not covered)
- **Probabilities**: exploit=0.02236, depeg=0.00500, oracle=0.00700, illiquid=0.05549, counterparty=0.00500
- **Expected loss**: 2.808% /yr
- **RAAPY**: -2.43%
- **Confidence**: 0.693
- **Score**: -0.0168
- **Eligible tranches**: _none_
- **Primary tranche**: _none_
- **Rejection reasons**:
  - senior: expectedLoss 0.0281 > 0.02; tvlUsd 28254 < 25000000; apyBase 0.38% < 2% (reward-only positions blocked)
  - mezzanine: tvlUsd 28254 < 1000000; apyBase 0.38% < 1% (reward-only positions blocked)
  - junior: tvlUsd 28254 < 100000

### mantleVault:d6c5fcec-1f1f-40e8-b732-076ece1462fc

- **Source**: mantleVault
- **Asset**: `0x78c1b0c915c4faa5fffa6cabf0219da63d7f4cb8`
- **APY (base)**: 0.00%    **APY (reward)**: 0.00%    **Total**: 0.00%
- **TVL**: $21,736
- **APY history**: vol=0.00%, drift=1.05x
- **Nansen signal**: _null_ (no key or asset not covered)
- **Probabilities**: exploit=0.02269, depeg=0.00500, oracle=0.00700, illiquid=0.05663, counterparty=0.00500
- **Expected loss**: 2.842% /yr
- **RAAPY**: -2.84%
- **Confidence**: 0.695
- **Score**: -0.0198
- **Eligible tranches**: _none_
- **Primary tranche**: _none_
- **Rejection reasons**:
  - senior: expectedLoss 0.0284 > 0.02; tvlUsd 21736 < 25000000; apyBase 0.00% < 2% (reward-only positions blocked)
  - mezzanine: tvlUsd 21736 < 1000000; apyBase 0.00% < 1% (reward-only positions blocked)
  - junior: tvlUsd 21736 < 100000

### cian:6eec4d69-bcad-48b9-aa3a-31005778de19

- **Source**: cian
- **Asset**: `0xcda86a272531e8640cd7f1a92c01839911b90bb0`
- **APY (base)**: 0.44%    **APY (reward)**: 0.00%    **Total**: 0.44%
- **TVL**: $17,552
- **APY history**: vol=4.63%, drift=0.16x
- **Nansen signal**: _null_ (no key or asset not covered)
- **Probabilities**: exploit=0.03296, depeg=0.00500, oracle=0.02000, illiquid=0.05756, counterparty=0.00500
- **Expected loss**: 4.239% /yr
- **RAAPY**: -3.79%
- **Confidence**: 0.485
- **Score**: -0.0184
- **Eligible tranches**: _none_
- **Primary tranche**: _none_
- **Rejection reasons**:
  - senior: expectedLoss 0.0424 > 0.02; tvlUsd 17552 < 25000000; apyBase 0.44% < 2% (reward-only positions blocked)
  - mezzanine: expectedLoss 0.0424 > 0.04; tvlUsd 17552 < 1000000; apyBase 0.44% < 1% (reward-only positions blocked)
  - junior: tvlUsd 17552 < 100000

### mantleVault:e118b8cb-a7f6-4619-8844-791956db623b

- **Source**: mantleVault
- **Asset**: `0xcda86a272531e8640cd7f1a92c01839911b90bb0`
- **APY (base)**: 0.00%    **APY (reward)**: 0.00%    **Total**: 0.00%
- **TVL**: $14,678
- **APY history**: vol=0.00%, drift=1.00x
- **Nansen signal**: _null_ (no key or asset not covered)
- **Probabilities**: exploit=0.02320, depeg=0.00500, oracle=0.00700, illiquid=0.05833, counterparty=0.00500
- **Expected loss**: 2.894% /yr
- **RAAPY**: -2.89%
- **Confidence**: 0.693
- **Score**: -0.0201
- **Eligible tranches**: _none_
- **Primary tranche**: _none_
- **Rejection reasons**:
  - senior: expectedLoss 0.0289 > 0.02; tvlUsd 14678 < 25000000; apyBase 0.00% < 2% (reward-only positions blocked)
  - mezzanine: tvlUsd 14678 < 1000000; apyBase 0.00% < 1% (reward-only positions blocked)
  - junior: tvlUsd 14678 < 100000

### fbtc:d8733ab8-a147-4e31-a668-2c9dff24ea56

- **Source**: fbtc
- **Asset**: `0x201eba5cc46d216ce6dc03f6a759e8e766e956ae`
- **APY (base)**: 10.79%    **APY (reward)**: 1.96%    **Total**: 12.75%
- **TVL**: $14,671
- **APY history**: vol=3.32%, drift=1.20x
- **Nansen signal**: _null_ (no key or asset not covered)
- **Probabilities**: exploit=0.02320, depeg=0.00500, oracle=0.02000, illiquid=0.05834, counterparty=0.08000
- **Expected loss**: 7.164% /yr
- **RAAPY**: 3.63%
- **Confidence**: 0.473
- **Score**: 0.0172
- **Eligible tranches**: _none_
- **Primary tranche**: _none_
- **Rejection reasons**:
  - senior: expectedLoss 0.0716 > 0.02; tvlUsd 14671 < 25000000; apy 10.79% > 8% (too-good-to-be-true gate)
  - mezzanine: expectedLoss 0.0716 > 0.04; tvlUsd 14671 < 1000000
  - junior: tvlUsd 14671 < 100000

### aave:4a0e9f84-09a0-491a-aa5e-269813d31a59

- **Source**: aave
- **Asset**: `0xdeaddeaddeaddeaddeaddeaddeaddeaddead1111`
- **APY (base)**: 8.92%    **APY (reward)**: 0.00%    **Total**: 8.92%
- **TVL**: $11,983
- **APY history**: vol=2.18%, drift=2.25x
- **Nansen signal**: _null_ (no key or asset not covered)
- **Probabilities**: exploit=0.00182, depeg=0.00500, oracle=0.00200, illiquid=0.05921, counterparty=0.00500
- **Expected loss**: 0.881% /yr
- **RAAPY**: 8.03%
- **Confidence**: 0.487
- **Score**: 0.0391
- **Eligible tranches**: _none_
- **Primary tranche**: _none_
- **Rejection reasons**:
  - senior: tvlUsd 11983 < 25000000; apy 8.92% > 8% (too-good-to-be-true gate)
  - mezzanine: tvlUsd 11983 < 1000000
  - junior: tvlUsd 11983 < 100000

### mantleVault:edc32e93-0feb-4d38-bb73-366bb4a2aace

- **Source**: mantleVault
- **Asset**: `0xdeaddeaddeaddeaddeaddeaddeaddeaddead1111`
- **APY (base)**: 0.00%    **APY (reward)**: 0.00%    **Total**: 0.00%
- **TVL**: $10,416
- **APY history**: vol=0.00%, drift=0.96x
- **Nansen signal**: _null_ (no key or asset not covered)
- **Probabilities**: exploit=0.02364, depeg=0.00500, oracle=0.00700, illiquid=0.05982, counterparty=0.00500
- **Expected loss**: 2.939% /yr
- **RAAPY**: -2.93%
- **Confidence**: 0.695
- **Score**: -0.0204
- **Eligible tranches**: _none_
- **Primary tranche**: _none_
- **Rejection reasons**:
  - senior: expectedLoss 0.0294 > 0.02; tvlUsd 10416 < 25000000; apyBase 0.00% < 2% (reward-only positions blocked)
  - mezzanine: tvlUsd 10416 < 1000000; apyBase 0.00% < 1% (reward-only positions blocked)
  - junior: tvlUsd 10416 < 100000

### mantleVault:ae619265-65fd-4584-8934-16a66dc50af3

- **Source**: mantleVault
- **Asset**: `0x09bc4e0d864854c6afb6eb9a9cdf58ac190d0df9`
- **APY (base)**: 0.02%    **APY (reward)**: 0.00%    **Total**: 0.02%
- **TVL**: $10,347
- **APY history**: vol=0.00%, drift=1.01x
- **Nansen signal**: _null_ (no key or asset not covered)
- **Probabilities**: exploit=0.02365, depeg=0.00500, oracle=0.00700, illiquid=0.05985, counterparty=0.00500
- **Expected loss**: 2.939% /yr
- **RAAPY**: -2.92%
- **Confidence**: 0.676
- **Score**: -0.0197
- **Eligible tranches**: _none_
- **Primary tranche**: _none_
- **Rejection reasons**:
  - senior: expectedLoss 0.0294 > 0.02; tvlUsd 10347 < 25000000; apyBase 0.02% < 2% (reward-only positions blocked)
  - mezzanine: tvlUsd 10347 < 1000000; apyBase 0.02% < 1% (reward-only positions blocked)
  - junior: tvlUsd 10347 < 100000

### mantleVault:3441a15d-5f50-4a52-af27-597c182c5c4a

- **Source**: mantleVault
- **Asset**: `0x201eba5cc46d216ce6dc03f6a759e8e766e956ae`
- **APY (base)**: 0.04%    **APY (reward)**: 0.00%    **Total**: 0.04%
- **TVL**: $6,354
- **APY history**: vol=0.00%, drift=1.06x
- **Nansen signal**: _null_ (no key or asset not covered)
- **Probabilities**: exploit=0.02428, depeg=0.00500, oracle=0.00700, illiquid=0.06197, counterparty=0.00500
- **Expected loss**: 3.003% /yr
- **RAAPY**: -2.96%
- **Confidence**: 0.676
- **Score**: -0.0200
- **Eligible tranches**: _none_
- **Primary tranche**: _none_
- **Rejection reasons**:
  - senior: expectedLoss 0.0300 > 0.02; tvlUsd 6354 < 25000000; apyBase 0.04% < 2% (reward-only positions blocked)
  - mezzanine: tvlUsd 6354 < 1000000; apyBase 0.04% < 1% (reward-only positions blocked)
  - junior: tvlUsd 6354 < 100000

### mantleVault:7be673f4-8b41-4d3f-a533-45d20d62e8fa

- **Source**: mantleVault
- **Asset**: `0xcabae6f6ea1ecab08ad02fe02ce9a44f09aebfa2`
- **APY (base)**: 0.71%    **APY (reward)**: 0.02%    **Total**: 0.74%
- **TVL**: $5,881
- **APY history**: vol=0.22%, drift=2.67x
- **Nansen signal**: _null_ (no key or asset not covered)
- **Probabilities**: exploit=0.02438, depeg=0.00500, oracle=0.00700, illiquid=0.06231, counterparty=0.00500
- **Expected loss**: 3.013% /yr
- **RAAPY**: -2.30%
- **Confidence**: 0.485
- **Score**: -0.0111
- **Eligible tranches**: _none_
- **Primary tranche**: _none_
- **Rejection reasons**:
  - senior: expectedLoss 0.0301 > 0.02; tvlUsd 5881 < 25000000; apyBase 0.71% < 2% (reward-only positions blocked)
  - mezzanine: tvlUsd 5881 < 1000000; apyBase 0.71% < 1% (reward-only positions blocked)
  - junior: tvlUsd 5881 < 100000

### mantleVault:f7150467-f302-41e8-9f9a-1f73d2b49df4

- **Source**: mantleVault
- **Asset**: `0x5d3a1ff2b6bab83b63cd9ad0787074081a52ef34`
- **APY (base)**: 49.19%    **APY (reward)**: 0.54%    **Total**: 49.73%
- **TVL**: $3,148
- **APY history**: vol=19.39%, drift=119.43x
- **Nansen signal**: _null_ (no key or asset not covered)
- **Probabilities**: exploit=0.02518, depeg=0.00500, oracle=0.00700, illiquid=0.06502, counterparty=0.00500
- **Expected loss**: 3.095% /yr
- **RAAPY**: 46.10%
- **Confidence**: 0.333
- **Score**: 0.1533
- **Eligible tranches**: _none_
- **Primary tranche**: _none_
- **Rejection reasons**:
  - senior: expectedLoss 0.0310 > 0.02; tvlUsd 3148 < 25000000; apy 49.19% > 8% (too-good-to-be-true gate)
  - mezzanine: tvlUsd 3148 < 1000000; apy 49.19% > 20% (too-good-to-be-true gate)
  - junior: tvlUsd 3148 < 100000

### mantleVault:4f9047f1-ca9f-4b30-b5ad-c7a900c38cae

- **Source**: mantleVault
- **Asset**: `0xdeaddeaddeaddeaddeaddeaddeaddeaddead1111`
- **APY (base)**: 43.35%    **APY (reward)**: 1.50%    **Total**: 44.85%
- **TVL**: $2,922
- **APY history**: vol=30.24%, drift=3.69x
- **Nansen signal**: _null_ (no key or asset not covered)
- **Probabilities**: exploit=0.02528, depeg=0.00500, oracle=0.00700, illiquid=0.06534, counterparty=0.00500
- **Expected loss**: 3.105% /yr
- **RAAPY**: 40.25%
- **Confidence**: 0.341
- **Score**: 0.1372
- **Eligible tranches**: _none_
- **Primary tranche**: _none_
- **Rejection reasons**:
  - senior: expectedLoss 0.0311 > 0.02; tvlUsd 2922 < 25000000; apy 43.35% > 8% (too-good-to-be-true gate)
  - mezzanine: tvlUsd 2922 < 1000000; apy 43.35% > 20% (too-good-to-be-true gate)
  - junior: tvlUsd 2922 < 100000

### mantleVault:a5a47cdc-2ca5-4348-ade9-4adddb1d12d5

- **Source**: mantleVault
- **Asset**: `0xe6829d9a7ee3040e1276fa75293bde931859e8fa`
- **APY (base)**: 0.02%    **APY (reward)**: 0.00%    **Total**: 0.02%
- **TVL**: $2,304
- **APY history**: vol=0.00%, drift=1.04x
- **Nansen signal**: _null_ (no key or asset not covered)
- **Probabilities**: exploit=0.02558, depeg=0.00500, oracle=0.00700, illiquid=0.06638, counterparty=0.00500
- **Expected loss**: 3.136% /yr
- **RAAPY**: -3.12%
- **Confidence**: 0.694
- **Score**: -0.0216
- **Eligible tranches**: _none_
- **Primary tranche**: _none_
- **Rejection reasons**:
  - senior: expectedLoss 0.0314 > 0.02; tvlUsd 2304 < 25000000; apyBase 0.02% < 2% (reward-only positions blocked)
  - mezzanine: tvlUsd 2304 < 1000000; apyBase 0.02% < 1% (reward-only positions blocked)
  - junior: tvlUsd 2304 < 100000

### mantleVault:dce58852-9976-4141-b26a-a832c5edc34e

- **Source**: mantleVault
- **Asset**: `0x201eba5cc46d216ce6dc03f6a759e8e766e956ae`
- **APY (base)**: 50.87%    **APY (reward)**: 1.47%    **Total**: 52.35%
- **TVL**: $2,133
- **APY history**: vol=22.48%, drift=3.55x
- **Nansen signal**: _null_ (no key or asset not covered)
- **Probabilities**: exploit=0.02568, depeg=0.00500, oracle=0.00700, illiquid=0.06671, counterparty=0.00500
- **Expected loss**: 3.146% /yr
- **RAAPY**: 47.73%
- **Confidence**: 0.331
- **Score**: 0.1580
- **Eligible tranches**: _none_
- **Primary tranche**: _none_
- **Rejection reasons**:
  - senior: expectedLoss 0.0315 > 0.02; tvlUsd 2133 < 25000000; apy 50.87% > 8% (too-good-to-be-true gate)
  - mezzanine: tvlUsd 2133 < 1000000; apy 50.87% > 20% (too-good-to-be-true gate)
  - junior: tvlUsd 2133 < 100000

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
- **APY (base)**: 395.49%    **APY (reward)**: 35.74%    **Total**: 431.24%
- **TVL**: $857
- **APY history**: vol=109.81%, drift=5.84x
- **Nansen signal**: _null_ (no key or asset not covered)
- **Probabilities**: exploit=0.02685, depeg=0.00500, oracle=0.00700, illiquid=0.07067, counterparty=0.00500
- **Expected loss**: 3.266% /yr
- **RAAPY**: 392.23%
- **Confidence**: 0.341
- **Score**: 1.3371
- **Eligible tranches**: _none_
- **Primary tranche**: _none_
- **Rejection reasons**:
  - senior: expectedLoss 0.0327 > 0.02; tvlUsd 857 < 25000000; apy 395.49% > 8% (too-good-to-be-true gate)
  - mezzanine: tvlUsd 857 < 1000000; apy 395.49% > 20% (too-good-to-be-true gate)
  - junior: tvlUsd 857 < 100000

### mantleVault:46cbb5d7-5462-443b-886a-f371349a5d8c

- **Source**: mantleVault
- **Asset**: `0x5be26527e817998a7206475496fde1e68957c5a6`
- **APY (base)**: 1.17%    **APY (reward)**: 0.00%    **Total**: 1.17%
- **TVL**: $822
- **APY history**: vol=0.49%, drift=9.96x
- **Nansen signal**: _null_ (no key or asset not covered)
- **Probabilities**: exploit=0.02691, depeg=0.00037, oracle=0.00700, illiquid=0.07085, counterparty=0.00500
- **Expected loss**: 3.179% /yr
- **RAAPY**: -2.01%
- **Confidence**: 0.477
- **Score**: -0.0096
- **Eligible tranches**: _none_
- **Primary tranche**: _none_
- **Rejection reasons**:
  - senior: expectedLoss 0.0318 > 0.02; tvlUsd 822 < 25000000; apyBase 1.17% < 2% (reward-only positions blocked)
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
- **Confidence**: 0.473
- **Score**: -0.0368
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
- **Confidence**: 0.685
- **Score**: -0.0249
- **Eligible tranches**: _none_
- **Primary tranche**: _none_
- **Rejection reasons**:
  - senior: expectedLoss 0.0364 > 0.02; tvlUsd 26 < 25000000; apyBase 0.00% < 2% (reward-only positions blocked)
  - mezzanine: tvlUsd 26 < 1000000; apyBase 0.00% < 1% (reward-only positions blocked)
  - junior: tvlUsd 26 < 100000

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
- **Confidence**: 0.488
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
- **Confidence**: 0.332
- **Score**: 0.2197
- **Eligible tranches**: _none_
- **Primary tranche**: _none_
- **Rejection reasons**:
  - senior: expectedLoss 0.0415 > 0.02; tvlUsd 0 < 25000000; apy 70.40% > 8% (too-good-to-be-true gate)
  - mezzanine: expectedLoss 0.0415 > 0.04; tvlUsd 0 < 1000000; apy 70.40% > 20% (too-good-to-be-true gate)
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
- **Confidence**: 0.483
- **Score**: 0.0076
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
- **Confidence**: 0.483
- **Score**: 0.0064
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
- **Confidence**: 0.483
- **Score**: 0.0438
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
- **Confidence**: 0.483
- **Score**: 0.0076
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
- **Confidence**: 0.483
- **Score**: 0.0221
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
- **Confidence**: 0.483
- **Score**: 0.0318
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
- **Confidence**: 0.483
- **Score**: 0.0076
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
- **Confidence**: 0.675
- **Score**: 0.0309
- **Eligible tranches**: _none_
- **Primary tranche**: _none_
- **Rejection reasons**:
  - senior: expectedLoss 0.0842 > 0.02; tvlUsd 0 < 25000000; apy 13.00% > 8% (too-good-to-be-true gate)
  - mezzanine: expectedLoss 0.0842 > 0.04; tvlUsd 0 < 1000000
  - junior: tvlUsd 0 < 100000

## Signed canonical Yield Map

```json
{
  "version": "1.0",
  "publishedAtMs": 1779267885862,
  "publisher": {
    "address": "0xE5D42a62D677C86cE9f9406BB31dd31f2E153201",
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
      "tvlUsd": 63886192,
      "lastUpdatedMs": 1779267875033,
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
        "tvlUsd": 63886192,
        "pool": "a4e37545-203b-4412-9acd-3e8b1aa4d744"
      },
      "risk": {
        "contractAgeDays": 700,
        "auditFactor": 0.3,
        "tvlFactor": null,
        "depegEvents": [
          {
            "startMs": 1747818005000,
            "endMs": null,
            "maxDeviation": 0.23124706421212782,
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
        "exploit": 0.0009658715295015179,
        "depeg": 0.0006335536005811721,
        "oracle": 0.002,
        "illiquid": 0.02194592997650832,
        "counterparty": 0.005
      },
      "severities": {
        "exploit": 0.85,
        "depeg": 0.2,
        "oracle": 0.4,
        "illiquid": 0.05,
        "counterparty": 0.5
      },
      "expectedLoss": 0.005344998019017941,
      "raapy": -0.005344998019017941,
      "confidence": 0.6855423899167287,
      "score": -0.0036642227160577395,
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
      "lastUpdatedMs": 1779267875033,
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
            "startMs": 1747817940000,
            "endMs": null,
            "maxDeviation": 0.1339720625363896,
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
        "depeg": 0.00036704674667504,
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
      "expectedLoss": 0.017889597463660006,
      "raapy": 0.01761040253633999,
      "confidence": 0.681655002473612,
      "score": 0.01200421898447014,
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
      "apy": 0.0328559,
      "apyReward": 0,
      "apyType": "variable",
      "tvlUsd": 17462078,
      "lastUpdatedMs": 1779267875033,
      "raw": {
        "chain": "Mantle",
        "project": "aave-v3",
        "symbol": "USDT0",
        "underlyingTokens": [
          "0x779Ded0c9e1022225f8E0630b35a9b54bE713736"
        ],
        "apy": 3.28559,
        "apyBase": 3.28559,
        "apyReward": null,
        "tvlUsd": 17462078,
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
        "apyVolatility": 0.026455786108970713,
        "apyDrift": 0.7592128948400118
      },
      "probabilities": {
        "exploit": 0.001095582834823344,
        "depeg": 0.005,
        "oracle": 0.002,
        "illiquid": 0.027579040761954943,
        "counterparty": 0.005
      },
      "severities": {
        "exploit": 0.85,
        "depeg": 0.2,
        "oracle": 0.4,
        "illiquid": 0.05,
        "counterparty": 0.5
      },
      "expectedLoss": 0.006610197447697591,
      "raapy": 0.026245702552302408,
      "confidence": 0.6924645197355875,
      "score": 0.01817421781300317,
      "eligibleTranches": [
        "mezzanine",
        "junior"
      ],
      "primaryTranche": "mezzanine",
      "rejectionReasons": [
        {
          "tranche": "senior",
          "reasons": [
            "tvlUsd 17462078 < 25000000"
          ]
        }
      ]
    },
    {
      "id": "aave:76b70b33-d8a4-4e61-8092-9bd1f2be2fc9",
      "source": "aave",
      "asset": "0x5d3a1ff2b6bab83b63cd9ad0787074081a52ef34",
      "apy": 0.0008878,
      "apyReward": 0.04,
      "apyType": "variable",
      "tvlUsd": 6868042,
      "lastUpdatedMs": 1779267875033,
      "raw": {
        "chain": "Mantle",
        "project": "aave-v3",
        "symbol": "USDE",
        "underlyingTokens": [
          "0x5d3a1Ff2b6BAb83b63cd9AD0787074081a52ef34"
        ],
        "apy": 4.08878,
        "apyBase": 0.08878,
        "apyReward": 4,
        "tvlUsd": 6868042,
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
        "apyVolatility": 0.03215329916294798,
        "apyDrift": 42.87384001664803
      },
      "probabilities": {
        "exploit": 0.0011889010604502308,
        "depeg": 0.005,
        "oracle": 0.002,
        "illiquid": 0.03163167057670635,
        "counterparty": 0.005
      },
      "severities": {
        "exploit": 0.85,
        "depeg": 0.2,
        "oracle": 0.4,
        "illiquid": 0.05,
        "counterparty": 0.5
      },
      "expectedLoss": 0.006892149430218014,
      "raapy": -0.006004349430218014,
      "confidence": 0.33264874512837966,
      "score": -0.001997339303274324,
      "eligibleTranches": [
        "junior"
      ],
      "primaryTranche": "junior",
      "rejectionReasons": [
        {
          "tranche": "senior",
          "reasons": [
            "tvlUsd 6868042 < 25000000",
            "apyBase 0.09% < 2% (reward-only positions blocked)"
          ]
        },
        {
          "tranche": "mezzanine",
          "reasons": [
            "apyBase 0.09% < 1% (reward-only positions blocked)"
          ]
        }
      ]
    },
    {
      "id": "aave:32cb38a5-b9b9-441a-bf07-8fab47b999d3",
      "source": "aave",
      "asset": "0x09bc4e0d864854c6afb6eb9a9cdf58ac190d0df9",
      "apy": 0.0184695,
      "apyReward": 0,
      "apyType": "variable",
      "tvlUsd": 3836761,
      "lastUpdatedMs": 1779267875033,
      "raw": {
        "chain": "Mantle",
        "project": "aave-v3",
        "symbol": "USDC",
        "underlyingTokens": [
          "0x09Bc4E0D864854c6aFB6eB9A9cdF58aC190D0dF9"
        ],
        "apy": 1.84695,
        "apyBase": 1.84695,
        "apyReward": null,
        "tvlUsd": 3836761,
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
        "apyVolatility": 0.033592755476992295,
        "apyDrift": 0.7196991519602706
      },
      "probabilities": {
        "exploit": 0.0012471279708571928,
        "depeg": 0.005,
        "oracle": 0.002,
        "illiquid": 0.03416035253085749,
        "counterparty": 0.005
      },
      "severities": {
        "exploit": 0.85,
        "depeg": 0.2,
        "oracle": 0.4,
        "illiquid": 0.05,
        "counterparty": 0.5
      },
      "expectedLoss": 0.007068076401771489,
      "raapy": 0.011401423598228511,
      "confidence": 0.47379057118005785,
      "score": 0.005401886998870477,
      "eligibleTranches": [
        "mezzanine",
        "junior"
      ],
      "primaryTranche": "mezzanine",
      "rejectionReasons": [
        {
          "tranche": "senior",
          "reasons": [
            "tvlUsd 3836761 < 25000000",
            "apyBase 1.85% < 2% (reward-only positions blocked)"
          ]
        }
      ]
    },
    {
      "id": "agni:35f2103d-231b-443b-952e-d2cd118d8f29",
      "source": "agni",
      "asset": "0x779ded0c9e1022225f8e0630b35a9b54be713736",
      "apy": 0.189327,
      "apyReward": 0,
      "apyType": "variable",
      "tvlUsd": 1071059,
      "lastUpdatedMs": 1779267875033,
      "raw": {
        "chain": "Mantle",
        "project": "fluxion-network",
        "symbol": "USDT0-BSB",
        "underlyingTokens": [
          "0x779ded0c9e1022225f8e0630b35a9b54be713736",
          "0xe5c330addf7aa9c7838da836436142c56a15aa95"
        ],
        "apy": 18.9327,
        "apyBase": 18.9327,
        "apyReward": null,
        "tvlUsd": 1071059,
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
        "apyVolatility": 0.6205768115379658,
        "apyDrift": 1.3662912401347256
      },
      "probabilities": {
        "exploit": 0.006687856995241618,
        "depeg": 0.005,
        "oracle": 0.007,
        "illiquid": 0.03970186605107753,
        "counterparty": 0.005
      },
      "severities": {
        "exploit": 0.85,
        "depeg": 0.2,
        "oracle": 0.4,
        "illiquid": 0.05,
        "counterparty": 0.5
      },
      "expectedLoss": 0.013969771748509253,
      "raapy": 0.17535722825149075,
      "confidence": 0.4875463637796288,
      "score": 0.0854947789964887,
      "eligibleTranches": [
        "mezzanine",
        "junior"
      ],
      "primaryTranche": "mezzanine",
      "rejectionReasons": [
        {
          "tranche": "senior",
          "reasons": [
            "tvlUsd 1071059 < 25000000",
            "apy 18.93% > 8% (too-good-to-be-true gate)"
          ]
        }
      ]
    },
    {
      "id": "agni:85407ecd-f711-4fa6-9328-3078aebfaa95",
      "source": "agni",
      "asset": "0x55b9f84605b30df9bb9d817a6900219f25218157",
      "apy": 0.06637069999999999,
      "apyReward": 0,
      "apyType": "variable",
      "tvlUsd": 857280,
      "lastUpdatedMs": 1779267875033,
      "raw": {
        "chain": "Mantle",
        "project": "fluxion-network",
        "symbol": "BILL-USDT0",
        "underlyingTokens": [
          "0x55b9f84605b30df9bb9d817a6900219f25218157",
          "0x779ded0c9e1022225f8e0630b35a9b54be713736"
        ],
        "apy": 6.63707,
        "apyBase": 6.63707,
        "apyReward": null,
        "tvlUsd": 857280,
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
        "exploit": 0.006796170794619389,
        "depeg": 0.005,
        "oracle": 0.007,
        "illiquid": 0.040668773080718854,
        "counterparty": 0.005
      },
      "severities": {
        "exploit": 0.85,
        "depeg": 0.2,
        "oracle": 0.4,
        "illiquid": 0.05,
        "counterparty": 0.5
      },
      "expectedLoss": 0.014110183829462422,
      "raapy": 0.05226051617053757,
      "confidence": 0.4981102468573559,
      "score": 0.026031498610599307,
      "eligibleTranches": [
        "junior"
      ],
      "primaryTranche": "junior",
      "rejectionReasons": [
        {
          "tranche": "senior",
          "reasons": [
            "tvlUsd 857280 < 25000000"
          ]
        },
        {
          "tranche": "mezzanine",
          "reasons": [
            "tvlUsd 857280 < 1000000"
          ]
        }
      ]
    },
    {
      "id": "agni:6d76a4e2-57f2-4190-a882-bd69f6ea32fb",
      "source": "agni",
      "asset": "0x45db70e1c808dae42f9c4dfea74ba5e6a113bdc1",
      "apy": 0.0195695,
      "apyReward": 0,
      "apyType": "variable",
      "tvlUsd": 432075,
      "lastUpdatedMs": 1779267875033,
      "raw": {
        "chain": "Mantle",
        "project": "fluxion-network",
        "symbol": "OPG-USDT0",
        "underlyingTokens": [
          "0x45db70e1c808dae42f9c4dfea74ba5e6a113bdc1",
          "0x779ded0c9e1022225f8e0630b35a9b54be713736"
        ],
        "apy": 1.95695,
        "apyBase": 1.95695,
        "apyReward": null,
        "tvlUsd": 432075,
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
        "apyVolatility": 9.512680536398125,
        "apyDrift": 0.034062725465239994
      },
      "probabilities": {
        "exploit": 0.0071295041764989275,
        "depeg": 0.005,
        "oracle": 0.007,
        "illiquid": 0.043644408613817735,
        "counterparty": 0.005
      },
      "severities": {
        "exploit": 0.85,
        "depeg": 0.2,
        "oracle": 0.4,
        "illiquid": 0.05,
        "counterparty": 0.5
      },
      "expectedLoss": 0.014542298980714975,
      "raapy": 0.005027201019285025,
      "confidence": 0.48680910161818286,
      "score": 0.0024472872118521563,
      "eligibleTranches": [
        "junior"
      ],
      "primaryTranche": "junior",
      "rejectionReasons": [
        {
          "tranche": "senior",
          "reasons": [
            "tvlUsd 432075 < 25000000",
            "apyBase 1.96% < 2% (reward-only positions blocked)"
          ]
        },
        {
          "tranche": "mezzanine",
          "reasons": [
            "tvlUsd 432075 < 1000000"
          ]
        }
      ]
    },
    {
      "id": "mantleVault:c87c5d7c-0285-47a9-8539-d335f05b9ba2",
      "source": "mantleVault",
      "asset": "0xcda86a272531e8640cd7f1a92c01839911b90bb0",
      "apy": 0.0031143,
      "apyReward": 0.00029549999999999997,
      "apyType": "variable",
      "tvlUsd": 267869,
      "lastUpdatedMs": 1779267875033,
      "raw": {
        "chain": "Mantle",
        "project": "lendle-pooled-markets",
        "symbol": "METH",
        "underlyingTokens": [
          "0xcDA86A272531e8640cD7F1a92c01839911B90bb0"
        ],
        "apy": 0.34098,
        "apyBase": 0.31143,
        "apyReward": 0.02955,
        "tvlUsd": 267869,
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
        "exploit": 0.0194640180070283,
        "depeg": 0.005,
        "oracle": 0.007,
        "illiquid": 0.04572077543606949,
        "counterparty": 0.005
      },
      "severities": {
        "exploit": 0.85,
        "depeg": 0.2,
        "oracle": 0.4,
        "illiquid": 0.05,
        "counterparty": 0.5
      },
      "expectedLoss": 0.02513045407777753,
      "raapy": -0.02201615407777753,
      "confidence": 0.6956989347313925,
      "score": -0.015316614938792033,
      "eligibleTranches": [
        "junior"
      ],
      "primaryTranche": "junior",
      "rejectionReasons": [
        {
          "tranche": "senior",
          "reasons": [
            "expectedLoss 0.0251 > 0.02",
            "tvlUsd 267869 < 25000000",
            "apyBase 0.31% < 2% (reward-only positions blocked)"
          ]
        },
        {
          "tranche": "mezzanine",
          "reasons": [
            "tvlUsd 267869 < 1000000",
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
      "apyReward": 0.0004774,
      "apyType": "variable",
      "tvlUsd": 193106,
      "lastUpdatedMs": 1779267875033,
      "raw": {
        "chain": "Mantle",
        "project": "lendle-pooled-markets",
        "symbol": "CMETH",
        "underlyingTokens": [
          "0xE6829d9a7eE3040e1276Fa75293Bde931859e8fA"
        ],
        "apy": 0.05113,
        "apyBase": 0.00339,
        "apyReward": 0.04774,
        "tvlUsd": 193106,
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
        "exploit": 0.019884943719570704,
        "depeg": 0.005,
        "oracle": 0.007,
        "illiquid": 0.047142042320393054,
        "counterparty": 0.005
      },
      "severities": {
        "exploit": 0.85,
        "depeg": 0.2,
        "oracle": 0.4,
        "illiquid": 0.05,
        "counterparty": 0.5
      },
      "expectedLoss": 0.02555930427765475,
      "raapy": -0.02552540427765475,
      "confidence": 0.693503995927433,
      "score": -0.01770196986421676,
      "eligibleTranches": [
        "junior"
      ],
      "primaryTranche": "junior",
      "rejectionReasons": [
        {
          "tranche": "senior",
          "reasons": [
            "expectedLoss 0.0256 > 0.02",
            "tvlUsd 193106 < 25000000",
            "apyBase 0.00% < 2% (reward-only positions blocked)"
          ]
        },
        {
          "tranche": "mezzanine",
          "reasons": [
            "tvlUsd 193106 < 1000000",
            "apyBase 0.00% < 1% (reward-only positions blocked)"
          ]
        }
      ]
    },
    {
      "id": "agni:649bee89-0a34-4eb1-b8ab-7c5fdee07ccd",
      "source": "agni",
      "asset": "0x29cc30f9d113b356ce408667aa6433589cecbdca",
      "apy": 0.007835,
      "apyReward": 0,
      "apyType": "variable",
      "tvlUsd": 131791,
      "lastUpdatedMs": 1779267875033,
      "raw": {
        "chain": "Mantle",
        "project": "fluxion-network",
        "symbol": "ELSA-USDT0",
        "underlyingTokens": [
          "0x29cc30f9d113b356ce408667aa6433589cecbdca",
          "0x779ded0c9e1022225f8e0630b35a9b54be713736"
        ],
        "apy": 0.7835,
        "apyBase": 0.7835,
        "apyReward": null,
        "tvlUsd": 131791,
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
        "apyVolatility": 0.030388458036968734,
        "apyDrift": 0.5746168845220309
      },
      "probabilities": {
        "exploit": 0.0077071661635034925,
        "depeg": 0.005,
        "oracle": 0.007,
        "illiquid": 0.048801142466752025,
        "counterparty": 0.005
      },
      "severities": {
        "exploit": 0.85,
        "depeg": 0.2,
        "oracle": 0.4,
        "illiquid": 0.05,
        "counterparty": 0.5
      },
      "expectedLoss": 0.01529114836231557,
      "raapy": -0.007456148362315571,
      "confidence": 0.4881464147627809,
      "score": -0.003639692091003726,
      "eligibleTranches": [
        "junior"
      ],
      "primaryTranche": "junior",
      "rejectionReasons": [
        {
          "tranche": "senior",
          "reasons": [
            "tvlUsd 131791 < 25000000",
            "apyBase 0.78% < 2% (reward-only positions blocked)"
          ]
        },
        {
          "tranche": "mezzanine",
          "reasons": [
            "tvlUsd 131791 < 1000000",
            "apyBase 0.78% < 1% (reward-only positions blocked)"
          ]
        }
      ]
    },
    {
      "id": "agni:227e8492-33e9-4953-8beb-28973c9fdb8a",
      "source": "agni",
      "asset": "0x09bc4e0d864854c6afb6eb9a9cdf58ac190d0df9",
      "apy": 0.0007348000000000001,
      "apyReward": 0,
      "apyType": "variable",
      "tvlUsd": 116182,
      "lastUpdatedMs": 1779267875033,
      "raw": {
        "chain": "Mantle",
        "project": "fluxion-network",
        "symbol": "USDC-WGOOGLX",
        "underlyingTokens": [
          "0x09bc4e0d864854c6afb6eb9a9cdf58ac190d0df9",
          "0x1630f08370917e79df0b7572395a5e907508bbbc"
        ],
        "apy": 0.07348,
        "apyBase": 0.07348,
        "apyReward": null,
        "tvlUsd": 116182,
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
        "apyVolatility": 0.008233893984013614,
        "apyDrift": 1.300051175503366
      },
      "probabilities": {
        "exploit": 0.007768494141317974,
        "depeg": 0.005,
        "oracle": 0.007,
        "illiquid": 0.049348611516892994,
        "counterparty": 0.005
      },
      "severities": {
        "exploit": 0.85,
        "depeg": 0.2,
        "oracle": 0.4,
        "illiquid": 0.05,
        "counterparty": 0.5
      },
      "expectedLoss": 0.015370650595964928,
      "raapy": -0.014635850595964927,
      "confidence": 0.6762460585217546,
      "score": -0.009897436278634555,
      "eligibleTranches": [
        "junior"
      ],
      "primaryTranche": "junior",
      "rejectionReasons": [
        {
          "tranche": "senior",
          "reasons": [
            "tvlUsd 116182 < 25000000",
            "apyBase 0.07% < 2% (reward-only positions blocked)"
          ]
        },
        {
          "tranche": "mezzanine",
          "reasons": [
            "tvlUsd 116182 < 1000000",
            "apyBase 0.07% < 1% (reward-only positions blocked)"
          ]
        }
      ]
    },
    {
      "id": "agni:2a510869-6356-4486-8bb5-d5a808634496",
      "source": "agni",
      "asset": "0x09bc4e0d864854c6afb6eb9a9cdf58ac190d0df9",
      "apy": 0.0023853,
      "apyReward": 0,
      "apyType": "variable",
      "tvlUsd": 112241,
      "lastUpdatedMs": 1779267875033,
      "raw": {
        "chain": "Mantle",
        "project": "fluxion-network",
        "symbol": "USDC-WNVDAX",
        "underlyingTokens": [
          "0x09bc4e0d864854c6afb6eb9a9cdf58ac190d0df9",
          "0x93e62845c1dd5822ebc807ab71a5fb750decd15a"
        ],
        "apy": 0.23853,
        "apyBase": 0.23853,
        "apyReward": null,
        "tvlUsd": 112241,
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
        "apyVolatility": 0.010682468750624126,
        "apyDrift": 1.6777753918798364
      },
      "probabilities": {
        "exploit": 0.007785283073727867,
        "depeg": 0.005,
        "oracle": 0.007,
        "illiquid": 0.04949848472659069,
        "counterparty": 0.005
      },
      "severities": {
        "exploit": 0.85,
        "depeg": 0.2,
        "oracle": 0.4,
        "illiquid": 0.05,
        "counterparty": 0.5
      },
      "expectedLoss": 0.015392414848998224,
      "raapy": -0.013007114848998224,
      "confidence": 0.473749511109851,
      "score": -0.006162114300662592,
      "eligibleTranches": [
        "junior"
      ],
      "primaryTranche": "junior",
      "rejectionReasons": [
        {
          "tranche": "senior",
          "reasons": [
            "tvlUsd 112241 < 25000000",
            "apyBase 0.24% < 2% (reward-only positions blocked)"
          ]
        },
        {
          "tranche": "mezzanine",
          "reasons": [
            "tvlUsd 112241 < 1000000",
            "apyBase 0.24% < 1% (reward-only positions blocked)"
          ]
        }
      ]
    },
    {
      "id": "agni:ebec73de-fd1e-4f97-8287-d9cb01c7d352",
      "source": "agni",
      "asset": "0x09bc4e0d864854c6afb6eb9a9cdf58ac190d0df9",
      "apy": 0.004823,
      "apyReward": 0,
      "apyType": "variable",
      "tvlUsd": 111174,
      "lastUpdatedMs": 1779267875033,
      "raw": {
        "chain": "Mantle",
        "project": "fluxion-network",
        "symbol": "USDC-WMSTRX",
        "underlyingTokens": [
          "0x09bc4e0d864854c6afb6eb9a9cdf58ac190d0df9",
          "0x266e5923f6118f8b340ca5a23ae7f71897361476"
        ],
        "apy": 0.4823,
        "apyBase": 0.4823,
        "apyReward": null,
        "tvlUsd": 111174,
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
        "apyVolatility": 0.024214513435961874,
        "apyDrift": 0.9491642494861909
      },
      "probabilities": {
        "exploit": 0.007789930031999124,
        "depeg": 0.005,
        "oracle": 0.007,
        "illiquid": 0.049539967683007516,
        "counterparty": 0.005
      },
      "severities": {
        "exploit": 0.85,
        "depeg": 0.2,
        "oracle": 0.4,
        "illiquid": 0.05,
        "counterparty": 0.5
      },
      "expectedLoss": 0.015398438911349633,
      "raapy": -0.010575438911349634,
      "confidence": 0.6767827599249228,
      "score": -0.007157274733840626,
      "eligibleTranches": [
        "junior"
      ],
      "primaryTranche": "junior",
      "rejectionReasons": [
        {
          "tranche": "senior",
          "reasons": [
            "tvlUsd 111174 < 25000000",
            "apyBase 0.48% < 2% (reward-only positions blocked)"
          ]
        },
        {
          "tranche": "mezzanine",
          "reasons": [
            "tvlUsd 111174 < 1000000",
            "apyBase 0.48% < 1% (reward-only positions blocked)"
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
      "lastUpdatedMs": 1779267875033,
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
      "confidence": 0.4737479319474459,
      "score": -0.005145611216361485,
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
      "apy": 0.0007189,
      "apyReward": 0,
      "apyType": "variable",
      "tvlUsd": 108945,
      "lastUpdatedMs": 1779267875033,
      "raw": {
        "chain": "Mantle",
        "project": "fluxion-network",
        "symbol": "USDC-WQQQX",
        "underlyingTokens": [
          "0x09bc4e0d864854c6afb6eb9a9cdf58ac190d0df9",
          "0xdbd9232fee15351068fe02f0683146e16d9f2cea"
        ],
        "apy": 0.07189,
        "apyBase": 0.07189,
        "apyReward": null,
        "tvlUsd": 108945,
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
        "apyVolatility": 0.002124433981337376,
        "apyDrift": 1.1900804290466864
      },
      "probabilities": {
        "exploit": 0.007799783310584891,
        "depeg": 0.005,
        "oracle": 0.007,
        "illiquid": 0.049627926967829236,
        "counterparty": 0.005
      },
      "severities": {
        "exploit": 0.85,
        "depeg": 0.2,
        "oracle": 0.4,
        "illiquid": 0.05,
        "counterparty": 0.5
      },
      "expectedLoss": 0.01541121216238862,
      "raapy": -0.01469231216238862,
      "confidence": 0.6767985517068911,
      "score": -0.009943735592730159,
      "eligibleTranches": [
        "junior"
      ],
      "primaryTranche": "junior",
      "rejectionReasons": [
        {
          "tranche": "senior",
          "reasons": [
            "tvlUsd 108945 < 25000000",
            "apyBase 0.07% < 2% (reward-only positions blocked)"
          ]
        },
        {
          "tranche": "mezzanine",
          "reasons": [
            "tvlUsd 108945 < 1000000",
            "apyBase 0.07% < 1% (reward-only positions blocked)"
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
      "lastUpdatedMs": 1779267875033,
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
      "confidence": 0.4881464147627809,
      "score": -0.007500972884691599,
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
      "lastUpdatedMs": 1779267875033,
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
      "confidence": 0.47375109027751994,
      "score": -0.0048963635054279225,
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
      "lastUpdatedMs": 1779267875033,
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
      "confidence": 0.6768414169725516,
      "score": -0.009827242389079106,
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
      "apy": 0.0017682000000000002,
      "apyReward": 0,
      "apyType": "variable",
      "tvlUsd": 105999,
      "lastUpdatedMs": 1779267875033,
      "raw": {
        "chain": "Mantle",
        "project": "fluxion-network",
        "symbol": "USDC-WTSLAX",
        "underlyingTokens": [
          "0x09bc4e0d864854c6afb6eb9a9cdf58ac190d0df9",
          "0x43680abf18cf54898be84c6ef78237cfbd441883"
        ],
        "apy": 0.17682,
        "apyBase": 0.17682,
        "apyReward": null,
        "tvlUsd": 105999,
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
        "exploit": 0.007813119998597545,
        "depeg": 0.005,
        "oracle": 0.007,
        "illiquid": 0.049746982318723106,
        "counterparty": 0.005
      },
      "severities": {
        "exploit": 0.85,
        "depeg": 0.2,
        "oracle": 0.4,
        "illiquid": 0.05,
        "counterparty": 0.5
      },
      "expectedLoss": 0.01542850111474407,
      "raapy": -0.013660301114744072,
      "confidence": 0.6767850158712158,
      "score": -0.009245087106747653,
      "eligibleTranches": [
        "junior"
      ],
      "primaryTranche": "junior",
      "rejectionReasons": [
        {
          "tranche": "senior",
          "reasons": [
            "tvlUsd 105999 < 25000000",
            "apyBase 0.18% < 2% (reward-only positions blocked)"
          ]
        },
        {
          "tranche": "mezzanine",
          "reasons": [
            "tvlUsd 105999 < 1000000",
            "apyBase 0.18% < 1% (reward-only positions blocked)"
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
      "lastUpdatedMs": 1779267875033,
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
      "confidence": 0.6768008077058235,
      "score": -0.006553096695951356,
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
      "lastUpdatedMs": 1779267875033,
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
      "confidence": 0.676185199115202,
      "score": -0.006551705278476487,
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
      "apy": 0.0008133,
      "apyReward": 0,
      "apyType": "variable",
      "tvlUsd": 101921,
      "lastUpdatedMs": 1779267875033,
      "raw": {
        "chain": "Mantle",
        "project": "fluxion-network",
        "symbol": "USDT0-VOOI",
        "underlyingTokens": [
          "0x779ded0c9e1022225f8e0630b35a9b54be713736",
          "0xd81a4adea9932a6bdba0bdbc8c5fd4c78e5a09f1"
        ],
        "apy": 0.08133,
        "apyBase": 0.08133,
        "apyReward": null,
        "tvlUsd": 101921,
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
        "apyVolatility": 0.0047951455338414405,
        "apyDrift": 0.49545064523878435
      },
      "probabilities": {
        "exploit": 0.007832206223280309,
        "depeg": 0.005,
        "oracle": 0.007,
        "illiquid": 0.049917363238985275,
        "counterparty": 0.005
      },
      "severities": {
        "exploit": 0.85,
        "depeg": 0.2,
        "oracle": 0.4,
        "illiquid": 0.05,
        "counterparty": 0.5
      },
      "expectedLoss": 0.015453243451737526,
      "raapy": -0.014639943451737527,
      "confidence": 0.6973264519843503,
      "score": -0.010208819824451652,
      "eligibleTranches": [
        "junior"
      ],
      "primaryTranche": "junior",
      "rejectionReasons": [
        {
          "tranche": "senior",
          "reasons": [
            "tvlUsd 101921 < 25000000",
            "apyBase 0.08% < 2% (reward-only positions blocked)"
          ]
        },
        {
          "tranche": "mezzanine",
          "reasons": [
            "tvlUsd 101921 < 1000000",
            "apyBase 0.08% < 1% (reward-only positions blocked)"
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
      "tvlUsd": 72070,
      "lastUpdatedMs": 1779267875033,
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
        "tvlUsd": 72070,
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
        "exploit": 0.02115264064838696,
        "depeg": 0.005,
        "oracle": 0.007,
        "illiquid": 0.05142245477940559,
        "counterparty": 0.005
      },
      "severities": {
        "exploit": 0.85,
        "depeg": 0.2,
        "oracle": 0.4,
        "illiquid": 0.05,
        "counterparty": 0.5
      },
      "expectedLoss": 0.026850867290099195,
      "raapy": -0.026175667290099194,
      "confidence": 0.6937097659672715,
      "score": -0.018158316029851875,
      "eligibleTranches": [],
      "primaryTranche": null,
      "rejectionReasons": [
        {
          "tranche": "senior",
          "reasons": [
            "expectedLoss 0.0269 > 0.02",
            "tvlUsd 72070 < 25000000",
            "apyBase 0.07% < 2% (reward-only positions blocked)"
          ]
        },
        {
          "tranche": "mezzanine",
          "reasons": [
            "tvlUsd 72070 < 1000000",
            "apyBase 0.07% < 1% (reward-only positions blocked)"
          ]
        },
        {
          "tranche": "junior",
          "reasons": [
            "tvlUsd 72070 < 100000"
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
      "tvlUsd": 51664,
      "lastUpdatedMs": 1779267875033,
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
        "tvlUsd": 51664,
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
        "exploit": 0.03096677259083719,
        "depeg": 0.005,
        "oracle": 0.02,
        "illiquid": 0.05286811972326914,
        "counterparty": 0.005
      },
      "severities": {
        "exploit": 0.85,
        "depeg": 0.2,
        "oracle": 0.4,
        "illiquid": 0.05,
        "counterparty": 0.5
      },
      "expectedLoss": 0.04046516268837508,
      "raapy": -0.01145106268837508,
      "confidence": 0.6937074536052389,
      "score": -0.007943687538626638,
      "eligibleTranches": [],
      "primaryTranche": null,
      "rejectionReasons": [
        {
          "tranche": "senior",
          "reasons": [
            "expectedLoss 0.0405 > 0.02",
            "tvlUsd 51664 < 25000000"
          ]
        },
        {
          "tranche": "mezzanine",
          "reasons": [
            "expectedLoss 0.0405 > 0.04",
            "tvlUsd 51664 < 1000000"
          ]
        },
        {
          "tranche": "junior",
          "reasons": [
            "tvlUsd 51664 < 100000"
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
      "lastUpdatedMs": 1779267875033,
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
      "confidence": 0.6961211201350868,
      "score": -0.002458485539321451,
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
      "lastUpdatedMs": 1779267875033,
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
      "confidence": 0.48680910161818286,
      "score": -0.005719630374269521,
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
      "tvlUsd": 33924,
      "lastUpdatedMs": 1779267875033,
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
        "tvlUsd": 33924,
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
        "exploit": 0.022121824374285698,
        "depeg": 0.005,
        "oracle": 0.007,
        "illiquid": 0.05469492945462856,
        "counterparty": 0.005
      },
      "severities": {
        "exploit": 0.85,
        "depeg": 0.2,
        "oracle": 0.4,
        "illiquid": 0.05,
        "counterparty": 0.5
      },
      "expectedLoss": 0.02783829719087427,
      "raapy": -0.02783099719087427,
      "confidence": 0.6949155553181983,
      "score": -0.01934019286795561,
      "eligibleTranches": [],
      "primaryTranche": null,
      "rejectionReasons": [
        {
          "tranche": "senior",
          "reasons": [
            "expectedLoss 0.0278 > 0.02",
            "tvlUsd 33924 < 25000000",
            "apyBase 0.00% < 2% (reward-only positions blocked)"
          ]
        },
        {
          "tranche": "mezzanine",
          "reasons": [
            "tvlUsd 33924 < 1000000",
            "apyBase 0.00% < 1% (reward-only positions blocked)"
          ]
        },
        {
          "tranche": "junior",
          "reasons": [
            "tvlUsd 33924 < 100000"
          ]
        }
      ]
    },
    {
      "id": "mantleVault:dc732e3d-d65b-4087-8d48-53e50bb47732",
      "source": "mantleVault",
      "asset": "0xc96de26018a54d51c097160568752c4e3bd6c364",
      "apy": 0.0038028000000000003,
      "apyReward": 0.0125166,
      "apyType": "variable",
      "tvlUsd": 28254,
      "lastUpdatedMs": 1779267875033,
      "raw": {
        "chain": "Mantle",
        "project": "lendle-pooled-markets",
        "symbol": "FBTC",
        "underlyingTokens": [
          "0xC96dE26018A54D51c097160568752c4E3BD6C364"
        ],
        "apy": 1.63194,
        "apyBase": 0.38028,
        "apyReward": 1.25166,
        "tvlUsd": 28254,
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
        "apyVolatility": 0.0006571072379023231,
        "apyDrift": 1.2913837653348887
      },
      "probabilities": {
        "exploit": 0.022357057565199085,
        "depeg": 0.005,
        "oracle": 0.007,
        "illiquid": 0.05548920059173634,
        "counterparty": 0.005
      },
      "severities": {
        "exploit": 0.85,
        "depeg": 0.2,
        "oracle": 0.4,
        "illiquid": 0.05,
        "counterparty": 0.5
      },
      "expectedLoss": 0.02807795896000604,
      "raapy": -0.024275158960006038,
      "confidence": 0.6934993725828713,
      "score": -0.016834807508113656,
      "eligibleTranches": [],
      "primaryTranche": null,
      "rejectionReasons": [
        {
          "tranche": "senior",
          "reasons": [
            "expectedLoss 0.0281 > 0.02",
            "tvlUsd 28254 < 25000000",
            "apyBase 0.38% < 2% (reward-only positions blocked)"
          ]
        },
        {
          "tranche": "mezzanine",
          "reasons": [
            "tvlUsd 28254 < 1000000",
            "apyBase 0.38% < 1% (reward-only positions blocked)"
          ]
        },
        {
          "tranche": "junior",
          "reasons": [
            "tvlUsd 28254 < 100000"
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
      "tvlUsd": 21736,
      "lastUpdatedMs": 1779267875033,
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
        "tvlUsd": 21736,
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
        "exploit": 0.022694387393638212,
        "depeg": 0.005,
        "oracle": 0.007,
        "illiquid": 0.05662820374590166,
        "counterparty": 0.005
      },
      "severities": {
        "exploit": 0.85,
        "depeg": 0.2,
        "oracle": 0.4,
        "illiquid": 0.05,
        "counterparty": 0.5
      },
      "expectedLoss": 0.028421639471887566,
      "raapy": -0.028420539471887565,
      "confidence": 0.69540448451205,
      "score": -0.01976377060100234,
      "eligibleTranches": [],
      "primaryTranche": null,
      "rejectionReasons": [
        {
          "tranche": "senior",
          "reasons": [
            "expectedLoss 0.0284 > 0.02",
            "tvlUsd 21736 < 25000000",
            "apyBase 0.00% < 2% (reward-only positions blocked)"
          ]
        },
        {
          "tranche": "mezzanine",
          "reasons": [
            "tvlUsd 21736 < 1000000",
            "apyBase 0.00% < 1% (reward-only positions blocked)"
          ]
        },
        {
          "tranche": "junior",
          "reasons": [
            "tvlUsd 21736 < 100000"
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
      "tvlUsd": 17552,
      "lastUpdatedMs": 1779267875033,
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
        "tvlUsd": 17552,
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
        "exploit": 0.032959293455338316,
        "depeg": 0.005,
        "oracle": 0.02,
        "illiquid": 0.05755673389769365,
        "counterparty": 0.005
      },
      "severities": {
        "exploit": 0.85,
        "depeg": 0.2,
        "oracle": 0.4,
        "illiquid": 0.05,
        "counterparty": 0.5
      },
      "expectedLoss": 0.04239323613192225,
      "raapy": -0.03794613613192225,
      "confidence": 0.48475101651304714,
      "score": -0.018394428062691776,
      "eligibleTranches": [],
      "primaryTranche": null,
      "rejectionReasons": [
        {
          "tranche": "senior",
          "reasons": [
            "expectedLoss 0.0424 > 0.02",
            "tvlUsd 17552 < 25000000",
            "apyBase 0.44% < 2% (reward-only positions blocked)"
          ]
        },
        {
          "tranche": "mezzanine",
          "reasons": [
            "expectedLoss 0.0424 > 0.04",
            "tvlUsd 17552 < 1000000",
            "apyBase 0.44% < 1% (reward-only positions blocked)"
          ]
        },
        {
          "tranche": "junior",
          "reasons": [
            "tvlUsd 17552 < 100000"
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
      "tvlUsd": 14678,
      "lastUpdatedMs": 1779267875033,
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
        "tvlUsd": 14678,
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
        "exploit": 0.02319938190406421,
        "depeg": 0.005,
        "oracle": 0.007,
        "illiquid": 0.058333331166363904,
        "counterparty": 0.005
      },
      "severities": {
        "exploit": 0.85,
        "depeg": 0.2,
        "oracle": 0.4,
        "illiquid": 0.05,
        "counterparty": 0.5
      },
      "expectedLoss": 0.028936141176772776,
      "raapy": -0.028936041176772776,
      "confidence": 0.6934716331627601,
      "score": -0.02006632373212149,
      "eligibleTranches": [],
      "primaryTranche": null,
      "rejectionReasons": [
        {
          "tranche": "senior",
          "reasons": [
            "expectedLoss 0.0289 > 0.02",
            "tvlUsd 14678 < 25000000",
            "apyBase 0.00% < 2% (reward-only positions blocked)"
          ]
        },
        {
          "tranche": "mezzanine",
          "reasons": [
            "tvlUsd 14678 < 1000000",
            "apyBase 0.00% < 1% (reward-only positions blocked)"
          ]
        },
        {
          "tranche": "junior",
          "reasons": [
            "tvlUsd 14678 < 100000"
          ]
        }
      ]
    },
    {
      "id": "fbtc:d8733ab8-a147-4e31-a668-2c9dff24ea56",
      "source": "fbtc",
      "asset": "0x201eba5cc46d216ce6dc03f6a759e8e766e956ae",
      "apy": 0.1079112,
      "apyReward": 0.019632300000000002,
      "apyType": "variable",
      "tvlUsd": 14671,
      "lastUpdatedMs": 1779267875033,
      "raw": {
        "chain": "Mantle",
        "project": "clearpool-lending",
        "symbol": "USDT",
        "underlyingTokens": [
          "0x201eba5cc46d216ce6dc03f6a759e8e766e956ae"
        ],
        "apy": 12.75435,
        "apyBase": 10.79112,
        "apyReward": 1.96323,
        "tvlUsd": 14671,
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
        "apyVolatility": 0.03324708679472662,
        "apyDrift": 1.201454148906093
      },
      "probabilities": {
        "exploit": 0.023199995452517563,
        "depeg": 0.005,
        "oracle": 0.02,
        "illiquid": 0.058335402829065165,
        "counterparty": 0.08
      },
      "severities": {
        "exploit": 0.85,
        "depeg": 0.2,
        "oracle": 0.4,
        "illiquid": 0.05,
        "counterparty": 0.5
      },
      "expectedLoss": 0.0716367662760932,
      "raapy": 0.036274433723906804,
      "confidence": 0.47303784274956484,
      "score": 0.01715917987571894,
      "eligibleTranches": [],
      "primaryTranche": null,
      "rejectionReasons": [
        {
          "tranche": "senior",
          "reasons": [
            "expectedLoss 0.0716 > 0.02",
            "tvlUsd 14671 < 25000000",
            "apy 10.79% > 8% (too-good-to-be-true gate)"
          ]
        },
        {
          "tranche": "mezzanine",
          "reasons": [
            "expectedLoss 0.0716 > 0.04",
            "tvlUsd 14671 < 1000000"
          ]
        },
        {
          "tranche": "junior",
          "reasons": [
            "tvlUsd 14671 < 100000"
          ]
        }
      ]
    },
    {
      "id": "aave:4a0e9f84-09a0-491a-aa5e-269813d31a59",
      "source": "aave",
      "asset": "0xdeaddeaddeaddeaddeaddeaddeaddeaddead1111",
      "apy": 0.0891522,
      "apyReward": 0,
      "apyType": "variable",
      "tvlUsd": 11983,
      "lastUpdatedMs": 1779267875033,
      "raw": {
        "chain": "Mantle",
        "project": "aave-v3",
        "symbol": "WETH",
        "underlyingTokens": [
          "0xdEAddEaDdeadDEadDEADDEAddEADDEAddead1111"
        ],
        "apy": 8.91522,
        "apyBase": 8.91522,
        "apyReward": null,
        "tvlUsd": 11983,
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
        "apyVolatility": 0.02180146569082128,
        "apyDrift": 2.2518925919690984
      },
      "probabilities": {
        "exploit": 0.001824035848854309,
        "depeg": 0.005,
        "oracle": 0.002,
        "illiquid": 0.05921434440682883,
        "counterparty": 0.005
      },
      "severities": {
        "exploit": 0.85,
        "depeg": 0.2,
        "oracle": 0.4,
        "illiquid": 0.05,
        "counterparty": 0.5
      },
      "expectedLoss": 0.008811147691867605,
      "raapy": 0.08034105230813239,
      "confidence": 0.48680910161818286,
      "score": 0.03911075549718136,
      "eligibleTranches": [],
      "primaryTranche": null,
      "rejectionReasons": [
        {
          "tranche": "senior",
          "reasons": [
            "tvlUsd 11983 < 25000000",
            "apy 8.92% > 8% (too-good-to-be-true gate)"
          ]
        },
        {
          "tranche": "mezzanine",
          "reasons": [
            "tvlUsd 11983 < 1000000"
          ]
        },
        {
          "tranche": "junior",
          "reasons": [
            "tvlUsd 11983 < 100000"
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
      "tvlUsd": 10416,
      "lastUpdatedMs": 1779267875033,
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
        "tvlUsd": 10416,
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
        "exploit": 0.023640562820917053,
        "depeg": 0.005,
        "oracle": 0.007,
        "illiquid": 0.05982299028775884,
        "counterparty": 0.005
      },
      "severities": {
        "exploit": 0.85,
        "depeg": 0.2,
        "oracle": 0.4,
        "illiquid": 0.05,
        "counterparty": 0.5
      },
      "expectedLoss": 0.02938562791216744,
      "raapy": -0.02933802791216744,
      "confidence": 0.6946816397925639,
      "score": -0.02038058933830449,
      "eligibleTranches": [],
      "primaryTranche": null,
      "rejectionReasons": [
        {
          "tranche": "senior",
          "reasons": [
            "expectedLoss 0.0294 > 0.02",
            "tvlUsd 10416 < 25000000",
            "apyBase 0.00% < 2% (reward-only positions blocked)"
          ]
        },
        {
          "tranche": "mezzanine",
          "reasons": [
            "tvlUsd 10416 < 1000000",
            "apyBase 0.00% < 1% (reward-only positions blocked)"
          ]
        },
        {
          "tranche": "junior",
          "reasons": [
            "tvlUsd 10416 < 100000"
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
      "tvlUsd": 10347,
      "lastUpdatedMs": 1779267875033,
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
        "tvlUsd": 10347,
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
        "exploit": 0.023649111612144894,
        "depeg": 0.005,
        "oracle": 0.007,
        "illiquid": 0.05985185550912947,
        "counterparty": 0.005
      },
      "severities": {
        "exploit": 0.85,
        "depeg": 0.2,
        "oracle": 0.4,
        "illiquid": 0.05,
        "counterparty": 0.5
      },
      "expectedLoss": 0.029394337645779634,
      "raapy": -0.029191437645779635,
      "confidence": 0.6761874530696222,
      "score": -0.01973888387314042,
      "eligibleTranches": [],
      "primaryTranche": null,
      "rejectionReasons": [
        {
          "tranche": "senior",
          "reasons": [
            "expectedLoss 0.0294 > 0.02",
            "tvlUsd 10347 < 25000000",
            "apyBase 0.02% < 2% (reward-only positions blocked)"
          ]
        },
        {
          "tranche": "mezzanine",
          "reasons": [
            "tvlUsd 10347 < 1000000",
            "apyBase 0.02% < 1% (reward-only positions blocked)"
          ]
        },
        {
          "tranche": "junior",
          "reasons": [
            "tvlUsd 10347 < 100000"
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
      "tvlUsd": 6354,
      "lastUpdatedMs": 1779267875033,
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
        "tvlUsd": 6354,
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
        "exploit": 0.02427628640093589,
        "depeg": 0.005,
        "oracle": 0.007,
        "illiquid": 0.061969527895088715,
        "counterparty": 0.005
      },
      "severities": {
        "exploit": 0.85,
        "depeg": 0.2,
        "oracle": 0.4,
        "illiquid": 0.05,
        "counterparty": 0.5
      },
      "expectedLoss": 0.03003331983554994,
      "raapy": -0.02961321983554994,
      "confidence": 0.6757097827328502,
      "score": -0.020009942341099582,
      "eligibleTranches": [],
      "primaryTranche": null,
      "rejectionReasons": [
        {
          "tranche": "senior",
          "reasons": [
            "expectedLoss 0.0300 > 0.02",
            "tvlUsd 6354 < 25000000",
            "apyBase 0.04% < 2% (reward-only positions blocked)"
          ]
        },
        {
          "tranche": "mezzanine",
          "reasons": [
            "tvlUsd 6354 < 1000000",
            "apyBase 0.04% < 1% (reward-only positions blocked)"
          ]
        },
        {
          "tranche": "junior",
          "reasons": [
            "tvlUsd 6354 < 100000"
          ]
        }
      ]
    },
    {
      "id": "mantleVault:7be673f4-8b41-4d3f-a533-45d20d62e8fa",
      "source": "mantleVault",
      "asset": "0xcabae6f6ea1ecab08ad02fe02ce9a44f09aebfa2",
      "apy": 0.0071475,
      "apyReward": 0.0002405,
      "apyType": "variable",
      "tvlUsd": 5881,
      "lastUpdatedMs": 1779267875033,
      "raw": {
        "chain": "Mantle",
        "project": "lendle-pooled-markets",
        "symbol": "WBTC",
        "underlyingTokens": [
          "0xCAbAE6f6Ea1ecaB08Ad02fE02ce9A44F09aebfA2"
        ],
        "apy": 0.7388,
        "apyBase": 0.71475,
        "apyReward": 0.02405,
        "tvlUsd": 5881,
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
        "exploit": 0.024375785189521982,
        "depeg": 0.005,
        "oracle": 0.007,
        "illiquid": 0.06230548820597963,
        "counterparty": 0.005
      },
      "severities": {
        "exploit": 0.85,
        "depeg": 0.2,
        "oracle": 0.4,
        "illiquid": 0.05,
        "counterparty": 0.5
      },
      "expectedLoss": 0.030134691821392664,
      "raapy": -0.022987191821392663,
      "confidence": 0.4849142434969404,
      "score": -0.011146816732189679,
      "eligibleTranches": [],
      "primaryTranche": null,
      "rejectionReasons": [
        {
          "tranche": "senior",
          "reasons": [
            "expectedLoss 0.0301 > 0.02",
            "tvlUsd 5881 < 25000000",
            "apyBase 0.71% < 2% (reward-only positions blocked)"
          ]
        },
        {
          "tranche": "mezzanine",
          "reasons": [
            "tvlUsd 5881 < 1000000",
            "apyBase 0.71% < 1% (reward-only positions blocked)"
          ]
        },
        {
          "tranche": "junior",
          "reasons": [
            "tvlUsd 5881 < 100000"
          ]
        }
      ]
    },
    {
      "id": "mantleVault:f7150467-f302-41e8-9f9a-1f73d2b49df4",
      "source": "mantleVault",
      "asset": "0x5d3a1ff2b6bab83b63cd9ad0787074081a52ef34",
      "apy": 0.4919302,
      "apyReward": 0.005412200000000001,
      "apyType": "variable",
      "tvlUsd": 3148,
      "lastUpdatedMs": 1779267875033,
      "raw": {
        "chain": "Mantle",
        "project": "lendle-pooled-markets",
        "symbol": "USDE",
        "underlyingTokens": [
          "0x5d3a1Ff2b6BAb83b63cd9AD0787074081a52ef34"
        ],
        "apy": 49.73425,
        "apyBase": 49.19302,
        "apyReward": 0.54122,
        "tvlUsd": 3148,
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
        "apyVolatility": 0.19389456665130428,
        "apyDrift": 119.43145577846134
      },
      "probabilities": {
        "exploit": 0.025179618489781765,
        "depeg": 0.005,
        "oracle": 0.007,
        "illiquid": 0.06501965276312974,
        "counterparty": 0.005
      },
      "severities": {
        "exploit": 0.85,
        "depeg": 0.2,
        "oracle": 0.4,
        "illiquid": 0.05,
        "counterparty": 0.5
      },
      "expectedLoss": 0.030953658354470986,
      "raapy": 0.460976541645529,
      "confidence": 0.33263322188248556,
      "score": 0.1533361122597981,
      "eligibleTranches": [],
      "primaryTranche": null,
      "rejectionReasons": [
        {
          "tranche": "senior",
          "reasons": [
            "expectedLoss 0.0310 > 0.02",
            "tvlUsd 3148 < 25000000",
            "apy 49.19% > 8% (too-good-to-be-true gate)"
          ]
        },
        {
          "tranche": "mezzanine",
          "reasons": [
            "tvlUsd 3148 < 1000000",
            "apy 49.19% > 20% (too-good-to-be-true gate)"
          ]
        },
        {
          "tranche": "junior",
          "reasons": [
            "tvlUsd 3148 < 100000"
          ]
        }
      ]
    },
    {
      "id": "mantleVault:4f9047f1-ca9f-4b30-b5ad-c7a900c38cae",
      "source": "mantleVault",
      "asset": "0xdeaddeaddeaddeaddeaddeaddeaddeaddead1111",
      "apy": 0.4335303,
      "apyReward": 0.014977,
      "apyType": "variable",
      "tvlUsd": 2922,
      "lastUpdatedMs": 1779267875033,
      "raw": {
        "chain": "Mantle",
        "project": "lendle-pooled-markets",
        "symbol": "WETH",
        "underlyingTokens": [
          "0xdEAddEaDdeadDEadDEADDEAddEADDEAddead1111"
        ],
        "apy": 44.85073,
        "apyBase": 43.35303,
        "apyReward": 1.4977,
        "tvlUsd": 2922,
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
        "exploit": 0.025275440366764428,
        "depeg": 0.005,
        "oracle": 0.007,
        "illiquid": 0.06534319788401723,
        "counterparty": 0.005
      },
      "severities": {
        "exploit": 0.85,
        "depeg": 0.2,
        "oracle": 0.4,
        "illiquid": 0.05,
        "counterparty": 0.5
      },
      "expectedLoss": 0.031051284205950623,
      "raapy": 0.4024790157940494,
      "confidence": 0.34076409936449303,
      "score": 0.13715039933016682,
      "eligibleTranches": [],
      "primaryTranche": null,
      "rejectionReasons": [
        {
          "tranche": "senior",
          "reasons": [
            "expectedLoss 0.0311 > 0.02",
            "tvlUsd 2922 < 25000000",
            "apy 43.35% > 8% (too-good-to-be-true gate)"
          ]
        },
        {
          "tranche": "mezzanine",
          "reasons": [
            "tvlUsd 2922 < 1000000",
            "apy 43.35% > 20% (too-good-to-be-true gate)"
          ]
        },
        {
          "tranche": "junior",
          "reasons": [
            "tvlUsd 2922 < 100000"
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
      "tvlUsd": 2304,
      "lastUpdatedMs": 1779267875033,
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
        "tvlUsd": 2304,
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
        "exploit": 0.025581073189102396,
        "depeg": 0.005,
        "oracle": 0.007,
        "illiquid": 0.06637517525248826,
        "counterparty": 0.005
      },
      "severities": {
        "exploit": 0.85,
        "depeg": 0.2,
        "oracle": 0.4,
        "illiquid": 0.05,
        "counterparty": 0.5
      },
      "expectedLoss": 0.03136267097336145,
      "raapy": -0.03115237097336145,
      "confidence": 0.6941932188207526,
      "score": -0.021625764679895965,
      "eligibleTranches": [],
      "primaryTranche": null,
      "rejectionReasons": [
        {
          "tranche": "senior",
          "reasons": [
            "expectedLoss 0.0314 > 0.02",
            "tvlUsd 2304 < 25000000",
            "apyBase 0.02% < 2% (reward-only positions blocked)"
          ]
        },
        {
          "tranche": "mezzanine",
          "reasons": [
            "tvlUsd 2304 < 1000000",
            "apyBase 0.02% < 1% (reward-only positions blocked)"
          ]
        },
        {
          "tranche": "junior",
          "reasons": [
            "tvlUsd 2304 < 100000"
          ]
        }
      ]
    },
    {
      "id": "mantleVault:dce58852-9976-4141-b26a-a832c5edc34e",
      "source": "mantleVault",
      "asset": "0x201eba5cc46d216ce6dc03f6a759e8e766e956ae",
      "apy": 0.5087372,
      "apyReward": 0.0147438,
      "apyType": "variable",
      "tvlUsd": 2133,
      "lastUpdatedMs": 1779267875033,
      "raw": {
        "chain": "Mantle",
        "project": "lendle-pooled-markets",
        "symbol": "USDT",
        "underlyingTokens": [
          "0x201EBa5CC46D216Ce6DC03F6a759e8E766e956aE"
        ],
        "apy": 52.3481,
        "apyBase": 50.87372,
        "apyReward": 1.47438,
        "tvlUsd": 2133,
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
        "apyVolatility": 0.22480505171679976,
        "apyDrift": 3.549959790012438
      },
      "probabilities": {
        "exploit": 0.0256802627493059,
        "depeg": 0.005,
        "oracle": 0.007,
        "illiquid": 0.06671009144550571,
        "counterparty": 0.005
      },
      "severities": {
        "exploit": 0.85,
        "depeg": 0.2,
        "oracle": 0.4,
        "illiquid": 0.05,
        "counterparty": 0.5
      },
      "expectedLoss": 0.0314637279091853,
      "raapy": 0.4772734720908147,
      "confidence": 0.33112648992469534,
      "score": 0.15803788954760353,
      "eligibleTranches": [],
      "primaryTranche": null,
      "rejectionReasons": [
        {
          "tranche": "senior",
          "reasons": [
            "expectedLoss 0.0315 > 0.02",
            "tvlUsd 2133 < 25000000",
            "apy 50.87% > 8% (too-good-to-be-true gate)"
          ]
        },
        {
          "tranche": "mezzanine",
          "reasons": [
            "tvlUsd 2133 < 1000000",
            "apy 50.87% > 20% (too-good-to-be-true gate)"
          ]
        },
        {
          "tranche": "junior",
          "reasons": [
            "tvlUsd 2133 < 100000"
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
      "lastUpdatedMs": 1779267875033,
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
      "confidence": 0.6953419009247477,
      "score": -0.02190179746655748,
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
      "apy": 3.9549113,
      "apyReward": 0.35744529999999997,
      "apyType": "variable",
      "tvlUsd": 857,
      "lastUpdatedMs": 1779267875033,
      "raw": {
        "chain": "Mantle",
        "project": "lendle-pooled-markets",
        "symbol": "AUSD",
        "underlyingTokens": [
          "0x00000000eFE302BEAA2b3e6e1b18d08D69a9012a"
        ],
        "apy": 431.23565,
        "apyBase": 395.49113,
        "apyReward": 35.74453,
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
        "apyVolatility": 1.0980521642404941,
        "apyDrift": 5.842848622138062
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
      "raapy": 3.922252659411822,
      "confidence": 0.34089134171201607,
      "score": 1.337061971600419,
      "eligibleTranches": [],
      "primaryTranche": null,
      "rejectionReasons": [
        {
          "tranche": "senior",
          "reasons": [
            "expectedLoss 0.0327 > 0.02",
            "tvlUsd 857 < 25000000",
            "apy 395.49% > 8% (too-good-to-be-true gate)"
          ]
        },
        {
          "tranche": "mezzanine",
          "reasons": [
            "tvlUsd 857 < 1000000",
            "apy 395.49% > 20% (too-good-to-be-true gate)"
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
      "lastUpdatedMs": 1779267875033,
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
        "depegEvents": [
          {
            "startMs": 1747817940000,
            "endMs": null,
            "maxDeviation": 0.1339720625363896,
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
        "exploit": 0.026906727342494132,
        "depeg": 0.00036704674667504,
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
      "expectedLoss": 0.031786691681685,
      "raapy": -0.020077891681685,
      "confidence": 0.4767864632140619,
      "score": -0.009572866963705625,
      "eligibleTranches": [],
      "primaryTranche": null,
      "rejectionReasons": [
        {
          "tranche": "senior",
          "reasons": [
            "expectedLoss 0.0318 > 0.02",
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
      "lastUpdatedMs": 1779267875033,
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
      "confidence": 0.4729984245717826,
      "score": -0.036842703121516,
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
      "apyReward": 0.07621649999999999,
      "apyType": "variable",
      "tvlUsd": 26,
      "lastUpdatedMs": 1779267875033,
      "raw": {
        "chain": "Mantle",
        "project": "lendle-pooled-markets",
        "symbol": "SUSDE",
        "underlyingTokens": [
          "0x211Cc4DD073734dA055fbF44a2b4667d5E5fE5d2"
        ],
        "apy": 7.62165,
        "apyBase": 0,
        "apyReward": 7.62165,
        "tvlUsd": 26,
        "pool": "c91016e0-d075-4bb4-a1c7-465f1c11dc14"
      },
      "risk": {
        "contractAgeDays": 365,
        "auditFactor": 0.6,
        "tvlFactor": null,
        "depegEvents": [
          {
            "startMs": 1747818005000,
            "endMs": null,
            "maxDeviation": 0.23124706421212782,
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
        "depeg": 0.0006335536005811721,
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
      "expectedLoss": 0.036365756408842764,
      "raapy": -0.036365756408842764,
      "confidence": 0.6852842175753701,
      "score": -0.024920878927170313,
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
      "id": "aave:125974d5-ad17-4a3a-b967-ebbf721fca22",
      "source": "aave",
      "asset": "0xfc421ad3c883bf9e7c4f42de845c4e4405799e73",
      "apy": 0.0146153,
      "apyReward": 0.0409607,
      "apyType": "variable",
      "tvlUsd": 0,
      "lastUpdatedMs": 1779267875033,
      "raw": {
        "chain": "Mantle",
        "project": "aave-v3",
        "symbol": "GHO",
        "underlyingTokens": [
          "0xfc421aD3C883Bf9E7C4f42dE845C4e4405799e73"
        ],
        "apy": 5.5576,
        "apyBase": 1.46153,
        "apyReward": 4.09607,
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
      "confidence": 0.4875463637796288,
      "score": 0.0014463493442386478,
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
      "apy": 0.7039915999999999,
      "apyReward": 0.0121314,
      "apyType": "variable",
      "tvlUsd": 0,
      "lastUpdatedMs": 1779267875033,
      "raw": {
        "chain": "Mantle",
        "project": "lendle-pooled-markets",
        "symbol": "USDC",
        "underlyingTokens": [
          "0x09Bc4E0D864854c6aFB6eB9A9cdF58aC190D0dF9"
        ],
        "apy": 71.6123,
        "apyBase": 70.39916,
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
        "apyVolatility": 0.29694236542777813,
        "apyDrift": 7.255729208961306
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
      "raapy": 0.6624830423020139,
      "confidence": 0.33162244695321325,
      "score": 0.21969424755320294,
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
    },
    {
      "id": "fbtc:8ddf841e-5849-4bca-b291-374b600be6e4",
      "source": "fbtc",
      "asset": "0x201eba5cc46d216ce6dc03f6a759e8e766e956ae",
      "apy": 0.1,
      "apyReward": 0,
      "apyType": "variable",
      "tvlUsd": 0,
      "lastUpdatedMs": 1779267875033,
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
      "confidence": 0.4826514536446762,
      "score": 0.007621762582213082,
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
      "lastUpdatedMs": 1779267875033,
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
      "confidence": 0.4834581549803941,
      "score": 0.006425856172360043,
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
      "lastUpdatedMs": 1779267875033,
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
      "confidence": 0.4826289304357184,
      "score": 0.04381857669093724,
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
      "lastUpdatedMs": 1779267875033,
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
      "confidence": 0.48342753693349366,
      "score": 0.00763401805669,
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
      "lastUpdatedMs": 1779267875033,
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
      "confidence": 0.4826289304357184,
      "score": 0.02210027482132992,
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
      "lastUpdatedMs": 1779267875033,
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
      "confidence": 0.4826498448091788,
      "score": 0.031754229416839086,
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
      "lastUpdatedMs": 1779267875033,
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
      "confidence": 0.48301035793478736,
      "score": 0.007627430198602318,
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
      "lastUpdatedMs": 1779267875033,
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
      "confidence": 0.6751851852133348,
      "score": 0.03091770345187105,
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
    }
  ],
  "perTranche": {
    "senior": [
      "ondo:b5d7a190-38d2-4fdd-8c14-1fd00c11bce1"
    ],
    "mezzanine": [
      "agni:35f2103d-231b-443b-952e-d2cd118d8f29",
      "aave:47da0cdd-7b1d-4927-9545-20b53b73afa8",
      "ondo:b5d7a190-38d2-4fdd-8c14-1fd00c11bce1",
      "aave:32cb38a5-b9b9-441a-bf07-8fab47b999d3"
    ],
    "junior": [
      "agni:35f2103d-231b-443b-952e-d2cd118d8f29",
      "agni:85407ecd-f711-4fa6-9328-3078aebfaa95",
      "aave:47da0cdd-7b1d-4927-9545-20b53b73afa8",
      "ondo:b5d7a190-38d2-4fdd-8c14-1fd00c11bce1",
      "aave:32cb38a5-b9b9-441a-bf07-8fab47b999d3",
      "agni:6d76a4e2-57f2-4190-a882-bd69f6ea32fb",
      "aave:76b70b33-d8a4-4e61-8092-9bd1f2be2fc9",
      "agni:649bee89-0a34-4eb1-b8ab-7c5fdee07ccd",
      "aave:a4e37545-203b-4412-9acd-3e8b1aa4d744",
      "agni:a7e2f58e-1c93-4592-acd6-8e40e6cb26ff",
      "agni:3b6b75cf-adb5-4fb4-bbcd-8f75c6879c9d",
      "agni:2a510869-6356-4486-8bb5-d5a808634496",
      "agni:30836422-c578-4f77-8f81-861c509c5d4c",
      "agni:b8d50460-5237-4601-9250-4f2d3a6b569b",
      "agni:ebec73de-fd1e-4f97-8287-d9cb01c7d352",
      "agni:3d429d4e-b3a6-4847-957b-b10bf26a6f01",
      "agni:a4ff3d7c-a117-4b24-a9f9-6af46cd276c0",
      "agni:913ce101-55b1-4230-93c7-d523f0d9ca03",
      "agni:227e8492-33e9-4953-8beb-28973c9fdb8a",
      "agni:2364dd66-69d3-44ef-9e85-4d5217a57b57",
      "agni:b5933580-18c1-43b6-aec3-2563cd30e3a2",
      "mantleVault:c87c5d7c-0285-47a9-8539-d335f05b9ba2",
      "mantleVault:b96d8236-36d4-4be4-92f7-422beeac7073"
    ]
  },
  "signature": "0xb29d280b46163c7d2dfdb3ed519978f6fdb93f83b96e6067b405e10f7bb8ff6e3332aa97d3771c684d31d8f7d40a159c1262e59debe7d5be48b112e5499bfcad1c"
}
```
