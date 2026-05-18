import { signYieldMap, type SignedMap } from './signer.js';
import { pinYieldMap, type PinResult } from './ipfs.js';
import type { WalletClient, PublicClient, Account } from 'viem';

export interface Publisher {
  signYieldMap(payload: unknown): Promise<SignedMap>;
  pinYieldMap(payload: unknown): Promise<PinResult>;
  publishOnChain(args: { ipfsHash: string }): Promise<`0x${string}`>;
}

export interface BuildPublisherArgs {
  wallet: WalletClient;
  publicClient: PublicClient;
  account: Account;
  lighthouseApiKey: string;
  // publishOnChain is supplied by the caller (real impl in Task 26, stub in tests)
  publishOnChain: (args: { ipfsHash: string }) => Promise<`0x${string}`>;
}

export function makePublisher(args: BuildPublisherArgs): Publisher {
  return {
    signYieldMap: (payload) => signYieldMap(payload, args.wallet, args.account),
    pinYieldMap: (payload) => pinYieldMap(payload, { lighthouseApiKey: args.lighthouseApiKey }),
    publishOnChain: args.publishOnChain
  };
}
