import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { BookingService } from '../../services/booking.service';
import { Booking } from '../../models/models';
import { HttpClient } from '@angular/common/http';
import { SafeUrlPipe } from '../../services/safe-url.pipe';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, SafeUrlPipe],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  user: any = null;
  bookings: Booking[] = [];
  allSystemBookings: Booking[] = [];
  isLoading = true;
  activeTab: 'personal' | 'system' = 'personal';

  constructor(
    private authService: AuthService,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.user = this.authService.getUser();
    if (this.user) {
      this.loadPersonalBookings();
      if (this.user.role === 'admin') {
        this.loadAllSystemBookings();
      }
    } else {
      this.isLoading = false;
    }
  }

  loadPersonalBookings() {
    this.isLoading = true;
    const url = this.user.role === 'admin' 
      ? `https://localhost:7061/api/Booking/admin/${this.user.id}`
      : `https://localhost:7061/api/Booking/user/${this.user.id}`;

    this.http.get<Booking[]>(url).subscribe({
      next: (res) => {
        this.bookings = res.sort((a, b) => new Date(b.bookingTime).getTime() - new Date(a.bookingTime).getTime());
        this.isLoading = false;
      },
      error: () => this.isLoading = false
    });
  }

  loadAllSystemBookings() {
    this.http.get<Booking[]>('https://localhost:7061/api/Booking').subscribe({
      next: (res) => {
        this.allSystemBookings = res.sort((a, b) => new Date(b.bookingTime).getTime() - new Date(a.bookingTime).getTime());
      }
    });
  }

  setTab(tab: 'personal' | 'system') {
    this.activeTab = tab;
  }
}
