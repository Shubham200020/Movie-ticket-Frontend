import { Component, OnInit } from '@angular/core';
import { LocationService, Location } from '../services/location.service';
import { CommonModule } from '@angular/common';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { AddMoviesComponent } from "../add-movies/add-movies.component";
import { CityInputComponent } from "../Booking/city-input/city-input.component";
import { NavbarComponent } from "../components/navbar/navbar.component";
import { TheatorInputComponent } from "../Booking/theator-input/theator-input.component";
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
@Component({
  selector: 'app-dasboard',
  standalone: true,
  imports: [CommonModule, AddMoviesComponent, CityInputComponent, NavbarComponent, TheatorInputComponent],
  templateUrl: './dasboard.component.html',
  styleUrl: './dasboard.component.css'
})
export class DasboardComponent implements OnInit {
  content='home';
  movie=0;
  theator=0;
 locations: Location[] = [];
  constructor(private service: LocationService,private auth:AuthService,
    private router: Router,
    private http:HttpClient
  ) {}
  changeContent(section: string) {
    this.content = section;
  }
 user: any = this.auth.getUser();
  ngOnInit() {
    this.getTheaterCount().subscribe(count => this.theator = count);
    this.getMoviesCount().subscribe(count => this.movie = count);
    if(this.user.role === 'user' || this.user.role === undefined){
        this.router.navigate(['/']);

    }
    this.service.getAll().subscribe(res => this.locations = res);
  }
   private apiUrl = 'https://localhost:7061/api/movie';
  private theaterApiUrl="https://localhost:7061/api/theater/theator-count"

  //constructor(private http: HttpClient) {}
getTheaterCount(): Observable<number> {
    return this.http.get<number>(`${this.theaterApiUrl}`);
  }
  getMoviesCount(): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/movies-count`);
  }
}
