import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PaymentDTO } from '../models/paymentDTO';
import { StatementUserPaymentDTO } from '../models/StatementUserPaymentDTO';
import { CommonStatementSummaryDTO } from '../models/commonExpenseSummaryDTO';

@Injectable({ providedIn: 'root' })
export class PaymentService {
  private apiUrl = 'http://localhost:8080/api/v1/payments';

  constructor(private http: HttpClient) {}

  getPaymentsForStatement(statementId: number, size = 50): Observable<PaymentDTO[]> {
    return this.http.get<PaymentDTO[]>(`${this.apiUrl}/statement/${statementId}?size=${size}`);
  }

  getRecentByBuilding(buildingId: number, size = 10): Observable<PaymentDTO[]> {
    return this.http.get<PaymentDTO[]>(`${this.apiUrl}/recent/${buildingId}?size=${size}`);
  }

  createPayment(payload: PaymentDTO) {
    return this.http.post(this.apiUrl, payload);
  }

  getUserPaymentsByStatement(statementId: number): Observable<StatementUserPaymentDTO[]> {
    return this.http.get<StatementUserPaymentDTO[]>(`${this.apiUrl}/statement/${statementId}/users`);
  }

  getBuildingSummary(buildingId: number): Observable<CommonStatementSummaryDTO> {
    return this.http.get<CommonStatementSummaryDTO>(`${this.apiUrl}/building/${buildingId}/summary`);
  }

  getCurrentMonthByBuilding(buildingId: number): Observable<StatementUserPaymentDTO[]> {
  return this.http.get<StatementUserPaymentDTO[]>(`${this.apiUrl}/building/${buildingId}/current-month`);
}
}
