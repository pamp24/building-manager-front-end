import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApartmentDTO } from '../models/apartmentDTO';
import { ApartmentRequest } from '../models/apartmentRequest';

@Injectable({
  providedIn: 'root'
})
export class ApartmentService {
  constructor(private http: HttpClient) {}

  saveMultiple(apartments: ApartmentRequest[]): Observable<ApartmentRequest[]> {
    return this.http.post<ApartmentRequest[]>('http://localhost:8080/api/v1/apartments/batch', apartments);
  }

  getMyApartment() {
    return this.http.get<ApartmentDTO>('http://localhost:8080/api/v1/apartments/myApartment');
  }

  getMyApartments(): Observable<ApartmentDTO[]> {
    return this.http.get<ApartmentDTO[]>('http://localhost:8080/api/v1/apartments/my-apartments');
  }

  getApartmentsInSameBuilding(): Observable<ApartmentDTO[]> {
    return this.http.get<ApartmentDTO[]>('http://localhost:8080/api/v1/apartments/same-building');
  }

  updateMyApartment(apartment: ApartmentDTO): Observable<ApartmentDTO> {
    return this.http.put<ApartmentDTO>('http://localhost:8080/api/v1/apartments/update/myApartment', apartment);
  }

  addApartment(apartment: ApartmentRequest): Observable<number> {
    return this.http.post<number>('http://localhost:8080/api/v1/apartments/batch', apartment);
  }
  getApartmentsByBuilding(buildingId: number): Observable<ApartmentDTO[]> {
    return this.http.get<ApartmentDTO[]>(`http://localhost:8080/api/v1/apartments/building/${buildingId}/list`);
  }
  getAvailableApartments(buildingId: number, role: string): Observable<ApartmentDTO[]> {
    return this.http.get<ApartmentDTO[]>(`http://localhost:8080/api/v1/apartments/${buildingId}/available?role=${role}`);
  }

  updateApartment(apartmentId: number, apartment: ApartmentDTO): Observable<ApartmentDTO> {
    return this.http.put<ApartmentDTO>(`http://localhost:8080/api/v1/apartments/update/myApartment/${apartmentId}`, apartment);
  }

  deleteApartment(apartmentId: number): Observable<void> {
    return this.http.delete<void>(`http://localhost:8080/api/v1/apartments/delete/${apartmentId}`);
  }
}
