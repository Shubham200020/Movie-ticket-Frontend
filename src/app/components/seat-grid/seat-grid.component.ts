import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Seat } from './Seats';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-seat-grid',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './seat-grid.component.html',
  styleUrl: './seat-grid.component.css'
})
export class SeatGridComponent {
  rows = ['A','B','C','D','E','F','G','H','I','J'];

  seats: any = {};

  selectedSeats: string[] = [];

  constructor() {
    this.generateSeats();
  }

  generateSeats() {
    this.rows.forEach(row => {
      this.seats[row] = [];

      for (let i = 1; i <= 12; i++) {
        this.seats[row].push({
          number: i,
          status: Math.random() > 0.7 ? 'sold' : 'available'
        });
      }
    });
  }

  toggleSeat(row: string, seat: any) {
    if (seat.status === 'sold') return;

    const seatId = row + seat.number;

    if (this.selectedSeats.includes(seatId)) {
      this.selectedSeats = this.selectedSeats.filter(s => s !== seatId);
    } else {
      this.selectedSeats.push(seatId);
    }
  }

  isSelected(row: string, seat: any) {
    return this.selectedSeats.includes(row + seat.number);
  }
}
