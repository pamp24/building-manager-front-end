import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';

import { ProfessionalBusinessDTO } from '../models/professional.model';

@Injectable({
  providedIn: 'root'
})
export class ProfessionalFavoriteService {

  private apiUrl = 'http://localhost:8080/api/v1/professionals/favorites';

  constructor(private http: HttpClient) {}

  addFavorite(professionalId: number): Observable<void> {
    return this.http.post<void>(
      `${this.apiUrl}/${professionalId}`,
      {}
    );
  }

  removeFavorite(professionalId: number): Observable<void> {
    return this.http.delete<void>(
      `${this.apiUrl}/${professionalId}`
    );
  }

  getMyFavorites(): Observable<ProfessionalBusinessDTO[]> {
    return this.http.get<ProfessionalBusinessDTO[]>(
      `${this.apiUrl}/my`
    );
  }
}