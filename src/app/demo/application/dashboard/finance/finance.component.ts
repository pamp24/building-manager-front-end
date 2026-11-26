import { UiLocaleService } from 'src/app/theme/shared/service/ui-locale.service';
import { inject, Component, OnInit } from '@angular/core';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { RouterModule } from '@angular/router';
import { FinanceService } from 'src/app/theme/shared/service/finance.service';
import { BuildingFinanceDTO, PaymentDTO } from 'src/app/theme/shared/models/buildingFinanceDTO';

@Component({
  selector: 'app-finance',
  standalone: true,
  imports: [CommonModule, FormsModule, SharedModule, RouterModule],
  templateUrl: './finance.component.html',
  styleUrl: './finance.component.scss'
})
export class FinanceComponent implements OnInit {
  private readonly uiLocale = inject(UiLocaleService);

  finance: BuildingFinanceDTO | null = null;
  loading = true;
  error = '';

  constructor(private financeService: FinanceService) {}

  ngOnInit(): void {
    this.loadFinance();
  }

  loadFinance(): void {
    this.financeService.getMyBuildingFinance().subscribe({
      next: (data) => {
        this.finance = data;
        this.loading = false;
      },
      error: () => {
        this.error = this.uiLocale.text('Could not load financial data. Please try again.');
        this.loading = false;
      }
    });
  }

  statusBadge(status: string): string {
    switch (status) {
      case 'PAID':
        return 'badge bg-success';
      case 'PARTIALLY_PAID':
        return 'badge bg-warning';
      case 'UNPAID':
        return 'badge bg-danger';
      default:
        return 'badge bg-secondary';
    }
  }

  statusLabel(status: string): string {
    switch (status) {
      case 'PAID':
        return this.uiLocale.text('Paid');
      case 'PARTIALLY_PAID':
        return this.uiLocale.text('Partial');
      case 'UNPAID':
        return this.uiLocale.text('Unpaid');
      default:
        return status;
    }
  }

  categoryLabel(cat: string): string {
    const labels: Record<string, string> = {
      COMMON: 'Common Expenses',
      HEATING: 'Heating',
      ELEVATOR: 'Elevator',
      EQUAL: 'Equal Share',
      BOILER: 'Boiler',
      SPECIAL: 'Special',
      OWNERS: 'Owners',
      OTHER: 'Other'
    };
    return labels[cat] || cat;
  }

  get collectionRateWidth(): string {
    if (!this.finance) return '0%';
    return Math.min(this.finance.collectionRate, 100) + '%';
  }

  get recentPayments(): PaymentDTO[] {
    if (!this.finance?.recentPayments) return [];
    return this.finance.recentPayments.slice(0, 8);
  }

  get maxCategoryAmount(): number {
    if (!this.finance?.currentMonthExpenses?.length) return 1;
    return Math.max(...this.finance.currentMonthExpenses.map((e) => e.totalAmount), 1);
  }
}
