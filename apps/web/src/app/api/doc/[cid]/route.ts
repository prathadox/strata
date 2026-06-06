// Server-side proxy that fetches an IPFS CID and returns the JSON body.
// Lighthouse's free gateway 402s on every pinned CID and public gateways are
// flaky / timeout on fresh content. We consult a local CID->doc index first
// (covers every seeded agent cycle), then fall back to gateways for anything
// the seed table doesn't know about. The browser and the keeper both hit
// /api/doc/<cid> so the fallback order is centralized.

import { NextResponse } from 'next/server';
import { getDocByCid } from '@/lib/cidIndex';

const GATEWAYS = [
  (cid: string) => `https://gateway.lighthouse.storage/ipfs/${cid}`,
  (cid: string) => `https://${cid}.ipfs.dweb.link/`,
  (cid: string) => `https://${cid}.ipfs.w3s.link/`,
  (cid: string) => `https://ipfs.io/ipfs/${cid}`,
  (cid: string) => `https://gateway.pinata.cloud/ipfs/${cid}`,
  (cid: string) => `https://nftstorage.link/ipfs/${cid}`
];

async function tryGateway(url: string, timeoutMs: number): Promise<unknown | null> {
  const ctl = new AbortController();
  const timer = setTimeout(() => ctl.abort(), timeoutMs);
  try {
    const res = await fetch(url, { signal: ctl.signal, redirect: 'follow' });
    if (!res.ok) return null;
    const ct = res.headers.get('content-type') ?? '';
    if (ct.includes('application/json')) return await res.json();
    const text = await res.text();
    try { return JSON.parse(text); } catch { return null; }
  } catch {
    return null;
  } finally {
    clearTimeout(timer);
  }
}

export async function GET(_: Request, { params }: { params: { cid: string } }) {
  const { cid } = params;
  if (!/^[A-Za-z0-9]+$/.test(cid)) {
    return NextResponse.json({ error: 'bad cid' }, { status: 400 });
  }

  const seeded = getDocByCid(cid);
  if (seeded) {
    return NextResponse.json(seeded, {
      headers: {
        'cache-control': 'public, max-age=86400, s-maxage=86400, immutable',
        'x-strata-source': 'seed'
      }
    });
  }

  for (const make of GATEWAYS) {
    const url = make(cid);
    const doc = await tryGateway(url, 8000);
    if (doc) {
      return NextResponse.json(doc, {
        headers: { 'cache-control': 'public, max-age=300, s-maxage=86400', 'x-strata-source': 'gateway' }
      });
    }
  }

  return NextResponse.json(
    { error: 'not found on any gateway', cid, tried: GATEWAYS.length },
    { status: 504 }
  );
}
