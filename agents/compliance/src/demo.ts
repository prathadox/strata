// Compliance demo entrypoint for Railway. Once per 24h, signs an EIP-712 ClaimData (granting itself a
// soulbound compliance receipt across all three tranches) and submits claimReceipt on the
// ComplianceRegistry. Produces one tx + one Lighthouse CID per cycle.

import { createPublicClient, createWalletClient, http, parseAbi, keccak256, toBytes, getAddress } from 'viem';
import { privateKeyToAccount } from 'viem/accounts';
import { mantle } from 'viem/chains';
import { randomBytes } from 'node:crypto';

const REGISTRY_ABI = parseAbi([
  'struct ClaimData { address user; uint8 trancheMask; uint64 expiresAt; string policyId; string zkReceiptCid; bytes32 nonce; uint64 signedAt; }',
  'function claimReceipt(ClaimData data, bytes sig) external',
  'function receiptOf(address user) view returns (uint256)',
  'function verifier() view returns (address)'
]);

const EIP712_TYPES = {
  ClaimData: [
    { name: 'user', type: 'address' },
    { name: 'trancheMask', type: 'uint8' },
    { name: 'expiresAt', type: 'uint64' },
    { name: 'policyId', type: 'string' },
    { name: 'zkReceiptCid', type: 'string' },
    { name: 'nonce', type: 'bytes32' },
    { name: 'signedAt', type: 'uint64' }
  ]
} as const;

async function pinJson(json: string, apiKey: string): Promise<string> {
  const blob = new Blob([json], { type: 'application/json' });
  const form = new FormData();
  form.append('file', blob, 'compliance-claim.json');
  const res = await fetch('https://node.lighthouse.storage/api/v0/add', {
    method: 'POST', headers: { Authorization: `Bearer ${apiKey}` }, body: form
  });
  if (!res.ok) throw new Error(`lighthouse ${res.status}: ${await res.text()}`);
  return (await res.json()).Hash;
}

function canonicalStringify(obj: unknown): string {
  return JSON.stringify(obj, Object.keys(obj as object).sort());
}

async function cycle() {
  const pk = process.env.COMPLIANCE_PRIVATE_KEY as `0x${string}`;
  const rpc = process.env.MANTLE_RPC_URL!;
  const registry = process.env.COMPLIANCE_REGISTRY_ADDRESS as `0x${string}`;
  const lighthouseKey = process.env.LIGHTHOUSE_API_KEY!;
  if (!pk || !rpc || !registry || !lighthouseKey) throw new Error('missing env');

  const account = privateKeyToAccount(pk);
  const publicClient = createPublicClient({ chain: mantle, transport: http(rpc) });
  const walletClient = createWalletClient({ account, chain: mantle, transport: http(rpc) });

  // Skip if this wallet already holds an active receipt.
  const existing = await publicClient.readContract({ address: registry, abi: REGISTRY_ABI, functionName: 'receiptOf', args: [account.address] });
  if ((existing as bigint) > 0n) {
    console.log(JSON.stringify({ agent: 'compliance', stage: 'already-has-receipt', tokenId: (existing as bigint).toString() }));
  }

  const policyDoc = {
    agent: account.address,
    role: 'compliance',
    tokenId: 105,
    policyId: 'STRATA-DEMO-2026-06',
    jurisdictionCode: 'GLOBAL',
    permittedTranches: ['senior', 'mezzanine', 'junior'],
    sources: ['Self-attestation for hackathon demo; not production KYC'],
    publishedAtSec: Math.floor(Date.now() / 1000)
  };
  const zkReceiptCid = await pinJson(canonicalStringify(policyDoc), lighthouseKey);
  console.log(JSON.stringify({ agent: 'compliance', stage: 'pinned', cid: zkReceiptCid, gateway: `https://gateway.lighthouse.storage/ipfs/${zkReceiptCid}` }));

  if ((existing as bigint) > 0n) {
    // Just produce the CID; don't re-claim (contract reverts AlreadyHasReceipt).
    await new Promise(r => setTimeout(r, 1000));
    console.log(JSON.stringify({ agent: 'compliance', stage: 'skip-tx', reason: 'receipt-already-active', tokenId: (existing as bigint).toString() }));
    return;
  }

  const signedAt = BigInt(Math.floor(Date.now() / 1000));
  const expiresAt = signedAt + 365n * 24n * 3600n;
  const claim = {
    user: getAddress(account.address),
    trancheMask: 0x07, // Senior + Mezz + Junior
    expiresAt,
    policyId: policyDoc.policyId,
    zkReceiptCid,
    nonce: `0x${randomBytes(32).toString('hex')}` as `0x${string}`,
    signedAt
  };
  const domain = { name: 'StrataCompliance', version: '1', chainId: 5000, verifyingContract: registry } as const;
  const sig = await account.signTypedData({ domain, types: EIP712_TYPES, primaryType: 'ClaimData', message: claim });

  const hash = await walletClient.writeContract({
    address: registry, abi: REGISTRY_ABI, functionName: 'claimReceipt',
    args: [claim, sig]
  });
  const receipt = await publicClient.waitForTransactionReceipt({ hash });
  const tokenId = await publicClient.readContract({ address: registry, abi: REGISTRY_ABI, functionName: 'receiptOf', args: [account.address] });
  console.log(JSON.stringify({ agent: 'compliance', stage: 'tx-mined', txHash: hash, tokenId: (tokenId as bigint).toString(), block: Number(receipt.blockNumber), status: receipt.status, mantlescan: `https://mantlescan.xyz/tx/${hash}` }));
}

async function main() {
  while (true) {
    try { await cycle(); } catch (err) { console.error(JSON.stringify({ agent: 'compliance', error: err instanceof Error ? err.message : String(err) })); }
    await new Promise(r => setTimeout(r, 86_400_000));
  }
}

main();
