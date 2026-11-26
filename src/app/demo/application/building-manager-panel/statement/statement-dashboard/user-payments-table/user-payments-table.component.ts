import { UiLocaleService } from 'src/app/theme/shared/service/ui-locale.service';
import { inject, Component, EventEmitter, Input, Output } from '@angular/core';

import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { StatementUserPaymentDTO } from 'src/app/theme/shared/models/StatementUserPaymentDTO';

@Component({
  selector: 'app-user-payments-table',
  standalone: true,
  imports: [CommonModule, SharedModule],
  templateUrl: './user-payments-table.component.html',
  styleUrls: ['./user-payments-table.component.scss']
})
export class UserPaymentsTableComponent {
  private readonly uiLocale = inject(UiLocaleService);

  @Input() statementUserPayments: StatementUserPaymentDTO[] = [];
  @Input() currentMonthLabel!: string;
  @Input() paymentsLoading = false;
  @Input() isManager = false;
  @Output() editUser = new EventEmitter<StatementUserPaymentDTO>();

  translateStatus(status: string): string {
    switch (status) {
      case 'PAID':
        return this.uiLocale.text('Paid');
      case 'PARTIALLY_PAID':
        return this.uiLocale.text('Partially paid');
      case 'PENDING':
      case 'UNPAID':
        return this.uiLocale.text('Pending');
      default:
        return this.uiLocale.text('Unknown status');
    }
  }

  translatePaymentMethod(method: string): string {
    switch (method) {
      case 'CASH':
        return this.uiLocale.text('Cash');
      case 'BANK_TRANSFER':
        return this.uiLocale.text('Bank transfer');
      case 'CARD':
        return this.uiLocale.text('Card');
      case 'ONLINE':
        return this.uiLocale.text('Electronic payment');
      default:
        return '-';
    }
  }

  getFloorLabel(floor: string | number | null): string {
    if (!floor) return '';
    const map: Record<string, string> = {
      '0': 'Ι',
      '1': 'Α',
      '2': 'Β',
      '3': 'Γ',
      '4': 'Δ',
      '5': 'Ε',
      '6': this.uiLocale.text('ST'),
      '7': 'Ζ',
      '8': 'Η',
      '9': 'Θ',
      '10': 'Ι'
    };
    return map[floor.toString()] || floor.toString();
  }

  onEdit(p: StatementUserPaymentDTO): void {
    this.editUser.emit(p);
  }
}
