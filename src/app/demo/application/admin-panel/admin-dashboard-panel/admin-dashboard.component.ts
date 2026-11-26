import { UiLocaleService } from 'src/app/theme/shared/service/ui-locale.service';
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { catchError, finalize, forkJoin, of } from 'rxjs';

import { AdminDashboardService } from 'src/app/theme/shared/service/admin-dashboard.service';
import { AdminDashboardResponse } from 'src/app/theme/shared/models/admin-dashboard.model';
import { ProfessionalAdminStatsDTO } from 'src/app/theme/shared/models/professional.model';
import { ProfessionalService } from 'src/app/theme/shared/service/professional.service';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { IconService } from '@ant-design/icons-angular';
import {
  BankOutline,
  TeamOutline,
  ShopOutline,
  UserSwitchOutline,
  LoginOutline,
  CalendarOutline,
  UserAddOutline,
  WarningOutline,
  HomeOutline,
  MailOutline,
  NotificationOutline,
  CheckCircleOutline,
  PieChartOutline
} from '@ant-design/icons-angular/icons';
import { NgApexchartsModule } from 'ng-apexcharts';

interface DashboardStatCard {
  title: string;
  value: number | string;
  icon: string;
  background: string;
  color: string;
  percentage?: string;
}

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, SharedModule, NgApexchartsModule],
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.scss'
})
export class AdminDashboardComponent implements OnInit {
  private readonly uiLocale = inject(UiLocaleService);

  private iconService = inject(IconService);
  private dashboardService = inject(AdminDashboardService);
  private professionalService = inject(ProfessionalService);

  loading = false;
  errorMessage = '';

  dashboard: AdminDashboardResponse = this.normalizeDashboard(null);

  private normalizeDashboard(data: AdminDashboardResponse | null): AdminDashboardResponse {
    return {
      overview: { totalBuildings: 0, totalUsers: 0, totalCompanies: 0, totalManagers: 0, ...data?.overview },
      userActivity: { activeUsersToday: 0, activeUsersThisWeek: 0, newRegistrationsThisMonth: 0, ...data?.userActivity },
      buildingActivity: {
        newBuildingsThisMonth: 0,
        totalBuildings: 0,
        buildingsWithoutManager: 0,
        buildingsWithoutApartments: 0,
        ...data?.buildingActivity
      },
      apartmentUsage: { totalApartments: 0, assignedApartments: 0, vacantApartments: 0, ...data?.apartmentUsage },
      operationalIssues: { buildingsWithoutManager: 0, apartmentsWithoutOwner: 0, pendingInvites: 0, ...data?.operationalIssues },
      engagementStats: {
        announcementsCount: 0,
        votingsCount: 0,
        participationRate: 0,
        invitesSent: 0,
        invitesAccepted: 0,
        pendingInvites: 0,
        ...data?.engagementStats
      },
      growthStats: { userGrowth: [], buildingGrowth: [], inviteGrowth: [], ...data?.growthStats }
    };
  }
  professionalStats: ProfessionalAdminStatsDTO | null = null;

  overviewCards: DashboardStatCard[] = [];
  professionalCards: DashboardStatCard[] = [];
  activityCards: DashboardStatCard[] = [];

  usersGrowthTotal = 0;
  buildingsGrowthTotal = 0;
  invitesGrowthTotal = 0;

  apartmentUsageChart: any = {};

  managedBuildingsPercent = 0;
  buildingsWithApartmentsPercent = 0;
  apartmentOccupancyPercent = 0;
  inviteAcceptancePercent = 0;
  invitePendingPercent = 0;

  constructor() {
    this.iconService.addIcon(
      ...[
        BankOutline,
        TeamOutline,
        ShopOutline,
        UserSwitchOutline,
        LoginOutline,
        CalendarOutline,
        UserAddOutline,
        WarningOutline,
        HomeOutline,
        MailOutline,
        NotificationOutline,
        CheckCircleOutline,
        PieChartOutline
      ]
    );
  }

  ngOnInit(): void {
    this.buildCards();
    this.loadDashboard();
  }

  loadDashboard(): void {
    this.loading = true;
    this.errorMessage = '';

    forkJoin({
      dashboard: this.dashboardService.getDashboard(),
      professionalStats: this.professionalService.getAdminStats().pipe(catchError(() => of(null)))
    })
      .pipe(finalize(() => (this.loading = false)))
      .subscribe({
        next: ({ dashboard, professionalStats }) => {
          this.dashboard = this.normalizeDashboard(dashboard);
          this.professionalStats = professionalStats;
          this.buildCards();
        },
        error: (err) => {
          this.errorMessage = err?.error?.message || this.uiLocale.text('Error loading dashboard');
        }
      });
  }

