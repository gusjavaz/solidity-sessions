import { ethers } from "hardhat";

async function main() {
  const initialValue = 100;
  const storageFactory = await ethers.getContractFactory("Storage");
  const storage = await storageFactory.deploy();

  await storage.deployed();

  console.log(
    `Storage with initial value=${initialValue} deployed to ${storage.address}`
  );
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
