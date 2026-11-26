import { UiLocaleService } from 'src/app/theme/shared/service/ui-locale.service';
import { Component, inject, OnInit } from '@angular/core';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import {
  ApartmentOutline,
  ArrowUpOutline,
  BookOutline,
  CreditCardOutline,
  DeleteOutline,
  EditOutline,
  EyeOutline,
  FallOutline,
  HomeOutline,
  RightOutline,
  RiseOutline,
  StarFill,
  UserOutline
} from '@ant-design/icons-angular/icons';
import { NgbCalendar, NgbDateAdapter } from '@ng-bootstrap/ng-bootstrap';
import { IconService } from '@ant-design/icons-angular';
import { PmDashboardService } from 'src/app/theme/shared/service/pm-dashboard.service';
import {
  PmBuildingManagerRowDTO,
  PmDashboardDTO,
  PmFinancialChartDTO,
  PmMembershipStatsDTO
} from 'src/app/theme/shared/models/pmDashboardDTO';
import { ExpenseCollectionRateChartComponent } from './expense-collection-rate-chart/expense-collection-rate-chart.component';
import { AttentionBuildingsTableComponent } from './attention-buildings-table/attention-buildings-table.component';
import { RecentActivityComponent } from './recent-activity/recent-activity.component';
import { NotificationsWidgetComponent } from './notifications-widget/notifications-widget.component';
import { QuickActionsComponent } from './quick-actions/quick-actions.component';
import { MembershipStatsWidgetComponent } from './membership-stats-widget/membership-stats-widget.component';
import { PmBuildingManagersTableComponent } from './pm-building-managers-table/pm-building-managers-table.component';

import { TicketRecentActivityTableComponent } from 'src/app/theme/shared/apexchart/ticket-recent-activity-table/ticket-recent-activity-table.component';
import { PmStatisticsChartComponent } from 'src/app/theme/shared/apexchart/pm-statistics-chart/pm-statistics-chart.component.ts';

@Component({
  selector: 'app-pm-dashboard',
  imports: [
    SharedModule,
    PmStatisticsChartComponent,
    ExpenseCollectionRateChartComponent,
    AttentionBuildingsTableComponent,
    RecentActivityComponent,
    NotificationsWidgetComponent,
    QuickActionsComponent,
    MembershipStatsWidgetComponent,
    PmBuildingManagersTableComponent,
    TicketRecentActivityTableComponent
  ],
  templateUrl: './pm-dashboard.component.html',
  styleUrl: './pm-dashboard.component.scss'
})
export class PmDashboardComponent implements OnInit {
  private readonly uiLocale = inject(UiLocaleService);

  private iconService = inject(IconService);
  private ngbCalendar = inject(NgbCalendar);
  private dateAdapter = inject<NgbDateAdapter<string>>(NgbDateAdapter);

  private pmDashboardService = inject(PmDashboardService);
  dashboardData: PmDashboardDTO = {
    summary: { totalBuildings: 0, totalApartments: 0, pendingAmount: 0, overdueAmount: 0 },
    attentionBuildings: [],
    recentActivity: [],
    notifications: []
  };
  loading = false;
  loadError = false;

  get dashboard_summary() {
    const summary = this.dashboardData?.summary;
    return [
      {
        icon: 'home',
        background: 'bg-light-primary',
        title: this.uiLocale.text('Apartment buildings'),
        value: summary?.totalBuildings ?? 0,
        percentage: '',
        color: 'text-primary'
      },
      {
        icon: 'apartment',
        background: 'bg-light-success',
        title: this.uiLocale.text('Apartments'),
        value: summary?.totalApartments ?? 0,
        percentage: '',
        color: 'text-success'
      },
      {
        icon: 'credit-card',
        background: 'bg-light-warning',
        title: this.uiLocale.text('Outstanding Debts'),
        value: (summary?.pendingAmount ?? 0) + ' €',
        percentage: '',
        color: 'text-warning'
      },
      {
        icon: 'fall',
        background: 'bg-light-danger',
        title: this.uiLocale.text('Overdue'),
        value: (summary?.overdueAmount ?? 0) + ' €',
        percentage: '',
        color: 'text-danger'
      }
    ];
  }

  financialChart?: PmFinancialChartDTO;
  chartPeriod = 'month';

  membershipStats: PmMembershipStatsDTO | null = null;
  buildingManagers: PmBuildingManagerRowDTO[] = [];

  // calender
  model1!: string;

  // constructor
  constructor() {
    this.iconService.addIcon(
      ...[
        HomeOutline,
        ApartmentOutline,
        UserOutline,
        BookOutline,
        EyeOutline,
        CreditCardOutline,
        RightOutline,
        ArrowUpOutline,
        RiseOutline,
        FallOutline,
        DeleteOutline,
        StarFill,
        EditOutline
      ]
    );
  }

  ngOnInit(): void {
    this.loadFinancialChart();
    this.loadMembershipStats();
    this.loadBuildingManagers();
    this.loadDashboard();
  }

  loadBuildingManagers(): void {
    this.pmDashboardService.getBuildingManagers().subscribe({
      next: (res) => {
        this.buildingManagers = res ?? [];
      },
      error: (err) => {
        console.error('Failed to load building managers', err);
      }
    });
  }

  loadMembershipStats(): void {
    this.pmDashboardService.getMembershipStats().subscribe({
      next: (res) => {
        this.membershipStats = res;
      },
      error: (err) => {
        console.error('Failed to load membership stats', err);
      }
    });
  }

  loadFinancialChart(): void {
    this.pmDashboardService.getFinancialChart(this.chartPeriod).subscribe({
      next: (data) => {
        this.financialChart = data;
      },
      error: (err) => console.error('Σφάλμα φόρτωσης financial chart', err)
    });
  }

  onChartPeriodChange(period: string): void {
    this.chartPeriod = period;
    this.loadFinancialChart();
  }

  loadDashboard(): void {
    this.loading = true;
    this.loadError = false;
    this.pmDashboardService.getDashboard().subscribe({
      next: (res) => {
        this.dashboardData = res ?? this.dashboardData;
        this.loading = false;
      },
      error: (err) => {
        this.loading = false;
        this.loadError = true;
        console.error('Failed to load PM dashboard', err);
      }
    });
  }
}
