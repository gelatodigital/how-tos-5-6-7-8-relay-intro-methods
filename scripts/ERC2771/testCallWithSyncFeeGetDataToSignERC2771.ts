import {
  CallWithERC2771Request,
  CallWithSyncFeeERC2771Request,
  ERC2771Type,
  GelatoRelay,
} from "@gelatonetwork/relay-sdk";
import { ethers } from "ethers";
import * as dotenv from "dotenv";

dotenv.config({ path: ".env" });

const ALCHEMY_ID = process.env.ALCHEMY_ID;
const GELATO_RELAY_API_KEY = process.env.GELATO_RELAY_API_KEY;

const RPC_URL = `https://public-node.rsk.co`;

const provider = new ethers.JsonRpcProvider(RPC_URL);
const signer = new ethers.Wallet(process.env.PRIVATE_KEY as string, provider);

const relay = new GelatoRelay();

const testCallWithSyncFeeGetDataToSignERC2771 = async () => {
  const counter = "0x5dD1100f23278e0e27972eacb4F1B81D97D071B7";
  const abi = ["function increment()"];

  const user = await signer.getAddress();

  const chainId = (await provider.getNetwork()).chainId;

  // Generate the target payload
  const contract = new ethers.Contract(counter, abi, signer);
  const { data } = await contract.increment.populateTransaction();

  // address of the token to pay fees
  const feeToken = "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE";

  // Populate a relay request
  const request: CallWithSyncFeeERC2771Request = {
    chainId,
    target: counter,
    data: data,
    user: user,
    feeToken: feeToken,
    isRelayContext: true,
  };

  const { struct, typedData } = await relay.getDataToSignERC2771(
    request,
    ERC2771Type.CallWithSyncFee,
    signer as any,
  );

  const signature = await signer.signTypedData(
    typedData.domain,
    typedData.types,
    typedData.message,
  );

  const response = await relay.callWithSyncFeeERC2771WithSignature(
    struct,
    { feeToken, isRelayContext: true },
    signature,
  );

  console.log(`https://relay.gelato.digital/tasks/status/${response.taskId}`);
};

testCallWithSyncFeeGetDataToSignERC2771();
