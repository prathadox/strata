import { keccak256, toBytes } from 'viem';
import type { PublicClient } from 'viem';
import { JurisdictionPolicySchema, type JurisdictionPolicy } from '../types.js';
import { jurisdictionPolicyNftAbi } from '../chain/abi/jurisdictionPolicyNft.js';
import { policyRevocationRegistryAbi } from '../chain/abi/policyRevocationRegistry.js';

export interface PolicyResolver {
  resolve(jurisdictionCode: string): Promise<JurisdictionPolicy | null>;
}

const IPFS_GATEWAYS = [
  'https://gateway.lighthouse.storage/ipfs/',
  'https://ipfs.io/ipfs/',
  'https://dweb.link/ipfs/',
] as const;

const IPFS_TIMEOUT_MS = 10_000;

function stubPolicyHash(jurisdictionCode: string): `0x${string}` {
  return keccak256(toBytes(`strata-stub-policy-v1-${jurisdictionCode}`));
}

function stubSourceTextHash(jurisdictionCode: string): `0x${string}` {
  return keccak256(toBytes(`strata-stub-source-v1-${jurisdictionCode}`));
}

function makeStubPolicy(
  jurisdictionCode: string,
  policyTokenId: string,
  tiers: { none: number; basic: number; enhanced: number },
): JurisdictionPolicy {
  return {
    version: '1.0',
    policyTokenId,
    jurisdictionCode,
    effectiveFromSec: 1700000000,
    effectiveUntilSec: null,
    permittedTranchesByKycTier: tiers,
    sourceTextHash: stubSourceTextHash(jurisdictionCode),
    sourceTextCid: null,
    aiInterpretationCid: null,
    aiInterpretationHash: null,
    aiModel: null,
    aiPromptHash: null,
    policyHash: stubPolicyHash(jurisdictionCode),
    publisher: {
      multisigAddress: '0x0000000000000000000000000000000000000000',
      identityNFT: 'ipfs://placeholder',
    },
    publishedAtSec: 1700000000,
    signatures: [],
  };
}

export const STUB_POLICIES: Record<string, JurisdictionPolicy> = {
  US: makeStubPolicy('US', '1', { none: 4, basic: 3, enhanced: 7 }),
  EU: makeStubPolicy('EU', '2', { none: 4, basic: 3, enhanced: 7 }),
  GB: makeStubPolicy('GB', '3', { none: 4, basic: 3, enhanced: 7 }),
  permissionless: makeStubPolicy('permissionless', '4', { none: 4, basic: 4, enhanced: 4 }),
};

export function createStubPolicyResolver(): PolicyResolver {
  return {
    async resolve(jurisdictionCode: string): Promise<JurisdictionPolicy | null> {
      return STUB_POLICIES[jurisdictionCode] ?? null;
    },
  };
}

async function fetchFromIpfs(cid: string): Promise<unknown> {
  for (const gateway of IPFS_GATEWAYS) {
    try {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), IPFS_TIMEOUT_MS);
      const res = await fetch(`${gateway}${cid}`, { signal: controller.signal });
      clearTimeout(timer);
      if (!res.ok) continue;
      return await res.json();
    } catch {
      continue;
    }
  }
  throw new Error(`all IPFS gateways failed for CID: ${cid}`);
}

export function createLivePolicyResolver(opts: {
  publicClient: PublicClient;
  policyNftAddress: `0x${string}`;
  revocationRegistryAddress: `0x${string}`;
}): PolicyResolver {
  const { publicClient, policyNftAddress, revocationRegistryAddress } = opts;

  return {
    async resolve(jurisdictionCode: string): Promise<JurisdictionPolicy | null> {
      const jurisdictionCodeHash = keccak256(toBytes(jurisdictionCode));

      const tokenId = await publicClient.readContract({
        address: policyNftAddress,
        abi: jurisdictionPolicyNftAbi,
        functionName: 'activePolicyFor',
        args: [jurisdictionCodeHash],
      });

      if (tokenId === 0n) return null;

      const revoked = await publicClient.readContract({
        address: revocationRegistryAddress,
        abi: policyRevocationRegistryAbi,
        functionName: 'isPolicyRevoked',
        args: [tokenId],
      });

      if (revoked) return null;

      const uri = await publicClient.readContract({
        address: policyNftAddress,
        abi: jurisdictionPolicyNftAbi,
        functionName: 'tokenURI',
        args: [tokenId],
      });

      const cid = uri.replace(/^ipfs:\/\//, '');
      const raw = await fetchFromIpfs(cid);
      const policy = JurisdictionPolicySchema.parse(raw);

      return policy;
    },
  };
}
