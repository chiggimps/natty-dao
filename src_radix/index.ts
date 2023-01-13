import WalletSdk, {
  requestBuilder,
  requestItem,
  ManifestBuilder,
  ResourceAddress,
  Bucket,
  Expression,
  Decimal,
} from '@radixdlt/wallet-sdk';

// There are 4 classes exported in the Gateway-SDK, these serve as a thin wrapper around the gateway API
// API docs are available @ https://betanet-gateway.redoc.ly/
import { TransactionApi, StateApi, StatusApi, StreamApi } from "@radixdlt/babylon-gateway-api-sdk";

// Instantiate Wallet SDK
const walletSdk = WalletSdk({ dAppId: 'Gumball', networkId: 0x0b })
console.log("walletSdk: ", walletSdk)

// Instantiate Gateway SDK
const transactionApi = new TransactionApi();
const stateApi = new StateApi();
const statusApi = new StatusApi();
const streamApi = new StreamApi();

// Global states
let accountAddress: string // User account address
let componentAddress: string  // INatty component address
let resourceAddress: string // INattyNFT resource address

// Instantiate component
document.getElementById('instantiateComponent')!.onclick = async function () {
  
  let packageAddress = document.getElementById("packageAddress")!.value;

  let manifest = new ManifestBuilder()
    .callFunction(packageAddress, "INatty", "instantiate_inatty", [Decimal("10")])
    .build()
    .toString();
  
  console.log("Instantiate Manifest: ", manifest)
  // Send manifest to extension for signing
  const result = await walletSdk
    .sendTransaction({
      transactionManifest: manifest,
      version: 1
    })

  if (result.isErr()) throw result.error

  console.log("Intantiate WalletSDK Result: ", result.value)

  // Fetch the transaction status from the Gateway API
  let response = await transactionApi.transactionStatus({
    transactionStatusRequest: {
      intent_hash_hex: result.value.transactionIntentHash
    }
  });

  console.log('Instantiate TransactionApi Response', response)

  // Fetch component address from gateway api and set componentAddress variable 
  let commitReceipt = await transactionApi.transactionCommittedDetails({
    transactionCommittedDetailsRequest: {
      transaction_identifier: {
        type: 'payload_hash',
        value_hex: response.known_payloads[0].payload_hash_hex
      }
    }
  })

  console.log('Instantiate Committed Details Receipt', commitReceipt)

  // componentAddress = commitReceipt.details.receipt.state_updates.new_global_entities[0].global_address <- long way -- shorter way below ->
  componentAddress = commitReceipt.details.referenced_global_entities[0]
  document.getElementById('componentAddress').innerText = componentAddress;

  resourceAddress = commitReceipt.details.referenced_global_entities[1]
  document.getElementById('iNattyNFTaddress').innerText = resourceAddress;
}

////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////

// Generate a random token (of letters and numbers), and display it on id="randomToken"
let randomToken = Math.random().toString(36).substring(2, 5) + Math.random().toString(36).substring(2, 5);
document.getElementById('randomToken')!.innerText = randomToken;

// Fetch list of account Addresses on button click
document.getElementById('fetchAccountAddress')!.onclick = async function () {
  
  // Retrieve extension user account addresses

  // go to inaturalist API and get the user's info
  let inaturalistUser = document.getElementById("inaturalistUser")!.value;
  let userDetails = await fetch(`https://api.inaturalist.org/v1/users/${inaturalistUser}`)
  // if its not a 200 response, throw an error
  if (!userDetails.ok) {
    // display error message on frontend
    document.getElementById('accountAddress')!.innerText = "iNaturalist user does not exist"
    throw new Error("iNaturalist user does not exist")

  } else {
    userDetails = await userDetails.json()
    console.log("iNaturalist User Details: ", userDetails)
    
    const result = await walletSdk.request(
      // the number passed as arg is the max number of addresses you wish to fetch
      requestBuilder(requestItem.oneTimeAccounts.withoutProofOfOwnership(1))
    )
  
    if (result.isErr()) {
      throw result.error
    }
  
    const { oneTimeAccounts } = result.value
    console.log("requestItem.oneTimeAccounts.withoutProofOfOwnership(1) ", result)
    if (!oneTimeAccounts) return
  
    document.getElementById('accountAddress')!.innerText = oneTimeAccounts[0].address
    accountAddress = oneTimeAccounts[0].address
  }
}

document.getElementById('mintNFTs').onclick = async function () {

  let manifest = new ManifestBuilder()
    .withdrawFromAccountByAmount(accountAddress, 10, "resource_tdx_b_1qzkcyv5dwq3r6kawy6pxpvcythx8rh8ntum6ws62p95s9hhz9x")
    .takeFromWorktopByAmount(10, "resource_tdx_b_1qzkcyv5dwq3r6kawy6pxpvcythx8rh8ntum6ws62p95s9hhz9x", "xrd_bucket")
    .callMethod(componentAddress, "buy_gumball", [Bucket("xrd_bucket")])
    .callMethod(accountAddress, "deposit_batch", [Expression("ENTIRE_WORKTOP")])
    .build()
    .toString();

  console.log('buy_gumball manifest: ', manifest)

  // Send manifest to extension for signing
  const result = await walletSdk
    .sendTransaction({
      transactionManifest: manifest,
      version: 1,
    })

  if (result.isErr()) throw result.error

  console.log("Buy Gumball WalletSDK Result: ", result)

  // Fetch the receipt from the Gateway SDK
  let response = await transactionApi.transactionStatus({
    transactionStatusRequest: {
      intent_hash_hex: result.value.transactionIntentHash
    }
  });
  console.log('Buy Gumball TransactionAPI Response', response)

  // fetch component address from gateway api and set componentAddress variable 
  let commitReceipt = await transactionApi.transactionCommittedDetails({
    transactionCommittedDetailsRequest: {
      transaction_identifier: {
        type: 'payload_hash',
        value_hex: response.known_payloads[0].payload_hash_hex
      }
    }
  })
  console.log('Buy Gumball Committed Details Receipt', commitReceipt)

  // Show the receipt on the DOM
  document.getElementById('receipt').innerText = JSON.stringify(commitReceipt.details.receipt, null, 2);
};
