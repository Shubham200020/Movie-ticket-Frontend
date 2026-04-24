import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { ShowCardComponent } from "../show-card/show-card.component";
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
  imports: [CommonModule, ShowCardComponent],
  templateUrl: './movie-card.component.html',
  styleUrl: './movie-card.component.css'
})

export class MovieCardComponent {
  id:number=0;
  indicator:boolean=false;
  

  private apiUrl = 'https://localhost:7061/api/movie';
  movie:any = [];
  constructor(private http: HttpClient,private router: Router) {
    this.loadMovies();
  }
  goToMovie(id:any){
  this.router.navigate(['/movie', id]);

  }
nextCompnent(data:any){
  this.id=data
this.indicator=!this.indicator
  
}
 
   loadMovies() {
    this.http.get<Movie>(this.apiUrl).subscribe({
      next: (response) => {
        this.movie = response;   // ✅ storing API data here
        console.log('Movies:', this.movie);
      },
      error: (error) => {
        console.error('Error:', error);
      }
    });
  }


}
