import { Component, OnInit } from '@angular/core';

// create a type for the appData object
type AppData = {
  verified_user: boolean,
  observations: any[],
  observationsParsed: any[]
}
// create an object to store the app data
const appData: AppData = {
  verified_user: false,
  observations: [],
  observationsParsed: []
}

@Component({
  selector: 'app-root',
  templateUrl: './mint.component.html',
  styleUrls: ['./mint.component.css']
})

export class MintComponent implements OnInit {
  title = 'angular-starter';
  appData = appData;

  selectedObservations: any[] = [];

  ngOnInit(): void {

  }

  // Function that calls into iNaturalist to get the user's observations
  getUserObservations = async function () {

    // TODO: this needs to check the iNatty component for the map from the 
    // Radix account address to the iNaturalist user name
    
    // go to inaturalist API and get the user's info
    // let inaturalistUser = document.getElementById("inaturalistUser") as HTMLInputElement;
    // // get the value of the input field
    // let userString = inaturalistUser.value;
    
    // TEST
    let userString = 'chiggimps_c9xcki8y'
    
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

    }
  }

  onSelectionChange(observation: any) {
    if (observation.selected) {
      this.selectedObservations.push(observation);
      console.log("selectedObservations: ", this.selectedObservations)
    } else {
      this.selectedObservations = this.selectedObservations.filter(
        (selectedObservation) => selectedObservation !== observation
      );
    }
  }

}
