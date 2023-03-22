// SPDX-License-Identifier: GPL-3.0

pragma solidity ^0.8;
import "hardhat/console.sol";

contract Storage {
    uint256 private value;

    constructor(uint256 initialValue) {
        value = initialValue;
        console.log("Constructor", value);
    }

    function store(uint256 number_) public virtual {
        value = number_;
        console.log("Store", number_);
    }

    function retrieve() public virtual view returns (uint256) {
        console.log("Retrieve", value);
        return value;
    }

}
