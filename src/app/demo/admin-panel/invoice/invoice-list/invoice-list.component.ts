/* eslint-disable @typescript-eslint/no-explicit-any */
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
import { BuildingService } from 'src/app/theme/shared/service/building.service';
import { ManagedBuildingDTO } from 'src/app/theme/shared/models/managedBuildingDTO';
import { BuildingSelectorInlineComponent } from './building-selector-inline/building-selector-inline.component';

@Component({
  selector: 'app-invoice-list',
  imports: [SharedModule, InvoiceListChartComponent, InvoiceListTableComponent, BuildingSelectorInlineComponent],
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
  expiredStatements: CommonExpenseStatement[] = [];
  managedBuildings: ManagedBuildingDTO[] = [];
  showBuildingSelector = false;
  currentBuildingId?: number;
  currentBuildingIndex = 0;
  // Counters
  totalCount = 0;
  paidCount = 0;
  pendingCount = 0;
  expiredCount = 0;
  closedCount = 0;
  draftCount = 0;
  totalUnpaidAmount = 0;

  activeTab = 1; // default tab
  summary!: CommonStatementSummaryDTO;
  widgetCards: any[] = [];

  // constructor
  constructor(
    private commonExpenseStatementService: CommonExpenseStatementService,
    private tabNav: TabNavigationService,
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef,
    private paymentService: PaymentService,
    private buildingService: BuildingService
  ) {
    this.iconService.addIcon(...[CaretUpOutline, CaretDownOutline, FileDoneOutline, InfoCircleOutline, BankOutline]);
  }

  ngOnInit(): void {
    this.buildingService.getMyManagedBuildings().subscribe({
      next: (buildings) => {
        this.managedBuildings = buildings || [];
        const storedId = Number(localStorage.getItem('buildingId'));

        // Αν υπάρχει stored buildingId, βρες το index
        const foundIndex = this.managedBuildings.findIndex((b) => b.id === storedId);
        this.currentBuildingIndex = foundIndex >= 0 ? foundIndex : 0;

        // Φόρτωσε την τρέχουσα πολυκατοικία
        const activeId = this.managedBuildings[this.currentBuildingIndex]?.id;
        if (activeId) this.loadStatementsAndSummary(activeId);
      },
      error: (err) => console.error('Σφάλμα λήψης πολυκατοικιών:', err)
    });
  }

  private loadBuildingsAndData(): void {
    this.buildingService.getMyManagedBuildings().subscribe({
      next: (buildings) => {
        console.log('[DEBUG] Buildings received:', buildings);
        this.managedBuildings = buildings || [];
        this.showBuildingSelector = this.managedBuildings.length > 1;
        console.log('[DEBUG] showBuildingSelector:', this.showBuildingSelector);

        let buildingId = Number(localStorage.getItem('buildingId'));
        if (!buildingId && this.managedBuildings.length > 0) {
          buildingId = this.managedBuildings[0].id;
          localStorage.setItem('buildingId', buildingId.toString());
        }

        if (buildingId) {
          this.loadStatementsAndSummary(buildingId);
        } else {
          console.warn('Δεν βρέθηκε buildingId για φόρτωση δεδομένων.');
        }
      },
      error: (err) => console.error('Σφάλμα λήψης πολυκατοικιών:', err)
    });
  }
  private loadStatementsAndSummary(buildingId: number): void {
    // Φόρτωση Summary
    this.paymentService.getBuildingSummary(buildingId).subscribe({
      next: (data) => {
        this.summary = {
          ...data,
          lastDueDate: data.lastDueDate ? new Date(data.lastDueDate).toISOString() : null
        };
      },
      error: (err) => console.error('Σφάλμα φόρτωσης summary:', err)
    });

    // Φόρτωση Statements
    this.commonExpenseStatementService.getStatementsByBuilding(buildingId).subscribe({
      next: (data) => {
        this.statements = data;
        this.splitStatements();
        this.updateWidgetCards();
        this.updateSummaryFromStatements();
      },
      error: (err) => console.error('Σφάλμα φόρτωσης statements:', err)
    });
  }

  onBuildingSelected(buildingId: number): void {
    localStorage.setItem('buildingId', buildingId.toString());
    this.loadStatementsAndSummary(buildingId);
  }

  private scrollToInvoices() {
    const section = document.getElementById('invoice-section');
    if (section) {
      section.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }
  /** Σπάμε τα statements ανά κατηγορία */
  private splitStatements(): void {
    if (!this.statements?.length) {
      this.resetCounts();
      return;
    }

    const now = new Date();
    const isTrue = (val: any) => val === true || val === 'true';
    const isFalse = (val: any) => val === false || val === 'false';

    // Αρχικοποίηση λιστών
    const paid: CommonExpenseStatement[] = [];
    const pending: CommonExpenseStatement[] = [];
    const expired: CommonExpenseStatement[] = [];
    const draft: CommonExpenseStatement[] = [];
    const closed: CommonExpenseStatement[] = [];

    for (const s of this.statements) {
      if (isTrue(s.active)) {
        if (s.isPaid || s.status === 'PAID') {
          paid.push(s);
        } else if (s.status === 'ISSUED') {
          if (s.endDate && new Date(s.endDate) < now) {
            expired.push(s);
          } else {
            pending.push(s);
          }
        } else if (s.status === 'DRAFT') {
          draft.push(s);
        } else if (s.status === 'EXPIRED') {
          expired.push(s);
        }
      } else if (isFalse(s.active) && s.status === 'CLOSED') {
        closed.push(s);
      }
    }

    // Ανάθεση στα properties του component
    this.paidStatements = paid;
    this.pendingStatements = pending;
    this.expiredStatements = expired;
    this.draftStatements = draft;
    this.closedStatements = closed;

    // Counts
    this.totalCount = this.statements.length;
    this.paidCount = paid.length;
    this.pendingCount = pending.length;
    this.expiredCount = expired.length;
    this.closedCount = closed.length;
    this.draftCount = draft.length;
  }

  private updateWidgetCards() {
    const totalPaid = this.paidStatements.reduce((sum, s) => sum + (s.total ?? 0), 0);
    const totalPending = this.pendingStatements.reduce((sum, s) => sum + (s.total ?? 0), 0);
    const totalOverdue = this.expiredStatements.reduce((sum, s) => sum + (s.total ?? 0), 0);

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
        invoice: this.expiredStatements.length,
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
        return 'Εκκρεμεί';
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

  updateSummaryFromStatements(): void {
    if (!this.statements?.length) return;

    // Φιλτράρουμε μόνο όσα είναι ISSUED ή EXPIRED
    const unpaidStatements = this.statements.filter((s) => s.status === 'ISSUED' || s.status === 'EXPIRED');

    // Υπολογισμός συνολικού ποσού
    this.totalUnpaidAmount = unpaidStatements.reduce((sum, s) => sum + (s.total ?? 0), 0);

    // Υπολογισμός ποσών για progress bar
    const paidStatements = this.statements.filter((s) => s.status === 'PAID');
    const totalPaid = paidStatements.reduce((sum, s) => sum + (s.total ?? 0), 0);
    const totalAll = totalPaid + this.totalUnpaidAmount;

    // Υπολογισμός τελευταίας ημερομηνίας λήξης
    const lastDueDate = unpaidStatements.length
      ? new Date(Math.max(...unpaidStatements.filter((s) => !!s.endDate).map((s) => new Date(s.endDate!).getTime())))
      : null;

    this.summary = {
      totalAmount: this.totalUnpaidAmount,
      totalPending: this.totalUnpaidAmount,
      lastDueDate,
      percentPaid: totalAll > 0 ? (totalPaid / totalAll) * 100 : 0
    } as any;
  }

  private resetCounts(): void {
    this.totalCount = this.paidCount = this.pendingCount = this.expiredCount = this.closedCount = this.draftCount = 0;
    this.paidStatements = [];
    this.pendingStatements = [];
    this.expiredStatements = [];
    this.closedStatements = [];
    this.draftStatements = [];
  }
}
