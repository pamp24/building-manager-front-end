import { Component, EventEmitter, Output, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

export type PaymentMethod = 'stripe' | 'viva' | 'cash' | 'bank_transfer';

@Component({
  selector: 'app-payment-method-selection',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="payment-methods">
      <label
        *ngFor="let method of methods"
        class="payment-method-option"
        [class.selected]="selected === method.value"
        [class.disabled]="method.disabled"
      >
        <input
          type="radio"
          name="paymentMethod"
          [value]="method.value"
          [(ngModel)]="selected"
          (change)="onSelect(method.value)"
          [disabled]="method.disabled"
        />
        <div class="method-content">
          <span class="method-icon">{{ method.icon }}</span>
          <div class="method-info">
            <span class="method-label">{{ method.label }}</span>
            <span class="method-desc">{{ method.description }}</span>
          </div>
        </div>
      </label>
    </div>
  `,
  styles: [`
    .payment-methods { display: flex; flex-direction: column; gap: 8px; }
    .payment-method-option {
      display: flex; align-items: center; gap: 12px;
      padding: 14px 16px; border: 2px solid #e0e0e0; border-radius: 8px;
      cursor: pointer; transition: all 0.2s;
    }
    .payment-method-option:hover { border-color: #3949ab; background: #f5f5f5; }
    .payment-method-option.selected { border-color: #3949ab; background: #e8eaf6; }
    .payment-method-option.disabled { opacity: 0.5; cursor: not-allowed; }
    .payment-method-option input { display: none; }
    .method-content { display: flex; align-items: center; gap: 14px; width: 100%; }
    .method-icon { font-size: 22px; width: 40px; text-align: center; }
    .method-info { display: flex; flex-direction: column; }
    .method-label { font-weight: 600; font-size: 14px; color: #1a1a1a; }
    .method-desc { font-size: 12px; color: #757575; }
  `]
})
export class PaymentMethodSelectionComponent {
  @Input() selected: PaymentMethod = 'stripe';
  @Output() methodChange = new EventEmitter<PaymentMethod>();

  readonly methods = [
    { value: 'stripe' as PaymentMethod, label: 'Stripe', description: 'Credit / debit card, Google Pay, Apple Pay', icon: '💳', disabled: false },
    { value: 'viva' as PaymentMethod, label: 'Viva Wallet', description: 'Pay with Viva Wallet hosted checkout', icon: '🌐', disabled: false },
    { value: 'cash' as PaymentMethod, label: 'Cash', description: 'Pay in cash to the building manager', icon: '💵', disabled: false },
    { value: 'bank_transfer' as PaymentMethod, label: 'Bank Transfer', description: 'Direct bank transfer', icon: '🏦', disabled: false }
  ];

  onSelect(value: PaymentMethod): void {
    this.selected = value;
    this.methodChange.emit(value);
  }
}
