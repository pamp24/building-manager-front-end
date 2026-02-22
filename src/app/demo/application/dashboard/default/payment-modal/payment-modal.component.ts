/* eslint-disable @typescript-eslint/no-explicit-any */

import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Input } from '@angular/core';
import { OnInit } from '@angular/core';

@Component({
  selector: 'app-payment-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './payment-modal.component.html'
})
export class PaymentModalComponent implements OnInit {
  @Input() allocation: any;
  paymentAmount = 0;
  fullAmount = false;

  selectedCard: number | null = null;

  cards = [
    { id: 1, name: 'Eurobank', masked: '•••• 5489' },
    { id: 2, name: 'National Bank', masked: '•••• 1123' },
    { id: 3, name: 'Revolut', masked: '•••• 9001' }
  ];

  constructor(public activeModal: NgbActiveModal) {}

  ngOnInit() {
    this.paymentAmount = this.allocation.amount;
  }

  confirmPay() {
    this.activeModal.close(this.paymentAmount);
  }

  toggleFullAmount() {
    if (this.fullAmount) {
      this.paymentAmount = this.allocation.remainingAmount;
    }
  }
}
