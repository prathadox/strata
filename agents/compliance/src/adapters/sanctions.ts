import type { SanctionsScreenResult } from '../types.js';

export interface SanctionsOracle {
  screen(wallet: `0x${string}`): Promise<SanctionsScreenResult>;
  readonly provider: string;
}
