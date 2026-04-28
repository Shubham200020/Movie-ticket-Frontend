import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { MovieDetailsComponent } from './pages/movie-details/movie-details.component';
import { ShowSelectionComponent } from './pages/show-selection/show-selection.component';
// import { SeatSelectionComponent } from './pages/seat-selection/seat-selection.component';
import { BookingSummaryComponent } from './pages/booking-summary/booking-summary.component';
import { SeatGridComponent } from './components/seat-grid/seat-grid.component';
import { RegisterComponent } from './auth/register/register.component';
import { LoginComponent } from './auth/login/login.component';
import { ShowCardComponent } from './components/show-card/show-card.component';
import { DasboardComponent } from './dasboard/dasboard.component';

import { adminGuard } from './auth/admin.guard';
import { ProfileComponent } from './pages/profile/profile.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'movie/:id', component: ShowCardComponent },
  { path: 'shows/:id', component: ShowSelectionComponent },
  { path: 'seats/:id', component: SeatGridComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'login', component: LoginComponent },
  { path: 'dashboard', component: DasboardComponent, canActivate: [adminGuard] },
  { path: 'profile', component: ProfileComponent },
  { path: 'summary', component: BookingSummaryComponent}
];
