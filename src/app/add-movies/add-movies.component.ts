import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { SafeUrlPipe } from '../services/safe-url.pipe';

@Component({
  selector: 'app-add-movies',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, SafeUrlPipe],
  templateUrl: './add-movies.component.html',
  styleUrl: './add-movies.component.css'
})
export class AddMoviesComponent implements OnInit {
  movieForm: FormGroup;
  movies: any[] = [];
  genres: string[] = [];
  genreInput: string = '';
  filteredGenres: string[] = [];
  allGenres: string[] = [
    'Action', 'Comedy', 'Drama', 'Horror', 'Thriller',
    'Romance', 'Sci-Fi', 'Adventure', 'Fantasy'
  ];
  isEditMode = false;
  selectedMovieId: number | null = null;
  selectedPosterFile: File | null = null;
  selectedWidePosterFile: File | null = null;

  private apiUrl = 'http://localhost:5002/api/movie';

  constructor(private fb: FormBuilder, private http: HttpClient) {
    this.movieForm = this.fb.group({
      title: ['', Validators.required],
      genre: [''],
      grade: ['', [Validators.maxLength(4)]],
      rating: [0, [Validators.min(0), Validators.max(10)]],
      hour: [0, [Validators.required, Validators.min(0)]],
      min: [0, [Validators.required, Validators.min(0), Validators.max(59)]],
      boxOffice: [0],
      budget: [0],
      releaseDate: ['', Validators.required],
      posterUrl: [''],
      widePosterUrl: [''],
      recomended: [false],
      running: [true]
    });
  }

  ngOnInit(): void {
    this.loadMovies();
  }

  onPosterFileSelected(event: any) {
    this.selectedPosterFile = event.target.files[0];
  }

  onWidePosterFileSelected(event: any) {
    this.selectedWidePosterFile = event.target.files[0];
  }

  loadMovies() {
    this.http.get<any[]>(this.apiUrl).subscribe({
      next: (res) => this.movies = res,
      error: (err) => console.error('Error loading movies', err)
    });
  }

  onInputChange() {
    const value = this.genreInput.toLowerCase();
    this.filteredGenres = this.allGenres.filter(g =>
      g.toLowerCase().includes(value) && !this.genres.includes(g)
    );
  }

  addGenre(value?: string) {
    const genre = (value || this.genreInput).trim();
    if (genre && !this.genres.includes(genre)) {
      this.genres.push(genre);
    }
    // No longer patching a string to the form, we'll use the 'genres' array directly
    this.genreInput = '';
    this.filteredGenres = [];
  }

  removeGenre(index: number) {
    this.genres.splice(index, 1);
  }

  onSubmit() {
    if (this.movieForm.invalid) {
      alert('Please fill in all required fields correctly ❌');
      return;
    }

    const formData = new FormData();
    const formValue = this.movieForm.value;

    Object.keys(formValue).forEach(key => {
        if (key === 'genre') return; // Skip the form control for genre
        
        if (key === 'releaseDate' && formValue[key]) {
            formData.append(key, new Date(formValue[key]).toISOString());
        } else {
            formData.append(key, formValue[key]);
        }
    });

    // Append each genre separately for the List<string> in backend
    this.genres.forEach(g => formData.append('genre', g));

    if (this.selectedPosterFile) {
        formData.append('poster', this.selectedPosterFile);
    }
    if (this.selectedWidePosterFile) {
        formData.append('widePoster', this.selectedWidePosterFile);
    }

    if (this.isEditMode && this.selectedMovieId) {
        formData.append('id', this.selectedMovieId.toString());
        this.http.put(`${this.apiUrl}/update/${this.selectedMovieId}`, formData)
            .subscribe({
                next: () => {
                    alert('Movie Updated ✅');
                    this.resetForm();
                    this.loadMovies();
                },
                error: (err) => alert('Update Error ❌')
            });
    } else {
        this.http.post(`${this.apiUrl}/upload`, formData)
            .subscribe({
                next: () => {
                    alert('Movie Added ✅');
                    this.resetForm();
                    this.loadMovies();
                },
                error: (err) => alert('Error ❌')
            });
    }
  }

  editMovie(movie: any) {
    this.isEditMode = true;
    this.selectedMovieId = movie.id;
    this.genres = Array.isArray(movie.genre) ? [...movie.genre] : (movie.genre ? movie.genre.split(',') : []);
    this.movieForm.patchValue({
      title: movie.title,
      genre: movie.genre,
      grade: movie.grade,
      rating: movie.rating,
      hour: movie.hour,
      min: movie.min,
      boxOffice: movie.boxOffice,
      budget: movie.budget,
      releaseDate: movie.releaseDate ? movie.releaseDate.split('T')[0] : '',
      posterUrl: movie.posterUrl,
      widePosterUrl: movie.widePosterUrl,
      recomended: movie.recomended,
      running: movie.running
    });
  }

  deleteMovie(id: number) {
    if (confirm('Are you sure you want to delete this movie?')) {
      this.http.delete(`${this.apiUrl}/${id}`).subscribe({
        next: () => {
          alert('Movie Deleted ❌');
          this.loadMovies();
        },
        error: (err) => alert('Delete Error ❌')
      });
    }
  }

  resetForm() {
    this.movieForm.reset({ hour: 0, min: 0, recomended: false, running: true });
    this.genres = [];
    this.isEditMode = false;
    this.selectedMovieId = null;
  }
}
