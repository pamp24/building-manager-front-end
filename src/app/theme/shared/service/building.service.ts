// building.service.ts
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BuildingDTO } from '../models/buildingDTO';
import { BuildingRequest } from '../models/buildingRequest';

@Injectable({ providedIn: 'root' })
export class BuildingService {
  private apiUrl = 'http://localhost:8080/api/v1/buildings';

  constructor(private http: HttpClient) {}

  createBuilding(building: BuildingRequest): Observable<number> {
    return this.http.post<number>(this.apiUrl, building);
  }
  getMyBuilding(): Observable<BuildingDTO> {
    return this.http.get<BuildingDTO>(`${this.apiUrl}/my`);
  }
  // building.service.ts
  deleteBuilding(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
