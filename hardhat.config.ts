import { HardhatUserConfig } from "hardhat/config";

// PLUGINS
import "@nomiclabs/hardhat-ethers"; 
import "@nomiclabs/hardhat-etherscan";
import "@typechain/hardhat";
import "@nomiclabs/hardhat-waffle"
import "hardhat-deploy";


// ================================= CONFIG =========================================
// Process Env Variables
import * as dotenv from "dotenv";
dotenv.config({ path: __dirname + "/.env" });

const PRIVATE_KEY = process.env.PRIVATE_KEY;
const accounts: string[] =  PRIVATE_KEY ? [PRIVATE_KEY] : [];


const config: HardhatUserConfig = {
  defaultNetwork: "clinkTestnet",

  // hardhat-deploy
  namedAccounts: {
    deployer: {
      default: 0,
    },
  },

  networks: {
    hardhat: {
      forking: {
        url: `https://public-node.rsk.co`,
        //blockNumber:1 ,
      },
    },

    // Shared Testnet
   blueberry: {
      accounts,
      chainId: 88153591557,
      url: `https://public-node.rsk.co`,
    },
    raspberry: {
      accounts,
      chainId: 123420111,
      url: `https://rpc.opcelestia-raspberry.gelato.digital`,
    },
    rootstock: {
      accounts,
      chainId: 30,
      url: `https://public-node.rsk.co`,
    },
  },
  etherscan: {
    apiKey: {
      blueberry: "xxx",
      clinkTestnet: "xxx"
    },
    customChains: [
      {
        network: "blueberry",
        chainId: 88153591557,
        urls: {
          apiURL: "https://arb-blueberry.gelatoscout.com/api",
          browserURL: "https://arb-blueberry.gelatoscout.com"
        }
      },
      {
        network: "clinkTestnet",
        chainId: 123420000987,
        urls: {
          apiURL: "https://c1-testnet.cloud.blockscout.com/api",
          browserURL: "https://c1-testnet.cloud.blockscout.com"
        }
      }
    ]
  },

  solidity: {
    compilers: [
      {
        version: "0.8.23",

        settings: {
          evmVersion: 'paris',
          optimizer: { enabled: true , runs:200},
        },
      },
    ],
  },

  typechain: {
    outDir: "typechain",
    target: "ethers-v5",
  },


};

export default config;
