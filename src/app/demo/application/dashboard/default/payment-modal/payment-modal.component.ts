/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { PaymentGatewayService, CreateIntentRequest } from 'src/app/theme/shared/service/payment-gateway.service';
import { UserDashboardService } from 'src/app/theme/shared/service/userDashboard.service';
import { StripeCheckoutComponent } from '../../../payment/stripe-checkout/stripe-checkout.component';
import { PaymentMethodSelectionComponent, PaymentMethod } from '../../../payment/payment-method-selection/payment-method-selection.component';

@Component({
  selector: 'app-payment-modal',
  standalone: true,
  imports: [CommonModule, FormsModule, StripeCheckoutComponent, PaymentMethodSelectionComponent],
  templateUrl: './payment-modal.component.html'
})
export class PaymentModalComponent implements OnInit {
  @Input() allocation: any;
  @Input() currentUserId = 0;

  step: 'form' | 'stripe' | 'processing' | 'done' | 'error' = 'form';
  selectedMethod: PaymentMethod = 'stripe';
  paymentAmount = 0;
  fullAmount = false;
  errorMessage = '';
  clientSecret = '';
  returnUrl = '';

  constructor(
    public activeModal: NgbActiveModal,
    private paymentGateway: PaymentGatewayService,
    private dashboardService: UserDashboardService
  ) {}

  ngOnInit() {
    this.paymentAmount = this.allocation?.amount || 0;
    this.returnUrl = `${window.location.origin}/payment/complete?statementId=${this.allocation?.statementId}`;
  }

  toggleFullAmount() {
    if (this.fullAmount) {
      this.paymentAmount = this.allocation?.remainingAmount || this.allocation?.amount || 0;
    }
  }

  onMethodChange(method: PaymentMethod) {
    this.selectedMethod = method;
  }

  proceedWithPayment() {
    if (this.selectedMethod === 'stripe') {
      this.initStripePayment();
    } else if (this.selectedMethod === 'viva') {
      this.initVivaPayment();
    } else {
      this.initOfflinePayment();
    }
  }

  private initStripePayment() {
    this.step = 'processing';
    this.errorMessage = '';

    const req: CreateIntentRequest = {
      statementId: this.allocation.statementId,
      userId: this.currentUserId,
      apartmentId: this.allocation.apartmentId || 0,
      amount: this.paymentAmount,
      gateway: 'stripe',
      returnUrl: this.returnUrl,
      cancelUrl: window.location.href
    };

    this.paymentGateway.createIntent(req).subscribe({
      next: (res) => {
        if (res.clientSecret) {
          this.clientSecret = res.clientSecret;
          this.step = 'stripe';
        } else {
          this.step = 'error';
          this.errorMessage = 'Failed to initialize payment. No client secret received.';
        }
      },
      error: (err) => {
        this.step = 'error';
        this.errorMessage = err.error?.message || 'Failed to initialize payment. Please try again.';
      }
    });
  }

  private initVivaPayment() {
    this.step = 'processing';
    this.errorMessage = '';

    const req: CreateIntentRequest = {
      statementId: this.allocation.statementId,
      userId: this.currentUserId,
      apartmentId: this.allocation.apartmentId || 0,
      amount: this.paymentAmount,
      gateway: 'viva',
      returnUrl: this.returnUrl,
      cancelUrl: window.location.href
    };

    this.paymentGateway.createIntent(req).subscribe({
      next: (res) => {
        if (res.checkoutUrl) {
          window.location.href = res.checkoutUrl;
        } else {
          this.step = 'error';
          this.errorMessage = 'Failed to initialize Viva Wallet checkout.';
        }
      },
      error: (err) => {
        this.step = 'error';
        this.errorMessage = err.error?.message || 'Failed to initialize payment. Please try again.';
      }
    });
  }

  private initOfflinePayment() {
    this.step = 'processing';
    this.errorMessage = '';

    this.dashboardService.payAllocation(this.allocation.id, this.paymentAmount).subscribe({
      next: () => {
        this.step = 'done';
      },
      error: (err) => {
        this.step = 'error';
        this.errorMessage = err.error?.message || 'Payment failed. Please try again.';
      }
    });
  }

  onPaymentSuccess() {
    this.step = 'done';
    this.activeModal.close(this.paymentAmount);
  }

  onPaymentError(msg: string) {
    this.step = 'error';
    this.errorMessage = msg;
  }

  retry() {
    this.step = 'form';
    this.errorMessage = '';
  }

  close() {
    this.activeModal.dismiss();
  }
}
