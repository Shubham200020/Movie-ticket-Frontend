import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Review } from '../models/models';

@Injectable({
  providedIn: 'root'
})
export class ReviewService {
  private apiUrl = 'http://localhost:5002/api/Review';

  constructor(private http: HttpClient) { }

  getMovieReviews(movieId: number): Observable<Review[]> {
    return this.http.get<Review[]>(`${this.apiUrl}/movie/${movieId}`);
  }

  postReview(review: Review): Observable<Review> {
    return this.http.post<Review>(this.apiUrl, review);
  }

  deleteReview(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
