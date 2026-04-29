import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private apiUrl = 'http://localhost:5002/api/User';

  constructor(private http: HttpClient) {}

  login(data: any) {
    return this.http.post(`${this.apiUrl}/login`, data);
  }
}
