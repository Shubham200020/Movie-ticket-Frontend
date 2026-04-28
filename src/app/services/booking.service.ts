import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Booking } from '../models/models';

export interface CreateBookingDto {
  userId: number;
  showtimeId: number;
  seatIds: number[];
}

export interface BillResponse {
  bookingId: number;
  movieTitle: string;
  screenName: string;
  theaterName: string;
  showtime: string;
  seats: string[];
  basePrice: number;
  seatCount: number;
  totalAmount: number;
  status: string;
  bookingTime: string;
  userName: string;
}

@Injectable({
  providedIn: 'root'
})
export class BookingService {
  private apiUrl = 'https://localhost:7061/api/Booking';

  constructor(private http: HttpClient) {}

  getBookings(): Observable<Booking[]> {
    return this.http.get<Booking[]>(this.apiUrl);
  }

  getBill(bookingId: number): Observable<BillResponse> {
    return this.http.get<BillResponse>(`${this.apiUrl}/${bookingId}`);
  }

  createBooking(bookingData: CreateBookingDto): Observable<any> {
    return this.http.post<any>(this.apiUrl, bookingData);
  }
}
