import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { ShowtimeService } from '../../services/showtime.service';
import { Showtime } from '../../models/models';

@Component({
  selector: 'app-showtime-input',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './showtime-input.component.html',
  styleUrl: './showtime-input.component.css'
})
export class ShowtimeInputComponent implements OnInit {
  showtimeForm!: FormGroup;
  showtimes: Showtime[] = [];
  movies: any[] = [];
  screens: any[] = [];
  isEditMode = false;
  selectedId: number | null = null;

  constructor(
    private fb: FormBuilder,
    private showtimeService: ShowtimeService,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.showtimeForm = this.fb.group({
      startTime: ['', Validators.required],
      endTime: ['', Validators.required],
      movieId: ['', Validators.required],
      screenId: ['', Validators.required]
    });

    this.loadShowtimes();
    this.loadMovies();
    this.loadScreens();
  }

  loadShowtimes() {
    this.showtimeService.getShowtimes().subscribe(res => this.showtimes = res);
  }

  loadMovies() {
    this.http.get<any[]>('http://localhost:5002/api/Movie').subscribe(res => this.movies = res);
  }

  loadScreens() {
    this.http.get<any[]>('http://localhost:5002/api/screen').subscribe(res => this.screens = res);
  }

  onSubmit() {
    if (this.showtimeForm.invalid) return;

    const data = this.showtimeForm.value;

    if (this.isEditMode && this.selectedId) {
      this.showtimeService.updateShowtime(this.selectedId, { ...data, id: this.selectedId })
        .subscribe(() => {
          alert('Showtime Updated ✅');
          this.resetForm();
          this.loadShowtimes();
        });
    } else {
      this.showtimeService.createShowtime(data)
        .subscribe(() => {
          alert('Showtime Created ✅');
          this.resetForm();
          this.loadShowtimes();
        });
    }
  }

  editShowtime(showtime: Showtime) {
    this.isEditMode = true;
    this.selectedId = showtime.id!;
    
    // Format dates to YYYY-MM-DDTHH:mm for datetime-local input
    const start = showtime.startTime ? new Date(showtime.startTime).toISOString().slice(0, 16) : '';
    const end = showtime.endTime ? new Date(showtime.endTime).toISOString().slice(0, 16) : '';

    this.showtimeForm.patchValue({
      startTime: start,
      endTime: end,
      movieId: showtime.movieId,
      screenId: showtime.screenId
    });
  }

  deleteShowtime(id: number) {
    if (confirm('Are you sure you want to delete this showtime?')) {
      this.showtimeService.deleteShowtime(id).subscribe({
        next: () => {
          alert('Showtime Deleted ❌');
          this.loadShowtimes();
        },
        error: (err) => {
          console.error(err);
          alert('Error deleting showtime. It might have active bookings.');
        }
      });
    }
  }

  resetForm() {
    this.showtimeForm.reset();
    this.isEditMode = false;
    this.selectedId = null;
  }
}
