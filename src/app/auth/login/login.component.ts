import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { UserService } from '../../services/user.service';
import { AdminService } from '../../services/admin.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
role: string = 'user';

  user = {
    email: '',
    password: ''
  };
  windows: any;

  constructor(
    private adminService: AdminService,
    private userService: UserService,
    private router: Router,private auth: AuthService
  ) {}

  setRole(selected: string) {
    this.role = selected;
  }

  login() {

    if (this.role === 'admin') {

      this.adminService.login(this.user).subscribe({
        next: (res: any) => {
          this.auth.saveUser(res);
          alert('Admin Login Successful ✅');

          localStorage.setItem('token', res.token);
          localStorage.setItem('role', 'admin');
          
          this.router.navigate(['/dashboard']);
  
        },
        error: () => {
          alert('Invalid Admin Credentials ❌');
        }
      });

    } else {

      this.userService.login(this.user).subscribe({
        next: (res: any) => {
          this.auth.saveUser(res);
          alert('User Login Successful ✅');

          localStorage.setItem('token', res.token);
          localStorage.setItem('role', 'user');

          this.router.navigate(['/']);
          //this.windows.location.reload();
        },
        error: () => {
          alert('Invalid User Credentials ❌');
        }
      });

    }
  }
}
