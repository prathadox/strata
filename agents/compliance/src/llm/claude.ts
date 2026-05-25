import { z } from 'zod';

const ClaudeResponse = z.object({
  content: z.array(z.object({ type: z.string(), text: z.string().optional() })).min(1)
});

export async function callClaudeJson(
  systemPrompt: string,
  userMessage: string,
  apiKey: string,
  model: string
): Promise<string | null> {
  let res: Response;
  try {
    res = await globalThis.fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model,
        max_tokens: 2000,
        temperature: 0.1,
        system: systemPrompt,
        messages: [{ role: 'user', content: userMessage }]
      })
    });
  } catch { return null; }
  if (!res.ok) return null;
  let body: unknown;
  try { body = await res.json(); } catch { return null; }
  const parsed = ClaudeResponse.safeParse(body);
  if (!parsed.success) return null;
  const textBlock = parsed.data.content.find(b => b.type === 'text');
  return textBlock?.text?.trim() ?? null;
}
