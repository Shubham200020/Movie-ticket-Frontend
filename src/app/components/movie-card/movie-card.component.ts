import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { ShowCardComponent } from "../show-card/show-card.component";
import { SafeUrlPipe } from '../../services/safe-url.pipe';
export interface Movie {
  id: number;
  title: string;
  genre: string[];
  hour: number;
  min: number;
  releaseDate: string;
  posterUrl: string;
  widePosterUrl: string;
}
@Component({
  selector: 'app-movie-card',
  standalone: true,
  imports: [CommonModule, ShowCardComponent, SafeUrlPipe],
  templateUrl: './movie-card.component.html',
  styleUrl: './movie-card.component.css'
})

export class MovieCardComponent {
  id:number=0;
  indicator:boolean=false;
  

  private apiUrl = 'http://localhost:5002/api/movie';
  movie:any = [];
  constructor(private http: HttpClient,private router: Router) {
    this.loadMovies();
  }
  goToMovie(movie:any){
    this.router.navigate(['/movie', movie.id], { state: { movie } });
  }
nextCompnent(data:any){
  this.id=data
this.indicator=!this.indicator
  
}
 
   loadMovies() {
    this.http.get<any[]>(this.apiUrl).subscribe({
      next: (response) => {
        this.movie = response.filter(m => m.running === true);
        console.log('Movies:', this.movie);
      },
      error: (error) => {
        console.error('Error:', error);
      }
    });
  }


}
