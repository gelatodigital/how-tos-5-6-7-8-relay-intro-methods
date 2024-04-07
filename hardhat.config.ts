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
  defaultNetwork: "hardhat",

  // hardhat-deploy
  namedAccounts: {
    deployer: {
      default: 0,
    },
  },

  networks: {
    hardhat: {
      forking: {
        url: `https://rpc.arb-blueberry.gelato.digital`,
        //blockNumber:1 ,
      },
    },

    // Shared Testnet
   blueberry: {
      accounts,
      chainId: 88153591557,
      url: `https://rpc.arb-blueberry.gelato.digital`,
    },
    raspberry: {
      accounts,
      chainId: 123420111,
      url: `https://rpc.opcelestia-raspberry.gelato.digital`,
    },
    blackberry: {
      accounts,
      chainId: 94204209,
      url: `https://rpc.polygon-blackberry.gelato.digital`,
    },
  },
  etherscan: {
    apiKey: {
      blueberry: "xxx"
    },
    customChains: [
      {
        network: "blueberry",
        chainId: 88153591557,
        urls: {
          apiURL: "https://arb-blueberry.gelatoscout.com/api",
          browserURL: "https://arb-blueberry.gelatoscout.com"
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
