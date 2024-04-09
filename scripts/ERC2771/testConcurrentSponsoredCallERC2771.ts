import {
  CallWithConcurrentERC2771Request,
  GelatoRelay,
  SponsoredCallRequest,
} from "@gelatonetwork/relay-sdk";
import { ethers } from "ethers";
import * as dotenv from "dotenv";

dotenv.config({ path: ".env" });

const ALCHEMY_ID = process.env.ALCHEMY_ID;
const GELATO_RELAY_API_KEY = process.env.GELATO_RELAY_API_KEY;

const RPC_URL = `https://rpc.arb-blueberry.gelato.digital`;

const provider = new ethers.JsonRpcProvider(RPC_URL);
const signer = new ethers.Wallet(process.env.PRIVATE_KEY as string, provider);
console.log(signer.address);
const relay = new GelatoRelay();

const testConcurrentSponsoredCallERC2771 = async () => {
  const counter = "0x5041c60C75633F29DEb2AED79cB0A9ed79202415";
  const abi = ["function increment()"];

  const user = await signer.getAddress();

  const chainId = (await provider.getNetwork()).chainId;

  // Generate the target payload
  const contract = new ethers.Contract(counter, abi, signer);
  const { data } = await contract.increment.populateTransaction();

  // Populate a relay request
  const request: CallWithConcurrentERC2771Request = {
    chainId,
    target: counter,
    data: data as string,
    user: user as string,
    isConcurrent: true,
  };

  // Without a specific API key, the relay request will fail!
  // Go to https://relay.gelato.network to get a testnet API key with 1Balance.
  // Send a relay request using Gelato Relay!
  const response = await relay.sponsoredCallERC2771(
    request,
    signer as any,
    GELATO_RELAY_API_KEY as string,
  );

  console.log(`https://relay.gelato.digital/tasks/status/${response.taskId}`);
};

testConcurrentSponsoredCallERC2771();
