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
import { StatisticsChartComponent } from 'src/app/theme/shared/apexchart/statistics-chart/statistics-chart.component';
import { TotalRevenueLineChartComponent } from './total-revenue-line-chart/total-revenue-line-chart.component';
import { StudentStatesChartComponent } from './student-states-chart/student-states-chart.component';
import { ActivityLineChartComponent } from './activity-line-chart/activity-line-chart.component';
import { VisitorsBarChartComponent } from './visitors-bar-chart/visitors-bar-chart.component';
import { EarningCoursesLineChartComponent } from './earning-courses-line-chart/earning-courses-line-chart.component';
import { PmDashboardService } from 'src/app/theme/shared/service/pm-dashboard.service';
import { PmDashboardDTO, PmFinancialChartDTO, PmMembershipStatsDTO } from 'src/app/theme/shared/models/pmDashboardDTO';
import { ExpenseCollectionRateChartComponent } from './expense-collection-rate-chart/expense-collection-rate-chart.component';
import { AttentionBuildingsTableComponent } from './attention-buildings-table/attention-buildings-table.component';
import { RecentActivityComponent } from './recent-activity/recent-activity.component';
import { NotificationsWidgetComponent } from './notifications-widget/notifications-widget.component';
import { QuickActionsComponent } from './quick-actions/quick-actions.component';
import { MembershipStatsWidgetComponent } from './membership-stats-widget/membership-stats-widget.component';

@Component({
  selector: 'app-pm-dashboard',
  imports: [
    SharedModule,
    StatisticsChartComponent,
    ExpenseCollectionRateChartComponent,
    AttentionBuildingsTableComponent,
    TotalRevenueLineChartComponent,
    StudentStatesChartComponent,
    ActivityLineChartComponent,
    VisitorsBarChartComponent,
    EarningCoursesLineChartComponent,
    RecentActivityComponent,
    NotificationsWidgetComponent,
    QuickActionsComponent,
    MembershipStatsWidgetComponent,
    
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

  queriesList = [
    {
      image: 'assets/images/user/avatar-2.jpg',
      title: 'Python $ Data Manage'
    },
    {
      image: 'assets/images/user/avatar-1.jpg',
      title: 'Website Error'
    },
    {
      image: 'assets/images/user/avatar-3.jpg',
      title: 'How to Illustrate'
    },
    {
      image: 'assets/images/user/avatar-4.jpg',
      title: 'PHP Learning'
    }
  ];

  userActivity = [
    {
      image: 'assets/images/user/avatar-4.jpg',
      name: 'Airi Satou',
      rating: '5.0',
      qualification: 'Developer'
    },
    {
      image: 'assets/images/user/avatar-1.jpg',
      name: 'Ashton Cox',
      rating: '4.5',
      qualification: 'Junior Technical'
    },
    {
      image: 'assets/images/user/avatar-2.jpg',
      name: 'Bradley Greer',
      rating: '4.3',
      qualification: 'Sales Assistant'
    },
    {
      image: 'assets/images/user/avatar-3.jpg',
      name: 'Brielle Williamson',
      rating: '4.9',
      qualification: 'JavaScript Developer'
    },
    {
      image: 'assets/images/user/avatar-5.jpg',
      name: 'Airi Satou',
      rating: '5.0',
      qualification: 'Developer'
    }
  ];

  trendingCourse = [
    {
      image: 'assets/images/admin/img-bootstrap.svg',
      title: 'Bootstrap 5 Beginner Course'
    },
    {
      image: 'assets/images/admin/img-php.svg',
      title: 'PHP Training Course'
    },
    {
      image: 'assets/images/admin/img-ux.svg',
      title: 'UI/UX Training Course'
    },
    {
      image: 'assets/images/admin/img-web.svg',
      title: 'Web Designing Course'
    },
    {
      image: 'assets/images/admin/img-c.svg',
      title: 'C Training Course'
    },
    {
      image: 'assets/images/admin/img-c.svg',
      title: 'C Training Course'
    }
  ];

  notificationList = [
    {
      image: 'assets/images/user/avatar-1.jpg',
      title: 'Report Successfully',
      time: 'Today | 9:00 AM'
    },
    {
      image: 'assets/images/user/avatar-5.jpg',
      title: 'Reminder: Test time',
      time: 'Yesterday | 6:30 PM'
    },
    {
      image: 'assets/images/user/avatar-3.jpg',
      title: 'Send course pdf',
      time: '05 Feb | 3:45 PM'
    },
    {
      image: 'assets/images/user/avatar-2.jpg',
      title: 'Report Successfully',
      time: '05 Feb | 4:00 PM'
    }
  ];

  course_states = [
    {
      name: 'Web Designing Course',
      teacher: 'Airi Satou',
      rating: '4.8',
      earning: '$200',
      sale: '5/7'
    },
    {
      name: 'UI/UX Training Course',
      teacher: 'Ashton Cox',
      rating: '5.0',
      earning: '$100',
      sale: '4/7'
    },
    {
      name: 'PHP Training Course',
      teacher: '	Bradley Greer',
      rating: '4.9',
      earning: '$80',
      sale: '2/7'
    },
    {
      name: 'Bootstrap 5 Course',
      teacher: 'Brielle Williamson',
      rating: '4.4',
      earning: '$150',
      sale: '6/7'
    },
    {
      name: 'C Training Course',
      teacher: 'Cedric Kelly',
      rating: '4.3',
      earning: '$50',
      sale: '3/7'
    }
  ];

  get today() {
    return this.dateAdapter.toModel(this.ngbCalendar.getToday())!;
  }
}
