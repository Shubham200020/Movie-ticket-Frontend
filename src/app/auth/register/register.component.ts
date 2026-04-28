import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule,FormsModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})


export class RegisterComponent {
  user = {
    name: '',
    email: '',
    password: '',
    bookings:[]
  };
  
  errorMessage: string = '';
  successMessage: string = '';

  constructor(private http: HttpClient, private router: Router) {}

  register() {
    this.errorMessage = '';
    this.successMessage = '';

    this.http.post('https://localhost:7061/api/user', this.user)
      .subscribe({
        next: (res) => {
          this.successMessage = 'Registration Successful ✅ Redirecting to login...';
          setTimeout(() => {
            this.router.navigate(['/login']);
          }, 1500);
        },
        error: (err) => {
          if (err.error && typeof err.error === 'string') {
            this.errorMessage = err.error; // e.g., "Email already exists"
          } else {
            this.errorMessage = 'Registration Failed ❌';
          }
          console.error(err);
        }
      });
  }
}
