import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-add-movies',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule,FormsModule],
  templateUrl: './add-movies.component.html',
  styleUrl: './add-movies.component.css'
})
export class AddMoviesComponent {
 movieForm: FormGroup;
genres: string[] = [];
genreInput: string = '';
filteredGenres: string[] = [];
allGenres: string[] = [
  'Action', 'Comedy', 'Drama', 'Horror', 'Thriller',
  'Romance', 'Sci-Fi', 'Adventure', 'Fantasy'
];
  movie: any;
  constructor(private fb: FormBuilder, private http: HttpClient) {
    this.movieForm = this.fb.group({
   title: ['', Validators.required],
  genre: [''],
  grade: ['', [Validators.maxLength(4)]],

  hour: [0],           // ✅ FIX
  min: [0],            // ✅ FIX

  boxOffice: [null],
  budget: [null],
  releaseDate: [''],
  posterUrl: [''],
  widePosterUrl: [''],

  recomended: [false] // ✅ FIX spelling
});

    
  }
  onInputChange() {
  const value = this.genreInput.toLowerCase();

  this.filteredGenres = this.allGenres.filter(g =>
    g.toLowerCase().includes(value) &&
    !this.genres.includes(g)
  );
}

addGenre(value?: string) {
  const genre = (value || this.genreInput).trim();

  if (genre && !this.genres.includes(genre)) {
    this.genres.push(genre);
  }

  // ✅ ADD HERE
  this.movieForm.patchValue({
    genre: this.genres.join(',')
  });

  this.genreInput = '';
  this.filteredGenres = [];
}

removeGenre(index: number) {
  this.genres.splice(index, 1);

  // ✅ ADD HERE ALSO
  this.movieForm.patchValue({
    genre: this.genres.join(',')
  });
}
  
  onSubmit() {
  if (this.movieForm.valid) {

    const formValue = { ...this.movieForm.value };
  // ✅ Fix numbers
    formValue.hour = Number(formValue.hour);
    formValue.min = Number(formValue.min);
    formValue.boxOffice = Number(formValue.boxOffice);
    formValue.budget = Number(formValue.budget);

    // ✅ Fix date
    if (formValue.releaseDate) {
      formValue.releaseDate = new Date(formValue.releaseDate).toISOString();
    }

    console.log(formValue); // 🔥 Debug

    this.http.post('https://localhost:7061/api/movie', formValue)
      .subscribe({
        next: () => alert('Movie Added ✅'),
        error: (err) => {
          console.error(err); // 🔥 SEE REAL ERROR
          alert('Error ❌');
        }
      });
  }
  else {
    alert('Please fill in all required fields correctly ❌');
  }
}
}
