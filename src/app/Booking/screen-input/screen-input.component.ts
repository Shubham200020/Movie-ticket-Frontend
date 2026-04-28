import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-screen-input',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './screen-input.component.html',
  styleUrl: './screen-input.component.css'
})
export class ScreenInputComponent implements OnInit{
screenForm!: FormGroup;
  screens: any[] = [];
  theaters: any[] = [];
  isEditMode = false;
  selectedId: number | null = null;

  constructor(private fb: FormBuilder, private http: HttpClient) {}

  ngOnInit(): void {
    this.screenForm = this.fb.group({
      name: ['', Validators.required],
      capacity: ['', [Validators.required, Validators.min(1)]],
      theaterId: ['', Validators.required]
    });

    this.loadScreens();
    this.loadTheaters();
  }

  // 📥 Load Screens
  loadScreens() {
    this.http.get<any[]>('https://localhost:7061/api/screen')
      .subscribe(res => this.screens = res);
  }

  // 📥 Load Theaters
  loadTheaters() {
    this.http.get<any[]>('https://localhost:7061/api/theater')
      .subscribe(res => this.theaters = res);
  }

  // ➕ Create / ✏️ Update
  onSubmit() {
    if (this.screenForm.invalid) return;

    if (this.isEditMode) {
      this.http.put(`https://localhost:7061/api/screen/${this.selectedId}`, this.screenForm.value)
        .subscribe(() => {
          alert('Updated ✅');
          this.resetForm();
          this.loadScreens();
        });
    } else {
      this.http.post('https://localhost:7061/api/screen', this.screenForm.value)
        .subscribe(() => {
          alert('Created ✅');
          this.resetForm();
          this.loadScreens();
        });
    }
  }

  // ✏️ Edit
  editScreen(screen: any) {
    this.isEditMode = true;
    this.selectedId = screen.id;

    this.screenForm.patchValue({
      name: screen.name,
      capacity: screen.capacity,
      theaterId: screen.theaterId
    });
  }

  // ❌ Delete
  deleteScreen(id: number) {
    if (confirm('Delete this screen?')) {
      this.http.delete(`https://localhost:7061/api/screens/${id}`)
        .subscribe(() => {
          alert('Deleted ❌');
          this.loadScreens();
        });
    }
  }

  // 🔄 Reset
  resetForm() {
    this.screenForm.reset();
    this.isEditMode = false;
    this.selectedId = null;
  }
}
