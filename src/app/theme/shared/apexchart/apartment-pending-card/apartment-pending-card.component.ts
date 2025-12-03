// angular import
import { Component, effect, inject } from '@angular/core';

// project import
import { SharedModule } from '../../shared.module';
import { ThemeService } from '../../service/customs-theme.service';

// icons
import { IconService } from '@ant-design/icons-angular';
import { FallOutline } from '@ant-design/icons-angular/icons';

// services
import { UserDashboardService } from '../../service/userDashboard.service';

// third party
import { NgApexchartsModule, ApexOptions } from 'ng-apexcharts';

@Component({
  selector: 'app-apartment-pending-card',
  imports: [NgApexchartsModule, SharedModule],
  templateUrl: './apartment-pending-card.component.html',
  styleUrl: './apartment-pending-card.component.scss'
})
export class ApartmentPendingCardComponent {
  private themeService = inject(ThemeService);
  private iconService = inject(IconService);
  private dashboardService = inject(UserDashboardService);

  chartOptions!: ApexOptions;
  unpaidAmount = 0; // <-- Εδώ αποθηκεύεται το ανεξόφλητο

  constructor() {
    // sparkline chart
    this.chartOptions = {
      chart: { type: 'area', height: 100, sparkline: { enabled: true } },
      colors: ['#ff4d4f'],
      plotOptions: { bar: { columnWidth: '80%' } },
      series: [
        {
          data: [
            1800, 1500, 1800, 1700, 1400, 1200, 1000, 800, 600, 500,
            600, 800, 500, 700, 400, 600, 500, 600
          ]
        }
      ],
      xaxis: { crosshairs: { width: 1 } },
      tooltip: {
        theme: 'light',
        fixed: { enabled: false },
        x: { show: false },
        marker: { show: true }
      }
    };

    this.iconService.addIcon(...[FallOutline]);

    // theme effects
    effect(() => {
      this.isDarkTheme(this.themeService.isDarkMode());
      this.rerenderChartOnContainerResize(this.themeService.isContainerMode());
    });

    // load from backend
    this.loadUnpaid();
  }

  // === LOAD BACKEND VALUE ===
  loadUnpaid() {
    this.dashboardService.getUnpaidForApartment().subscribe({
      next: (amount) => (this.unpaidAmount = amount),
      error: (err) => console.error('Unpaid fetch error:', err)
    });
  }

  // === THEME ===
  private isDarkTheme(isDark: boolean) {
    const tooltip = { ...this.chartOptions.tooltip };
    tooltip.theme = isDark ? 'dark' : 'light';
    this.chartOptions = { ...this.chartOptions, tooltip };
  }

  private rerenderChartOnContainerResize(isContainer: boolean) {
    const chart = { ...this.chartOptions.chart };
    chart.redrawOnParentResize = !isContainer;
    this.chartOptions = { ...this.chartOptions, chart } as ApexOptions;
  }
}
