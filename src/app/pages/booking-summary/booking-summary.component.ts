import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { BookingService, BillResponse } from '../../services/booking.service';

@Component({
  selector: 'app-booking-summary',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './booking-summary.component.html',
  styleUrl: './booking-summary.component.css'
})
export class BookingSummaryComponent implements OnInit {
  bookingId!: number;
  bill?: BillResponse;

  constructor(
    private route: ActivatedRoute,
    private bookingService: BookingService
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.bookingId = +params['id'];
      if (this.bookingId) {
        this.loadBill();
      }
    });
  }

  loadBill() {
    this.bookingService.getBill(this.bookingId).subscribe({
      next: (res) => {
        this.bill = res;
      },
      error: (err) => {
        console.error('Error fetching bill:', err);
      }
    });
  }

  printTicket() {
    window.print();
  }
}
