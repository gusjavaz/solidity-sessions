// SPDX-License-Identifier: MIT
pragma solidity ^0.8.10;

import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/ClonesUpgradeable.sol";

import "hardhat/console.sol";

contract CloneImplementation is Initializable {

    using ClonesUpgradeable for address;
    uint256 private value;
    event CloneDeployedAt(address);

    function initialize(uint256 value_) public initializer {
        value = value_;
    }

    function store(uint256 num) public virtual {
        value = num;
    }

    function retrieve() public view virtual returns (uint256) {
        return value;
    }

    function deployClone() public returns (address){
        address cloneAddress = address(this).clone();
        emit CloneDeployedAt(cloneAddress);
        return cloneAddress;
    }

}