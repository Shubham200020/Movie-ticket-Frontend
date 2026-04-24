import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

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
  constructor(private http: HttpClient) {}

  register() {
    this.http.post('https://localhost:7061/api/user', this.user)
      .subscribe({
        next: (res) => {
          alert('Registration Successful ✅');
          console.log(res);
        },
        error: (err) => {
          alert('Registration Failed ❌');
          console.error(err);
        }
      });
  }
}
