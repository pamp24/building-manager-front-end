import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ManagerDashboardDTO } from '../models/managerDashboardDTO';


@Injectable({ providedIn: 'root' })
export class ManagerDashboardService {
  private apiUrl = `${environment.apiUrl}/api/v1/dashboard`;

  constructor(private http: HttpClient) {}

  getDashboardForBuilding(buildingId: number): Observable<ManagerDashboardDTO> {
    return this.http.get<ManagerDashboardDTO>(`${this.apiUrl}/building/${buildingId}`);
  }
}