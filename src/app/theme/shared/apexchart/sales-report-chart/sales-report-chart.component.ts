// angular import
import { Component, effect, inject, OnInit } from '@angular/core';

// project import
import { SharedModule } from '../../shared.module';
import { ThemeService } from '../../service/customs-theme.service';
import { UserDashboardService } from '../../service/userDashboard.service';

// third party
import { NgApexchartsModule, ApexOptions } from 'ng-apexcharts';

@Component({
  selector: 'app-sales-report-chart',
  imports: [SharedModule, NgApexchartsModule],
  templateUrl: './sales-report-chart.component.html',
  styleUrl: './sales-report-chart.component.scss'
})
export class SalesReportChartComponent implements OnInit {
  private themeService = inject(ThemeService);
  private dashboardService = inject(UserDashboardService);

  // public props
  chartOptions!: ApexOptions;
  total = 0;
  apartmentTotal: number | null = null;
  hasData = false;

  // constructor
  constructor() {
    this.chartOptions = {
      chart: {
        type: 'bar',
        height: 430,
        toolbar: {
          show: false
        },
        background: 'transparent'
      },
      plotOptions: {
        bar: {
          columnWidth: '30%',
          borderRadius: 4
        }
      },
      stroke: {
        show: true,
        width: 8,
        colors: ['transparent']
      },
      dataLabels: {
        enabled: false
      },
      legend: {
        position: 'top',
        horizontalAlign: 'right',
        show: true,
        fontFamily: `'Public Sans', sans-serif`,
        offsetX: 10,
        offsetY: 10,
        labels: {
          useSeriesColors: false
        },
        itemMargin: {
          horizontal: 15,
          vertical: 5
        }
      },
      series: [
        {
          name: 'Πολυκατοικία',
          data: []
        }
      ],
      xaxis: {
        categories: [],
        labels: {
          style: {
            colors: ['#8C8C8C']
          }
        }
      },
      yaxis: {
        labels: {
          style: {
            colors: ['#8C8C8C']
          },
          formatter: (val: number) => {
            return val.toLocaleString('el-GR', {
              maximumFractionDigits: 2
            });
          }
        }
      },
      tooltip: {
        theme: 'light',
        y: {
          formatter: (val: number) => {
            return `${val.toLocaleString('el-GR', { maximumFractionDigits: 2 })} €`;
          }
        }
      },
      colors: ['#faad14', '#3c64d0'],
      grid: {
        borderColor: '#f5f5f5'
      }
    };
    effect(() => {
      this.updateThemeColor(this.themeService.customsTheme());
      this.rerenderChartOnContainerResize(this.themeService.isContainerMode());
      this.isDarkTheme(this.themeService.isDarkMode());
    });
  }

  ngOnInit(): void {
    this.loadHeatingData();
  }

  private loadHeatingData() {
    const buildingId = Number(localStorage.getItem('buildingId')) || undefined;
    this.dashboardService.getHeatingChartData(buildingId).subscribe({
      next: (data) => {
        const buildingValues = (data?.buildingValues ?? []) as number[];
        const apartmentValues = (data?.apartmentValues ?? []) as number[];
        const labels = (data?.labels ?? []) as string[];
        this.total = data?.buildingTotal ?? 0;
        this.apartmentTotal = data?.apartmentTotal ?? null;
        this.hasData = buildingValues.some((v) => v > 0) || apartmentValues.some((v) => v > 0);

        const series = [{ name: 'Πολυκατοικία', data: buildingValues }];
        if (apartmentValues.some((v) => v > 0)) {
          series.push({ name: 'Διαμέρισμα', data: apartmentValues });
        }

        this.chartOptions = {
          ...this.chartOptions,
          series,
          xaxis: {
            ...this.chartOptions.xaxis,
            categories: labels.map((l) => this.formatMonthLabel(l))
          }
        };
      },
      error: (err) => console.error('Σφάλμα φόρτωσης εξόδων θέρμανσης', err)
    });
  }

  private formatMonthLabel(iso: string): string {
    const [y, m] = iso.split('-').map(Number);
    if (!y || !m) return iso;
    const names = ['Ιαν', 'Φεβ', 'Μαρ', 'Απρ', 'Μαι', 'Ιουν', 'Ιουλ', 'Αυγ', 'Σεπ', 'Οκτ', 'Νοε', 'Δεκ'];
    return `${names[m - 1]} ${y}`;
  }

  // private method
  private updateThemeColor(theme: string) {
    switch (theme) {
      case 'preset-1':
      default:
        this.chartOptions.colors = ['#faad14', '#3c64d0'];
        break;
      case 'preset-2':
        this.chartOptions.colors = ['#faad14', '#3c64d0'];
        break;
      case 'preset-3':
        this.chartOptions.colors = ['#faad14', '#3c64d0'];
        break;
      case 'preset-4':
        this.chartOptions.colors = ['#068e44', '#f27013'];
        break;
      case 'preset-5':
        this.chartOptions.colors = ['#3c64d0', '#faad14'];
        break;
      case 'preset-6':
        this.chartOptions.colors = ['#f27013', '#068e44'];
        break;
      case 'preset-7':
        this.chartOptions.colors = ['#2aa1af', '#faad14'];
        break;
      case 'preset-8':
        this.chartOptions.colors = ['#00a854', '#3c64d0'];
        break;
      case 'preset-9':
        this.chartOptions.colors = ['#009688', '#f27013'];
        break;
    }
  }

  private isDarkTheme(isDark: boolean) {
    const tooltip = { ...this.chartOptions.tooltip };
    const grid = { ...this.chartOptions.grid };
    tooltip.theme = isDark === true ? 'dark' : 'light';
    grid.borderColor = isDark === true ? '#fafafa0d' : '#f5f5f5';
    this.chartOptions = { ...this.chartOptions, tooltip, grid };
  }

  private rerenderChartOnContainerResize(isContainer: boolean) {
    const chart = { ...this.chartOptions.chart };
    chart.redrawOnParentResize = !isContainer;
    this.chartOptions = { ...this.chartOptions, chart } as ApexOptions;
  }
}
