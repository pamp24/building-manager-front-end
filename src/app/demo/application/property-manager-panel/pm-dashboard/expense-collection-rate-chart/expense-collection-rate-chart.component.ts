// angular import
import { Component, OnInit, effect, inject } from '@angular/core';

// icons
import { IconService } from '@ant-design/icons-angular';
import { ArrowDownOutline, ArrowUpOutline, MoreOutline } from '@ant-design/icons-angular/icons';

// project import
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { ThemeService } from 'src/app/theme/shared/service/customs-theme.service';

// apexChart
import { NgApexchartsModule, ApexOptions } from 'ng-apexcharts';
import { PmDashboardService } from 'src/app/theme/shared/service/pm-dashboard.service';

@Component({
  selector: 'app-expense-collection-rate-chart',
  imports: [SharedModule, NgApexchartsModule],
  templateUrl: './expense-collection-rate-chart.component.html',
  styleUrl: './expense-collection-rate-chart.component.scss'
})
export class ExpenseCollectionRateChartComponent implements OnInit {
  private iconService = inject(IconService);
  private themeService = inject(ThemeService);
  private pmDashboardService = inject(PmDashboardService);

  chartOptions!: Partial<ApexOptions>;

  collectionRate = 0;
  issuedAmount = 0;
  paidAmount = 0;
  overdueAmount = 0;
  selectedPeriod = 'month';

  constructor() {
    this.iconService.addIcon(...[MoreOutline, ArrowUpOutline, ArrowDownOutline]);

    effect(() => {
      this.updateThemeColor(this.themeService.customsTheme());
    });
  }

  ngOnInit(): void {
    this.initChart();
    this.loadExpenseCollectionRate();
  }

  onPeriodChange(): void {
    this.loadExpenseCollectionRate();
  }

  private initChart(): void {
    this.chartOptions = {
      series: [0],
      chart: {
        type: 'radialBar',
        height: 345,
        offsetY: -20,
        sparkline: {
          enabled: true
        }
      },
      colors: ['#1677ff'],
      plotOptions: {
        radialBar: {
          startAngle: -95,
          endAngle: 95,
          hollow: {
            margin: 15,
            size: '50%'
          },
          track: {
            background: '#eaeaea',
            strokeWidth: '97%',
            margin: 20
          },
          dataLabels: {
            name: {
              show: false
            },
            value: {
              offsetY: 0,
              fontSize: '20px',
              formatter: (val: number) => `${Math.round(val)}%`
            }
          }
        }
      },
      grid: {
        padding: {
          top: 10
        }
      },
      stroke: {
        lineCap: 'round'
      }
    };
  }

  private loadExpenseCollectionRate(): void {
    this.pmDashboardService.getExpenseCollectionRate(this.selectedPeriod).subscribe({
      next: (res) => {
        this.collectionRate = res.collectionRate;
        this.issuedAmount = res.issuedAmount;
        this.paidAmount = res.paidAmount;
        this.overdueAmount = res.overdueAmount;

        this.chartOptions = {
          ...this.chartOptions,
          series: [this.collectionRate]
        };

        this.updateChartColorByRate(this.collectionRate);
      },
      error: (err) => {
        console.error('Failed to load expense collection rate', err);
      }
    });
  }

  private updateThemeColor(theme: string) {
    if (!this.chartOptions) return;

    switch (theme) {
      case 'preset-2':
        this.chartOptions = { ...this.chartOptions, colors: ['#3366FF'] };
        break;
      case 'preset-3':
        this.chartOptions = { ...this.chartOptions, colors: ['#7265E6'] };
        break;
      case 'preset-4':
        this.chartOptions = { ...this.chartOptions, colors: ['#068e44'] };
        break;
      case 'preset-5':
        this.chartOptions = { ...this.chartOptions, colors: ['#3c64d0'] };
        break;
      case 'preset-6':
        this.chartOptions = { ...this.chartOptions, colors: ['#f27013'] };
        break;
      case 'preset-7':
        this.chartOptions = { ...this.chartOptions, colors: ['#2aa1af'] };
        break;
      case 'preset-8':
        this.chartOptions = { ...this.chartOptions, colors: ['#00a854'] };
        break;
      case 'preset-9':
        this.chartOptions = { ...this.chartOptions, colors: ['#009688'] };
        break;
      case 'preset-1':
      default:
        this.chartOptions = { ...this.chartOptions, colors: ['#1677ff'] };
        break;
    }
  }

  formatCurrency(value: number): string {
    return new Intl.NumberFormat('el-GR', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value);
  }

  private getCollectionRateColor(rate: number): string {
    if (rate < 50) {
      return '#dc3545'; // κόκκινο
    }

    if (rate < 70) {
      return '#fd7e14'; // πορτοκαλί
    }

    return '#198754'; // πράσινο
  }
  private updateChartColorByRate(rate: number): void {
    const color = this.getCollectionRateColor(rate);

    this.chartOptions = {
      ...this.chartOptions,
      colors: [color]
    };
  }
}
