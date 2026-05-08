import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { ShowtimeService } from '../../services/showtime.service';
import { Showtime, Theater, AppLocation } from '../../models/models';
import { TheaterService } from '../../services/theater.service';
import { LocationService } from '../../services/location.service';

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
  
  // Selection Data
  locations: AppLocation[] = [];
  allTheaters: Theater[] = [];
  allScreens: any[] = [];
  
  // Cascading Lists
  states: string[] = [];
  cities: string[] = [];
  filteredTheaters: Theater[] = [];
  filteredScreens: any[] = [];

  isEditMode = false;
  selectedId: number | null = null;

  constructor(
    private fb: FormBuilder,
    private showtimeService: ShowtimeService,
    private theaterService: TheaterService,
    private locationService: LocationService,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.showtimeForm = this.fb.group({
      startTime: ['', Validators.required],
      endTime: ['', Validators.required],
      movieId: ['', Validators.required],
      screenId: ['', Validators.required],
      // Selection helpers
      state: [''],
      city: [''],
      theaterId: ['']
    });

    this.loadShowtimes();
    this.loadMovies();
    this.loadInitialData();

    // Listen for changes to auto-calculate end time
    this.showtimeForm.get('startTime')?.valueChanges.subscribe(() => this.calculateEndTime());
    this.showtimeForm.get('movieId')?.valueChanges.subscribe(() => this.calculateEndTime());
    
    // Cascading listeners
    this.showtimeForm.get('state')?.valueChanges.subscribe(val => this.onStateChange(val));
    this.showtimeForm.get('city')?.valueChanges.subscribe(val => this.onCityChange(val));
    this.showtimeForm.get('theaterId')?.valueChanges.subscribe(val => this.onTheaterChange(val));
  }

  loadInitialData() {
    this.locationService.getAll().subscribe(res => {
      this.locations = res;
      // Normalize states: lowercase for unique set, then capitalize
      this.states = [...new Set(res.map(l => l.state.trim().toLowerCase()))]
        .map(s => s.charAt(0).toUpperCase() + s.slice(1))
        .sort();
    });

    this.theaterService.getAll().subscribe(res => {
      this.allTheaters = res;
    });

    this.http.get<any[]>('http://localhost:5002/api/screen').subscribe(res => {
      this.allScreens = res;
    });
  }

  onStateChange(state: string) {
    const stateLower = state.toLowerCase();
    this.cities = [...new Set(this.locations
      .filter(l => l.state.toLowerCase() === stateLower)
      .map(l => l.city.trim().toLowerCase()))]
      .map(c => c.charAt(0).toUpperCase() + c.slice(1))
      .sort();
    
    this.showtimeForm.patchValue({ city: '', theaterId: '', screenId: '' }, { emitEvent: false });
    this.filteredTheaters = [];
    this.filteredScreens = [];
  }

  onCityChange(city: string) {
    const state = (this.showtimeForm.get('state')?.value || '').toLowerCase();
    const cityLower = (city || '').toLowerCase();
    
    this.filteredTheaters = this.allTheaters.filter(t => 
      t.location?.state?.toLowerCase() === state && 
      t.location?.city?.toLowerCase() === cityLower
    );
    
    this.showtimeForm.patchValue({ theaterId: '', screenId: '' }, { emitEvent: false });
    this.filteredScreens = [];
  }

  onTheaterChange(theaterId: string) {
    this.filteredScreens = this.allScreens.filter(s => s.theaterId === +theaterId);
    this.showtimeForm.patchValue({ screenId: '' }, { emitEvent: false });
  }

  loadShowtimes() {
    this.showtimeService.getShowtimes().subscribe(res => this.showtimes = res);
  }

  loadMovies() {
    this.http.get<any[]>('http://localhost:5002/api/Movie').subscribe(res => this.movies = res);
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

  calculateEndTime() {
    const startTime = this.showtimeForm.get('startTime')?.value;
    const movieId = this.showtimeForm.get('movieId')?.value;

    if (startTime && movieId) {
      const movie = this.movies.find(m => m.id === +movieId);
      if (movie) {
        // Calculate total duration in minutes
        const durationMinutes = (movie.hour || 0) * 60 + (movie.min || 0);
        
        if (durationMinutes > 0) {
          const start = new Date(startTime);
          const end = new Date(start.getTime() + durationMinutes * 60000);

          // Format to YYYY-MM-DDTHH:mm for datetime-local input
          const year = end.getFullYear();
          const month = String(end.getMonth() + 1).padStart(2, '0');
          const day = String(end.getDate()).padStart(2, '0');
          const hours = String(end.getHours()).padStart(2, '0');
          const minutes = String(end.getMinutes()).padStart(2, '0');

          const endStr = `${year}-${month}-${day}T${hours}:${minutes}`;
          
          this.showtimeForm.patchValue({ endTime: endStr }, { emitEvent: false });
        }
      }
    }
  }

  resetForm() {
    this.showtimeForm.reset();
    this.isEditMode = false;
    this.selectedId = null;
  }
}
