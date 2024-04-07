// SPDX-License-Identifier: MIT
pragma solidity 0.8.23;

contract OneBalanceSimpleCounter {
    uint256 public counter;

    event IncrementCounter(address msgSender,uint256 newCounterValue,  uint256 timestamp);

    function increment() external {
        counter++;
        emit IncrementCounter( msg.sender, counter,block.timestamp);
    }
}
