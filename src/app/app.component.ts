import { Component } from '@angular/core';
import { RouterModule, RouterOutlet, Router } from '@angular/router';
//import { NavBarComponent } from "./nav-bar/nav-bar.component";
import { NavbarComponent } from "./components/navbar/navbar.component";
import { MovieCardComponent } from "./components/movie-card/movie-card.component";
import { SeatGridComponent } from "./components/seat-grid/seat-grid.component";
import { ShowCardComponent } from "./components/show-card/show-card.component";
import { CommonModule } from '@angular/common';
import { AddMoviesComponent } from "./add-movies/add-movies.component";
import { CityInputComponent } from "./Booking/city-input/city-input.component";
import { DasboardComponent } from "./dasboard/dasboard.component";
import { TheatorInputComponent } from "./Booking/theator-input/theator-input.component";
import { SeatsInputComponent } from "./Booking/seats-input/seats-input.component";
import { ScreenInputComponent } from "./Booking/screen-input/screen-input.component";
import { FooterComponent } from "./components/footer/footer.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [NavbarComponent, MovieCardComponent, SeatGridComponent, ShowCardComponent, RouterOutlet, CommonModule, RouterModule, AddMoviesComponent, CityInputComponent, DasboardComponent, TheatorInputComponent, SeatsInputComponent, ScreenInputComponent, FooterComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'movie-ticket';

  constructor(public router: Router) {}

  get isAdminRoute(): boolean {
    return this.router.url.includes('/dashboard');
  }
}
