import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import {MatTabsModule} from '@angular/material/tabs'
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NavigatorComponent } from './navigator/navigator.component';
import { HomeComponent } from './home/home.component';
import { ScheduleComponent } from './schedule/schedule.component';
import { TravelComponent } from './travel/travel.component';
import { RegistryComponent } from './registry/registry.component';
import { WeddingPartyComponent } from './wedding-party/wedding-party.component';
import { PhotosComponent } from './photos/photos.component';
import { ThingsToDoComponent } from './things-to-do/things-to-do.component';
import { FaqsComponent } from './faqs/faqs.component';
import { RsvpComponent } from './rsvp/rsvp.component';
import { AboutUsComponent } from './about-us/about-us.component';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import {HttpClientModule, HttpClient} from '@angular/common/http';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import {MatButtonModule} from '@angular/material/button';
import { CountDownComponent } from './count-down/count-down.component';
export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http);
}

@NgModule({
  declarations: [
    AppComponent,
    NavigatorComponent,
    HomeComponent,
    ScheduleComponent,
    TravelComponent,
    RegistryComponent,
    WeddingPartyComponent,
    PhotosComponent,
    ThingsToDoComponent,
    FaqsComponent,
    RsvpComponent,
    AboutUsComponent,
    CountDownComponent,

  ],
  imports: [
    BrowserModule,
    MatButtonModule,
    MatSlideToggleModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatTabsModule,
    HttpClientModule,
    TranslateModule.forRoot({
      defaultLanguage: 'en',
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    }),
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
