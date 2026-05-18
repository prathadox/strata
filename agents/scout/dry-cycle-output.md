# Scout dry-cycle inspection

Generated: 2026-05-18T17:44:40.253Z
Ephemeral signer: `0x3e385371848a2A12EDDEEbB63Cc6370280fAcE41`
Map hash: `0x7a3ab38e64dfb782b3bc8d4e157245caa1bca343a88dae03efd94eb3577e81cb`

This file is produced by `scripts/inspect-cycle.ts`. The pipeline runs end to end, fetching real data from DefiLlama (yields + price history). Nansen and Lighthouse are skipped; the signature is over an ephemeral keypair generated at run time.

## Summary

- Opportunities ingested: **6**
- Opportunities scored: **6**
- Senior-eligible: **1**
- Mezzanine-eligible: **4**
- Junior-eligible: **4**

## Per-tranche rankings

### Senior (1)

| Rank | Source | Pool id | APY | RAAPY | Score | TVL |
|---|---|---|---|---|---|---|
| 1 | aave | `aave:a4e37545-203b-4412-9acd-3e8b1aa4d744` | 4.00% | 3.47% | 0.0211 | $64,261,826 |

### Mezzanine (4)

| Rank | Source | Pool id | APY | RAAPY | Score | TVL |
|---|---|---|---|---|---|---|
| 1 | aave | `aave:32cb38a5-b9b9-441a-bf07-8fab47b999d3` | 5.76% | 5.06% | 0.0306 | $5,505,919 |
| 2 | aave | `aave:47da0cdd-7b1d-4927-9545-20b53b73afa8` | 5.38% | 4.73% | 0.0296 | $24,552,530 |
| 3 | aave | `aave:a4e37545-203b-4412-9acd-3e8b1aa4d744` | 4.00% | 3.47% | 0.0211 | $64,261,826 |
| 4 | aave | `aave:76b70b33-d8a4-4e61-8092-9bd1f2be2fc9` | 4.04% | 3.36% | 0.0206 | $9,772,423 |

### Junior (4)

| Rank | Source | Pool id | APY | RAAPY | Score | TVL |
|---|---|---|---|---|---|---|
| 1 | aave | `aave:32cb38a5-b9b9-441a-bf07-8fab47b999d3` | 5.76% | 5.06% | 0.0306 | $5,505,919 |
| 2 | aave | `aave:47da0cdd-7b1d-4927-9545-20b53b73afa8` | 5.38% | 4.73% | 0.0296 | $24,552,530 |
| 3 | aave | `aave:a4e37545-203b-4412-9acd-3e8b1aa4d744` | 4.00% | 3.47% | 0.0211 | $64,261,826 |
| 4 | aave | `aave:76b70b33-d8a4-4e61-8092-9bd1f2be2fc9` | 4.04% | 3.36% | 0.0206 | $9,772,423 |

## All scored opportunities

### aave:a4e37545-203b-4412-9acd-3e8b1aa4d744

- **Source**: aave
- **Asset**: `0x211cc4dd073734da055fbf44a2b4667d5e5fe5d2`
- **APY**: 4.00%
- **TVL**: $64,261,826
- **Probabilities**: exploit=0.00097, depeg=0.00063, oracle=0.00200, illiquid=0.02192, counterparty=0.00500
- **Expected loss**: 0.534% /yr
- **RAAPY**: 3.47%
- **Confidence**: 0.610
- **Score**: 0.0211
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
  - senior: tvlUsd 24552530 < 50000000

### aave:76b70b33-d8a4-4e61-8092-9bd1f2be2fc9

- **Source**: aave
- **Asset**: `0x5d3a1ff2b6bab83b63cd9ad0787074081a52ef34`
- **APY**: 4.04%
- **TVL**: $9,772,423
- **Probabilities**: exploit=0.00115, depeg=0.00500, oracle=0.00200, illiquid=0.03010, counterparty=0.00500
- **Expected loss**: 0.679% /yr
- **RAAPY**: 3.36%
- **Confidence**: 0.611
- **Score**: 0.0206
- **Eligible tranches**: mezzanine, junior
- **Primary tranche**: mezzanine
- **Rejection reasons**:
  - senior: tvlUsd 9772423 < 50000000

### aave:32cb38a5-b9b9-441a-bf07-8fab47b999d3

