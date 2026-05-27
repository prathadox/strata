import { ethers } from "hardhat";

const AGENTS = [
  { address: "0x7CAC071f0F59dEe64509ea1C3BD8245bE529fcdE", role: "Scout" },
  { address: "0xbFDb8d132358b2f46D3104Ef484048Bb916De714", role: "Architect" },
  { address: "0xfE7EB19092F03E00B6eD0a248D38E80e0aA8708f", role: "Sentinel" },
  { address: "0xB342B41A68a3c6C36Efb8f224CDd252F90aD519E", role: "Operator" },
  { address: "0x59767a3E91998A07D11aBE13CD460Fa3249CA628", role: "Compliance" },
];

async function main() {
  const contractAddr = process.env.IDENTITY_CONTRACT;
  if (!contractAddr) {
    console.error("Usage: IDENTITY_CONTRACT=0x... npx hardhat run scripts/verify-identities.ts --network mantle");
    process.exit(1);
  }

  const identity = await ethers.getContractAt("StrataIdentity", contractAddr);
  console.log("StrataIdentity at:", contractAddr);
  console.log("Owner:", await identity.owner());
  console.log("");

  for (const agent of AGENTS) {
    const agentId = await identity.agentIdOf(agent.address);
    if (agentId === 0n) {
      console.log(`  ${agent.role}: NOT REGISTERED`);
      continue;
    }
    const owner = await identity.ownerOf(agentId);
    const uri = await identity.tokenURI(agentId);
    const role = ethers.toUtf8String(await identity.getMetadata(agentId, "role"));
    const chain = ethers.toUtf8String(await identity.getMetadata(agentId, "chain"));
    const wallet = await identity.getAgentWallet(agentId);

    console.log(`  ${agent.role} (agentId #${agentId}):`);
    console.log(`    nft owner:    ${owner}`);
    console.log(`    agent wallet: ${wallet}`);
    console.log(`    uri:          ${uri}`);
    console.log(`    role:         ${role}`);
    console.log(`    chain:        ${chain}`);
    console.log(`    match:        ${owner.toLowerCase() === agent.address.toLowerCase() ? "OK" : "MISMATCH"}`);
    console.log("");
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
