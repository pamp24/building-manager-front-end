import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { BuildingFinanceDTO } from '../models/buildingFinanceDTO';

@Injectable({ providedIn: 'root' })
export class FinanceService {
  private baseUrl = `${environment.apiUrl}/api/v1/finance`;

  constructor(private http: HttpClient) {}

  getMyBuildingFinance(): Observable<BuildingFinanceDTO> {
    return this.http.get<BuildingFinanceDTO>(`${this.baseUrl}/my-building`);
  }

  getBuildingFinance(buildingId: number): Observable<BuildingFinanceDTO> {
    return this.http.get<BuildingFinanceDTO>(`${this.baseUrl}/building/${buildingId}`);
  }
}
