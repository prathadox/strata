import { z } from 'zod';

const GeminiResponse = z.object({
  candidates: z.array(z.object({
    content: z.object({
      parts: z.array(z.object({ text: z.string() }))
    })
  })).min(1)
});

export async function callGeminiJson(
  prompt: string,
  apiKey: string,
  model: string
): Promise<string | null> {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
  let res: Response;
  try {
    res = await globalThis.fetch(url, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { maxOutputTokens: 2000, temperature: 0.1, responseMimeType: 'application/json' }
      })
    });
  } catch { return null; }
  if (!res.ok) return null;
  let body: unknown;
  try { body = await res.json(); } catch { return null; }
  const parsed = GeminiResponse.safeParse(body);
  if (!parsed.success) return null;
  return parsed.data.candidates[0]?.content.parts[0]?.text.trim() ?? null;
}
