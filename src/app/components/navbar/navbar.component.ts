import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

import { RouterModule } from '@angular/router';

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
  constructor(private router: Router, private authService: AuthService) { }
  ngOnInit(): void {
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

}
