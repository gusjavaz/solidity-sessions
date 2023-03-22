import { time, loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { anyValue } from "@nomicfoundation/hardhat-chai-matchers/withArgs";
import { expect } from "chai";
import { ethers } from "hardhat";

describe("Lock", function () {
  const initialValue = 100;
  const anotherValue = 1000;

  async function deployStorageFixture() {
    const [owner, otherAccount] = await ethers.getSigners();
    const storageFactory = await ethers.getContractFactory("Storage");
    const storage = await storageFactory.deploy(initialValue);
    return { storage: storage, owner, otherAccount };
  }

  describe("Deployment", function () {
    it("Should set initial value", async function () {
      const { storage } = await loadFixture(deployStorageFixture);

      expect(await storage.retrieve()).to.equal(initialValue);
    });

    it("Should store and retrieve a value", async function () {
      const { storage } = await loadFixture(deployStorageFixture);
      await storage.store(anotherValue)
      expect(await storage.retrieve()).to.equal(anotherValue);
    });

  });


});
