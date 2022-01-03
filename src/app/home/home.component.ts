import { Component, HostListener, OnInit } from '@angular/core';
import { animate, state, style, transition, trigger } from '@angular/animations';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css', './../app.component.css'],
  animations: [
    trigger('leftEnter', [
      state(
        'inView', 
        style({
          opacity: 1,
          transform: 'translateX(20vw) ' 
        })
      ),
      state('notInView', style({
        opacity: 0.5,
        transform: 'translateX(-20vw)',
      })),
      transition('notInView=>inView', animate('1000ms ease-out')),
    ]),
    trigger('rightEnter', [
      state(
        'inView', 
        style({
          opacity: 1,
          transform: 'translateX(-20vw) ' 
        })
      ),
      state('notInView', style({
        opacity: 0.5,
        transform: 'translateX(20vw)',
      })),
      transition('notInView=>inView', animate('1000ms ease-out')),
    ]),
    trigger('pound', [
      transition('*=>*', [
        animate('0.2s', style({ transform: 'scale(1.3)' })),
        animate('0.1s', style({ transform: 'scale(1)' })),
        animate('0.2s', style({ transform: 'scale(1.3)' })),
        animate('0.1s', style({ transform: 'scale(1)' })),
        animate('1.5s', style({ transform: 'scale(1)' })),
        animate('0.2s', style({ transform: 'scale(1.3)' })),
        animate('0.1s', style({ transform: 'scale(1)' })),
        animate('0.2s', style({ transform: 'scale(1.3)' })),
        animate('0.1s', style({ transform: 'scale(1)' })),
        animate('1.5s', style({ transform: 'scale(1)' })),
      ]),
    ]),
  ]
})
export class HomeComponent implements OnInit {

  constructor() { }

  pounds = false;
  ngOnInit(): void {
  }

  @HostListener('wheel', ['$event'])
  fadeAway () {
    const currentScroll = window.pageYOffset;
  if (currentScroll <= 300) {
    var opacity = 1 - currentScroll / 300;
  } else {
    opacity = 0;
  }
  // document.getElementById("header")!.style.opacity = String(opacity);
  }

  isInview(className: string){
    const element = document.getElementsByClassName(className)[0];
    const rect = element.getBoundingClientRect();
    const inView =
        rect.top >= -element.clientHeight &&
        rect.left >= -element.clientWidth &&
        rect.bottom <= Math.max(window.innerHeight, document.documentElement.clientHeight)+element.clientHeight &&
        rect.right <= Math.max(window.innerWidth, document.documentElement.clientWidth)+element.clientWidth
    return inView? "inView": "notInView";
  }
}
