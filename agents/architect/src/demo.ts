// Architect demo entrypoint for Railway. Once per 24h, reads the latest YieldMapPublished CID from
// the bus (waits up to 10 minutes on first boot for Scout to publish), drafts an allocation,
// pins reasoning to Lighthouse, then calls proposeAllocation on the bus.

import { createPublicClient, createWalletClient, http, parseAbi, parseAbiItem, keccak256, toBytes } from 'viem';
import { privateKeyToAccount } from 'viem/accounts';
import { mantle } from 'viem/chains';

const BUS_ABI = parseAbi([
  'function proposeAllocation(uint256 proposalId, uint16 seniorBps, uint16 mezzBps, uint16 juniorBps, string reasoningCid) external'
]);
const YIELD_MAP_EVENT = parseAbiItem('event YieldMapPublished(address indexed agent, string ipfsHash, uint256 timestamp)');

async function pinJson(json: string, apiKey: string): Promise<string> {
  const blob = new Blob([json], { type: 'application/json' });
  const form = new FormData();
  form.append('file', blob, 'allocation.json');
  const res = await fetch('https://node.lighthouse.storage/api/v0/add', {
    method: 'POST', headers: { Authorization: `Bearer ${apiKey}` }, body: form
  });
  if (!res.ok) throw new Error(`lighthouse ${res.status}: ${await res.text()}`);
  return (await res.json()).Hash;
}

function canonicalStringify(obj: unknown): string {
  return JSON.stringify(obj, Object.keys(obj as object).sort());
}

async function waitForYieldMap(client: any, bus: `0x${string}`, scoutAddress: `0x${string}`, maxMs: number): Promise<{ cid: string; block: bigint } | null> {
  const deadline = Date.now() + maxMs;
  const latestBlock = await client.getBlockNumber();
  const lookback = latestBlock > 50_000n ? latestBlock - 50_000n : 0n;
  while (Date.now() < deadline) {
    const logs = await client.getContractEvents({
      address: bus, abi: [YIELD_MAP_EVENT], eventName: 'YieldMapPublished', fromBlock: lookback, toBlock: 'latest'
    });
    const fromScout = logs.filter((l: any) => l.args.agent?.toLowerCase() === scoutAddress.toLowerCase());
    if (fromScout.length > 0) {
      const last = fromScout[fromScout.length - 1];
      return { cid: last.args.ipfsHash!, block: last.blockNumber! };
    }
    await new Promise(r => setTimeout(r, 30_000));
  }
  return null;
}

async function cycle() {
  const pk = process.env.ARCHITECT_PRIVATE_KEY as `0x${string}`;
  const rpc = process.env.MANTLE_RPC_URL!;
  const bus = process.env.AGENT_EVENT_BUS_ADDRESS as `0x${string}`;
  const lighthouseKey = process.env.LIGHTHOUSE_API_KEY!;
  const scoutAddress = (process.env.SCOUT_ADDRESS ?? '0x7CAC071f0F59dEe64509ea1C3BD8245bE529fcdE') as `0x${string}`;
  if (!pk || !rpc || !bus || !lighthouseKey) throw new Error('missing env');

  const account = privateKeyToAccount(pk);
  const publicClient = createPublicClient({ chain: mantle, transport: http(rpc) });
  const walletClient = createWalletClient({ account, chain: mantle, transport: http(rpc) });

  console.log(JSON.stringify({ agent: 'architect', stage: 'waiting-for-yield-map', maxMs: 600_000 }));
  const upstream = await waitForYieldMap(publicClient, bus, scoutAddress, 600_000);
  if (!upstream) {
    console.log(JSON.stringify({ agent: 'architect', stage: 'no-upstream-yet', action: 'sleeping' }));
    return;
  }
  console.log(JSON.stringify({ agent: 'architect', stage: 'yield-map-found', cid: upstream.cid, block: Number(upstream.block) }));

  const proposalId = BigInt(Math.floor(Date.now() / 1000));
  const seniorBps = 6000;
  const mezzBps = 3000;
  const juniorBps = 1000;

  const draft = {
    agent: account.address,
    role: 'architect',
    tokenId: 102,
    proposalId: proposalId.toString(),
    sourceYieldMapCid: upstream.cid,
    allocations: {
      senior: { bps: seniorBps, targets: [{ adapter: 'AaveV3UsdcAdapter', bps: 7000 }, { adapter: 'OndoUsdyAdapter', bps: 3000 }] },
      mezzanine: { bps: mezzBps, targets: [{ adapter: 'AaveV3UsdcAdapter', bps: 4000 }, { adapter: 'AgniLpUsdcUsdeAdapter', bps: 4000 }, { adapter: 'MethAdapter', bps: 2000 }] },
      junior: { bps: juniorBps, targets: [{ adapter: 'EthenaSusdeAdapter', bps: 6000 }, { adapter: 'PerpBasisEscrowAdapter', bps: 4000 }] }
    },
    rationale: 'Senior holds Aave + Ondo (trustless + RWA T-bill yield). Mezz mixes Aave with Agni LP and mETH for moderate FX-labeled exposure. Junior takes Ethena basis trade and perp-hedged spot.',
    publishedAtSec: Math.floor(Date.now() / 1000)
  };
  const sig = await account.signMessage({ message: { raw: keccak256(toBytes(canonicalStringify({ ...draft, signature: '' }))) } });
  const cid = await pinJson(canonicalStringify({ ...draft, signature: sig }), lighthouseKey);
  console.log(JSON.stringify({ agent: 'architect', stage: 'pinned', cid, gateway: `https://gateway.lighthouse.storage/ipfs/${cid}` }));

  const hash = await walletClient.writeContract({
    address: bus, abi: BUS_ABI, functionName: 'proposeAllocation',
    args: [proposalId, seniorBps, mezzBps, juniorBps, cid]
  });
  const receipt = await publicClient.waitForTransactionReceipt({ hash });
  console.log(JSON.stringify({ agent: 'architect', stage: 'tx-mined', txHash: hash, proposalId: proposalId.toString(), block: Number(receipt.blockNumber), status: receipt.status, mantlescan: `https://mantlescan.xyz/tx/${hash}` }));
}

async function main() {
  while (true) {
    try { await cycle(); } catch (err) { console.error(JSON.stringify({ agent: 'architect', error: err instanceof Error ? err.message : String(err) })); }
    await new Promise(r => setTimeout(r, 86_400_000));
  }
}

main();
