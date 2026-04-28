import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminService } from '../services/admin.service';

@Component({
  selector: 'app-admin-management',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="admin-management-container glass">
      <h2>Manage Administrators</h2>
      
      <!-- 🚨 Error Message -->
      <div class="alert alert-error" *ngIf="errorMessage">
        {{ errorMessage }}
      </div>

      <!-- ✅ Success Message -->
      <div class="alert alert-success" *ngIf="successMessage">
        {{ successMessage }}
      </div>

      <form (ngSubmit)="createAdmin()" #adminForm="ngForm">
        <div class="form-group">
          <label>Full Name</label>
          <input type="text" name="name" [(ngModel)]="newAdmin.name" placeholder="Admin Name" required>
        </div>

        <div class="form-group">
          <label>Email Address</label>
          <input type="email" name="email" [(ngModel)]="newAdmin.email" placeholder="admin@example.com" required pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$">
        </div>

        <div class="form-group">
          <label>Password</label>
          <input type="password" name="password" [(ngModel)]="newAdmin.password" placeholder="Secure Password" required minlength="6">
        </div>

        <button type="submit" class="submit-btn" [disabled]="adminForm.invalid">Add New Admin</button>
      </form>

      <div class="admin-list">
        <h3>Current Admins</h3>
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let admin of admins">
              <td>{{ admin.id }}</td>
              <td>{{ admin.name }}</td>
              <td>{{ admin.email }}</td>
              <td>
                <button class="delete-btn" (click)="deleteAdmin(admin.id)">Delete</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  `,
  styles: [`
    .admin-management-container {
      padding: 25px;
      border-radius: 12px;
      color: white;
    }
    h2, h3 { margin-bottom: 20px; }
    .form-group { margin-bottom: 15px; }
    label { display: block; margin-bottom: 8px; font-weight: 500; color: #cbd5e1; }
    input { width: 100%; padding: 12px; border-radius: 8px; border: 1px solid rgba(255,255,255,0.2); background: rgba(0,0,0,0.2); color: white; margin-bottom: 15px;}
    .submit-btn { background: #6366f1; color: white; padding: 12px 20px; border: none; border-radius: 8px; cursor: pointer; width: 100%; font-weight: bold; }
    .submit-btn:disabled { background: gray; cursor: not-allowed; }
    .alert { padding: 10px; margin-bottom: 15px; border-radius: 6px; font-size: 14px; }
    .alert-error { background-color: rgba(239, 68, 68, 0.2); color: #fca5a5; border: 1px solid #ef4444; }
    .alert-success { background-color: rgba(34, 197, 94, 0.2); color: #86efac; border: 1px solid #22c55e; }
    table { width: 100%; border-collapse: collapse; margin-top: 15px; background: rgba(0,0,0,0.3); border-radius: 8px; overflow: hidden; }
    th, td { padding: 12px; text-align: left; border-bottom: 1px solid rgba(255,255,255,0.1); }
    th { background: rgba(0,0,0,0.5); }
    .delete-btn { background: #ef4444; color: white; border: none; padding: 6px 12px; border-radius: 4px; cursor: pointer; }
    .delete-btn:hover { background: #dc2626; }
  `]
})
export class AdminManagementComponent implements OnInit {
  newAdmin = { name: '', email: '', password: '', role: 'admin' };
  admins: any[] = [];
  errorMessage = '';
  successMessage = '';

  constructor(private adminService: AdminService) {}

  ngOnInit() {
    this.loadAdmins();
  }

  loadAdmins() {
    this.adminService.getAllAdmins().subscribe({
      next: (res: any) => this.admins = res,
      error: (err) => console.error(err)
    });
  }

  createAdmin() {
    this.errorMessage = '';
    this.successMessage = '';
    
    this.adminService.addAdmin(this.newAdmin).subscribe({
      next: (res) => {
        this.successMessage = 'Admin added successfully! ✅';
        this.newAdmin = { name: '', email: '', password: '', role: 'admin' };
        this.loadAdmins();
      },
      error: (err) => {
        if (err.error && typeof err.error === 'string') {
          this.errorMessage = err.error;
        } else {
          this.errorMessage = 'Failed to add admin ❌';
        }
      }
    });
  }

  deleteAdmin(id: number) {
    if(confirm('Are you sure you want to delete this admin?')) {
      this.adminService.deleteAdmin(id).subscribe({
        next: () => {
          this.successMessage = 'Admin deleted successfully!';
          this.loadAdmins();
        },
        error: () => this.errorMessage = 'Failed to delete admin.'
      });
    }
  }
}
