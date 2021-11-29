import { Component } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
export interface Guest {
  firstName : string,
  lastName : string,
  partyId : number,
  extraGuest: number,	
  kidsMeal: boolean,
  vegan: boolean,
  glutonFree: boolean,
  willAttend: boolean,
  email: string,
  message: string,
  responseTime: string
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

  _URL = "https://script.google.com/macros/s/AKfycbwGeYrv2TJ_WBfwip8-FAix1HDZkEAUaPyIQALFEnGu7cTDG_8idCZmPyasoHoQqsB3/exec"

  _state = RSVPState.RSVPinitiated;

  _guestsFromSheets?: any;

  _guests?: Guest[];

  _isLoading:boolean = false;

  guestsFormGroups: FormGroup[];
  guestFG: FormGroup;
  nameFormControl = new FormControl('');
  emailFormControl = new FormControl('');
  messageFormControl = new FormControl('');
  lastNameFormControl = new FormControl('');
  _SHEETID = '1D8BHWpdjsce4buteqRaNyaRaz1WNG59Y7yKSWm4FiOE';

  objectKeys = Object.keys;
  constructor(public fb: FormBuilder) {
    this.guestFG = this.fb.group({});
    this.guestsFormGroups = [];
  }

  // getGuideline() {
  //   this.guidelines = this.data.tabObj[0];
  //   console.log(this.guidelines);
  //   this.form = this.createGroup();
  // }

  createGroup() {
    const group = this.fb.group({});
    this._guests!.forEach(guest => {
      const guestFb = this.fb.group({
        email: new FormControl(''),
        message: new FormControl(''),
      })
      this.guestsFormGroups.push(guestFb);
      });
    return group;
  }

  submitForm(){
    this.formGroupsToGuests();
    console.log("clicked", this._guests);
  }

  private formGroupsToGuests() {
    for (let i = 0; i < this._guests!.length; i++) {
      this._guests![i].email = this.guestsFormGroups[i].controls['email'].value;
      this._guests![i].message = this.guestsFormGroups[i].controls['message'].value;
    }
  }

  get isValid() {
    return !this.guestFG.valid;
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


  getEmailFormControl(i: number):FormControl {
    return this.guestsFormGroups[i].get('email') as FormControl;
  }

  getMessageFormControl(i: number):FormControl {
    return this.guestsFormGroups[i].get('message') as FormControl;
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
      const partyId = this.objectKeys(this._guestsFromSheets)[0];
      this._guests = this._guestsFromSheets[partyId];
      this.createGroup();
      this._state = RSVPState.guestsRSVPinitiated;
    }
  }
}

selectParty(groupId: string) {
  if (this._state == RSVPState.lastNameDuplicated) {
    this._guests = this._guestsFromSheets![groupId];
    this.createGroup();
    this._state = RSVPState.guestsRSVPinitiated;
  }
}


guestWillAttendHandler(guest:Guest) {
  guest.willAttend=true;
}

guestWillNotAttendHandler(guest:Guest) {
  guest.willAttend=false;
}

guestKidsMealToggle(guest:Guest) {
  guest.kidsMeal = !guest.kidsMeal;
}

guestVeganToggle(guest:Guest) {
  guest.vegan = !guest.vegan;
}

guestGlutonFreeToggle(guest:Guest) {
  guest.glutonFree = !guest.glutonFree;
}

isGuestAttending(guest:Guest) {
  return guest.willAttend==true;
}

isGuestNotAttending(guest:Guest) {
  return guest.willAttend===false;
}
}
