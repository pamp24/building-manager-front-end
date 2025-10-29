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

@Component({
  selector: 'app-invoice-dashboard',
  imports: [SharedModule, InvoiceChartComponent, TotalExpensesChartComponent],
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

  //Μετρητές για tabs
  totalCount = 0;
  paidCount = 0;
  pendingCount = 0;
  expiredCount = 0;
  closedCount = 0;
  draftCount = 0;

  constructor() {
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
    this.loadBuildingsAndManagerDashboard();
    this.loadRecentPayments();
    this.loadCurrentMonthPayments();
  }

  private isDarkTheme(isDark: boolean) {
    this.backgroundColor = isDark ? 'bg-gray-800' : 'bg-gray-200';
  }

  loadDashboard() {
    if (!this.buildingId) return;

    this.managerDashboardService.getDashboardForBuilding(this.buildingId).subscribe({
      next: (data) => {
        console.log('Dashboard data:', data);
        console.log('Monthly stats:', data.monthlyStats);

        this.dashboardData = data;

        //Αν το backend επιστρέφει αναλυτικά monthlyStats
        if (data.monthlyStats && data.monthlyStats.length > 0) {
          const totalIssued = data.monthlyStats.reduce((sum, m) => sum + (m.issued || 0), 0);
          const totalPaid = data.monthlyStats.reduce((sum, m) => sum + (m.paid || 0), 0);
          const totalExpired = data.monthlyStats.reduce((sum, m) => sum + (m.expired || 0), 0);

          this.totalCount = totalIssued;
          this.paidCount = totalPaid;
          this.expiredCount = totalExpired;

          //Εκκρεμή = Εκδοθέντα - (Πληρωμένα + Ληξιπρόθεσμα)
          this.pendingCount = Math.max(totalIssued - (totalPaid + totalExpired), 0);
        } else {
          //fallback στα συνολικά του backend (χωρίς draft στα pending)
          const issued = data.totalIssued || 0;
          const paid = data.totalPaid || 0;
          const expired = data.totalExpired || 0;

          this.totalCount = issued;
          this.paidCount = paid;
          this.expiredCount = expired;
          this.pendingCount = Math.max(issued - (paid + expired), 0);
        }

        //υπόλοιπα σταθερά
        this.closedCount = data.totalCancelled || 0;
        this.draftCount = data.totalDraft || 0;

        console.log('Counts (final):', {
          total: this.totalCount,
          paid: this.paidCount,
          pending: this.pendingCount,
          expired: this.expiredCount,
          cancelled: this.closedCount,
          draft: this.draftCount
        });
      },
      error: (err) => console.error('Σφάλμα φόρτωσης dashboard', err)
    });
  }

  goToTab(tabId: number) {
    console.log('Μετάβαση στην καρτέλα:', tabId);
    this.activeTab = tabId;
    this.tabNav.goToTab(tabId);
    setTimeout(() => {
      document.getElementById('invoice-section')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
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
          this.setCurrentBuilding(0);
        } else {
          console.warn('Δεν βρέθηκαν πολυκατοικίες για τον διαχειριστή');
        }
      },
      error: (err) => console.error('Σφάλμα κατά τη λήψη πολυκατοικιών', err)
    });
  }

  setCurrentBuilding(index: number) {
    this.currentBuildingIndex = index;
    this.currentBuilding = this.managedBuildings[index];
    this.buildingId = this.currentBuilding.id;

    this.dashboardData = undefined;
    this.recentPayments = [];
    this.statementUserPayments = [];

    console.log('Επιλέχθηκε πολυκατοικία:', this.currentBuilding.name);
    this.loadDashboard();
    this.loadRecentPayments();
    this.loadCurrentMonthPayments();
  }

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
}
