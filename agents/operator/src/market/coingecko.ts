const BASE = 'https://api.coingecko.com/api/v3/simple/token_price/mantle';
const FETCH_TIMEOUT_MS = 10_000;

export async function fetchSpotUsd(tokenAddress: string, apiKey: string): Promise<number> {
  const ac = new AbortController();
  const t = setTimeout(() => ac.abort(), FETCH_TIMEOUT_MS);
  try {
    const url = `${BASE}?contract_addresses=${tokenAddress.toLowerCase()}&vs_currencies=usd&x_cg_demo_api_key=${apiKey}`;
    const res = await fetch(url, { signal: ac.signal, headers: { accept: 'application/json' } });
    if (!res.ok) throw new Error(`coingecko HTTP ${res.status}`);
    const body = await res.json() as Record<string, { usd?: number }>;
    const entry = body[tokenAddress.toLowerCase()];
    const price = entry?.usd;
    if (price === undefined || price <= 0) {
      throw new Error(`coingecko: no price for ${tokenAddress}`);
    }
    return price;
  } finally { clearTimeout(t); }
}
