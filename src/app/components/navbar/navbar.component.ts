import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

import { RouterModule } from '@angular/router';
import { LocationService } from '../../services/location.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent implements OnInit {
  isAdmin=false;
  isLoggedIn:boolean = false;
  user: any;
  currentCity: string = 'Detecting...';
  availableLocations: any[] = [];
  showLocationDropdown: boolean = false;

  constructor(private router: Router, private authService: AuthService, private locationService: LocationService) { }

  ngOnInit(): void {
    this.locationService.currentCity$.subscribe(city => this.currentCity = city);
    this.detectLocation();
    this.loadLocations();
      this.authService.user$.subscribe(user => {
      console.log('Navbar updated:', user);
      this.user = user;
      this.isLoggedIn = !!user;
      this.isAdmin = user?.role === 'admin';
    });
   
  }
 
  login() {
    
    this.router.navigate(['/login']);
    
  }
  logout(){
    this.authService.logout();
   
    this.router.navigate(['/']);

  }
  goToDashboard(){
    if(this.user?.role === 'admin'){
      this.router.navigate(['/dashboard']);
    }
  }
  goDashboard(){
    this.router.navigate(['/dashboard']);
  }

  detectLocation() {
    this.locationService.getCurrentCity()
      .then(city => {
        this.locationService.setCurrentCity(city);
      })
      .catch(err => {
        console.error(err);
        this.locationService.setCurrentCity('Select Location');
      });
  }

  loadLocations() {
    this.locationService.getAll().subscribe(locations => {
      // Filter unique cities
      const uniqueCities = new Set();
      this.availableLocations = locations.filter(loc => {
        if (!uniqueCities.has(loc.city)) {
          uniqueCities.add(loc.city);
          return true;
        }
        return false;
      });
    });
  }

  toggleLocationDropdown() {
    this.showLocationDropdown = !this.showLocationDropdown;
  }

  selectLocation(location: any) {
    this.locationService.setCurrentCity(location.city);
    this.showLocationDropdown = false;
  }

}
