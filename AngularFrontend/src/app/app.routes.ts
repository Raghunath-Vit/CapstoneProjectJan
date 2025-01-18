import { Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login/login.component';
import { SignUpComponent } from './auth/sign-up/sign-up/sign-up.component'; 
import { MeetingsComponent } from './meeting-list/meeting-list/meetings.component';
import { AddMeetingComponent } from './meeting-add/meeting-add/add-meeting.component';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'sign-up', component: SignUpComponent },
  { path: 'meetings', component: MeetingsComponent,children: [
    { path: 'filter', component: MeetingsComponent  },  // Path for Filter/Search Meeting
    { path: 'add', component: AddMeetingComponent },  // Path for Add a Meeting
    { path: '', redirectTo: '/meetings/filter', pathMatch: 'full' },  // Default child route
  ]  }, // Add the Meetings route
  { path: '**', redirectTo: '/login' } // Fallback route
];
