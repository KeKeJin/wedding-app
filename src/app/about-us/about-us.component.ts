import { animate, state, style, transition, trigger } from '@angular/animations';
import {  Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

export interface Story {
  photo: string,
  when: string,
  title: string,
  body: string
}
@Component({
  selector: 'app-about-us',
  templateUrl: './about-us.component.html',
  styleUrls: ['./about-us.component.css','../app.component.css'],
  animations: [
    trigger('leftEnter', [
      state(
        'inView', 
        style({
          opacity: 1,
          transform: 'translateX(5vw) ' 
        })
      ),
      state('notInView', style({
        opacity: 0.5,
        transform: 'translateX(-5vw)',
      })),
      transition('*=>*', animate('1000ms ease-out')),
    ]),
    trigger('rightEnter', [
      state(
        'inView', 
        style({
          opacity: 1,
          transform: 'translateX(-5vw) ' 
        })
      ),
      state('notInView', style({
        opacity: 0.5,
        transform: 'translateX(5vw)',
      })),
      transition('*=>*', animate('1000ms ease-out')),
    ])
  ]
})
export class AboutUsComponent implements OnInit {

  constructor(private translate: TranslateService) { }

  stories:Story[] = [
    {
      photo: 'assets/our-story-2-cropped.jpg',
      when: '',
      title: 'OUR_STORY.HOW_WE_GOT_CLOSER',
      body: 'OUR_STORY.HOW_WE_GOT_CLOSER_BODY',
    },
    {
      photo: 'assets/our-story-4.jpg',
      when: '',
      title: 'OUR_STORY.FELL_IN_LOVE_AGAIN',
      body: 'OUR_STORY.FELL_IN_LOVE_AGAIN_BODY',
    },
    {
      photo: 'assets/0N4A7612-Edit.jpg',
      when: '',
      title: 'OUR_STORY.PROPOSAL',
      body: 'OUR_STORY.PROPOSAL_BODY',
    },
    {
      photo: 'assets/our-story-6.jpg',
      when: '',
      title: 'OUR_STORY.WEDDING',
      body: 'OUR_STORY.WEDDING_BODY',
    }
  ]
  ngOnInit(): void {
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
