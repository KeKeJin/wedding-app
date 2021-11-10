import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
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
const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', component:  HomeComponent},
  { path: 'about-us', component:  AboutUsComponent},
  { path: 'schedule', component:  ScheduleComponent},
  { path: 'travel', component: TravelComponent},
  { path: 'registry', component: RegistryComponent},
  { path: 'wedding-party', component: WeddingPartyComponent},
  { path: 'photos', component: PhotosComponent},
  { path: 'things-to-do', component: ThingsToDoComponent},
  { path: 'faqs', component: FaqsComponent},
  { path: 'rsvp', component: RsvpComponent},
];
export const appRouting = RouterModule.forRoot(routes);
@NgModule({
  imports: [
    RouterModule.forRoot(routes),
    CommonModule
  ],
  exports: [ RouterModule ],
  declarations: []
})
export class AppRoutingModule { }