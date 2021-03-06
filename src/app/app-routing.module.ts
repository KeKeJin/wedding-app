import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { ScheduleComponent } from './schedule/schedule.component';
import { TravelComponent } from './travel/travel.component';
import { RegistryComponent } from './registry/registry.component';
import { RsvpComponent } from './rsvp/rsvp.component';
import { AboutUsComponent } from './about-us/about-us.component';
import { RehearsalDinnerComponent } from './rehearsal-dinner/rehearsal-dinner.component';
const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', component:  HomeComponent},
  { path: 'us', component:  AboutUsComponent},
  { path: 'schedule', component:  ScheduleComponent},
  { path: 'travel', component: TravelComponent},
  { path: 'registry', component: RegistryComponent},
  { path: 'rsvp', component: RsvpComponent},
  { path: 'rehearsal-dinner', component: RehearsalDinnerComponent},
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