import { Component, OnInit } from '@angular/core';
import { LocationService } from '../../services/location.service';
import { AppLocation } from '../../models/models';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-city-input',
  standalone: true,
  imports: [CommonModule,FormsModule],
  templateUrl: './city-input.component.html',
  styleUrl: './city-input.component.css'
})

export class CityInputComponent implements OnInit {
  locations: AppLocation[] = [];

  form: AppLocation = {
    id: 0,
    state: '',
    city: '',
    location: ''
  };

  isEdit = false;

  constructor(private service: LocationService) {}

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.service.getAll().subscribe(res => this.locations = res);
  }

  submit() {
    if (this.isEdit) {
      this.service.update(this.form.id, this.form).subscribe(() => {
        this.reset();
        this.loadData();
      });
    } else {
      this.service.create(this.form).subscribe(() => {
        this.reset();
        this.loadData();
      });
    }
  }

  edit(item: AppLocation) {
    this.form = { ...item };
    this.isEdit = true;
  }

  delete(id: number) {
    this.service.delete(id).subscribe(() => this.loadData());
  }

  reset() {
    this.form = { id: 0, state: '', city: '', location: '' };
    this.isEdit = false;
  }
}
