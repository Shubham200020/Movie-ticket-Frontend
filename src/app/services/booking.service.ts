import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Booking } from '../models/models';

export interface CreateBookingDto {
  userId?: number;
  adminId?: number;
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
  private apiUrl = 'http://localhost:5002/api/Booking';

  constructor(private http: HttpClient) {}

  getBookings(): Observable<Booking[]> {
    return this.http.get<Booking[]>(this.apiUrl);
  }

  getBill(bookingId: number): Observable<BillResponse> {
    return this.http.get<any>(`${this.apiUrl}/${bookingId}`).pipe(
      map(raw => ({
        bookingId: raw.id,
        movieTitle: raw.showtime?.movie?.title || 'Unknown Movie',
        screenName: raw.showtime?.screen?.name || 'Unknown Screen',
        theaterName: raw.showtime?.screen?.theater?.name || 'Unknown Theater',
        showtime: raw.showtime?.startTime,
        seats: raw.selectedSeats?.map((s: any) => `${s.seat?.row}${s.seat?.number}`) || [],
        seatCount: raw.selectedSeats?.length || 0,
        totalAmount: raw.totalAmount,
        status: raw.status,
        bookingTime: raw.bookingTime,
        userName: raw.user?.name || raw.admin?.name || 'Guest User'
      }))
    );
  }

  createBooking(bookingData: CreateBookingDto): Observable<any> {
    return this.http.post<any>(this.apiUrl, bookingData);
  }
}
