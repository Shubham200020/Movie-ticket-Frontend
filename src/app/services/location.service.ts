import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { AppLocation } from '../models/models';
@Injectable({
  providedIn: 'root'
})
export class LocationService {

   private apiUrl = 'https://localhost:7061/api/location';

  constructor(private http: HttpClient) {}

  getAll(): Observable<AppLocation[]> {
    return this.http.get<AppLocation[]>(this.apiUrl);
  }

  create(data: AppLocation): Observable<AppLocation> {
    return this.http.post<AppLocation>(this.apiUrl, data);
  }

  update(id: number, data: AppLocation): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, data);
  }

  delete(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
