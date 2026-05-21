import { callGeminiText } from './gemini.js';
import type { AllocationProposal } from '../types.js';

export async function generateNarrative(
  proposal: Omit<AllocationProposal, 'signature' | 'narrative'>,
  apiKey: string | undefined,
  model: string
): Promise<string | null> {
  if (!apiKey) return null;
  const prompt = [
    'You are explaining a yield protocol allocation decision in plain English. 200 words or less.',
    'Do NOT invent numbers. Use only the data given.',
    '',
    `Yield Map CID: ${proposal.sourceMapCid}`,
    `Methodology hash: ${proposal.methodologyHash}`,
    '',
    `Senior allocation (${proposal.tranches.senior.bps} bps of total deposits):`,
    ...Object.entries(proposal.tranches.senior.positions).map(([id, bps]) => `  ${id}: ${bps} bps`),
    `Mezzanine allocation (${proposal.tranches.mezzanine.bps} bps):`,
    ...Object.entries(proposal.tranches.mezzanine.positions).map(([id, bps]) => `  ${id}: ${bps} bps`),
    `Junior allocation (${proposal.tranches.junior.bps} bps):`,
    ...Object.entries(proposal.tranches.junior.positions).map(([id, bps]) => `  ${id}: ${bps} bps`),
    '',
    'Write 2-3 short paragraphs. Lead with the senior tranche rationale. Be concrete.'
  ].join('\n');
  return callGeminiText(prompt, apiKey, model);
}
