import { describe, it, expect } from 'vitest';
import {
  createStubSanctionsOracle,
  STUB_DENIED_ADDRESSES
} from '../../src/adapters/stubSanctions.js';

const FIXED_TS = 1_700_000_000;
const oracle = createStubSanctionsOracle({ now: () => FIXED_TS });

describe('stubSanctionsOracle', () => {
  it('clean wallet returns clear=true, provider=stub', async () => {
    const result = await oracle.screen('0xAbC0000000000000000000000000000000000001');
    expect(result.clear).toBe(true);
    expect(result.provider).toBe('stub');
    expect(result.wallet).toBe('0xAbC0000000000000000000000000000000000001');
    expect(result.screenedAtSec).toBe(FIXED_TS);
  });

  it('denied wallet 0x...dEaD returns clear=false', async () => {
    const result = await oracle.screen(STUB_DENIED_ADDRESSES[0]);
    expect(result.clear).toBe(false);
    expect(result.provider).toBe('stub');
  });

  it('denied wallet 0x111...111 returns clear=false', async () => {
    const result = await oracle.screen(STUB_DENIED_ADDRESSES[1]);
    expect(result.clear).toBe(false);
  });

  it('case insensitivity: uppercase denied address still returns clear=false', async () => {
    const upper = STUB_DENIED_ADDRESSES[0].toUpperCase() as `0x${string}`;
    const result = await oracle.screen(upper);
    expect(result.clear).toBe(false);
  });

  it('resultHash is deterministic for same wallet and timestamp', async () => {
    const a = await oracle.screen('0xAbC0000000000000000000000000000000000001');
    const b = await oracle.screen('0xAbC0000000000000000000000000000000000001');
    expect(a.resultHash).toBe(b.resultHash);
    expect(a.resultHash).toMatch(/^0x[a-f0-9]{64}$/);
  });
});
