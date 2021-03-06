import { ChangeDetectorRef, Component } from '@angular/core';
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
  languageSelected;

  constructor(
    private router: Router,
    public translate: TranslateService,
    public ref: ChangeDetectorRef
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
          label: 'RSVP',
          link: './rsvp',
          index: 9
          }
    ];
    translate.addLangs(['en', 'zh']);
    translate.setDefaultLang('en');
    translate.use('en');
    const browserLang = translate.getBrowserLang();
    if (browserLang.match(/zh/)) {
      translate.use('zh');
      document.querySelector('body')?.classList.add('chinese-tab');
      this.languageSelected = 'zh';
    } else {
      translate.use('en');
      this.languageSelected = 'en';
    }
}
  ngOnInit(): void {
    this.router.events.subscribe((res) => {
        this.activeLinkIndex = this.navLinks.indexOf(this.navLinks.find(tab => tab.link === '.' + this.router.url));
    });
  }

  onLanguageToggled(): void {
    if (this.languageSelected == 'en') {
      this.translate.use('zh');
      this.languageSelected = 'zh';
      document.querySelector('body')?.classList.add('chinese-tab');
      this.ref.detectChanges();
    } else {
      this.translate.use('en');
      this.languageSelected = 'en';
      document.querySelector('body')?.classList.remove('chinese-tab');
    }
  }

  scrollToElement($element:HTMLElement, route: string): void {
    $element.scrollIntoView({behavior: "smooth", block: "start", inline: "nearest"});
    this.router.navigate([route])
  }

  isInViewport(element: HTMLElement): boolean {
    var rect = element.getBoundingClientRect();
    var html = document.documentElement;
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || html.clientHeight) &&
        rect.right <= (window.innerWidth || html.clientWidth)
    );
  }

  shouldChangeMenu() {
    if ( window.innerWidth <= 500) {
      return true;
    } else {
      return false;
    }
  }

  get isRehearsalDinner() {
    if (window.location.href.includes('rehearsal-dinner')) {
      return true;
    }
    else {
      return false;
    }
  }
}
