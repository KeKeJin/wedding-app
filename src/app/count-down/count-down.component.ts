import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { time } from 'console';
import { Observable, Subject, Subscription, timer } from 'rxjs';

@Component({
  selector: 'count-down',
  templateUrl: './count-down.component.html',
  styleUrls: ['./count-down.component.css', '../app.component.css']
})
export class CountDownComponent implements OnInit, OnDestroy {

  @Input() theDate!: Date;
  MS_IN_S = 1000;
  HOUR_IN_DAY = 24;
  MIN_IN_HOUR = 60;
  SEC_IN_MIN = 60;

  MS_IN_DAY = this.MS_IN_S*this.SEC_IN_MIN*this.MIN_IN_HOUR*this.HOUR_IN_DAY;
  MS_IN_HOUR = this.MS_IN_S*this.SEC_IN_MIN*this.MIN_IN_HOUR;
  MS_IN_MIN = this.MS_IN_S*this.SEC_IN_MIN;

  delta_days: number = 0;
  delta_hours: number = 0;
  delta_mins: number = 0;
  delta_secs: number = 0;

  source: Observable<number> = timer(1000,1000);
  subject?: Subscription;

  should_show_0_time = false;

  constructor() {
  }
  ngOnDestroy(): void {
    this.subject?.unsubscribe();
  }

  ngOnInit(): void {
    this.getDeltaTime();
    if (!this.should_show_0_time ) {
      this.subject = this.source.subscribe(val => this.getDeltaTime());
    }
  }

  private getDeltaTime () {
    const delta_time = this.theDate.getTime() - Date.now();
    if (delta_time < 0) {
      this.should_show_0_time = true;
    }
    else {
      this.delta_days = Math.floor(delta_time/this.MS_IN_DAY);
      this.delta_hours = Math.floor(delta_time%this.MS_IN_DAY/this.MS_IN_HOUR);
      this.delta_mins = Math.floor(delta_time%this.MS_IN_HOUR/this.MS_IN_MIN);
      this.delta_secs = Math.floor(delta_time%this.MS_IN_MIN/this.MS_IN_S);
    }

  }

}
