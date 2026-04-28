import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ShowtimeService } from '../../services/showtime.service';
import { TheaterService } from '../../services/theater.service';
import { Showtime, Theater } from '../../models/models';

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

  constructor(
    private route: ActivatedRoute,
    private showtimeService: ShowtimeService,
    private theaterService: TheaterService
  ) {}

  ngOnInit(): void {
    this.generateDates();
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
    const filteredShows = this.allMovieShows.filter(s => {
      const showDate = new Date(s.startTime);
      return showDate.toDateString() === this.selectedDate.toDateString();
    });

    this.theatersWithShows = this.allTheaters.map(t => {
      const theaterShows = filteredShows.filter(s => s.screen?.theaterId === t.id);
      return {
        ...t,
        shows: theaterShows
      };
    }).filter(t => t.shows.length > 0);
  }

  isSameDate(d1: Date, d2: Date): boolean {
    return d1.toDateString() === d2.toDateString();
  }
}
