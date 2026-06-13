// Operator demo entrypoint for Railway. Once per 24h, reads the latest HedgeSignalEmitted signalId
// from the bus (waits up to 10 minutes for Sentinel on first boot), then logs an execution receipt
// pointing back to that signalId.

import { createPublicClient, createWalletClient, http, parseAbi, parseAbiItem, keccak256, toBytes } from 'viem';
import { privateKeyToAccount } from 'viem/accounts';
import { mantle } from 'viem/chains';

const BUS_ABI = parseAbi([
  'function logHedge(uint256 signalId, address hedgedAsset, int256 netPosition, string executionProof) external',
  'function hedgeSignalCount() view returns (uint256)'
]);
const PERP_ADAPTER_ABI = parseAbi([
  'function reportHedgeValue(int256 value, uint256 signalId) external'
]);
const HEDGE_SIGNAL_EMITTED = parseAbiItem('event HedgeSignalEmitted(uint256 indexed signalId, address indexed agent, address indexed underlyingAsset, int256 deltaSize, string reasoningCid)');

const USDC = '0x09Bc4E0D864854c6aFB6eB9A9cdF58aC190D0dF9' as const;
// perpAdapter from contracts/deployments/5000.json
const PERP_ADAPTER = '0x55F90908eFe0E8e78a4CDE445d57a1EDB26d3f32' as const;

async function pinJson(json: string, apiKey: string): Promise<string> {
  const blob = new Blob([json], { type: 'application/json' });
  const form = new FormData();
  form.append('file', blob, 'hedge-log.json');
  const res = await fetch('https://api.pinata.cloud/pinning/pinFileToIPFS', {
    method: 'POST', headers: { Authorization: `Bearer ${apiKey}` }, body: form
  });
  if (!res.ok) throw new Error(`pinata ${res.status}: ${await res.text()}`);
  return (await res.json()).IpfsHash;
}

function canonicalStringify(obj: unknown): string {
  return JSON.stringify(obj, Object.keys(obj as object).sort());
}

async function waitForSignal(client: any, bus: `0x${string}`, sentinelAddress: `0x${string}`, maxMs: number) {
  const deadline = Date.now() + maxMs;
  const latestBlock = await client.getBlockNumber();
  const lookback = latestBlock > 50_000n ? latestBlock - 50_000n : 0n;
  while (Date.now() < deadline) {
    const logs = await client.getContractEvents({ address: bus, abi: [HEDGE_SIGNAL_EMITTED], eventName: 'HedgeSignalEmitted', fromBlock: lookback, toBlock: 'latest' });
    const fromSentinel = logs.filter((l: any) => l.args.agent?.toLowerCase() === sentinelAddress.toLowerCase());
    if (fromSentinel.length > 0) {
      const last = fromSentinel[fromSentinel.length - 1];
      return { signalId: last.args.signalId as bigint, asset: last.args.underlyingAsset as `0x${string}`, delta: last.args.deltaSize as bigint, cid: last.args.reasoningCid as string, block: last.blockNumber! };
    }
    await new Promise(r => setTimeout(r, 30_000));
  }
  return null;
}

async function cycle() {
  const pk = process.env.OPERATOR_PRIVATE_KEY as `0x${string}`;
  const rpc = process.env.MANTLE_RPC_URL!;
  const bus = process.env.AGENT_EVENT_BUS_ADDRESS as `0x${string}`;
  const pinataJwt = process.env.PINATA_JWT!;
  const sentinelAddress = (process.env.SENTINEL_ADDRESS ?? '0xfE7EB19092F03E00B6eD0a248D38E80e0aA8708f') as `0x${string}`;
  if (!pk || !rpc || !bus || !pinataJwt) throw new Error('missing env');

  const account = privateKeyToAccount(pk);
  const publicClient = createPublicClient({ chain: mantle, transport: http(rpc) });
  const walletClient = createWalletClient({ account, chain: mantle, transport: http(rpc) });

  console.log(JSON.stringify({ agent: 'operator', stage: 'waiting-for-hedge-signal', maxMs: 600_000 }));
  const upstream = await waitForSignal(publicClient, bus, sentinelAddress, 600_000);
  if (!upstream) {
    console.log(JSON.stringify({ agent: 'operator', stage: 'no-upstream-yet', action: 'sleeping' }));
    return;
  }
  console.log(JSON.stringify({ agent: 'operator', stage: 'signal-found', signalId: upstream.signalId.toString(), cid: upstream.cid, block: Number(upstream.block) }));

  const fillNotional = upstream.delta / 2n;
  const draft = {
    agent: account.address,
    role: 'operator',
    tokenId: 104,
    signalId: upstream.signalId.toString(),
    sourceSignalCid: upstream.cid,
    hedgedAsset: upstream.asset,
    netPositionUsdc6dec: fillNotional.toString(),
    venue: 'Byreal Perps (Hyperliquid settlement)',
    synthetic: true,
    fill: {
      side: 'short',
      sizeBase: '0.0',
      avgPriceUsd: '0.0',
      filledAtSec: Math.floor(Date.now() / 1000),
      note: 'Operator escrowed the spot leg on-chain; the perp leg fill is reported off-chain via PerpBasisEscrowAdapter.reportHedgeValue.'
    },
    publishedAtSec: Math.floor(Date.now() / 1000)
  };
  const sig = await account.signMessage({ message: { raw: keccak256(toBytes(canonicalStringify({ ...draft, signature: '' }))) } });
  const cid = await pinJson(canonicalStringify({ ...draft, signature: sig }), pinataJwt);
  console.log(JSON.stringify({ agent: 'operator', stage: 'pinned', cid, gateway: `https://gateway.pinata.cloud/ipfs/${cid}` }));

  const hash = await walletClient.writeContract({
    address: bus, abi: BUS_ABI, functionName: 'logHedge',
    args: [upstream.signalId, USDC, fillNotional, cid]
  });
  const receipt = await publicClient.waitForTransactionReceipt({ hash });
  console.log(JSON.stringify({ agent: 'operator', stage: 'tx-mined', txHash: hash, signalId: upstream.signalId.toString(), block: Number(receipt.blockNumber), status: receipt.status, mantlescan: `https://mantlescan.xyz/tx/${hash}` }));

  // Report off-chain perp mark to the adapter so NAV reflects the hedge.
  // PerpBasisEscrowAdapter.reportHedgeValue(int256 value, uint256 signalId), onlyOwnerOrOperator.
  try {
    const perpHash = await walletClient.writeContract({
      address: PERP_ADAPTER, abi: PERP_ADAPTER_ABI, functionName: 'reportHedgeValue',
      args: [fillNotional, upstream.signalId]
    });
    const perpReceipt = await publicClient.waitForTransactionReceipt({ hash: perpHash });
    console.log(JSON.stringify({ agent: 'operator', stage: 'perp-report-mined', txHash: perpHash, signalId: upstream.signalId.toString(), block: Number(perpReceipt.blockNumber), status: perpReceipt.status, mantlescan: `https://mantlescan.xyz/tx/${perpHash}` }));
  } catch (err) {
    console.error(JSON.stringify({ agent: 'operator', stage: 'perp-report-failed', signalId: upstream.signalId.toString(), error: err instanceof Error ? err.message : String(err) }));
  }
}

async function main() {
  while (true) {
    try { await cycle(); } catch (err) { console.error(JSON.stringify({ agent: 'operator', error: err instanceof Error ? err.message : String(err) })); }
    await new Promise(r => setTimeout(r, 86_400_000));
  }
}

main();
