const hre = require("hardhat");

async function main() {
  const SwiftClaim = await hre.ethers.getContractFactory("SwiftClaim");
  const swiftClaim = await SwiftClaim.deploy();

  await swiftClaim.waitForDeployment();

  console.log(`SwiftClaim deployed to: ${await swiftClaim.getAddress()}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
