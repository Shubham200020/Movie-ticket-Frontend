import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ShowtimeService } from '../../services/showtime.service';
import { TheaterService } from '../../services/theater.service';
import { Showtime, Theater } from '../../models/models';
import { LocationService } from '../../services/location.service';

@Component({
  selector: 'app-show-selection',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './show-selection.component.html',
  styleUrl: './show-selection.component.css'
})
export class ShowSelectionComponent implements OnInit {
  movieId!: number;
  theatersWithShows: any[] = [];
  dates: Date[] = [];
  selectedDate: Date = new Date();
  allMovieShows: Showtime[] = [];
  allTheaters: Theater[] = [];

  currentCity: string = '';
  currentArea: string = '';

  sortBy: 'location' | 'time' = 'location';
  userLat?: number;
  userLng?: number;
  gpsActive = false;

  constructor(
    private route: ActivatedRoute,
    private showtimeService: ShowtimeService,
    private theaterService: TheaterService,
    private locationService: LocationService
  ) {}

  ngOnInit(): void {
    this.generateDates();
    this.initLocation();
    
    this.locationService.currentCity$.subscribe(city => {
      this.currentCity = city;
      this.filterShows();
    });
    this.locationService.currentArea$.subscribe(area => {
      this.currentArea = area;
      this.filterShows();
    });
    this.route.params.subscribe(params => {
      this.movieId = +params['id'];
      this.loadData();
    });
  }

  initLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          this.userLat = pos.coords.latitude;
          this.userLng = pos.coords.longitude;
          this.gpsActive = true;
          this.filterShows();
        },
        (err) => {
          console.warn('GPS denied or unavailable, falling back to time sorting');
          this.sortBy = 'time';
          this.gpsActive = false;
          this.filterShows();
        }
      );
    } else {
      this.sortBy = 'time';
      this.filterShows();
    }
  }

  setSortMode(mode: 'location' | 'time') {
    this.sortBy = mode;
    if (mode === 'location' && !this.gpsActive) {
      this.initLocation();
    }
    this.filterShows();
  }

  generateDates() {
    const today = new Date();
    for (let i = 0; i < 7; i++) {
      const d = new Date();
      d.setDate(today.getDate() + i);
      this.dates.push(d);
    }
    this.selectedDate = this.dates[0];
  }

  selectDate(date: Date) {
    this.selectedDate = date;
    this.filterShows();
  }

  async loadData() {
    this.showtimeService.getShowtimes().subscribe(async allShows => {
      this.allMovieShows = allShows.filter(s => s.movieId === this.movieId);
      this.theaterService.getAll().subscribe(async theaters => {
        // Fetch real coordinates for all theaters
        for (let t of theaters) {
          const coords = await this.locationService.getTheaterCoordinates(t);
          if (coords) {
            t.lat = coords.lat;
            t.lng = coords.lon;
          }
        }
        this.allTheaters = theaters;
        this.filterShows();
      });
    });
  }

  filterShows() {
    const now = new Date();
    const gracePeriod = 5 * 60 * 1000;

    const filteredShows = this.allMovieShows.filter(s => {
      const showDate = new Date(s.startTime);
      const isSameDay = showDate.toDateString() === this.selectedDate.toDateString();
      if (!isSameDay) return false;
      if (showDate.toDateString() === now.toDateString()) {
        return (showDate.getTime() + gracePeriod) > now.getTime();
      }
      return true;
    });

    const cityLower = this.currentCity.toLowerCase();
    
    // Process all theaters with their shows
    let processedTheaters = this.allTheaters.map(t => {
      const theaterShows = filteredShows.filter(s => s.screen?.theaterId === t.id);
      
      // Calculate distance if GPS is active
      let dist = undefined;
      if (this.gpsActive && this.userLat && this.userLng && t.lat && t.lng) {
        dist = this.calculateDistance(this.userLat, this.userLng, t.lat, t.lng);
      }

      // Find earliest show time
      const earliestShow = theaterShows.length > 0 
        ? Math.min(...theaterShows.map(s => new Date(s.startTime).getTime()))
        : Infinity;

      return { 
        ...t, 
        shows: theaterShows, 
        distance: dist,
        earliestShow,
        isNearby: t.location?.city?.toLowerCase() !== cityLower 
      };
    }).filter(t => t.shows.length > 0);

    // Apply Sorting
    if (this.sortBy === 'location' && this.gpsActive) {
      processedTheaters.sort((a, b) => (a.distance || Infinity) - (b.distance || Infinity));
    } else {
      // Sort by earliest show time
      processedTheaters.sort((a, b) => a.earliestShow - b.earliestShow);
    }

    this.theatersWithShows = processedTheaters;
  }

  calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371; // Radius of the earth in km
    const dLat = this.deg2rad(lat2 - lat1);
    const dLon = this.deg2rad(lon2 - lon1);
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(this.deg2rad(lat1)) * Math.cos(this.deg2rad(lat2)) * 
      Math.sin(dLon/2) * Math.sin(dLon/2)
      ; 
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
    return R * c; // Distance in km
  }

  deg2rad(deg: number): number {
    return deg * (Math.PI/180);
  }

  isSameDate(d1: Date, d2: Date): boolean {
    return d1.toDateString() === d2.toDateString();
  }
}