  private buildCards(): void {
    if (!this.dashboard) {
      this.overviewCards = [];
      this.professionalCards = [];
      this.activityCards = [];
      return;
    }

    this.overviewCards = [
      {
        title: this.uiLocale.text('Total Apartment Buildings'),
        value: this.dashboard.overview.totalBuildings,
        icon: 'bank',
        background: 'bg-light-primary',
        color: 'text-primary'
      },
      {
        title: this.uiLocale.text('Total Users'),
        value: this.dashboard.overview.totalUsers,
        icon: 'team',
        background: 'bg-light-success',
        color: 'text-success'
      },
      {
        title: this.uiLocale.text('Management Companies'),
        value: this.dashboard.overview.totalCompanies,
        icon: 'shop',
        background: 'bg-light-warning',
        color: 'text-warning'
      },
      {
        title: this.uiLocale.text('General Managers'),
        value: this.dashboard.overview.totalManagers,
        icon: 'user-switch',
        background: 'bg-light-info',
        color: 'text-info'
      }
    ];

    this.professionalCards = [
      {
        title: this.uiLocale.text('Total Professionals'),
        value: this.professionalStats?.totalBusinesses || 0,
        icon: 'team',
        background: 'bg-light-primary',
        color: 'text-primary'
      },
      {
        title: this.uiLocale.text('Active Professionals'),
        value: this.professionalStats?.approvedBusinesses || 0,
        icon: 'check-circle',
        background: 'bg-light-success',
        color: 'text-success'
      },
      {
        title: this.uiLocale.text('Inactive Professionals'),
        value: this.professionalStats?.inactiveBusinesses || 0,
        icon: 'warning',
        background: 'bg-light-danger',
        color: 'text-danger'
      },
      {
        title: this.uiLocale.text('Pending Entries'),
        value: this.professionalStats?.pendingBusinesses || 0,
        icon: 'notification',
        background: 'bg-light-warning',
        color: 'text-warning'
      }
    ];

    this.activityCards = [
      {
        title: this.uiLocale.text('Active Today'),
        value: this.dashboard.userActivity.activeUsersToday,
        icon: 'login',
        background: 'bg-light-primary',
        color: 'text-primary'
      },
      {
        title: this.uiLocale.text('Active of the Week'),
        value: this.dashboard.userActivity.activeUsersThisWeek,
        icon: 'calendar',
        background: 'bg-light-success',
        color: 'text-success'
      },
      {
        title: this.uiLocale.text('New Registrations'),
        value: this.dashboard.userActivity.newRegistrationsThisMonth,
        icon: 'user-add',
        background: 'bg-light-warning',
        color: 'text-warning'
      }
    ];
    this.buildDerivedMetrics();
    this.buildCharts();
  }

  private buildDerivedMetrics(): void {
    if (!this.dashboard) {
      this.inviteAcceptancePercent = 0;
      this.invitePendingPercent = 0;
      this.usersGrowthTotal = 0;
      this.buildingsGrowthTotal = 0;
      this.invitesGrowthTotal = 0;
      return;
    }

    const totalBuildings = this.dashboard.buildingActivity.totalBuildings || 0;
    const withoutManager = this.dashboard.buildingActivity.buildingsWithoutManager || 0;
    const withoutApartments = this.dashboard.buildingActivity.buildingsWithoutApartments || 0;

    const totalApartments = this.dashboard.apartmentUsage.totalApartments || 0;
    const assignedApartments = this.dashboard.apartmentUsage.assignedApartments || 0;

    this.managedBuildingsPercent = totalBuildings ? Math.round(((totalBuildings - withoutManager) / totalBuildings) * 100) : 0;

    this.buildingsWithApartmentsPercent = totalBuildings ? Math.round(((totalBuildings - withoutApartments) / totalBuildings) * 100) : 0;

    this.apartmentOccupancyPercent = totalApartments ? Math.round((assignedApartments / totalApartments) * 100) : 0;

    const invitesSent = this.dashboard.engagementStats?.invitesSent || 0;
    const invitesAccepted = this.dashboard.engagementStats?.invitesAccepted || 0;
    const pendingInvites = this.dashboard.engagementStats?.pendingInvites || 0;

    this.inviteAcceptancePercent = invitesSent ? Math.round((invitesAccepted / invitesSent) * 100) : 0;

    this.invitePendingPercent = invitesSent ? Math.round((pendingInvites / invitesSent) * 100) : 0;

    this.usersGrowthTotal = this.dashboard.growthStats?.userGrowth?.reduce((sum, item) => sum + item.value, 0) || 0;
    this.buildingsGrowthTotal = this.dashboard.growthStats?.buildingGrowth?.reduce((sum, item) => sum + item.value, 0) || 0;
    this.invitesGrowthTotal = this.dashboard.growthStats?.inviteGrowth?.reduce((sum, item) => sum + item.value, 0) || 0;
  }

  private buildCharts(): void {
    if (!this.dashboard) {
      this.apartmentUsageChart = {};
      return;
    }

    this.apartmentUsageChart = {
      series: [this.dashboard.apartmentUsage.assignedApartments, this.dashboard.apartmentUsage.vacantApartments],
      chart: {
        type: 'donut',
        height: 280
      },
      labels: [this.uiLocale.text('Busy'), this.uiLocale.text('Empty')],
      dataLabels: {
        enabled: true
      },
      plotOptions: {
        pie: {
          donut: {
            size: '68%'
          }
        }
      },
      legend: {
        show: false
      },
      stroke: {
        width: 0
      },
      colors: ['#52c41a', '#d9d9d9']
    };
  }
}
