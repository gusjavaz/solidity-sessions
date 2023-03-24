import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { anyValue } from "@nomicfoundation/hardhat-chai-matchers/withArgs";
import { expect } from "chai";
import { ethers, network } from "hardhat";
import { BigNumber, ContractReceipt, ContractTransaction } from "ethers";
import Implementation from "../../artifacts/contracts/proxies/Type0.Coded/E00.Implementation.sol/Implementation.json"
import InitializableImplementation from "../../artifacts/contracts/proxies/Type0.Coded/E03.InitializableImplementation.sol/InitializableImplementation.json"

describe("Storage", function () {
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

    return { implementation, simpleProxy, genericProxy, initializableProxy, nonCollisionableProxy, assemblyProxy, owner };
  }

  describe("Implementation", function () {
    it("Should store and retrieve a value ", async function () {
      const { implementation } = await loadFixture(deployStorageFixture);
      await implementation.store(otherValue);
      expect(await implementation.callStatic.retrieve()).to.equal(otherValue);
    });
  });

  describe("Simple Proxy", function () {
    it("Should store and retrieve a value", async function () {
      const { simpleProxy } = await loadFixture(deployStorageFixture);
      await simpleProxy.store(otherValue);
      expect(await simpleProxy.callStatic.retrieve()).to.equal(otherValue);
    });
  });

  describe("Generic Proxy", function () {
    it("Should store and retrieve a value", async function () {
      const { owner, genericProxy } = await loadFixture(deployStorageFixture);
      let iface = new ethers.utils.Interface(Implementation.abi);
      const storeCalldata = iface.encodeFunctionData("store", [otherValue])
      await owner.sendTransaction({
        to: genericProxy.address,
        data: storeCalldata
      })
      const retrieveCallData = iface.encodeFunctionData("retrieve")
      const value = await owner.call({
        to: genericProxy.address,
        data: retrieveCallData
      })
      expect(BigNumber.from(value)).to.equal(otherValue)
    });
  });

  describe("Initializable Proxy", function () {
    it("Should retrieve an initialized value", async function () {
      const { owner, initializableProxy } = await loadFixture(deployStorageFixture);
      let iface = new ethers.utils.Interface(InitializableImplementation.abi);
      const retrieveCallData = iface.encodeFunctionData("retrieve")
      const value = await owner.call({
        to: initializableProxy.address,
        data: retrieveCallData
      })
      expect(BigNumber.from(value)).to.equal(otherValue)
    });
  });

  describe("Non collisionable Proxy", function () {
    it("Should store and retrieve a value", async function () {
      const { owner, nonCollisionableProxy } = await loadFixture(deployStorageFixture);
      let iface = new ethers.utils.Interface(Implementation.abi);
      const storeCalldata = iface.encodeFunctionData("store", [otherValue])
      await owner.sendTransaction({
        to: nonCollisionableProxy.address,
        data: storeCalldata
      })
      const retrieveCallData = iface.encodeFunctionData("retrieve")
      const value = await owner.call({
        to: nonCollisionableProxy.address,
        data: retrieveCallData
      })
      expect(BigNumber.from(value)).to.equal(otherValue)
    });
  });

  describe("Assembly Proxy", function () {
    it("Should store and retrieve a value", async function () {
      const { owner, assemblyProxy } = await loadFixture(deployStorageFixture);
      let iface = new ethers.utils.Interface(Implementation.abi);
      const storeCalldata = iface.encodeFunctionData("store", [otherValue])
      await owner.sendTransaction({
        to: assemblyProxy.address,
        data: storeCalldata
      })
      const retrieveCallData = iface.encodeFunctionData("retrieve")
      const value = await owner.call({
        to: assemblyProxy.address,
        data: retrieveCallData
      })
      expect(BigNumber.from(value)).to.equal(otherValue)
    });
  });

});


