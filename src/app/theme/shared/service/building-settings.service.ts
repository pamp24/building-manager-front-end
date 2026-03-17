import { Injectable } from '@angular/core';
import { BuildingNotificationSettingsDTO } from '../models/buildingNotificationSettingsDTO';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class BuildingSettingsService {
  private apiUrl = 'http://localhost:8080/api/v1/buildings';

  constructor(private http: HttpClient) {}
  
  getNotificationSettings(buildingId: number): Observable<BuildingNotificationSettingsDTO> {
    return this.http.get<BuildingNotificationSettingsDTO>(`${this.apiUrl}/${buildingId}/notification-settings`);
  }

  updateNotificationSettings(buildingId: number, payload: BuildingNotificationSettingsDTO): Observable<BuildingNotificationSettingsDTO> {
    return this.http.put<BuildingNotificationSettingsDTO>(`${this.apiUrl}/${buildingId}/notification-settings`, payload);
  }
}
