// angular import
import { Component, inject, OnInit } from '@angular/core';

// icons
import { IconService } from '@ant-design/icons-angular';
import {
  CloseCircleFill,
  DeleteOutline,
  DollarCircleFill,
  DownloadOutline,
  EditOutline,
  EyeOutline,
  FileTextFill,
  FileTextOutline,
  HourglassFill,
  LinkOutline,
  MoreOutline,
  PlusOutline,
  ReconciliationFill,
  SettingOutline,
  ShoppingFill
} from '@ant-design/icons-angular/icons';

// project import
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { InvoiceChartComponent } from './invoice-chart/invoice-chart.component';
import { TotalExpensesChartComponent } from './total-expenses-chart/total-expenses-chart.component';
import { ManagerDashboardService } from '../../../../theme/shared/service/managerDashboard.service';
import { ManagerDashboardDTO } from '../../../../theme/shared/models/managerDashboardDTO';
import { BuildingService } from '../../../../theme/shared/service/building.service';
import { BuildingDTO } from '../../../../theme/shared/models/buildingDTO';
import { TabNavigationService } from '../../../../theme/shared/service/TabNavigation.service';
import { PaymentService } from '../../../../theme/shared/service/payment.service';
import { PaymentDTO } from '../../../../theme/shared/models/paymentDTO';
import { effect } from '@angular/core';
import { ThemeService } from '../../../../theme/shared/service/customs-theme.service';

@Component({
  selector: 'app-invoice-dashboard',
  imports: [SharedModule, InvoiceChartComponent, TotalExpensesChartComponent],
  templateUrl: './invoice-dashboard.component.html',
  styleUrl: './invoice-dashboard.component.scss'
})
export class InvoiceDashboardComponent implements OnInit {
  private themeService = inject(ThemeService);
  backgroundColor!: string;
  private managerDashboardService = inject(ManagerDashboardService);
  private iconService = inject(IconService);
  dashboardData?: ManagerDashboardDTO;
  buildingId: number = Number(localStorage.getItem('buildingId'));
  managedBuildings: BuildingDTO[] = [];
  private tabNav = inject(TabNavigationService);
  activeTab = 1;
  recentPayments: PaymentDTO[] = [];

  // constructor
  constructor(
    private buildingService: BuildingService,
    private paymentService: PaymentService
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
        SettingOutline
      ]
    );
    this.iconService.addIcon(...[MoreOutline, PlusOutline, EyeOutline, EditOutline, DeleteOutline]);
    effect(() => {
      this.isDarkTheme(this.themeService.isDarkMode());
    });
  }
  ngOnInit(): void {
    this.loadBuildingsAndManagerDashboard();
    this.loadRecentPayments();
  }
    private isDarkTheme(isDark: boolean) {
    this.backgroundColor = isDark ? 'bg-gray-800' : 'bg-gray-200';
  }

  loadBuildingsAndManagerDashboard() {
    this.buildingService.getMyManagedBuildings().subscribe({
      next: (buildings) => {
        if (buildings && buildings.length > 0) {
          console.log('Buildings:', buildings);
          this.buildingId = buildings[0].id; // default το πρώτο
          this.loadDashboard();
        } else {
          console.warn('Δεν βρέθηκαν πολυκατοικίες για τον διαχειριστή');
        }
      },
      error: (err) => {
        console.error('Σφάλμα κατά τη λήψη των πολυκατοικιών διαχειριστή', err);
      }
    });
  }

  loadDashboard() {
    if (!this.buildingId) return;
    this.managerDashboardService.getDashboardForBuilding(this.buildingId).subscribe({
      next: (data) => {
        console.log('Dashboard data:', data);
        this.dashboardData = data;
      },
      error: (err) => console.error('Σφάλμα φόρτωσης dashboard', err)
    });
  }

  goToTab(tabId: number) {
    console.log('Μετάβαση στην καρτέλα:', tabId);
    this.tabNav.goToTab(tabId);

    setTimeout(() => {
      const element = document.getElementById('invoice-section');
      if (element) element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  }

  scrollToInvoices() {
    document.querySelector('#invoice-section')?.scrollIntoView({
      behavior: 'smooth',
      block: 'start'
    });
  }

  loadRecentPayments(): void {
    if (!this.buildingId) return;
    this.paymentService.getRecentByBuilding(this.buildingId).subscribe({
      next: (data) => (this.recentPayments = data),
      error: (err) => console.error('Σφάλμα φόρτωσης πρόσφατων πληρωμών', err)
    });
  }

  notificationList = [
    {
      title: 'Johnny sent you an invoice billed',
      link: true,
      linkValue: '$1,000',
      date: '2 August',
      icon: 'download',
      background: 'bg-light-success',
      text: false
    },
    {
      title: 'Sent an invoice to Aida Bugg amount of',
      link: true,
      linkValue: '$200',
      date: '7 hours ago',
      icon: 'file-text',
      background: 'bg-light-primary',
      text: false
    },
    {
      title: 'There was a failure to your setup',
      link: false,
      date: '5 hours ago',
      icon: 'setting',
      background: 'bg-light-danger',
      text: false
    },
    {
      title: 'Cristina danny invited to you join Meetingp',
      link: false,
      date: '6 hours ago',
      background: 'bg-light-primary',
      text: true
    },
    {
      title: 'Cristina danny invited to you join Meetingp',
      link: false,
      date: '5 hours ago',
      background: 'bg-light-primary',
      text: true
    }
  ];
  
  transactionsHistoryList = [
    {
      image: 'assets/images/user/avatar-1.jpg',
      name: 'John lu',
      category: 'Salary Payment',
      date: '2023/02/07',
      time: '09:05 PM',
      amount: '$950.54',
      status: 'completed'
    },
    {
      image: 'assets/images/user/avatar-2.jpg',
      name: 'Ashton Cox',
      category: 'Project Payment',
      date: '2023/02/01',
      time: '02:14 PM',
      amount: '$520.30',
      status: 'completed'
    },
    {
      image: 'assets/images/user/avatar-3.jpg',
      name: 'Bradley Greer',
      category: 'You Tube Subscribe',
      date: '2023/01/22',
      time: '10:32 AM',
      amount: '$100.00',
      status: 'pending'
    },
    {
      image: 'assets/images/user/avatar-4.jpg',
      name: 'Brielle Williamson',
      category: 'Slary Payment',
      date: '2023/02/07',
      time: '09:05 PM',
      amount: '$760.25',
      status: 'progress'
    },
    {
      image: 'assets/images/user/avatar-5.jpg',
      name: 'Airi Satou',
      category: 'Spotify Subscribe',
      date: '2023/02/07',
      time: '09:05 PM',
      amount: '$60.05',
      status: 'canceled'
    }
  ];
}
