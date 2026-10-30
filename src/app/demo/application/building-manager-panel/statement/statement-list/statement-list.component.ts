/* eslint-disable @typescript-eslint/no-explicit-any */
import { ChangeDetectorRef, Component, Input, OnChanges, OnInit, SimpleChanges, ViewChild, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgbNav } from '@ng-bootstrap/ng-bootstrap';
import { BankOutline, CaretDownOutline, CaretUpOutline, FileDoneOutline, InfoCircleOutline } from '@ant-design/icons-angular/icons';
import { IconService } from '@ant-design/icons-angular';

import { SharedModule } from 'src/app/theme/shared/shared.module';
import { TabNavigationService } from 'src/app/theme/shared/service/TabNavigation.service';
import { BuildingService } from 'src/app/theme/shared/service/building.service';
import { ManagedBuildingDTO } from 'src/app/theme/shared/models/managedBuildingDTO';
import { BuildingSelectorInlineComponent } from './building-selector-inline/building-selector-inline.component';
import { CommonExpenseStatement } from 'src/app/theme/shared/models/commonExpenseStatement';
import { CommonStatementSummaryDTO } from 'src/app/theme/shared/models/commonExpenseSummaryDTO';
import { CommonExpenseStatementService } from 'src/app/theme/shared/service/commonExpensesStatement.service';
import { PaymentService } from 'src/app/theme/shared/service/payment.service';
import { StatementListTableComponent } from './statement-list-table/statement-list-table.component';
import { StatementListChartComponent } from './statement-list-chart/statement-list-chart.component';
import { BuildingDTO } from 'src/app/theme/shared/models/buildingDTO';
import { ApartmentDTO } from 'src/app/theme/shared/models/apartmentDTO';
import { ApartmentService } from 'src/app/theme/shared/service/apartment.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-statement-list',
  imports: [SharedModule, BuildingSelectorInlineComponent, StatementListTableComponent, StatementListChartComponent],
  templateUrl: './statement-list.component.html',
  styleUrl: './statement-list.component.scss'
})
export class StatementListComponent implements OnInit, OnChanges {
  private iconService = inject(IconService);
  @ViewChild('nav', { static: false }) nav?: NgbNav;
  @Input() buildingId?: number;
  @Input() pmView = false;

  statements: CommonExpenseStatement[] = [];
  paidStatements: CommonExpenseStatement[] = [];
  pendingStatements: CommonExpenseStatement[] = [];
  closedStatements: CommonExpenseStatement[] = [];
  draftStatements: CommonExpenseStatement[] = [];
  expiredStatements: CommonExpenseStatement[] = [];
  managedBuildings: ManagedBuildingDTO[] = [];
  myApartments: ApartmentDTO[] = [];
  showBuildingSelector = false;
  currentBuildingId?: number;
  currentBuildingIndex = 0;
  totalCount = 0;
  paidCount = 0;
  pendingCount = 0;
  expiredCount = 0;
  closedCount = 0;
  draftCount = 0;
  totalUnpaidAmount = 0;
  activeTab = 1;
  summary!: CommonStatementSummaryDTO;
  widgetCards: any[] = [];
  currentUserRole: string | null = null;
  isManagementRole = false;

  constructor(
    private commonExpenseStatementService: CommonExpenseStatementService,
    private tabNav: TabNavigationService,
    private route: ActivatedRoute,
    private _cdr: ChangeDetectorRef,
    private paymentService: PaymentService,
    private buildingService: BuildingService,
    private apartmentService: ApartmentService
  ) {
    this.iconService.addIcon(...[CaretUpOutline, CaretDownOutline, FileDoneOutline, InfoCircleOutline, BankOutline]);
  }

