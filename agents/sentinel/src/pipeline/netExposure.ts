export class NetExposureLedger {
  private byAsset = new Map<string, bigint>();
  private lastUpdatedMs = 0;

  apply(asset: `0x${string}` | string, delta: bigint, ts: number): void {
    const key = (asset as string).toLowerCase();
    this.byAsset.set(key, (this.byAsset.get(key) ?? 0n) + delta);
    if (ts > this.lastUpdatedMs) this.lastUpdatedMs = ts;
  }

  snapshot(): Record<string, bigint> {
    return Object.fromEntries(this.byAsset.entries());
  }

  serializable(): Record<string, string> {
    return Object.fromEntries([...this.byAsset.entries()].map(([k, v]) => [k, v.toString()]));
  }

  lastUpdated(): number { return this.lastUpdatedMs; }
}
