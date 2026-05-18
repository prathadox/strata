export interface LastPublishedRecord {
  cid: string;
  mapHash: string;
  publishedAtMs: number;
}

export class LastPublished {
  private state: LastPublishedRecord | null = null;

  shouldPublish(newCid: string): boolean {
    return this.state?.cid !== newCid;
  }

  record(r: LastPublishedRecord): void {
    this.state = r;
  }

  get(): LastPublishedRecord | null {
    return this.state;
  }
}
