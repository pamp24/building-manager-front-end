// building.service.ts
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BuildingDTO } from '../models/buildingDTO';
import { BuildingDocumentDTO } from '../models/building-document.model';
import { BuildingRequest } from '../models/buildingRequest';
import { ManagerDTO } from '../models/managerDTO';
import { ManagedBuildingDTO } from '../models/managedBuildingDTO';
import { MemberPermissionDTO } from '../models/memberPermissionDTO';

@Injectable({ providedIn: 'root' })
export class BuildingService {
  private apiUrl = `${environment.apiUrl}/api/v1/buildings`;

  constructor(private http: HttpClient) {}

  // Building Creation
  createSelfBuilding(req: BuildingRequest) {
    return this.http.post<number>(`${this.apiUrl}/self`, req);
  }

  createCompanyBuilding(req: BuildingRequest) {
    return this.http.post<number>(`${this.apiUrl}/company`, req);
  }

  // Building Retrieval
  getBuilding(id: number): Observable<BuildingDTO> {
    return this.http.get<BuildingDTO>(`${this.apiUrl}/${id}`);
  }

  getMyBuildings(): Observable<BuildingDTO[]> {
    return this.http.get<BuildingDTO[]>(`${this.apiUrl}/my-buildings`);
  }

  getBuildingManager(buildingId: number): Observable<ManagerDTO> {
    return this.http.get<ManagerDTO>(`${this.apiUrl}/${buildingId}/manager`);
  }

  getMyManagedBuildings(): Observable<ManagedBuildingDTO[]> {
    return this.http.get<ManagedBuildingDTO[]>(`${this.apiUrl}/my-managed-buildings`);
  }

  getBuildingDocuments(buildingId: number): Observable<BuildingDocumentDTO[]> {
    return this.http.get<BuildingDocumentDTO[]>(`${this.apiUrl}/${buildingId}/documents`);
  }

  uploadBuildingDocuments(buildingId: number, files: File[], category?: string): Observable<BuildingDocumentDTO[]> {
    const formData = new FormData();

    files.forEach((file) => formData.append('files', file));

    if (category) {
      formData.append('category', category);
    }

    return this.http.post<BuildingDocumentDTO[]>(`${this.apiUrl}/${buildingId}/documents`, formData);
  }

  uploadBuildingImage(buildingId: number, file: File): Observable<{ imageUrl: string }> {
    const formData = new FormData();
    formData.append('file', file);

    return this.http.post<{ imageUrl: string }>(`${this.apiUrl}/${buildingId}/image`, formData);
  }

  setBuildingActive(buildingId: number, active: boolean): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${buildingId}/active?active=${active}`, {});
  }

  getByCode(code: string) {
    return this.http.get<{ buildingId: number }>(`${this.apiUrl}/by-code/${encodeURIComponent(code)}`);
  }

  getMyCompanyBuildings(): Observable<BuildingDTO[]> {
    return this.http.get<BuildingDTO[]>(`${this.apiUrl}/pm/my-company-buildings`);
  }

  // Building Update & Deletion
  deleteBuilding(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  deleteDraftBuilding(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}/draft`);
  }

  updateBuilding(id: number, building: BuildingDTO): Observable<BuildingDTO> {
    return this.http.put<BuildingDTO>(`${this.apiUrl}/update/${id}`, building);
  }

  joinByCode(code: string) {
    return this.http.post<{ buildingId: number }>(`${this.apiUrl}/join-by-code?code=${encodeURIComponent(code)}`, {});
  }

  getAllBuildingsForAdmin(): Observable<BuildingDTO[]> {
  return this.http.get<BuildingDTO[]>(`${this.apiUrl}/admin/all`);
}

  getMemberPermissions(buildingId: number): Observable<MemberPermissionDTO[]> {
    return this.http.get<MemberPermissionDTO[]>(`${this.apiUrl}/${buildingId}/member-permissions`);
  }

  getMyPermissions(buildingId: number): Observable<MemberPermissionDTO> {
    return this.http.get<MemberPermissionDTO>(`${this.apiUrl}/${buildingId}/my-permissions`);
  }

  updateMemberPermission(
    buildingId: number,
    userId: number,
    permission: Partial<MemberPermissionDTO>
  ): Observable<MemberPermissionDTO> {
    return this.http.put<MemberPermissionDTO>(
      `${this.apiUrl}/${buildingId}/member-permissions/${userId}`,
      permission
    );
  }
  
}
