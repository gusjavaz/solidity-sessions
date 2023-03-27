// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8;
import "./E03.InitializableImplementation.sol";
import "hardhat/console.sol";

contract InitializableProxy {
    uint256 private reservedImplementationStateSlot0;
    bool private reservedImplementationStateSlot1;
    address private implementation;

    event Delegated();
    function initialize(uint256 value) public {
        (, bytes memory result) = address(implementation).delegatecall(
            abi.encodeWithSelector(InitializableImplementation.initialize.selector, value)
        );
        result;
    }

    function upgradeTo(address newImplementation) external virtual {
        implementation = newImplementation;
    }

    fallback (bytes calldata data) external  returns (bytes memory){
        (, bytes memory result) =  address(implementation).delegatecall(data);
        // If we do not emit or console here, the send transaction is not delegated (???)
        emit Delegated();
        return result;
    }
}
