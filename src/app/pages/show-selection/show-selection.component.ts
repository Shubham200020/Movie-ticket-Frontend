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

  constructor(
    private route: ActivatedRoute,
    private showtimeService: ShowtimeService,
    private theaterService: TheaterService,
    private locationService: LocationService
  ) {}

  ngOnInit(): void {
    this.generateDates();
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

  loadData() {
    this.showtimeService.getShowtimes().subscribe(allShows => {
      this.allMovieShows = allShows.filter(s => s.movieId === this.movieId);
      this.theaterService.getAll().subscribe(theaters => {
        this.allTheaters = theaters;
        this.filterShows();
      });
    });
  }

  filterShows() {
    const now = new Date();
    const gracePeriod = 5 * 60 * 1000; // 5 minutes grace in milliseconds

    const filteredShows = this.allMovieShows.filter(s => {
      const showDate = new Date(s.startTime);
      const isSameDay = showDate.toDateString() === this.selectedDate.toDateString();
      
      if (!isSameDay) return false;

      // If the show is today, hide it if it started more than 5 minutes ago
      if (showDate.toDateString() === now.toDateString()) {
        return (showDate.getTime() + gracePeriod) > now.getTime();
      }

      return true;
    });

    const cityLower = this.currentCity.toLowerCase();
    const areaLower = this.currentArea.toLowerCase();
    
    // Split into current city and others
    let inCityTheaters = this.allTheaters.filter(t => t.location?.city?.toLowerCase() === cityLower);
    const otherTheaters = this.allTheaters.filter(t => t.location?.city?.toLowerCase() !== cityLower);

    // Sort theaters in the same city based on area proximity
    if (areaLower) {
      inCityTheaters = inCityTheaters.sort((a, b) => {
        const locA = a.location?.location?.toLowerCase().trim() || '';
        const locB = b.location?.location?.toLowerCase().trim() || '';
        
        const matchA = locA.includes(areaLower) || areaLower.includes(locA);
        const matchB = locB.includes(areaLower) || areaLower.includes(locB);

        if (matchA && !matchB) return -1;
        if (!matchA && matchB) return 1;
        return 0;
      });
    }

    // Map and filter current city theaters
    const inCityWithShows = inCityTheaters.map(t => {
      const theaterShows = filteredShows.filter(s => s.screen?.theaterId === t.id);
      return { ...t, shows: theaterShows, isNearby: false };
    }).filter(t => t.shows.length > 0);

    // Map and filter other city theaters
    const othersWithShows = otherTheaters.map(t => {
      const theaterShows = filteredShows.filter(s => s.screen?.theaterId === t.id);
      return { ...t, shows: theaterShows, isNearby: true };
    }).filter(t => t.shows.length > 0);

    // Combine them (matched city & area first)
    this.theatersWithShows = [...inCityWithShows, ...othersWithShows];
  }

  isSameDate(d1: Date, d2: Date): boolean {
    return d1.toDateString() === d2.toDateString();
  }
}
