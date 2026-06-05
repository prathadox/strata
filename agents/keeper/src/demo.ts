// Keeper demo entrypoint for Railway. Once per 24h, scans the bus for RiskVerdictIssued events,
// for each approved verdict pairs it with its AllocationProposed, fetches the Architect's pinned
// allocation JSON from IPFS, maps adapter-name strings to deployed addresses, and calls
// TrancheController.executeAllocation(...). This is the missing on-chain arc that closes the
// bus -> controller -> adapter loop.

import { createPublicClient, createWalletClient, http, parseAbi, parseAbiItem } from 'viem';
import { privateKeyToAccount } from 'viem/accounts';
import { mantle } from 'viem/chains';

const CONTROLLER_ABI = parseAbi([
  'struct AdapterTarget { address adapter; uint16 bps; }',
  'function executeAllocation(uint256 proposalId, AdapterTarget[] senior, AdapterTarget[] mezz, AdapterTarget[] junior) external'
]);

const RISK_VERDICT_ISSUED = parseAbiItem('event RiskVerdictIssued(uint256 indexed proposalId, address indexed agent, bool isApproved, string conditionHash)');
const ALLOCATION_PROPOSED = parseAbiItem('event AllocationProposed(uint256 indexed proposalId, address indexed agent, uint256 seniorBps, uint256 mezzBps, uint256 juniorBps, string reasoningHash)');

const IPFS_GATEWAYS = [
  'https://gateway.lighthouse.storage/ipfs/',
  'https://w3s.link/ipfs/',
  'https://ipfs.io/ipfs/'
];

// Adapter-name -> deployed address. Names come from the Architect's pinned JSON (allocations.*.targets[].adapter).
// Addresses are hardcoded from contracts/deployments/5000.json (mainnet, Mantle chainId 5000).
// If a new adapter ships, add an entry here. Unknown names are logged and skipped, never thrown.
const ADAPTER_ADDRESSES: Record<string, `0x${string}`> = {
  AaveV3UsdcAdapter:        '0xd8E4A25eab6de5D504E0A53d9Daec3687B3959a7',
  OndoUsdyAdapter:          '0x0CDaea9582CF886Df9E359fD2435B86c9415Ba9b',
  MethAdapter:              '0xd526DD02366F9DA22232Ed8cDD1db197bc51F2be',
  AgniLpUsdcUsdeAdapter:    '0x755D0BA62C10dae194091F395c96E9d14CF879F2',
  EthenaSusdeAdapter:       '0xfA8240669B9fC8A697F1595d7ceAe9e81c480663',
  PerpBasisEscrowAdapter:   '0x55F90908eFe0E8e78a4CDE445d57a1EDB26d3f32'
};

type AdapterTarget = { adapter: `0x${string}`; bps: number };

async function fetchAllocation(cid: string): Promise<any | null> {
  for (const gw of IPFS_GATEWAYS) {
    const ctrl = new AbortController();
    const t = setTimeout(() => ctrl.abort(), 8_000);
    try {
      const res = await fetch(`${gw}${cid}`, { signal: ctrl.signal });
      clearTimeout(t);
      if (res.ok) {
        try { return await res.json(); } catch { /* try next gw */ }
      }
    } catch { /* timeout or net err, try next gw */ }
    finally { clearTimeout(t); }
  }
  return null;
}

// Walk the Architect JSON's per-tranche targets[] and resolve each adapter name to its address.
// Skip unknown names with a warning. The on-chain check requires bps to sum to 10_000 per tranche;
// the Architect already enforces this, but we do not re-validate here (controller will revert if not).
function buildTargets(trancheKey: string, proposalId: string, raw: unknown): AdapterTarget[] {
  if (!Array.isArray(raw)) return [];
  const out: AdapterTarget[] = [];
  for (const t of raw) {
    if (!t || typeof t !== 'object') continue;
    const name = String((t as any).adapter ?? '');
    const bps = Number((t as any).bps ?? 0);
    const addr = ADAPTER_ADDRESSES[name];
    if (!addr) {
      console.warn(JSON.stringify({ agent: 'keeper', stage: 'unknown-adapter', proposalId, tranche: trancheKey, adapterName: name }));
      continue;
    }
    if (!(bps > 0)) continue;
    out.push({ adapter: addr, bps });
  }
  return out;
}

