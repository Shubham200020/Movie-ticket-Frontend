import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ShowtimeService } from '../../services/showtime.service';
import { ScreenService } from '../../services/screen.service';
import { BookingService, CreateBookingDto } from '../../services/booking.service';
import { AuthService } from '../../services/auth.service';
import { Showtime, Screen, Seat } from '../../models/models';

@Component({
  selector: 'app-seat-grid',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './seat-grid.component.html',
  styleUrl: './seat-grid.component.css'
})
export class SeatGridComponent implements OnInit {
  showtimeId!: number;
  showtime?: Showtime;
  screen?: Screen;
  rows: string[] = [];
  seatsByRow: { [key: string]: any[] } = {};
  selectedSeats: number[] = []; // Store seat IDs
  bookedSeatIds: number[] = [];

  constructor(
    private route: ActivatedRoute,
    public router: Router,
    private showtimeService: ShowtimeService,
    private screenService: ScreenService,
    private bookingService: BookingService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.showtimeId = +params['id'];
      this.loadData();
    });
  }

  loadData() {
    this.showtimeService.getShowtime(this.showtimeId).subscribe(show => {
      this.showtime = show;
      this.bookedSeatIds = this.extractBookedSeats(show);
      
      this.screenService.getScreen(show.screenId).subscribe(screen => {
        this.screen = screen;
        this.organizeSeats(screen.seats || []);
      });
    });
  }

  extractBookedSeats(show: any): number[] {
    const booked: number[] = [];
    if (show.bookings) {
      show.bookings.forEach((b: any) => {
        if (b.selectedSeats) {
          b.selectedSeats.forEach((ss: any) => booked.push(ss.seatId));
        }
      });
    }
    return booked;
  }

  organizeSeats(seats: Seat[]) {
    const rowSet = new Set<string>();
    this.seatsByRow = {};

    seats.sort((a, b) => a.number - b.number).forEach(seat => {
      rowSet.add(seat.row);
      if (!this.seatsByRow[seat.row]) {
        this.seatsByRow[seat.row] = [];
      }
      this.seatsByRow[seat.row].push({
        id: seat.id,
        number: seat.number,
        type: seat.seatType,
        status: this.bookedSeatIds.includes(seat.id) ? 'sold' : 'available'
      });
    });

    this.rows = Array.from(rowSet).sort();
  }

  getTotalPrice(): number {
    if (!this.showtime) return 0;
    let total = 0;
    this.selectedSeats.forEach(id => {
      const seat = this.findSeatById(id);
      if (seat) {
        total += this.getSeatPrice(seat.seatType);
      }
    });
    return total;
  }

  getSeatPrice(type: string): number {
    const base = this.showtime?.basePrice || 0;
    switch (type?.toLowerCase()) {
      case 'platinum': return base * 2.0;
      case 'gold': return base * 1.5;
      default: return base;
    }
  }

  findSeatById(id: number) {
    for (const row in this.seatsByRow) {
      const seat = this.seatsByRow[row].find(s => s.id === id);
      if (seat) return seat;
    }
    return null;
  }

  toggleSeat(seat: any) {
    if (seat.status === 'sold') return;

    const index = this.selectedSeats.indexOf(seat.id);
    if (index > -1) {
      this.selectedSeats.splice(index, 1);
    } else {
      this.selectedSeats.push(seat.id);
    }
  }

  isSelected(seatId: number) {
    return this.selectedSeats.includes(seatId);
  }

  confirmBooking() {
    const user = this.authService.getUser();
    if (!user) {
      alert('Please login to book tickets');
      this.router.navigate(['/login']);
      return;
    }

    if (this.selectedSeats.length === 0) {
      alert('Please select at least one seat');
      return;
    }

    const bookingData: CreateBookingDto = {
      userId: user.id,
      showtimeId: this.showtimeId,
      seatIds: this.selectedSeats
    };

    this.bookingService.createBooking(bookingData).subscribe({
      next: (res) => {
        alert('Booking Successful ✅');
        this.router.navigate(['/summary'], { queryParams: { id: res.id } });
      },
      error: (err) => {
        alert('Booking Failed ❌: ' + (err.error || 'Server Error'));
      }
    });
  }
}
