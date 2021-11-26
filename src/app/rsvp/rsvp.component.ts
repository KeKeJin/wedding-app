import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-rsvp',
  templateUrl: './rsvp.component.html',
  styleUrls: ['./rsvp.component.css', '../app.component.css']
})
export class RsvpComponent  {

  options: FormGroup;
  nameFormControl = new FormControl('');
  emailFormControl = new FormControl('');
  guestFormControl = new FormControl(0);
  messageFormControl = new FormControl('');

  constructor(fb: FormBuilder) {
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

  getErrorMessage() {
    if (this.emailFormControl.hasError('required')) {
      return 'You must enter a value';
      // search by last name, auto populate their first names,
      // drop down on the number of attandees, populate input box 
      // special requests:  kids meal, vegan, gluton quantity
    }
    return this.emailFormControl.hasError('email') ? 'Not a valid email' : '';
  }
}
