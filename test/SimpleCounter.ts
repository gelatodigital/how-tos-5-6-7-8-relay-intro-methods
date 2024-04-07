import hre, { deployments, getNamedAccounts, network, ethers } from "hardhat";
import { expect } from "chai";
import { SimpleCounter } from "../typechain";
import { SignerWithAddress } from "@nomicfoundation/hardhat-ethers/signers";



describe("Test SimpleCounter Smart Contract", function () {
  let simpleCounter: SimpleCounter;

  beforeEach("tests", async function () {
    if (hre.network.name !== "hardhat") {
      console.error("Test Suite is meant to be run on hardhat only");
      process.exit(1);
    }
    await deployments.fixture();

  const simpleCounterAddress =  (await deployments.get("OneBalanceSimpleCounter")
  ).address
   
  simpleCounter= (await ethers.getContractAt(
    "OneBalanceSimpleCounter",
    simpleCounterAddress
  )) as SimpleCounter;

  });

  it("#1: increment", async () => {
    let initCounter = +(await simpleCounter.counter()).toString()
    await simpleCounter.increment()
    let endCounter =  +(await simpleCounter.counter()).toString()
    expect( initCounter +1 == endCounter,"Counter not increase"
    ).to.be.true;
  });


});
