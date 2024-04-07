// SPDX-License-Identifier: MIT
pragma solidity 0.8.23;

import {
    ERC2771Context
} from "@gelatonetwork/relay-context/contracts/vendor/ERC2771Context.sol";

contract OneBalanceCounterERC2771 is ERC2771Context {
    mapping(address => uint256) public counter;

    event IncrementCounter(uint256 newCounterValue, address msgSender);

     constructor(address trustedForwarder) ERC2771Context(trustedForwarder) {}

 
    function increment() external {
        address msgSender = _msgSender();
        counter[msgSender]++;

        emit IncrementCounter(counter[msgSender], msgSender);
    }
}
