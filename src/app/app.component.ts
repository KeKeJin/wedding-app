import { elementEventFullName } from '@angular/compiler/src/view_compiler/view_compiler';
import { Component, ElementRef, HostListener, ViewChild, ViewChildren } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'wedding-app';
  navLinks: any[];
  activeLinkIndex = -1; 

  constructor(
    private router: Router,
    public translate: TranslateService
    ) {
    this.navLinks = [
        {
            label: 'Home',
            link: './home',
            index: 0
        }, {
          label: 'Our Story',
          link: './us',
          index: 1
        },{
            label: 'Schedule',
            link: './schedule',
            index: 2
        }, {
            label: 'Travel',
            link: './travel',
            index: 3
        }, {
          label: 'Registry',
          link: './registry',
          index: 4
        }, {
          label: 'Wedding Party',
          link: './wedding-party',
          index: 5
        }, {
          label: 'Photos',
          link: './photos',
          index: 6
          }, {
          label: 'Things To Do',
          link: './things-to-do',
          index: 7
          }, {
          label: 'FAQs',
          link: './faqs',
          index: 8
          }, {
          label: 'RSVP',
          link: './rsvp',
          index: 9
          }, 
    ];
    translate.addLangs(['en', 'zh']);
    translate.setDefaultLang('en');
    translate.use('en');
    const browserLang = translate.getBrowserLang();
    translate.use(browserLang.match(/en|zh/) ? browserLang : 'en');
}
ngOnInit(): void {
  this.router.events.subscribe((res) => {
      this.activeLinkIndex = this.navLinks.indexOf(this.navLinks.find(tab => tab.link === '.' + this.router.url));
      console.log("link: ", this.activeLinkIndex)
  });
}


  scrollToElement($element:HTMLElement, route: string): void {
    $element.scrollIntoView({behavior: "smooth", block: "start", inline: "nearest"});
    this.router.navigate([route])
    $element.getBoundingClientRect();
  }

  isInViewport(element: HTMLElement): boolean {
    var rect = element.getBoundingClientRect();
    var html = document.documentElement;
    console.log(rect)
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || html.clientHeight) &&
        rect.right <= (window.innerWidth || html.clientWidth)
    );
}
}
