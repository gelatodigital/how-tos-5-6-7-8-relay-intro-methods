// SPDX-License-Identifier: MIT
pragma solidity 0.8.23;


import {
    GelatoRelayContext
} from "@gelatonetwork/relay-context/contracts/GelatoRelayContext.sol";
import {Address} from "@openzeppelin/contracts/utils/Address.sol";


// Inheriting GelatoRelayContext gives access to:
// 1. _getFeeCollector(): returns the address of Gelato's feeCollector
// 2. _getFeeToken(): returns the address of the fee token
// 3. _getFee(): returns the fee to pay
// 4. _transferRelayFee(): transfers the required fee to Gelato's feeCollector.abi
// 5. _transferRelayFeeCapped(uint256 maxFee): transfers the fee to Gelato, IF fee < maxFee
// 6. __msgData(): returns the original msg.data without appended information
// 7. onlyGelatoRelay modifier: allows only Gelato Relay's smart contract to call the function
contract CounterRelayContext is GelatoRelayContext {
    using Address for address payable;

    uint256 public counter;
    address public owner;
    // solhint-disable-next-line var-name-mixedcase


    event IncrementCounter(uint256 newCounterValue);

    constructor() {
        owner = msg.sender;
    }

      modifier onlyOwner() {
        require(msg.sender == owner, "NOT_AUTHORIZED");
        _;
    }

    // `increment` is the target function to call
    // this function increments the state variable `counter` by 1
    // Payment to Gelato
    // NOTE: be very careful here!
    // if you do not use the onlyGelatoRelay modifier,
    // anyone could encode themselves as the fee collector
    // in the low-level data and drain tokens from this contract.
    function increment() external {
        // Checks
            require(
                _isGelatoRelay(msg.sender),
                "CounterRelayContext.increment: isGelatoRelay"
            );

        // Effects
        counter++;

        // transfer fees to Gelato
        _transferRelayFee();

        emit IncrementCounter(counter);
    }

    function emptyBalance() external onlyOwner {
        payable(msg.sender).sendValue(address(this).balance);
    }

   receive() external payable {
    // This function is executed when a contract receives plain Ether (without data)
}
}
