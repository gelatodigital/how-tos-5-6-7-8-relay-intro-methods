"@gelatonetwork/relay-sdk": "^5.5.0",
  

## Backend/Node examples

Please copy `.env.example` to `.env ` and add the GELATO_RELAY_API_KEY, PRIVATE_KEY and ALCHEMY_ID. Then you can run:

### sponsoredCallERC2771
```
yarn testSponsoredCallERC2771
```
code can be found [here](scripts/testSponsoredCallERC2771.ts) and here the [docs](https://docs.gelato.network/developer-services/relay/erc-2771-recommended/sponsoredcallerc2771) 

### sponsoredCall
```
yarn testSponsoredCall
```
code can be found [here](scripts/testSponsoredCall.ts) and here the [docs](https://docs.gelato.network/developer-services/relay/non-erc-2771/sponsoredcall) 


### callWithSyncFee
```
yarn testCallWithSyncFee
```
code can be found [here](scripts/testCallWithSyncFee.ts) and here the [docs](https://docs.gelato.network/developer-services/relay/non-erc-2771/callwithsyncfee) 



### callWithSyncFeeERC2771
```
yarn testCallWithSyncFeeERC2771
```
code can be found [here](scripts/testCallWithSyncFeeERC2771.ts) and here the [docs](https://docs.gelato.network/developer-services/relay/erc-2771-recommended/callwithsyncfeeerc2771) 


### concurrentSponsoredCallERC2771
```
yarn testConcurrentSponsoredCallERC2771
```
code can be found [here](scripts/testConcurrentSponsoredCallERC2771.ts) and here the [docs](https://docs.gelato.network/developer-services/relay/erc-2771-recommended/sponsoredcallerc2771#parameters-for-concurrent-requests) 


### getSignatureDataERC2771 with sponsoredCallERC2771WithSignature
```
yarn testSponsoredCallERC2771WithSignature
```
code can be found [here](scripts/testSponsoredCallERC2771WithSignature.ts) and here the [docs](https://docs.gelato.network/developer-services/relay/erc-2771-recommended/sponsoredcallerc2771#getdatatosignerc2771) 


### getDataToSignERC2771 with sponsoredCallERC2771WithSignature
```
yarn testSponsoredGetDataToSignERC2771
```
code can be found [here](scripts/testSponsoredGetDataToSignERC2771.ts) and here the [docs](https://docs.gelato.network/developer-services/relay/erc-2771-recommended/sponsoredcallerc2771#getdatatosignerc2771) 



### getSignatureDataERC2771 with callWithSyncFeeERC2771WithSignature
```
yarn testCallWithSyncFeeERC2771WithSignature
```
code can be found [here](scripts/testCallWithSyncFeeERC2771WithSignature.ts) and here the [docs](https://docs.gelato.network/developer-services/relay/erc-2771-recommended/callwithsyncfeeerc2771#getsignaturedataerc2771) 


### getDataToSignERC2771 with callWithSyncFeeERC2771WithSignature
```
yarn testCallWithSyncFeeGetDataToSignERC2771
```
code can be found [here](scripts/testCallWithSyncFeeGetDataToSignERC2771.ts)  and here the [docs]( and here the [docs](https://docs.gelato.network/developer-services/relay/erc-2771-recommended/callwithsyncfeeerc2771#getsignaturedataerc2771) 
) 



## Tracking your Relay Request

### WebSocket Subscription

Docs can be found [here](https://docs.gelato.network/developer-services/relay/tracking-your-relay-request#websocket-subscriptions)

[Relay-sdk Implementation](src/components/App/index.tsx#L121) 
```typescript
    relay.onTaskStatusUpdate((taskStatus: TransactionStatusResponse) => {
      console.log("Task status update", taskStatus);
      fetchStatusSocket(taskStatus, setMessage, setLoading);
    });
```

[Websocket API](src/components/App/index.tsx#L161)
```typescript
 const relayStatusWs = new WebSocket(
      "wss://api.gelato.digital/tasks/ws/status"
    );
      relayStatusWs.onopen = (event) => {
        relayStatusWs.send(
          JSON.stringify({
            action: "subscribe" as string,
            taskId: response.taskId,
          })
        );
        relayStatusWs.onmessage = (event) => {
          fetchStatusSocket(JSON.parse(event.data).payload, setMessage, setLoading);
        };
      }
```

### Polling for Updates
Docs can be found [here](https://docs.gelato.network/developer-services/relay/tracking-your-relay-request#polling-for-updates)

[code](src/components/App/task.ts#L27)

```typescript
let status = await relay.getTaskStatus(taskIdToQuery);`
```

### Status
Docs can be found [here](https://docs.gelato.network/developer-services/relay/tracking-your-relay-request#task-status-response)
```typescript
 let details = {
        txHash: status?.transactionHash || undefined,
        chainId: status?.chainId?.toString() || undefined,
        blockNumber: status?.blockNumber?.toString() || undefined,
        executionDate: status?.executionDate || undefined,
        creationnDate: status?.creationDate || undefined,
        taskState: (status?.taskState as TaskState) || undefined,
      };
      let body = ``;
      let header = ``;

      let txHash = details.txHash;

      switch (details.taskState!) {
        case TaskState.WaitingForConfirmation:
          header = `Transaction Relayed`;
          body = `Waiting for Confirmation`;
          break;
        case TaskState.Pending:
          header = `Transaction Relayed`;
          body = `Pending Status`;

          break;
        case TaskState.CheckPending:
          header = `Transaction Relayed`;
          body = `Simulating Transaction`;

          break;
        case TaskState.ExecPending:
          header = `Transaction Relayed`;
          body = `Pending Execution`;
          break;
        case TaskState.ExecSuccess:
          header = `Transaction Executed`;
          body = `Waiting to refresh...`;

          destroyFetchTask.next();
          setTimeout(() => {
            console.log("finish");
            setLoading(false);
          }, 2000);

          break;
        case TaskState.Cancelled:
          header = `Canceled`;
          body = `TxHash: ${details.txHash}`;
          destroyFetchTask.next();
          break;
        case TaskState.ExecReverted:
          header = `Reverted`;
          body = `TxHash: ${details.txHash}`;
          destroyFetchTask.next();
          break;
        case TaskState.NotFound:
          header = `Not Found`;
          body = `TxHash: ${details.txHash}`;
          destroyFetchTask.next();
          break;
        case TaskState.Blacklisted:
          header = `BlackListed`;
          body = `TxHash: ${details.txHash}`;
          destroyFetchTask.next();
          break;
        default:
          break;
      }
```

Verified
CounterFeeCollector
https://arb-blueberry.gelatoscout.com/address/0xFb49001366fC0b23B4892909426bd3796958b6D4#code

CounterFeeCollectorERC2771 on Etherscan.
https://arb-blueberry.gelatoscout.com/address/0xBa533674443E017828249eE78a5eCc4b71faC579#code

CounterRelayContext on Etherscan.
https://arb-blueberry.gelatoscout.com/address/0x0c3E7A7B6D1e0f26e87CE3BFA19616c8062Db3bB#code

CounterRelayContextERC2771 on Etherscan.
https://arb-blueberry.gelatoscout.com/address/0x05E1D00A790a2dBDD4757270ddec5198313d4759#code

OneBalanceCounterERC2771
https://arb-blueberry.gelatoscout.com/address/0x5041c60C75633F29DEb2AED79cB0A9ed79202415

OneBalanceSimpleCounter on Etherscan.
https://arb-blueberry.gelatoscout.com/address/0x04914ED9098f5447753cde4bbbBB0e07879f9689#code
