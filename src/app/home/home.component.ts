import { Component, HostListener, OnInit } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css', './../app.component.css']
})
export class HomeComponent implements OnInit {

  constructor() { }

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
}
