// angular import
import { Component, inject, Input } from '@angular/core';
import { DecimalPipe } from '@angular/common';

// project import
import { SharedModule } from 'src/app/theme/shared/shared.module';

// icon service
import { DeleteOutline, EditOutline, EyeOutline, CaretDownOutline, CaretUpOutline } from '@ant-design/icons-angular/icons';

import { IconService } from '@ant-design/icons-angular';
import { CommonExpenseStatement } from '../../../../../theme/shared/models/commonExpenseStatement';
import { CommonExpenseStatementService } from '../../../../../theme/shared/service/commonExpensesStatement.service';
import { SortDirection } from '../../../../../theme/shared/directive/sortable.directive';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { StatementViewComponent } from './statement-view/statement-view.component';
import { OnChanges } from '@angular/core';
import { PaymentService } from '../../../../../theme/shared/service/payment.service';
import { StatementUserPaymentDTO } from '../../../../../theme/shared/models/StatementUserPaymentDTO';
import { StatementPaymentComponent } from './statement-payment/statement-payment.component';
import { PaymentDTO } from '../../../../../theme/shared/models/paymentDTO';

@Component({
  selector: 'app-invoice-list-table',
  imports: [SharedModule],
  templateUrl: './invoice-list-table.component.html',
  styleUrl: './invoice-list-table.component.scss',
  providers: [DecimalPipe]
})
export class InvoiceListTableComponent implements OnChanges {
  private iconService = inject(IconService);
  @Input() statements: CommonExpenseStatement[] = [];

  filteredStatements: CommonExpenseStatement[] = [];
  loading = false;
  highlightRow: number | null = null;
  expandedStatementId: number | null = null;
  statementUserPayments: StatementUserPaymentDTO[] = [];
  paymentsLoading = false;

  // pagination
  page = 1;
  pageSize = 5;
  total = 0;

  // search
  searchTerm = '';

  // sorting
  sortColumn: keyof CommonExpenseStatement | '' = '';
  sortDirection: SortDirection = '';

  constructor(
    private modalService: NgbModal,
    private router: Router,
    private commonStatementService: CommonExpenseStatementService,
    private paymentService: PaymentService
  ) {
    this.iconService.addIcon(...[EyeOutline, EditOutline, DeleteOutline, CaretDownOutline, CaretUpOutline]);
  }

  ngOnChanges() {
    this.applyFilters(); // κάθε φορά που αλλάζει το Input ξαναφιλτράρουμε
  }

