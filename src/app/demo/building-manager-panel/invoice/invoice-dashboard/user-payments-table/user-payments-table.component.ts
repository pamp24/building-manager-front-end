import { Component, EventEmitter, Input, Output } from '@angular/core';
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
  @Input() statementUserPayments: StatementUserPaymentDTO[] = [];
  @Input() currentMonthLabel!: string;
  @Input() paymentsLoading = false;
  @Output() editUser = new EventEmitter<StatementUserPaymentDTO>();

  translateStatus(status: string): string {
    switch (status) {
      case 'PAID':
        return 'Πληρωμένο';
      case 'PARTIALLY_PAID':
        return 'Μερικώς πληρωμένο';
      case 'PENDING':
      case 'UNPAID':
        return 'Σε εκκρεμότητα';
      default:
        return 'Άγνωστη κατάσταση';
    }
  }

  translatePaymentMethod(method: string): string {
    switch (method) {
      case 'CASH':
        return 'Μετρητά';
      case 'BANK_TRANSFER':
        return 'Τραπεζική μεταφορά';
      case 'CARD':
        return 'Κάρτα';
      case 'ONLINE':
        return 'Ηλεκτρονική πληρωμή';
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
      '6': 'ΣΤ',
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
