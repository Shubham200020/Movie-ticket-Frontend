import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-seats-input',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './seats-input.component.html',
  styleUrl: './seats-input.component.css'
})
export class SeatsInputComponent implements OnInit {
   @Input() totalRows: number = 5;
  @Input() seatsPerRow: number = 10;
  @Input() bookedSeats: string[] = ['A1', 'A2', 'B5'];

  seatGrid: string[][] = [];
  selectedSeats: string[] = [];
  pricePerSeat: number = 200;

  ngOnInit() {
    this.generateSeats();
  }

  generateSeats() {
    const rows = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

    for (let i = 0; i < this.totalRows; i++) {
      const row: string[] = [];
      for (let j = 1; j <= this.seatsPerRow; j++) {
        row.push(`${rows[i]}${j}`);
      }
      this.seatGrid.push(row);
    }
  }

  isBooked(seat: string): boolean {
    return this.bookedSeats.includes(seat);
  }

  isSelected(seat: string): boolean {
    return this.selectedSeats.includes(seat);
  }

  toggleSeat(seat: string) {
    if (this.isBooked(seat)) return;

    if (this.isSelected(seat)) {
      this.selectedSeats = this.selectedSeats.filter(s => s !== seat);
    } else {
      this.selectedSeats.push(seat);
    }
  }

  get totalPrice(): number {
    return this.selectedSeats.length * this.pricePerSeat;
  }

  confirmBooking() {
    if (this.selectedSeats.length === 0) {
      alert('No seats selected ❌');
      return;
    }

    alert(`Booking Confirmed ✅\nSeats: ${this.selectedSeats.join(', ')}`);

    // Example API call (optional)
    // this.http.post('/api/book', this.selectedSeats).subscribe()

    this.selectedSeats = [];
  }

}
