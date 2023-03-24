// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8;
import "./E00.Implementation.sol";
import "hardhat/console.sol";

contract SimpleProxy {
    uint256 private reservedImplementationStateSlot;
    address private implementation;

    function upgradeTo(address newImplementation) external virtual {
        implementation = newImplementation;
    }

    function store(uint256 value) public {
        (, bytes memory result) = address(implementation).delegatecall(
            abi.encodeWithSelector(Implementation.store.selector, value)
        );
        result;
    }

    function retrieve() public returns (uint256 value) {
        (, bytes memory result) = address(implementation).delegatecall(
            abi.encodeWithSelector(Implementation.retrieve.selector)
        );
        value = abi.decode(result, (uint256));
    }
}
