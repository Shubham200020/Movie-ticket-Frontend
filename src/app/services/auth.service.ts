import { Injectable } from '@angular/core';

import { BehaviorSubject } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class AuthService {
   

  private userSubject = new BehaviorSubject<any>(this.getUserFromStorage());
  user$ = this.userSubject.asObservable();

  
    private getUserFromStorage() {
    const data = localStorage.getItem('user');
    return data ? JSON.parse(data) : null;
  }
  // Save user
  saveUser(data: any) {
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data));
    localStorage.setItem('role', data.role);
      this.userSubject.next(data);
   // this.userSubject.next(user);
  }

  // Get user
  getUser() {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }

  // Get token
  getToken() {
    return localStorage.getItem('token');
  }

  // Get role
  getRole() {
    return localStorage.getItem('role');
  }

  // Logout
  logout() {
    localStorage.clear();
    this.userSubject.next(null);
  }

  // Check login
  isLoggedIn() {
    return !!localStorage.getItem('token');
  }
}
