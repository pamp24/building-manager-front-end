/* eslint-disable @typescript-eslint/no-explicit-any */
// angular import
import { Component, effect, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

// project import
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { SalesReportChartComponent } from 'src/app/theme/shared/apexchart/sales-report-chart/sales-report-chart.component';

// icons
import { IconService } from '@ant-design/icons-angular';
import { AcquisitionChartComponent } from 'src/app/theme/shared/apexchart/acquisition-chart/acquisition-chart.component';
import { CheckOutline, CloseOutline, ClockCircleOutline, PlusOutline } from '@ant-design/icons-angular/icons';
import { ThemeService } from 'src/app/theme/shared/service/customs-theme.service';
import { Router, RouterModule } from '@angular/router';
import { UserDashboardService } from '../../../theme/shared/service/userDashboard.service';
import { PaymentModalComponent } from './payment-modal/payment-modal.component';
import { BuildingTotalCardComponent } from '../../../theme/shared/apexchart/building-total-card/building-total-card.component';
import { BuildingChartComponent } from '../../../theme/shared/apexchart/building-chart/building-chart.component';
import { LastStatementCardComponent } from '../../../theme/shared/apexchart/last-statement-card/last-statement-card.component';
import { PollsTableComponent } from '../../../theme/shared/apexchart/polls-table/polls-table.component';
import { NgbModalModule, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { BuildingAnnouncementsCardComponent } from "src/app/theme/shared/apexchart/building-announcements-card/building-announcements-card.component";


@Component({
  selector: 'app-default',
  imports: [
    CommonModule,
    SharedModule,
    PollsTableComponent,
    SalesReportChartComponent,
    CommonModule,
    SharedModule,
    LastStatementCardComponent,
    AcquisitionChartComponent,
    PollsTableComponent,
    BuildingTotalCardComponent,
    BuildingChartComponent,
    SalesReportChartComponent,
    RouterModule,
    NgbModalModule,
    BuildingAnnouncementsCardComponent
],
  templateUrl: './default.component.html',
  styleUrls: ['./default.component.scss']
})
export class DefaultComponent implements OnInit {
  dashboardLoaded = false;
  dashboard: any;
  private iconService = inject(IconService);
  private themeService = inject(ThemeService);
  private dashboardService = inject(UserDashboardService);
  role: string | null = null;
  totalAmount = 0;
  lastStatementItems: any[] = [];
  allocations: any[] = [];
  selectedAllocation: any = null;
  // public props
  isDarkThemes!: boolean;
buildingId: any;

  // constructor
  constructor(
    private router: Router,
    private userDashboardService: UserDashboardService,
    private modal: NgbModal
  ) {
    this.iconService.addIcon(...[CheckOutline, CloseOutline, ClockCircleOutline, PlusOutline]);
    effect(() => {
      this.isDarkTheme(this.themeService.isDarkMode());
    });
    this.loadRole();
  }

  ngOnInit(): void {
    this.loadLastStatementItems();

    this.userDashboardService.getDashboard().subscribe({
      next: (res) => {
        this.dashboard = res;
        this.dashboardLoaded = true;
      }
    });
    this.loadAllocations();
  }

  private loadRole() {
    const userStr = localStorage.getItem('currentUser');
    if (userStr) {
      const user = JSON.parse(userStr);
      this.role = user.role || null;
      console.log('USER ROLE (localStorage):', this.role);
    }
  }

  // private methods
  private isDarkTheme(isDark: boolean) {
    this.isDarkThemes = isDark;
  }

  loadLastStatementItems() {
    this.userDashboardService.getLastStatementItems().subscribe({
      next: (items) => {
        this.lastStatementItems = items;

        this.totalAmount = items.reduce((sum, i) => sum + (i.price || 0), 0);
      },
      error: (err) => console.error(err)
    });
  }

  categoryLabels: any = {
    COMMON: 'Κοινόχρηστα',
    HEATING: 'Θέρμανση',
    ELEVATOR: 'Ανελκυστήρας',
    EQUAL: 'Ίσα Έξοδα',
    BOILER: 'Λέβητας',
    SPECIAL: 'Ειδική Δαπάνη',
    OWNERS: 'Ιδιοκτήτες',
    OTHER: 'Άλλες Δαπάνες'
  };

  translateCategory(category: string): string {
    return this.categoryLabels[category] || category;
  }

  loadAllocations() {
  this.dashboardService.getUserStatements().subscribe({
    next: (allocs) => {
      this.allocations = allocs;
    }
  });
}

  openModal(task: any) {
  const ref = this.modal.open(PaymentModalComponent, { size: 'md' });
  ref.componentInstance.allocation = task;

  ref.result.then(
    amount => this.handlePay(amount),
    () => {}
  );
}


  handlePay(amount: number) {
    const id = this.selectedAllocation.id;

    this.userDashboardService.payAllocation(id, amount).subscribe({
      next: () => {
        this.loadAllocations();
      }
    });
  }
}
