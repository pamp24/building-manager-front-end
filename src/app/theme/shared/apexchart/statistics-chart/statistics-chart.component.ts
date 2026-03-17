// angular import
import { Component, OnInit, effect, input, inject } from '@angular/core';

// project import
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { ThemeService } from 'src/app/theme/shared/service/customs-theme.service';

// apexChart
import { NgApexchartsModule, ApexOptions } from 'ng-apexcharts';

@Component({
  selector: 'app-statistics-chart',
  imports: [SharedModule, NgApexchartsModule],
  templateUrl: './statistics-chart.component.html',
  styleUrl: './statistics-chart.component.scss'
})
export class StatisticsChartComponent implements OnInit {
  private themeService = inject(ThemeService);

  chartOptions!: ApexOptions;
  selectType: string = 'month';

  readonly height = input.required<number>();
  readonly labels = input<string[]>([]);
  readonly issuedData = input<number[]>([]);
  readonly paidData = input<number[]>([]);
  readonly overdueData = input<number[]>([]);

  constructor() {
    effect(() => {
      const currentLabels = this.labels();
      const currentIssued = this.issuedData();
      const currentPaid = this.paidData();
      const currentOverdue = this.overdueData();

      if (this.chartOptions) {
        this.chartOptions = {
          ...this.chartOptions,
          series: [
            {
              name: 'Εκδοθέντα',
              data: currentIssued
            },
            {
              name: 'Πληρωμένα',
              data: currentPaid
            },
            {
              name: 'Ληξιπρόθεσμα',
              data: currentOverdue
            }
          ],
          xaxis: {
            ...this.chartOptions.xaxis,
            categories: currentLabels
          }
        };
      }
    });

    effect(() => {
      if (this.chartOptions) {
        this.updateThemeColor(this.themeService.customsTheme());
        this.isDarkTheme(this.themeService.isDarkMode());
        this.rerenderChartOnContainerResize(this.themeService.isContainerMode());
      }
    });
  }

  ngOnInit() {
    this.chartOptions = {
      chart: {
        type: 'area',
        height: this.height(),
        toolbar: {
          show: false
        }
      },
      colors: ['#1677ff', '#52c41a', '#ff4d4f'],
      dataLabels: {
        enabled: false
      },
      legend: {
        show: true,
        position: 'top'
      },
      markers: {
        size: 1,
        colors: ['#fff', '#fff', '#fff'],
        strokeColors: ['#1677ff', '#52c41a', '#ff4d4f'],
        strokeWidth: 1,
        shape: 'circle',
        hover: {
          size: 4
        }
      },
      stroke: {
        width: 2,
        curve: 'smooth'
      },
      fill: {
        type: 'gradient',
        gradient: {
          shadeIntensity: 1,
          type: 'vertical',
          inverseColors: false,
          opacityFrom: 0.5,
          opacityTo: 0
        }
      },
      grid: {
        strokeDashArray: 4,
        borderColor: '#f5f5f5'
      },
      series: [
        {
          name: 'Εκδοθέντα',
          data: this.issuedData()
        },
        {
          name: 'Πληρωμένα',
          data: this.paidData()
        },
        {
          name: 'Ληξιπρόθεσμα',
          data: this.overdueData()
        }
      ],
      xaxis: {
        categories: this.labels(),
        tooltip: {
          enabled: false
        },
        labels: {
          hideOverlappingLabels: true
        },
        axisBorder: {
          show: false
        },
        axisTicks: {
          show: false
        }
      }
    };
  }

  private updateThemeColor(theme: string) {
    switch (theme) {
      case 'preset-1':
      default:
        this.chartOptions.colors = ['#1677ff', '#52c41a', '#ff4d4f'];
        break;
      case 'preset-2':
        this.chartOptions.colors = ['#3366FF', '#52c41a', '#ff4d4f'];
        break;
      case 'preset-3':
        this.chartOptions.colors = ['#7265E6', '#52c41a', '#ff4d4f'];
        break;
      case 'preset-4':
        this.chartOptions.colors = ['#068e44', '#52c41a', '#ff4d4f'];
        break;
      case 'preset-5':
        this.chartOptions.colors = ['#3c64d0', '#52c41a', '#ff4d4f'];
        break;
      case 'preset-6':
        this.chartOptions.colors = ['#f27013', '#52c41a', '#ff4d4f'];
        break;
      case 'preset-7':
        this.chartOptions.colors = ['#2aa1af', '#52c41a', '#ff4d4f'];
        break;
      case 'preset-8':
        this.chartOptions.colors = ['#00a854', '#52c41a', '#ff4d4f'];
        break;
      case 'preset-9':
        this.chartOptions.colors = ['#009688', '#52c41a', '#ff4d4f'];
        break;
    }
  }

  private isDarkTheme(isDark: boolean) {
    const tooltipTheme = isDark ? 'dark' : 'light';
    const tooltip = { theme: tooltipTheme };
    const grid = { ...this.chartOptions.grid };
    grid.borderColor = isDark ? '#fafafa0d' : '#f5f5f5';
    this.chartOptions = { ...this.chartOptions, tooltip, grid };
  }

  private rerenderChartOnContainerResize(isContainer: boolean) {
    const chart = { ...this.chartOptions.chart };
    chart.redrawOnParentResize = !isContainer;
    this.chartOptions = { ...this.chartOptions, chart } as ApexOptions;
  }
}