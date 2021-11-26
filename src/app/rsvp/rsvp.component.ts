import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { HttpClient} from '@angular/common/http';
import client_keys from "./../../assets/google-api-credentials.json";

@Component({
  selector: 'app-rsvp',
  templateUrl: './rsvp.component.html',
  styleUrls: ['./rsvp.component.css', '../app.component.css']
})
export class RsvpComponent  {

   // Client ID and API key from the Developer Console
_CLIENT_ID = client_keys.client_id;
_API_KEY = client_keys.private_key;

 // Array of API discovery doc URLs for APIs used by the quickstart
_DISCOVERY_DOCS = ["https://sheets.googleapis.com/$discovery/rest?version=v4"];

 // Authorization scopes required by the API; multiple scopes can be
 // included, separated by spaces.
_SCOPES = "https://www.googleapis.com/auth/spreadsheets.readonly";

  options: FormGroup;
  nameFormControl = new FormControl('');
  emailFormControl = new FormControl('');
  guestFormControl = new FormControl(0);
  messageFormControl = new FormControl('');
  // googleSheet = new GoogleSpreadsheet('1D8BHWpdjsce4buteqRaNyaRaz1WNG59Y7yKSWm4FiOE')

  constructor(fb: FormBuilder) {
    
    this.options = fb.group({
      name: this.nameFormControl,
      email: this.emailFormControl,
      guestNumber: this.guestFormControl,
      message: this.messageFormControl,
    });
    gapi.load('client', this.initGoogleApiClient)
  }

  submitForm(){
    const value= this.options.value;
    const isValid = this.options.valid;
    console.log("clicked", isValid, value);
  }

  get isValid() {
    return !this.options.valid;
  }

  getErrorMessage() {
    if (this.emailFormControl.hasError('required')) {
      return 'You must enter a value';
      // search by last name, auto populate their first names,
      // drop down on the number of attandees, populate input box 
      // special requests:  kids meal, vegan, gluton quantity
    }
    return this.emailFormControl.hasError('email') ? 'Not a valid email' : '';
  }
 
initGoogleApiClient() {
    gapi.client.init({     
      apiKey: this._API_KEY,
      clientId: this._CLIENT_ID,
      discoveryDocs: this._DISCOVERY_DOCS,
      scope: this._SCOPES
    })
  }

  getAllLastNames() {
    // gapi.client.HttpRequest(''
  }
}
