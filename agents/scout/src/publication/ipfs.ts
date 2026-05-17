import pRetry from 'p-retry';
import { z } from 'zod';

const LighthouseResponse = z.object({ Hash: z.string().min(1) });

export interface PinResult { cid: string; }

async function pinLighthouseOnce(json: unknown, apiKey: string): Promise<string> {
  const boundary = `----strata${Date.now()}${Math.random().toString(36).slice(2)}`;
  const body =
    `--${boundary}\r\n` +
    `Content-Disposition: form-data; name="file"; filename="yield-map.json"\r\n` +
    `Content-Type: application/json\r\n\r\n` +
    JSON.stringify(json) + `\r\n` +
    `--${boundary}--\r\n`;

  const res = await globalThis.fetch('https://node.lighthouse.storage/api/v0/add', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': `multipart/form-data; boundary=${boundary}`
    },
    body
  });
  if (!res.ok) throw new Error(`lighthouse ${res.status}`);
  const body_json = await res.json();
  const parsed = LighthouseResponse.parse(body_json);
  return parsed.Hash;
}

export async function pinYieldMap(json: unknown, cfg: { lighthouseApiKey: string }): Promise<PinResult> {
  const cid = await pRetry(() => pinLighthouseOnce(json, cfg.lighthouseApiKey), {
    retries: 2,
    minTimeout: 1000,
    maxTimeout: 4000
  });
  return { cid };
}
