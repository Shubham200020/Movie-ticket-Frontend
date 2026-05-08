import { Component, OnInit } from '@angular/core';
import { TheaterService } from '../../services/theater.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
// Use 'as LocationData' to avoid conflict with browser's window.Location
import { LocationService } from '../../services/location.service';
import { Theater, AppLocation } from '../../models/models';
@Component({
  selector: 'app-theator-input',
  standalone: true,
  imports: [FormsModule,CommonModule],
  templateUrl: './theator-input.component.html',
  styleUrl: './theator-input.component.css'
})
export class TheatorInputComponent implements OnInit {
 theaters: Theater[] = [];
  locationList: AppLocation[] = [];

  form: any = {
    id: 0,
    name: '',
    locationId: 0,
    lat: null,
    lng: null
  };

  isEdit = false; // Added to track state

  constructor(
    private theaterService: TheaterService,
    private locationService: LocationService
  ) {}

  ngOnInit() {
    this.loadTheaters();
    this.loadLocations();
  }

  loadLocations() {
    this.locationService.getAll().subscribe({
      next: (res) => this.locationList = res,
      error: (err) => console.error('Error loading locations', err)
    });
  }

  loadTheaters() {
  this.theaterService.getAll().subscribe({
    next: (res: any[]) => {
      this.theaters = res.map(t => ({
        ...t,
        locationId: t.locationId || t.location?.id
      }));
    },
    error: (err) => console.error('Error loading theaters', err)
  });
}

  submit() {
    if (this.form.id === 0) {
      this.theaterService.create(this.form).subscribe(() => {
        this.reset();
        this.loadTheaters();
      });
    } else {
      this.theaterService.update(this.form.id, this.form).subscribe(() => {
        this.reset();
        this.loadTheaters();
      });
    }
  }

  edit(item: Theater) {
    this.form = {
      id: item.id,
      name: item.name,
      locationId: item.locationId || item.location?.id,
      lat: item.lat,
      lng: item.lng
    };
    this.isEdit = true;
  }

  delete(id: number) {
    if(confirm('Delete theater?')) {
      this.theaterService.delete(id).subscribe(() => this.loadTheaters());
    }
  }

  reset() {
    this.form = { id: 0, name: '', locationId: 0, lat: null, lng: null };
    this.isEdit = false;
  }
}
