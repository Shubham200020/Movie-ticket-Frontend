import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BookingService } from '../services/booking.service';
import { Booking } from '../models/models';

@Component({
  selector: 'app-business-tracking',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="business-container glass">
      <h2>📊 Movie Business Tracker</h2>
      <p class="subtitle">Real-time revenue tracking for all movies</p>

      <div class="summary-cards">
        <div class="summary-card">
          <h4>Total Revenue</h4>
          <h2 class="revenue">₹{{ totalRevenue | number:'1.2-2' }}</h2>
        </div>
        <div class="summary-card">
          <h4>Total Tickets Sold</h4>
          <h2 class="tickets">{{ totalTickets }}</h2>
        </div>
        <div class="summary-card">
          <h4>Top Performing Movie</h4>
          <h2 class="top-movie">{{ topMovie || 'N/A' }}</h2>
        </div>
      </div>

      <div class="table-card">
        <h3>Revenue by Movie</h3>
        <div class="table-responsive">
          <table>
            <thead>
              <tr>
                <th>Movie Title</th>
                <th>Tickets Sold</th>
                <th>Total Revenue (₹)</th>
                <th>Avg. Ticket Price</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let m of movieStats">
                <td><strong>{{ m.title }}</strong></td>
                <td>{{ m.ticketsSold }}</td>
                <td class="revenue-cell">₹{{ m.revenue | number:'1.2-2' }}</td>
                <td>₹{{ m.avgPrice | number:'1.2-2' }}</td>
              </tr>
              <tr *ngIf="movieStats.length === 0">
                <td colspan="4" class="no-data">No booking data available.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .business-container { padding: 30px; border-radius: 16px; }
    h2 { margin-bottom: 5px; color: white; }
    .subtitle { color: #94a3b8; margin-bottom: 30px; font-size: 14px; }
    
    .summary-cards { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; margin-bottom: 30px; }
    .summary-card { background: rgba(0,0,0,0.2); padding: 25px; border-radius: 16px; border: 1px solid rgba(255,255,255,0.05); text-align: center; }
    .summary-card h4 { color: #cbd5e1; font-weight: 500; font-size: 14px; margin-bottom: 10px; text-transform: uppercase; letter-spacing: 1px;}
    .revenue { color: #4ade80; font-size: 32px; }
    .tickets { color: #60a5fa; font-size: 32px; }
    .top-movie { color: #c084fc; font-size: 24px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;}
    
    .table-card { background: rgba(0,0,0,0.1); padding: 20px; border-radius: 12px; }
    h3 { margin-bottom: 20px; color: white; }
    table { width: 100%; border-collapse: collapse; }
    th { background: rgba(0,0,0,0.3); padding: 15px; color: #94a3b8; text-align: left; font-size: 13px; text-transform: uppercase;}
    td { padding: 15px; border-bottom: 1px solid rgba(255,255,255,0.05); color: #e2e8f0; }
    tr:hover td { background: rgba(255,255,255,0.05); }
    .revenue-cell { color: #4ade80; font-weight: 600; }
    .no-data { text-align: center; padding: 30px; color: #64748b; font-style: italic; }
  `]
})
export class BusinessTrackingComponent implements OnInit {
  bookings: Booking[] = [];
  
  movieStats: { title: string; ticketsSold: number; revenue: number; avgPrice: number }[] = [];
  totalRevenue = 0;
  totalTickets = 0;
  topMovie = '';

  constructor(private bookingService: BookingService) {}

  ngOnInit() {
    this.bookingService.getBookings().subscribe({
      next: (res) => {
        this.bookings = res;
        this.calculateBusiness();
      },
      error: (err) => console.error(err)
    });
  }

  calculateBusiness() {
    const statsMap = new Map<number, { title: string; ticketsSold: number; revenue: number }>();
    
    this.totalRevenue = 0;
    this.totalTickets = 0;

    this.bookings.forEach(b => {
      // Only count Confirmed bookings (you might want to count all, or specify based on rules)
      if (b.status?.toLowerCase() !== 'cancelled') {
        
        const movieId = b.showtime?.movie?.id;
        const movieTitle = b.showtime?.movie?.title;
        
        if (movieId && movieTitle) {
          const tickets = b.selectedSeats ? b.selectedSeats.length : 0;
          const revenue = b.totalAmount || 0;

          this.totalRevenue += revenue;
          this.totalTickets += tickets;

          if (statsMap.has(movieId)) {
            const existing = statsMap.get(movieId)!;
            existing.ticketsSold += tickets;
            existing.revenue += revenue;
          } else {
            statsMap.set(movieId, { title: movieTitle, ticketsSold: tickets, revenue: revenue });
          }
        }
      }
    });

    this.movieStats = Array.from(statsMap.values()).map(s => ({
      title: s.title,
      ticketsSold: s.ticketsSold,
      revenue: s.revenue,
      avgPrice: s.ticketsSold > 0 ? s.revenue / s.ticketsSold : 0
    })).sort((a, b) => b.revenue - a.revenue); // Sort by highest revenue

    if (this.movieStats.length > 0) {
      this.topMovie = this.movieStats[0].title;
    }
  }
}
