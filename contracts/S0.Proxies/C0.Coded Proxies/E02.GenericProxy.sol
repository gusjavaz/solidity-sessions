// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8;
import "./E00.Implementation.sol";
import "hardhat/console.sol";

contract GenericProxy {
    uint256 private reservedImplementationStateSlot;
    address private implementation;

    event Delegated();

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