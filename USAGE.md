## Deploying Components and Starting Application

It should connect and check for your iNatty NFTs on the wallet, 
and only load ones you don't have yet.

## Deploy application

1. `npm run build`
2. `pulumi up`

------

This example is meant to guide you through building, deploying and using the INatty dApp using the [Betanet Wallet SDK](https://github.com/radixdlt/wallet-sdk#readme).

## Pre-requisites
1. Node.js >= 12.17.0
2. The Betanet wallet & Radix-connector browser extenstion installed. Instructions [here](https://docs-babylon.radixdlt.com/main/getting-started-developers/wallet-and-connector.html)
3. Scrypto v0.7.0. Instructions to install [here](https://docs-babylon.radixdlt.com/main/getting-started-developers/first-component/install-scrypto.html) and update [here](https://docs-babylon.radixdlt.com/main/getting-started-developers/first-component/updating-scrypto.html)

## Building the Scrypto code
1. Enter the scrypto directory in a terminal: `cd scrypto`
2. Build the code: `scrypto build`
3. Two important files (`inatty.abi` and `inatty.wasm`) will be generated in `scrypto/target/wasm32-unknown-unknown/release/`. You will need them for the next step.

## Deploy the package to Betanet
1. Go to the [Betanet Dashboard Website](https://betanet-dashboard.radixdlt.com/)
2. Connect the Wallet Via the Connect Button
3. Choose an account and badge or have one created for you if you don't have one yet using the button below.
4. Upload both `inatty.abi` and `inatty.wasm`
5. Click on "publish package"
6. The wallet should open up and ask you to submit the transaction
7. On the wallet click on "sign transaction"
8. The deployed package address should get displayed. **You will need it for the next step**.

## Interacting with our package
1. In a terminal go back to the root of this project
2. Install the npm dependencies: `npm install`
3. Start the local server with `npm start`
4. Open up your browser at the provided url if it doesn't open automatically.
5. Make sure you created an account on the wallet and added funds via the faucet by clicking on account name and then the three dots a button to get XRD from faucet should open.
6. Click on the button to fetch your wallet address. You should see your address appearing
7. Fill the package address you got in the previous section and enter a symbol name for your gumball to display in the wallet then click on "instantiate ..."
8. Your wallet will again open up. Click on "sign transaction". You should now see the instantiated component address and INatty NFT resource address on the page.
9. ... follow instructions on page