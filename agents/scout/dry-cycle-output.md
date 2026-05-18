# Scout dry-cycle inspection

Generated: 2026-05-18T18:01:45.585Z
Ephemeral signer: `0xEcDd83eDF6C5DC8402c0CbF822542dA28370F1F4`
Map hash: `0x74d73542021501a983d74b2cb9583531249c065513b0a557e92ec20370982ec6`

This file is produced by `scripts/inspect-cycle.ts`. The pipeline runs end to end, fetching real data from DefiLlama (yields + price history). Nansen and Lighthouse are skipped; the signature is over an ephemeral keypair generated at run time.

## Summary

- Opportunities ingested: **48**
- Opportunities scored: **48**
- Senior-eligible: **2**
- Mezzanine-eligible: **5**
- Junior-eligible: **23**

## Per-tranche rankings

### Senior (2)

| Rank | Source | Pool id | APY | RAAPY | Score | TVL |
|---|---|---|---|---|---|---|
| 1 | aave | `aave:a4e37545-203b-4412-9acd-3e8b1aa4d744` | 4.00% | 3.47% | 0.0217 | $64,261,826 |
| 2 | ondo | `ondo:b5d7a190-38d2-4fdd-8c14-1fd00c11bce1` | 3.55% | 1.76% | 0.0110 | $29,438,688 |

### Mezzanine (5)

| Rank | Source | Pool id | APY | RAAPY | Score | TVL |
|---|---|---|---|---|---|---|
| 1 | aave | `aave:32cb38a5-b9b9-441a-bf07-8fab47b999d3` | 5.76% | 5.06% | 0.0316 | $5,505,919 |
| 2 | aave | `aave:47da0cdd-7b1d-4927-9545-20b53b73afa8` | 5.38% | 4.73% | 0.0296 | $24,552,530 |
| 3 | aave | `aave:a4e37545-203b-4412-9acd-3e8b1aa4d744` | 4.00% | 3.47% | 0.0217 | $64,261,826 |
| 4 | aave | `aave:76b70b33-d8a4-4e61-8092-9bd1f2be2fc9` | 4.04% | 3.36% | 0.0210 | $9,772,423 |
| 5 | ondo | `ondo:b5d7a190-38d2-4fdd-8c14-1fd00c11bce1` | 3.55% | 1.76% | 0.0110 | $29,438,688 |

### Junior (23)

| Rank | Source | Pool id | APY | RAAPY | Score | TVL |
|---|---|---|---|---|---|---|
| 1 | agni | `agni:35f2103d-231b-443b-952e-d2cd118d8f29` | 43.31% | 41.91% | 0.2619 | $1,002,542 |
| 2 | agni | `agni:85407ecd-f711-4fa6-9328-3078aebfaa95` | 10.72% | 9.32% | 0.0582 | $971,781 |
| 3 | agni | `agni:6d76a4e2-57f2-4190-a882-bd69f6ea32fb` | 6.94% | 5.48% | 0.0343 | $437,653 |
| 4 | aave | `aave:32cb38a5-b9b9-441a-bf07-8fab47b999d3` | 5.76% | 5.06% | 0.0316 | $5,505,919 |
| 5 | aave | `aave:47da0cdd-7b1d-4927-9545-20b53b73afa8` | 5.38% | 4.73% | 0.0296 | $24,552,530 |
| 6 | aave | `aave:a4e37545-203b-4412-9acd-3e8b1aa4d744` | 4.00% | 3.47% | 0.0217 | $64,261,826 |
| 7 | aave | `aave:76b70b33-d8a4-4e61-8092-9bd1f2be2fc9` | 4.04% | 3.36% | 0.0210 | $9,772,423 |
| 8 | agni | `agni:ebec73de-fd1e-4f97-8287-d9cb01c7d352` | 4.06% | 2.52% | 0.0158 | $110,338 |
| 9 | ondo | `ondo:b5d7a190-38d2-4fdd-8c14-1fd00c11bce1` | 3.55% | 1.76% | 0.0110 | $29,438,688 |
| 10 | agni | `agni:2a510869-6356-4486-8bb5-d5a808634496` | 2.75% | 1.21% | 0.0075 | $111,933 |
| 11 | agni | `agni:a7e2f58e-1c93-4592-acd6-8e40e6cb26ff` | 2.61% | 1.07% | 0.0067 | $105,728 |
| 12 | agni | `agni:a4ff3d7c-a117-4b24-a9f9-6af46cd276c0` | 2.41% | 0.87% | 0.0054 | $106,833 |
| 13 | agni | `agni:649bee89-0a34-4eb1-b8ab-7c5fdee07ccd` | 1.89% | 0.36% | 0.0022 | $129,854 |
| 14 | agni | `agni:227e8492-33e9-4953-8beb-28973c9fdb8a` | 1.32% | -0.22% | -0.0014 | $118,242 |
| 15 | agni | `agni:30836422-c578-4f77-8f81-861c509c5d4c` | 1.06% | -0.48% | -0.0030 | $103,889 |
| 16 | agni | `agni:2364dd66-69d3-44ef-9e85-4d5217a57b57` | 0.58% | -0.96% | -0.0060 | $109,127 |
| 17 | agni | `agni:3b6b75cf-adb5-4fb4-bbcd-8f75c6879c9d` | 0.48% | -1.06% | -0.0066 | $108,809 |
| 18 | agni | `agni:b8d50460-5237-4601-9250-4f2d3a6b569b` | 0.27% | -1.28% | -0.0080 | $103,942 |
| 19 | agni | `agni:b5933580-18c1-43b6-aec3-2563cd30e3a2` | 0.25% | -1.29% | -0.0081 | $104,209 |
| 20 | agni | `agni:913ce101-55b1-4230-93c7-d523f0d9ca03` | 0.07% | -1.47% | -0.0092 | $106,877 |
| 21 | agni | `agni:3d429d4e-b3a6-4847-957b-b10bf26a6f01` | 0.05% | -1.49% | -0.0093 | $108,309 |
| 22 | mantleVault | `mantleVault:c87c5d7c-0285-47a9-8539-d335f05b9ba2` | 0.34% | -2.17% | -0.0136 | $268,015 |
| 23 | mantleVault | `mantleVault:b96d8236-36d4-4be4-92f7-422beeac7073` | 0.05% | -2.51% | -0.0157 | $190,221 |

## All scored opportunities

### aave:a4e37545-203b-4412-9acd-3e8b1aa4d744

- **Source**: aave
- **Asset**: `0x211cc4dd073734da055fbf44a2b4667d5e5fe5d2`
- **APY**: 4.00%
- **TVL**: $64,261,826
- **Probabilities**: exploit=0.00097, depeg=0.00063, oracle=0.00200, illiquid=0.02192, counterparty=0.00500
- **Expected loss**: 0.534% /yr
- **RAAPY**: 3.47%
- **Confidence**: 0.625
- **Score**: 0.0217
- **Eligible tranches**: senior, mezzanine, junior
- **Primary tranche**: senior

### ondo:b5d7a190-38d2-4fdd-8c14-1fd00c11bce1

- **Source**: ondo
- **Asset**: `0x5be26527e817998a7206475496fde1e68957c5a6`
- **APY**: 3.55%
- **TVL**: $29,438,688
- **Probabilities**: exploit=0.00088, depeg=0.00042, oracle=0.00200, illiquid=0.02531, counterparty=0.03000
- **Expected loss**: 1.790% /yr
- **RAAPY**: 1.76%
- **Confidence**: 0.625
- **Score**: 0.0110
- **Eligible tranches**: senior, mezzanine, junior
- **Primary tranche**: senior

### aave:47da0cdd-7b1d-4927-9545-20b53b73afa8

- **Source**: aave
- **Asset**: `0x779ded0c9e1022225f8e0630b35a9b54be713736`
- **APY**: 5.38%
- **TVL**: $24,552,530
- **Probabilities**: exploit=0.00106, depeg=0.00500, oracle=0.00200, illiquid=0.02610, counterparty=0.00500
- **Expected loss**: 0.651% /yr
- **RAAPY**: 4.73%
- **Confidence**: 0.625
- **Score**: 0.0296
- **Eligible tranches**: mezzanine, junior
- **Primary tranche**: mezzanine
- **Rejection reasons**:
  - senior: tvlUsd 24552530 < 25000000

### aave:76b70b33-d8a4-4e61-8092-9bd1f2be2fc9

- **Source**: aave
- **Asset**: `0x5d3a1ff2b6bab83b63cd9ad0787074081a52ef34`
- **APY**: 4.04%
- **TVL**: $9,772,423
- **Probabilities**: exploit=0.00115, depeg=0.00500, oracle=0.00200, illiquid=0.03010, counterparty=0.00500
- **Expected loss**: 0.679% /yr
- **RAAPY**: 3.36%
- **Confidence**: 0.625
- **Score**: 0.0210
- **Eligible tranches**: mezzanine, junior
- **Primary tranche**: mezzanine
- **Rejection reasons**:
  - senior: tvlUsd 9772423 < 25000000

### aave:32cb38a5-b9b9-441a-bf07-8fab47b999d3

- **Source**: aave
- **Asset**: `0x09bc4e0d864854c6afb6eb9a9cdf58ac190d0df9`
- **APY**: 5.76%
- **TVL**: $5,505,919
- **Probabilities**: exploit=0.00121, depeg=0.00500, oracle=0.00200, illiquid=0.03259, counterparty=0.00500
- **Expected loss**: 0.696% /yr
- **RAAPY**: 5.06%
- **Confidence**: 0.625
- **Score**: 0.0316
- **Eligible tranches**: mezzanine, junior
- **Primary tranche**: mezzanine
- **Rejection reasons**:
  - senior: tvlUsd 5505919 < 25000000

### agni:35f2103d-231b-443b-952e-d2cd118d8f29

- **Source**: agni
- **Asset**: `0x779ded0c9e1022225f8e0630b35a9b54be713736`
- **APY**: 43.31%
- **TVL**: $1,002,542
- **Probabilities**: exploit=0.00672, depeg=0.00500, oracle=0.00700, illiquid=0.03999, counterparty=0.00500
- **Expected loss**: 1.401% /yr
- **RAAPY**: 41.91%
- **Confidence**: 0.625
- **Score**: 0.2619
- **Eligible tranches**: junior
- **Primary tranche**: junior
- **Rejection reasons**:
  - senior: tvlUsd 1002542 < 25000000; apy 43.31% > 8% (too-good-to-be-true gate)
  - mezzanine: apy 43.31% > 20% (too-good-to-be-true gate)

### agni:85407ecd-f711-4fa6-9328-3078aebfaa95

- **Source**: agni
- **Asset**: `0x55b9f84605b30df9bb9d817a6900219f25218157`
- **APY**: 10.72%
- **TVL**: $971,781
- **Probabilities**: exploit=0.00674, depeg=0.00500, oracle=0.00700, illiquid=0.04012, counterparty=0.00500
- **Expected loss**: 1.403% /yr
- **RAAPY**: 9.32%
- **Confidence**: 0.625
- **Score**: 0.0582
- **Eligible tranches**: junior
- **Primary tranche**: junior
- **Rejection reasons**:
  - senior: tvlUsd 971781 < 25000000; apy 10.72% > 8% (too-good-to-be-true gate)
  - mezzanine: tvlUsd 971781 < 1000000

### agni:6d76a4e2-57f2-4190-a882-bd69f6ea32fb

- **Source**: agni
- **Asset**: `0x45db70e1c808dae42f9c4dfea74ba5e6a113bdc1`
- **APY**: 6.94%
- **TVL**: $437,653
- **Probabilities**: exploit=0.00712, depeg=0.00500, oracle=0.00700, illiquid=0.04359, counterparty=0.00500
- **Expected loss**: 1.453% /yr
- **RAAPY**: 5.48%
- **Confidence**: 0.625
- **Score**: 0.0343
- **Eligible tranches**: junior
- **Primary tranche**: junior
- **Rejection reasons**:
  - senior: tvlUsd 437653 < 25000000
  - mezzanine: tvlUsd 437653 < 1000000

### mantleVault:c87c5d7c-0285-47a9-8539-d335f05b9ba2

- **Source**: mantleVault
- **Asset**: `0xcda86a272531e8640cd7f1a92c01839911b90bb0`
- **APY**: 0.34%
- **TVL**: $268,015
- **Probabilities**: exploit=0.01946, depeg=0.00500, oracle=0.00700, illiquid=0.04572, counterparty=0.00500
- **Expected loss**: 2.513% /yr
- **RAAPY**: -2.17%
- **Confidence**: 0.625
- **Score**: -0.0136
- **Eligible tranches**: junior
- **Primary tranche**: junior
- **Rejection reasons**:
  - senior: expectedLoss 0.0251 > 0.02; tvlUsd 268015 < 25000000
  - mezzanine: tvlUsd 268015 < 1000000

### mantleVault:b96d8236-36d4-4be4-92f7-422beeac7073

- **Source**: mantleVault
- **Asset**: `0xe6829d9a7ee3040e1276fa75293bde931859e8fa`
- **APY**: 0.05%
- **TVL**: $190,221
- **Probabilities**: exploit=0.01990, depeg=0.00500, oracle=0.00700, illiquid=0.04721, counterparty=0.00500
- **Expected loss**: 2.558% /yr
- **RAAPY**: -2.51%
- **Confidence**: 0.625
- **Score**: -0.0157
- **Eligible tranches**: junior
- **Primary tranche**: junior
- **Rejection reasons**:
  - senior: expectedLoss 0.0256 > 0.02; tvlUsd 190221 < 25000000
  - mezzanine: tvlUsd 190221 < 1000000

### agni:649bee89-0a34-4eb1-b8ab-7c5fdee07ccd

- **Source**: agni
- **Asset**: `0x29cc30f9d113b356ce408667aa6433589cecbdca`
- **APY**: 1.89%
- **TVL**: $129,854
- **Probabilities**: exploit=0.00771, depeg=0.00500, oracle=0.00700, illiquid=0.04887, counterparty=0.00500
- **Expected loss**: 1.530% /yr
- **RAAPY**: 0.36%
- **Confidence**: 0.625
- **Score**: 0.0022
- **Eligible tranches**: junior
- **Primary tranche**: junior
- **Rejection reasons**:
  - senior: tvlUsd 129854 < 25000000
  - mezzanine: tvlUsd 129854 < 1000000

### agni:227e8492-33e9-4953-8beb-28973c9fdb8a

- **Source**: agni
- **Asset**: `0x09bc4e0d864854c6afb6eb9a9cdf58ac190d0df9`
- **APY**: 1.32%
- **TVL**: $118,242
- **Probabilities**: exploit=0.00776, depeg=0.00500, oracle=0.00700, illiquid=0.04927, counterparty=0.00500
- **Expected loss**: 1.536% /yr
- **RAAPY**: -0.22%
- **Confidence**: 0.625
- **Score**: -0.0014
- **Eligible tranches**: junior
- **Primary tranche**: junior
- **Rejection reasons**:
  - senior: tvlUsd 118242 < 25000000
  - mezzanine: tvlUsd 118242 < 1000000

### agni:2a510869-6356-4486-8bb5-d5a808634496

- **Source**: agni
- **Asset**: `0x09bc4e0d864854c6afb6eb9a9cdf58ac190d0df9`
- **APY**: 2.75%
- **TVL**: $111,933
- **Probabilities**: exploit=0.00779, depeg=0.00500, oracle=0.00700, illiquid=0.04951, counterparty=0.00500
- **Expected loss**: 1.539% /yr
- **RAAPY**: 1.21%
- **Confidence**: 0.625
- **Score**: 0.0075
- **Eligible tranches**: junior
- **Primary tranche**: junior
- **Rejection reasons**:
  - senior: tvlUsd 111933 < 25000000
  - mezzanine: tvlUsd 111933 < 1000000

### agni:ebec73de-fd1e-4f97-8287-d9cb01c7d352

