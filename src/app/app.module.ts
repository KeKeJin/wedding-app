import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import {MatTabsModule} from '@angular/material/tabs'
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HomeComponent } from './home/home.component';
import { ScheduleComponent } from './schedule/schedule.component';
import { TravelComponent } from './travel/travel.component';
import { RegistryComponent } from './registry/registry.component';
import { DialogMoreGuestDialog, RsvpComponent } from './rsvp/rsvp.component';
import { AboutUsComponent } from './about-us/about-us.component';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import {HttpClientModule, HttpClient} from '@angular/common/http';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import {MatButtonModule} from '@angular/material/button';
import { CountDownComponent } from './count-down/count-down.component';
import {MatFormFieldModule} from '@angular/material/form-field'; 
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatOptionModule } from '@angular/material/core';
import {MatSelectModule} from '@angular/material/select';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatMenuModule} from '@angular/material/menu';
import {MatIconModule} from '@angular/material/icon';
import {MatDialogModule} from '@angular/material/dialog'
import { RehearsalDinnerComponent } from './rehearsal-dinner/rehearsal-dinner.component';

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http);
}

@NgModule({
  declarations: [
    AppComponent,
    DialogMoreGuestDialog,
    HomeComponent,
    ScheduleComponent,
    TravelComponent,
    RegistryComponent,
    RsvpComponent,
    AboutUsComponent,
    CountDownComponent,
    RehearsalDinnerComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MatButtonModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatOptionModule,
    MatSelectModule,
    MatMenuModule,
    MatIconModule,
    FormsModule,
    ReactiveFormsModule,
    MatSlideToggleModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatTabsModule,
    HttpClientModule,
    MatProgressSpinnerModule,
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
