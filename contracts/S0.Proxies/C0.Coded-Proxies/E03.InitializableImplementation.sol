// SPDX-License-Identifier: GPL-3.0

pragma solidity ^0.8;
import "hardhat/console.sol";

contract InitializableImplementation {
    uint256 private value;
    bool private initialized;

    // Implementations constructors are not recognized by proxies since there is no way that proxies can delegate into constructors because they are not stored in the bytecode
    // The solution is to create a one time execution function similar to a constructor
    function initialize(uint256 value_) public {
        if (!initialized){
            value = value_;
            initialized = true;
        }
    }

    function store(uint256 value_) public {
        value = value_;
    }

    function retrieve() view public returns (uint256) {
        return value;
    }
}
