// One-shot setup: from the deployer key, grant the keeper EOA authority to call
// TrancheController.executeAllocation. Logs the previous executor for confirmation, then writes
// the new executor in a single tx. Run once per keeper rotation.
//
// Usage:
//   DEPLOYER_PRIVATE_KEY=0x... MANTLE_RPC_URL=https://... \
//   TRANCHE_CONTROLLER_ADDRESS=0x... KEEPER_ADDRESS=0x... \
//   pnpm tsx agents/keeper/scripts/grant-executor.ts

import { createPublicClient, createWalletClient, http, parseAbi } from 'viem';
import { privateKeyToAccount } from 'viem/accounts';
import { mantle } from 'viem/chains';

const CONTROLLER_ABI = parseAbi([
  'function executor() view returns (address)',
  'function owner() view returns (address)',
  'function setExecutor(address e) external'
]);

async function main() {
  const pk = process.env.DEPLOYER_PRIVATE_KEY as `0x${string}` | undefined;
  const rpc = process.env.MANTLE_RPC_URL;
  const controller = process.env.TRANCHE_CONTROLLER_ADDRESS as `0x${string}` | undefined;
  const keeper = process.env.KEEPER_ADDRESS as `0x${string}` | undefined;
  if (!pk || !rpc || !controller || !keeper) {
    throw new Error('missing env: DEPLOYER_PRIVATE_KEY, MANTLE_RPC_URL, TRANCHE_CONTROLLER_ADDRESS, KEEPER_ADDRESS');
  }

  const account = privateKeyToAccount(pk);
  const publicClient = createPublicClient({ chain: mantle, transport: http(rpc) });
  const walletClient = createWalletClient({ account, chain: mantle, transport: http(rpc) });

  const [prevExecutor, owner] = await Promise.all([
    publicClient.readContract({ address: controller, abi: CONTROLLER_ABI, functionName: 'executor' }),
    publicClient.readContract({ address: controller, abi: CONTROLLER_ABI, functionName: 'owner' })
  ]);
  console.log(JSON.stringify({ stage: 'pre-check', controller, owner, prevExecutor, deployer: account.address, newExecutor: keeper }));
  if (account.address.toLowerCase() !== (owner as string).toLowerCase()) {
    throw new Error(`deployer ${account.address} is not controller owner ${owner}`);
  }
  if ((prevExecutor as string).toLowerCase() === keeper.toLowerCase()) {
    console.log(JSON.stringify({ stage: 'noop', reason: 'executor already set to keeper', executor: keeper }));
    return;
  }

  const hash = await walletClient.writeContract({
    address: controller, abi: CONTROLLER_ABI, functionName: 'setExecutor', args: [keeper]
  });
  const receipt = await publicClient.waitForTransactionReceipt({ hash });
  console.log(JSON.stringify({ stage: 'tx-mined', txHash: hash, block: Number(receipt.blockNumber), status: receipt.status, prevExecutor, newExecutor: keeper, mantlescan: `https://mantlescan.xyz/tx/${hash}` }));
}

main().catch(err => {
  console.error(JSON.stringify({ stage: 'error', error: err instanceof Error ? err.message : String(err) }));
  process.exit(1);
});
