// LEGACY: not imported by the Railway entrypoint (src/demo.ts). Kept for future "production" daemon path.
import pRetry from 'p-retry';
import { z } from 'zod';

const PinataResponse = z.object({ IpfsHash: z.string().min(1) });

export interface PinResult { cid: string; }

async function pinPinataRawOnce(jsonString: string, jwt: string, filename: string): Promise<string> {
  const boundary = `----strata${Date.now()}${Math.random().toString(36).slice(2)}`;
  const body =
    `--${boundary}\r\n` +
    `Content-Disposition: form-data; name="file"; filename="${filename}"\r\n` +
    `Content-Type: application/json\r\n\r\n` +
    jsonString + `\r\n` +
    `--${boundary}--\r\n`;

  const res = await globalThis.fetch('https://api.pinata.cloud/pinning/pinFileToIPFS', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${jwt}`,
      'Content-Type': `multipart/form-data; boundary=${boundary}`
    },
    body
  });
  if (!res.ok) throw new Error(`pinata ${res.status}`);
  const body_json = await res.json();
  const parsed = PinataResponse.parse(body_json);
  return parsed.IpfsHash;
}

async function pinPinataOnce(json: unknown, jwt: string): Promise<string> {
  return pinPinataRawOnce(JSON.stringify(json), jwt, 'yield-map.json');
}

export async function pinYieldMap(json: unknown, cfg: { pinataJwt: string }): Promise<PinResult> {
  const cid = await pRetry(() => pinPinataOnce(json, cfg.pinataJwt), {
    retries: 2,
    minTimeout: 1000,
    maxTimeout: 4000
  });
  return { cid };
}

// Generic Pinata pin for a pre-stringified JSON body. Used by Sentinel and Operator
// to pin signed artifacts whose canonical string form is already computed.
export async function pinJsonToPinata(jsonString: string, jwt: string): Promise<string> {
  return pRetry(() => pinPinataRawOnce(jsonString, jwt, 'artifact.json'), {
    retries: 2,
    minTimeout: 1000,
    maxTimeout: 4000
  });
}
