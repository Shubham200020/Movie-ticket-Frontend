import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { BookingService } from '../../services/booking.service';
import { Booking } from '../../models/models';
import { HttpClient } from '@angular/common/http';
import { SafeUrlPipe } from '../../services/safe-url.pipe';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, SafeUrlPipe, FormsModule],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  user: any = null;
  bookings: Booking[] = [];
  allSystemBookings: Booking[] = [];
  isLoading = true;
  activeTab: 'personal' | 'system' = 'personal';

  // Password Update State
  showPasswordModal = false;
  passwordData = {
    oldPassword: '',
    newPassword: '',
    confirmPassword: ''
  };
  isUpdatingPassword = false;
  passwordError = '';
  passwordSuccess = '';

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
    const activeId = this.user.id || this.user.Id;
    const url = this.user.role?.toLowerCase() === 'admin' 
      ? `http://localhost:5002/api/Booking/admin/${activeId}`
      : `http://localhost:5002/api/Booking/user/${activeId}`;

    this.http.get<Booking[]>(url).subscribe({
      next: (res) => {
        this.bookings = res.sort((a, b) => new Date(b.bookingTime).getTime() - new Date(a.bookingTime).getTime());
        this.isLoading = false;
      },
      error: () => this.isLoading = false
    });
  }

  loadAllSystemBookings() {
    this.http.get<Booking[]>('http://localhost:5002/api/Booking').subscribe({
      next: (res) => {
        this.allSystemBookings = res.sort((a, b) => new Date(b.bookingTime).getTime() - new Date(a.bookingTime).getTime());
      }
    });
  }

  setTab(tab: 'personal' | 'system') {
    this.activeTab = tab;
  }

  togglePasswordModal() {
    this.showPasswordModal = !this.showPasswordModal;
    if (!this.showPasswordModal) {
      this.resetPasswordForm();
    }
  }

  resetPasswordForm() {
    this.passwordData = { oldPassword: '', newPassword: '', confirmPassword: '' };
    this.passwordError = '';
    this.passwordSuccess = '';
  }

  updatePassword() {
    if (this.passwordData.newPassword !== this.passwordData.confirmPassword) {
      this.passwordError = 'New passwords do not match';
      return;
    }

    if (this.passwordData.newPassword.length < 6) {
      this.passwordError = 'Password must be at least 6 characters';
      return;
    }

    this.isUpdatingPassword = true;
    this.passwordError = '';

    // The backend PUT /api/User/{id} updates the user including password.
    // We need to send the full user object or just what's required.
    // Based on the backend code, it hashes whatever is in updatedUser.Password.
    
    const updateUrl = this.user.role === 'admin'
      ? `http://localhost:5002/api/AdminControllers/${this.user.id}`
      : `http://localhost:5002/api/User/${this.user.id}`;

    const updatePayload = {
      ...this.user,
      password: this.passwordData.newPassword
    };

    this.http.put(updateUrl, updatePayload).subscribe({
      next: () => {
        this.passwordSuccess = 'Password updated successfully!';
        this.isUpdatingPassword = false;
        setTimeout(() => this.togglePasswordModal(), 2000);
      },
      error: (err) => {
        this.passwordError = 'Failed to update password. Please try again.';
        this.isUpdatingPassword = false;
      }
    });
  }
}
