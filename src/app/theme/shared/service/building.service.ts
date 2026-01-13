// building.service.ts
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BuildingDTO } from '../models/buildingDTO';
import { BuildingRequest } from '../models/buildingRequest';
import { ManagerDTO } from '../models/managerDTO';
import { ManagedBuildingDTO } from '../models/managedBuildingDTO';

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
  deleteDraftBuilding(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}/draft`);
  }
  getBuildingManager(buildingId: number): Observable<ManagerDTO> {
    return this.http.get<ManagerDTO>(`${this.apiUrl}/${buildingId}/manager`);
  }
  updateBuilding(id: number, building: BuildingDTO): Observable<BuildingDTO> {
    return this.http.put<BuildingDTO>(`${this.apiUrl}/update/${id}`, building);
  }
  getMyManagedBuildings(): Observable<ManagedBuildingDTO[]> {
    return this.http.get<ManagedBuildingDTO[]>(`${this.apiUrl}/my-managed-buildings`);
  }
  getByCode(code: string) {
    return this.http.get<{ buildingId: number }>(`${this.apiUrl}/by-code/${encodeURIComponent(code)}`);
  }
  joinByCode(code: string) {
    return this.http.post<{ buildingId: number }>(`${this.apiUrl}/join-by-code?code=${encodeURIComponent(code)}`, {});
  }
}
