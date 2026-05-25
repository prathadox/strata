import { createPublicClient, createWalletClient, http, fallback } from 'viem';
import { privateKeyToAccount } from 'viem/accounts';
import { mantle } from 'viem/chains';

export interface ChainClients {
  publicClient: ReturnType<typeof createPublicClient>;
  walletClient: ReturnType<typeof createWalletClient>;
  account: ReturnType<typeof privateKeyToAccount>;
}

export function buildChainClients(opts: {
  rpcUrl: string;
  rpcFallback: string;
  privateKey: `0x${string}`;
}): ChainClients {
  const transport = fallback([http(opts.rpcUrl), http(opts.rpcFallback)]);
  const account = privateKeyToAccount(opts.privateKey);
  const publicClient = createPublicClient({ chain: mantle, transport });
  const walletClient = createWalletClient({ account, chain: mantle, transport });
  return { publicClient, walletClient, account };
}
