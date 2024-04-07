import hre, { deployments, getNamedAccounts } from "hardhat";
import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";


const isHardhat = hre.network.name === "hardhat";

const func: DeployFunction = async (hre: HardhatRuntimeEnvironment) => {
  const { deploy } = deployments;
  const { deployer } = await getNamedAccounts();

  if (!isHardhat) {
    console.log(
      `\nDeploying Contracts to to ${hre.network.name}. Hit ctrl + c to abort`
    );
  
  }


  // await deploy("CounterFeeCollector", {
  //   from: deployer,
  //   log: !isHardhat,
  // });

  // await deploy("CounterFeeCollectorERC2771", {
  //   from: deployer,
  //   log: !isHardhat,
  // });

  // await deploy("CounterRelayContext", {
  //   from: deployer,
  //   log: !isHardhat,
  // });

  // await deploy("CounterRelayContextERC2771", {
  //   from: deployer,
  //   log: !isHardhat,
  // });
  
  await deploy("OneBalanceSimpleCounter", {
    from: deployer,
    log: !isHardhat,
  });
  // await deploy("OneBalanceCounterERC2771", {
  //   from: deployer,
  //   log: !isHardhat,
  //   args:["0xd8253782c45a12053594b9deB72d8e8aB2Fca54c"]
  // });

};



func.tags = ["Relay"];

export default func;
