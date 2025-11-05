import { Injectable } from '@angular/core';
import { CommonExpenseStatement } from '../models/commonExpenseStatement';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CommonExpenseStatementService {
  private baseUrl = 'http://localhost:8080/api/v1/expenses/statements';

  constructor(private http: HttpClient) {}

  createStatement(buildingId: number, statement: CommonExpenseStatement): Observable<CommonExpenseStatement> {
    return this.http.post<CommonExpenseStatement>(`${this.baseUrl}/${buildingId}/createAndSend`, statement);
  }

  getStatements(): Observable<CommonExpenseStatement[]> {
    return this.http.get<CommonExpenseStatement[]>(this.baseUrl);
  }

  getStatementsByBuilding(buildingId: number): Observable<CommonExpenseStatement[]> {
    return this.http.get<CommonExpenseStatement[]>(`${this.baseUrl}/building/${buildingId}/statement`);
  }
  getActiveStatementsByBuilding(buildingId: number) {
    return this.http.get<CommonExpenseStatement[]>(`${this.baseUrl}/building/${buildingId}/active`);
  }

  getStatementById(id: number): Observable<CommonExpenseStatement> {
    return this.http.get<CommonExpenseStatement>(`${this.baseUrl}/${id}`);
  }

  updateStatement(id: number, statement: CommonExpenseStatement): Observable<CommonExpenseStatement> {
    return this.http.put<CommonExpenseStatement>(`${this.baseUrl}/${id}`, statement);
  }

  deleteStatement(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
  getNextCode(buildingId: number) {
    return this.http.get<string>(`${this.baseUrl}/next-code/${buildingId}`, {
      responseType: 'text' as 'json' // Specify responseType as 'text'
    });
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  saveDraft(buildingId: number, statement: any) {
    return this.http.post<CommonExpenseStatement>(`${this.baseUrl}/${buildingId}/draft`, statement);
  }

  getExpenseCategories(buildingId: number, period: 'month' | 'year' | 'all'): Observable<{ category: string; totalAmount: number }[]> {
    return this.http.get<{ category: string; totalAmount: number }[]>(
      `http://localhost:8080/api/v1/expenses/building/${buildingId}/summary?period=${period}`
    );
  }
}
