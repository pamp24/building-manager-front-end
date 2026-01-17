  import { Component, inject, Input, OnChanges, Output, EventEmitter } from '@angular/core';
  import { DecimalPipe } from '@angular/common';
  import { SharedModule } from 'src/app/theme/shared/shared.module';
  import { IconService } from '@ant-design/icons-angular';
  import { DeleteOutline, EditOutline, EyeOutline, CaretDownOutline, CaretUpOutline } from '@ant-design/icons-angular/icons';
  import { CommonExpenseStatement } from 'src/app/theme/shared/models/commonExpenseStatement';
  import { CommonExpenseStatementService } from 'src/app/theme/shared/service/commonExpensesStatement.service';
  import { SortDirection } from 'src/app/theme/shared/directive/sortable.directive';
  import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
  import { Router } from '@angular/router';
  import { StatementViewComponent } from './statement-view/statement-view.component';
  import { PaymentService } from 'src/app/theme/shared/service/payment.service';
  import { StatementUserPaymentDTO } from 'src/app/theme/shared/models/StatementUserPaymentDTO';
  import { StatementPaymentComponent } from './statement-payment/statement-payment.component';
  import { PaymentDTO } from 'src/app/theme/shared/models/paymentDTO';

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
    @Output() refreshRequested = new EventEmitter<void>();
    Math = Math;

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
      this.applyFilters();
    }

    applyFilters() {
      let result = [...this.statements];

      // Φιλτράρισμα
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

      // Ταξινόμηση
      if (this.sortColumn && this.sortDirection) {
        result.sort((a, b) => {
          const column = this.sortColumn as keyof CommonExpenseStatement;
          const valA = a[column] ?? '';
          const valB = b[column] ?? '';
          if (valA < valB) return this.sortDirection === 'asc' ? -1 : 1;
          if (valA > valB) return this.sortDirection === 'asc' ? 1 : -1;
          return 0;
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
      if (isPaid) return 'Πληρώθηκε';
      switch (status) {
        case 'PAID':
          return 'Πληρώθηκε';
        case 'ISSUED':
          return 'Εκκρεμεί';
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

    onView(statement: CommonExpenseStatement) {
      const modalRef = this.modalService.open(StatementViewComponent, { size: 'xl' });
      modalRef.componentInstance.statement = statement;
    }

    onEdit(statement: CommonExpenseStatement) {
      this.router.navigate(['/invoice/edit', statement.id]);
    }

    onDelete(statement: CommonExpenseStatement) {
      if (!statement.id) return;

      const confirmed = confirm(`Είσαι σίγουρος ότι θέλεις να ακυρώσεις το παραστατικό ${statement.code};`);
      if (!confirmed) return;

      this.commonStatementService.deleteStatement(statement.id).subscribe({
        next: () => {
          // Ενημέρωσε το αντικείμενο τοπικά
          statement.status = 'CLOSED';
          statement.active = false;

          // Ενημέρωσε τη λίστα
          this.applyFilters();

          //Πες στον parent component να κάνει refresh από το backend
          this.refreshRequested.emit();

          alert('Το παραστατικό ακυρώθηκε επιτυχώς.');
        },
        error: (err) => {
          console.error('Σφάλμα διαγραφής:', err);
          alert('Παρουσιάστηκε σφάλμα κατά την ακύρωση του παραστατικού.');
        }
      });
    }

    togglePayments(statementId: number) {
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
        alert('Ο χρήστης έχει ήδη εξοφλήσει πλήρως αυτό το παραστατικό.');
        return;
      }

      const modalRef = this.modalService.open(StatementPaymentComponent, {
        size: 'md',
        backdrop: 'static'
      });

      // περνάμε τα δεδομένα στο modal
      modalRef.componentInstance.payment = {
        ...payment,
        statementId: this.expandedStatementId
      };

      // όταν γίνει emit το paymentSaved event
      modalRef.componentInstance.paymentSaved.subscribe((req: PaymentDTO) => {
        this.paymentsLoading = true;

        this.paymentService.createPayment(req).subscribe({
          next: (savedPayment) => {
            console.log('Πληρωμή καταχωρήθηκε:', savedPayment);

            // κάνουμε refresh ΜΟΝΟ τη λίστα πληρωμών του συγκεκριμένου statement
            this.paymentService.getUserPaymentsByStatement(this.expandedStatementId!).subscribe({
              next: (paymentsData) => {
                this.statementUserPayments = paymentsData;

                // ενημέρωσε και το statement table (ώστε να αλλάξει status/ποσοστά)
                const currentStatement = this.statements.find((s) => s.id === this.expandedStatementId);
                if (currentStatement?.buildingId) {
                  this.commonStatementService.getStatementsByBuilding(currentStatement.buildingId).subscribe({
                    next: (updatedStatements) => {
                      this.statements = updatedStatements;
                      this.applyFilters();
                      alert('Η πληρωμή καταχωρήθηκε με επιτυχία!');
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
  }
