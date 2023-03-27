import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { anyValue } from "@nomicfoundation/hardhat-chai-matchers/withArgs";
import { expect } from "chai";
import { ethers, network } from "hardhat";
import { BigNumber, ContractReceipt, ContractTransaction } from "ethers";
import Implementation from "../../artifacts/contracts/S0.Proxies/C0. Coded Proxies/E00.Implementation.sol/Implementation.json"
import InitializableImplementation from "../../artifacts/contracts/S0.Proxies/C0. Coded Proxies/E03.InitializableImplementation.sol/InitializableImplementation.json"

describe("Coded Proxies", function () {
  const otherValue = 1000;

  async function deployStorageFixture() {
    const [owner, otherAccount] = await ethers.getSigners();

    const implementationFactory = await ethers.getContractFactory("Implementation");
    const implementation = await implementationFactory.deploy();

    const simpleProxyFactory = await ethers.getContractFactory("SimpleProxy");
    const simpleProxy = await simpleProxyFactory.deploy();
    await simpleProxy.upgradeTo(implementation.address);

    const genericProxyFactory = await ethers.getContractFactory("GenericProxy");
    const genericProxy = await genericProxyFactory.deploy();
    await genericProxy.upgradeTo(implementation.address);

    const initializableImplementationFactory = await ethers.getContractFactory("InitializableImplementation");
    const initializableImplementation = await initializableImplementationFactory.deploy();

    const initializableProxyFactory = await ethers.getContractFactory("InitializableProxy");
    const initializableProxy = await initializableProxyFactory.deploy();
    await initializableProxy.upgradeTo(initializableImplementation.address);
    await initializableProxy.initialize(otherValue);

    const nonCollisionableProxyFactory = await ethers.getContractFactory("NonCollisionableProxy");
    const nonCollisionableProxy = await nonCollisionableProxyFactory.deploy();
    await nonCollisionableProxy.upgradeTo(initializableImplementation.address);
    await nonCollisionableProxy.initialize(otherValue);

    const assemblyProxyFactory = await ethers.getContractFactory("AssemblyProxy");
    const assemblyProxy = await assemblyProxyFactory.deploy();
    await assemblyProxy.upgradeTo(initializableImplementation.address);
    await assemblyProxy.initialize(otherValue);

    let iface = new ethers.utils.Interface(Implementation.abi);
    const storeCalldata = iface.encodeFunctionData("store", [otherValue])
    const retrieveCalldata = iface.encodeFunctionData("retrieve")


    return { implementation, simpleProxy, genericProxy, initializableProxy, nonCollisionableProxy, assemblyProxy, owner, storeCalldata , retrieveCalldata};
  }

  describe("Implementation", function () {
    it("Should store and retrieve correct value through proxy ", async function () {
      const { implementation } = await loadFixture(deployStorageFixture);
      await implementation.store(otherValue);
      expect(await implementation.callStatic.retrieve()).to.equal(otherValue);
    });
  });

  describe("Simple Proxy", function () {
    it("Should store and retrieve correct value through proxy", async function () {
      const { simpleProxy } = await loadFixture(deployStorageFixture);
      await simpleProxy.store(otherValue);
      expect(await simpleProxy.callStatic.retrieve()).to.equal(otherValue);
    });
  });

  describe("Generic Proxy", function () {
    it("Should store and retrieve correct value through proxy", async function () {
      const { owner, genericProxy, storeCalldata, retrieveCalldata } = await loadFixture(deployStorageFixture);
      await owner.sendTransaction({
        to: genericProxy.address,
        data: storeCalldata
      })
      const value = await owner.call({
        to: genericProxy.address,
        data: retrieveCalldata
      })
      expect(BigNumber.from(value)).to.equal(otherValue)
    });
  });

  describe("Initializable Proxy", function () {
    it("Should retrieve an initialized value", async function () {
      const { owner, initializableProxy, retrieveCalldata } = await loadFixture(deployStorageFixture);
      const value = await owner.call({
        to: initializableProxy.address,
        data: retrieveCalldata
      })
      expect(BigNumber.from(value)).to.equal(otherValue)
    });
  });

  describe("Non collisionable Proxy", function () {
    it("Should store and retrieve correct value through proxy", async function () {
      const { owner, nonCollisionableProxy, storeCalldata, retrieveCalldata } = await loadFixture(deployStorageFixture);
      await owner.sendTransaction({
        to: nonCollisionableProxy.address,
        data: storeCalldata
      })
      const value = await owner.call({
        to: nonCollisionableProxy.address,
        data: retrieveCalldata
      })
      expect(BigNumber.from(value)).to.equal(otherValue)
    });
  });

  describe("Assembly Proxy", function () {
    it("Should store and retrieve correct value through proxy", async function () {
      const { owner, assemblyProxy, storeCalldata, retrieveCalldata } = await loadFixture(deployStorageFixture);
      await owner.sendTransaction({
        to: assemblyProxy.address,
        data: storeCalldata
      })
      const value = await owner.call({
        to: assemblyProxy.address,
        data: retrieveCalldata
      })
      expect(BigNumber.from(value)).to.equal(otherValue)
    });
  });

});


