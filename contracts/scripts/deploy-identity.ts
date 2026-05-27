import { ethers } from "hardhat";

const AGENTS = [
  {
    address: "0x7CAC071f0F59dEe64509ea1C3BD8245bE529fcdE",
    role: "Scout",
    agentURI: "ipfs://placeholder",
    metadata: [
      { metadataKey: "role", metadataValue: ethers.toUtf8Bytes("YieldSourcing") },
      { metadataKey: "chain", metadataValue: ethers.toUtf8Bytes("mantle:5000") },
    ],
  },
  {
    address: "0xbFDb8d132358b2f46D3104Ef484048Bb916De714",
    role: "Architect",
    agentURI: "ipfs://placeholder",
    metadata: [
      { metadataKey: "role", metadataValue: ethers.toUtf8Bytes("PortfolioAllocation") },
      { metadataKey: "chain", metadataValue: ethers.toUtf8Bytes("mantle:5000") },
    ],
  },
  {
    address: "0xfE7EB19092F03E00B6eD0a248D38E80e0aA8708f",
    role: "Sentinel",
    agentURI: "ipfs://placeholder",
    metadata: [
      { metadataKey: "role", metadataValue: ethers.toUtf8Bytes("RiskGating") },
      { metadataKey: "chain", metadataValue: ethers.toUtf8Bytes("mantle:5000") },
    ],
  },
  {
    address: "0xB342B41A68a3c6C36Efb8f224CDd252F90aD519E",
    role: "Operator",
    agentURI: "ipfs://placeholder",
    metadata: [
      { metadataKey: "role", metadataValue: ethers.toUtf8Bytes("HedgeExecution") },
      { metadataKey: "chain", metadataValue: ethers.toUtf8Bytes("mantle:5000") },
    ],
  },
  {
    address: "0x59767a3E91998A07D11aBE13CD460Fa3249CA628",
    role: "Compliance",
    agentURI: "ipfs://placeholder",
    metadata: [
      { metadataKey: "role", metadataValue: ethers.toUtf8Bytes("DepositGate") },
      { metadataKey: "chain", metadataValue: ethers.toUtf8Bytes("mantle:5000") },
    ],
  },
];

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deployer:", deployer.address);

  const factory = await ethers.getContractFactory("StrataIdentity");
  const identity = await factory.deploy();
  await identity.waitForDeployment();
  const addr = await identity.getAddress();
  console.log("StrataIdentity deployed:", addr);
  console.log("");

  for (const agent of AGENTS) {
    const tx = await identity.registerFor(agent.address, agent.agentURI, agent.metadata);
    const receipt = await tx.wait();
    console.log(`  Registered: ${agent.role} -> ${agent.address} (tx: ${receipt!.hash})`);
  }

  console.log("\n--- Verification ---\n");

  for (const agent of AGENTS) {
    const agentId = await identity.agentIdOf(agent.address);
    const uri = await identity.tokenURI(agentId);
    const owner = await identity.ownerOf(agentId);
    const role = ethers.toUtf8String(await identity.getMetadata(agentId, "role"));
    const chain = ethers.toUtf8String(await identity.getMetadata(agentId, "chain"));
    console.log(`  ${agent.role} (agentId #${agentId}):`);
    console.log(`    owner:    ${owner}`);
    console.log(`    uri:      ${uri}`);
    console.log(`    role:     ${role}`);
    console.log(`    chain:    ${chain}`);
    console.log(`    match:    ${owner.toLowerCase() === agent.address.toLowerCase() ? "OK" : "MISMATCH"}`);
    console.log("");
  }

  console.log("Set IDENTITY_REGISTRY_ADDRESS=" + addr + " in agent .env files.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
