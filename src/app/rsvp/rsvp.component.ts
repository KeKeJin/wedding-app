import { animate, state, style, transition, trigger } from '@angular/animations';
import { ChangeDetectorRef, Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

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

export interface OriginalGuest {
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
  email: FormControl,
  message: FormControl,
  responseTime: string,
  guestsGuest: boolean
}

export interface GuestsGuest {
  guestName: string,
  guestId: number,
  partyId: number,
  lastName: FormControl,
  firstName: FormControl,
  extraGuest: number,
  kidsMeal: boolean,
  vegan: boolean,
  glutonFree: boolean,
  willAttend: boolean,
  email: FormControl,
  message: FormControl,
  responseTime: string,
  guestsGuest: boolean
}

export enum RSVPState {
  "RSVPInitial" = "RSVPInitial",        // -> RSVPinitiated
  "RSVPinitiated" = "RSVPinitiated",      // -> lastNameNotVerified, lastNameDuplicated, guestsRSVPinitiated
  "lastNameNotVerified" = "lastNameNotVerified",// -> lastNameNotVerified, lastNameDuplicated, guestsRSVPinitiated
  "lastNameDuplicated" = "lastNameDuplicated", // -> guestsRSVPinitiated
  "guestsRSVPinitiated" = "guestsRSVPinitiated", // -> guestsRSVPCompleted
  "guestsRSVPCompleted" =  "guestsRSVPCompleted",
  "RSVPenterCode" = "RSVPenterCode"
}

const RSVPStateMachine= new Map([
  ["RSVPInitial", {
    previous: [],
    next: [
      RSVPState.RSVPinitiated, 
      RSVPState.lastNameNotVerified, 
      RSVPState.guestsRSVPinitiated,
      RSVPState.guestsRSVPCompleted,
      RSVPState.RSVPenterCode
    ]
  }],
  ["RSVPinitiated", {
    previous: [RSVPState.RSVPInitial],
    next: [
      RSVPState.RSVPenterCode,
      RSVPState.guestsRSVPinitiated, 
      RSVPState.lastNameNotVerified,  
      RSVPState.guestsRSVPCompleted
    ]
  }],
  ["RSVPenterCode", {
    previous: [
      RSVPState.RSVPInitial,
      RSVPState.RSVPinitiated
    ],
    next: [
      RSVPState.guestsRSVPinitiated, 
      RSVPState.lastNameNotVerified,  
      RSVPState.guestsRSVPCompleted
    ]
  }],
  ["lastNameNotVerified", {
    previous: [
      RSVPState.RSVPinitiated, 
      RSVPState.RSVPInitial,
      RSVPState.RSVPenterCode,
    ],
    next: [
      RSVPState.guestsRSVPinitiated, 
      RSVPState.guestsRSVPCompleted
    ]
  }],
  ["guestsRSVPinitiated", {
    previous: [
      RSVPState.RSVPinitiated, 
      RSVPState.RSVPenterCode,
      RSVPState.lastNameDuplicated, 
      RSVPState.lastNameNotVerified, 
      RSVPState.RSVPInitial,
    ],
    next: [
      RSVPState.guestsRSVPCompleted
    ]
  }],
  ["guestsRSVPCompleted", {
    previous: [
      RSVPState.RSVPinitiated, 
      RSVPState.RSVPInitial, 
      RSVPState.guestsRSVPinitiated,
      RSVPState.RSVPenterCode,
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
      state(
        'guest-left', 
        style({
          opacity: 0,
          transform: 'translateX(-200vw)',
        })
      ),
      state('guest-right', style({
        opacity: 0,
      })),
      state('guest-middle', style({
        opacity: 1,
        transform: 'translateX(-100vw)'
      })),
      transition('*=>*', animate('1000ms ease-out')),
      // transition('void=>*', animate('1000ms ease-out')),
      // transition('*=>void', animate('1000ms ease-out')),
    ]),
  ]
})
export class RsvpComponent {

  rsvpState = RSVPState;

  _URL = "https://script.google.com/macros/s/AKfycbxikKnXIFh1LKqCJ-6pN5OmPFa6jsBuUuacSM4QsWljPDpTZIfg-zU_9r39P2Ta4hcF/exec";

  _state = RSVPState.RSVPInitial;

  _guestLastNameNotFound = '';

  _guests?: Guest[];

  _originalGuests: OriginalGuest[] = [];

  _extraGuests: GuestsGuest[] = [];

  _isLoading: boolean = false;

  _extraGuestCount: number = 0;

  partyId: number = 0;

  guestFG: FormGroup;

  lastNameFormControl = new FormControl('');

  invitationCodeFormControl = new FormControl('', Validators.pattern('^[0-9]*$'));

  _SHEETID = '1D8BHWpdjsce4buteqRaNyaRaz1WNG59Y7yKSWm4FiOE';

  _guestRespondedCount = -1;

  addingGuestButtonClicked = false;

  objectKeys = Object.keys;
  constructor(public fb: FormBuilder, public cdr: ChangeDetectorRef) {
    this.guestFG = this.fb.group({});
  }

  calculateExtraGuestCount() {
    return this._originalGuests!.forEach(guest => {
      this._extraGuestCount += guest.extraGuest;
    })
  }

  clearForm() {
    this._extraGuests = [];
  }

  createGroup() {
    let originalGuests: OriginalGuest[] = [];
    let extraGuests: GuestsGuest[] = [];
    this._guests!.forEach((guest, i) => {
      if (!guest.guestsGuest) {
        const originalGuest = this.createOriginalGuest(guest);
        originalGuests.push(originalGuest);
      } else {
        const guestsGuest = this.createGuestsGuest(guest);
        extraGuests.push(guestsGuest);
      }
    });
    this._originalGuests = originalGuests;
    this._extraGuests = extraGuests;
    this.calculateExtraGuestCount();
  }

  createOriginalGuest(guest: Guest): OriginalGuest {
    let originalGuest : OriginalGuest = {
      firstName: guest.firstName,
      lastName: guest.lastName,
      guestName: guest.guestName,
      guestId: guest.guestId,
      glutonFree: guest.glutonFree,
      guestsGuest: false,
      partyId: guest.partyId,
      extraGuest: guest.extraGuest,
      kidsMeal: guest.kidsMeal,
      vegan: guest.vegan,
      willAttend: guest.willAttend,
      responseTime: new Date().toString(),
      email: new FormControl(guest.email, Validators.email),
      message: new FormControl(guest.message)
    };
    return originalGuest;
  }

  createGuestsGuest(guest?: Guest): GuestsGuest {
    let guestsGuest : GuestsGuest = {
      firstName: new FormControl(guest?.firstName),
      lastName: new FormControl(guest?.lastName),
      guestName: guest?.guestName ?? '',
      guestId: guest?.guestId ?? 0,
      glutonFree: guest?.glutonFree ?? false,
      guestsGuest: true,
      partyId: guest?.partyId ?? this.partyId,
      extraGuest: 0,
      kidsMeal: guest?.kidsMeal ?? false,
      vegan: guest?.vegan ?? false,
      willAttend: true,
      responseTime: new Date().toString(),
      email: new FormControl(guest?.email, Validators.email),
      message: new FormControl(guest?.message)
    };
    return guestsGuest;
  }

  originalGuestToGuest(originalGuest: OriginalGuest) : Guest {
    let guest : Guest = {
      firstName: originalGuest.firstName,
      lastName: originalGuest.lastName,
      guestName: originalGuest.guestName,
      guestId: originalGuest.guestId,
      glutonFree: originalGuest.glutonFree,
      guestsGuest: false,
      partyId: originalGuest.partyId,
      extraGuest: originalGuest.extraGuest,
      kidsMeal: originalGuest.kidsMeal,
      vegan: originalGuest.vegan,
      willAttend: originalGuest.willAttend,
      responseTime: originalGuest.responseTime,
      email: originalGuest.email.value,
      message: originalGuest.message.value
    };
    return guest;
  }

  guestsGuestToGuest(guestsGuest: GuestsGuest) : Guest {
    let guest : Guest = {
      firstName: guestsGuest.firstName.value,
      lastName: guestsGuest.lastName.value,
      guestName: `${guestsGuest.lastName.value}, ${guestsGuest.firstName.value}`,
      guestId: guestsGuest.guestId,
      glutonFree: guestsGuest.glutonFree,
      guestsGuest: true,
      partyId: guestsGuest.partyId ?? this.partyId,
      extraGuest: guestsGuest.extraGuest,
      kidsMeal: guestsGuest.kidsMeal,
      vegan: guestsGuest.vegan,
      willAttend: guestsGuest.willAttend,
      responseTime: guestsGuest.responseTime,
      email: guestsGuest.email.value,
      message: guestsGuest.message.value
    };
    return guest;
  }

  async submitForm() {
    this.originalandGuestsGuestsToGuests();
    console.log("clicked", this._guests);
    const url = new URL(this._URL);
    url.searchParams.append('rsvpResult', JSON.stringify(this._guests));
    console.log('guests are', JSON.stringify(this._guests))
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
      this._isLoading = false;
      return respondTest;
    }
  }



  private originalandGuestsGuestsToGuests() {
    this._guests = [];
    this._originalGuests?.forEach((originalGuest) => {
      let guest = this.originalGuestToGuest(originalGuest);
      this._guests?.push(guest);
    });
    this._extraGuests?.forEach((guestsGuest) => {
      let guest = this.guestsGuestToGuest(guestsGuest);
      this._guests?.push(guest);
    });
    this._guests![0].extraGuest = this._extraGuestCount;
  }

  addGuest() {
    this.addingGuestButtonClicked = true;
    this._extraGuestCount--;
    this._extraGuests?.push(
      this.createGuestsGuest()
    )
    this.goto(RSVPState.guestsRSVPinitiated);
    this.cdr.detectChanges();
  }

  removeGuest(i: number) {
    this._extraGuestCount++;
    this._extraGuests?.splice(i, 1)
    this.cdr.detectChanges();
  }

  get allowExtraGuest() {
    if (this._extraGuestCount == 0) {
      return false;
    }
    return true;
  }

  get isNotValid() {
    return !this.guestFG.valid;
  }

  get isLastNameNotValid() {
    return !this.lastNameFormControl.valid;
  }

  get isCodeFormatValid() {
    return !this.invitationCodeFormControl.valid;
  }

  getEmailFormControl(i: number): FormControl {
    return this._originalGuests[i].email;
  }

  getMessageFormControl(i: number): FormControl {
    return this._originalGuests[i].message;
  }

  getExtraGuestFirstNameFormControl(i: number): FormControl {
    return this._extraGuests[i].firstName;
  }

  getExtraGuestLastNameFormControl(i: number): FormControl {
    return this._extraGuests[i].lastName;
  }

  getExtraGuestMessageFormControl(i: number): FormControl {
    return this._extraGuests[i].message;
  }

  getExtraGuestEmailFormControl(i: number): FormControl {
    return this._extraGuests[i].email;
  }

  getEmptyErrorMessage() {
    return 'You must enter a value';
  }

  getEmailErrorMessage() {
    return 'please enter a valid email.'
  }

  async saveLastNamePromptCode() {
    this.goto(RSVPState.RSVPenterCode);
  }

  async submitLastName() {
    await this.getGuestsFromSheet();
  }
  private async getGuestsFromSheet(): Promise<any> {
    const lastname = this.lastNameFormControl.value;
    const invitationCode = this.invitationCodeFormControl.value;
    const url = new URL(this._URL);
    url.searchParams.append('lastName', lastname);
    url.searchParams.append('code', invitationCode);
    this.partyId = invitationCode;
    this._isLoading = true;
    const respond = await fetch(url.href, {
      method: 'GET'
    })
    const respondTest = await respond.text();
    if (respondTest == 'false') {
      this.lastNameFormControl = new FormControl('');
      this.invitationCodeFormControl = new FormControl('', Validators.pattern('^[0-9]*$'));
      this.goto(RSVPState.lastNameNotVerified);
      this._guestLastNameNotFound = lastname;
      this._isLoading = false;
      return;
    }
    else {
      this.clearForm();
      this._isLoading = false;
      this._guests = await JSON.parse(respondTest);
        this.createGroup();
        this.goto(RSVPState.guestsRSVPinitiated);
        this._guestRespondedCount = 0;
    }
  }


  guestWillAttendHandler(guest: OriginalGuest | GuestsGuest) {
    guest.willAttend = true;
  }

  guestWillNotAttendHandler(guest: OriginalGuest | GuestsGuest) {
    guest.willAttend = false;
  }

  guestKidsMealToggle(guest: OriginalGuest | GuestsGuest, isCorrect: boolean) {
    guest.kidsMeal = isCorrect;
  }

  guestVeganToggle(guest: OriginalGuest | GuestsGuest, isCorrect: boolean) {
    guest.vegan = isCorrect;
  }

  guestGlutonFreeToggle(guest: OriginalGuest | GuestsGuest, isCorrect: boolean) {
    guest.glutonFree = isCorrect;
  }

  isGuestAttending(guest: OriginalGuest) {
    return guest.willAttend == true;
  }

  isGuestNotAttending(guest: OriginalGuest) {
    return guest.willAttend === false;
  }

  goto(state: RSVPState) {
    this._state = state;
  }


  goBacktoPreviousState() {
    switch(this._state) {
      case RSVPState.guestsRSVPCompleted:
      case RSVPState.RSVPinitiated: {
        this._state = RSVPState.RSVPInitial;
        break
      }
      case RSVPState.guestsRSVPinitiated: {
        if (this._guestRespondedCount > 0) {
          this._guestRespondedCount -= 1;
        }
        else {
          this._state = RSVPState.RSVPinitiated;
        }
        break
      }
      case RSVPState.lastNameNotVerified: {
        this._state = RSVPState.RSVPinitiated;
        break
      }
      case RSVPState.RSVPenterCode: {
        this._state = RSVPState.RSVPinitiated;
        break
      }
    }
  }

  gotoNextState() {
    switch(this._state) {
      case RSVPState.RSVPInitial: {
        this._state = RSVPState.RSVPinitiated;
        break
      }
      case RSVPState.RSVPinitiated: {
        this.saveLastNamePromptCode();
        break
      }
      case RSVPState.RSVPenterCode: {
        this.submitLastName();
        break
      }
      case RSVPState.lastNameNotVerified: {
        this.submitLastName();
        break
      }
      case RSVPState.guestsRSVPinitiated: {
        this._guestRespondedCount += 1;
        if (this._guestRespondedCount == this._guests?.length) {
          if (this.allowExtraGuest) {
            // pop up dialog. hi do you want to add extra guest?
            window.alert('do you want to bring extra guest?')
          } else {
            this.submitForm();
          }
            
        }
        break
      }
    }
  }

  hideGoBackButton() {
    return (this._state == RSVPState.RSVPInitial || this._isLoading == true);
  }

  hideGoForwardButton() {
    if (this._state == RSVPState.guestsRSVPCompleted || this._state == RSVPState.RSVPInitial){
      return true;
    } else if (this._state == RSVPState.RSVPinitiated) {
        return !this.lastNameFormControl.valid;
      }
      else if (this._state == RSVPState.RSVPenterCode) {
        return !this.invitationCodeFormControl.valid;
      }
      else if (this._state == RSVPState.lastNameNotVerified) {
        return !this.invitationCodeFormControl.valid;
      }
      else {
        return false;
      }
    }

    focusCode() {
      document.getElementById('rsvp-invitation-code')?.focus();
    }

  preventDefault(e: any) {
    if (this._state == RSVPState.RSVPinitiated) {
      e.preventDefault();
    if (this.lastNameFormControl.status == 'VALID'){
        this.saveLastNamePromptCode();
        console.log(this.lastNameFormControl)
      }
    }
    else if (this._state == RSVPState.RSVPenterCode) {
      e.preventDefault();

      if (this.invitationCodeFormControl.status == 'VALID') {
      this.submitLastName();
      }
      else {
        console.log(this.invitationCodeFormControl)
      }
    }
    else if (this._state == RSVPState.lastNameNotVerified) {
      e.preventDefault();
      if (this.invitationCodeFormControl.status == 'VALID' &&
      this.lastNameFormControl.status == 'VALID') {
        this.submitLastName();
      }
    }
    else if (this._state == RSVPState.RSVPInitial) {
      e.preventDefault();
    }
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

determineAnimationStateForGuestsRSVPinitiated(index: number) {
  if (this._state == RSVPState.guestsRSVPinitiated) {
      if (index < this._guestRespondedCount) {
        return 'guest-left';
      }
      else if (index > this._guestRespondedCount) {
        return 'guest-right';
      }
      else if (index == this._guestRespondedCount) {
        return 'guest-middle';
      }
    }
    return 'guest-right';
  }
}
