export const policyRevocationRegistryAbi = [
  {
    type: 'event',
    name: 'PolicyRevoked',
    inputs: [
      { name: 'policyTokenId', type: 'uint256', indexed: true },
      { name: 'reasonHash',    type: 'bytes32', indexed: false },
      { name: 'reasonURI',     type: 'string',  indexed: false }
    ]
  },
  {
    type: 'function',
    name: 'revokePolicy',
    stateMutability: 'nonpayable',
    inputs: [
      { name: 'policyTokenId', type: 'uint256' },
      { name: 'reasonHash',    type: 'bytes32' },
      { name: 'reasonURI',     type: 'string' }
    ],
    outputs: []
  },
  {
    type: 'function',
    name: 'revokeReceiptsByPolicy',
    stateMutability: 'nonpayable',
    inputs: [
      { name: 'policyTokenId', type: 'uint256' },
      { name: 'reasonHash',    type: 'bytes32' },
      { name: 'reasonURI',     type: 'string' }
    ],
    outputs: []
  },
  {
    type: 'function',
    name: 'isPolicyRevoked',
    stateMutability: 'view',
    inputs: [
      { name: 'policyTokenId', type: 'uint256' }
    ],
    outputs: [
      { name: '', type: 'bool' }
    ]
  }
] as const;
