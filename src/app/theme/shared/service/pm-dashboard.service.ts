import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {
  PmBuildingManagerRowDTO,
  PmDashboardDTO,
  PmExpenseCollectionRateDTO,
  PmFinancialChartDTO,
  PmMembershipStatsDTO
} from '../models/pmDashboardDTO';

@Injectable({
  providedIn: 'root'
})
export class PmDashboardService {
  private api = 'http://localhost:8080/api/v1/pm/dashboard';

  constructor(private http: HttpClient) {}

  getDashboard(): Observable<PmDashboardDTO> {
    return this.http.get<PmDashboardDTO>(this.api);
  }

  getFinancialChart(period: string): Observable<PmFinancialChartDTO> {
    return this.http.get<PmFinancialChartDTO>(`${this.api}/financial-chart`, {
      params: { period }
    });
  }

  getExpenseCollectionRate(period: string) {
    return this.http.get<PmExpenseCollectionRateDTO>(`${this.api}/expense-collection-rate?period=${period}`);
  }

  getMembershipStats() {
    return this.http.get<PmMembershipStatsDTO>(`${this.api}/membership-stats`);
  }

  getBuildingManagers() {
    return this.http.get<PmBuildingManagerRowDTO[]>(`${this.api}/building-managers`);
  }
}
