import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import client_keys from "./../../assets/google-api-credentials.json";
export interface Guest {
  firstName : string,
  lastName : string,
  partyId : number,
  extraGuest: number,	
  kidsMeal: boolean,
  vegan: boolean,
  willAttend: boolean
}

export enum RSVPState {
  RSVPinitiated,      //
  lastNameVerified,   // 
  lastNameNotVerified,//
  lastNameDuplicated, //  
  guestsRSVPinitiated,
  guestsRSVPCompleted
}

@Component({
  selector: 'app-rsvp',
  templateUrl: './rsvp.component.html',
  styleUrls: ['./rsvp.component.css', '../app.component.css']
})
export class RsvpComponent  {

   // Client ID and API key from the Developer Console
_CLIENT_ID = client_keys.client_id;
_API_KEY = client_keys.private_key_id;
_URL = "https://script.google.com/macros/s/AKfycbwGeYrv2TJ_WBfwip8-FAix1HDZkEAUaPyIQALFEnGu7cTDG_8idCZmPyasoHoQqsB3/exec"

 // Array of API discovery doc URLs for APIs used by the quickstart
_DISCOVERY_DOCS = ["https://sheets.googleapis.com/$discovery/rest?version=v4"];

 // Authorization scopes required by the API; multiple scopes can be
 // included, separated by spaces.
_SCOPES = "https://www.googleapis.com/auth/spreadsheets.readonly";

_state = RSVPState.RSVPinitiated;

_guestsFromSheets?: any;

_guests?: Guest[];

_isLoading:boolean = false;

  options: FormGroup;
  nameFormControl = new FormControl('');
  emailFormControl = new FormControl('');
  guestFormControl = new FormControl(0);
  messageFormControl = new FormControl('');
  lastNameFormControl = new FormControl('');
  _SHEETID = '1D8BHWpdjsce4buteqRaNyaRaz1WNG59Y7yKSWm4FiOE';

  objectKeys = Object.keys;
  constructor(fb: FormBuilder) {
    console.log('client keys', client_keys)
    console.log('client api', this._API_KEY)
    this.options = fb.group({
      name: this.nameFormControl,
      email: this.emailFormControl,
      guestNumber: this.guestFormControl,
      message: this.messageFormControl,
    });
  }

  submitForm(){
    const value= this.options.value;
    const isValid = this.options.valid;
    console.log("clicked", isValid, value);
  }

  get isValid() {
    return !this.options.valid;
  }

  get isLastNameValid() {
    return !this.lastNameFormControl.valid;
  }

  get isRSVPinitiated() {
    return this._state == RSVPState.RSVPinitiated;
  }
  
  get isLastNameVerified() {
    return this._state == RSVPState.lastNameVerified;
  }

  get isLastNameNotVerified() {
    return this._state == RSVPState.lastNameNotVerified;
  }

  get isGuestsRSVPinitiated() {
    return this._state == RSVPState.guestsRSVPinitiated;
  }
 
  get isGuestsRSVPCompleted() {
    return this._state == RSVPState.guestsRSVPCompleted;
  }

  get isLastNameDuplicated() {
    return this._state == RSVPState.lastNameDuplicated;
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

  async submitLastName() {
  this._guestsFromSheets = await this.getGuestsFromSheet();
  this.checkIfDuplicateGuests();
}
private async getGuestsFromSheet(): Promise<any> {
  const value = this.lastNameFormControl.value;
  const url = new URL(this._URL);
  url.searchParams.append('lastName', value);
  this._isLoading=true;
  return await fetch(url.href, {
    method: 'GET'
  })
    .then((res) => {
      return res.text();
    })
    .then((res) => {
      if (res == 'false') {
        this._state = RSVPState.lastNameNotVerified;
        this._isLoading = false;
        return Promise.reject();
      }
      else {
        this._state = RSVPState.lastNameVerified;
        console.log(res);
        this._isLoading = false;
        return JSON.parse(res);
      }
    });
}

private checkIfDuplicateGuests() {
  console.log("check if duplicated guests", this._guests)
  if (this._state == RSVPState.lastNameVerified) {
    if (Object.keys(this._guestsFromSheets).length > 1) {
      this._state = RSVPState.lastNameDuplicated;
    } else {
      this._state = RSVPState.guestsRSVPinitiated;
      const partyId = this.objectKeys(this._guestsFromSheets)[0];
      this._guests = this._guestsFromSheets[partyId];
    }
  }
}

selectParty(groupId: string) {
  if (this._state == RSVPState.lastNameDuplicated) {
    this._guests = this._guestsFromSheets![groupId];
    this._state = RSVPState.guestsRSVPinitiated;
  }
}


guestWillAttendHandler(guest:Guest) {
  guest.willAttend=true;
}

guestWillNotAttendHandler(guest:Guest) {
  guest.willAttend=false;
}

isGuestAttending(guest:Guest) {
  return guest.willAttend==true;
}

isGuestNotAttending(guest:Guest) {
  return guest.willAttend===false;
}
}