  applyFilters() {
    let result = [...this.statements];

    // φιλτράρισμα
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

    // ταξινόμηση
    if (this.sortColumn && this.sortDirection) {
      result.sort((a, b) => {
        if (this.sortColumn) {
          const valA = a[this.sortColumn as keyof CommonExpenseStatement] ?? '';
          const valB = b[this.sortColumn as keyof CommonExpenseStatement] ?? '';
          if (valA < valB) return this.sortDirection === 'asc' ? -1 : 1;
          if (valA > valB) return this.sortDirection === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }

    this.total = result.length;

    // pagination
    const start = (this.page - 1) * this.pageSize;
    const end = start + this.pageSize;
    this.filteredStatements = result.slice(start, end);
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
      // toggle asc/desc
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
    if (isPaid) return 'Πληρώθηκε';
    switch (status) {
      case 'PAID':
        return 'Πληρώθηκε';
      case 'ISSUED':
        return 'Εκδόθηκε';
      case 'EXPIRED':
        return 'Έληξε';
      case 'CLOSED':
        return 'Ακυρώθηκε';
      case 'DRAFT':
        return 'Πρόχειρο';
      case 'PARTIALLY_PAID':
        return 'Μερικώς Πληρωμένο';
      case 'PENDING':
        return 'Εκκρεμεί';

      default:
        return status ?? '';
    }
  }
  // Ενέργειες
  onView(statement: CommonExpenseStatement) {
    console.log('Modal statement:', statement);
    const modalRef = this.modalService.open(StatementViewComponent, { size: 'xl' });
    modalRef.componentInstance.statement = statement;
  }

  onEdit(statement: CommonExpenseStatement) {
    this.router.navigate(['/invoice/edit', statement.id]);
  }

  onDelete(statement: CommonExpenseStatement) {
    console.log('Διαγραφή:', statement);
    if (statement.id === undefined) {
      console.error('Το παραστατικό δεν έχει id και δεν μπορεί να διαγραφεί.');
      return;
    }
    if (confirm('Είσαι σίγουρος ότι θέλεις να διαγράψεις αυτό το παραστατικό;')) {
      this.commonStatementService.deleteStatement(statement.id).subscribe({
        next: () => {
          console.log('Διαγράφηκε');
          this.statements = this.statements.filter((s) => s.id !== statement.id);
        },
        error: (err) => console.error('Σφάλμα διαγραφής:', err)
      });
    }
  }

  togglePayments(statementId: number) {
    // Αν ήδη είναι ανοιχτό αυτό το statement → το κλείνουμε
    if (this.expandedStatementId === statementId) {
      this.expandedStatementId = null;
      this.statementUserPayments = [];
      return;
    }

    // Κλείνουμε όποιο άλλο ήταν ανοιχτό
    this.expandedStatementId = statementId;
    this.paymentsLoading = true;
    this.statementUserPayments = [];

    // Κάνουμε call στο backend
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

  getFloorLabel(floor: string) {
    const f = String(floor);

    if (f === 'Ισόγειο') return 'Ι';
    if (f === 'Υπόγειο') return 'Υ';
    if (f === 'Ημιόροφος') return `H`;
    else return f;
  }

  onEditUser(payment: StatementUserPaymentDTO): void {
    console.log('Επιλεγμένη πληρωμή:', payment);

    if (payment.status === 'PAID') {
      alert('Ο χρήστης έχει ήδη εξοφλήσει πλήρως αυτό το παραστατικό.');
      return;
    }

    const modalRef = this.modalService.open(StatementPaymentComponent, { size: 'md', backdrop: 'static' });

    modalRef.componentInstance.payment = {
      ...payment,
      statementId: this.expandedStatementId
    };

    modalRef.componentInstance.paymentSaved.subscribe((req: PaymentDTO) => {
      // === Spinner ===
      this.paymentsLoading = true;
      console.log('🔄 Αποστολή πληρωμής στο backend:', req);

      this.paymentService.createPayment(req).subscribe({
        next: () => {
          console.log('✅ Πληρωμή αποθηκεύτηκε με επιτυχία.');

          // === 1️⃣ Επαναφόρτωση πληρωμών για αυτό το statement ===
          this.paymentService.getUserPaymentsByStatement(this.expandedStatementId!).subscribe({
            next: (paymentsData) => {
              this.statementUserPayments = paymentsData;

              // === 2️⃣ Επαναφόρτωση statements για ενημέρωση status & ποσών ===
              const currentStatement = this.statements.find((s) => s.id === this.expandedStatementId);
              if (!currentStatement?.buildingId) {
                console.error('Δεν βρέθηκε buildingId για το παραστατικό');
                this.paymentsLoading = false;
                return;
              }

              this.commonStatementService.getStatementsByBuilding(currentStatement.buildingId).subscribe({
                next: (statementsData) => {
                  this.statements = statementsData;
                  this.applyFilters(); // φιλτράρισμα/ταξινόμηση

                  this.paymentsLoading = false;

                  // === Highlight γραμμής ===
                  const highlightId = req.userId || payment.apartmentId;
                  this.highlightRow = highlightId;
                  setTimeout(() => (this.highlightRow = null), 1500);

                  alert('Η πληρωμή καταχωρήθηκε με επιτυχία!');
                },
                error: (err) => {
                  console.error('Σφάλμα επαναφόρτωσης statements:', err);
                  this.paymentsLoading = false;
                }
              });
            },
            error: (err) => {
              console.error('Σφάλμα επαναφόρτωσης πληρωμών:', err);
              this.paymentsLoading = false;
            }
          });
        },
        error: (err) => {
          this.paymentsLoading = false;
          console.error('Σφάλμα αποθήκευσης πληρωμής:', err);
          if (err.error?.message?.includes('already fully paid')) {
            alert('Ο χρήστης έχει ήδη εξοφλήσει πλήρως αυτό το παραστατικό.');
          } else {
            alert('Σφάλμα κατά την αποθήκευση της πληρωμής.');
          }
        }
      });
    });
  }
}
