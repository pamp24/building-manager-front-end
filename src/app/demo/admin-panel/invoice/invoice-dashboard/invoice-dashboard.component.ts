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
  RightOutline,
  CaretDownOutline,
  CaretUpOutline
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
import { CommonExpenseStatementService } from '../../../../theme/shared/service/commonExpensesStatement.service';
import { CalendarService } from '../../../../theme/shared/service/calendarService.service';
import { PollService } from '../../../../theme/shared/service/poll.service';

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
  announcements: any[] = [];
  recentPayments: PaymentDTO[] = [];
  statementUserPayments: StatementUserPaymentDTO[] = [];
  paymentsLoading = false;
  currentMonthLabel = new Date().toLocaleString('el-GR', { month: 'long', year: 'numeric' });
  statements: CommonExpenseStatement[] = [];
  showBuildingSelector = false;

  polls: any[] = [];
  pollVotes: any[] = [];
  expandedPollId: number | null = null;
  loading = false;
  votesLoading = false;
  //Μετρητές για tabs
  totalCount = 0;
  paidCount = 0;
  pendingCount = 0;
  expiredCount = 0;
  closedCount = 0;
  draftCount = 0;
  selectedStatementId?: number;
  sortField: string = '';
  sortAsc: boolean = true;

  constructor(
    private router: Router,
    private commonExpenseStatementService: CommonExpenseStatementService,
    private calendarService: CalendarService,
    private pollService: PollService
  ) {
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
        PauseCircleFill,
        CaretDownOutline,
        CaretUpOutline
      ]
    );

    effect(() => {
      this.isDarkTheme(this.themeService.isDarkMode());
    });
  }

  ngOnInit(): void {
    this.loadBuildingsAndManagerDashboard();
    this.loadRecentAnnouncements();
    this.loadPolls();
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
    this.loadStatementsForBuilding();
  }

  loadStatementsForBuilding(): void {
    if (!this.buildingId) return;

    this.commonExpenseStatementService.getActiveStatementsByBuilding(this.buildingId).subscribe({
      next: (data) => {
        this.statements = data;
        if (data.length > 0) {
          // επιλέγουμε το πιο πρόσφατο statement ως default
          const lastStatement = data[data.length - 1];
          this.selectedStatementId = lastStatement.id;
        }
      },
      error: (err) => console.error('Σφάλμα φόρτωσης statements', err)
    });
  }
  onStatementChange(): void {
    if (!this.selectedStatementId) return;
    this.paymentService.getUserPaymentsByStatement(this.selectedStatementId).subscribe({
      next: (data) => (this.statementUserPayments = data),
      error: (err) => console.error('Σφάλμα φόρτωσης πληρωμών statement', err)
    });
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
    console.log('Building ID που στέλνω:', this.buildingId);
  }

  loadCurrentMonthPayments(): void {
    if (!this.buildingId) return;
    this.paymentsLoading = true;

    this.paymentService.getLastStatementPayments(this.buildingId).subscribe({
      next: (data) => {
        this.statementUserPayments = data;
        this.paymentsLoading = false;
      },
      error: (err) => {
        console.error('Σφάλμα φόρτωσης πληρωμών τελευταίου statement', err);
        this.paymentsLoading = false;
      }
    });
  }

  loadBuildingsAndManagerDashboard() {
    this.buildingService.getMyManagedBuildings().subscribe({
      next: (buildings) => {
        console.log('Buildings received:', buildings);

        //Ελέγχουμε ότι είναι array και όχι άδειο
        if (Array.isArray(buildings) && buildings.length > 0) {
          this.managedBuildings = buildings;
          this.showBuildingSelector = buildings.length > 1;

          console.log('Managed buildings count:', buildings.length);
          console.log('ShowBuildingSelector:', this.showBuildingSelector);

          // Αν υπάρχει μόνο μία πολυκατοικία → επιλέγεται αυτόματα
          if (buildings.length === 1) {
            this.buildingId = buildings[0].id;
            localStorage.setItem('buildingId', this.buildingId.toString());
            this.loadAll();
          }
          // Αν υπάρχουν πολλές → επιλέγεται η πρώτη προεπιλεγμένα αλλά φαίνεται ο selector
          else if (buildings.length > 1) {
            this.buildingId = this.buildingId || buildings[0].id;
            this.currentBuilding = this.managedBuildings.find((b) => b.id === this.buildingId) || this.managedBuildings[0];
            localStorage.setItem('buildingId', this.buildingId.toString());
            this.loadAll();
          }
        } else {
          console.warn('Δεν βρέθηκαν πολυκατοικίες για τον διαχειριστή');
          this.managedBuildings = [];
          this.showBuildingSelector = false;
        }
      },
      error: (err) => {
        console.error('Σφάλμα κατά τη λήψη πολυκατοικιών', err);
        this.showBuildingSelector = false;
        this.managedBuildings = [];
      }
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

  loadRecentAnnouncements(): void {
    if (!this.buildingId) return;

    this.calendarService.getByBuilding(this.buildingId).subscribe({
      next: (events) => {
        // ταξινόμηση κατά ημερομηνία φθίνουσα
        this.announcements = events.sort((a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime()); // π.χ. εμφάνιση 3 πιο πρόσφατων
      },
      error: (err) => console.error('Σφάλμα φόρτωσης ανακοινώσεων:', err)
    });
  }

  goToAllAnnouncements(): void {
    this.router.navigate(['/calendar']); // ή το route που έχεις ορίσει
  }

  loadPolls(): void {
    this.loading = true;
    this.pollService.getAll(this.buildingId).subscribe({
      next: (res) => {
        this.polls = res.sort((a, b) => b.id - a.id);
        this.loading = false;
      },
      error: (err) => {
        console.error('Σφάλμα φόρτωσης ψηφοφοριών:', err);
        this.loading = false;
      }
    });
  }

  toggleVotes(pollId: number): void {
    if (this.expandedPollId === pollId) {
      this.expandedPollId = null;
      return;
    }
    this.expandedPollId = pollId;
    this.loadVotes(pollId);
  }

  loadVotes(pollId: number): void {
    this.votesLoading = true;
    this.pollService.getVotes(pollId).subscribe({
      next: (res: any[]) => {
        this.pollVotes = res;
        this.votesLoading = false;
      },
      error: (err) => {
        console.error('Σφάλμα φόρτωσης ψήφων:', err);
        this.votesLoading = false;
      }
    });
  }

  onDeactivate(poll: any): void {
    this.pollService.deactivate(poll.id).subscribe({
      next: () => this.loadPolls(),
      error: (err) => console.error('Σφάλμα απενεργοποίησης:', err)
    });
  }

  onView(poll: any): void {
    // μπορείς να κάνεις redirect ή modal
    console.log('Προβολή ψηφοφορίας:', poll);
  }

  onCreatePoll(): void {
    this.router.navigate(['/polls']);
  }

  onSort(field: string) {
    if (this.sortField === field) {
      this.sortAsc = !this.sortAsc; // Αν πατήσεις την ίδια στήλη, αντιστρέφει τη σειρά
    } else {
      this.sortField = field;
      this.sortAsc = true; // Ξεκινάει πάντα με αύξουσα
    }

    this.polls.sort((a, b) => {
      const aValue = a[field];
      const bValue = b[field];

      if (aValue == null) return 1;
      if (bValue == null) return -1;

      return this.sortAsc ? (aValue > bValue ? 1 : -1) : aValue < bValue ? 1 : -1;
    });
  }

  getSortIcon(field: string) {
    if (this.sortField !== field) return ''; // δεν έχει επιλεγεί
    return this.sortAsc ? '▲' : '▼';
  }
}
