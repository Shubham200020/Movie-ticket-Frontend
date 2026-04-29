import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TheaterService } from '../../services/theater.service';
import { LocationService } from '../../services/location.service';
import { Theater } from '../../models/models';
import { Coordinates } from '../../services/location.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-theatres',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="theatres-container">
      <div class="header glass">
        <h1>Theatres in {{ currentCity }}</h1>
        <p *ngIf="isNearby">No theatres found in {{ currentCity }}. Showing all available cities.</p>
      </div>

      <div class="theater-list">
        <div class="theater-card glass" *ngFor="let theater of filteredTheaters">
          <div class="theater-info">
            <div class="theater-main">
              <span class="icon">🏛️</span>
              <div>
                <div class="theater-header-row">
                  <h3>{{ theater.name }}</h3>
                  <span class="nearby-badge" *ngIf="theater.isNearby">{{ theater.location?.city }}</span>
                </div>
                <p class="location">
                  📍 {{ theater.location?.location }}, {{ theater.location?.city }}
                  <span *ngIf="theater.distance !== undefined" class="distance-badge">• {{ theater.distance | number:'1.1-1' }} km away</span>
                </p>
              </div>
            </div>
            <div class="theater-tags">
              <span class="tag">M-Ticket</span>
              <span class="tag">Food & Beverage</span>
            </div>
          </div>
          <div class="actions">
            <button class="btn-explore">View Schedule</button>
          </div>
        </div>
      </div>

      <div *ngIf="filteredTheaters.length === 0" class="no-theaters glass">
        <p>No theatres available in any location. Please check back later.</p>
      </div>
    </div>
  `,
  styles: `
    .theatres-container {
      padding: 2rem 4rem;
      max-width: 1200px;
      margin: 0 auto;
      color: white;
    }
    .header {
      padding: 2rem;
      border-radius: 16px;
      margin-bottom: 2rem;
      text-align: center;
    }
    .header h1 {
      font-size: 2rem;
      margin-bottom: 0.5rem;
      background: linear-gradient(90deg, #fff, #a0a0a0);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
    .header p { color: #f59e0b; font-size: 0.9rem; }
    .glass {
      background: rgba(255, 255, 255, 0.05);
      backdrop-filter: blur(10px);
      border: 1px solid rgba(255, 255, 255, 0.1);
    }
    .theater-list {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
      gap: 1.5rem;
    }
    .theater-card {
      padding: 1.5rem;
      border-radius: 12px;
      transition: all 0.3s ease;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
    }
    .theater-card:hover {
      transform: translateY(-5px);
      border-color: rgba(229, 9, 20, 0.3);
    }
    .theater-info {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 1.5rem;
    }
    .theater-main { display: flex; gap: 1rem; align-items: center; }
    .theater-main .icon { font-size: 1.5rem; }
    .theater-main h3 { margin: 0; font-size: 1.2rem; }
    .theater-main .location { color: #888; font-size: 0.85rem; margin-top: 0.2rem; }
    .theater-tags { display: flex; gap: 0.5rem; flex-wrap: wrap; }
    .tag { font-size: 0.7rem; padding: 0.2rem 0.5rem; border-radius: 4px; background: rgba(255,255,255,0.05); color: #666; }
    .actions { border-top: 1px solid rgba(255,255,255,0.05); padding-top: 1rem; }
    .btn-explore {
      width: 100%;
      padding: 0.7rem;
      border-radius: 6px;
      background: #e50914;
      color: white;
      border: none;
      font-weight: 600;
      cursor: pointer;
      transition: background 0.2s;
    }
    .btn-explore:hover { background: #f40612; }
    .theater-header-row { display: flex; align-items: center; gap: 10px; }
    .nearby-badge { 
      font-size: 0.65rem; 
      background: rgba(245, 158, 11, 0.2); 
      color: #f59e0b; 
      padding: 2px 6px; 
      border-radius: 4px; 
      font-weight: 600;
      text-transform: uppercase;
    }
    .distance-badge {
      font-size: 0.75rem;
      color: #3b82f6;
      font-weight: 500;
      margin-left: 6px;
    }
    .no-theaters { padding: 3rem; text-align: center; border-radius: 16px; }
  `
})
export class TheatresComponent implements OnInit {
  allTheaters: Theater[] = [];
  filteredTheaters: Theater[] = [];
  currentCity: string = '';
  currentArea: string = '';
  isNearby: boolean = false;
  userCoords: Coordinates | null = null;

  constructor(
    private theaterService: TheaterService,
    private locationService: LocationService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.locationService.userLocation$.subscribe(coords => {
      this.userCoords = coords;
      this.applyFilter();
    });

    this.locationService.currentCity$.subscribe(city => {
      this.currentCity = city;
      this.applyFilter();
    });

    this.locationService.currentArea$.subscribe(area => {
      this.currentArea = area;
      this.applyFilter();
    });

    this.theaterService.getAll().subscribe(theaters => {
      this.allTheaters = theaters;
      this.applyFilter();
    });
  }

  goToMovie(movie: any) {
    this.router.navigate(['/movie', movie.id], { state: { movie } });
  }

  async applyFilter() {
    if (!this.allTheaters.length) return;

    const cityLower = this.currentCity.toLowerCase();
    
    // First, calculate GPS distances for all theaters if we have user coordinates
    if (this.userCoords) {
      for (let t of this.allTheaters) {
        if (!t.location?.location || !t.location?.city) continue;
        const address = `${t.location.location}, ${t.location.city}`;
        const coords = await this.locationService.getCoordinates(address);
        if (coords) {
          t.distance = this.locationService.calculateDistance(this.userCoords, coords);
        } else {
          t.distance = 9999; // Fallback for unknown locations
        }
      }
    }

    let inCityTheaters = this.allTheaters.filter(t => t.location?.city?.toLowerCase() === cityLower);
    let others = this.allTheaters.filter(t => t.location?.city?.toLowerCase() !== cityLower);

    // Sort by GPS distance
    if (inCityTheaters.length > 1) {
      inCityTheaters = inCityTheaters.sort((a, b) => {
        return (a.distance ?? 9999) - (b.distance ?? 9999);
      });
    }

    if (others.length > 1) {
      others = others.sort((a, b) => {
        return (a.distance ?? 9999) - (b.distance ?? 9999);
      });
    }

    // Combine them (matched city first)
    this.filteredTheaters = [
      ...inCityTheaters.map(t => ({ ...t, isNearby: false })),
      ...others.map(t => ({ ...t, isNearby: true }))
    ];
    
    this.isNearby = inCityTheaters.length === 0;
  }
}
