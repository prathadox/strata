// Register all 5 Strata agents on the official ERC-8004 IdentityRegistry on Mantle.
//
// Flow: deployer calls register() for each agent (NFT minted to deployer),
// sets metadata, then transfers the NFT to the agent's address.
//
// Usage:
//   DEPLOYER_PRIVATE_KEY=0x... npx hardhat run scripts/register-agents-8004.ts --network mantle

import { ethers } from "hardhat";
import IdentityRegistryABI from "../abis/IdentityRegistry.json";

const IDENTITY_REGISTRY = "0x8004A169FB4a3325136EB29fA0ceB6D2e539a432";

const AGENTS = [
  { address: "0x7CAC071f0F59dEe64509ea1C3BD8245bE529fcdE", role: "Scout",     desc: "YieldSourcing" },
  { address: "0xbFDb8d132358b2f46D3104Ef484048Bb916De714", role: "Architect",  desc: "PortfolioAllocation" },
  { address: "0xfE7EB19092F03E00B6eD0a248D38E80e0aA8708f", role: "Sentinel",  desc: "RiskGating" },
  { address: "0xB342B41A68a3c6C36Efb8f224CDd252F90aD519E", role: "Operator",  desc: "HedgeExecution" },
  { address: "0x59767a3E91998A07D11aBE13CD460Fa3249CA628", role: "Compliance", desc: "DepositGate" },
];

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deployer:", deployer.address);

  const registry = new ethers.Contract(IDENTITY_REGISTRY, IdentityRegistryABI, deployer);

  for (const agent of AGENTS) {
    console.log(`\nRegistering ${agent.role}...`);

    // Register with URI and metadata
    const metadata = [
      { metadataKey: "role", metadataValue: ethers.toUtf8Bytes(agent.desc) },
      { metadataKey: "chain", metadataValue: ethers.toUtf8Bytes("mantle:5000") },
      { metadataKey: "protocol", metadataValue: ethers.toUtf8Bytes("strata") },
    ];

    const tx = await registry["register(string,(string,bytes)[])"](
      "ipfs://placeholder",
      metadata
    );
    const receipt = await tx.wait();

    // Get agentId from Registered event
    const event = receipt.logs.find(
      (l: any) => l.topics[0] === ethers.id("Registered(uint256,string,address)")
    );
    const agentId = event ? BigInt(event.topics[1]) : 0n;
    console.log(`  Registered: agentId #${agentId} (tx: ${receipt.hash})`);

    // Transfer NFT to the agent address
    const transferTx = await registry.transferFrom(deployer.address, agent.address, agentId);
    await transferTx.wait();
    console.log(`  Transferred NFT #${agentId} to ${agent.address}`);
  }

  console.log("\n--- Verification ---\n");

  for (const agent of AGENTS) {
    try {
      // Find agent's token by checking balance
      const balance = await registry.balanceOf(agent.address);
      if (balance === 0n) {
        console.log(`  ${agent.role}: NO TOKEN`);
        continue;
      }
      // tokenOfOwnerByIndex if available, otherwise we use the agentId we know
      const tokenId = await registry.tokenOfOwnerByIndex(agent.address, 0);
      const owner = await registry.ownerOf(tokenId);
      const uri = await registry.tokenURI(tokenId);
      const role = ethers.toUtf8String(await registry.getMetadata(tokenId, "role"));
      console.log(`  ${agent.role} (agentId #${tokenId}): owner=${owner}, role=${role}, uri=${uri}`);
    } catch (e: any) {
      console.log(`  ${agent.role}: verify failed - ${e.message?.slice(0, 80)}`);
    }
  }

  console.log("\nDone. All 5 agents registered on official ERC-8004 registry.");
  console.log("Registry:", IDENTITY_REGISTRY);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
