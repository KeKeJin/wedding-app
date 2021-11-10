import { Component, OnInit } from '@angular/core';


interface Tab {
  name: string;
  id: number;
}

const tabs = [
  { "id": 0, "name": "Home" },
  { "id": 1, "name": "Schedule"},
  { "id": 2, "name": "Travel" },
  { "id": 3, "name": "Registry" },
  { "id": 4, "name": "Wedding Party" },
  { "id": 5, "name": "Photos" },
  { "id": 6, "name": "Things to do" },
  { "id": 7, "name": "FAQs" },
  { "id": 8, "name": "RSVP" },
] 
@Component({
  selector: 'app-navigator',
  templateUrl: './navigator.component.html',
  styleUrls: ['./navigator.component.css']
})
export class NavigatorComponent implements OnInit {
  tabs:Tab[] = [];
  constructor() { }
  
  ngOnInit(): void {
    this.tabs = tabs;
  }

}
