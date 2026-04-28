import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Seat } from '../models/models';

@Injectable({
  providedIn: 'root'
})
export class SeatService {
  private apiUrl = 'https://localhost:7061/api/Seats';

  constructor(private http: HttpClient) {}

  getSeatsByScreen(screenId: number): Observable<Seat[]> {
    return this.http.get<Seat[]>(`${this.apiUrl}/screen/${screenId}`);
  }

  createSeat(seat: Seat): Observable<Seat> {
    return this.http.post<Seat>(this.apiUrl, seat);
  }
}