- **Source**: agni
- **Asset**: `0x09bc4e0d864854c6afb6eb9a9cdf58ac190d0df9`
- **APY**: 4.06%
- **TVL**: $110,338
- **Probabilities**: exploit=0.00779, depeg=0.00500, oracle=0.00700, illiquid=0.04957, counterparty=0.00500
- **Expected loss**: 1.540% /yr
- **RAAPY**: 2.52%
- **Confidence**: 0.625
- **Score**: 0.0158
- **Eligible tranches**: junior
- **Primary tranche**: junior
- **Rejection reasons**:
  - senior: tvlUsd 110338 < 25000000
  - mezzanine: tvlUsd 110338 < 1000000

### agni:2364dd66-69d3-44ef-9e85-4d5217a57b57

- **Source**: agni
- **Asset**: `0x09bc4e0d864854c6afb6eb9a9cdf58ac190d0df9`
- **APY**: 0.58%
- **TVL**: $109,127
- **Probabilities**: exploit=0.00780, depeg=0.00500, oracle=0.00700, illiquid=0.04962, counterparty=0.00500
- **Expected loss**: 1.541% /yr
- **RAAPY**: -0.96%
- **Confidence**: 0.625
- **Score**: -0.0060
- **Eligible tranches**: junior
- **Primary tranche**: junior
- **Rejection reasons**:
  - senior: tvlUsd 109127 < 25000000
  - mezzanine: tvlUsd 109127 < 1000000

### agni:3b6b75cf-adb5-4fb4-bbcd-8f75c6879c9d

- **Source**: agni
- **Asset**: `0x09bc4e0d864854c6afb6eb9a9cdf58ac190d0df9`
- **APY**: 0.48%
- **TVL**: $108,809
- **Probabilities**: exploit=0.00780, depeg=0.00500, oracle=0.00700, illiquid=0.04963, counterparty=0.00500
- **Expected loss**: 1.541% /yr
- **RAAPY**: -1.06%
- **Confidence**: 0.625
- **Score**: -0.0066
- **Eligible tranches**: junior
- **Primary tranche**: junior
- **Rejection reasons**:
  - senior: tvlUsd 108809 < 25000000
  - mezzanine: tvlUsd 108809 < 1000000

### agni:3d429d4e-b3a6-4847-957b-b10bf26a6f01

- **Source**: agni
- **Asset**: `0x779ded0c9e1022225f8e0630b35a9b54be713736`
- **APY**: 0.05%
- **TVL**: $108,309
- **Probabilities**: exploit=0.00780, depeg=0.00500, oracle=0.00700, illiquid=0.04965, counterparty=0.00500
- **Expected loss**: 1.541% /yr
- **RAAPY**: -1.49%
- **Confidence**: 0.625
- **Score**: -0.0093
- **Eligible tranches**: junior
- **Primary tranche**: junior
- **Rejection reasons**:
  - senior: tvlUsd 108309 < 25000000
  - mezzanine: tvlUsd 108309 < 1000000

### agni:913ce101-55b1-4230-93c7-d523f0d9ca03

- **Source**: agni
- **Asset**: `0x09bc4e0d864854c6afb6eb9a9cdf58ac190d0df9`
- **APY**: 0.07%
- **TVL**: $106,877
- **Probabilities**: exploit=0.00781, depeg=0.00500, oracle=0.00700, illiquid=0.04971, counterparty=0.00500
- **Expected loss**: 1.542% /yr
- **RAAPY**: -1.47%
- **Confidence**: 0.625
- **Score**: -0.0092
- **Eligible tranches**: junior
- **Primary tranche**: junior
- **Rejection reasons**:
  - senior: tvlUsd 106877 < 25000000
  - mezzanine: tvlUsd 106877 < 1000000

### agni:a4ff3d7c-a117-4b24-a9f9-6af46cd276c0

- **Source**: agni
- **Asset**: `0x09bc4e0d864854c6afb6eb9a9cdf58ac190d0df9`
- **APY**: 2.41%
- **TVL**: $106,833
- **Probabilities**: exploit=0.00781, depeg=0.00500, oracle=0.00700, illiquid=0.04971, counterparty=0.00500
- **Expected loss**: 1.542% /yr
- **RAAPY**: 0.87%
- **Confidence**: 0.625
- **Score**: 0.0054
- **Eligible tranches**: junior
- **Primary tranche**: junior
- **Rejection reasons**:
  - senior: tvlUsd 106833 < 25000000
  - mezzanine: tvlUsd 106833 < 1000000

### agni:a7e2f58e-1c93-4592-acd6-8e40e6cb26ff

- **Source**: agni
- **Asset**: `0x09bc4e0d864854c6afb6eb9a9cdf58ac190d0df9`
- **APY**: 2.61%
- **TVL**: $105,728
- **Probabilities**: exploit=0.00781, depeg=0.00500, oracle=0.00700, illiquid=0.04976, counterparty=0.00500
- **Expected loss**: 1.543% /yr
- **RAAPY**: 1.07%
- **Confidence**: 0.625
- **Score**: 0.0067
- **Eligible tranches**: junior
- **Primary tranche**: junior
- **Rejection reasons**:
  - senior: tvlUsd 105728 < 25000000
  - mezzanine: tvlUsd 105728 < 1000000

### agni:b5933580-18c1-43b6-aec3-2563cd30e3a2

- **Source**: agni
- **Asset**: `0x779ded0c9e1022225f8e0630b35a9b54be713736`
- **APY**: 0.25%
- **TVL**: $104,209
- **Probabilities**: exploit=0.00782, depeg=0.00500, oracle=0.00700, illiquid=0.04982, counterparty=0.00500
- **Expected loss**: 1.544% /yr
- **RAAPY**: -1.29%
- **Confidence**: 0.625
- **Score**: -0.0081
- **Eligible tranches**: junior
- **Primary tranche**: junior
- **Rejection reasons**:
  - senior: tvlUsd 104209 < 25000000
  - mezzanine: tvlUsd 104209 < 1000000

### agni:b8d50460-5237-4601-9250-4f2d3a6b569b

- **Source**: agni
- **Asset**: `0x09bc4e0d864854c6afb6eb9a9cdf58ac190d0df9`
- **APY**: 0.27%
- **TVL**: $103,942
- **Probabilities**: exploit=0.00782, depeg=0.00500, oracle=0.00700, illiquid=0.04983, counterparty=0.00500
- **Expected loss**: 1.544% /yr
- **RAAPY**: -1.28%
- **Confidence**: 0.625
- **Score**: -0.0080
- **Eligible tranches**: junior
- **Primary tranche**: junior
- **Rejection reasons**:
  - senior: tvlUsd 103942 < 25000000
  - mezzanine: tvlUsd 103942 < 1000000

### agni:30836422-c578-4f77-8f81-861c509c5d4c

- **Source**: agni
- **Asset**: `0x09bc4e0d864854c6afb6eb9a9cdf58ac190d0df9`
- **APY**: 1.06%
- **TVL**: $103,889
- **Probabilities**: exploit=0.00782, depeg=0.00500, oracle=0.00700, illiquid=0.04983, counterparty=0.00500
- **Expected loss**: 1.544% /yr
- **RAAPY**: -0.48%
- **Confidence**: 0.625
- **Score**: -0.0030
- **Eligible tranches**: junior
- **Primary tranche**: junior
- **Rejection reasons**:
  - senior: tvlUsd 103889 < 25000000
  - mezzanine: tvlUsd 103889 < 1000000

### mantleVault:3f5789dd-68ed-44c7-9388-b553df96502d

- **Source**: mantleVault
- **Asset**: `0x78c1b0c915c4faa5fffa6cabf0219da63d7f4cb8`
- **APY**: 0.43%
- **TVL**: $71,999
- **Probabilities**: exploit=0.02115, depeg=0.00500, oracle=0.00700, illiquid=0.05143, counterparty=0.00500
- **Expected loss**: 2.685% /yr
- **RAAPY**: -2.25%
- **Confidence**: 0.625
- **Score**: -0.0141
- **Eligible tranches**: _none_
- **Primary tranche**: _none_
- **Rejection reasons**:
  - senior: expectedLoss 0.0269 > 0.02; tvlUsd 71999 < 25000000
  - mezzanine: tvlUsd 71999 < 1000000
  - junior: tvlUsd 71999 < 100000

### cian:009b6f09-bfa7-4852-8685-0980d9478419

- **Source**: cian
- **Asset**: `0xcda86a272531e8640cd7f1a92c01839911b90bb0`
- **APY**: 2.76%
- **TVL**: $50,855
- **Probabilities**: exploit=0.03100, depeg=0.00500, oracle=0.02000, illiquid=0.05294, counterparty=0.00500
- **Expected loss**: 4.049% /yr
- **RAAPY**: -1.29%
- **Confidence**: 0.625
- **Score**: -0.0081
- **Eligible tranches**: _none_
- **Primary tranche**: _none_
- **Rejection reasons**:
  - senior: expectedLoss 0.0405 > 0.02; tvlUsd 50855 < 25000000
  - mezzanine: expectedLoss 0.0405 > 0.04; tvlUsd 50855 < 1000000
  - junior: tvlUsd 50855 < 100000

### agni:ab6d4bd4-fa82-4f09-9588-98c953179d61

- **Source**: agni
- **Asset**: `0x29cc30f9d113b356ce408667aa6433589cecbdca`
- **APY**: 1.15%
- **TVL**: $47,239
- **Probabilities**: exploit=0.00821, depeg=0.00500, oracle=0.00700, illiquid=0.05326, counterparty=0.00500
- **Expected loss**: 1.594% /yr
- **RAAPY**: -0.45%
- **Confidence**: 0.625
- **Score**: -0.0028
- **Eligible tranches**: _none_
- **Primary tranche**: _none_
- **Rejection reasons**:
  - senior: tvlUsd 47239 < 25000000
  - mezzanine: tvlUsd 47239 < 1000000
  - junior: tvlUsd 47239 < 100000

### agni:6a134700-f4a3-49ad-ad5a-fe1868b1c744

- **Source**: agni
- **Asset**: `0x111111d2bf19e43c34263401e0cad979ed1cdb61`
- **APY**: 0.08%
- **TVL**: $44,572
- **Probabilities**: exploit=0.00823, depeg=0.00500, oracle=0.00700, illiquid=0.05351, counterparty=0.00500
- **Expected loss**: 1.597% /yr
- **RAAPY**: -1.52%
- **Confidence**: 0.625
- **Score**: -0.0095
- **Eligible tranches**: _none_
- **Primary tranche**: _none_
- **Rejection reasons**:
  - senior: tvlUsd 44572 < 25000000
  - mezzanine: tvlUsd 44572 < 1000000
  - junior: tvlUsd 44572 < 100000

### mantleVault:4ecffa03-92a0-4eed-bb8b-7537ade00cae

- **Source**: mantleVault
- **Asset**: `0xcda86a272531e8640cd7f1a92c01839911b90bb0`
- **APY**: 0.00%
- **TVL**: $33,505
- **Probabilities**: exploit=0.02214, depeg=0.00500, oracle=0.00700, illiquid=0.05475, counterparty=0.00500
- **Expected loss**: 2.785% /yr
- **RAAPY**: -2.78%
- **Confidence**: 0.625
- **Score**: -0.0174
- **Eligible tranches**: _none_
- **Primary tranche**: _none_
- **Rejection reasons**:
  - senior: expectedLoss 0.0279 > 0.02; tvlUsd 33505 < 25000000
  - mezzanine: tvlUsd 33505 < 1000000
  - junior: tvlUsd 33505 < 100000

### mantleVault:dc732e3d-d65b-4087-8d48-53e50bb47732

- **Source**: mantleVault
- **Asset**: `0xc96de26018a54d51c097160568752c4e3bd6c364`
- **APY**: 1.64%
- **TVL**: $28,262
- **Probabilities**: exploit=0.02236, depeg=0.00500, oracle=0.00700, illiquid=0.05549, counterparty=0.00500
- **Expected loss**: 2.808% /yr
- **RAAPY**: -1.17%
- **Confidence**: 0.625
- **Score**: -0.0073
- **Eligible tranches**: _none_
- **Primary tranche**: _none_
- **Rejection reasons**:
  - senior: expectedLoss 0.0281 > 0.02; tvlUsd 28262 < 25000000
  - mezzanine: tvlUsd 28262 < 1000000
  - junior: tvlUsd 28262 < 100000

### mantleVault:d6c5fcec-1f1f-40e8-b732-076ece1462fc

- **Source**: mantleVault
- **Asset**: `0x78c1b0c915c4faa5fffa6cabf0219da63d7f4cb8`
- **APY**: 0.00%
- **TVL**: $21,716
- **Probabilities**: exploit=0.02270, depeg=0.00500, oracle=0.00700, illiquid=0.05663, counterparty=0.00500
- **Expected loss**: 2.842% /yr
- **RAAPY**: -2.84%
- **Confidence**: 0.625
- **Score**: -0.0178
- **Eligible tranches**: _none_
- **Primary tranche**: _none_
- **Rejection reasons**:
  - senior: expectedLoss 0.0284 > 0.02; tvlUsd 21716 < 25000000
  - mezzanine: tvlUsd 21716 < 1000000
  - junior: tvlUsd 21716 < 100000

### cian:6eec4d69-bcad-48b9-aa3a-31005778de19

- **Source**: cian
- **Asset**: `0xcda86a272531e8640cd7f1a92c01839911b90bb0`
- **APY**: 0.44%
- **TVL**: $17,235
- **Probabilities**: exploit=0.03299, depeg=0.00500, oracle=0.02000, illiquid=0.05764, counterparty=0.00500
- **Expected loss**: 4.243% /yr
- **RAAPY**: -3.80%
- **Confidence**: 0.625
- **Score**: -0.0237
- **Eligible tranches**: _none_
- **Primary tranche**: _none_
- **Rejection reasons**:
  - senior: expectedLoss 0.0424 > 0.02; tvlUsd 17235 < 25000000
  - mezzanine: expectedLoss 0.0424 > 0.04; tvlUsd 17235 < 1000000
  - junior: tvlUsd 17235 < 100000

### fbtc:d8733ab8-a147-4e31-a668-2c9dff24ea56

- **Source**: fbtc
- **Asset**: `0x201eba5cc46d216ce6dc03f6a759e8e766e956ae`
- **APY**: 12.72%
- **TVL**: $14,713
- **Probabilities**: exploit=0.02320, depeg=0.00500, oracle=0.02000, illiquid=0.05832, counterparty=0.08000
- **Expected loss**: 7.163% /yr
- **RAAPY**: 5.56%
- **Confidence**: 0.625
- **Score**: 0.0347
- **Eligible tranches**: _none_
- **Primary tranche**: _none_
- **Rejection reasons**:
  - senior: expectedLoss 0.0716 > 0.02; tvlUsd 14713 < 25000000; apy 12.72% > 8% (too-good-to-be-true gate)
  - mezzanine: expectedLoss 0.0716 > 0.04; tvlUsd 14713 < 1000000
  - junior: tvlUsd 14713 < 100000

### mantleVault:e118b8cb-a7f6-4619-8844-791956db623b

- **Source**: mantleVault
- **Asset**: `0xcda86a272531e8640cd7f1a92c01839911b90bb0`
- **APY**: 0.00%
- **TVL**: $14,497
- **Probabilities**: exploit=0.02322, depeg=0.00500, oracle=0.00700, illiquid=0.05839, counterparty=0.00500
- **Expected loss**: 2.895% /yr
- **RAAPY**: -2.90%
- **Confidence**: 0.625
- **Score**: -0.0181
- **Eligible tranches**: _none_
- **Primary tranche**: _none_
- **Rejection reasons**:
  - senior: expectedLoss 0.0290 > 0.02; tvlUsd 14497 < 25000000
  - mezzanine: tvlUsd 14497 < 1000000
  - junior: tvlUsd 14497 < 100000

### mantleVault:ae619265-65fd-4584-8934-16a66dc50af3

- **Source**: mantleVault
- **Asset**: `0x09bc4e0d864854c6afb6eb9a9cdf58ac190d0df9`
- **APY**: 0.02%
- **TVL**: $10,314
- **Probabilities**: exploit=0.02365, depeg=0.00500, oracle=0.00700, illiquid=0.05987, counterparty=0.00500
- **Expected loss**: 2.940% /yr
- **RAAPY**: -2.92%
- **Confidence**: 0.625
- **Score**: -0.0182
- **Eligible tranches**: _none_
- **Primary tranche**: _none_
- **Rejection reasons**:
  - senior: expectedLoss 0.0294 > 0.02; tvlUsd 10314 < 25000000
  - mezzanine: tvlUsd 10314 < 1000000
  - junior: tvlUsd 10314 < 100000

