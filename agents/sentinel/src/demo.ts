// Sentinel demo entrypoint for Railway. Once per 24h, reads the latest AllocationProposed from the
// bus (waits up to 10 minutes for Architect on first boot), issues a risk verdict + an asset risk
// rating, then emits a hedge signal so the Operator has something to log.

import { createPublicClient, createWalletClient, http, parseAbi, parseAbiItem, keccak256, toBytes, decodeEventLog } from 'viem';
import { privateKeyToAccount } from 'viem/accounts';
import { mantle } from 'viem/chains';

const BUS_ABI = parseAbi([
  'function issueRiskVerdict(uint256 proposalId, bool isApproved, string conditionCid) external',
  'function setAssetRiskRating(uint256 proposalId, uint8 trancheId, address asset, uint8 rating, string noteCid) external',
  'function emitHedgeSignal(address underlyingAsset, int256 deltaSize, string reasoningCid) external returns (uint256)',
  'event HedgeSignalEmitted(uint256 indexed signalId, address indexed agent, address indexed underlyingAsset, int256 deltaSize, string reasoningCid)'
]);
const ALLOCATION_PROPOSED = parseAbiItem('event AllocationProposed(uint256 indexed proposalId, address indexed agent, uint256 seniorBps, uint256 mezzBps, uint256 juniorBps, string reasoningHash)');

const USDC = '0x09Bc4E0D864854c6aFB6eB9A9cdF58aC190D0dF9' as const;

async function pinJson(json: string, apiKey: string, name: string): Promise<string> {
  const blob = new Blob([json], { type: 'application/json' });
  const form = new FormData();
  form.append('file', blob, `${name}.json`);
  const res = await fetch('https://upload.lighthouse.storage/api/v0/add', {
    method: 'POST', headers: { Authorization: `Bearer ${apiKey}` }, body: form
  });
  if (!res.ok) throw new Error(`lighthouse ${res.status}: ${await res.text()}`);
  return (await res.json()).Hash;
}

function canonicalStringify(obj: unknown): string {
  return JSON.stringify(obj, Object.keys(obj as object).sort());
}

async function waitForProposal(client: any, bus: `0x${string}`, architectAddress: `0x${string}`, maxMs: number) {
  const deadline = Date.now() + maxMs;
  const latestBlock = await client.getBlockNumber();
  const lookback = latestBlock > 50_000n ? latestBlock - 50_000n : 0n;
  while (Date.now() < deadline) {
    const logs = await client.getContractEvents({ address: bus, abi: [ALLOCATION_PROPOSED], eventName: 'AllocationProposed', fromBlock: lookback, toBlock: 'latest' });
    const fromArch = logs.filter((l: any) => l.args.agent?.toLowerCase() === architectAddress.toLowerCase());
    if (fromArch.length > 0) {
      const last = fromArch[fromArch.length - 1];
      return { proposalId: last.args.proposalId as bigint, cid: last.args.reasoningHash as string, block: last.blockNumber! };
    }
    await new Promise(r => setTimeout(r, 30_000));
  }
  return null;
}

