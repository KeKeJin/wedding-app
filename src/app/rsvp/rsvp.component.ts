import { animate, state, style, transition, trigger } from '@angular/animations';
import { ChangeDetectorRef, Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';

export interface Guest {
  guestName: string,
  guestId: number,
  partyId: number,
  lastName: string,
  firstName: string,
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
  "RSVPInitial" = "RSVPInitial",        // -> RSVPinitiated
  "RSVPinitiated" = "RSVPinitiated",      // -> lastNameNotVerified, lastNameDuplicated, guestsRSVPinitiated
  "lastNameNotVerified" = "lastNameNotVerified",// -> lastNameNotVerified, lastNameDuplicated, guestsRSVPinitiated
  "lastNameDuplicated" = "lastNameDuplicated", // -> guestsRSVPinitiated
  "guestsRSVPinitiated" = "guestsRSVPinitiated", // -> guestsRSVPCompleted
  "guestsRSVPCompleted" =  "guestsRSVPCompleted"
}

const RSVPStateMachine= new Map([
  ["RSVPInitial", {
    previous: [],
    next: [
      RSVPState.RSVPinitiated, 
      RSVPState.lastNameNotVerified, 
      RSVPState.lastNameDuplicated,
      RSVPState.guestsRSVPinitiated,
      RSVPState.guestsRSVPCompleted
    ]
  }],
  ["RSVPinitiated", {
    previous: [RSVPState.RSVPInitial],
    next: [
      RSVPState.guestsRSVPinitiated, 
      RSVPState.lastNameNotVerified,  
      RSVPState.lastNameDuplicated,
      RSVPState.guestsRSVPCompleted
    ]
  }],
  ["lastNameNotVerified", {
    previous: [
      RSVPState.RSVPinitiated, 
      RSVPState.RSVPInitial],
    next: [
      RSVPState.guestsRSVPinitiated, 
      RSVPState.guestsRSVPCompleted, 
      RSVPState.lastNameDuplicated]
  }],
  ["lastNameDuplicated", {
    previous: [
      RSVPState.RSVPinitiated, 
      RSVPState.lastNameNotVerified, 
      RSVPState.RSVPInitial],
    next: [
      RSVPState.guestsRSVPinitiated, 
      RSVPState.guestsRSVPCompleted],
  }],
  ["guestsRSVPinitiated", {
    previous: [
      RSVPState.RSVPinitiated, 
      RSVPState.lastNameDuplicated, 
      RSVPState.lastNameNotVerified, 
      RSVPState.RSVPInitial],
    next: [RSVPState.guestsRSVPCompleted]
  }],
  ["guestsRSVPCompleted", {
    previous: [
      RSVPState.RSVPinitiated, 
      RSVPState.RSVPInitial, 
      RSVPState.guestsRSVPinitiated,
      RSVPState.lastNameDuplicated,
      RSVPState.lastNameNotVerified
    ],
    next: []
  }]
])

@Component({
  selector: 'app-rsvp',
  templateUrl: './rsvp.component.html',
  styleUrls: ['./rsvp.component.css', '../app.component.css'],
  animations: [
    trigger('inandout', [
      state(
        'left', 
        style({
          opacity: 0,
          transform: 'translateX(-100vw)'
        })
      ),
      state('right', style({
        opacity: 0,
        transform: 'translateX(100vw)'
      })),
      state('middle', style({
        opacity: 1,
      })),
      transition('*=>*', animate('1000ms ease-out')),
      transition('void=>*', animate('1000ms ease-out')),
      transition('*=>void', animate('1000ms ease-out')),
    ]),
  ]
})
export class RsvpComponent {

  rsvpState = RSVPState;

  _URL = "https://script.google.com/macros/s/AKfycbwGeYrv2TJ_WBfwip8-FAix1HDZkEAUaPyIQALFEnGu7cTDG_8idCZmPyasoHoQqsB3/exec"

  _state = RSVPState.RSVPInitial;

  _state_to_change_to = RSVPState.RSVPInitial;

  _guestLastNameNotFound = '';

  _guestsFromSheets?: any;

  _guests?: Guest[];

  _extraGuests: Guest[] = [];

  _guestsGuestCount: number = 0;

  _isLoading: boolean = false;

  _extraGuestCount: number = 0;

  _extraGuestAdded: number = 0;

  guestsFormGroups: FormGroup[];

  extraGuestsFormGroups: FormGroup[] = [];

  guestFG: FormGroup;

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
    this._guests!.forEach((guest, i) => {
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

  async submitForm() {
    this.formGroupsToGuests();
    console.log("clicked", this._guests);
    const url = new URL(this._URL);
    url.searchParams.append('rsvpResult', JSON.stringify(this._guests));
    this._isLoading = true;
    const respond = await fetch(url.href, {
      method: 'POST'
    })
    const respondTest = await respond.text();
    if (respondTest == 'false') {
      this._isLoading = false;
      return Promise.reject();
    }
    else {
      this.goto(RSVPState.guestsRSVPCompleted);
      console.log(respondTest);
      this._isLoading = false;
      return respondTest;
    }
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
    this._extraGuestCount--;
    this._extraGuestAdded++;
    this._extraGuests?.push(
      {
        guestName: '',
        guestId: 0,
        partyId: this._guests![0].partyId,
        lastName: '',
        firstName: '',
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

  removeGuest(i: number) {
    this._extraGuestCount++;
    this._extraGuestAdded--;
    this._extraGuests?.splice(i, 1)
    this.cdr.detectChanges();
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



  getEmailFormControl(i: number): FormControl {
    return this.guestsFormGroups[i].get('email') as FormControl;
  }

  getMessageFormControl(i: number): FormControl {
    return this.guestsFormGroups[i].get('message') as FormControl;
  }

  getExtraGuestFirstNameFormControl(i: number): FormControl {
    return this.extraGuestsFormGroups[i].get('firstName') as FormControl;
  }

  getExtraGuestLastNameFormControl(i: number): FormControl {
    return this.extraGuestsFormGroups[i].get('lastName') as FormControl;
  }

  getExtraGuestMessageFormControl(i: number): FormControl {
    return this.extraGuestsFormGroups[i].get('message') as FormControl;
  }

  getExtraGuestEmailFormControl(i: number): FormControl {
    return this.extraGuestsFormGroups[i].get('email') as FormControl;
  }

  getErrorMessage(i: number) {
    if (this.guestsFormGroups[i].controls['email'].hasError('required')) {
      return 'You must enter a value';
      // search by last name, auto populate their first names,
      // drop down on the number of attandees, populate input box 
      // special requests:  kids meal, vegan, gluton quantity
    }
    return this.guestsFormGroups[i].controls['email'].hasError('email') ? 'Not a valid email' : '';
  }

  async submitLastName() {
    await this.getGuestsFromSheet();
  }
  private async getGuestsFromSheet(): Promise<any> {
    const lastname = this.lastNameFormControl.value;
    const url = new URL(this._URL);
    url.searchParams.append('lastName', lastname);
    this._isLoading = true;
    const respond = await fetch(url.href, {
      method: 'GET'
    })
    const respondTest = await respond.text();
    if (respondTest == 'false') {
      this.goto(RSVPState.lastNameNotVerified);
      this._guestLastNameNotFound = lastname;
      this._isLoading = false;
      return Promise.reject();
    }
    else {
      console.log(respondTest);
      this._isLoading = false;
      this._guestsFromSheets = await JSON.parse(respondTest);
      this.checkIfDuplicateGuests();
    }
  }

  private checkIfDuplicateGuests() {
      if (Object.keys(this._guestsFromSheets).length > 1) {
        this.goto(RSVPState.lastNameDuplicated);
      } else {
        const partyId = this.objectKeys(this._guestsFromSheets)[0];
        this._guests = this._guestsFromSheets[partyId];
        this.createGroup();
        this.goto(RSVPState.guestsRSVPinitiated);
    }
  }

  selectParty(groupId: string) {
    if (this._state == RSVPState.lastNameDuplicated) {
      this._guests = this._guestsFromSheets![groupId];
      this.createGroup();
      this.goto(RSVPState.guestsRSVPinitiated);
    }
  }


  guestWillAttendHandler(guest: Guest) {
    guest.willAttend = true;
  }

  guestWillNotAttendHandler(guest: Guest) {
    guest.willAttend = false;
  }

  guestKidsMealToggle(guest: Guest) {
    guest.kidsMeal = !guest.kidsMeal;
  }

  guestVeganToggle(guest: Guest) {
    guest.vegan = !guest.vegan;
  }

  guestGlutonFreeToggle(guest: Guest) {
    guest.glutonFree = !guest.glutonFree;
  }

  isGuestAttending(guest: Guest) {
    return guest.willAttend == true;
  }

  isGuestNotAttending(guest: Guest) {
    return guest.willAttend === false;
  }

  goto(state: RSVPState) {
    this._state = state;
  }


  goBackto(state: RSVPState) {
    this._state = state;
  }

  determineAnimationState(state: RSVPState) {
    if (RSVPStateMachine.get(this._state)?.previous.includes(state)) {
      return 'left';
    }
    else if (RSVPStateMachine.get(this._state)?.next.includes(state)) {
      return 'right';
    }
    else if (this._state == state) {
      return 'middle';
    }
    else {
      return 'left'
    }
  }
}
