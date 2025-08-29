import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApartmentDTO } from '../models/apartmentDTO';

export interface ApartmentRequest {
  name: string;
  number: string;
  sqMetersApart: string;
  floor: number;
  parkingSpace: boolean;
  active: boolean;
  enable: boolean;
  buildingId: number;
}

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
    return this.http.put<ApartmentDTO>('http://localhost:8080/api/v1/apartments/myApartment', apartment);
  }

  addApartment(apartment: ApartmentRequest): Observable<number> {
    return this.http.post<number>('http://localhost:8080/api/v1/apartments/batch', apartment);
  }
}
