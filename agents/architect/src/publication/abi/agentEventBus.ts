export const agentEventBusAbi = [
  {
    type: 'function',
    name: 'proposeAllocation',
    stateMutability: 'nonpayable',
    inputs: [
      { name: 'proposalId', type: 'uint256' },
      { name: 'seniorBps', type: 'uint256' },
      { name: 'mezzBps', type: 'uint256' },
      { name: 'juniorBps', type: 'uint256' },
      { name: 'reasoningHash', type: 'string' }
    ],
    outputs: []
  }
] as const;