- **Source**: aave
- **Asset**: `0x09bc4e0d864854c6afb6eb9a9cdf58ac190d0df9`
- **APY**: 5.76%
- **TVL**: $5,505,919
- **Probabilities**: exploit=0.00121, depeg=0.00500, oracle=0.00200, illiquid=0.03259, counterparty=0.00500
- **Expected loss**: 0.696% /yr
- **RAAPY**: 5.06%
- **Confidence**: 0.605
- **Score**: 0.0306
- **Eligible tranches**: mezzanine, junior
- **Primary tranche**: mezzanine
- **Rejection reasons**:
  - senior: tvlUsd 5505919 < 50000000

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
  - senior: expectedLoss 0.0116 > 0.01; tvlUsd 0 < 50000000
  - mezzanine: tvlUsd 0 < 5000000
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
  - senior: expectedLoss 0.0116 > 0.01; tvlUsd 0 < 50000000
  - mezzanine: tvlUsd 0 < 5000000
  - junior: tvlUsd 0 < 100000

## Signed canonical Yield Map

```json
{
  "version": "1.0",
  "publishedAtMs": 1779126280249,
  "publisher": {
    "address": "0x3e385371848a2A12EDDEEbB63Cc6370280fAcE41",
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
      "lastUpdatedMs": 1779126270369,
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
      "confidence": 0.6100484110546907,
      "score": 0.021142416653289902,
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
      "lastUpdatedMs": 1779126270369,
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
      "confidence": 0.624991666722222,
      "score": 0.029580899475161772,
      "eligibleTranches": [
        "mezzanine",
        "junior"
      ],
      "primaryTranche": "mezzanine",
      "rejectionReasons": [
        {
          "tranche": "senior",
          "reasons": [
            "tvlUsd 24552530 < 50000000"
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
      "lastUpdatedMs": 1779126270369,
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
      "confidence": 0.6113369721559109,
      "score": 0.020568257855131507,
      "eligibleTranches": [
        "mezzanine",
        "junior"
      ],
      "primaryTranche": "mezzanine",
      "rejectionReasons": [
        {
          "tranche": "senior",
          "reasons": [
            "tvlUsd 9772423 < 50000000"
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
      "lastUpdatedMs": 1779126270369,
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
      "confidence": 0.6047519151936279,
      "score": 0.030608827985739374,
      "eligibleTranches": [
        "mezzanine",
        "junior"
      ],
      "primaryTranche": "mezzanine",
      "rejectionReasons": [
        {
          "tranche": "senior",
          "reasons": [
            "tvlUsd 5505919 < 50000000"
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
      "lastUpdatedMs": 1779126270369,
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
      "confidence": 0.624991666722222,
      "score": 0.008656939768228337,
      "eligibleTranches": [],
      "primaryTranche": null,
      "rejectionReasons": [
        {
          "tranche": "senior",
          "reasons": [
            "expectedLoss 0.0116 > 0.01",
            "tvlUsd 0 < 50000000"
          ]
        },
        {
          "tranche": "mezzanine",
          "reasons": [
            "tvlUsd 0 < 5000000"
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
      "lastUpdatedMs": 1779126270369,
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
      "confidence": 0.624991666722222,
      "score": 0.027867183629935934,
      "eligibleTranches": [],
      "primaryTranche": null,
      "rejectionReasons": [
        {
          "tranche": "senior",
          "reasons": [
            "expectedLoss 0.0116 > 0.01",
            "tvlUsd 0 < 50000000"
          ]
        },
        {
          "tranche": "mezzanine",
          "reasons": [
            "tvlUsd 0 < 5000000"
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
      "aave:a4e37545-203b-4412-9acd-3e8b1aa4d744"
    ],
    "mezzanine": [
      "aave:32cb38a5-b9b9-441a-bf07-8fab47b999d3",
      "aave:47da0cdd-7b1d-4927-9545-20b53b73afa8",
      "aave:a4e37545-203b-4412-9acd-3e8b1aa4d744",
      "aave:76b70b33-d8a4-4e61-8092-9bd1f2be2fc9"
    ],
    "junior": [
      "aave:32cb38a5-b9b9-441a-bf07-8fab47b999d3",
      "aave:47da0cdd-7b1d-4927-9545-20b53b73afa8",
      "aave:a4e37545-203b-4412-9acd-3e8b1aa4d744",
      "aave:76b70b33-d8a4-4e61-8092-9bd1f2be2fc9"
    ]
  },
  "signature": "0x59870fb69b48d142241fffc4c9b043eee64005c1df792eb844495c5474d1e75f75e89d90d04cf75eec7f65eccfc5caa7af07f5de1171757481c9618756125b4e1c"
}
```