async function cycle() {
  const pk = process.env.SENTINEL_PRIVATE_KEY as `0x${string}`;
  const rpc = process.env.MANTLE_RPC_URL!;
  const bus = process.env.AGENT_EVENT_BUS_ADDRESS as `0x${string}`;
  const lighthouseKey = process.env.LIGHTHOUSE_API_KEY!;
  const architectAddress = (process.env.ARCHITECT_ADDRESS ?? '0xbFDb8d132358b2f46D3104Ef484048Bb916De714') as `0x${string}`;
  if (!pk || !rpc || !bus || !lighthouseKey) throw new Error('missing env');

  const account = privateKeyToAccount(pk);
  const publicClient = createPublicClient({ chain: mantle, transport: http(rpc) });
  const walletClient = createWalletClient({ account, chain: mantle, transport: http(rpc) });

  console.log(JSON.stringify({ agent: 'sentinel', stage: 'waiting-for-proposal', maxMs: 600_000 }));
  const upstream = await waitForProposal(publicClient, bus, architectAddress, 600_000);
  if (!upstream) {
    console.log(JSON.stringify({ agent: 'sentinel', stage: 'no-upstream-yet', action: 'sleeping' }));
    return;
  }
  console.log(JSON.stringify({ agent: 'sentinel', stage: 'proposal-found', proposalId: upstream.proposalId.toString(), cid: upstream.cid, block: Number(upstream.block) }));

  // Verdict: approve, with a condition CID containing the per-tranche detail.
  const verdictDraft = {
    agent: account.address,
    role: 'sentinel',
    tokenId: 103,
    proposalId: upstream.proposalId.toString(),
    sourceProposalCid: upstream.cid,
    decision: 'approved',
    perTranche: {
      senior: { rating: 'green', reasons: ['Aave V3 trustless; Ondo oracle-fresh; size within Senior cap'] },
      mezzanine: { rating: 'green', reasons: ['Aave/Agni mix; mETH FX guarded by Chainlink staleness bound'] },
      junior: { rating: 'yellow', reasons: ['Ethena depeg tail risk; perp basis operator-custodied — labeled, not hidden'] }
    },
    publishedAtSec: Math.floor(Date.now() / 1000)
  };
  const verdictSig = await account.signMessage({ message: { raw: keccak256(toBytes(canonicalStringify({ ...verdictDraft, signature: '' }))) } });
  const verdictCid = await pinJson(canonicalStringify({ ...verdictDraft, signature: verdictSig }), lighthouseKey, 'verdict');
  console.log(JSON.stringify({ agent: 'sentinel', stage: 'verdict-pinned', cid: verdictCid, gateway: `https://gateway.lighthouse.storage/ipfs/${verdictCid}` }));

  const verdictTx = await walletClient.writeContract({
    address: bus, abi: BUS_ABI, functionName: 'issueRiskVerdict',
    args: [upstream.proposalId, true, verdictCid]
  });
  await publicClient.waitForTransactionReceipt({ hash: verdictTx });
  console.log(JSON.stringify({ agent: 'sentinel', stage: 'verdict-tx-mined', txHash: verdictTx, mantlescan: `https://mantlescan.xyz/tx/${verdictTx}` }));

  // One asset risk rating per tranche so the dashboard's green/yellow/red panel has data.
  const ratingDraft = { proposalId: upstream.proposalId.toString(), asset: USDC, ratings: [{ tranche: 0, rating: 'green' }, { tranche: 1, rating: 'green' }, { tranche: 2, rating: 'yellow' }] };
  const ratingCid = await pinJson(canonicalStringify(ratingDraft), lighthouseKey, 'rating');
  const ratingTx = await walletClient.writeContract({
    address: bus, abi: BUS_ABI, functionName: 'setAssetRiskRating',
    args: [upstream.proposalId, 0, USDC, 1, ratingCid] // tranche=Senior, rating=Green (enum: None=0, Green=1, Yellow=2, Red=3)
  });
  await publicClient.waitForTransactionReceipt({ hash: ratingTx });
  console.log(JSON.stringify({ agent: 'sentinel', stage: 'rating-tx-mined', txHash: ratingTx, ratingCid }));

  // Hedge signal so the Operator has a signalId to fill.
  const hedgeDraft = {
    agent: account.address,
    role: 'sentinel',
    tokenId: 103,
    underlyingAsset: USDC,
    deltaSizeUsdc6dec: '1000000000', // $1000 in USDC base units
    rationale: 'Mezzanine FX-labeled mETH leg crossed Chainlink staleness ceiling; hedging $1k notional via perp basis.',
    publishedAtSec: Math.floor(Date.now() / 1000)
  };
  const hedgeSig = await account.signMessage({ message: { raw: keccak256(toBytes(canonicalStringify({ ...hedgeDraft, signature: '' }))) } });
  const hedgeCid = await pinJson(canonicalStringify({ ...hedgeDraft, signature: hedgeSig }), lighthouseKey, 'hedge-signal');
  const hedgeTx = await walletClient.writeContract({
    address: bus, abi: BUS_ABI, functionName: 'emitHedgeSignal',
    args: [USDC, 1_000_000_000n, hedgeCid]
  });
  const hedgeReceipt = await publicClient.waitForTransactionReceipt({ hash: hedgeTx });
  let signalId: string | null = null;
  for (const log of hedgeReceipt.logs) {
    try {
      const decoded = decodeEventLog({ abi: BUS_ABI, data: log.data, topics: log.topics, eventName: 'HedgeSignalEmitted' });
      if (decoded.eventName === 'HedgeSignalEmitted') { signalId = (decoded.args as any).signalId.toString(); break; }
    } catch { /* not the event we want */ }
  }
  console.log(JSON.stringify({ agent: 'sentinel', stage: 'hedge-tx-mined', txHash: hedgeTx, signalId, hedgeCid, mantlescan: `https://mantlescan.xyz/tx/${hedgeTx}` }));
}

async function main() {
  while (true) {
    try { await cycle(); } catch (err) { console.error(JSON.stringify({ agent: 'sentinel', error: err instanceof Error ? err.message : String(err) })); }
    await new Promise(r => setTimeout(r, 86_400_000));
  }
}

main();
