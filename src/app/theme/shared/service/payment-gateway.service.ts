import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

export interface CreateIntentRequest {
  statementId: number;
  userId: number;
  apartmentId: number;
  amount: number;
  gateway: string;
  returnUrl?: string;
  cancelUrl?: string;
}

export interface CreateIntentResponse {
  clientSecret?: string;
  gatewayTransactionId?: string;
  checkoutUrl?: string;
  gateway: string;
}

@Injectable({ providedIn: 'root' })
export class PaymentGatewayService {
  private baseUrl = `${environment.apiUrl}/api/v1/payments`;

  constructor(private http: HttpClient) {}

  createIntent(req: CreateIntentRequest): Observable<CreateIntentResponse> {
    return this.http.post<CreateIntentResponse>(`${this.baseUrl}/create-intent`, req);
  }
}
