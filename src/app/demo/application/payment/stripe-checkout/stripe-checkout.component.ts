import { Component, Input, OnInit, Output, EventEmitter, OnDestroy, ViewChild, ElementRef, NgZone } from '@angular/core';
import { CommonModule } from '@angular/common';
import { loadStripe, Stripe, StripeElements, StripePaymentElement } from '@stripe/stripe-js';
import { environment } from 'src/environments/environment';

export type StripeCheckoutState = 'loading' | 'ready' | 'processing' | 'succeeded' | 'error';

@Component({
  selector: 'app-stripe-checkout',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="stripe-checkout">
      <div *ngIf="state === 'loading'" class="stripe-loading">
        <div class="spinner-border text-primary" role="status"></div>
        <p>Loading payment form...</p>
      </div>

      <div *ngIf="state === 'ready' || state === 'processing'" class="stripe-form">
        <div #stripeElement class="stripe-element-wrapper"></div>
        <div *ngIf="errorMessage" class="alert alert-danger mt-2">{{ errorMessage }}</div>
        <button
          class="btn btn-primary w-100 mt-3"
          (click)="handleSubmit()"
          [disabled]="state === 'processing'"
        >
          <span *ngIf="state === 'processing'" class="spinner-border spinner-border-sm me-1"></span>
          {{ state === 'processing' ? 'Processing...' : 'Pay Now' }}
        </button>
      </div>

      <div *ngIf="state === 'succeeded'" class="stripe-success text-center py-3">
        <div class="text-success mb-2" style="font-size: 48px;">&#10003;</div>
        <h5>Payment Successful</h5>
        <p class="text-muted mb-0">Your payment has been processed.</p>
      </div>

      <div *ngIf="state === 'error' && !clientSecret" class="alert alert-danger">
        No payment client secret provided. Cannot initialize payment form.
      </div>
    </div>
  `,
  styles: [`
    .stripe-checkout { min-height: 200px; }
    .stripe-loading { text-align: center; padding: 40px 0; color: #757575; }
    .stripe-element-wrapper { padding: 12px; border: 1px solid #e0e0e0; border-radius: 6px; background: #fff; }
    .stripe-element-wrapper.StripeElement--focus { border-color: #3949ab; }
    .stripe-element-wrapper.StripeElement--invalid { border-color: #e53935; }
  `]
})
export class StripeCheckoutComponent implements OnInit, OnDestroy {
  @Input() clientSecret = '';
  @Input() returnUrl = '';
  @Output() paymentSuccess = new EventEmitter<void>();
  @Output() paymentError = new EventEmitter<string>();

  @ViewChild('stripeElement', { static: false }) stripeElementRef!: ElementRef;

  state: StripeCheckoutState = 'loading';
  errorMessage = '';

  private stripe: Stripe | null = null;
  private elements: StripeElements | null = null;
  private paymentElement: StripePaymentElement | null = null;

  constructor(private ngZone: NgZone) {}

  async ngOnInit(): Promise<void> {
    if (!this.clientSecret) {
      this.state = 'error';
      return;
    }
    await this.initStripe();
  }

  ngOnDestroy(): void {
    this.paymentElement?.destroy();
  }

  private async initStripe(): Promise<void> {
    try {
      this.stripe = await loadStripe(environment.stripePublishableKey);
      if (!this.stripe) {
        this.setError('Failed to load Stripe. Please try again.');
        return;
      }

      this.elements = this.stripe.elements({ clientSecret: this.clientSecret });
      this.paymentElement = this.elements.create('payment');

      setTimeout(() => {
        if (this.stripeElementRef) {
          this.paymentElement?.mount(this.stripeElementRef.nativeElement);
          this.ngZone.run(() => { this.state = 'ready'; });
        } else {
          this.setError('Payment form container not found.');
        }
      });
    } catch {
      this.setError('Failed to initialize payment form.');
    }
  }

  async handleSubmit(): Promise<void> {
    if (!this.stripe || !this.elements) return;

    this.ngZone.run(() => {
      this.state = 'processing';
      this.errorMessage = '';
    });

    const { error: submitError } = await this.elements.submit();
    if (submitError) {
      this.ngZone.run(() => {
        this.errorMessage = submitError.message || 'Invalid payment details.';
        this.state = 'ready';
      });
      return;
    }

    const { error: confirmError } = await this.stripe.confirmPayment({
      elements: this.elements,
      confirmParams: {
        return_url: this.returnUrl || `${window.location.origin}/payment/complete`
      },
      redirect: 'if_required'
    });

    if (confirmError) {
      this.ngZone.run(() => {
        this.errorMessage = confirmError.message || 'Payment failed. Please try again.';
        this.state = 'ready';
      });
      return;
    }

    this.ngZone.run(() => {
      this.state = 'succeeded';
      this.paymentSuccess.emit();
    });
  }

  private setError(msg: string): void {
    this.ngZone.run(() => {
      this.errorMessage = msg;
      this.state = 'error';
      this.paymentError.emit(msg);
    });
  }
}
