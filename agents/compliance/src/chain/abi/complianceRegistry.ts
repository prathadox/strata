export const complianceRegistryAbi = [
  {
    type: 'event',
    name: 'ComplianceReceiptMinted',
    inputs: [
      { name: 'wallet',                      type: 'address', indexed: true },
      { name: 'receiptId',                   type: 'uint256', indexed: true },
      { name: 'policyTokenId',               type: 'uint256', indexed: true },
      { name: 'permittedTranchesMask',        type: 'uint8',   indexed: false },
      { name: 'kycExpiresAtSec',             type: 'uint64',  indexed: false },
      { name: 'sanctionsScreenExpiresAtSec', type: 'uint64',  indexed: false },
      { name: 'tokenURI',                    type: 'string',  indexed: false }
    ]
  },
  {
    type: 'event',
    name: 'ComplianceCheckCompleted',
    inputs: [
      { name: 'opaqueOutcomeHash',   type: 'bytes32', indexed: false },
      { name: 'blockTimestampBatch', type: 'uint64',  indexed: false }
    ]
  },
  {
    type: 'event',
    name: 'ReceiptRevoked',
    inputs: [
      { name: 'receiptId',  type: 'uint256', indexed: true },
      { name: 'reasonHash', type: 'bytes32', indexed: false }
    ]
  },
  {
    type: 'function',
    name: 'mintComplianceReceipt',
    stateMutability: 'nonpayable',
    inputs: [
      { name: 'wallet',                      type: 'address' },
      { name: 'policyTokenId',               type: 'uint256' },
      { name: 'permittedTranchesMask',        type: 'uint8' },
      { name: 'kycExpiresAtSec',             type: 'uint64' },
      { name: 'sanctionsScreenExpiresAtSec', type: 'uint64' },
      { name: 'tokenURI',                    type: 'string' }
    ],
    outputs: [
      { name: 'receiptId', type: 'uint256' }
    ]
  },
  {
    type: 'function',
    name: 'refreshSanctionsScreen',
    stateMutability: 'nonpayable',
    inputs: [
      { name: 'receiptId',                      type: 'uint256' },
      { name: 'newSanctionsScreenExpiresAtSec', type: 'uint64' },
      { name: 'newScreenCid',                   type: 'string' }
    ],
    outputs: []
  },
  {
    type: 'function',
    name: 'revokeReceipt',
    stateMutability: 'nonpayable',
    inputs: [
      { name: 'receiptId',  type: 'uint256' },
      { name: 'reasonHash', type: 'bytes32' }
    ],
    outputs: []
  },
  {
    type: 'function',
    name: 'canDeposit',
    stateMutability: 'view',
    inputs: [
      { name: 'wallet',    type: 'address' },
      { name: 'trancheId', type: 'uint8' }
    ],
    outputs: [
      { name: '', type: 'bool' }
    ]
  },
  {
    type: 'function',
    name: 'activeReceipt',
    stateMutability: 'view',
    inputs: [
      { name: 'wallet', type: 'address' }
    ],
    outputs: [
      { name: 'receiptId',    type: 'uint256' },
      { name: 'mask',         type: 'uint8' },
      { name: 'kycExp',       type: 'uint64' },
      { name: 'sanctionsExp', type: 'uint64' }
    ]
  }
] as const;
