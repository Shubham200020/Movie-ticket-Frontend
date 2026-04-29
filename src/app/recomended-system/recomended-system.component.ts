import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Movie } from '../components/movie-card/movie-card.component';

import { SafeUrlPipe } from '../services/safe-url.pipe';

@Component({
  selector: 'app-recomended-system',
  standalone: true,
  imports: [CommonModule, SafeUrlPipe],
  templateUrl: './recomended-system.component.html',
  styleUrl: './recomended-system.component.css'
})
export class RecomendedSystemComponent implements OnInit{
  movie:any = [];
  ngOnInit(): void {
      setInterval(() => {
    this.next();
  }, 3000);
  this.loadMovies()
  }
  
    private apiUrl = 'http://localhost:5002/api/movie/recomened';
   
    constructor(private http: HttpClient,private router: Router) {
      
    }

  goToMovie(movie:any){
    this.router.navigate(['/movie', movie.id], { state: { movie } });
  }
  loadMovies() {
      this.http.get<any[]>(this.apiUrl).subscribe({
        next: (response) => {
          // Double filter on frontend to ensure immediate update and catch any caching
          this.movie = response.filter(m => m.running === true);
          console.log('Movies:', this.movie);
        },
        error: (error) => {
          console.error('Error:', error);
        }
      });
    }
currentIndex = 0;


 next() {
  this.currentIndex = (this.currentIndex + 1) % this.movie.length;
}

prev() {
  this.currentIndex =
    (this.currentIndex - 1 + this.movie.length) % this.movie.length;
}

  goToSlide(index: number) {
    this.currentIndex = index;
  }
}
