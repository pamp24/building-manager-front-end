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
  getBuilding(id: number): Observable<BuildingDTO> {
    return this.http.get<BuildingDTO>(`${this.apiUrl}/${id}`);
  }
  getMyBuildings(): Observable<BuildingDTO[]> {
    return this.http.get<BuildingDTO[]>('http://localhost:8080/api/v1/buildings/my-buildings');
  }
  deleteBuilding(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
  getBuildingManager(buildingId: number) {
    return this.http.get<{ id: number; fullName?: string }>(`${this.apiUrl}/${buildingId}/manager`);
  }

}
