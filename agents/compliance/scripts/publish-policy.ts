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
  const res = await fetch('https://api.pinata.cloud/pinning/pinFileToIPFS', {
    method: 'POST', headers: { Authorization: `Bearer ${apiKey}` }, body: form
  });
  if (!res.ok) throw new Error(`pinata ${res.status}: ${await res.text()}`);
  return (await res.json()).IpfsHash;
}

function canonicalStringify(obj: unknown): string {
  const go = (v: unknown): string => {
    if (v === null || typeof v !== "object") return JSON.stringify(v);
    if (Array.isArray(v)) return `[${v.map(go).join(",")}]`;
    const o = v as Record<string, unknown>;
    return `{${Object.keys(o).sort().map((k) => `${JSON.stringify(k)}:${go(o[k])}`).join(",")}}`;
  };
  return go(obj);
}

async function main() {
  const pk = process.env.DEPLOYER_PRIVATE_KEY as `0x${string}`;
  const rpc = process.env.MANTLE_RPC_URL!;
  const registry = process.env.COMPLIANCE_REGISTRY_ADDRESS as `0x${string}`;
  const pinataJwt = process.env.PINATA_JWT!;
  const policyId = process.env.POLICY_ID ?? 'STRATA-DEMO-2026-06';
  const jurisdictionCode = process.env.JURISDICTION_CODE ?? 'GLOBAL';
  if (!pk || !rpc || !registry || !pinataJwt) throw new Error('missing env: DEPLOYER_PRIVATE_KEY, MANTLE_RPC_URL, COMPLIANCE_REGISTRY_ADDRESS, PINATA_JWT');

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
  const cid = await pinJson(canonicalStringify(policyDoc), pinataJwt);
  console.log(JSON.stringify({ script: 'publish-policy', stage: 'pinned', policyId, cid, gateway: `https://gateway.pinata.cloud/ipfs/${cid}` }));

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