### mantleVault:edc32e93-0feb-4d38-bb73-366bb4a2aace

- **Source**: mantleVault
- **Asset**: `0xdeaddeaddeaddeaddeaddeaddeaddeaddead1111`
- **APY**: 0.00%
- **TVL**: $10,272
- **Probabilities**: exploit=0.02366, depeg=0.00500, oracle=0.00700, illiquid=0.05988, counterparty=0.00500
- **Expected loss**: 2.940% /yr
- **RAAPY**: -2.94%
- **Confidence**: 0.625
- **Score**: -0.0183
- **Eligible tranches**: _none_
- **Primary tranche**: _none_
- **Rejection reasons**:
  - senior: expectedLoss 0.0294 > 0.02; tvlUsd 10272 < 25000000
  - mezzanine: tvlUsd 10272 < 1000000
  - junior: tvlUsd 10272 < 100000

### mantleVault:3441a15d-5f50-4a52-af27-597c182c5c4a

- **Source**: mantleVault
- **Asset**: `0x201eba5cc46d216ce6dc03f6a759e8e766e956ae`
- **APY**: 0.04%
- **TVL**: $6,326
- **Probabilities**: exploit=0.02428, depeg=0.00500, oracle=0.00700, illiquid=0.06199, counterparty=0.00500
- **Expected loss**: 3.004% /yr
- **RAAPY**: -2.96%
- **Confidence**: 0.625
- **Score**: -0.0185
- **Eligible tranches**: _none_
- **Primary tranche**: _none_
- **Rejection reasons**:
  - senior: expectedLoss 0.0300 > 0.02; tvlUsd 6326 < 25000000
  - mezzanine: tvlUsd 6326 < 1000000
  - junior: tvlUsd 6326 < 100000

### mantleVault:7be673f4-8b41-4d3f-a533-45d20d62e8fa

- **Source**: mantleVault
- **Asset**: `0xcabae6f6ea1ecab08ad02fe02ce9a44f09aebfa2`
- **APY**: 0.73%
- **TVL**: $5,849
- **Probabilities**: exploit=0.02438, depeg=0.00500, oracle=0.00700, illiquid=0.06233, counterparty=0.00500
- **Expected loss**: 3.014% /yr
- **RAAPY**: -2.28%
- **Confidence**: 0.625
- **Score**: -0.0143
- **Eligible tranches**: _none_
- **Primary tranche**: _none_
- **Rejection reasons**:
  - senior: expectedLoss 0.0301 > 0.02; tvlUsd 5849 < 25000000
  - mezzanine: tvlUsd 5849 < 1000000
  - junior: tvlUsd 5849 < 100000

### mantleVault:f7150467-f302-41e8-9f9a-1f73d2b49df4

- **Source**: mantleVault
- **Asset**: `0x5d3a1ff2b6bab83b63cd9ad0787074081a52ef34`
- **APY**: 49.38%
- **TVL**: $3,206
- **Probabilities**: exploit=0.02516, depeg=0.00500, oracle=0.00700, illiquid=0.06494, counterparty=0.00500
- **Expected loss**: 3.093% /yr
- **RAAPY**: 46.28%
- **Confidence**: 0.625
- **Score**: 0.2892
- **Eligible tranches**: _none_
- **Primary tranche**: _none_
- **Rejection reasons**:
  - senior: expectedLoss 0.0309 > 0.02; tvlUsd 3206 < 25000000; apy 49.38% > 8% (too-good-to-be-true gate)
  - mezzanine: tvlUsd 3206 < 1000000; apy 49.38% > 20% (too-good-to-be-true gate)
  - junior: tvlUsd 3206 < 100000

### mantleVault:a5a47cdc-2ca5-4348-ade9-4adddb1d12d5

- **Source**: mantleVault
- **Asset**: `0xe6829d9a7ee3040e1276fa75293bde931859e8fa`
- **APY**: 0.02%
- **TVL**: $2,269
- **Probabilities**: exploit=0.02560, depeg=0.00500, oracle=0.00700, illiquid=0.06644, counterparty=0.00500
- **Expected loss**: 3.138% /yr
- **RAAPY**: -3.12%
- **Confidence**: 0.625
- **Score**: -0.0195
- **Eligible tranches**: _none_
- **Primary tranche**: _none_
- **Rejection reasons**:
  - senior: expectedLoss 0.0314 > 0.02; tvlUsd 2269 < 25000000
  - mezzanine: tvlUsd 2269 < 1000000
  - junior: tvlUsd 2269 < 100000

### mantleVault:dce58852-9976-4141-b26a-a832c5edc34e

- **Source**: mantleVault
- **Asset**: `0x201eba5cc46d216ce6dc03f6a759e8e766e956ae`
- **APY**: 51.27%
- **TVL**: $2,246
- **Probabilities**: exploit=0.02561, depeg=0.00500, oracle=0.00700, illiquid=0.06649, counterparty=0.00500
- **Expected loss**: 3.140% /yr
- **RAAPY**: 48.13%
- **Confidence**: 0.625
- **Score**: 0.3007
- **Eligible tranches**: _none_
- **Primary tranche**: _none_
- **Rejection reasons**:
  - senior: expectedLoss 0.0314 > 0.02; tvlUsd 2246 < 25000000; apy 51.27% > 8% (too-good-to-be-true gate)
  - mezzanine: tvlUsd 2246 < 1000000; apy 51.27% > 20% (too-good-to-be-true gate)
  - junior: tvlUsd 2246 < 100000

### mantleVault:1362a09f-4853-492b-8083-34e0df20e17b

- **Source**: mantleVault
- **Asset**: `0xc96de26018a54d51c097160568752c4e3bd6c364`
- **APY**: 0.00%
- **TVL**: $2,068
- **Probabilities**: exploit=0.02572, depeg=0.00500, oracle=0.00700, illiquid=0.06684, counterparty=0.00500
- **Expected loss**: 3.150% /yr
- **RAAPY**: -3.15%
- **Confidence**: 0.625
- **Score**: -0.0197
- **Eligible tranches**: _none_
- **Primary tranche**: _none_
- **Rejection reasons**:
  - senior: expectedLoss 0.0315 > 0.02; tvlUsd 2068 < 25000000
  - mezzanine: tvlUsd 2068 < 1000000
  - junior: tvlUsd 2068 < 100000

### mantleVault:f988235b-39ab-43b4-a0e9-5ce2cd1924cb

- **Source**: mantleVault
- **Asset**: `0x00000000efe302beaa2b3e6e1b18d08d69a9012a`
- **APY**: 425.73%
- **TVL**: $863
- **Probabilities**: exploit=0.02684, depeg=0.00500, oracle=0.00700, illiquid=0.07064, counterparty=0.00500
- **Expected loss**: 3.265% /yr
- **RAAPY**: 422.47%
- **Confidence**: 0.625
- **Score**: 2.6404
- **Eligible tranches**: _none_
- **Primary tranche**: _none_
- **Rejection reasons**:
  - senior: expectedLoss 0.0326 > 0.02; tvlUsd 863 < 25000000; apy 425.73% > 8% (too-good-to-be-true gate)
  - mezzanine: tvlUsd 863 < 1000000; apy 425.73% > 20% (too-good-to-be-true gate)
  - junior: tvlUsd 863 < 100000

### mantleVault:46cbb5d7-5462-443b-886a-f371349a5d8c

- **Source**: mantleVault
- **Asset**: `0x5be26527e817998a7206475496fde1e68957c5a6`
- **APY**: 1.17%
- **TVL**: $815
- **Probabilities**: exploit=0.02692, depeg=0.00042, oracle=0.00700, illiquid=0.07089, counterparty=0.00500
- **Expected loss**: 3.181% /yr
- **RAAPY**: -2.01%
- **Confidence**: 0.625
- **Score**: -0.0126
- **Eligible tranches**: _none_
- **Primary tranche**: _none_
- **Rejection reasons**:
  - senior: expectedLoss 0.0318 > 0.02; tvlUsd 815 < 25000000
  - mezzanine: tvlUsd 815 < 1000000
  - junior: tvlUsd 815 < 100000

### mantleVault:4f9047f1-ca9f-4b30-b5ad-c7a900c38cae

- **Source**: mantleVault
- **Asset**: `0xdeaddeaddeaddeaddeaddeaddeaddeaddead1111`
- **APY**: 81.96%
- **TVL**: $229
- **Probabilities**: exploit=0.02855, depeg=0.00500, oracle=0.00700, illiquid=0.07640, counterparty=0.00500
- **Expected loss**: 3.439% /yr
- **RAAPY**: 78.53%
- **Confidence**: 0.625
- **Score**: 0.4908
- **Eligible tranches**: _none_
- **Primary tranche**: _none_
- **Rejection reasons**:
  - senior: expectedLoss 0.0344 > 0.02; tvlUsd 229 < 25000000; apy 81.96% > 8% (too-good-to-be-true gate)
  - mezzanine: tvlUsd 229 < 1000000; apy 81.96% > 20% (too-good-to-be-true gate)
  - junior: tvlUsd 229 < 100000

### mantleVault:c91016e0-d075-4bb4-a1c7-465f1c11dc14

- **Source**: mantleVault
- **Asset**: `0x211cc4dd073734da055fbf44a2b4667d5e5fe5d2`
- **APY**: 7.62%
- **TVL**: $26
- **Probabilities**: exploit=0.03135, depeg=0.00063, oracle=0.00700, illiquid=0.08585, counterparty=0.00500
- **Expected loss**: 3.637% /yr
- **RAAPY**: 3.98%
- **Confidence**: 0.625
- **Score**: 0.0249
- **Eligible tranches**: _none_
- **Primary tranche**: _none_
- **Rejection reasons**:
  - senior: expectedLoss 0.0364 > 0.02; tvlUsd 26 < 25000000
  - mezzanine: tvlUsd 26 < 1000000
  - junior: tvlUsd 26 < 100000

### aave:4a0e9f84-09a0-491a-aa5e-269813d31a59

- **Source**: aave
- **Asset**: `0xdeaddeaddeaddeaddeaddeaddeaddeaddead1111`
- **APY**: 2.55%
- **TVL**: $0
- **Probabilities**: exploit=0.00276, depeg=0.00500, oracle=0.00200, illiquid=0.10000, counterparty=0.00500
- **Expected loss**: 1.165% /yr
- **RAAPY**: 1.39%
- **Confidence**: 0.625
- **Score**: 0.0087
- **Eligible tranches**: _none_
- **Primary tranche**: _none_
- **Rejection reasons**:
  - senior: tvlUsd 0 < 25000000
  - mezzanine: tvlUsd 0 < 1000000
  - junior: tvlUsd 0 < 100000

### aave:125974d5-ad17-4a3a-b967-ebbf721fca22

- **Source**: aave
- **Asset**: `0xfc421ad3c883bf9e7c4f42de845c4e4405799e73`
- **APY**: 5.62%
- **TVL**: $0
- **Probabilities**: exploit=0.00276, depeg=0.00500, oracle=0.00200, illiquid=0.10000, counterparty=0.00500
- **Expected loss**: 1.165% /yr
- **RAAPY**: 4.46%
- **Confidence**: 0.625
- **Score**: 0.0279
- **Eligible tranches**: _none_
- **Primary tranche**: _none_
- **Rejection reasons**:
  - senior: tvlUsd 0 < 25000000
  - mezzanine: tvlUsd 0 < 1000000
  - junior: tvlUsd 0 < 100000

### mantleVault:341123b4-b690-4d10-b2f8-b8fa64119220

- **Source**: mantleVault
- **Asset**: `0x09bc4e0d864854c6afb6eb9a9cdf58ac190d0df9`
- **APY**: 71.61%
- **TVL**: $0
- **Probabilities**: exploit=0.03554, depeg=0.00500, oracle=0.00700, illiquid=0.10000, counterparty=0.00500
- **Expected loss**: 4.151% /yr
- **RAAPY**: 67.46%
- **Confidence**: 0.625
- **Score**: 0.4215
- **Eligible tranches**: _none_
- **Primary tranche**: _none_
- **Rejection reasons**:
  - senior: expectedLoss 0.0415 > 0.02; tvlUsd 0 < 25000000; apy 71.61% > 8% (too-good-to-be-true gate)
  - mezzanine: expectedLoss 0.0415 > 0.04; tvlUsd 0 < 1000000; apy 71.61% > 20% (too-good-to-be-true gate)
  - junior: tvlUsd 0 < 100000

## Signed canonical Yield Map

