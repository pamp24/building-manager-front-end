import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BuildingMemberDTO } from '../models/BuildingMemberDTO';

@Injectable({
  providedIn: 'root'
})
export class BuildingMemberService {
  private readonly apiUrl =
    'http://localhost:8080/api/v1/building-members';

  constructor(private http: HttpClient) {}

  getMembersByBuilding(
    buildingId: number
  ): Observable<BuildingMemberDTO[]> {
    return this.http.get<BuildingMemberDTO[]>(
      `${this.apiUrl}/by-building/${buildingId}`
    );
  }

  assignApartment(
    memberId: number,
    role: 'Owner' | 'Resident',
    apartmentId: number
  ): Observable<void> {
    return this.http.post<void>(
      `${this.apiUrl}/${memberId}/assign-apartment`,
      { role, apartmentId }
    );
  }

  deleteMember(memberId: number): Observable<void> {
    return this.http.delete<void>(
      `${this.apiUrl}/deleteMember/${memberId}`
    );
  }
}