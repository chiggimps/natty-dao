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
    let TESTUSER = "chiggimps_stbc3twz"
    // first validate whether the token matches the one generated
    let inaturalistUser = document.getElementById("inaturalistUser") as HTMLInputElement;
    let userString = inaturalistUser.value || TESTUSER;
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
      }
    } else {
      // display error message on frontend
      console.log("No underscore in iNaturalist username");
      window.alert('No underscore in iNaturalist username');
    }
  }

  // Function that calls into the iNaturalist API to verify if the user added the token to their username
  getUserInfo = async function (userString: string) {
    console.log("inaturalistUser: ", userString)
    let userDetails = await fetch(`https://api.inaturalist.org/v1/users/${userString}`)
    // if its not a 200 response, throw an error
    if (!userDetails.ok) {
      window.alert('iNaturalist user does not exist');
      throw new Error("iNaturalist user does not exist");
    } else {
      // get the JSON response
      let userDetailsJSON = await userDetails.json();
      console.log("iNaturalist User Details JSON: ", userDetailsJSON);
      appData.verified_user = true;
      // call the function to get the user's observations
      await this.getUserObservations();
    }
  }

  // Function that calls into iNaturalist to get the user's observations
  getUserObservations = async function () {
    // go to inaturalist API and get the user's info
    let inaturalistUser = document.getElementById("inaturalistUser") as HTMLInputElement;
    // get the value of the input field
    let userString = inaturalistUser.value;
    console.log("inaturalistUser: ", userString)
    let userObservations = await fetch(`https://api.inaturalist.org/v1/observations?user_id=${userString}`)
    // if its not a 200 response, throw an error
    if (!userObservations.ok) {
      window.alert('iNaturalist user does not exist');
      throw new Error("iNaturalist user does not exist");
    } else {
      // get the JSON response
      let userObservationsJSON = await userObservations.json();
      console.log("iNaturalist User Observations JSON: ", userObservationsJSON);
      // parse each observation and save in appData.observations
      for (let i = 0; i < userObservationsJSON.results.length; i++) {
        let observation = userObservationsJSON.results[i];
        appData.observations.push(observation);
      }
      console.log("appData.observations: ", appData.observations);
      // each has an observation_photos array, which has a photo object
      // get the photo.url field and display it in a <img> tag on the frontend in the <div id="userObservations"></div> tag
      // let userObservationsHTML = "";
      for (let i = 0; i < appData.observations.length; i++) {
        let observation = appData.observations[i];
        if (observation.photos.length == 0) {
          continue;
        }
        let photoURL = observation.photos[0].url;
        
        // get the high quality photo
        photoURL = photoURL.replace("square", "large");

        appData.observationsParsed.push({
          photoURL: photoURL || "https://via.placeholder.com/150",
          species_guess: observation.species_guess || "Unknown Species",
          description: observation.description || "No description",
          observed_on: observation.observed_on || "Unknown Date"
        })
      }
      console.log("appData.observationsParsed: ", appData.observationsParsed);

      //   // make them cards with horizontal spacing
      //   // HACK: this is not the way to do it, i need to bind the data to the HTML template and work from there
      //   userObservationsHTML += `<div class="card">`;
      //   userObservationsHTML += `<img src="${photoURL}" class="card-img-top" alt="...">`;
      //   userObservationsHTML += `<div class="card-body">`;
      //   userObservationsHTML += `<h5 class="card-title">${observation.species_guess}</h5>`;
      //   userObservationsHTML += `<p class="card-text">${observation.description}</p>`;
      //   userObservationsHTML += `<p class="card-text"><small class="text-muted">${observation.observed_on}</small></p>`;
      //   userObservationsHTML += `</div>`;
      //   userObservationsHTML += `</div>`;
      // }
      
      // userObservationsHTML = `<div class="row row-cols-1 row-cols-md-3 g-4">${userObservationsHTML}</div>`;

      // console.log("userObservationsHTML: ", userObservationsHTML)
      
      // let userObservationsElement = document.getElementById("userObservations") as HTMLDivElement;
      // userObservationsElement.innerHTML = userObservationsHTML;
    }
  }

}
