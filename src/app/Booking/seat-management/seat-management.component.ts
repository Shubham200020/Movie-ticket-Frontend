import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { TheaterService } from '../../services/theater.service';
import { ScreenService } from '../../services/screen.service';
import { Theater, Screen, Seat } from '../../models/models';

@Component({
  selector: 'app-seat-management',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './seat-management.component.html',
  styleUrl: './seat-management.component.css'
})
export class SeatManagementComponent implements OnInit {
  theaters: Theater[] = [];
  screens: Screen[] = [];
  selectedTheaterId: number | null = null;
  selectedScreenId: number | null = null;
  
  rowLetter: string = 'A';
  startNumber: number = 1;
  endNumber: number = 10;
  seatType: string = 'Silver';
  price: number = 100;
  
  existingSeats: Seat[] = [];
  isLoading = false;

  private seatApiUrl = 'http://localhost:5002/api/Seats';

  constructor(
    private theaterService: TheaterService,
    private screenService: ScreenService,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.loadTheaters();
  }

  loadTheaters() {
    this.theaterService.getAll().subscribe(res => this.theaters = res);
  }

  onTheaterChange() {
    this.selectedScreenId = null;
    this.existingSeats = [];
    if (this.selectedTheaterId) {
      this.screenService.getAll().subscribe(res => {
        this.screens = res.filter(s => s.theaterId == this.selectedTheaterId);
      });
    }
  }

  onScreenChange() {
    if (this.selectedScreenId) {
      this.loadExistingSeats();
    } else {
      this.existingSeats = [];
    }
  }

  loadExistingSeats() {
    this.isLoading = true;
    this.http.get<Seat[]>(`${this.seatApiUrl}/screen/${this.selectedScreenId}`).subscribe({
      next: (res) => {
        this.existingSeats = res.sort((a, b) => {
          if (a.row < b.row) return -1;
          if (a.row > b.row) return 1;
          return a.number - b.number;
        });
        this.isLoading = false;
      },
      error: () => this.isLoading = false
    });
  }

  generateSeats() {
    if (!this.selectedScreenId) {
      alert('Please select a screen first ❌');
      return;
    }

    const dto = {
      screenId: Number(this.selectedScreenId),
      row: this.rowLetter.toUpperCase(),
      startNumber: this.startNumber,
      endNumber: this.endNumber,
      seatType: this.seatType,
      price: this.price
    };

    this.http.post(`${this.seatApiUrl}/bulk`, dto).subscribe({
      next: () => {
        alert(`Seats for Row ${dto.row} Generated ✅`);
        this.loadExistingSeats();
      },
      error: (err) => {
        const errorMsg = typeof err.error === 'object' ? JSON.stringify(err.error) : err.error;
        alert('Error generating seats ❌: ' + (errorMsg || 'Server error'));
      }
    });
  }

  deleteAllSeats() {
    if (!this.selectedScreenId) return;
    if (confirm('Are you sure you want to delete ALL seats for this screen?')) {
      this.http.delete(`${this.seatApiUrl}/screen/${this.selectedScreenId}`).subscribe({
        next: () => {
          alert('All seats deleted ❌');
          this.loadExistingSeats();
        },
        error: (err) => alert('Delete error ❌')
      });
    }
  }
}
