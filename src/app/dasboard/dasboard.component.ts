import { Component } from '@angular/core';
import { LocationService, Location } from '../services/location.service';
import { CommonModule } from '@angular/common';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { AddMoviesComponent } from "../add-movies/add-movies.component";
import { CityInputComponent } from "../Booking/city-input/city-input.component";
import { NavbarComponent } from "../components/navbar/navbar.component";
@Component({
  selector: 'app-dasboard',
  standalone: true,
  imports: [CommonModule, AddMoviesComponent, CityInputComponent, NavbarComponent],
  templateUrl: './dasboard.component.html',
  styleUrl: './dasboard.component.css'
})
export class DasboardComponent {
  content='home';
 locations: Location[] = [];
  constructor(private service: LocationService,private auth:AuthService,private router: Router
  ) {}
  changeContent(section: string) {
    this.content = section;
  }
 user: any = this.auth.getUser();
  ngOnInit() {
    if(this.user.role === 'user' || this.user.role === undefined){
        this.router.navigate(['/']);

    }
    this.service.getAll().subscribe(res => this.locations = res);
  }
}
