import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SeatGridComponent } from "../seat-grid/seat-grid.component";
import { ShowSelectionComponent } from "../../pages/show-selection/show-selection.component";
import { RecomendedSystemComponent } from "../../recomended-system/recomended-system.component";
import { SafeUrlPipe } from '../../services/safe-url.pipe';
import { ReviewService } from '../../services/review.service';
import { AuthService } from '../../services/auth.service';
import { Review } from '../../models/models';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-show-card',
  standalone: true,
  imports: [CommonModule, SeatGridComponent, ShowSelectionComponent, RecomendedSystemComponent, SafeUrlPipe, FormsModule],
  templateUrl: './show-card.component.html',
  styleUrl: './show-card.component.css'
})
export class ShowCardComponent {
  indication:boolean=false;
  id: number=0;
  reviews: Review[] = [];
  newReview: Review = { movieId: 0, rating: 5, comment: '' };
  showReviewForm: boolean = false;
  hoverRating: number = 0;
  isSubmitting: boolean = false;
  showSuccess: boolean = false;
  user: any;
  data: any;

  constructor(
    private http:HttpClient, 
    private router:Router, 
    private route:ActivatedRoute,
    private reviewService: ReviewService,
    private authService: AuthService
  ) {
    this.authService.user$.subscribe(u => this.user = u);
  }
 
  ngOnInit (){
       this.id = Number(this.route.snapshot.paramMap.get('id'));
       this.newReview.movieId = this.id;

       // Check if movie data was passed internally via router state
       const state = window.history.state;
       if (state && state.movie && state.movie.id === this.id) {
         this.data = state.movie;
         console.log('Using pre-loaded movie data:', this.data);
       } else {
         this.loadMovies();
       }
       
       this.loadReviews();
  }

  loadReviews() {
    this.reviewService.getMovieReviews(this.id).subscribe(res => {
      this.reviews = res;
    });
  }

  toggleReviewForm() {
    if (!this.user) {
      this.router.navigate(['/login']);
      return;
    }
    this.showReviewForm = !this.showReviewForm;
  }

  setRating(rating: number) {
    this.newReview.rating = Math.round(rating * 10) / 10; // Round to 1 decimal
  }

  onMouseMoveStar(event: MouseEvent) {
    if (this.isSubmitting) return;
    const target = event.currentTarget as HTMLElement;
    const rect = target.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const percent = x / rect.width;
    
    // Calculate rating based on which star and where inside it
    // But since we are mapping over stars, it's easier to just use the row container
  }

  // Improved fractional logic
  updateHoverRating(event: MouseEvent) {
    const container = event.currentTarget as HTMLElement;
    const rect = container.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const totalWidth = rect.width;
    const rawRating = (x / totalWidth) * 5;
    this.hoverRating = Math.round(rawRating * 10) / 10;
    if (this.hoverRating < 1.0) this.hoverRating = 1.0;
    if (this.hoverRating > 5) this.hoverRating = 5;
  }

  submitReview() {
    if (!this.user || this.isSubmitting) return;
    this.isSubmitting = true;
    
    if (this.user.role === 'admin') {
      this.newReview.adminId = this.user.id;
      delete this.newReview.userId;
    } else {
      this.newReview.userId = this.user.id;
      delete this.newReview.adminId;
    }
    
    // Simulate "analysis" delay for premium feel
    setTimeout(() => {
      this.reviewService.postReview(this.newReview).subscribe({
        next: () => {
          this.loadReviews();
          this.loadMovies(); // Refresh movie rating
          this.showSuccess = true;
          this.isSubmitting = false;
          
          // Hide success and modal after delay
          setTimeout(() => {
            this.showReviewForm = false;
            this.showSuccess = false;
            this.newReview.comment = '';
            this.newReview.rating = 5;
            delete this.newReview.id; // clear id for next review
          }, 2000);
        },
        error: (err) => {
          console.error("Review error:", err);
          let errorMsg = "Unknown error";
          if (err.error) {
            errorMsg = typeof err.error === 'string' ? err.error : JSON.stringify(err.error);
          }
          alert("Failed to submit review: " + errorMsg);
          this.isSubmitting = false;
        }
      });
    }, 1500);
  }

  isOwner(review: Review): boolean {
    if (!this.user) return false;
    if (this.user.role === 'admin') {
      return review.adminId === this.user.id;
    } else {
      return review.userId === this.user.id;
    }
  }

  hasUserReviewed(): boolean {
    if (!this.user) return false;
    return this.reviews.some(r => this.isOwner(r));
  }

  editReview(review: Review) {
    this.newReview = { ...review };
    this.hoverRating = review.rating;
    this.showReviewForm = true;
  }

  deleteReview(id: number | undefined) {
    if (!id) return;
    if (confirm('Are you sure you want to delete your review?')) {
      this.reviewService.deleteReview(id).subscribe({
        next: () => {
          this.loadReviews();
          this.loadMovies(); // Refresh movie rating
        },
        error: (err) => console.error('Error deleting review', err)
      });
    }
  }

  loadMovies() {
    this.http.get('http://localhost:5002/api/movie/'+this.id).subscribe({
      next: (response) => {
        this.data = response;  
        console.log('Movies:', this.data);
      },
      error: (error) => {
        console.error('Error:', error);
      }
    });
  }

  routers() {
    this.indication = true;
  }
}
