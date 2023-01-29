import { Component, OnInit } from '@angular/core';
import { configure, getMethods } from '@radixdlt/connect-button';

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

  connectButton!: ReturnType<typeof configure>;

  ngOnInit(): void {

    // create the connect button
    this.connectButton = configure({
      dAppId: 'dashboard',
      networkId: 34,
      logLevel: 'DEBUG',
      onConnect: ({ setState, getWalletData }) => {
        getWalletData({
          oneTimeAccountsWithoutProofOfOwnership: {},
        }).map(({ oneTimeAccounts }) => {
          setState({ connected: true });
          return oneTimeAccounts[0].address;
        }).andThen(sendTx)
      },
      onDisconnect: ({ setState }) => {
        setState({ connected: false });
      },
      onCancel() {
        console.log('Cancel Clicked');
      },
      onDestroy() {
        console.log('Button Destroyed');
      },
    });

    const sendTx = (address: string) =>
      getMethods().sendTransaction({
        version: 1,
        transactionManifest: `
          CREATE_RESOURCE Enum("Fungible", 18u8) Map<String, String>("description", "Dedo test token", "name", "Dedo", "symbol", "DEDO") Map<Enum, Tuple>() Some(Enum("Fungible", Decimal("15000")));
          CALL_METHOD ComponentAddress("${address}") "deposit_batch" Expression("ENTIRE_WORKTOP");`,
      });

  }

}
