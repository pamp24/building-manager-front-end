// angular import
import { Component, OnInit, effect, input, inject } from '@angular/core';

// project import
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { ThemeService } from 'src/app/theme/shared/service/customs-theme.service';

// apexChart
import { NgApexchartsModule, ApexOptions } from 'ng-apexcharts';

@Component({
  selector: 'app-statement-list-chart',
  imports: [SharedModule, NgApexchartsModule],
  templateUrl: './statement-list-chart.component.html',
  styleUrl: './statement-list-chart.component.scss'
})
export class StatementListChartComponent implements OnInit {
  private themeService = inject(ThemeService);

  // public props
  chartOptions!: Partial<ApexOptions>;
  readonly seriesData = input.required<number[]>();
  readonly colors = input.required<string[]>();
  readonly labels = input<string[]>([]);

  // constructor
  constructor() {
    effect(() => {
      this.isDarkTheme(this.themeService.isDarkMode());
    });
  }

  // life cycle hook
  ngOnInit(): void {
    this.chartOptions = {
      chart: {
        type: 'area',
        height: 55,
        sparkline: {
          enabled: true
        }
      },
      series: [
        {
          data: this.seriesData()
        }
      ],
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
      stroke: {
        curve: 'smooth',
        width: 2
      },
      grid: {
        show: false
      },
      tooltip: {
        fixed: {
          enabled: false
        },
        x: {
          show: true
        },
        marker: {
          show: false
        },
        custom: ({ dataPointIndex }) => {
          const label = this.labels()?.[dataPointIndex];
          const value = this.seriesData()?.[dataPointIndex];          return `<div style="padding: 6px 10px; font-size: 12px; line-height: 1.4;">
            <div style="font-weight: 600;">${label ?? 'Παραστατικό'}</div>
            <div>${typeof value === 'number' ? value.toLocaleString('el-GR') + ' €' : value ?? ''}</div>
          </div>`;
        }
      },
      colors: this.colors()
    };
  }

  // private methods
  private isDarkTheme(isDark: boolean) {
    const tooltip = { ...this.chartOptions.tooltip };
    tooltip.theme = isDark === true ? 'dark' : 'light';
    this.chartOptions = { ...this.chartOptions, tooltip };
  }
}