  ngOnInit(): void {
    const currentUser = localStorage.getItem('currentUser');
    if (currentUser) {
      const parsed = JSON.parse(currentUser);
      this.currentUserRole = parsed.role ?? null;
      this.isManagementRole = ['Admin', 'BuildingManager', 'PropertyManager', 'PropertyAgent', 'AdminAgent'].includes(this.currentUserRole ?? '');
    }

    this.apartmentService.getMyApartments().subscribe({
      next: (apartments) => {
        this.myApartments = apartments ?? [];
      },
      error: () => {
        this.myApartments = [];
      }
    });

    if (this.buildingId) {
      this.currentBuildingId = this.buildingId;
      this.showBuildingSelector = false;
      this.loadStatementsAndSummary(this.buildingId);

      this.tabNav.tabChange$.subscribe((tabId) => {
        if (tabId != null && tabId >= 1 && tabId <= 6) {
          this.activeTab = tabId;
          setTimeout(() => {
            this.nav?.select(tabId);
            document.getElementById('statement-section')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }, 0);
        }
      });
      return;
    }

    this.loadAccessibleBuildings();

    this.route.queryParamMap.subscribe((params) => {
      const tab = Number(params.get('tab'));
      if (!isNaN(tab) && tab >= 1 && tab <= 6) {
        this.activeTab = tab;
        setTimeout(() => {
          this.nav?.select(tab);
          document.getElementById('statement-section')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 0);
      }
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['buildingId'] && this.buildingId) {
      this.currentBuildingId = this.buildingId;
      this.showBuildingSelector = false;
      this.loadStatementsAndSummary(this.buildingId);
    }
  }

  private loadAccessibleBuildings(): void {
    const load$: Observable<(BuildingDTO | ManagedBuildingDTO)[]> = this.currentUserRole === 'PropertyManager' || this.currentUserRole === 'AdminAgent'
      ? this.buildingService.getMyCompanyBuildings()
      : this.currentUserRole === 'PropertyAgent' || !this.isManagementRole
        ? this.buildingService.getMyBuildings()
        : this.buildingService.getMyManagedBuildings();

    load$.subscribe({
      next: (buildings: (BuildingDTO | ManagedBuildingDTO)[]) => {
        this.managedBuildings = (buildings || []).map((building: BuildingDTO | ManagedBuildingDTO) => ({
          id: building.id,
          name: building.name,
          street1: building.street1,
          city: building.city,
          apartmentCount: 'apartmentCount' in building ? building.apartmentCount : 0,
          unitCount: 'unitCount' in building ? building.unitCount : 0,
          managerId: 'managerId' in building ? Number(building.managerId ?? 0) : 0
        }));

        this.showBuildingSelector = this.managedBuildings.length > 1;

        const storedId = Number(localStorage.getItem('buildingId'));
        const foundIndex = this.managedBuildings.findIndex((b) => b.id === storedId);
        this.currentBuildingIndex = foundIndex >= 0 ? foundIndex : 0;

        const activeId = this.managedBuildings[this.currentBuildingIndex]?.id;
        if (activeId) {
          this.currentBuildingId = activeId;
          this.loadStatementsAndSummary(activeId);
        }
      },
      error: (err: unknown) => console.error('Σφάλμα λήψης πολυκατοικιών:', err)
    });
  }

  private loadStatementsAndSummary(buildingId: number): void {
    if (this.isManagementRole) {
      this.paymentService.getBuildingSummary(buildingId).subscribe({
        next: (data) => {
          this.summary = {
            ...data,
            percentPaid: Number(data.paidPercent ?? data.percentPaid ?? 0),
            lastDueDate: data.lastDueDate ? new Date(data.lastDueDate).toISOString() : null
          };
          if (data.totalPending != null) {
            this.totalUnpaidAmount = data.totalPending;
          }
        },
        error: (err) => console.error('Σφάλμα φόρτωσης summary:', err)
      });
    }

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
    this.currentBuildingId = buildingId;
    localStorage.setItem('buildingId', buildingId.toString());
    this.loadStatementsAndSummary(buildingId);
  }

  private splitStatements(): void {
    if (!this.statements?.length) {
      this.resetCounts();
      return;
    }

    const now = new Date();
    const isTrue = (val: any) => val === true || val === 'true';
    const isFalse = (val: any) => val === false || val === 'false';
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

    this.paidStatements = paid;
    this.pendingStatements = pending;
    this.expiredStatements = expired;
    this.draftStatements = draft;
    this.closedStatements = closed;
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
        statement: this.paidStatements.length,
        data: this.paidStatements.map((s) => s.total ?? 0),
        labels: this.paidStatements.map((s) => s.code),
        colors: ['#52c41a']
      },
      {
        title: 'Τρέχοντα',
        isLoss: true,
        value: `${totalPending.toLocaleString('el-GR')} €`,
        percentage: grandTotal ? ((totalPending / grandTotal) * 100).toFixed(1) : 0,
        color: 'text-warning',
        statement: this.pendingStatements.length,
        data: this.pendingStatements.map((s) => s.total ?? 0),
        labels: this.pendingStatements.map((s) => s.code),
        colors: ['#faad14']
      },
      {
        title: 'Έληξαν',
        isLoss: true,
        value: `${totalOverdue.toLocaleString('el-GR')} €`,
        percentage: grandTotal ? ((totalOverdue / grandTotal) * 100).toFixed(1) : 0,
        color: 'text-danger',
        statement: this.expiredStatements.length,
        data: this.expiredStatements.map((s) => s.total ?? 0),
        labels: this.expiredStatements.map((s) => s.code),
        colors: ['#ff4d4f']
      }
    ];
  }

  translateStatus(status: string | undefined): string {
    switch (status) {
      case 'PAID':
        return 'Πληρώθηκε';
      case 'ISSUED':
        return 'Τρέχων';
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
    if (!this.statements?.length || this.isManagementRole === false) return;

    const unpaidStatements = this.statements.filter((s) => s.status === 'ISSUED' || s.status === 'EXPIRED');
    const calculatedUnpaid = unpaidStatements.reduce((sum, s) => sum + (s.total ?? 0), 0);
    if (this.summary?.totalPending == null) {
      this.totalUnpaidAmount = calculatedUnpaid;
    }

    const lastDueDate = unpaidStatements.length
      ? new Date(Math.max(...unpaidStatements.filter((s) => !!s.endDate).map((s) => new Date(s.endDate!).getTime())))
      : null;

    this.summary = {
      ...(this.summary ?? {}),
      lastDueDate
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

  reloadStatements(): void {
    const buildingId = this.currentBuildingId || Number(localStorage.getItem('buildingId'));
    if (!buildingId) {
      console.warn('Δεν υπάρχει buildingId για ανανέωση statements.');
      return;
    }
    this.loadStatementsAndSummary(buildingId);
  }
}
