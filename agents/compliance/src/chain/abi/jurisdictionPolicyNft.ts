export const jurisdictionPolicyNftAbi = [
  {
    type: 'event',
    name: 'JurisdictionPolicyMinted',
    inputs: [
      { name: 'tokenId',              type: 'uint256', indexed: true },
      { name: 'jurisdictionCodeHash', type: 'bytes32', indexed: true },
      { name: 'effectiveFromSec',     type: 'uint64',  indexed: false },
      { name: 'effectiveUntilSec',    type: 'uint64',  indexed: false },
      { name: 'tokenURI',             type: 'string',  indexed: false }
    ]
  },
  {
    type: 'function',
    name: 'mintPolicy',
    stateMutability: 'nonpayable',
    inputs: [
      { name: 'jurisdictionCodeHash', type: 'bytes32' },
      { name: 'effectiveFromSec',     type: 'uint64' },
      { name: 'effectiveUntilSec',    type: 'uint64' },
      { name: 'tokenURI',             type: 'string' }
    ],
    outputs: [
      { name: 'tokenId', type: 'uint256' }
    ]
  },
  {
    type: 'function',
    name: 'activePolicyFor',
    stateMutability: 'view',
    inputs: [
      { name: 'jurisdictionCodeHash', type: 'bytes32' }
    ],
    outputs: [
      { name: 'tokenId', type: 'uint256' }
    ]
  },
  {
    type: 'function',
    name: 'tokenURI',
    stateMutability: 'view',
    inputs: [
      { name: 'tokenId', type: 'uint256' }
    ],
    outputs: [
      { name: '', type: 'string' }
    ]
  }
] as const;
