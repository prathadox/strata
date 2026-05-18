import { describe, it, expect } from 'vitest';
import { LastPublished } from '../../src/cache/lastPublished.js';

describe('LastPublished', () => {
  it('shouldPublish on first call (no prior state)', () => {
    const lp = new LastPublished();
    expect(lp.shouldPublish('cid1')).toBe(true);
    expect(lp.get()).toBeNull();
  });

  it('skips when cid matches previous', () => {
    const lp = new LastPublished();
    lp.record({ cid: 'cid1', mapHash: '0xabc', publishedAtMs: 1 });
    expect(lp.shouldPublish('cid1')).toBe(false);
  });

  it('publishes when cid differs', () => {
    const lp = new LastPublished();
    lp.record({ cid: 'cid1', mapHash: '0xabc', publishedAtMs: 1 });
    expect(lp.shouldPublish('cid2')).toBe(true);
  });

  it('get returns the last recorded state', () => {
    const lp = new LastPublished();
    lp.record({ cid: 'cid1', mapHash: '0xabc', publishedAtMs: 42 });
    expect(lp.get()).toEqual({ cid: 'cid1', mapHash: '0xabc', publishedAtMs: 42 });
  });
});
