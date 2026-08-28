import { environment } from 'src/environments/environment';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApartmentDTO } from '../models/apartmentDTO';
import { ApartmentRequest } from '../models/apartmentRequest';
import { ApartmentUpdateRequest } from '../models/apartmentUpdateRequest';

@Injectable({
  providedIn: 'root'
})
export class ApartmentService {
  constructor(private http: HttpClient) {}
  private readonly baseUrl = `${environment.apiUrl}/api/v1/apartments`;

  saveMultiple(apartments: ApartmentRequest[]): Observable<ApartmentRequest[]> {
    return this.http.post<ApartmentRequest[]>(`${this.baseUrl}/batch`, apartments);
  }

  getMyApartment() {
    return this.http.get<ApartmentDTO>(`${this.baseUrl}/myApartment`);
  }

  getMyApartments(): Observable<ApartmentDTO[]> {
    return this.http.get<ApartmentDTO[]>(`${this.baseUrl}/my-apartments`);
  }

  getApartmentsInSameBuilding(): Observable<ApartmentDTO[]> {
    return this.http.get<ApartmentDTO[]>(`${this.baseUrl}/same-building`);
  }

  updateMyApartment(apartment: Partial<ApartmentDTO>): Observable<ApartmentDTO> {
    return this.http.put<ApartmentDTO>(`${this.baseUrl}/update/myApartment`, apartment);
  }

  addApartment(apartment: ApartmentRequest): Observable<number> {
    return this.http.post<number>(`${this.baseUrl}/batch`, apartment);
  }
  getApartmentsByBuilding(buildingId: number): Observable<ApartmentDTO[]> {
    return this.http.get<ApartmentDTO[]>(`${this.baseUrl}/building/${buildingId}/list`);
  }

  getCommonPercentSum(buildingId: number): Observable<number> {
    return this.http.get<number>(`${this.baseUrl}/building/${buildingId}/common-percent-sum`);
  }

  redistributeCommonPercent(buildingId: number): Observable<void> {
    return this.http.post<void>(`${this.baseUrl}/building/${buildingId}/redistribute-common-percent`, {});
  }
  getAvailableApartments(buildingId: number, role: string): Observable<ApartmentDTO[]> {
    return this.http.get<ApartmentDTO[]>(`${this.baseUrl}/${buildingId}/available?role=${role}`);
  }

  updateApartment(apartmentId: number, request: ApartmentUpdateRequest): Observable<ApartmentDTO> {
    return this.http.put<ApartmentDTO>(`${this.baseUrl}/${apartmentId}`, request);
  }

  deleteApartment(apartmentId: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/delete/${apartmentId}`);
  }
}
