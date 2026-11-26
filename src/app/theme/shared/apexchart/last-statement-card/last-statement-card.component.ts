import { UiLocaleService } from 'src/app/theme/shared/service/ui-locale.service';
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component, inject, OnInit } from '@angular/core';
import { SharedModule } from '../../shared.module';
import { NgApexchartsModule, ApexOptions } from 'ng-apexcharts';
import { ThemeService } from '../../service/customs-theme.service';
import { IconService } from '@ant-design/icons-angular';
import { FallOutline, RiseOutline } from '@ant-design/icons-angular/icons';
import { UserDashboardService } from '../../service/userDashboard.service';

@Component({
  selector: 'app-last-statement-card',
  standalone: true,
  imports: [SharedModule, NgApexchartsModule],
  templateUrl: './last-statement-card.component.html',
  styleUrls: ['./last-statement-card.component.scss']
})
export class LastStatementCardComponent implements OnInit {
  private readonly uiLocale = inject(UiLocaleService);

  private themeService = inject(ThemeService);
  private dashboardService = inject(UserDashboardService);

  chartOptions!: ApexOptions;

  loadError = false;
  hasHistory = false;
  debt = 0;
  month: string | null = null;
  role: string | null = null;

  lastAmount = 0;
  previousAmount = 0;
  differencePercent = 0;

  badgeClass = '';
  badgeIcon = '';

  constructor(private iconService: IconService) {
    this.iconService.addIcon(...[RiseOutline, FallOutline]);
  }

  ngOnInit(): void {
    this.initChart();
    this.loadDashboard();
    this.loadHistory();
  }

  private initChart() {
    this.chartOptions = {
      chart: { type: 'bar', height: 100, sparkline: { enabled: true } },
      colors: ['#1677ff'],
      plotOptions: { bar: { columnWidth: '80%' } },
      dataLabels: { enabled: false },
      legend: { show: false },
      series: [{ data: [] }],
      tooltip: {
        theme: 'light',
        x: { show: false },
        marker: { show: false },
        fillSeriesColor: false,
        enabledOnSeries: [0],
        followCursor: false
      }
    };
  }

  private loadDashboard() {
    this.dashboardService.getDashboard().subscribe({
      next: (res) => {
        this.debt = res?.latestDebt ?? 0;
        this.month = res?.statementMonth ?? null;
        this.role = res?.role ?? null;
      },
      error: (err) => console.error('Dashboard error:', err)
    });
  }

  private loadHistory() {
    this.dashboardService.getHistory().subscribe({
      next: (history) => {
        this.hasHistory = !!history?.length;
        if (!this.hasHistory) return;

        // Αν το backend δεν στέλνει startDate, μην κάνεις sort με startDate
        // Κάνε sort με month (YYYY-MM) που είναι safe:
        history.sort((a: any, b: any) => (a.month || '').localeCompare(b.month || ''));

        const labels = history.map((h: any) => this.monthToGreek(h.month));
        const amounts = history.map((h: any) => h.billed ?? 0);

        const lastIndex = history.length - 1;
        const latest = amounts[lastIndex];
        const previous = lastIndex > 0 ? amounts[lastIndex - 1] : latest;

        this.lastAmount = latest;
        this.previousAmount = previous;

        this.differencePercent = previous > 0 ? ((latest - previous) / previous) * 100 : 0;

        // Badge
        if (this.differencePercent >= 0) {
          this.badgeClass = 'bg-light-primary border border-primary';
          this.badgeIcon = 'rise';
        } else {
          this.badgeClass = 'bg-light-warning border border-warning';
          this.badgeIcon = 'fall';
        }

        // Chart δείχνει παλιά -> νέα (αριστερά -> δεξιά)
        this.chartOptions = {
          chart: { type: 'bar', height: 100, sparkline: { enabled: true } },
          colors: ['#1677ff'],
          plotOptions: { bar: { columnWidth: '80%' } },
          dataLabels: { enabled: false },
          legend: { show: false },
          series: [{ data: amounts }],
          labels,
          tooltip: {
            theme: 'light',
            x: { show: false },
            marker: { show: false },
            fillSeriesColor: false,
            custom: ({ series, seriesIndex, dataPointIndex }) => {
              const label = labels[dataPointIndex] || '';
              const value = series[seriesIndex][dataPointIndex];
              return `
              <div class="p-2">
                <strong>${label}</strong><br>
                ${value}€
              </div>
            `;
            }
          }
        };
      },
      error: () => {
        this.loadError = true;
        this.hasHistory = false;
      }
    });
    console.log(history);
  }

  private monthToGreek(date: string | null): string {
    if (!date) return '';

    const [year, month] = date.split('-');
    const months = [
      this.uiLocale.text('January'),
      this.uiLocale.text('February'),
      this.uiLocale.text('March'),
      this.uiLocale.text('April'),
      this.uiLocale.text('May'),
      this.uiLocale.text('June'),
      this.uiLocale.text('July'),
      this.uiLocale.text('August'),
      this.uiLocale.text('September'),
      this.uiLocale.text('October'),
      this.uiLocale.text('November'),
      this.uiLocale.text('December')
    ];

    return `${months[parseInt(month) - 1]} ${year}`;
  }
}
