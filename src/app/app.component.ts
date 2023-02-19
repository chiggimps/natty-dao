import { Component, OnInit } from '@angular/core';
import {
  RadixDappToolkit,
  ManifestBuilder,
  Decimal,
  Bucket,
  Expression,
  ResourceAddress
} from '@radixdlt/radix-dapp-toolkit'
// See: https://github.com/radixdlt/scrypto-examples/tree/main/full-stack/dapp-toolkit-gumball-machine

// create a type for the appData object
type AppData = {
  randomToken: string
  verified_user: boolean,
  observations: any[],
  observationsParsed: any[]
}
// create an object to store the app data
const appData: AppData = {
  randomToken: "",
  verified_user: false,
  observations: [],
  observationsParsed: []
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit {
  title = 'angular-starter';
  appData = appData;

  ngOnInit(): void {

    const rdt = RadixDappToolkit(
      {
        dAppDefinitionAddress: 'account_tdx_b_1ppf80pmrpc6yh6gwyrudhct7h883uzvwp5704jrgep8qgrj6we',
        dAppName: 'Test Dapp',
      },
      (requestData) => {
        requestData({
          accounts: { quantifier: 'atLeast', quantity: 1 },
        }).map(({ data: { accounts } }) => {
          // set your application state
        })
      },
      {
        networkId: 11,
        onDisconnect: () => {
          // clear your application state
        },
        onInit: ({ accounts }) => {
          // set your initial application state
        },
      }
    )

  }

}