```json
{
  "version": "1.0",
  "publishedAtMs": 1779127305578,
  "publisher": {
    "address": "0xEcDd83eDF6C5DC8402c0CbF822542dA28370F1F4",
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
      "apy": 0.04,
      "apyType": "variable",
      "tvlUsd": 64261826,
      "lastUpdatedMs": 1779127305482,
      "raw": {
        "chain": "Mantle",
        "project": "aave-v3",
        "symbol": "SUSDE",
        "underlyingTokens": [
          "0x211Cc4DD073734dA055fbF44a2b4667d5E5fE5d2"
        ],
        "apy": 4,
        "tvlUsd": 64261826,
        "pool": "a4e37545-203b-4412-9acd-3e8b1aa4d744"
      },
      "risk": {
        "contractAgeDays": 700,
        "auditFactor": 0.3,
        "tvlFactor": null,
        "depegEvents": [
          {
            "startMs": 1747676705000,
            "endMs": null,
            "maxDeviation": 0.23092653438425348,
            "recoveryHours": null
          }
        ],
        "oracleType": "chainlink_dec",
        "liquiditySlippageBps": null,
        "counterpartyClass": "permissionless",
        "smartMoneySignal": null
      },
      "probabilities": {
        "exploit": 0.0009652852589372589,
        "depeg": 0.0006326754366691876,
        "oracle": 0.002,
        "illiquid": 0.021920469381300198,
        "counterparty": 0.005
      },
      "severities": {
        "exploit": 0.85,
        "depeg": 0.2,
        "oracle": 0.4,
        "illiquid": 0.05,
        "counterparty": 0.5
      },
      "expectedLoss": 0.005343051026495517,
      "raapy": 0.034656948973504485,
      "confidence": 0.6248250244977135,
      "score": 0.021654528991385945,
      "eligibleTranches": [
        "senior",
        "mezzanine",
        "junior"
      ],
      "primaryTranche": "senior",
      "rejectionReasons": []
    },
    {
      "id": "ondo:b5d7a190-38d2-4fdd-8c14-1fd00c11bce1",
      "source": "ondo",
      "asset": "0x5be26527e817998a7206475496fde1e68957c5a6",
      "apy": 0.0355,
      "apyType": "variable",
      "tvlUsd": 29438688,
      "lastUpdatedMs": 1779127305482,
      "raw": {
        "chain": "Mantle",
        "project": "ondo-yield-assets",
        "symbol": "USDY",
        "underlyingTokens": [
          "0x5be26527e817998a7206475496fde1e68957c5a6"
        ],
        "apy": 3.55,
        "tvlUsd": 29438688,
        "pool": "b5d7a190-38d2-4fdd-8c14-1fd00c11bce1"
      },
      "risk": {
        "contractAgeDays": 730,
        "auditFactor": 0.3,
        "tvlFactor": null,
        "depegEvents": [
          {
            "startMs": 1747676461000,
            "endMs": null,
            "maxDeviation": 0.15263604122276564,
            "recoveryHours": null
          }
        ],
        "oracleType": "chainlink_dec",
        "liquiditySlippageBps": null,
        "counterpartyClass": "attested_centralized",
        "smartMoneySignal": null
      },
      "probabilities": {
        "exploit": 0.0008831795454429269,
        "depeg": 0.0004181809348568922,
        "oracle": 0.002,
        "illiquid": 0.02531081549193817,
        "counterparty": 0.03
      },
      "severities": {
        "exploit": 0.85,
        "depeg": 0.2,
        "oracle": 0.4,
        "illiquid": 0.05,
        "counterparty": 0.5
      },
      "expectedLoss": 0.017899879575194774,
      "raapy": 0.017600120424805223,
      "confidence": 0.6248291900117618,
      "score": 0.010997068989140513,
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
      "apy": 0.0538373,
      "apyType": "variable",
      "tvlUsd": 24552530,
      "lastUpdatedMs": 1779127305482,
      "raw": {
        "chain": "Mantle",
        "project": "aave-v3",
        "symbol": "USDT0",
        "underlyingTokens": [
          "0x779Ded0c9e1022225f8E0630b35a9b54bE713736"
        ],
        "apy": 5.38373,
        "tvlUsd": 24552530,
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
        "smartMoneySignal": null
      },
      "probabilities": {
        "exploit": 0.0010615034135629028,
        "depeg": 0.005,
        "oracle": 0.002,
        "illiquid": 0.0260990374963362,
        "counterparty": 0.005
      },
      "severities": {
        "exploit": 0.85,
        "depeg": 0.2,
        "oracle": 0.4,
        "illiquid": 0.05,
        "counterparty": 0.5
      },
      "expectedLoss": 0.006507229776345278,
      "raapy": 0.04733007022365472,
      "confidence": 0.6249875001249992,
      "score": 0.029580702269822623,
      "eligibleTranches": [
        "mezzanine",
        "junior"
      ],
      "primaryTranche": "mezzanine",
      "rejectionReasons": [
        {
          "tranche": "senior",
          "reasons": [
            "tvlUsd 24552530 < 25000000"
          ]
        }
      ]
    },
    {
      "id": "aave:76b70b33-d8a4-4e61-8092-9bd1f2be2fc9",
      "source": "aave",
      "asset": "0x5d3a1ff2b6bab83b63cd9ad0787074081a52ef34",
      "apy": 0.0404303,
      "apyType": "variable",
      "tvlUsd": 9772423,
      "lastUpdatedMs": 1779127305482,
      "raw": {
        "chain": "Mantle",
        "project": "aave-v3",
        "symbol": "USDE",
        "underlyingTokens": [
          "0x5d3a1Ff2b6BAb83b63cd9AD0787074081a52ef34"
        ],
        "apy": 4.04303,
        "tvlUsd": 9772423,
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
        "smartMoneySignal": null
      },
      "probabilities": {
        "exploit": 0.0011536313976998238,
        "depeg": 0.005,
        "oracle": 0.002,
        "illiquid": 0.03009997742825299,
        "counterparty": 0.005
      },
      "severities": {
        "exploit": 0.85,
        "depeg": 0.2,
        "oracle": 0.4,
        "illiquid": 0.05,
        "counterparty": 0.5
      },
      "expectedLoss": 0.0067855855594575,
      "raapy": 0.033644714440542504,
      "confidence": 0.6248271072512664,
      "score": 0.021022129598179083,
      "eligibleTranches": [
        "mezzanine",
        "junior"
      ],
      "primaryTranche": "mezzanine",
      "rejectionReasons": [
        {
          "tranche": "senior",
          "reasons": [
            "tvlUsd 9772423 < 25000000"
          ]
        }
      ]
    },
    {
      "id": "aave:32cb38a5-b9b9-441a-bf07-8fab47b999d3",
      "source": "aave",
      "asset": "0x09bc4e0d864854c6afb6eb9a9cdf58ac190d0df9",
      "apy": 0.0575728,
      "apyType": "variable",
      "tvlUsd": 5505919,
      "lastUpdatedMs": 1779127305482,
      "raw": {
        "chain": "Mantle",
        "project": "aave-v3",
        "symbol": "USDC",
        "underlyingTokens": [
          "0x09Bc4E0D864854c6aFB6eB9A9cdF58aC190D0dF9"
        ],
        "apy": 5.75728,
        "tvlUsd": 5505919,
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
        "smartMoneySignal": null
      },
      "probabilities": {
        "exploit": 0.0012110073016465125,
        "depeg": 0.005,
        "oracle": 0.002,
        "illiquid": 0.032591701819931415,
        "counterparty": 0.005
      },
      "severities": {
        "exploit": 0.85,
        "depeg": 0.2,
        "oracle": 0.4,
        "illiquid": 0.05,
        "counterparty": 0.5
      },
      "expectedLoss": 0.0069589412973961075,
      "raapy": 0.05061385870260389,
      "confidence": 0.6248271072512664,
      "score": 0.03162491091997233,
      "eligibleTranches": [
        "mezzanine",
        "junior"
      ],
      "primaryTranche": "mezzanine",
      "rejectionReasons": [
        {
          "tranche": "senior",
          "reasons": [
            "tvlUsd 5505919 < 25000000"
          ]
        }
      ]
    },
    {
      "id": "agni:35f2103d-231b-443b-952e-d2cd118d8f29",
      "source": "agni",
      "asset": "0x779ded0c9e1022225f8e0630b35a9b54be713736",
      "apy": 0.43312530000000005,
      "apyType": "variable",
      "tvlUsd": 1002542,
      "lastUpdatedMs": 1779127305482,
      "raw": {
        "chain": "Mantle",
        "project": "fluxion-network",
        "symbol": "USDT0-BSB",
        "underlyingTokens": [
          "0x779ded0c9e1022225f8e0630b35a9b54be713736",
          "0xe5c330addf7aa9c7838da836436142c56a15aa95"
        ],
        "apy": 43.31253,
        "tvlUsd": 1002542,
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
        "smartMoneySignal": null
      },
      "probabilities": {
        "exploit": 0.006720019114293905,
        "depeg": 0.005,
        "oracle": 0.007,
        "illiquid": 0.03998897424207872,
        "counterparty": 0.005
      },
      "severities": {
        "exploit": 0.85,
        "depeg": 0.2,
        "oracle": 0.4,
        "illiquid": 0.05,
        "counterparty": 0.5
      },
      "expectedLoss": 0.014011464959253756,
      "raapy": 0.4191138350407463,
      "confidence": 0.6249875001249992,
      "score": 0.2619409080299173,
      "eligibleTranches": [
        "junior"
      ],
      "primaryTranche": "junior",
      "rejectionReasons": [
        {
          "tranche": "senior",
          "reasons": [
            "tvlUsd 1002542 < 25000000",
            "apy 43.31% > 8% (too-good-to-be-true gate)"
          ]
        },
        {
          "tranche": "mezzanine",
          "reasons": [
            "apy 43.31% > 20% (too-good-to-be-true gate)"
          ]
        }
      ]
    },
    {
      "id": "agni:85407ecd-f711-4fa6-9328-3078aebfaa95",
      "source": "agni",
      "asset": "0x55b9f84605b30df9bb9d817a6900219f25218157",
      "apy": 0.10722820000000001,
      "apyType": "variable",
      "tvlUsd": 971781,
      "lastUpdatedMs": 1779127305482,
      "raw": {
        "chain": "Mantle",
        "project": "fluxion-network",
        "symbol": "BILL-USDT0",
        "underlyingTokens": [
          "0x55b9f84605b30df9bb9d817a6900219f25218157",
          "0x779ded0c9e1022225f8e0630b35a9b54be713736"
        ],
        "apy": 10.72282,
        "tvlUsd": 971781,
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
        "smartMoneySignal": null
      },
      "probabilities": {
        "exploit": 0.006735180216307528,
        "depeg": 0.005,
        "oracle": 0.007,
        "illiquid": 0.04012431596398576,
        "counterparty": 0.005
      },
      "severities": {
        "exploit": 0.85,
        "depeg": 0.2,
        "oracle": 0.4,
        "illiquid": 0.05,
        "counterparty": 0.5
      },
      "expectedLoss": 0.014031118982060688,
      "raapy": 0.09319708101793932,
      "confidence": 0.6249875001249992,
      "score": 0.058247010684348906,
      "eligibleTranches": [
        "junior"
      ],
      "primaryTranche": "junior",
      "rejectionReasons": [
        {
          "tranche": "senior",
          "reasons": [
            "tvlUsd 971781 < 25000000",
            "apy 10.72% > 8% (too-good-to-be-true gate)"
          ]
        },
        {
          "tranche": "mezzanine",
          "reasons": [
            "tvlUsd 971781 < 1000000"
          ]
        }
      ]
    },
    {
      "id": "agni:6d76a4e2-57f2-4190-a882-bd69f6ea32fb",
      "source": "agni",
      "asset": "0x45db70e1c808dae42f9c4dfea74ba5e6a113bdc1",
      "apy": 0.0693526,
      "apyType": "variable",
      "tvlUsd": 437653,
      "lastUpdatedMs": 1779127305482,
      "raw": {
        "chain": "Mantle",
        "project": "fluxion-network",
        "symbol": "OPG-USDT0",
        "underlyingTokens": [
          "0x45db70e1c808dae42f9c4dfea74ba5e6a113bdc1",
          "0x779ded0c9e1022225f8e0630b35a9b54be713736"
        ],
        "apy": 6.93526,
        "tvlUsd": 437653,
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
        "smartMoneySignal": null
      },
      "probabilities": {
        "exploit": 0.007123263748279978,
        "depeg": 0.005,
        "oracle": 0.007,
        "illiquid": 0.04358870090208076,
        "counterparty": 0.005
      },
      "severities": {
        "exploit": 0.85,
        "depeg": 0.2,
        "oracle": 0.4,
        "illiquid": 0.05,
        "counterparty": 0.5
      },
      "expectedLoss": 0.01453420923114202,
      "raapy": 0.05481839076885798,
      "confidence": 0.6249875001249992,
      "score": 0.034260809007503876,
      "eligibleTranches": [
        "junior"
      ],
      "primaryTranche": "junior",
      "rejectionReasons": [
        {
          "tranche": "senior",
          "reasons": [
            "tvlUsd 437653 < 25000000"
          ]
        },
        {
          "tranche": "mezzanine",
          "reasons": [
            "tvlUsd 437653 < 1000000"
          ]
        }
      ]
    },
    {
      "id": "mantleVault:c87c5d7c-0285-47a9-8539-d335f05b9ba2",
      "source": "mantleVault",
      "asset": "0xcda86a272531e8640cd7f1a92c01839911b90bb0",
      "apy": 0.0034200999999999997,
      "apyType": "variable",
      "tvlUsd": 268015,
      "lastUpdatedMs": 1779127305482,
      "raw": {
        "chain": "Mantle",
        "project": "lendle-pooled-markets",
        "symbol": "METH",
        "underlyingTokens": [
          "0xcDA86A272531e8640cD7F1a92c01839911B90bb0"
        ],
        "apy": 0.34201,
        "tvlUsd": 268015,
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
        "smartMoneySignal": null
      },
      "probabilities": {
        "exploit": 0.01946331715521427,
        "depeg": 0.005,
        "oracle": 0.007,
        "illiquid": 0.04571840899124462,
        "counterparty": 0.005
      },
      "severities": {
        "exploit": 0.85,
        "depeg": 0.2,
        "oracle": 0.4,
        "illiquid": 0.05,
        "counterparty": 0.5
      },
      "expectedLoss": 0.02512974003149436,
      "raapy": -0.02170964003149436,
      "confidence": 0.6249875001249992,
      "score": -0.01356825365189727,
      "eligibleTranches": [
        "junior"
      ],
      "primaryTranche": "junior",
      "rejectionReasons": [
        {
          "tranche": "senior",
          "reasons": [
            "expectedLoss 0.0251 > 0.02",
            "tvlUsd 268015 < 25000000"
          ]
        },
        {
          "tranche": "mezzanine",
          "reasons": [
            "tvlUsd 268015 < 1000000"
          ]
        }
      ]
    },
    {
      "id": "mantleVault:b96d8236-36d4-4be4-92f7-422beeac7073",
      "source": "mantleVault",
      "asset": "0xe6829d9a7ee3040e1276fa75293bde931859e8fa",
      "apy": 0.0005197,
      "apyType": "variable",
      "tvlUsd": 190221,
      "lastUpdatedMs": 1779127305482,
      "raw": {
        "chain": "Mantle",
        "project": "lendle-pooled-markets",
        "symbol": "CMETH",
        "underlyingTokens": [
          "0xE6829d9a7eE3040e1276Fa75293Bde931859e8fA"
        ],
        "apy": 0.05197,
        "tvlUsd": 190221,
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
        "smartMoneySignal": null
      },
      "probabilities": {
        "exploit": 0.019904304761839978,
        "depeg": 0.005,
        "oracle": 0.007,
        "illiquid": 0.04720741539550673,
        "counterparty": 0.005
      },
      "severities": {
        "exploit": 0.85,
        "depeg": 0.2,
        "oracle": 0.4,
        "illiquid": 0.05,
        "counterparty": 0.5
      },
      "expectedLoss": 0.025579029817339317,
      "raapy": -0.025059329817339316,
      "confidence": 0.6249875001249992,
      "score": -0.01566176789734675,
      "eligibleTranches": [
        "junior"
      ],
      "primaryTranche": "junior",
      "rejectionReasons": [
        {
          "tranche": "senior",
          "reasons": [
            "expectedLoss 0.0256 > 0.02",
            "tvlUsd 190221 < 25000000"
          ]
        },
        {
          "tranche": "mezzanine",
          "reasons": [
            "tvlUsd 190221 < 1000000"
          ]
        }
      ]
    },
    {
      "id": "agni:649bee89-0a34-4eb1-b8ab-7c5fdee07ccd",
      "source": "agni",
      "asset": "0x29cc30f9d113b356ce408667aa6433589cecbdca",
      "apy": 0.0188819,
      "apyType": "variable",
      "tvlUsd": 129854,
      "lastUpdatedMs": 1779127305482,
      "raw": {
        "chain": "Mantle",
        "project": "fluxion-network",
        "symbol": "ELSA-USDT0",
        "underlyingTokens": [
          "0x29cc30f9d113b356ce408667aa6433589cecbdca",
          "0x779ded0c9e1022225f8e0630b35a9b54be713736"
        ],
        "apy": 1.88819,
        "tvlUsd": 129854,
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
        "smartMoneySignal": null
      },
      "probabilities": {
        "exploit": 0.007714369579476132,
        "depeg": 0.005,
        "oracle": 0.007,
        "illiquid": 0.04886544667897047,
        "counterparty": 0.005
      },
      "severities": {
        "exploit": 0.85,
        "depeg": 0.2,
        "oracle": 0.4,
        "illiquid": 0.05,
        "counterparty": 0.5
      },
      "expectedLoss": 0.015300486476503235,
      "raapy": 0.0035814135234967653,
      "confidence": 0.6249875001249992,
      "score": 0.0022383386849641083,
      "eligibleTranches": [
        "junior"
      ],
      "primaryTranche": "junior",
      "rejectionReasons": [
        {
          "tranche": "senior",
          "reasons": [
            "tvlUsd 129854 < 25000000"
          ]
        },
        {
          "tranche": "mezzanine",
          "reasons": [
            "tvlUsd 129854 < 1000000"
          ]
        }
      ]
    },
    {
      "id": "agni:227e8492-33e9-4953-8beb-28973c9fdb8a",
      "source": "agni",
      "asset": "0x09bc4e0d864854c6afb6eb9a9cdf58ac190d0df9",
      "apy": 0.0131928,
      "apyType": "variable",
      "tvlUsd": 118242,
      "lastUpdatedMs": 1779127305482,
      "raw": {
        "chain": "Mantle",
        "project": "fluxion-network",
        "symbol": "USDC-WGOOGLX",
        "underlyingTokens": [
          "0x09bc4e0d864854c6afb6eb9a9cdf58ac190d0df9",
          "0x1630f08370917e79df0b7572395a5e907508bbbc"
        ],
        "apy": 1.31928,
        "tvlUsd": 118242,
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
        "smartMoneySignal": null
      },
      "probabilities": {
        "exploit": 0.007759943676846202,
        "depeg": 0.005,
        "oracle": 0.007,
        "illiquid": 0.049272282330289366,
        "counterparty": 0.005
      },
      "severities": {
        "exploit": 0.85,
        "depeg": 0.2,
        "oracle": 0.4,
        "illiquid": 0.05,
        "counterparty": 0.5
      },
      "expectedLoss": 0.01535956624183374,
      "raapy": -0.002166766241833741,
      "confidence": 0.6248271072512664,
      "score": -0.0013538542829746745,
      "eligibleTranches": [
        "junior"
      ],
      "primaryTranche": "junior",
      "rejectionReasons": [
        {
          "tranche": "senior",
          "reasons": [
            "tvlUsd 118242 < 25000000"
          ]
        },
        {
          "tranche": "mezzanine",
          "reasons": [
            "tvlUsd 118242 < 1000000"
          ]
        }
      ]
    },
    {
      "id": "agni:2a510869-6356-4486-8bb5-d5a808634496",
      "source": "agni",
      "asset": "0x09bc4e0d864854c6afb6eb9a9cdf58ac190d0df9",
      "apy": 0.027457,
      "apyType": "variable",
      "tvlUsd": 111933,
      "lastUpdatedMs": 1779127305482,
      "raw": {
        "chain": "Mantle",
        "project": "fluxion-network",
        "symbol": "USDC-WNVDAX",
        "underlyingTokens": [
          "0x09bc4e0d864854c6afb6eb9a9cdf58ac190d0df9",
          "0x93e62845c1dd5822ebc807ab71a5fb750decd15a"
        ],
        "apy": 2.7457,
        "tvlUsd": 111933,
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
        "smartMoneySignal": null
      },
      "probabilities": {
        "exploit": 0.007786619912792943,
        "depeg": 0.005,
        "oracle": 0.007,
        "illiquid": 0.04951041856232489,
        "counterparty": 0.005
      },
      "severities": {
        "exploit": 0.85,
        "depeg": 0.2,
        "oracle": 0.4,
        "illiquid": 0.05,
        "counterparty": 0.5
      },
      "expectedLoss": 0.015394147853990249,
      "raapy": 0.01206285214600975,
      "confidence": 0.6248291900117618,
      "score": 0.007537222135622915,
      "eligibleTranches": [
        "junior"
      ],
      "primaryTranche": "junior",
      "rejectionReasons": [
        {
          "tranche": "senior",
          "reasons": [
            "tvlUsd 111933 < 25000000"
          ]
        },
        {
          "tranche": "mezzanine",
          "reasons": [
            "tvlUsd 111933 < 1000000"
          ]
        }
      ]
    },
    {
      "id": "agni:ebec73de-fd1e-4f97-8287-d9cb01c7d352",
      "source": "agni",
      "asset": "0x09bc4e0d864854c6afb6eb9a9cdf58ac190d0df9",
      "apy": 0.0406398,
      "apyType": "variable",
      "tvlUsd": 110338,
      "lastUpdatedMs": 1779127305482,
      "raw": {
        "chain": "Mantle",
        "project": "fluxion-network",
        "symbol": "USDC-WMSTRX",
        "underlyingTokens": [
          "0x09bc4e0d864854c6afb6eb9a9cdf58ac190d0df9",
          "0x266e5923f6118f8b340ca5a23ae7f71897361476"
        ],
        "apy": 4.06398,
        "tvlUsd": 110338,
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
        "smartMoneySignal": null
      },
      "probabilities": {
        "exploit": 0.007793602216222977,
        "depeg": 0.005,
        "oracle": 0.007,
        "illiquid": 0.049572748923815045,
        "counterparty": 0.005
      },
      "severities": {
        "exploit": 0.85,
        "depeg": 0.2,
        "oracle": 0.4,
        "illiquid": 0.05,
        "counterparty": 0.5
      },
      "expectedLoss": 0.015403199329980284,
      "raapy": 0.02523660067001971,
      "confidence": 0.624814610834086,
      "score": 0.0157681968264136,
      "eligibleTranches": [
        "junior"
      ],
      "primaryTranche": "junior",
      "rejectionReasons": [
        {
          "tranche": "senior",
          "reasons": [
            "tvlUsd 110338 < 25000000"
          ]
        },
        {
          "tranche": "mezzanine",
          "reasons": [
            "tvlUsd 110338 < 1000000"
          ]
        }
      ]
    },
    {
      "id": "agni:2364dd66-69d3-44ef-9e85-4d5217a57b57",
      "source": "agni",
      "asset": "0x09bc4e0d864854c6afb6eb9a9cdf58ac190d0df9",
      "apy": 0.0057916,
      "apyType": "variable",
      "tvlUsd": 109127,
      "lastUpdatedMs": 1779127305482,
      "raw": {
        "chain": "Mantle",
        "project": "fluxion-network",
        "symbol": "USDC-WQQQX",
        "underlyingTokens": [
          "0x09bc4e0d864854c6afb6eb9a9cdf58ac190d0df9",
          "0xdbd9232fee15351068fe02f0683146e16d9f2cea"
        ],
        "apy": 0.57916,
        "tvlUsd": 109127,
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
        "smartMoneySignal": null
      },
      "probabilities": {
        "exploit": 0.007798971256488374,
        "depeg": 0.005,
        "oracle": 0.007,
        "illiquid": 0.0496206778378118,
        "counterparty": 0.005
      },
      "severities": {
        "exploit": 0.85,
        "depeg": 0.2,
        "oracle": 0.4,
        "illiquid": 0.05,
        "counterparty": 0.5
      },
      "expectedLoss": 0.015410159459905709,
      "raapy": -0.00961855945990571,
      "confidence": 0.6248166935529266,
      "score": -0.006009836518480509,
      "eligibleTranches": [
        "junior"
      ],
      "primaryTranche": "junior",
      "rejectionReasons": [
        {
          "tranche": "senior",
          "reasons": [
            "tvlUsd 109127 < 25000000"
          ]
        },
        {
          "tranche": "mezzanine",
          "reasons": [
            "tvlUsd 109127 < 1000000"
          ]
        }
      ]
    },
    {
      "id": "agni:3b6b75cf-adb5-4fb4-bbcd-8f75c6879c9d",
      "source": "agni",
      "asset": "0x09bc4e0d864854c6afb6eb9a9cdf58ac190d0df9",
      "apy": 0.0047957,
      "apyType": "variable",
      "tvlUsd": 108809,
      "lastUpdatedMs": 1779127305482,
      "raw": {
        "chain": "Mantle",
        "project": "fluxion-network",
        "symbol": "USDC-WAAPLX",
        "underlyingTokens": [
          "0x09bc4e0d864854c6afb6eb9a9cdf58ac190d0df9",
          "0x5aa7649fdbda47de64a07ac81d64b682af9c0724"
        ],
        "apy": 0.47957,
        "tvlUsd": 108809,
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
        "smartMoneySignal": null
      },
      "probabilities": {
        "exploit": 0.007800391006340043,
        "depeg": 0.005,
        "oracle": 0.007,
        "illiquid": 0.0496333518102862,
        "counterparty": 0.005
      },
      "severities": {
        "exploit": 0.85,
        "depeg": 0.2,
        "oracle": 0.4,
        "illiquid": 0.05,
        "counterparty": 0.5
      },
      "expectedLoss": 0.01541199994590335,
      "raapy": -0.01061629994590335,
      "confidence": 0.6248271072512664,
      "score": -0.006633351984910566,
      "eligibleTranches": [
        "junior"
      ],
      "primaryTranche": "junior",
      "rejectionReasons": [
        {
          "tranche": "senior",
          "reasons": [
            "tvlUsd 108809 < 25000000"
          ]
        },
        {
          "tranche": "mezzanine",
          "reasons": [
            "tvlUsd 108809 < 1000000"
          ]
        }
      ]
    },
    {
      "id": "agni:3d429d4e-b3a6-4847-957b-b10bf26a6f01",
      "source": "agni",
      "asset": "0x779ded0c9e1022225f8e0630b35a9b54be713736",
      "apy": 0.0004992,
      "apyType": "variable",
      "tvlUsd": 108309,
      "lastUpdatedMs": 1779127305482,
      "raw": {
        "chain": "Mantle",
        "project": "fluxion-network",
        "symbol": "USDT0-SCOR",
        "underlyingTokens": [
          "0x779ded0c9e1022225f8e0630b35a9b54be713736",
          "0x8ddb986b11c039a6cc1dbcabd62bae911b348f33"
        ],
        "apy": 0.04992,
        "tvlUsd": 108309,
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
        "smartMoneySignal": null
      },
      "probabilities": {
        "exploit": 0.007802631730112039,
        "depeg": 0.005,
        "oracle": 0.007,
        "illiquid": 0.049653354539200466,
        "counterparty": 0.005
      },
      "severities": {
        "exploit": 0.85,
        "depeg": 0.2,
        "oracle": 0.4,
        "illiquid": 0.05,
        "counterparty": 0.5
      },
      "expectedLoss": 0.015414904697555258,
      "raapy": -0.014915704697555258,
      "confidence": 0.6249875001249992,
      "score": -0.009322128991527767,
      "eligibleTranches": [
        "junior"
      ],
      "primaryTranche": "junior",
      "rejectionReasons": [
        {
          "tranche": "senior",
          "reasons": [
            "tvlUsd 108309 < 25000000"
          ]
        },
        {
          "tranche": "mezzanine",
          "reasons": [
            "tvlUsd 108309 < 1000000"
          ]
        }
      ]
    },
    {
      "id": "agni:913ce101-55b1-4230-93c7-d523f0d9ca03",
      "source": "agni",
      "asset": "0x09bc4e0d864854c6afb6eb9a9cdf58ac190d0df9",
      "apy": 0.0006805,
      "apyType": "variable",
      "tvlUsd": 106877,
      "lastUpdatedMs": 1779127305482,
      "raw": {
        "chain": "Mantle",
        "project": "fluxion-network",
        "symbol": "USDC-WSPYX",
        "underlyingTokens": [
          "0x09bc4e0d864854c6afb6eb9a9cdf58ac190d0df9",
          "0xc88fcd8b874fdb3256e8b55b3decb8c24eab4c02"
        ],
        "apy": 0.06805,
        "tvlUsd": 106877,
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
        "smartMoneySignal": null
      },
      "probabilities": {
        "exploit": 0.007809106864638323,
        "depeg": 0.005,
        "oracle": 0.007,
        "illiquid": 0.04971115745191615,
        "counterparty": 0.005
      },
      "severities": {
        "exploit": 0.85,
        "depeg": 0.2,
        "oracle": 0.4,
        "illiquid": 0.05,
        "counterparty": 0.5
      },
      "expectedLoss": 0.015423298707538382,
      "raapy": -0.014742798707538382,
      "confidence": 0.6248250244977135,
      "score": -0.009211669563602528,
      "eligibleTranches": [
        "junior"
      ],
      "primaryTranche": "junior",
      "rejectionReasons": [
        {
          "tranche": "senior",
          "reasons": [
            "tvlUsd 106877 < 25000000"
          ]
        },
        {
          "tranche": "mezzanine",
          "reasons": [
            "tvlUsd 106877 < 1000000"
          ]
        }
      ]
    },
    {
      "id": "agni:a4ff3d7c-a117-4b24-a9f9-6af46cd276c0",
      "source": "agni",
      "asset": "0x09bc4e0d864854c6afb6eb9a9cdf58ac190d0df9",
      "apy": 0.0241074,
      "apyType": "variable",
      "tvlUsd": 106833,
      "lastUpdatedMs": 1779127305482,
      "raw": {
        "chain": "Mantle",
        "project": "fluxion-network",
        "symbol": "USDC-WTSLAX",
        "underlyingTokens": [
          "0x09bc4e0d864854c6afb6eb9a9cdf58ac190d0df9",
          "0x43680abf18cf54898be84c6ef78237cfbd441883"
        ],
        "apy": 2.41074,
        "tvlUsd": 106833,
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
        "smartMoneySignal": null
      },
      "probabilities": {
        "exploit": 0.007809307192436499,
        "depeg": 0.005,
        "oracle": 0.007,
        "illiquid": 0.04971294575919926,
        "counterparty": 0.005
      },
      "severities": {
        "exploit": 0.85,
        "depeg": 0.2,
        "oracle": 0.4,
        "illiquid": 0.05,
        "counterparty": 0.5
      },
      "expectedLoss": 0.01542355840153099,
      "raapy": 0.008683841598469012,
      "confidence": 0.6248271072512664,
      "score": 0.005425899625799606,
      "eligibleTranches": [
        "junior"
      ],
      "primaryTranche": "junior",
      "rejectionReasons": [
        {
          "tranche": "senior",
          "reasons": [
            "tvlUsd 106833 < 25000000"
          ]
        },
        {
          "tranche": "mezzanine",
          "reasons": [
            "tvlUsd 106833 < 1000000"
          ]
        }
      ]
    },
    {
      "id": "agni:a7e2f58e-1c93-4592-acd6-8e40e6cb26ff",
      "source": "agni",
      "asset": "0x09bc4e0d864854c6afb6eb9a9cdf58ac190d0df9",
      "apy": 0.026137999999999998,
      "apyType": "variable",
      "tvlUsd": 105728,
      "lastUpdatedMs": 1779127305482,
      "raw": {
        "chain": "Mantle",
        "project": "fluxion-network",
        "symbol": "USDC-WCRCLX",
        "underlyingTokens": [
          "0x09bc4e0d864854c6afb6eb9a9cdf58ac190d0df9",
          "0xa90872aca656ebe47bdebf3b19ec9dd9c5adc7f8"
        ],
        "apy": 2.6138,
        "tvlUsd": 105728,
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
        "smartMoneySignal": null
      },
      "probabilities": {
        "exploit": 0.007814365392294664,
        "depeg": 0.005,
        "oracle": 0.007,
        "illiquid": 0.049758099830317495,
        "counterparty": 0.005
      },
      "severities": {
        "exploit": 0.85,
        "depeg": 0.2,
        "oracle": 0.4,
        "illiquid": 0.05,
        "counterparty": 0.5
      },
      "expectedLoss": 0.015430115574966341,
      "raapy": 0.010707884425033657,
      "confidence": 0.6248166935529266,
      "score": 0.00669046494139641,
      "eligibleTranches": [
        "junior"
      ],
      "primaryTranche": "junior",
      "rejectionReasons": [
        {
          "tranche": "senior",
          "reasons": [
            "tvlUsd 105728 < 25000000"
          ]
        },
        {
          "tranche": "mezzanine",
          "reasons": [
            "tvlUsd 105728 < 1000000"
          ]
        }
      ]
    },
    {
      "id": "agni:b5933580-18c1-43b6-aec3-2563cd30e3a2",
      "source": "agni",
      "asset": "0x779ded0c9e1022225f8e0630b35a9b54be713736",
      "apy": 0.0025407000000000003,
      "apyType": "variable",
      "tvlUsd": 104209,
      "lastUpdatedMs": 1779127305482,
      "raw": {
        "chain": "Mantle",
        "project": "fluxion-network",
        "symbol": "USDT0-VOOI",
        "underlyingTokens": [
          "0x779ded0c9e1022225f8e0630b35a9b54be713736",
          "0xd81a4adea9932a6bdba0bdbc8c5fd4c78e5a09f1"
        ],
        "apy": 0.25407,
        "tvlUsd": 104209,
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
        "smartMoneySignal": null
      },
      "probabilities": {
        "exploit": 0.007821405669271137,
        "depeg": 0.005,
        "oracle": 0.007,
        "illiquid": 0.04982094771616656,
        "counterparty": 0.005
      },
      "severities": {
        "exploit": 0.85,
        "depeg": 0.2,
        "oracle": 0.4,
        "illiquid": 0.05,
        "counterparty": 0.5
      },
      "expectedLoss": 0.015439242204688794,
      "raapy": -0.012898542204688794,
      "confidence": 0.6249875001249992,
      "score": -0.008061427647765245,
      "eligibleTranches": [
        "junior"
      ],
      "primaryTranche": "junior",
      "rejectionReasons": [
        {
          "tranche": "senior",
          "reasons": [
            "tvlUsd 104209 < 25000000"
          ]
        },
        {
          "tranche": "mezzanine",
          "reasons": [
            "tvlUsd 104209 < 1000000"
          ]
        }
      ]
    },
    {
      "id": "agni:b8d50460-5237-4601-9250-4f2d3a6b569b",
      "source": "agni",
      "asset": "0x09bc4e0d864854c6afb6eb9a9cdf58ac190d0df9",
      "apy": 0.0026538,
      "apyType": "variable",
      "tvlUsd": 103942,
      "lastUpdatedMs": 1779127305482,
      "raw": {
        "chain": "Mantle",
        "project": "fluxion-network",
        "symbol": "USDC-WMETAX",
        "underlyingTokens": [
          "0x09bc4e0d864854c6afb6eb9a9cdf58ac190d0df9",
          "0x4e41a262caa93c6575d336e0a4eb79f3c67caa06"
        ],
        "apy": 0.26538,
        "tvlUsd": 103942,
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
        "smartMoneySignal": null
      },
      "probabilities": {
        "exploit": 0.007822653760632545,
        "depeg": 0.005,
        "oracle": 0.007,
        "illiquid": 0.0498320893095546,
        "counterparty": 0.005
      },
      "severities": {
        "exploit": 0.85,
        "depeg": 0.2,
        "oracle": 0.4,
        "illiquid": 0.05,
        "counterparty": 0.5
      },
      "expectedLoss": 0.015440860162015395,
      "raapy": -0.012787060162015395,
      "confidence": 0.6248125281221877,
      "score": -0.00798951538707935,
      "eligibleTranches": [
        "junior"
      ],
      "primaryTranche": "junior",
      "rejectionReasons": [
        {
          "tranche": "senior",
          "reasons": [
            "tvlUsd 103942 < 25000000"
          ]
        },
        {
          "tranche": "mezzanine",
          "reasons": [
            "tvlUsd 103942 < 1000000"
          ]
        }
      ]
    },
    {
      "id": "agni:30836422-c578-4f77-8f81-861c509c5d4c",
      "source": "agni",
      "asset": "0x09bc4e0d864854c6afb6eb9a9cdf58ac190d0df9",
      "apy": 0.0105925,
      "apyType": "variable",
      "tvlUsd": 103889,
      "lastUpdatedMs": 1779127305482,
      "raw": {
        "chain": "Mantle",
        "project": "fluxion-network",
        "symbol": "USDC-WHOODX",
        "underlyingTokens": [
          "0x09bc4e0d864854c6afb6eb9a9cdf58ac190d0df9",
          "0x953707d7a1cb30cc5c636bda8eaebe410341eb14"
        ],
        "apy": 1.05925,
        "tvlUsd": 103889,
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
        "smartMoneySignal": null
      },
      "probabilities": {
        "exploit": 0.007822901890435758,
        "depeg": 0.005,
        "oracle": 0.007,
        "illiquid": 0.04983430434080979,
        "counterparty": 0.005
      },
      "severities": {
        "exploit": 0.85,
        "depeg": 0.2,
        "oracle": 0.4,
        "illiquid": 0.05,
        "counterparty": 0.5
      },
      "expectedLoss": 0.015441181823910886,
      "raapy": -0.004848681823910886,
      "confidence": 0.6248250244977135,
      "score": -0.0030295777394067375,
      "eligibleTranches": [
        "junior"
      ],
      "primaryTranche": "junior",
      "rejectionReasons": [
        {
          "tranche": "senior",
          "reasons": [
            "tvlUsd 103889 < 25000000"
          ]
        },
        {
          "tranche": "mezzanine",
          "reasons": [
            "tvlUsd 103889 < 1000000"
          ]
        }
      ]
    },
    {
      "id": "mantleVault:3f5789dd-68ed-44c7-9388-b553df96502d",
      "source": "mantleVault",
      "asset": "0x78c1b0c915c4faa5fffa6cabf0219da63d7f4cb8",
      "apy": 0.0043244,
      "apyType": "variable",
      "tvlUsd": 71999,
      "lastUpdatedMs": 1779127305482,
      "raw": {
        "chain": "Mantle",
        "project": "lendle-pooled-markets",
        "symbol": "WMNT",
        "underlyingTokens": [
          "0x78c1b0C915c4FAA5FffA6CAbf0219DA63d7f4cb8"
        ],
        "apy": 0.43244,
        "tvlUsd": 71999,
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
        "smartMoneySignal": null
      },
      "probabilities": {
        "exploit": 0.02115390839356644,
        "depeg": 0.005,
        "oracle": 0.007,
        "illiquid": 0.05142673535478425,
        "counterparty": 0.005
      },
      "severities": {
        "exploit": 0.85,
        "depeg": 0.2,
        "oracle": 0.4,
        "illiquid": 0.05,
        "counterparty": 0.5
      },
      "expectedLoss": 0.026852158902270686,
      "raapy": -0.022527758902270687,
      "confidence": 0.6249875001249992,
      "score": -0.014079567719748852,
      "eligibleTranches": [],
      "primaryTranche": null,
      "rejectionReasons": [
        {
          "tranche": "senior",
          "reasons": [
            "expectedLoss 0.0269 > 0.02",
            "tvlUsd 71999 < 25000000"
          ]
        },
        {
          "tranche": "mezzanine",
          "reasons": [
            "tvlUsd 71999 < 1000000"
          ]
        },
        {
          "tranche": "junior",
          "reasons": [
            "tvlUsd 71999 < 100000"
          ]
        }
      ]
    },
    {
      "id": "cian:009b6f09-bfa7-4852-8685-0980d9478419",
      "source": "cian",
      "asset": "0xcda86a272531e8640cd7f1a92c01839911b90bb0",
      "apy": 0.0275651,
      "apyType": "variable",
      "tvlUsd": 50855,
      "lastUpdatedMs": 1779127305482,
      "raw": {
        "chain": "Mantle",
        "project": "circuit-protocol",
        "symbol": "METH",
        "underlyingTokens": [
          "0xcDA86A272531e8640cD7F1a92c01839911B90bb0"
        ],
        "apy": 2.75651,
        "tvlUsd": 50855,
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
        "smartMoneySignal": null
      },
      "probabilities": {
        "exploit": 0.030995901610173827,
        "depeg": 0.005,
        "oracle": 0.02,
        "illiquid": 0.05293666341351703,
        "counterparty": 0.005
      },
      "severities": {
        "exploit": 0.85,
        "depeg": 0.2,
        "oracle": 0.4,
        "illiquid": 0.05,
        "counterparty": 0.5
      },
      "expectedLoss": 0.040493349539323605,
      "raapy": -0.012928249539323606,
      "confidence": 0.6249875001249992,
      "score": -0.008079994360574033,
      "eligibleTranches": [],
      "primaryTranche": null,
      "rejectionReasons": [
        {
          "tranche": "senior",
          "reasons": [
            "expectedLoss 0.0405 > 0.02",
            "tvlUsd 50855 < 25000000"
          ]
        },
        {
          "tranche": "mezzanine",
          "reasons": [
            "expectedLoss 0.0405 > 0.04",
            "tvlUsd 50855 < 1000000"
          ]
        },
        {
          "tranche": "junior",
          "reasons": [
            "tvlUsd 50855 < 100000"
          ]
        }
      ]
    },
    {
      "id": "agni:ab6d4bd4-fa82-4f09-9588-98c953179d61",
      "source": "agni",
      "asset": "0x29cc30f9d113b356ce408667aa6433589cecbdca",
      "apy": 0.0114509,
      "apyType": "variable",
      "tvlUsd": 47239,
      "lastUpdatedMs": 1779127305482,
      "raw": {
        "chain": "Mantle",
        "project": "fluxion-network",
        "symbol": "ELSA-WMNT",
        "underlyingTokens": [
          "0x29cc30f9d113b356ce408667aa6433589cecbdca",
          "0x78c1b0c915c4faa5fffa6cabf0219da63d7f4cb8"
        ],
        "apy": 1.14509,
        "tvlUsd": 47239,
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
        "smartMoneySignal": null
      },
      "probabilities": {
        "exploit": 0.008206314572621404,
        "depeg": 0.005,
        "oracle": 0.007,
        "illiquid": 0.053256993045191214,
        "counterparty": 0.005
      },
      "severities": {
        "exploit": 0.85,
        "depeg": 0.2,
        "oracle": 0.4,
        "illiquid": 0.05,
        "counterparty": 0.5
      },
      "expectedLoss": 0.015938217038987755,
      "raapy": -0.004487317038987755,
      "confidence": 0.6249875001249992,
      "score": -0.0028045170584652702,
      "eligibleTranches": [],
      "primaryTranche": null,
      "rejectionReasons": [
        {
          "tranche": "senior",
          "reasons": [
            "tvlUsd 47239 < 25000000"
          ]
        },
        {
          "tranche": "mezzanine",
          "reasons": [
            "tvlUsd 47239 < 1000000"
          ]
        },
        {
          "tranche": "junior",
          "reasons": [
            "tvlUsd 47239 < 100000"
          ]
        }
      ]
    },
    {
      "id": "agni:6a134700-f4a3-49ad-ad5a-fe1868b1c744",
      "source": "agni",
      "asset": "0x111111d2bf19e43c34263401e0cad979ed1cdb61",
      "apy": 0.0007723,
      "apyType": "variable",
      "tvlUsd": 44572,
      "lastUpdatedMs": 1779127305482,
      "raw": {
        "chain": "Mantle",
        "project": "fluxion-network",
        "symbol": "USD1-USDT0",
        "underlyingTokens": [
          "0x111111d2bf19e43c34263401e0cad979ed1cdb61",
          "0x779ded0c9e1022225f8e0630b35a9b54be713736"
        ],
        "apy": 0.07723,
        "tvlUsd": 44572,
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
        "smartMoneySignal": null
      },
      "probabilities": {
        "exploit": 0.00823458705091989,
        "depeg": 0.005,
        "oracle": 0.007,
        "illiquid": 0.053509378781535326,
        "counterparty": 0.005
      },
      "severities": {
        "exploit": 0.85,
        "depeg": 0.2,
        "oracle": 0.4,
        "illiquid": 0.05,
        "counterparty": 0.5
      },
      "expectedLoss": 0.015974867932358673,
      "raapy": -0.015202567932358673,
      "confidence": 0.6249875001249992,
      "score": -0.009501414927525324,
      "eligibleTranches": [],
      "primaryTranche": null,
      "rejectionReasons": [
        {
          "tranche": "senior",
          "reasons": [
            "tvlUsd 44572 < 25000000"
          ]
        },
        {
          "tranche": "mezzanine",
          "reasons": [
            "tvlUsd 44572 < 1000000"
          ]
        },
        {
          "tranche": "junior",
          "reasons": [
            "tvlUsd 44572 < 100000"
          ]
        }
      ]
    },
    {
      "id": "mantleVault:4ecffa03-92a0-4eed-bb8b-7537ade00cae",
      "source": "mantleVault",
      "asset": "0xcda86a272531e8640cd7f1a92c01839911b90bb0",
      "apy": 0.0000072999999999999996,
      "apyType": "variable",
      "tvlUsd": 33505,
      "lastUpdatedMs": 1779127305482,
      "raw": {
        "chain": "Mantle",
        "project": "minterest",
        "symbol": "METH",
        "underlyingTokens": [
          "0xcDA86A272531e8640cD7F1a92c01839911B90bb0"
        ],
        "apy": 0.00073,
        "tvlUsd": 33505,
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
        "smartMoneySignal": null
      },
      "probabilities": {
        "exploit": 0.02213780953546262,
        "depeg": 0.005,
        "oracle": 0.007,
        "illiquid": 0.05474890377728067,
        "counterparty": 0.005
      },
      "severities": {
        "exploit": 0.85,
        "depeg": 0.2,
        "oracle": 0.4,
        "illiquid": 0.05,
        "counterparty": 0.5
      },
      "expectedLoss": 0.02785458329400726,
      "raapy": -0.027847283294007263,
      "confidence": 0.6249875001249992,
      "score": -0.01740420397119425,
      "eligibleTranches": [],
      "primaryTranche": null,
      "rejectionReasons": [
        {
          "tranche": "senior",
          "reasons": [
            "expectedLoss 0.0279 > 0.02",
            "tvlUsd 33505 < 25000000"
          ]
        },
        {
          "tranche": "mezzanine",
          "reasons": [
            "tvlUsd 33505 < 1000000"
          ]
        },
        {
          "tranche": "junior",
          "reasons": [
            "tvlUsd 33505 < 100000"
          ]
        }
      ]
    },
    {
      "id": "mantleVault:dc732e3d-d65b-4087-8d48-53e50bb47732",
      "source": "mantleVault",
      "asset": "0xc96de26018a54d51c097160568752c4e3bd6c364",
      "apy": 0.0163832,
      "apyType": "variable",
      "tvlUsd": 28262,
      "lastUpdatedMs": 1779127305482,
      "raw": {
        "chain": "Mantle",
        "project": "lendle-pooled-markets",
        "symbol": "FBTC",
        "underlyingTokens": [
          "0xC96dE26018A54D51c097160568752c4E3BD6C364"
        ],
        "apy": 1.63832,
        "tvlUsd": 28262,
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
        "smartMoneySignal": null
      },
      "probabilities": {
        "exploit": 0.022356693429968884,
        "depeg": 0.005,
        "oracle": 0.007,
        "illiquid": 0.05548797107942888,
        "counterparty": 0.005
      },
      "severities": {
        "exploit": 0.85,
        "depeg": 0.2,
        "oracle": 0.4,
        "illiquid": 0.05,
        "counterparty": 0.5
      },
      "expectedLoss": 0.028077587969444994,
      "raapy": -0.011694387969444994,
      "confidence": 0.6249875001249992,
      "score": -0.007308846302515291,
      "eligibleTranches": [],
      "primaryTranche": null,
      "rejectionReasons": [
        {
          "tranche": "senior",
          "reasons": [
            "expectedLoss 0.0281 > 0.02",
            "tvlUsd 28262 < 25000000"
          ]
        },
        {
          "tranche": "mezzanine",
          "reasons": [
            "tvlUsd 28262 < 1000000"
          ]
        },
        {
          "tranche": "junior",
          "reasons": [
            "tvlUsd 28262 < 100000"
          ]
        }
      ]
    },
    {
      "id": "mantleVault:d6c5fcec-1f1f-40e8-b732-076ece1462fc",
      "source": "mantleVault",
      "asset": "0x78c1b0c915c4faa5fffa6cabf0219da63d7f4cb8",
      "apy": 0.0000011,
      "apyType": "variable",
      "tvlUsd": 21716,
      "lastUpdatedMs": 1779127305482,
      "raw": {
        "chain": "Mantle",
        "project": "minterest",
        "symbol": "WMNT",
        "underlyingTokens": [
          "0x78c1b0C915c4FAA5FffA6CAbf0219DA63d7f4cb8"
        ],
        "apy": 0.00011,
        "tvlUsd": 21716,
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
        "smartMoneySignal": null
      },
      "probabilities": {
        "exploit": 0.022695571428204275,
        "depeg": 0.005,
        "oracle": 0.007,
        "illiquid": 0.056632201670163584,
        "counterparty": 0.005
      },
      "severities": {
        "exploit": 0.85,
        "depeg": 0.2,
        "oracle": 0.4,
        "illiquid": 0.05,
        "counterparty": 0.5
      },
      "expectedLoss": 0.028422845797481815,
      "raapy": -0.028421745797481815,
      "confidence": 0.6249875001249992,
      "score": -0.01776323585515636,
      "eligibleTranches": [],
      "primaryTranche": null,
      "rejectionReasons": [
        {
          "tranche": "senior",
          "reasons": [
            "expectedLoss 0.0284 > 0.02",
            "tvlUsd 21716 < 25000000"
          ]
        },
        {
          "tranche": "mezzanine",
          "reasons": [
            "tvlUsd 21716 < 1000000"
          ]
        },
        {
          "tranche": "junior",
          "reasons": [
            "tvlUsd 21716 < 100000"
          ]
        }
      ]
    },
    {
      "id": "cian:6eec4d69-bcad-48b9-aa3a-31005778de19",
      "source": "cian",
      "asset": "0xcda86a272531e8640cd7f1a92c01839911b90bb0",
      "apy": 0.0044471,
      "apyType": "variable",
      "tvlUsd": 17235,
      "lastUpdatedMs": 1779127305482,
      "raw": {
        "chain": "Mantle",
        "project": "beefy",
        "symbol": "METH-WETH",
        "underlyingTokens": [
          "0xcDA86A272531e8640cD7F1a92c01839911B90bb0",
          "0xdEAddEaDdeadDEadDEADDEAddEADDEAddead1111"
        ],
        "apy": 0.44471,
        "tvlUsd": 17235,
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
        "smartMoneySignal": null
      },
      "probabilities": {
        "exploit": 0.03299293120973059,
        "depeg": 0.005,
        "oracle": 0.02,
        "illiquid": 0.057635887122560334,
        "counterparty": 0.005
      },
      "severities": {
        "exploit": 0.85,
        "depeg": 0.2,
        "oracle": 0.4,
        "illiquid": 0.05,
        "counterparty": 0.5
      },
      "expectedLoss": 0.04242578588439902,
      "raapy": -0.03797868588439902,
      "confidence": 0.6249875001249992,
      "score": -0.023736203948923135,
      "eligibleTranches": [],
      "primaryTranche": null,
      "rejectionReasons": [
        {
          "tranche": "senior",
          "reasons": [
            "expectedLoss 0.0424 > 0.02",
            "tvlUsd 17235 < 25000000"
          ]
        },
        {
          "tranche": "mezzanine",
          "reasons": [
            "expectedLoss 0.0424 > 0.04",
            "tvlUsd 17235 < 1000000"
          ]
        },
        {
          "tranche": "junior",
          "reasons": [
            "tvlUsd 17235 < 100000"
          ]
        }
      ]
    },
    {
      "id": "fbtc:d8733ab8-a147-4e31-a668-2c9dff24ea56",
      "source": "fbtc",
      "asset": "0x201eba5cc46d216ce6dc03f6a759e8e766e956ae",
      "apy": 0.1271997,
      "apyType": "variable",
      "tvlUsd": 14713,
      "lastUpdatedMs": 1779127305482,
      "raw": {
        "chain": "Mantle",
        "project": "clearpool-lending",
        "symbol": "USDT",
        "underlyingTokens": [
          "0x201eba5cc46d216ce6dc03f6a759e8e766e956ae"
        ],
        "apy": 12.71997,
        "tvlUsd": 14713,
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
        "smartMoneySignal": null
      },
      "probabilities": {
        "exploit": 0.02319631854423843,
        "depeg": 0.005,
        "oracle": 0.02,
        "illiquid": 0.058322987650286325,
        "counterparty": 0.08
      },
      "severities": {
        "exploit": 0.85,
        "depeg": 0.2,
        "oracle": 0.4,
        "illiquid": 0.05,
        "counterparty": 0.5
      },
      "expectedLoss": 0.071633020145117,
      "raapy": 0.055566679854883005,
      "confidence": 0.6248021146668313,
      "score": 0.03471817907834572,
      "eligibleTranches": [],
      "primaryTranche": null,
      "rejectionReasons": [
        {
          "tranche": "senior",
          "reasons": [
            "expectedLoss 0.0716 > 0.02",
            "tvlUsd 14713 < 25000000",
            "apy 12.72% > 8% (too-good-to-be-true gate)"
          ]
        },
        {
          "tranche": "mezzanine",
          "reasons": [
            "expectedLoss 0.0716 > 0.04",
            "tvlUsd 14713 < 1000000"
          ]
        },
        {
          "tranche": "junior",
          "reasons": [
            "tvlUsd 14713 < 100000"
          ]
        }
      ]
    },
    {
      "id": "mantleVault:e118b8cb-a7f6-4619-8844-791956db623b",
      "source": "mantleVault",
      "asset": "0xcda86a272531e8640cd7f1a92c01839911b90bb0",
      "apy": 1.0000000000000001e-7,
      "apyType": "variable",
      "tvlUsd": 14497,
      "lastUpdatedMs": 1779127305482,
      "raw": {
        "chain": "Mantle",
        "project": "aurelius",
        "symbol": "METH",
        "underlyingTokens": [
          "0xcDA86A272531e8640cD7F1a92c01839911B90bb0"
        ],
        "apy": 0.00001,
        "tvlUsd": 14497,
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
        "smartMoneySignal": null
      },
      "probabilities": {
        "exploit": 0.023215341335222617,
        "depeg": 0.005,
        "oracle": 0.007,
        "illiquid": 0.05838721861092291,
        "counterparty": 0.005
      },
      "severities": {
        "exploit": 0.85,
        "depeg": 0.2,
        "oracle": 0.4,
        "illiquid": 0.05,
        "counterparty": 0.5
      },
      "expectedLoss": 0.02895240106548537,
      "raapy": -0.02895230106548537,
      "confidence": 0.6249875001249992,
      "score": -0.018094826265784052,
      "eligibleTranches": [],
      "primaryTranche": null,
      "rejectionReasons": [
        {
          "tranche": "senior",
          "reasons": [
            "expectedLoss 0.0290 > 0.02",
            "tvlUsd 14497 < 25000000"
          ]
        },
        {
          "tranche": "mezzanine",
          "reasons": [
            "tvlUsd 14497 < 1000000"
          ]
        },
        {
          "tranche": "junior",
          "reasons": [
            "tvlUsd 14497 < 100000"
          ]
        }
      ]
    },
    {
      "id": "mantleVault:ae619265-65fd-4584-8934-16a66dc50af3",
      "source": "mantleVault",
      "asset": "0x09bc4e0d864854c6afb6eb9a9cdf58ac190d0df9",
      "apy": 0.0002029,
      "apyType": "variable",
      "tvlUsd": 10314,
      "lastUpdatedMs": 1779127305482,
      "raw": {
        "chain": "Mantle",
        "project": "minterest",
        "symbol": "USDC",
        "underlyingTokens": [
          "0x09Bc4E0D864854c6aFB6eB9A9cdF58aC190D0dF9"
        ],
        "apy": 0.02029,
        "tvlUsd": 10314,
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
        "smartMoneySignal": null
      },
      "probabilities": {
        "exploit": 0.023653220337358307,
        "depeg": 0.005,
        "oracle": 0.007,
        "illiquid": 0.05986572872929304,
        "counterparty": 0.005
      },
      "severities": {
        "exploit": 0.85,
        "depeg": 0.2,
        "oracle": 0.4,
        "illiquid": 0.05,
        "counterparty": 0.5
      },
      "expectedLoss": 0.029398523723219213,
      "raapy": -0.029195623723219214,
      "confidence": 0.624814610834086,
      "score": -0.01824185227468162,
      "eligibleTranches": [],
      "primaryTranche": null,
      "rejectionReasons": [
        {
          "tranche": "senior",
          "reasons": [
            "expectedLoss 0.0294 > 0.02",
            "tvlUsd 10314 < 25000000"
          ]
        },
        {
          "tranche": "mezzanine",
          "reasons": [
            "tvlUsd 10314 < 1000000"
          ]
        },
        {
          "tranche": "junior",
          "reasons": [
            "tvlUsd 10314 < 100000"
          ]
        }
      ]
    },
    {
      "id": "mantleVault:edc32e93-0feb-4d38-bb73-366bb4a2aace",
      "source": "mantleVault",
      "asset": "0xdeaddeaddeaddeaddeaddeaddeaddeaddead1111",
      "apy": 0.000047600000000000005,
      "apyType": "variable",
      "tvlUsd": 10272,
      "lastUpdatedMs": 1779127305482,
      "raw": {
        "chain": "Mantle",
        "project": "minterest",
        "symbol": "WETH",
        "underlyingTokens": [
          "0xdEAddEaDdeadDEadDEADDEAddEADDEAddead1111"
        ],
        "apy": 0.00476,
        "tvlUsd": 10272,
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
        "smartMoneySignal": null
      },
      "probabilities": {
        "exploit": 0.02365846867842529,
        "depeg": 0.005,
        "oracle": 0.007,
        "illiquid": 0.059883449892752225,
        "counterparty": 0.005
      },
      "severities": {
        "exploit": 0.85,
        "depeg": 0.2,
        "oracle": 0.4,
        "illiquid": 0.05,
        "counterparty": 0.5
      },
      "expectedLoss": 0.029403870871299108,
      "raapy": -0.02935627087129911,
      "confidence": 0.6249875001249992,
      "score": -0.01834730234484556,
      "eligibleTranches": [],
      "primaryTranche": null,
      "rejectionReasons": [
        {
          "tranche": "senior",
          "reasons": [
            "expectedLoss 0.0294 > 0.02",
            "tvlUsd 10272 < 25000000"
          ]
        },
        {
          "tranche": "mezzanine",
          "reasons": [
            "tvlUsd 10272 < 1000000"
          ]
        },
        {
          "tranche": "junior",
          "reasons": [
            "tvlUsd 10272 < 100000"
          ]
        }
      ]
    },
    {
      "id": "mantleVault:3441a15d-5f50-4a52-af27-597c182c5c4a",
      "source": "mantleVault",
      "asset": "0x201eba5cc46d216ce6dc03f6a759e8e766e956ae",
      "apy": 0.00042009999999999997,
      "apyType": "variable",
      "tvlUsd": 6326,
      "lastUpdatedMs": 1779127305482,
      "raw": {
        "chain": "Mantle",
        "project": "minterest",
        "symbol": "USDT",
        "underlyingTokens": [
          "0x201EBa5CC46D216Ce6DC03F6a759e8E766e956aE"
        ],
        "apy": 0.04201,
        "tvlUsd": 6326,
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
        "smartMoneySignal": null
      },
      "probabilities": {
        "exploit": 0.02428196686228744,
        "depeg": 0.005,
        "oracle": 0.007,
        "illiquid": 0.061988708124202964,
        "counterparty": 0.005
      },
      "severities": {
        "exploit": 0.85,
        "depeg": 0.2,
        "oracle": 0.4,
        "illiquid": 0.05,
        "counterparty": 0.5
      },
      "expectedLoss": 0.030039107239154473,
      "raapy": -0.029619007239154473,
      "confidence": 0.624800031996587,
      "score": -0.018505956670730857,
      "eligibleTranches": [],
      "primaryTranche": null,
      "rejectionReasons": [
        {
          "tranche": "senior",
          "reasons": [
            "expectedLoss 0.0300 > 0.02",
            "tvlUsd 6326 < 25000000"
          ]
        },
        {
          "tranche": "mezzanine",
          "reasons": [
            "tvlUsd 6326 < 1000000"
          ]
        },
        {
          "tranche": "junior",
          "reasons": [
            "tvlUsd 6326 < 100000"
          ]
        }
      ]
    },
    {
      "id": "mantleVault:7be673f4-8b41-4d3f-a533-45d20d62e8fa",
      "source": "mantleVault",
      "asset": "0xcabae6f6ea1ecab08ad02fe02ce9a44f09aebfa2",
      "apy": 0.0073364,
      "apyType": "variable",
      "tvlUsd": 5849,
      "lastUpdatedMs": 1779127305482,
      "raw": {
        "chain": "Mantle",
        "project": "lendle-pooled-markets",
        "symbol": "WBTC",
        "underlyingTokens": [
          "0xCAbAE6f6Ea1ecaB08Ad02fE02ce9A44F09aebfA2"
        ],
        "apy": 0.73364,
        "tvlUsd": 5849,
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
        "smartMoneySignal": null
      },
      "probabilities": {
        "exploit": 0.02438280292782897,
        "depeg": 0.005,
        "oracle": 0.007,
        "illiquid": 0.06232918378636678,
        "counterparty": 0.005
      },
      "severities": {
        "exploit": 0.85,
        "depeg": 0.2,
        "oracle": 0.4,
        "illiquid": 0.05,
        "counterparty": 0.5
      },
      "expectedLoss": 0.03014184167797296,
      "raapy": -0.02280544167797296,
      "confidence": 0.6249875001249992,
      "score": -0.014253115983562787,
      "eligibleTranches": [],
      "primaryTranche": null,
      "rejectionReasons": [
        {
          "tranche": "senior",
          "reasons": [
            "expectedLoss 0.0301 > 0.02",
            "tvlUsd 5849 < 25000000"
          ]
        },
        {
          "tranche": "mezzanine",
          "reasons": [
            "tvlUsd 5849 < 1000000"
          ]
        },
        {
          "tranche": "junior",
          "reasons": [
            "tvlUsd 5849 < 100000"
          ]
        }
      ]
    },
    {
      "id": "mantleVault:f7150467-f302-41e8-9f9a-1f73d2b49df4",
      "source": "mantleVault",
      "asset": "0x5d3a1ff2b6bab83b63cd9ad0787074081a52ef34",
      "apy": 0.4937539,
      "apyType": "variable",
      "tvlUsd": 3206,
      "lastUpdatedMs": 1779127305482,
      "raw": {
        "chain": "Mantle",
        "project": "lendle-pooled-markets",
        "symbol": "USDE",
        "underlyingTokens": [
          "0x5d3a1Ff2b6BAb83b63cd9AD0787074081a52ef34"
        ],
        "apy": 49.37539,
        "tvlUsd": 3206,
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
        "smartMoneySignal": null
      },
      "probabilities": {
        "exploit": 0.025156136387720348,
        "depeg": 0.005,
        "oracle": 0.007,
        "illiquid": 0.06494036481981874,
        "counterparty": 0.005
      },
      "severities": {
        "exploit": 0.85,
        "depeg": 0.2,
        "oracle": 0.4,
        "illiquid": 0.05,
        "counterparty": 0.5
      },
      "expectedLoss": 0.03092973417055323,
      "raapy": 0.4628241658294468,
      "confidence": 0.6248125281221877,
      "score": 0.2891783371279393,
      "eligibleTranches": [],
      "primaryTranche": null,
      "rejectionReasons": [
        {
          "tranche": "senior",
          "reasons": [
            "expectedLoss 0.0309 > 0.02",
            "tvlUsd 3206 < 25000000",
            "apy 49.38% > 8% (too-good-to-be-true gate)"
          ]
        },
        {
          "tranche": "mezzanine",
          "reasons": [
            "tvlUsd 3206 < 1000000",
            "apy 49.38% > 20% (too-good-to-be-true gate)"
          ]
        },
        {
          "tranche": "junior",
          "reasons": [
            "tvlUsd 3206 < 100000"
          ]
        }
      ]
    },
    {
      "id": "mantleVault:a5a47cdc-2ca5-4348-ade9-4adddb1d12d5",
      "source": "mantleVault",
      "asset": "0xe6829d9a7ee3040e1276fa75293bde931859e8fa",
      "apy": 0.0002103,
      "apyType": "variable",
      "tvlUsd": 2269,
      "lastUpdatedMs": 1779127305482,
      "raw": {
        "chain": "Mantle",
        "project": "minterest",
        "symbol": "CMETH",
        "underlyingTokens": [
          "0xE6829d9a7eE3040e1276Fa75293Bde931859e8fA"
        ],
        "apy": 0.02103,
        "tvlUsd": 2269,
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
        "smartMoneySignal": null
      },
      "probabilities": {
        "exploit": 0.025600761998235314,
        "depeg": 0.005,
        "oracle": 0.007,
        "illiquid": 0.06644165504115065,
        "counterparty": 0.005
      },
      "severities": {
        "exploit": 0.85,
        "depeg": 0.2,
        "oracle": 0.4,
        "illiquid": 0.05,
        "counterparty": 0.5
      },
      "expectedLoss": 0.031382730450557554,
      "raapy": -0.031172430450557554,
      "confidence": 0.6249875001249992,
      "score": -0.019482379380114368,
      "eligibleTranches": [],
      "primaryTranche": null,
      "rejectionReasons": [
        {
          "tranche": "senior",
          "reasons": [
            "expectedLoss 0.0314 > 0.02",
            "tvlUsd 2269 < 25000000"
          ]
        },
        {
          "tranche": "mezzanine",
          "reasons": [
            "tvlUsd 2269 < 1000000"
          ]
        },
        {
          "tranche": "junior",
          "reasons": [
            "tvlUsd 2269 < 100000"
          ]
        }
      ]
    },
    {
      "id": "mantleVault:dce58852-9976-4141-b26a-a832c5edc34e",
      "source": "mantleVault",
      "asset": "0x201eba5cc46d216ce6dc03f6a759e8e766e956ae",
      "apy": 0.5126761,
      "apyType": "variable",
      "tvlUsd": 2246,
      "lastUpdatedMs": 1779127305482,
      "raw": {
        "chain": "Mantle",
        "project": "lendle-pooled-markets",
        "symbol": "USDT",
        "underlyingTokens": [
          "0x201EBa5CC46D216Ce6DC03F6a759e8E766e956aE"
        ],
        "apy": 51.26761,
        "tvlUsd": 2246,
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
        "smartMoneySignal": null
      },
      "probabilities": {
        "exploit": 0.02561386642305877,
        "depeg": 0.005,
        "oracle": 0.007,
        "illiquid": 0.06648590248074562,
        "counterparty": 0.005
      },
      "severities": {
        "exploit": 0.85,
        "depeg": 0.2,
        "oracle": 0.4,
        "illiquid": 0.05,
        "counterparty": 0.5
      },
      "expectedLoss": 0.031396081583637235,
      "raapy": 0.48128001841636275,
      "confidence": 0.6248021146668313,
      "score": 0.300704773253435,
      "eligibleTranches": [],
      "primaryTranche": null,
      "rejectionReasons": [
        {
          "tranche": "senior",
          "reasons": [
            "expectedLoss 0.0314 > 0.02",
            "tvlUsd 2246 < 25000000",
            "apy 51.27% > 8% (too-good-to-be-true gate)"
          ]
        },
        {
          "tranche": "mezzanine",
          "reasons": [
            "tvlUsd 2246 < 1000000",
            "apy 51.27% > 20% (too-good-to-be-true gate)"
          ]
        },
        {
          "tranche": "junior",
          "reasons": [
            "tvlUsd 2246 < 100000"
          ]
        }
      ]
    },
    {
      "id": "mantleVault:1362a09f-4853-492b-8083-34e0df20e17b",
      "source": "mantleVault",
      "asset": "0xc96de26018a54d51c097160568752c4e3bd6c364",
      "apy": 0.0000064000000000000006,
      "apyType": "variable",
      "tvlUsd": 2068,
      "lastUpdatedMs": 1779127305482,
      "raw": {
        "chain": "Mantle",
        "project": "minterest",
        "symbol": "FBTC",
        "underlyingTokens": [
          "0xC96dE26018A54D51c097160568752c4E3BD6C364"
        ],
        "apy": 0.00064,
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
        "smartMoneySignal": null
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
      "confidence": 0.6249875001249992,
      "score": -0.019685782819449566,
      "eligibleTranches": [],
      "primaryTranche": null,
      "rejectionReasons": [
        {
          "tranche": "senior",
          "reasons": [
            "expectedLoss 0.0315 > 0.02",
            "tvlUsd 2068 < 25000000"
          ]
        },
        {
          "tranche": "mezzanine",
          "reasons": [
            "tvlUsd 2068 < 1000000"
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
      "apy": 4.2573235,
      "apyType": "variable",
      "tvlUsd": 863,
      "lastUpdatedMs": 1779127305482,
      "raw": {
        "chain": "Mantle",
        "project": "lendle-pooled-markets",
        "symbol": "AUSD",
        "underlyingTokens": [
          "0x00000000eFE302BEAA2b3e6e1b18d08D69a9012a"
        ],
        "apy": 425.73235,
        "tvlUsd": 863,
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
        "smartMoneySignal": null
      },
      "probabilities": {
        "exploit": 0.026844121652113667,
        "depeg": 0.005,
        "oracle": 0.007,
        "illiquid": 0.0706398920428479,
        "counterparty": 0.005
      },
      "severities": {
        "exploit": 0.85,
        "depeg": 0.2,
        "oracle": 0.4,
        "illiquid": 0.05,
        "counterparty": 0.5
      },
      "expectedLoss": 0.032649498006439015,
      "raapy": 4.224674001993561,
      "confidence": 0.6249875001249992,
      "score": 2.6403684433490313,
      "eligibleTranches": [],
      "primaryTranche": null,
      "rejectionReasons": [
        {
          "tranche": "senior",
          "reasons": [
            "expectedLoss 0.0326 > 0.02",
            "tvlUsd 863 < 25000000",
            "apy 425.73% > 8% (too-good-to-be-true gate)"
          ]
        },
        {
          "tranche": "mezzanine",
          "reasons": [
            "tvlUsd 863 < 1000000",
            "apy 425.73% > 20% (too-good-to-be-true gate)"
          ]
        },
        {
          "tranche": "junior",
          "reasons": [
            "tvlUsd 863 < 100000"
          ]
        }
      ]
    },
    {
      "id": "mantleVault:46cbb5d7-5462-443b-886a-f371349a5d8c",
      "source": "mantleVault",
      "asset": "0x5be26527e817998a7206475496fde1e68957c5a6",
      "apy": 0.011708799999999998,
      "apyType": "variable",
      "tvlUsd": 815,
      "lastUpdatedMs": 1779127305482,
      "raw": {
        "chain": "Mantle",
        "project": "minterest",
        "symbol": "USDY",
        "underlyingTokens": [
          "0x5bE26527e817998A7206475496fDE1E68957c5A6"
        ],
        "apy": 1.17088,
        "tvlUsd": 815,
        "pool": "46cbb5d7-5462-443b-886a-f371349a5d8c"
      },
      "risk": {
        "contractAgeDays": 365,
        "auditFactor": 0.6,
        "tvlFactor": null,
        "depegEvents": [
          {
            "startMs": 1747676461000,
            "endMs": null,
            "maxDeviation": 0.15263604122276564,
            "recoveryHours": null
          }
        ],
        "oracleType": "redstone",
        "liquiditySlippageBps": null,
        "counterpartyClass": "permissionless",
        "smartMoneySignal": null
      },
      "probabilities": {
        "exploit": 0.026917727429831326,
        "depeg": 0.0004181809348568922,
        "oracle": 0.007,
        "illiquid": 0.07088842391260024,
        "counterparty": 0.005
      },
      "severities": {
        "exploit": 0.85,
        "depeg": 0.2,
        "oracle": 0.4,
        "illiquid": 0.05,
        "counterparty": 0.5
      },
      "expectedLoss": 0.03180812569795802,
      "raapy": -0.02009932569795802,
      "confidence": 0.6248125281221877,
      "score": -0.012558310502892404,
      "eligibleTranches": [],
      "primaryTranche": null,
      "rejectionReasons": [
        {
          "tranche": "senior",
          "reasons": [
            "expectedLoss 0.0318 > 0.02",
            "tvlUsd 815 < 25000000"
          ]
        },
        {
          "tranche": "mezzanine",
          "reasons": [
            "tvlUsd 815 < 1000000"
          ]
        },
        {
          "tranche": "junior",
          "reasons": [
            "tvlUsd 815 < 100000"
          ]
        }
      ]
    },
    {
      "id": "mantleVault:4f9047f1-ca9f-4b30-b5ad-c7a900c38cae",
      "source": "mantleVault",
      "asset": "0xdeaddeaddeaddeaddeaddeaddeaddeaddead1111",
      "apy": 0.8196487,
      "apyType": "variable",
      "tvlUsd": 229,
      "lastUpdatedMs": 1779127305482,
      "raw": {
        "chain": "Mantle",
        "project": "lendle-pooled-markets",
        "symbol": "WETH",
        "underlyingTokens": [
          "0xdEAddEaDdeadDEadDEADDEAddEADDEAddead1111"
        ],
        "apy": 81.96487,
        "tvlUsd": 229,
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
        "smartMoneySignal": null
      },
      "probabilities": {
        "exploit": 0.028550535887236564,
        "depeg": 0.005,
        "oracle": 0.007,
        "illiquid": 0.07640164517660113,
        "counterparty": 0.005
      },
      "severities": {
        "exploit": 0.85,
        "depeg": 0.2,
        "oracle": 0.4,
        "illiquid": 0.05,
        "counterparty": 0.5
      },
      "expectedLoss": 0.03438803776298114,
      "raapy": 0.7852606622370188,
      "confidence": 0.6249875001249992,
      "score": 0.4907780982380157,
      "eligibleTranches": [],
      "primaryTranche": null,
      "rejectionReasons": [
        {
          "tranche": "senior",
          "reasons": [
            "expectedLoss 0.0344 > 0.02",
            "tvlUsd 229 < 25000000",
            "apy 81.96% > 8% (too-good-to-be-true gate)"
          ]
        },
        {
          "tranche": "mezzanine",
          "reasons": [
            "tvlUsd 229 < 1000000",
            "apy 81.96% > 20% (too-good-to-be-true gate)"
          ]
        },
        {
          "tranche": "junior",
          "reasons": [
            "tvlUsd 229 < 100000"
          ]
        }
      ]
    },
    {
      "id": "mantleVault:c91016e0-d075-4bb4-a1c7-465f1c11dc14",
      "source": "mantleVault",
      "asset": "0x211cc4dd073734da055fbf44a2b4667d5e5fe5d2",
      "apy": 0.0761987,
      "apyType": "variable",
      "tvlUsd": 26,
      "lastUpdatedMs": 1779127305482,
      "raw": {
        "chain": "Mantle",
        "project": "lendle-pooled-markets",
        "symbol": "SUSDE",
        "underlyingTokens": [
          "0x211Cc4DD073734dA055fbF44a2b4667d5E5fE5d2"
        ],
        "apy": 7.61987,
        "tvlUsd": 26,
        "pool": "c91016e0-d075-4bb4-a1c7-465f1c11dc14"
      },
      "risk": {
        "contractAgeDays": 365,
        "auditFactor": 0.6,
        "tvlFactor": null,
        "depegEvents": [
          {
            "startMs": 1747676705000,
            "endMs": null,
            "maxDeviation": 0.23092653438425348,
            "recoveryHours": null
          }
        ],
        "oracleType": "redstone",
        "liquiditySlippageBps": null,
        "counterpartyClass": "permissionless",
        "smartMoneySignal": null
      },
      "probabilities": {
        "exploit": 0.03134886160319051,
        "depeg": 0.0006326754366691876,
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
      "expectedLoss": 0.03636558077606036,
      "raapy": 0.03983311922393963,
      "confidence": 0.6248021146668313,
      "score": 0.024887817124893494,
      "eligibleTranches": [],
      "primaryTranche": null,
      "rejectionReasons": [
        {
          "tranche": "senior",
          "reasons": [
            "expectedLoss 0.0364 > 0.02",
            "tvlUsd 26 < 25000000"
          ]
        },
        {
          "tranche": "mezzanine",
          "reasons": [
            "tvlUsd 26 < 1000000"
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
      "id": "aave:4a0e9f84-09a0-491a-aa5e-269813d31a59",
      "source": "aave",
      "asset": "0xdeaddeaddeaddeaddeaddeaddeaddeaddead1111",
      "apy": 0.0255,
      "apyType": "variable",
      "tvlUsd": 0,
      "lastUpdatedMs": 1779127305482,
      "raw": {
        "chain": "Mantle",
        "project": "aave-v3",
        "symbol": "WETH",
        "underlyingTokens": [
          "0xdEAddEaDdeadDEadDEADDEAddEADDEAddead1111"
        ],
        "apy": 2.55,
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
        "smartMoneySignal": null
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
      "raapy": 0.013851288311778278,
      "confidence": 0.6249875001249992,
      "score": 0.008656882055488925,
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
      "id": "aave:125974d5-ad17-4a3a-b967-ebbf721fca22",
      "source": "aave",
      "asset": "0xfc421ad3c883bf9e7c4f42de845c4e4405799e73",
      "apy": 0.0562368,
      "apyType": "variable",
      "tvlUsd": 0,
      "lastUpdatedMs": 1779127305482,
      "raw": {
        "chain": "Mantle",
        "project": "aave-v3",
        "symbol": "GHO",
        "underlyingTokens": [
          "0xfc421aD3C883Bf9E7C4f42dE845C4e4405799e73"
        ],
        "apy": 5.62368,
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
        "smartMoneySignal": null
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
      "raapy": 0.04458808831177828,
      "confidence": 0.6249875001249992,
      "score": 0.027866997849331002,
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
      "id": "mantleVault:341123b4-b690-4d10-b2f8-b8fa64119220",
      "source": "mantleVault",
      "asset": "0x09bc4e0d864854c6afb6eb9a9cdf58ac190d0df9",
      "apy": 0.7161308,
      "apyType": "variable",
      "tvlUsd": 0,
      "lastUpdatedMs": 1779127305482,
      "raw": {
        "chain": "Mantle",
        "project": "lendle-pooled-markets",
        "symbol": "USDC",
        "underlyingTokens": [
          "0x09Bc4E0D864854c6aFB6eB9A9cdF58aC190D0dF9"
        ],
        "apy": 71.61308,
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
        "smartMoneySignal": null
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
      "raapy": 0.674622242302014,
      "confidence": 0.6248021146668313,
      "score": 0.4215054035915778,
      "eligibleTranches": [],
      "primaryTranche": null,
      "rejectionReasons": [
        {
          "tranche": "senior",
          "reasons": [
            "expectedLoss 0.0415 > 0.02",
            "tvlUsd 0 < 25000000",
            "apy 71.61% > 8% (too-good-to-be-true gate)"
          ]
        },
        {
          "tranche": "mezzanine",
          "reasons": [
            "expectedLoss 0.0415 > 0.04",
            "tvlUsd 0 < 1000000",
            "apy 71.61% > 20% (too-good-to-be-true gate)"
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
      "aave:a4e37545-203b-4412-9acd-3e8b1aa4d744",
      "ondo:b5d7a190-38d2-4fdd-8c14-1fd00c11bce1"
    ],
    "mezzanine": [
      "aave:32cb38a5-b9b9-441a-bf07-8fab47b999d3",
      "aave:47da0cdd-7b1d-4927-9545-20b53b73afa8",
      "aave:a4e37545-203b-4412-9acd-3e8b1aa4d744",
      "aave:76b70b33-d8a4-4e61-8092-9bd1f2be2fc9",
      "ondo:b5d7a190-38d2-4fdd-8c14-1fd00c11bce1"
    ],
    "junior": [
      "agni:35f2103d-231b-443b-952e-d2cd118d8f29",
      "agni:85407ecd-f711-4fa6-9328-3078aebfaa95",
      "agni:6d76a4e2-57f2-4190-a882-bd69f6ea32fb",
      "aave:32cb38a5-b9b9-441a-bf07-8fab47b999d3",
      "aave:47da0cdd-7b1d-4927-9545-20b53b73afa8",
      "aave:a4e37545-203b-4412-9acd-3e8b1aa4d744",
      "aave:76b70b33-d8a4-4e61-8092-9bd1f2be2fc9",
      "agni:ebec73de-fd1e-4f97-8287-d9cb01c7d352",
      "ondo:b5d7a190-38d2-4fdd-8c14-1fd00c11bce1",
      "agni:2a510869-6356-4486-8bb5-d5a808634496",
      "agni:a7e2f58e-1c93-4592-acd6-8e40e6cb26ff",
      "agni:a4ff3d7c-a117-4b24-a9f9-6af46cd276c0",
      "agni:649bee89-0a34-4eb1-b8ab-7c5fdee07ccd",
      "agni:227e8492-33e9-4953-8beb-28973c9fdb8a",
      "agni:30836422-c578-4f77-8f81-861c509c5d4c",
      "agni:2364dd66-69d3-44ef-9e85-4d5217a57b57",
      "agni:3b6b75cf-adb5-4fb4-bbcd-8f75c6879c9d",
      "agni:b8d50460-5237-4601-9250-4f2d3a6b569b",
      "agni:b5933580-18c1-43b6-aec3-2563cd30e3a2",
      "agni:913ce101-55b1-4230-93c7-d523f0d9ca03",
      "agni:3d429d4e-b3a6-4847-957b-b10bf26a6f01",
      "mantleVault:c87c5d7c-0285-47a9-8539-d335f05b9ba2",
      "mantleVault:b96d8236-36d4-4be4-92f7-422beeac7073"
    ]
  },
  "signature": "0x27af77e50fa57717d233227b1d11f5260448970f6d97b70a373170152359429254072d46f8708d3a6002cfa6ed690c2b1331d8aa199089c92a2ba9bc70c1e9c01c"
}
```
