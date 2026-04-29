import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-screen-input',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './screen-input.component.html',
  styleUrl: './screen-input.component.css'
})
export class ScreenInputComponent implements OnInit{
screenForm!: FormGroup;
  screens: any[] = [];
  theaters: any[] = [];
  locations: any[] = [];
  isEditMode = false;
  selectedId: number | null = null;
  filterState: string = '';
  filterCity: string = '';
  filterTheaterId: string = '';

  constructor(private fb: FormBuilder, private http: HttpClient) {}

  ngOnInit(): void {
    this.screenForm = this.fb.group({
      name: ['', Validators.required],
      capacity: ['', [Validators.required, Validators.min(1)]],
      screenType: ['2D', Validators.required],
      theaterId: ['', Validators.required]
    });

    this.loadScreens();
    this.loadTheaters();
    this.loadLocations();
  }

  capitalize(str: string): string {
    if (!str) return '';
    return str.trim().charAt(0).toUpperCase() + str.trim().slice(1).toLowerCase();
  }

  get uniqueStates() {
    return [...new Set(this.locations.map(loc => this.capitalize(loc.state)))].filter(Boolean);
  }

  get availableCities() {
    let locs = this.locations;
    if (this.filterState) {
      locs = locs.filter(l => this.capitalize(l.state) === this.filterState);
    }
    return [...new Set(locs.map(loc => this.capitalize(loc.city)))].filter(Boolean);
  }

  get availableTheaters() {
    let filtered = this.theaters;
    if (this.filterCity) {
      const validLocIds = this.locations.filter(l => this.capitalize(l.city) === this.filterCity).map(l => l.id);
      filtered = filtered.filter(t => validLocIds.includes(t.locationId));
    } else if (this.filterState) {
      const validLocIds = this.locations.filter(l => this.capitalize(l.state) === this.filterState).map(l => l.id);
      filtered = filtered.filter(t => validLocIds.includes(t.locationId));
    }
    return filtered;
  }

  get filteredScreens() {
    let filtered = this.screens;
    if (this.filterState) filtered = filtered.filter(s => this.capitalize(s.state) === this.filterState);
    if (this.filterCity) filtered = filtered.filter(s => this.capitalize(s.city) === this.filterCity);
    if (this.filterTheaterId) filtered = filtered.filter(s => s.theaterId == this.filterTheaterId);
    return filtered;
  }

  onStateChange() {
    this.filterCity = '';
    this.filterTheaterId = '';
  }

  onCityChange() {
    this.filterTheaterId = '';
  }

  // 📥 Load Screens
  loadScreens() {
    this.http.get<any[]>('http://localhost:5002/api/screen')
      .subscribe(res => this.screens = res);
  }

  // 📥 Load Theaters
  loadTheaters() {
    this.http.get<any[]>('http://localhost:5002/api/theater')
      .subscribe(res => this.theaters = res);
  }

  // 📥 Load Locations
  loadLocations() {
    this.http.get<any[]>('http://localhost:5002/api/location')
      .subscribe(res => this.locations = res);
  }

  // ➕ Create / ✏️ Update
  onSubmit() {
    if (this.screenForm.invalid) return;

    if (this.isEditMode) {
      this.http.put(`http://localhost:5002/api/screen/${this.selectedId}`, this.screenForm.value)
        .subscribe(() => {
          alert('Updated ✅');
          this.resetForm();
          this.loadScreens();
        });
    } else {
      this.http.post('http://localhost:5002/api/screen', this.screenForm.value)
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
      screenType: screen.screenType || '2D',
      theaterId: screen.theaterId
    });
  }

  // ❌ Delete
  deleteScreen(id: number) {
    if (confirm('Delete this screen?')) {
      this.http.delete(`http://localhost:5002/api/screens/${id}`)
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
