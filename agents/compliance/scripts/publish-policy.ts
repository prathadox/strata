// One-shot: pins a jurisdiction policy doc to Lighthouse and calls publishPolicy(policyId, cid) on
// the ComplianceRegistry from the deployer EOA (publishPolicy is onlyOwner; owner = deployer, not
// the Compliance agent). Run via: pnpm tsx agents/compliance/scripts/publish-policy.ts

import { createPublicClient, createWalletClient, http, parseAbi } from 'viem';
import { privateKeyToAccount } from 'viem/accounts';
import { mantle } from 'viem/chains';

const REGISTRY_ABI = parseAbi([
  'function publishPolicy(string policyId, string cid) external'
]);

async function pinJson(json: string, apiKey: string): Promise<string> {
  const blob = new Blob([json], { type: 'application/json' });
  const form = new FormData();
  form.append('file', blob, 'compliance-policy.json');
  const res = await fetch('https://upload.lighthouse.storage/api/v0/add', {
    method: 'POST', headers: { Authorization: `Bearer ${apiKey}` }, body: form
  });
  if (!res.ok) throw new Error(`lighthouse ${res.status}: ${await res.text()}`);
  return (await res.json()).Hash;
}

function canonicalStringify(obj: unknown): string {
  return JSON.stringify(obj, Object.keys(obj as object).sort());
}

async function main() {
  const pk = process.env.DEPLOYER_PRIVATE_KEY as `0x${string}`;
  const rpc = process.env.MANTLE_RPC_URL!;
  const registry = process.env.COMPLIANCE_REGISTRY_ADDRESS as `0x${string}`;
  const lighthouseKey = process.env.LIGHTHOUSE_API_KEY!;
  const policyId = process.env.POLICY_ID ?? 'STRATA-DEMO-2026-06';
  const jurisdictionCode = process.env.JURISDICTION_CODE ?? 'GLOBAL';
  if (!pk || !rpc || !registry || !lighthouseKey) throw new Error('missing env: DEPLOYER_PRIVATE_KEY, MANTLE_RPC_URL, COMPLIANCE_REGISTRY_ADDRESS, LIGHTHOUSE_API_KEY');

  const account = privateKeyToAccount(pk);
  const publicClient = createPublicClient({ chain: mantle, transport: http(rpc) });
  const walletClient = createWalletClient({ account, chain: mantle, transport: http(rpc) });

  const policyDoc = {
    role: 'compliance',
    policyId,
    jurisdictionCode,
    permittedTranches: ['senior', 'mezzanine', 'junior'],
    sources: ['Self-attestation for hackathon demo; not production KYC'],
    publishedAtSec: Math.floor(Date.now() / 1000)
  };
  const cid = await pinJson(canonicalStringify(policyDoc), lighthouseKey);
  console.log(JSON.stringify({ script: 'publish-policy', stage: 'pinned', policyId, cid, gateway: `https://gateway.lighthouse.storage/ipfs/${cid}` }));

  const hash = await walletClient.writeContract({
    address: registry, abi: REGISTRY_ABI, functionName: 'publishPolicy',
    args: [policyId, cid]
  });
  const receipt = await publicClient.waitForTransactionReceipt({ hash });
  console.log(JSON.stringify({ script: 'publish-policy', stage: 'tx-mined', txHash: hash, policyId, cid, block: Number(receipt.blockNumber), status: receipt.status, mantlescan: `https://mantlescan.xyz/tx/${hash}` }));
}

main().catch(err => {
  console.error(JSON.stringify({ script: 'publish-policy', error: err instanceof Error ? err.message : String(err) }));
  process.exit(1);
});
