// SPDX-License-Identifier: MIT
pragma solidity ^0.8.10;

// Open Zeppelin libraries for controlling upgradability and access.
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "hardhat/console.sol";

contract UUPSImplementationV2 is Initializable, UUPSUpgradeable, OwnableUpgradeable {
    uint256 private value;

    ///@dev no constructor in upgradable contracts. Instead we have initializers
    function initialize(uint256 value_) public initializer {
        ///@dev as there is no constructor, we need to initialise the OwnableUpgradeable explicitly
        value = value_;
        __Ownable_init();
    }

    ///@dev required by the OZ UUPS module
    function _authorizeUpgrade(address) internal override onlyOwner {}

    function store(uint256 num) public virtual {
        value = num *2;
    }

    function retrieve() public view virtual returns (uint256) {
        return value;
    }
}