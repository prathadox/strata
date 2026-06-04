export const agentEventBusAbi = [
  {
    type: 'function',
    name: 'proposeAllocation',
    stateMutability: 'nonpayable',
    inputs: [
      { name: 'proposalId', type: 'uint256' },
      { name: 'seniorBps', type: 'uint16' },
      { name: 'mezzBps', type: 'uint16' },
      { name: 'juniorBps', type: 'uint16' },
      { name: 'reasoningCid', type: 'string' }
    ],
    outputs: []
  }
] as const;
