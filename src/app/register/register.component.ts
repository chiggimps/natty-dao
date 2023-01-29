import { Component, OnInit } from '@angular/core';
import { configure, getMethods } from '@radixdlt/connect-button';

// create a type for the appData object
type AppData = {
  randomToken: string,
}
// create an object to store the app data
const appData: AppData = {
  randomToken: "",
}

@Component({
  selector: 'app-root',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})

export class RegisterComponent implements OnInit {
  title = 'angular-starter';
  appData = appData;

  connectButton!: ReturnType<typeof configure>;

  ngOnInit(): void {

    // generate a random token of numbers and letters of length 8
    var randomToken = '_' + Math.random().toString(36).substr(2, 8);
    // put randomToken on to <input type="text" id="randomToken" value="">
    let randomTokenElement = document.getElementById("randomToken") as HTMLInputElement;
    randomTokenElement.value = randomToken;
    appData.randomToken = randomToken;

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

  onUserSubmit = async function () {
    let TEST = true
    // first validate whether the token matches the one generated
    let inaturalistUser = document.getElementById("inaturalistUser") as HTMLInputElement;
    let userString = inaturalistUser.value;
    let userSplit = userString.split("_");
    if (userSplit.length > 1) {
      // token is the last item
      let token = userSplit[userSplit.length - 1];
      console.log("token: ", token)
      // check if the token matches the one generated
      if (token == appData.randomToken || TEST) {
        // if it does, then call the iNaturalist API to get the user's details
        await this.getUserInfo(inaturalistUser.value);
      } else {
        window.alert('Token in username does not match');
        console.log("Token in username does not match")
      }
    } else {
      // display error message on frontend
      window.alert('No underscore in iNaturalist username');
      console.log("No underscore in iNaturalist username");
    }
  }

  // Function that calls into the iNaturalist API to verify if the user added the token to their username
  getUserInfo = async function (userString: string) {
    // go to inaturalist API and get the user's info
    let userDetails = await fetch(`https://api.inaturalist.org/v1/users/${userString}`)
    // if its not a 200 response, throw an error
    if (!userDetails.ok) {
      window.alert('iNaturalist user does not exist');
      throw new Error("iNaturalist user does not exist");
    } else {
      // get the JSON response
      let userDetailsJSON = await userDetails.json();
      console.log("iNaturalist User Details JSON: ", userDetailsJSON);
      // TODO: this needs to write a radix transaction manifest
      // That maps the user's iNaturalist username to their Radix address
      // In the iNatty component that mints nfts.
    }
  }

  buildTx = async function () {
    
  
  }

}
