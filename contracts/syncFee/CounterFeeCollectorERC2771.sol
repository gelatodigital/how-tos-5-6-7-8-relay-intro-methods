// SPDX-License-Identifier: MIT
pragma solidity 0.8.23;


import {
    GelatoRelayFeeCollectorERC2771
} from "@gelatonetwork/relay-context/contracts/GelatoRelayFeeCollectorERC2771.sol";
import {Address} from "@openzeppelin/contracts/utils/Address.sol";


// Inheriting GelatoRelayFeeCollector gives access to:
// 1. _getFeeCollector(): returns the address of Gelato's feeCollector
// 2. __msgData(): returns the original msg.data without feeCollector appended
// 3. onlyGelatoRelay modifier: allows only Gelato Relay's smart contract to call the function
contract CounterFeeCollectorERC2771 is  GelatoRelayFeeCollectorERC2771 {
    using Address for address payable;

    uint256 public counter;
    address public owner;
    // solhint-disable-next-line var-name-mixedcase

    event GetBalance(uint256 balance);
    event IncrementCounter(uint256 newCounterValue, address msgSender);

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
    // if you do not use the onlyGelatoRelayERC2771 modifier,
    // anyone could encode themselves as the fee collector
    // in the low-level data and drain tokens from this contract.
    function increment(uint256 _fee) external {
        // Checks

        // Effects
        counter++;

        // Interactions
        payable(_getFeeCollector()).sendValue(_fee);

        emit IncrementCounter(
            counter, _getMsgSender()
        );
    }

    function emptyBalance() external onlyOwner {
        payable(msg.sender).sendValue(address(this).balance);
    }

    function getBalance() external {
        emit GetBalance(address(this).balance);
    }

 
}
