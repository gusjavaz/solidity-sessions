import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { expect } from "chai";
import { ethers, upgrades } from "hardhat";
import { BigNumber } from "ethers";
import Implementation from "../../artifacts/contracts/S0.Proxies/C0. Coded Proxies/E00.Implementation.sol/Implementation.json"
import InitializableImplementation from "../../artifacts/contracts/S0.Proxies/C0. Coded Proxies/E03.InitializableImplementation.sol/InitializableImplementation.json"
import { keccak256, toUtf8Bytes } from "ethers/lib/utils";

describe("OpenZeppelin Proxies", function () {
  const otherValue = 1000;

  async function deployStorageFixture() {
    const [owner, otherAccount] = await ethers.getSigners();

    const implementationV1Factory = await ethers.getContractFactory("UUPSImplementationV1");
    const implementationV1 = await implementationV1Factory.deploy();
    const implementationV2Factory = await ethers.getContractFactory("UUPSImplementationV2");
    const implementationV2 = await implementationV2Factory.deploy();

    const cloneImplementationFactory = await ethers.getContractFactory("CloneImplementation");
    const cloneImplementation = await cloneImplementationFactory.deploy();

    const uupsProxy = await upgrades.deployProxy(implementationV1Factory, [otherValue]);

    const beacon = await upgrades.deployBeacon(implementationV1Factory);
    const beaconProxy = await upgrades.deployBeaconProxy(beacon, implementationV1Factory, [otherValue]);

    const cloneReceipt = await (await cloneImplementation.deployClone()).wait();
    const topic = keccak256(toUtf8Bytes("CloneDeployedAt(address)"));
    const cloneAddress = '0x'+cloneReceipt.events?.filter(event => event.topics[0] === topic)[0].data.substring(26,66);
    const cloneProxy = cloneImplementationFactory.attach(cloneAddress)

    return { uupsProxy, implementationV1, implementationV2, implementationV2Factory, beacon, beaconProxy, cloneProxy, owner, otherAccount };
  }

  describe("Implementation", function () {
    it("Should store and retrieve correct values through implenmentation", async function () {
      const { implementationV1, implementationV2 } = await loadFixture(deployStorageFixture);
      await implementationV1.store(otherValue);
      expect(await implementationV1.callStatic.retrieve()).to.equal(otherValue);
      await implementationV2.store(otherValue);
      expect(await implementationV2.callStatic.retrieve()).to.equal(otherValue * 2);
    });
  });

  describe("UUPS Proxy", function () {
    it("Should store and retrieve correct values through Proxy", async function () {
      const { uupsProxy } = await loadFixture(deployStorageFixture);
      await uupsProxy.store(otherValue);
      expect(await uupsProxy.callStatic.retrieve()).to.equal(otherValue);
    });

    it("Should upgrade Implementation to V2 and store and retrieve correct values through Proxy", async function () {
      const { implementationV2Factory } = await loadFixture(deployStorageFixture);
      const uupsProxy = await upgrades.deployProxy(implementationV2Factory, [otherValue]);
      await uupsProxy.store(otherValue);
      expect(await uupsProxy.callStatic.retrieve()).to.equal(otherValue * 2);
    });

    it("Should upgrade Implementation to V2 and store and retrieve correct values through Proxy", async function () {
      const { implementationV2Factory, otherAccount } = await loadFixture(deployStorageFixture);
      const uupsProxy = await upgrades.deployProxy(implementationV2Factory, [otherValue]);
      await uupsProxy.store(otherValue);
      expect(await uupsProxy.callStatic.retrieve()).to.equal(otherValue * 2);
    });
  });

  describe("Beacon Proxy", function () {
    it("Should store and retrieve correct values through Proxy", async function () {
      const { beaconProxy } = await loadFixture(deployStorageFixture);
      await beaconProxy.store(otherValue);
      expect(await beaconProxy.callStatic.retrieve()).to.equal(otherValue);
    });

    it("Should upgrade Implementation to V2 and store and retrieve correct values through Proxy", async function () {
      const { beacon, beaconProxy, implementationV2Factory } = await loadFixture(deployStorageFixture);
      await upgrades.upgradeBeacon(beacon, implementationV2Factory);
      const upgraded = implementationV2Factory.attach(beaconProxy.address);
      await upgraded.store(otherValue);
      expect(await upgraded.callStatic.retrieve()).to.equal(otherValue * 2);
    });
  });

  describe("Clone Proxy", function () {
    it("Should store and retrieve correct values through Proxy", async function () {
      const { owner, cloneProxy } = await loadFixture(deployStorageFixture);
      await cloneProxy.store(otherValue);
      expect(await cloneProxy.callStatic.retrieve()).to.equal(otherValue);
    });
  });

});


