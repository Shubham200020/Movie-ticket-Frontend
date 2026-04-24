import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface Location {
  id: number;
  state: string;
  city: string;
  location: string;
}
@Injectable({
  providedIn: 'root'
})
export class LocationService {

   private apiUrl = 'https://localhost:7061/api/location';

  constructor(private http: HttpClient) {}

  getAll(): Observable<Location[]> {
    return this.http.get<Location[]>(this.apiUrl);
  }

  create(data: Location): Observable<Location> {
    return this.http.post<Location>(this.apiUrl, data);
  }

  update(id: number, data: Location): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, data);
  }

  delete(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
