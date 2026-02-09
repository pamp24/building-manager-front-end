import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { PaymentDTO } from 'src/app/theme/shared/models/paymentDTO';
import { Router } from '@angular/router';

@Component({
  selector: 'app-recent-payments',
  standalone: true,
  imports: [CommonModule, SharedModule],
  templateUrl: './recent-payments.component.html',
  styleUrls: ['./recent-payments.component.scss']
})
export class RecentPaymentsComponent {
  @Input() recentPayments: PaymentDTO[] = [];

  constructor(private router: Router) {}

  goToInvoiceList(): void {
    this.router.navigate(['/invoice/list']);
  }
}