async function cycle(executed: Set<string>) {
  const pk = process.env.KEEPER_PRIVATE_KEY as `0x${string}` | undefined;
  const rpc = process.env.MANTLE_RPC_URL;
  const bus = process.env.AGENT_EVENT_BUS_ADDRESS as `0x${string}` | undefined;
  const controller = process.env.TRANCHE_CONTROLLER_ADDRESS as `0x${string}` | undefined;
  const lookbackEnv = process.env.MAX_LOOKBACK_BLOCKS;
  const lookback = BigInt(lookbackEnv && /^\d+$/.test(lookbackEnv) ? lookbackEnv : '50000');
  if (!pk || !rpc || !bus || !controller) throw new Error('missing env: KEEPER_PRIVATE_KEY, MANTLE_RPC_URL, AGENT_EVENT_BUS_ADDRESS, TRANCHE_CONTROLLER_ADDRESS');

  const account = privateKeyToAccount(pk);
  const publicClient = createPublicClient({ chain: mantle, transport: http(rpc) });
  const walletClient = createWalletClient({ account, chain: mantle, transport: http(rpc) });

  const latest = await publicClient.getBlockNumber();
  const from = latest > lookback ? latest - lookback : 0n;
  console.log(JSON.stringify({ agent: 'keeper', stage: 'scanning', fromBlock: Number(from), toBlock: Number(latest), keeper: account.address }));

  const verdicts = await publicClient.getContractEvents({
    address: bus, abi: [RISK_VERDICT_ISSUED], eventName: 'RiskVerdictIssued', fromBlock: from, toBlock: 'latest'
  });

  // Dedup approved verdicts by proposalId, keep most recent.
  const approvedByProposal = new Map<string, any>();
  for (const log of verdicts) {
    const id = (log.args.proposalId as bigint).toString();
    if (log.args.isApproved !== true) continue;
    approvedByProposal.set(id, log);
  }
  console.log(JSON.stringify({ agent: 'keeper', stage: 'verdicts-found', total: verdicts.length, approvedUnique: approvedByProposal.size }));

  const proposals = await publicClient.getContractEvents({
    address: bus, abi: [ALLOCATION_PROPOSED], eventName: 'AllocationProposed', fromBlock: from, toBlock: 'latest'
  });
  const proposalById = new Map<string, any>();
  for (const log of proposals) {
    const id = (log.args.proposalId as bigint).toString();
    proposalById.set(id, log);
  }

  for (const [proposalId, _verdict] of approvedByProposal) {
    if (executed.has(proposalId)) {
      console.log(JSON.stringify({ agent: 'keeper', stage: 'skip-already-executed', proposalId }));
      continue;
    }
    try {
      const prop = proposalById.get(proposalId);
      if (!prop) {
        console.warn(JSON.stringify({ agent: 'keeper', stage: 'no-matching-proposal', proposalId }));
        continue;
      }
      const reasoningCid = prop.args.reasoningHash as string;
      const allocation = await fetchAllocation(reasoningCid);
      if (!allocation) {
        console.warn(JSON.stringify({ agent: 'keeper', stage: 'ipfs-fetch-failed', proposalId, cid: reasoningCid }));
        continue;
      }
      const allocs = allocation.allocations ?? {};
      const senior = buildTargets('senior', proposalId, allocs.senior?.targets);
      const mezz = buildTargets('mezzanine', proposalId, allocs.mezzanine?.targets);
      const junior = buildTargets('junior', proposalId, allocs.junior?.targets);
      console.log(JSON.stringify({ agent: 'keeper', stage: 'targets-built', proposalId, seniorCount: senior.length, mezzCount: mezz.length, juniorCount: junior.length }));

      const hash = await walletClient.writeContract({
        address: controller, abi: CONTROLLER_ABI, functionName: 'executeAllocation',
        args: [BigInt(proposalId), senior, mezz, junior]
      });
      const receipt = await publicClient.waitForTransactionReceipt({ hash });
      console.log(JSON.stringify({ agent: 'keeper', stage: 'executed', proposalId, txHash: hash, block: Number(receipt.blockNumber), status: receipt.status, mantlescan: `https://mantlescan.xyz/tx/${hash}` }));
      executed.add(proposalId);
    } catch (err) {
      console.error(JSON.stringify({ agent: 'keeper', stage: 'execute-failed', proposalId, error: err instanceof Error ? err.message : String(err) }));
    }
  }
}

async function main() {
  const executed = new Set<string>();
  while (true) {
    try { await cycle(executed); } catch (err) { console.error(JSON.stringify({ agent: 'keeper', error: err instanceof Error ? err.message : String(err) })); }
    await new Promise(r => setTimeout(r, 86_400_000));
  }
}

main();
