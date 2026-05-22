export const agentEventBusAbi = [
  {
    type: 'function',
    name: 'logHedge',
    stateMutability: 'nonpayable',
    inputs: [
      { name: 'hedgedAsset',    type: 'address' },
      { name: 'netPosition',    type: 'int256' },
      { name: 'executionProof', type: 'string' }
    ],
    outputs: []
  }
] as const;
