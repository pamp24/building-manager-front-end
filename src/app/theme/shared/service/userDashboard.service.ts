/* eslint-disable @typescript-eslint/no-explicit-any */
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ChartDTO } from '../models/chartDTO';

export interface UserDashboardSummary {
  latestDebt: number;
  statementId: number | null;
  statementMonth: string | null;
  role: string | null;
}

@Injectable({
  providedIn: 'root'
})
export class UserDashboardService {
  private baseUrl = 'http://localhost:8080/api/v1/dashboard/user';

  constructor(private http: HttpClient) {}

  getDashboard(): Observable<UserDashboardSummary> {
    return this.http.get<UserDashboardSummary>(this.baseUrl);
  }

  getHistory(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/history`);
  }

  getLastStatementItems() {
    return this.http.get<any[]>(`${this.baseUrl}/last-statement-items`);
  }

  getChartData(type: 'building' | 'apartment', period: 'month' | 'year') {
    return this.http.get<ChartDTO>(`${this.baseUrl}/chart?type=${type}&period=${period}`);
  }

  getMiniStatementChart() {
    return this.http.get<any>(`${this.baseUrl}/statement-mini-chart`);
  }

  getUnpaidForApartment() {
    return this.http.get<number>(`${this.baseUrl}/unpaid`);
  }

  payAllocation(id: number, amount: number) {
    return this.http.patch(`/expenses/allocations/${id}/pay`, { amount });
  }
  getBuildingPending() {
    return this.http.get<any>(`${this.baseUrl}/building-pending`);
  }

  getUserStatements() {
  return this.http.get<any[]>(`${this.baseUrl}/statements`);
}
}
