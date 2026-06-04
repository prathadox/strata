// Scout demo entrypoint for Railway. Posts one signed YieldMap CID per 24h cycle to AgentEventBus.
// Standalone: does not depend on the full Scout pipeline. Designed for an always-on Railway service
// that produces one tx + one Lighthouse CID on boot, then sleeps until the next 24h tick.

import { createPublicClient, createWalletClient, http, parseAbi, keccak256, toBytes } from 'viem';
import { privateKeyToAccount } from 'viem/accounts';
import { mantle } from 'viem/chains';

const ABI = parseAbi([
  'function publishYieldMap(string ipfsHash) external',
  'event YieldMapPublished(address indexed agent, string ipfsHash, uint256 timestamp)'
]);

async function pinJson(json: string, apiKey: string): Promise<string> {
  const blob = new Blob([json], { type: 'application/json' });
  const form = new FormData();
  form.append('file', blob, 'yieldmap.json');
  const res = await fetch('https://upload.lighthouse.storage/api/v0/add', {
    method: 'POST',
    headers: { Authorization: `Bearer ${apiKey}` },
    body: form
  });
  if (!res.ok) throw new Error(`lighthouse ${res.status}: ${await res.text()}`);
  const { Hash } = await res.json();
  return Hash;
}

function canonicalStringify(obj: unknown): string {
  return JSON.stringify(obj, Object.keys(obj as object).sort());
}

async function cycle() {
  const pk = process.env.SCOUT_PRIVATE_KEY as `0x${string}`;
  const rpc = process.env.MANTLE_RPC_URL!;
  const bus = process.env.AGENT_EVENT_BUS_ADDRESS as `0x${string}`;
  const lighthouseKey = process.env.LIGHTHOUSE_API_KEY!;
  if (!pk || !rpc || !bus || !lighthouseKey) throw new Error('missing env: SCOUT_PRIVATE_KEY, MANTLE_RPC_URL, AGENT_EVENT_BUS_ADDRESS, LIGHTHOUSE_API_KEY');

  const account = privateKeyToAccount(pk);
  const publicClient = createPublicClient({ chain: mantle, transport: http(rpc) });
  const walletClient = createWalletClient({ account, chain: mantle, transport: http(rpc) });

  const draft = {
    agent: account.address,
    role: 'scout',
    tokenId: 101,
    methodology: 'first-principles RAAPY: apy - sum(p_i * alpha_i)',
    publishedAtSec: Math.floor(Date.now() / 1000),
    opportunities: [
      { project: 'aave-v3', asset: 'USDC', chain: 'mantle', apy: 0.034, raapy: 0.033, expectedLoss: 0.001, confidence: 0.93, tranches: ['senior', 'mezzanine', 'junior'] },
      { project: 'ondo-finance', asset: 'USDY', chain: 'mantle', apy: 0.046, raapy: 0.044, expectedLoss: 0.002, confidence: 0.88, tranches: ['senior', 'mezzanine'] },
      { project: 'ethena', asset: 'sUSDe', chain: 'mantle', apy: 0.092, raapy: 0.072, expectedLoss: 0.020, confidence: 0.78, tranches: ['mezzanine', 'junior'] },
      { project: 'agni-finance', asset: 'USDC/USDe', chain: 'mantle', apy: 0.118, raapy: 0.080, expectedLoss: 0.038, confidence: 0.70, tranches: ['junior'] },
      { project: 'mantle-staked-ether', asset: 'mETH', chain: 'mantle', apy: 0.038, raapy: 0.031, expectedLoss: 0.007, confidence: 0.84, tranches: ['mezzanine'] }
    ]
  };
  const unsignedHash = keccak256(toBytes(canonicalStringify({ ...draft, signature: '' })));
  const signature = await account.signMessage({ message: { raw: unsignedHash } });
  const signedJson = canonicalStringify({ ...draft, signature });

  const cid = await pinJson(signedJson, lighthouseKey);
  console.log(JSON.stringify({ agent: 'scout', stage: 'pinned', cid, gateway: `https://gateway.lighthouse.storage/ipfs/${cid}` }));

  const hash = await walletClient.writeContract({
    address: bus,
    abi: ABI,
    functionName: 'publishYieldMap',
    args: [cid]
  });
  const receipt = await publicClient.waitForTransactionReceipt({ hash });
  console.log(JSON.stringify({ agent: 'scout', stage: 'tx-mined', txHash: hash, block: Number(receipt.blockNumber), status: receipt.status, mantlescan: `https://mantlescan.xyz/tx/${hash}` }));
}

async function main() {
  while (true) {
    try {
      await cycle();
    } catch (err) {
      console.error(JSON.stringify({ agent: 'scout', error: err instanceof Error ? err.message : String(err) }));
    }
    await new Promise(r => setTimeout(r, 86_400_000));
  }
}

main();
