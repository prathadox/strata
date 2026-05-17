import {
  createPublicClient, createWalletClient, http, fallback,
  type Chain, type PublicClient, type WalletClient, type FallbackTransport, type HttpTransport
} from 'viem';
import { privateKeyToAccount, type PrivateKeyAccount } from 'viem/accounts';
import type { ScoutConfig } from '../config.js';

type MantleTransport = FallbackTransport<[HttpTransport, HttpTransport]>;

const mantle: Chain = {
  id: 5000,
  name: 'Mantle',
  nativeCurrency: { name: 'Mantle', symbol: 'MNT', decimals: 18 },
  rpcUrls: { default: { http: ['https://rpc.mantle.xyz'] } }
};

export interface ScoutClients {
  publicClient: PublicClient<MantleTransport, typeof mantle>;
  walletClient: WalletClient<MantleTransport, typeof mantle, PrivateKeyAccount>;
  account: PrivateKeyAccount;
  chain: Chain;
}

export function makeClients(cfg: ScoutConfig): ScoutClients {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const transport = fallback([http(cfg.chain.rpcUrl), http(cfg.chain.rpcFallback)]) as unknown as MantleTransport;
  const publicClient = createPublicClient({ chain: mantle, transport });
  const account = privateKeyToAccount(cfg.scout.privateKey);
  const walletClient = createWalletClient({ chain: mantle, transport, account });
  return { publicClient, walletClient, account, chain: mantle };
}
