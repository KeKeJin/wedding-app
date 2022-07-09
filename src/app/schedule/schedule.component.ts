import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-schedule',
  templateUrl: './schedule.component.html',
  styleUrls: ['./schedule.component.css','../app.component.css']
})
export class ScheduleComponent implements OnInit {

  date = new Date('2022-07-30T17:30:00-07:00');
  constructor() { }

  ngOnInit(): void {
  }

}
