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
  private themeService = inject(ThemeService);
  private dashboardService = inject(UserDashboardService);

  chartOptions!: ApexOptions;

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
        this.debt = res.latestDebt ?? 0;
        this.month = res.statementMonth;
        this.role = res.role;
      },
      error: (err) => console.error('Dashboard error:', err)
    });
  }

  private loadHistory() {
    this.dashboardService.getHistory().subscribe({
      next: (history) => {
        if (!history || history.length === 0) return;

        history.sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime());

        // Μετατροπή labels → "Νοέμβριος 2025"
        const labels = history.map((h) => this.monthToGreek(h.month));
        const amounts = history.map((h) => h.total);

        // === CASE 1 — ΜΟΝΟ ΕΝΑ STATEMENT ===
        if (history.length === 1) {
          const amount = amounts[0];

          this.lastAmount = amount;
          this.previousAmount = amount;
          this.differencePercent = 0;

          this.badgeClass = 'bg-light-primary border border-primary';
          this.badgeIcon = 'rise';

          this.chartOptions = {
            chart: { type: 'bar', height: 100, sparkline: { enabled: true } },
            colors: ['#1677ff'],
            plotOptions: { bar: { columnWidth: '80%' } },
            dataLabels: { enabled: false },
            legend: { show: false },
            series: [{ data: [amount] }],
            labels: labels,
            tooltip: {
              theme: 'light',
              x: { show: false },
              marker: { show: false },
              fillSeriesColor: false,
              custom: ({ series, seriesIndex, dataPointIndex }) => {
                const label = this.chartOptions.labels?.[dataPointIndex] || '';
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

          return;
        }

        // === CASE 2 — Multiple statements ===
        // always compare latest vs previous
        const latest = history[0].total;
        const previous = history[1]?.total ?? latest;

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

        // Αντιστροφή ώστε το γράφημα να δείχνει παλαιότερα αριστερά
        const reversedAmounts = [...amounts].reverse();
        const reversedLabels = [...labels].reverse();

        this.chartOptions = {
          chart: { type: 'bar', height: 100, sparkline: { enabled: true } },
          colors: ['#1677ff'],
          plotOptions: { bar: { columnWidth: '80%' } },
          dataLabels: { enabled: false },
          legend: { show: false },
          series: [{ data: reversedAmounts }],
          labels: reversedLabels,
          tooltip: {
            theme: 'light',
            x: { show: false },
            marker: { show: false },
            fillSeriesColor: false,
            custom: ({ series, seriesIndex, dataPointIndex }) => {
              const label = reversedLabels[dataPointIndex] || '';
              const value = series[seriesIndex][dataPointIndex];
              return `
        <div class="p-2">
          <strong>${label}:</strong><br>
          ${value}€
        </div>
      `;
            }
          }
        };
      },

      error: (err) => console.error('History error:', err)
    });
  }

  private monthToGreek(date: string | null): string {
    if (!date) return '';

    const [year, month] = date.split('-');
    const months = [
      'Ιανουάριος',
      'Φεβρουάριος',
      'Μάρτιος',
      'Απρίλιος',
      'Μάιος',
      'Ιούνιος',
      'Ιούλιος',
      'Αύγουστος',
      'Σεπτέμβριος',
      'Οκτώβριος',
      'Νοέμβριος',
      'Δεκέμβριος'
    ];

    return `${months[parseInt(month) - 1]} ${year}`;
  }
}
