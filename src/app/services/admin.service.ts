import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  private apiUrl = 'https://localhost:7061/api/AdminControllers';

  constructor(private http: HttpClient) {}

  login(data: any) {
    return this.http.post(`${this.apiUrl}/login`, data);
  }

  getAllAdmins() {
    return this.http.get(this.apiUrl);
  }

  addAdmin(data: any) {
    return this.http.post(this.apiUrl, data);
  }

  deleteAdmin(id: number) {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}