// angular project
import { Component, OnInit, effect, inject } from '@angular/core';

// project import
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { ThemeService } from 'src/app/theme/shared/service/customs-theme.service';

// third party
import { NgApexchartsModule, ApexOptions } from 'ng-apexcharts';

@Component({
  selector: 'app-earning-courses-line-chart',
  imports: [SharedModule, NgApexchartsModule],
  templateUrl: './earning-courses-line-chart.component.html',
  styleUrl: './earning-courses-line-chart.component.scss'
})
export class EarningCoursesLineChartComponent implements OnInit {
  private themeService = inject(ThemeService);

  // public props
  chartOptions!: Partial<ApexOptions>;
  selectType: string = 'today';

  // constructor
  constructor() {
    effect(() => {
      this.isDarkTheme(this.themeService.isDarkMode());
    });
  }

  // life cycle hook
  ngOnInit() {
    this.chartOptions = {
      chart: {
        type: 'line',
        height: 230,
        toolbar: {
          show: false
        }
      },
      colors: ['#faad14'],
      dataLabels: {
        enabled: false
      },
      markers: {
        size: 1,
        colors: ['#fff', '#fff', '#fff'],
        strokeColors: ['#faad14'],
        strokeWidth: 1,
        shape: 'circle',
        hover: {
          size: 4
        }
      },
      stroke: {
        width: 3
      },
      grid: {
        strokeDashArray: 4
      },
      series: [
        {
          name: 'Today',
          data: [200, 320, 275, 400, 300, 440]
        }
      ],
      xaxis: {
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

  // private methods
  private isDarkTheme(isDark: boolean) {
    const tooltipTheme = isDark === true ? 'dark' : 'light';
    const tooltip = { theme: tooltipTheme };
    const grid = { ...this.chartOptions.grid };
    grid.borderColor = isDark === true ? '#fafafa0d' : '#f5f5f5';
    this.chartOptions = { ...this.chartOptions, tooltip, grid };
  }

  // public methods
  onOptionSelected() {
    switch (this.selectType) {
      case 'today':
        this.chartOptions.series = [
          {
            name: 'Today',
            data: [200, 320, 275, 400, 300, 440]
          }
        ];
        break;
      case 'week':
        this.chartOptions.series = [
          {
            name: 'Week',
            data: [750, 550, 650, 450, 500, 350]
          }
        ];
        break;
      case 'month':
        this.chartOptions.series = [
          {
            name: 'Month',
            data: [500, 700, 300, 600, 200, 400]
          }
        ];
        break;
    }
  }
}
