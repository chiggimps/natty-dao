import Sdk, { ManifestBuilder } from '@radixdlt/alphanet-walletextension-sdk';
import { StateApi, TransactionApi } from '@radixdlt/alphanet-gateway-api-v0-sdk'

// Initialize the SDK
const sdk = Sdk()
const transactionApi = new TransactionApi()
const stateApi = new StateApi()

// Read the file ../../relays/src/observed.json
const observed = require('../../relays/src/observed.json')

// Pull all the created NFT ids from the scrypto component

// let componentAddress: string;  // NattyDAO component address

let manifest = new ManifestBuilder()
    .addPermission('mint', {
        componentAddress,
        action: 'mint',
        description: 'Mint NFTs',
        metadata: {
            nftIds: observed.nftIds
        }
    })
    .build()
