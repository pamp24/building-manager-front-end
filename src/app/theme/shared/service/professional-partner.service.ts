import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ProfessionalBusinessDTO } from '../models/professional.model';

@Injectable({
  providedIn: 'root'
})
export class ProfessionalPartnerService {
  private readonly apiUrl = 'http://localhost:8080/api/v1/professional-partners';

  constructor(private http: HttpClient) {}

  getPartners(buildingId: number) {
    return this.http.get<ProfessionalBusinessDTO[]>(`${this.apiUrl}/buildings/${buildingId}`);
  }

  addPartner(buildingId: number, professionalId: number) {
    return this.http.post<void>(`${this.apiUrl}/buildings/${buildingId}/professionals/${professionalId}`, {});
  }

  removePartner(buildingId: number, professionalId: number) {
    return this.http.delete<void>(`${this.apiUrl}/buildings/${buildingId}/professionals/${professionalId}`);
  }
}