export const agentEventBusAbi = [
  {
    type: 'function',
    name: 'publishYieldMap',
    stateMutability: 'nonpayable',
    inputs: [{ name: 'ipfsHash', type: 'string' }],
    outputs: []
  }
] as const;
