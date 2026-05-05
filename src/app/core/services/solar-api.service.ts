import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, shareReplay } from 'rxjs';
import { Planet } from '../models/planet.model';

@Injectable({
  providedIn: 'root'
})
export class SolarApiService {

  private readonly apiUrl = 'http://localhost:8080/api/planets';

  // Cache côté Angular aussi — évite les appels multiples
  private planets$: Observable<Planet[]> | null = null;

  constructor(private http: HttpClient) {}

  getAllPlanets(): Observable<Planet[]> {
    if (!this.planets$) {
      this.planets$ = this.http.get<Planet[]>(this.apiUrl).pipe(
        shareReplay(1)
      );
    }
    return this.planets$;
  }

  getPlanetById(id: string): Observable<Planet> {
    return this.http.get<Planet>(`${this.apiUrl}/${id}`);
  }
}
