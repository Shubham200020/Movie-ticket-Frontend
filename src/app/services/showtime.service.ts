import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Showtime } from '../models/models';

@Injectable({
  providedIn: 'root'
})
export class ShowtimeService {
  private apiUrl = 'http://localhost:5002/api/Showtime';

  constructor(private http: HttpClient) {}

  getShowtimes(): Observable<Showtime[]> {
    return this.http.get<Showtime[]>(this.apiUrl);
  }

  getShowtime(id: number): Observable<Showtime> {
    return this.http.get<Showtime>(`${this.apiUrl}/${id}`);
  }

  createShowtime(showtime: Showtime): Observable<Showtime> {
    return this.http.post<Showtime>(this.apiUrl, showtime);
  }

  updateShowtime(id: number, showtime: Showtime): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, showtime);
  }

  deleteShowtime(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
