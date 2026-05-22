export const agentEventBusAbi = [
  {
    type: 'function',
    name: 'issueRiskVerdict',
    stateMutability: 'nonpayable',
    inputs: [
      { name: 'proposalId',     type: 'uint256' },
      { name: 'seniorVerdict',  type: 'uint8' },
      { name: 'mezzVerdict',    type: 'uint8' },
      { name: 'juniorVerdict',  type: 'uint8' },
      { name: 'reasoningHash',  type: 'string' }
    ],
    outputs: []
  },
  {
    type: 'function',
    name: 'emitHedgeSignal',
    stateMutability: 'nonpayable',
    inputs: [
      { name: 'hedgedAsset',         type: 'address' },
      { name: 'targetNotionalUsd',   type: 'int256' },
      { name: 'reasoningHash',       type: 'string' }
    ],
    outputs: []
  }
] as const;
