// angular import
import { Component, inject } from '@angular/core';

// icons
import { IconService } from '@ant-design/icons-angular';
import { BankOutline, CaretDownOutline, CaretUpOutline, FileDoneOutline, InfoCircleOutline } from '@ant-design/icons-angular/icons';

// project import
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { InvoiceListChartComponent } from './invoice-list-chart/invoice-list-chart.component';
import { InvoiceListTableComponent } from './invoice-list-table/invoice-list-table.component';
import { CommonExpenseStatement } from '../../../../theme/shared/models/commonExpenseStatement';
import { CommonExpenseStatementService } from '../../../../theme/shared/service/commonExpensesStatement.service';
import { OnInit } from '@angular/core';
import { TabNavigationService } from 'src/app/theme/shared/service/TabNavigation.service';
import { ActivatedRoute } from '@angular/router';
import { ChangeDetectorRef } from '@angular/core';
import { ViewChild } from '@angular/core';
import { NgbNav } from '@ng-bootstrap/ng-bootstrap';
import { CommonStatementSummaryDTO } from '../../../../theme/shared/models/commonExpenseSummaryDTO';
import { PaymentService } from '../../../../theme/shared/service/payment.service';

@Component({
  selector: 'app-invoice-list',
  imports: [SharedModule, InvoiceListChartComponent, InvoiceListTableComponent],
  templateUrl: './invoice-list.component.html',
  styleUrl: './invoice-list.component.scss'
})
export class InvoiceListComponent implements OnInit {
  private iconService = inject(IconService);
  @ViewChild('nav', { static: false }) nav?: NgbNav;

  // Λίστες
  statements: CommonExpenseStatement[] = [];
  paidStatements: CommonExpenseStatement[] = [];
  pendingStatements: CommonExpenseStatement[] = [];
  closedStatements: CommonExpenseStatement[] = [];
  draftStatements: CommonExpenseStatement[] = [];
  overdueStatements: CommonExpenseStatement[] = [];

  // Counters
  totalCount = 0;
  paidCount = 0;
  pendingCount = 0;
  overdueCount = 0;
  closedCount = 0;
  draftCount = 0;

  activeTab = 1; // default tab
  summary!: CommonStatementSummaryDTO;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  widgetCards: any[] = [];

  // constructor
  constructor(
    private commonExpenseStatementService: CommonExpenseStatementService,
    private tabNav: TabNavigationService,
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef,
    private paymentService: PaymentService
  ) {
    this.iconService.addIcon(...[CaretUpOutline, CaretDownOutline, FileDoneOutline, InfoCircleOutline, BankOutline]);
  }

  ngOnInit(): void {
    const buildingId = Number(localStorage.getItem('buildingId'));

    if (!buildingId) {
      console.error('Δεν υπάρχει buildingId στο localStorage');
      return;
    }

    //Καλούμε το summary ΜΟΝΟ αν υπάρχει buildingId
    this.paymentService.getBuildingSummary(buildingId).subscribe({
      next: (data) => {
        this.summary = data;
      },
      error: (err) => console.error('Σφάλμα φόρτωσης summary:', err)
    });

    // Διαβάζουμε το query param
    this.route.queryParams.subscribe((params) => {
      const tabParam = Number(params['tab']);
      if (tabParam) {
        this.activeTab = tabParam;
        console.log('Query tab:', this.activeTab);
        setTimeout(() => {
          if (this.nav) this.nav.select(this.activeTab);
          this.cdr.detectChanges();
          this.scrollToInvoices();
        });
      }
    });

    //Φόρτωση όλων των statements για το κτίριο
    this.commonExpenseStatementService.getStatementsByBuilding(buildingId).subscribe({
      next: (data) => {
        this.statements = data;
        this.splitStatements();
        this.updateWidgetCards();
      },
      error: (err) => console.error('Σφάλμα φόρτωσης statements:', err)
    });
  }

  private scrollToInvoices() {
    const section = document.getElementById('invoice-section');
    if (section) {
      section.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }
  /** Σπάμε τα statements ανά κατηγορία */
  private splitStatements(): void {
    const now = new Date();

    this.paidStatements = this.statements.filter((s) => s.isPaid || s.status === 'PAID');
    this.pendingStatements = this.statements.filter((s) => s.status === 'ISSUED' && s.endDate && new Date(s.endDate) >= now && !s.isPaid);
    this.overdueStatements = this.statements.filter((s) => s.status === 'ISSUED' && s.endDate && new Date(s.endDate) < now && !s.isPaid);
    this.closedStatements = this.statements.filter((s) => s.status === 'CLOSED');
    this.draftStatements = this.statements.filter((s) => s.status === 'DRAFT');

    this.totalCount = this.statements.length;
    this.paidCount = this.paidStatements.length;
    this.pendingCount = this.pendingStatements.length;
    this.overdueCount = this.overdueStatements.length;
    this.closedCount = this.closedStatements.length;
    this.draftCount = this.draftStatements.length;
  }

  private updateWidgetCards() {
    const totalPaid = this.paidStatements.reduce((sum, s) => sum + (s.total ?? 0), 0);
    const totalPending = this.pendingStatements.reduce((sum, s) => sum + (s.total ?? 0), 0);
    const totalOverdue = this.overdueStatements.reduce((sum, s) => sum + (s.total ?? 0), 0);

    const grandTotal = totalPaid + totalPending + totalOverdue;

    this.widgetCards = [
      {
        title: 'Πληρώθηκαν',
        isLoss: false,
        value: `${totalPaid.toLocaleString('el-GR')} €`,
        percentage: grandTotal ? ((totalPaid / grandTotal) * 100).toFixed(1) : 0,
        color: 'text-success',
        invoice: this.paidStatements.length,
        data: [0, 20, 10, 45, 30, 55, 20, 30],
        colors: ['#52c41a']
      },
      {
        title: 'Εκκρεμούν',
        isLoss: true,
        value: `${totalPending.toLocaleString('el-GR')} €`,
        percentage: grandTotal ? ((totalPending / grandTotal) * 100).toFixed(1) : 0,
        color: 'text-warning',
        invoice: this.pendingStatements.length,
        data: [30, 20, 55, 30, 45, 10, 20, 0],
        colors: ['#faad14']
      },
      {
        title: 'Έληξαν',
        isLoss: true,
        value: `${totalOverdue.toLocaleString('el-GR')} €`,
        percentage: grandTotal ? ((totalOverdue / grandTotal) * 100).toFixed(1) : 0,
        color: 'text-danger',
        invoice: this.overdueStatements.length,
        data: [0, 20, 10, 45, 30, 55, 20, 30],
        colors: ['#ff4d4f']
      }
    ];
  }

  translateStatus(status: string | undefined): string {
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
      default:
        return status ?? '';
    }
  }
}
