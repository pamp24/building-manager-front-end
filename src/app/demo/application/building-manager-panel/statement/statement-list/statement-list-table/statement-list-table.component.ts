import { UiLocaleService } from 'src/app/theme/shared/service/ui-locale.service';
import { Component, EventEmitter, Input, OnChanges, Output, inject } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { IconService } from '@ant-design/icons-angular';
import { CaretDownOutline, CaretUpOutline, DeleteOutline, EyeOutline } from '@ant-design/icons-angular/icons';
import { CommonExpenseStatement } from 'src/app/theme/shared/models/commonExpenseStatement';
import { CommonExpenseStatementService } from 'src/app/theme/shared/service/commonExpensesStatement.service';
import { SortDirection } from 'src/app/theme/shared/directive/sortable.directive';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { StatementViewComponent } from './statement-view/statement-view.component';
import { StatementApartmentViewComponent } from './statement-apartment-view/statement-apartment-view.component';
import { PaymentService } from 'src/app/theme/shared/service/payment.service';
import { StatementUserPaymentDTO } from 'src/app/theme/shared/models/StatementUserPaymentDTO';
import { StatementPaymentComponent } from './statement-payment/statement-payment.component';
import { PaymentDTO } from 'src/app/theme/shared/models/paymentDTO';
import { ApartmentDTO } from 'src/app/theme/shared/models/apartmentDTO';

@Component({
  selector: 'app-statement-list-table',
  imports: [SharedModule],
  templateUrl: './statement-list-table.component.html',
  styleUrl: './statement-list-table.component.scss',
  providers: [DecimalPipe]
})
export class StatementListTableComponent implements OnChanges {
  private readonly uiLocale = inject(UiLocaleService);

  private iconService = inject(IconService);

  @Input() statements: CommonExpenseStatement[] = [];
  @Input() isManagementRole = false;
  @Input() myApartments: ApartmentDTO[] = [];
  @Output() refreshRequested = new EventEmitter<void>();
  Math = Math;

  filteredStatements: CommonExpenseStatement[] = [];
  loading = false;
  expandedStatementId: number | null = null;
  statementUserPayments: StatementUserPaymentDTO[] = [];
  paymentsLoading = false;
  page = 1;
  pageSize = 5;
  total = 0;
  searchTerm = '';
  sortColumn: keyof CommonExpenseStatement | '' = '';
  sortDirection: SortDirection = '';

  constructor(
    private modalService: NgbModal,
    private commonStatementService: CommonExpenseStatementService,
    private paymentService: PaymentService
  ) {
    this.iconService.addIcon(...[EyeOutline, DeleteOutline, CaretDownOutline, CaretUpOutline]);
  }

  ngOnChanges() {
    this.applyFilters();
  }

  applyFilters() {
    let result = [...this.statements];

    if (this.searchTerm) {
      const term = this.searchTerm.toLowerCase();
      result = result.filter(
        (st) =>
          st.code?.toLowerCase().includes(term) ||
          st.month?.toLowerCase().includes(term) ||
          st.description?.toLowerCase().includes(term) ||
          st.status?.toLowerCase().includes(term)
      );
    }

    if (this.sortColumn && this.sortDirection) {
      result.sort((a, b) => {
        const column = this.sortColumn as keyof CommonExpenseStatement;
        const valA = a[column] ?? '';
        const valB = b[column] ?? '';
        if (valA < valB) return this.sortDirection === 'asc' ? -1 : 1;
        if (valA > valB) return this.sortDirection === 'asc' ? 1 : -1;
        return 0;
      });
    } else {
      result.sort((a, b) => {
        const dateA = a.startDate ? new Date(a.startDate).getTime() : 0;
        const dateB = b.startDate ? new Date(b.startDate).getTime() : 0;
        return dateB - dateA;
      });
    }

    this.total = result.length;
    const start = (this.page - 1) * this.pageSize;
    this.filteredStatements = result.slice(start, start + this.pageSize);
  }

  onSearchChange() {
    this.page = 1;
    this.applyFilters();
  }

  onPageChange(page: number) {
    this.page = page;
    this.applyFilters();
  }

