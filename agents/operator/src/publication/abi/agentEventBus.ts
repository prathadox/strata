export const agentEventBusAbi = [
  {
    type: 'function',
    name: 'logHedge',
    stateMutability: 'nonpayable',
    inputs: [
      { name: 'signalId',       type: 'uint256' },
      { name: 'hedgedAsset',    type: 'address' },
      { name: 'netPosition',    type: 'int256' },
      { name: 'executionProof', type: 'string' }
    ],
    outputs: []
  },
  {
    type: 'function',
    name: 'hedgeSignalCount',
    stateMutability: 'view',
    inputs: [],
    outputs: [{ name: '', type: 'uint256' }]
  }
] as const;
