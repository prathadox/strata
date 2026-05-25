import type { WalletClient, PublicClient } from 'viem';
import type { LocalAccount } from 'viem/accounts';
import { pinJsonToLighthouse } from '@strata/scout/ipfs';
import { signComplianceReceipt } from '../signing/eip712.js';
import { mintComplianceReceiptOnChain } from '../chain/onchain.js';
import type { ComplianceReceipt } from '../types.js';

export interface MakePublisherArgs {
  wallet: WalletClient;
  publicClient: PublicClient;
  account: LocalAccount;
  registryAddress: `0x${string}`;
  lighthouseApiKey: string;
  dryRun: boolean;
  pinOverride?: (json: string, key: string) => Promise<string>;
  mintOverride?: typeof mintComplianceReceiptOnChain;
}

export interface PublishReceiptResult {
  receiptCid: string;
  receipt: ComplianceReceipt;
  txHash?: `0x${string}`;
}

export function makePublisher(args: MakePublisherArgs) {
  const pin = args.pinOverride ?? pinJsonToLighthouse;
  const mint = args.mintOverride ?? mintComplianceReceiptOnChain;

  async function publishReceipt(
    draft: Omit<ComplianceReceipt, 'signature'>
  ): Promise<PublishReceiptResult> {
    const signature = await signComplianceReceipt({
      account: args.account,
      receipt: {
        receiptId: BigInt(draft.receiptId),
        wallet: draft.wallet as `0x${string}`,
        policyTokenId: BigInt(draft.policyTokenId),
        permittedTranchesMask: draft.permittedTranchesMask,
        kycExpiresAtSec: BigInt(draft.kycExpiresAtSec),
        sanctionsScreenExpiresAtSec: BigInt(draft.sanctionsScreenExpiresAtSec),
        policyHash: draft.policyHash as `0x${string}`,
        credentialEvidenceHash: draft.credentialEvidenceHash as `0x${string}`,
        methodologyHash: draft.methodologyHash as `0x${string}`,
      },
    });

    const receipt: ComplianceReceipt = { ...draft, signature };

    const receiptJson = JSON.stringify(receipt);
    const receiptCid = await pin(receiptJson, args.lighthouseApiKey);

    if (args.dryRun) {
      return { receiptCid, receipt };
    }

    const txHash = await mint({
      wallet: args.wallet,
      publicClient: args.publicClient,
      account: args.account,
      registryAddress: args.registryAddress,
      depositorWallet: draft.wallet as `0x${string}`,
      policyTokenId: BigInt(draft.policyTokenId),
      permittedTranchesMask: draft.permittedTranchesMask,
      kycExpiresAtSec: BigInt(draft.kycExpiresAtSec),
      sanctionsScreenExpiresAtSec: BigInt(draft.sanctionsScreenExpiresAtSec),
      tokenURI: receiptCid,
    });

    return { receiptCid, receipt, txHash };
  }

  return { publishReceipt };
}
