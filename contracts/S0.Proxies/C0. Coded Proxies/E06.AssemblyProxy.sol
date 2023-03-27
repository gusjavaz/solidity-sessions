// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8;
import "./E03.InitializableImplementation.sol";
import "hardhat/console.sol";

contract AssemblyProxy {
    bytes32 private constant implementationPosition =
        bytes32(
            uint256(keccak256("solidity_sessions.proxy.implementation")) - 1
        );
    
    event Delegated();

    function initialize(uint256 value) public {
        (, bytes memory result) = address(getImplementation()).delegatecall(
            abi.encodeWithSelector(InitializableImplementation.initialize.selector, value)
        );
        result;
    }

    function upgradeTo(address newImplementation) external virtual {
        bytes32 implementationPosition_ = implementationPosition;
        assembly ("memory-safe") {
            sstore(implementationPosition_, newImplementation)
        }
    }

    function getImplementation() public view returns (address implementation) {
        bytes32 implementationPosition_ = implementationPosition;
        assembly ("memory-safe") {
            implementation := sload(implementationPosition_)
        }
    }

    fallback(bytes calldata data) external returns (bytes memory) {
        (, bytes memory result) = address(getImplementation()).delegatecall(data);
        // If we do not emit or console here, the send transaction is not delegated (???)
        emit Delegated();
        return result;
    }
}
