import { z } from 'zod';
import type { RiskFactors } from '../../types.js';

type SmartMoneySignal = NonNullable<RiskFactors['smartMoneySignal']>;

const NansenResponse = z.object({
  smart_holder_pct: z.number().min(0).max(1),
  fresh_wallet_inflow_pct: z.number().min(0).max(1),
  wash_trade_flag: z.boolean()
});

export async function fetchSmartMoneyFlow(
  assetAddress: string,
  nansenApiKey: string
): Promise<SmartMoneySignal | null> {
  const url = `https://api.nansen.ai/v1/tokens/mantle/${assetAddress}/holders-summary`;
  let res: Response;
  try {
    res = await globalThis.fetch(url, { headers: { 'X-API-KEY': nansenApiKey } });
  } catch {
    return null;
  }
  if (!res.ok) return null;
  let body: unknown;
  try {
    body = await res.json();
  } catch {
    return null;
  }
  const parsed = NansenResponse.safeParse(body);
  if (!parsed.success) return null;
  return {
    smartHolderPct: parsed.data.smart_holder_pct,
    freshWalletInflowPct: parsed.data.fresh_wallet_inflow_pct,
    washTradeFlag: parsed.data.wash_trade_flag
  };
}
