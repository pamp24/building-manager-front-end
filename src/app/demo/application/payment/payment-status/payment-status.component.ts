import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { PaymentService } from 'src/app/theme/shared/service/payment.service';
import { PaymentDTO } from 'src/app/theme/shared/models/paymentDTO';

@Component({
  selector: 'app-payment-status',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="container py-4">
      <div class="card shadow-sm" *ngIf="!loading; else loadingTpl">
        <div class="card-body text-center py-5">
          <div *ngIf="payment" class="payment-confirmed">
            <div class="status-icon success mb-3">&#10003;</div>
            <h3 class="mb-2">Payment Confirmed</h3>
            <p class="text-muted mb-4">Your payment has been processed successfully.</p>

            <div class="payment-details text-start mx-auto" style="max-width: 400px;">
              <div class="detail-row"><span class="label">Amount</span><span class="value">{{ payment.amount | currency:'EUR' }}</span></div>
              <div class="detail-row"><span class="label">Method</span><span class="value">{{ payment.paymentMethod }}</span></div>
              <div class="detail-row" *ngIf="payment.referenceNumber"><span class="label">Reference</span><span class="value">{{ payment.referenceNumber }}</span></div>
              <div class="detail-row" *ngIf="payment.gateway"><span class="label">Gateway</span><span class="value">{{ payment.gateway }}</span></div>
              <div class="detail-row" *ngIf="payment.gatewayTransactionId"><span class="label">Transaction ID</span><span class="value" style="font-size: 12px;">{{ payment.gatewayTransactionId }}</span></div>
              <div class="detail-row" *ngIf="payment.gatewayStatus"><span class="label">Status</span><span class="value">{{ payment.gatewayStatus }}</span></div>
              <div class="detail-row"><span class="label">Date</span><span class="value">{{ paymentDate }}</span></div>
            </div>

            <div class="mt-4">
              <a routerLink="/statement/{{ payment.statementId }}" class="btn btn-outline-primary me-2">View Statement</a>
              <a routerLink="/dashboard/default" class="btn btn-primary">Back to Dashboard</a>
            </div>
          </div>

          <div *ngIf="!payment && !errorMsg" class="py-4">
            <div class="status-icon pending mb-3">&#8987;</div>
            <h3 class="mb-2">Processing Payment</h3>
            <p class="text-muted">Your payment is being processed. This page will update automatically.</p>
          </div>

          <div *ngIf="errorMsg" class="py-4">
            <div class="status-icon error mb-3">&#10007;</div>
            <h3 class="mb-2">Payment Error</h3>
            <p class="text-danger">{{ errorMsg }}</p>
            <a routerLink="/dashboard/default" class="btn btn-primary mt-2">Back to Dashboard</a>
          </div>
        </div>
      </div>

      <ng-template #loadingTpl>
        <div class="text-center py-5">
          <div class="spinner-border text-primary mb-3" role="status"></div>
          <p class="text-muted">Loading payment details...</p>
        </div>
      </ng-template>
    </div>
  `,
  styles: [`
    .status-icon {
      width: 72px; height: 72px; border-radius: 50%;
      display: flex; align-items: center; justify-content: center;
      margin: 0 auto; font-size: 32px; font-weight: 700;
    }
    .status-icon.success { background: #e8f5e9; color: #2e7d32; }
    .status-icon.pending { background: #fff3e0; color: #e65100; }
    .status-icon.error { background: #ffebee; color: #c62828; }
    .payment-details { background: #f5f5f5; border-radius: 8px; padding: 16px; }
    .detail-row { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #e0e0e0; }
    .detail-row:last-child { border-bottom: none; }
    .detail-row .label { color: #757575; font-size: 13px; }
    .detail-row .value { font-weight: 600; font-size: 14px; }
  `]
})
export class PaymentStatusComponent implements OnInit {
  payment: PaymentDTO | null = null;
  loading = true;
  errorMsg = '';
  paymentDate = '';

  constructor(
    private route: ActivatedRoute,
    private paymentService: PaymentService
  ) {}

  ngOnInit(): void {
    const statementId = this.route.snapshot.queryParamMap.get('statementId');
    if (statementId) {
      this.loadPayment(+statementId);
    } else {
      this.loading = false;
      this.errorMsg = 'No payment reference found.';
    }
  }

  private loadPayment(statementId: number): void {
    this.paymentService.getPaymentsForStatement(statementId).subscribe({
      next: (payments) => {
        if (payments.length > 0) {
          this.payment = payments[0];
          this.paymentDate = new Date().toLocaleDateString();
        }
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.errorMsg = 'Could not load payment details. Please contact support.';
      }
    });
  }
}
