import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Screen } from '../models/models';

@Injectable({
  providedIn: 'root'
})
export class ScreenService {
  private apiUrl = 'http://localhost:5002/api/Screen';

  constructor(private http: HttpClient) {}

  getAll(): Observable<Screen[]> {
    return this.http.get<Screen[]>(this.apiUrl);
  }

  getScreen(id: number): Observable<Screen> {
    return this.http.get<Screen>(`${this.apiUrl}/${id}`);
  }

  create(screen: Screen): Observable<Screen> {
    return this.http.post<Screen>(this.apiUrl, screen);
  }

  update(id: number, screen: Screen): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, screen);
  }

  delete(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
