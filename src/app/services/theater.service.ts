import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Theater {
  id: number;
  name: string;
  location: string;
  screens?: any[]; // Keep as optional array since backend includes them
}

@Injectable({ providedIn: 'root' })
export class TheaterService {
  private apiUrl = 'https://localhost:7061/api/theater'; // Adjusted to match [Route("api/[controller]")]

  constructor(private http: HttpClient) {}

  getAll(): Observable<Theater[]> {
    return this.http.get<Theater[]>(this.apiUrl);
  }

  create(theater: Theater): Observable<Theater> {
    return this.http.post<Theater>(this.apiUrl, theater);
  }

  update(id: number, theater: Theater): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${id}`, theater);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}