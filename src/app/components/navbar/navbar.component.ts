import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent implements OnInit {
  
  isLoggedIn:boolean = false;
    user: any;
  constructor(private router: Router, private authService: AuthService) { }
  ngOnInit(): void {
      this.authService.user$.subscribe(user => {
      console.log('Navbar updated:', user);
      this.user = user;
      this.isLoggedIn = !!user;
    });
   
  }
 
  login() {
    
    this.router.navigate(['/login']);
    
  }
  logout(){
    this.authService.logout();
   
    this.router.navigate(['/']);

  }

}
