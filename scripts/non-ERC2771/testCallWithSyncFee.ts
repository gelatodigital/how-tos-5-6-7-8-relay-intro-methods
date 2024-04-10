import { CallWithSyncFeeRequest, GelatoRelay } from "@gelatonetwork/relay-sdk";
import { ethers } from "ethers";
import * as dotenv from "dotenv";

dotenv.config({ path: ".env" });

const ALCHEMY_ID = process.env.ALCHEMY_ID;

const RPC_URL = `https://rpc.arb-blueberry.gelato.digital`;

const provider = new ethers.JsonRpcProvider(RPC_URL);
const signer = new ethers.Wallet(process.env.PRIVATE_KEY as string, provider);

const relay = new GelatoRelay();

const testCallWithSyncFee = async () => {
  const counter = "0x0c3E7A7B6D1e0f26e87CE3BFA19616c8062Db3bB";
  const abi = ["function increment()"];

  const user = await signer.getAddress();

  const chainId = (await provider.getNetwork()).chainId;

  // Generate the target payload
  const contract = new ethers.Contract(counter, abi, signer);
  const { data } = await contract.increment.populateTransaction();

  // address of the token to pay fees
  const feeToken = "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE";

  // populate the relay SDK request body
  const request: CallWithSyncFeeRequest = {
    chainId,
    target: counter,
    data: data,
    feeToken: feeToken,
    isRelayContext: true,
  };

  const response = await relay.callWithSyncFee(request);

  console.log(`https://relay.gelato.digital/tasks/status/${response.taskId}`);
};

testCallWithSyncFee();
