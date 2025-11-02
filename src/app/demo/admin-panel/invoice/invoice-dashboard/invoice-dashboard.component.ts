/* eslint-disable @typescript-eslint/no-explicit-any */
// angular import
import { Component, inject, OnInit } from '@angular/core';

// icons
import { IconService } from '@ant-design/icons-angular';
import {
  AlertFill,
  CloseCircleFill,
  DeleteFill,
  DeleteOutline,
  DollarCircleFill,
  DownloadOutline,
  EditFill,
  EyeOutline,
  FileTextFill,
  FileTextOutline,
  HourglassFill,
  LinkOutline,
  MoreOutline,
  PauseCircleFill,
  PlusOutline,
  ReconciliationFill,
  SettingOutline,
  ShoppingFill,
  StopOutline,
  LeftOutline,
  RightOutline
} from '@ant-design/icons-angular/icons';

// project import
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { InvoiceChartComponent } from './invoice-chart/invoice-chart.component';
import { TotalExpensesChartComponent } from './total-expenses-chart/total-expenses-chart.component';
import { ManagerDashboardService } from '../../../../theme/shared/service/managerDashboard.service';
import { ManagerDashboardDTO } from '../../../../theme/shared/models/managerDashboardDTO';
import { BuildingService } from '../../../../theme/shared/service/building.service';
import { TabNavigationService } from '../../../../theme/shared/service/TabNavigation.service';
import { PaymentService } from '../../../../theme/shared/service/payment.service';
import { PaymentDTO } from '../../../../theme/shared/models/paymentDTO';
import { effect } from '@angular/core';
import { ThemeService } from '../../../../theme/shared/service/customs-theme.service';
import { StatementUserPaymentDTO } from '../../../../theme/shared/models/StatementUserPaymentDTO';
import { ManagedBuildingDTO } from '../../../../theme/shared/models/managedBuildingDTO';
import { CommonExpenseStatement } from '../../../../theme/shared/models/commonExpenseStatement';
import { BuildingSelectorComponent } from './building-selector/building-selector.component';
import { StatusCardsComponent } from './status-cards/status-cards.component';
import { RecentPaymentsComponent } from './recent-payments/recent-payments.component';
import { Router } from '@angular/router';
import { UserPaymentsTableComponent } from './user-payments-table/user-payments-table.component';

@Component({
  selector: 'app-invoice-dashboard',
  imports: [
    SharedModule,
    InvoiceChartComponent,
    TotalExpensesChartComponent,
    BuildingSelectorComponent,
    StatusCardsComponent,
    RecentPaymentsComponent,
    UserPaymentsTableComponent
  ],
  templateUrl: './invoice-dashboard.component.html',
  styleUrl: './invoice-dashboard.component.scss'
})
export class InvoiceDashboardComponent implements OnInit {
  private themeService = inject(ThemeService);
  private managerDashboardService = inject(ManagerDashboardService);
  private iconService = inject(IconService);
  private tabNav = inject(TabNavigationService);
  private buildingService = inject(BuildingService);
  private paymentService = inject(PaymentService);

  backgroundColor!: string;

  dashboardData?: ManagerDashboardDTO;
  buildingId: number = Number(localStorage.getItem('buildingId'));
  currentBuildingIndex: number = 0;
  activeTab = 1;

  managedBuildings: ManagedBuildingDTO[] = [];
  currentBuilding?: ManagedBuildingDTO;

  recentPayments: PaymentDTO[] = [];
  statementUserPayments: StatementUserPaymentDTO[] = [];
  paymentsLoading = false;
  currentMonthLabel = new Date().toLocaleString('el-GR', { month: 'long', year: 'numeric' });
  statements: CommonExpenseStatement[] = [];

  //Μετρητές για tabs
  totalCount = 0;
  paidCount = 0;
  pendingCount = 0;
  expiredCount = 0;
  closedCount = 0;
  draftCount = 0;

  constructor(private router: Router) {
    this.iconService.addIcon(
      ...[
        CloseCircleFill,
        DollarCircleFill,
        FileTextFill,
        HourglassFill,
        ReconciliationFill,
        ShoppingFill,
        MoreOutline,
        LinkOutline,
        DownloadOutline,
        FileTextOutline,
        SettingOutline,
        PlusOutline,
        EyeOutline,
        EditFill,
        DeleteOutline,
        LeftOutline,
        RightOutline,
        StopOutline,
        AlertFill,
        DeleteFill,
        PauseCircleFill
      ]
    );

    effect(() => {
      this.isDarkTheme(this.themeService.isDarkMode());
    });
  }

  ngOnInit(): void {
    if (this.buildingId) {
      this.loadAll();
    } else {
      this.loadBuildingsAndManagerDashboard();
    }
  }

  private isDarkTheme(isDark: boolean) {
    this.backgroundColor = isDark ? 'bg-gray-800' : 'bg-gray-200';
  }

  onBuildingSelected(buildingId: number): void {
    if (this.buildingId === buildingId) return; // αν δεν άλλαξε, μην ξαναφορτώνεις

    this.buildingId = buildingId;
    this.dashboardData = undefined;
    this.recentPayments = [];
    this.statementUserPayments = [];
    this.loadAll();
  }
  loadAll(): void {
    this.loadDashboard();
    this.loadRecentPayments();
    this.loadCurrentMonthPayments();
  }

  loadDashboard() {
    if (!this.buildingId) return;

    this.managerDashboardService.getDashboardForBuilding(this.buildingId).subscribe({
      next: (data) => {
        console.log('Dashboard data:', data);
        console.log('Monthly stats:', data.monthlyStats);

        this.dashboardData = data;
      },
      error: (err) => console.error('Σφάλμα φόρτωσης dashboard', err)
    });
  }

  loadRecentPayments(): void {
    if (!this.buildingId) return;
    this.paymentService.getRecentByBuilding(this.buildingId).subscribe({
      next: (data) => (this.recentPayments = data),
      error: (err) => console.error('Σφάλμα φόρτωσης πρόσφατων πληρωμών', err)
    });
  }

  loadCurrentMonthPayments(): void {
    if (!this.buildingId) return;
    this.paymentsLoading = true;
    this.paymentService.getCurrentMonthByBuilding(this.buildingId).subscribe({
      next: (data) => {
        this.statementUserPayments = data;
        this.paymentsLoading = false;
      },
      error: (err) => {
        console.error('Σφάλμα φόρτωσης πληρωμών τρέχοντος μήνα', err);
        this.paymentsLoading = false;
      }
    });
  }

  loadBuildingsAndManagerDashboard() {
    this.buildingService.getMyManagedBuildings().subscribe({
      next: (buildings) => {
        if (buildings && buildings.length > 0) {
          this.managedBuildings = buildings;

          if (!this.buildingId) {
            this.buildingId = buildings[0].id;
            this.onBuildingSelected(this.buildingId);
          }
        } else {
          console.warn('Δεν βρέθηκαν πολυκατοικίες για τον διαχειριστή');
        }
      },
      error: (err) => console.error('Σφάλμα κατά τη λήψη πολυκατοικιών', err)
    });
  }

  goToTab(tabId: number): void {
    console.log('Μετάβαση στην καρτέλα:', tabId);
    this.activeTab = tabId;
    if (this.tabNav) {
      this.tabNav.goToTab(tabId);
    }
    setTimeout(() => {
      document.getElementById('invoice-section')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  }
  goToInvoiceList(): void {
    this.router.navigate(['/invoice/list']);
  }

  onEditUser(payment: any): void {
    console.log('Επεξεργασία πληρωμής χρήστη:', payment);
  }
}
