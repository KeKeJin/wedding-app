import { ChangeDetectorRef, Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { truncate } from 'fs';
export interface Guest {
  guestName: string,
  guestId: number,
  partyId : number,
  lastName : string,
  firstName : string,
  extraGuest: number,	
  kidsMeal: boolean,
  vegan: boolean,
  glutonFree: boolean,
  willAttend: boolean,
  email: string,
  message: string,
  responseTime: string,
  guestsGuest: boolean
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

  _extraGuests: Guest[] = [];

  _guestsGuestCount: number = 0;

  _isLoading:boolean = false;

  _extraGuestCount: number = 0;

  _extraGuestAdded: number = 0;

  guestsFormGroups: FormGroup[];

  extraGuestsFormGroups: FormGroup[] = [];

  guestFG: FormGroup;
  nameFormControl = new FormControl('');
  emailFormControl = new FormControl('');
  messageFormControl = new FormControl('');
  lastNameFormControl = new FormControl('');
  _SHEETID = '1D8BHWpdjsce4buteqRaNyaRaz1WNG59Y7yKSWm4FiOE';

  objectKeys = Object.keys;
  constructor(public fb: FormBuilder, public cdr: ChangeDetectorRef) {
    this.guestFG = this.fb.group({});
    this.guestsFormGroups = [];
  }

  calculateExtraGuestCount() {
    return this._guests!.forEach(guest => {
      this._extraGuestCount += guest.extraGuest;
    })
  }

  createGroup() {
    const group = this.fb.group({});
    this._guests!.forEach((guest, i)=> {
      if (!guest.guestsGuest) {
        const guestFb = this.createFormGroup(guest);
        this.guestsFormGroups.push(guestFb);
      } else {
        const guestFb = this.createGuestsGuestFormGroup(guest);
        this.extraGuestsFormGroups.push(guestFb);
        const guestsGuest = this._guests?.splice(i, 1) as Guest[];
        this._extraGuests.push(guestsGuest[0]);
      }
      });
    this.calculateExtraGuestCount();
    for (let i = 0; i < this._extraGuestCount; ++i) {
      const guestFb = this.createExtraGuestFormGroup();
      this.extraGuestsFormGroups.push(guestFb);
    }
    console.log(this._guests);
    console.log(this._extraGuests);
    return group;
  }

  createFormGroup(guest: Guest) {
    return this.fb.group({
      email: new FormControl(guest.email),
      message: new FormControl(guest.message),
    })
  }

  createExtraGuestFormGroup() {
    return this.fb.group({
      lastName: new FormControl(''),
      firstName: new FormControl(''),
      email: new FormControl(''),
      message: new FormControl(''),
    })
  }

  createGuestsGuestFormGroup(guest: Guest) {
    return this.fb.group({
      lastName: new FormControl(guest.lastName),
      firstName: new FormControl(guest.firstName),
      email: new FormControl(guest.email),
      message: new FormControl(guest.message),
    })
  }

  async submitForm(){
    this.formGroupsToGuests();
    console.log("clicked", this._guests);
    const url = new URL(this._URL);
    url.searchParams.append('rsvpResult', JSON.stringify(this._guests));
    this._isLoading=true;
    console.log(JSON.stringify(this._guests))
    return await fetch(url.href, {
      method: 'POST'
    })
    .then((res) => {
      return res.text();
    })
    .then((res) => {
      if (res == 'false') {
        this._state = RSVPState.guestsRSVPinitiated; //TODO: error handling
        this._isLoading = false;
        return Promise.reject();
      }
      else {
        this._state = RSVPState.guestsRSVPCompleted;
        console.log(res);
        this._isLoading = false;
        return res;
      }
    });
  }



  private formGroupsToGuests() {
    let i;
    for (i = 0; i < this._guests!.length; i++) {
      this._guests![i].email = this.guestsFormGroups[i].controls['email'].value;
      this._guests![i].message = this.guestsFormGroups[i].controls['message'].value;
      this._guests![i].responseTime = new Date().toString();
      this._guests![i].extraGuest = 0;
    }
    this._guests![0].extraGuest = this._extraGuestCount;
    for (let i = 0; i < this._extraGuests!.length; i++) {
      const firstName = this.extraGuestsFormGroups[i].controls['firstName'].value;
      const lastName = this.extraGuestsFormGroups[i].controls['lastName'].value;
      this._extraGuests![i].firstName = firstName;
      this._extraGuests![i].lastName = lastName;
      this._extraGuests![i].guestName = lastName + ', ' + firstName;
      this._extraGuests![i].email = this.extraGuestsFormGroups[i].controls['email'].value;
      this._extraGuests![i].message = this.extraGuestsFormGroups[i].controls['message'].value;
      this._extraGuests![i].responseTime = new Date().toString();
    }
    this._guests = this._guests?.concat(this._extraGuests);
  }

  addGuest() {
    console.log("adding guest")
    this._extraGuestCount--;
    this._extraGuestAdded++;
    this._extraGuests?.push(
      {
        guestName: '',
        guestId: 0,
        partyId : this._guests![0].partyId,
        lastName : '',
        firstName : '',
        extraGuest: 0,	
        kidsMeal: false,
        vegan: false,
        glutonFree: false,
        willAttend: true,
        email: '',
        message: '',
        responseTime: new Date().toString(),
        guestsGuest: true
      }
    )
    this.cdr.detectChanges();
  }

  removeGuest(i:number) {
    this._extraGuestCount++;
    this._extraGuestAdded--;
    this._extraGuests?.splice(i,1)
    this.cdr.detectChanges();
    console.log(this._extraGuestCount, this._extraGuestAdded)
  }

  get allowExtraGuest() {
    if (this._extraGuestCount == 0) {
      return false;
    }
    return true;
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

  getExtraGuestFirstNameFormControl(i: number):FormControl {
    return this.extraGuestsFormGroups[i].get('firstName') as FormControl;
  }

  getExtraGuestLastNameFormControl(i: number):FormControl {
    return this.extraGuestsFormGroups[i].get('lastName') as FormControl;
  }

  getExtraGuestMessageFormControl(i: number):FormControl {
    return this.extraGuestsFormGroups[i].get('message') as FormControl;
  }

  getExtraGuestEmailFormControl(i: number):FormControl {
    return this.extraGuestsFormGroups[i].get('email') as FormControl;
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
