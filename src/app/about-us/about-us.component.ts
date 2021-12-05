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
    trigger('enabledStateChange', [
      state(
        'default', 
        style({
          opacity: 0.5,
        })
      ),
      transition('*=>*', animate('300ms ease-out')),
    ])
  ]
})
export class AboutUsComponent implements OnInit {

  constructor(private translate: TranslateService) { }

  stories:Story[] = [
    {
      photo: 'assets/24891493_10214855012078917_1039411066_n.jpg',
      when: '',
      title: 'OUR_STORY.FIRST_TIME',
      body: 'OUR_STORY.FIRST_TIME_BODY'
    },
    {
      photo: 'assets/our-story-2.JPG',
      when: '',
      title: 'OUR_STORY.HOW_WE_GOT_CLOSER',
      body: 'OUR_STORY.HOW_WE_GOT_CLOSER_BODY',
    },
    {
      photo: 'assets/our-story-3.jpeg',
      when: '',
      title: 'OUR_STORY.FELL_IN_LOVE',
      body: 'OUR_STORY.FELL_IN_LOVE_BODY',
    },
    {
      photo: 'assets/our-story-4.jpeg',
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
      photo: 'assets/PXL_20210725_213224394.jpg',
      when: '',
      title: 'OUR_STORY.WEDDING',
      body: 'OUR_STORY.WEDDING_BODY',
    }
  ]
  ngOnInit(): void {
  }
}
