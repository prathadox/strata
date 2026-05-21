export class NetExposureLedger {
  private positions = new Map<string, { net: bigint; lastUpdatedMs: number }>();

  apply(asset: `0x${string}`, netPosition: bigint, atMs: number): void {
    this.positions.set(asset.toLowerCase(), { net: netPosition, lastUpdatedMs: atMs });
  }

  get(asset: `0x${string}`): bigint {
    return this.positions.get(asset.toLowerCase())?.net ?? 0n;
  }

  snapshot(): Record<string, string> {
    const out: Record<string, string> = {};
    for (const [asset, { net }] of this.positions) out[asset] = net.toString();
    return out;
  }
}
