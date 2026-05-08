import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';

import { AppLocation } from '../models/models';
export interface Coordinates { lat: number; lon: number; }

@Injectable({
  providedIn: 'root'
})
export class LocationService {

   private apiUrl = 'http://localhost:5002/api/location';
   private currentCitySubject = new BehaviorSubject<string>('Detecting...');
   currentCity$ = this.currentCitySubject.asObservable();

   private currentAreaSubject = new BehaviorSubject<string>('');
   currentArea$ = this.currentAreaSubject.asObservable();

   private userLocationSubject = new BehaviorSubject<Coordinates | null>(null);
   userLocation$ = this.userLocationSubject.asObservable();

   private geocodeCache = new Map<string, Coordinates>();

  constructor(private http: HttpClient) {}

  setCurrentCity(city: string) {
    this.currentCitySubject.next(city);
  }

  getAll(): Observable<AppLocation[]> {
    return this.http.get<AppLocation[]>(this.apiUrl);
  }

  create(data: AppLocation): Observable<AppLocation> {
    return this.http.post<AppLocation>(this.apiUrl, data);
  }

  update(id: number, data: AppLocation): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, data);
  }

  getCurrentCity(): Promise<string> {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject('Geolocation is not supported by your browser');
      } else {
        navigator.geolocation.getCurrentPosition(
          async (position) => {
            const lat = position.coords.latitude;
            const lon = position.coords.longitude;
            this.userLocationSubject.next({ lat, lon });
            
            try {
              const response = await fetch(
                `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lon}`
              );
              const data = await response.json();
              const addr = data.address;
              console.log('Location Address Data:', addr);
              
              // Prioritize major city/town over smaller entities like villages/suburbs
              let city = addr.city || addr.town || addr.municipality || addr.city_district;
              
              if (!city && addr.state_district) {
                // If in a district, try to use that as the city (e.g. "Pune District" -> "Pune")
                city = addr.state_district.replace(' District', '');
              }
              
              if (!city) {
                city = addr.village || addr.suburb || addr.county || addr.state || 'Unknown';
              }
              
              // Also detect area (suburb, neighborhood, etc.)
              const area = addr.suburb || addr.neighbourhood || addr.village || addr.suburb || addr.town || addr.city_district || addr.county || '';
              this.currentAreaSubject.next(area);
              console.log('Detected Area:', area);
              
              resolve(city);
            } catch (error) {
              reject('Unable to retrieve city name');
            }
          },
          (error) => {
            reject('Unable to retrieve your location');
          }
        );
      }
    });
  }

  delete(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  async getCoordinates(address: string): Promise<Coordinates | null> {
    if (this.geocodeCache.has(address)) {
      return this.geocodeCache.get(address) || null;
    }
    try {
      const response = await fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(address)}&format=json&limit=1`);
      const data = await response.json();
      if (data && data.length > 0) {
        const coords = { lat: parseFloat(data[0].lat), lon: parseFloat(data[0].lon) };
        this.geocodeCache.set(address, coords);
        return coords;
      }
    } catch(e) {
      console.error('Geocoding error', e);
    }
    return null;
  }

  calculateDistance(coord1: Coordinates, coord2: Coordinates): number {
    const R = 6371; // Radius of the earth in km
    const dLat = (coord2.lat - coord1.lat) * Math.PI / 180;
    const dLon = (coord2.lon - coord1.lon) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(coord1.lat * Math.PI / 180) * Math.cos(coord2.lat * Math.PI / 180) *
              Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c; // Distance in km
  }

  async getTheaterCoordinates(theater: any): Promise<Coordinates | null> {
    // 1. Use stored coordinates if available
    if (theater.lat && theater.lng) {
      return { lat: parseFloat(theater.lat), lon: parseFloat(theater.lng) };
    }

    // 2. Fallback to geocoding based on address
    if (theater.location?.location && theater.location?.city) {
      const address = `${theater.location.location}, ${theater.location.city}`;
      return await this.getCoordinates(address);
    }

    return null;
  }
}
