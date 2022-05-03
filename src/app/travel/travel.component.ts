import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-travel',
  templateUrl: './travel.component.html',
  styleUrls: ['./travel.component.css', '../app.component.css']
})
export class TravelComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

  shouldChangeMenu() {
    if ( window.innerWidth <= 500) {
      return true;
    } else {
      return false;
    }
  }

}
