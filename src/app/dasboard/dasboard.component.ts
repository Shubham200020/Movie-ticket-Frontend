import { Component, OnInit } from '@angular/core';
import { LocationService } from '../services/location.service';
import { AppLocation } from '../models/models';
import { CommonModule } from '@angular/common';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { AddMoviesComponent } from "../add-movies/add-movies.component";
import { CityInputComponent } from "../Booking/city-input/city-input.component";
import { NavbarComponent } from "../components/navbar/navbar.component";
import { TheatorInputComponent } from "../Booking/theator-input/theator-input.component";
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ScreenInputComponent } from "../Booking/screen-input/screen-input.component";
import { ShowtimeInputComponent } from "../Booking/showtime-input/showtime-input.component";
import { SeatManagementComponent } from "../Booking/seat-management/seat-management.component";
import { AdminManagementComponent } from "../admin-management/admin-management.component";
import { BusinessTrackingComponent } from "../business-tracking/business-tracking.component";
@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, AddMoviesComponent, CityInputComponent, NavbarComponent, TheatorInputComponent, ScreenInputComponent, ShowtimeInputComponent, SeatManagementComponent, AdminManagementComponent, BusinessTrackingComponent],
  templateUrl: './dasboard.component.html',
  styleUrl: './dasboard.component.css'
})
export class DasboardComponent implements OnInit {
  content = 'home';
  movieCount = 0;
  theaterCount = 0;
  showCount = 0;
  seatCount = 0;
  locations: AppLocation[] = [];

  constructor(
    private service: LocationService,
    private auth: AuthService,
    private router: Router,
    private http: HttpClient
  ) {}

  changeContent(section: string) {
    this.content = section;
  }

  user: any = this.auth.getUser();

  ngOnInit() {
    this.getTheaterCount().subscribe(count => this.theaterCount = count);
    this.getMoviesCount().subscribe(count => this.movieCount = count);
    this.getShowCount().subscribe(count => this.showCount = count);
    this.getSeatCount().subscribe(count => this.seatCount = count);

    if(this.user.role === 'user' || this.user.role === undefined){
        this.router.navigate(['/']);
    }
    this.service.getAll().subscribe(res => this.locations = res);
  }

  private movieApiUrl = 'https://localhost:7061/api/Movie';
  private theaterApiUrl = 'https://localhost:7061/api/Theater';
  private showtimeApiUrl = 'https://localhost:7061/api/Showtime';
  private seatApiUrl = 'https://localhost:7061/api/Seats';

  getTheaterCount(): Observable<number> {
    return this.http.get<number>(`${this.theaterApiUrl}/theator-count`);
  }
  getMoviesCount(): Observable<number> {
    return this.http.get<number>(`${this.movieApiUrl}/movies-count`);
  }
  getShowCount(): Observable<number> {
    return this.http.get<number>(`${this.showtimeApiUrl}/count`);
  }
  getSeatCount(): Observable<number> {
    return this.http.get<number>(`${this.seatApiUrl}/count`);
  }
}
