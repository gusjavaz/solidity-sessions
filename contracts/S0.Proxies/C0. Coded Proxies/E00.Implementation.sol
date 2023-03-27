// SPDX-License-Identifier: GPL-3.0

pragma solidity ^0.8;
import "hardhat/console.sol";

contract Implementation {
    uint256 private value;

    function store(uint256 value_) public {
        value = value_;
    }

    function retrieve() view public returns (uint256) {
        return value;
    }
}
