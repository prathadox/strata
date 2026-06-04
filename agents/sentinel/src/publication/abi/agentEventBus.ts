export const agentEventBusAbi = [
  {
    type: 'function',
    name: 'issueRiskVerdict',
    stateMutability: 'nonpayable',
    inputs: [
      { name: 'proposalId',  type: 'uint256' },
      { name: 'isApproved',  type: 'bool' },
      { name: 'conditionCid', type: 'string' }
    ],
    outputs: []
  },
  {
    type: 'function',
    name: 'emitHedgeSignal',
    stateMutability: 'nonpayable',
    inputs: [
      { name: 'underlyingAsset',   type: 'address' },
      { name: 'deltaSize',         type: 'int256' },
      { name: 'reasoningCid',      type: 'string' }
    ],
    outputs: [
      { name: 'signalId', type: 'uint256' }
    ]
  },
  {
    type: 'function',
    name: 'setAssetRiskRating',
    stateMutability: 'nonpayable',
    inputs: [
      { name: 'proposalId', type: 'uint256' },
      { name: 'trancheId',  type: 'uint8' },
      { name: 'asset',      type: 'address' },
      { name: 'rating',     type: 'uint8' },
      { name: 'noteCid',    type: 'string' }
    ],
    outputs: []
  },
  {
    type: 'event',
    name: 'HedgeSignalEmitted',
    inputs: [
      { name: 'signalId',        type: 'uint256', indexed: true },
      { name: 'agent',           type: 'address', indexed: true },
      { name: 'underlyingAsset', type: 'address', indexed: true },
      { name: 'deltaSize',       type: 'int256',  indexed: false },
      { name: 'reasoningCid',    type: 'string',  indexed: false }
    ]
  }
] as const;
