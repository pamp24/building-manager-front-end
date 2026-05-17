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
import { PmBuildingManagerRowDTO, PmDashboardDTO, PmFinancialChartDTO, PmMembershipStatsDTO } from 'src/app/theme/shared/models/pmDashboardDTO';
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
  private iconService = inject(IconService);
  private ngbCalendar = inject(NgbCalendar);
  private dateAdapter = inject<NgbDateAdapter<string>>(NgbDateAdapter);

  private pmDashboardService = inject(PmDashboardService);
  dashboardData!: PmDashboardDTO;

  dashboard_summary: {
    icon: string;
    background: string;
    title: string;
    value: number | string;
    percentage: string;
    color: string;
  }[] = [];

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
    this.pmDashboardService.getDashboard().subscribe({
      next: (data) => {
        this.dashboardData = data;

        this.dashboard_summary = [
          {
            icon: 'home',
            background: 'bg-light-primary',
            title: 'Πολυκατοικίες',
            value: data.summary.totalBuildings,
            percentage: '',
            color: 'text-primary'
          },
          {
            icon: 'apartment',
            background: 'bg-light-success',
            title: 'Διαμερίσματα',
            value: data.summary.totalApartments,
            percentage: '',
            color: 'text-success'
          },
          {
            icon: 'credit-card',
            background: 'bg-light-warning',
            title: 'Εκκρεμείς Οφειλές',
            value: data.summary.pendingAmount + '€',
            percentage: '',
            color: 'text-warning'
          },
          {
            icon: 'fall',
            background: 'bg-light-danger',
            title: 'Ληξιπρόθεσμα',
            value: data.summary.overdueAmount + '€',
            percentage: '',
            color: 'text-danger'
          }
        ];
      }
    });
  }

  loadBuildingManagers(): void {
  this.pmDashboardService.getBuildingManagers().subscribe({
    next: (res) => {
      this.buildingManagers = res;
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
    this.pmDashboardService.getDashboard().subscribe({
      next: (res) => {
        this.dashboardData = res;
      },
      error: (err) => {
        console.error('Failed to load PM dashboard', err);
      }
    });
  }
}