  onSort(column: keyof CommonExpenseStatement) {
    if (this.sortColumn === column) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : this.sortDirection === 'desc' ? '' : 'asc';
    } else {
      this.sortColumn = column;
      this.sortDirection = 'asc';
    }
    this.applyFilters();
  }

  getSortIcon(column: keyof CommonExpenseStatement) {
    if (this.sortColumn !== column) return '';
    return this.sortDirection === 'asc' ? '↑' : this.sortDirection === 'desc' ? '↓' : '';
  }

  translateStatus(status: string | undefined, isPaid?: boolean): string {
    if (isPaid) return this.uiLocale.text('It was paid');
    switch (status) {
      case 'PAID':
        return this.uiLocale.text('It was paid');
      case 'ISSUED':
        return this.uiLocale.text('Current');
      case 'EXPIRED':
        return this.uiLocale.text("It's over");
      case 'CLOSED':
        return this.uiLocale.text('Canceled');
      case 'DRAFT':
        return this.uiLocale.text('Draft');
      case 'PARTIALLY_PAID':
        return this.uiLocale.text('Partially Paid');
      case 'PENDING':
        return this.uiLocale.text('It is pending');
      default:
        return status ?? '';
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

  onView(statement: CommonExpenseStatement) {
    const modalRef = this.modalService.open(StatementViewComponent, { size: 'xl' });
    modalRef.componentInstance.statement = statement;
  }

  onViewApartment(statement: CommonExpenseStatement) {
    const apartment = this.getMyApartmentForStatement(statement);
    if (!statement.id || !apartment?.id) return;

    const modalRef = this.modalService.open(StatementApartmentViewComponent, { size: 'xl' });
    modalRef.componentInstance.statement = statement;
    modalRef.componentInstance.apartmentId = apartment.id;
  }

  onDelete(statement: CommonExpenseStatement) {
    if (!statement.id) return;

    const confirmed = confirm(this.uiLocale.text('Are you sure you want to cancel the {{p0}} document?', { p0: statement.code }));
    if (!confirmed) return;

    this.commonStatementService.deleteStatement(statement.id).subscribe({
      next: () => {
        statement.status = 'CLOSED';
        statement.active = false;
        this.applyFilters();
        this.refreshRequested.emit();
        alert(this.uiLocale.text('The document was successfully cancelled.'));
      },
      error: (err) => {
        console.error('Σφάλμα διαγραφής:', err);
        alert(this.uiLocale.text('An error occurred while canceling the document.'));
      }
    });
  }

  togglePayments(statementId: number | undefined) {
    if (!statementId) return;
    if (this.expandedStatementId === statementId) {
      this.expandedStatementId = null;
      this.statementUserPayments = [];
      return;
    }

    this.expandedStatementId = statementId;
    this.paymentsLoading = true;

    this.paymentService.getUserPaymentsByStatement(statementId).subscribe({
      next: (data) => {
        this.statementUserPayments = data;
        this.paymentsLoading = false;
      },
      error: (err) => {
        console.error('Σφάλμα φόρτωσης πληρωμών:', err);
        this.paymentsLoading = false;
      }
    });
  }

  getFloorLabel(floor: string): string {
    const map: Record<string, string> = {
      Ισόγειο: 'Ι',
      Υπόγειο: 'Υ',
      Ημιόροφος: 'Η'
    };
    return map[floor] ?? floor;
  }

  onEditUser(payment: StatementUserPaymentDTO): void {
    if (payment.status === 'PAID') {
      alert(this.uiLocale.text('The user has already fully paid for this document.'));
      return;
    }

    const modalRef = this.modalService.open(StatementPaymentComponent, {
      size: 'md',
      backdrop: 'static'
    });

    modalRef.componentInstance.payment = {
      ...payment,
      statementId: this.expandedStatementId
    };

    modalRef.componentInstance.paymentSaved.subscribe((req: PaymentDTO) => {
      this.paymentsLoading = true;

      this.paymentService.createPayment(req).subscribe({
        next: (savedPayment) => {
          console.log('Πληρωμή καταχωρήθηκε:', savedPayment);
          this.paymentService.getUserPaymentsByStatement(this.expandedStatementId!).subscribe({
            next: (paymentsData) => {
              this.statementUserPayments = paymentsData;
              const currentStatement = this.statements.find((s) => s.id === this.expandedStatementId);
              if (currentStatement?.buildingId) {
                this.commonStatementService.getStatementsByBuilding(currentStatement.buildingId).subscribe({
                  next: (updatedStatements) => {
                    this.statements = updatedStatements;
                    this.applyFilters();
                    alert(this.uiLocale.text('Payment submitted successfully!'));
                  },
                  error: (err) => console.error('Σφάλμα κατά την επαναφόρτωση statements:', err),
                  complete: () => (this.paymentsLoading = false)
                });
              } else {
                this.paymentsLoading = false;
              }
            },
            error: (err) => {
              console.error('Σφάλμα κατά τη φόρτωση πληρωμών:', err);
              this.paymentsLoading = false;
            }
          });
        },
        error: (err) => {
          console.error('Σφάλμα αποθήκευσης πληρωμής:', err);
          this.paymentsLoading = false;
        }
      });
    });
  }

  hasAnyPayment(s: CommonExpenseStatement): boolean {
    return !!s.hasPayments;
  }

  getMyApartmentForStatement(statement: CommonExpenseStatement): ApartmentDTO | undefined {
    return this.myApartments.find((apartment) => apartment.buildingId === statement.buildingId);
  }
}
