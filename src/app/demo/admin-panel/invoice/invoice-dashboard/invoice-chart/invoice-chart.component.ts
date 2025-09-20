// angular import
import { Component, OnInit, effect, inject } from '@angular/core';

// project import
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { ThemeService } from 'src/app/theme/shared/service/customs-theme.service';

// icons
import { IconService } from '@ant-design/icons-angular';
import { CaretUpOutline, CaretDownOutline } from '@ant-design/icons-angular/icons';

// apexChart
import { NgApexchartsModule, ApexOptions } from 'ng-apexcharts';

@Component({
  selector: 'app-invoice-chart',
  imports: [SharedModule, NgApexchartsModule],
  templateUrl: './invoice-chart.component.html',
  styleUrl: './invoice-chart.component.scss'
})
export class InvoiceChartComponent implements OnInit {
  private iconService = inject(IconService);
  private themeService = inject(ThemeService);

  // public props
  chartOptions!: Partial<ApexOptions>;
  activeIndex!: number;
  cardBackground!: string;

  // constructor
  constructor() {
    this.iconService.addIcon(...[CaretUpOutline, CaretDownOutline]);
    effect(() => {
      this.isDarkTheme(this.themeService.isDarkMode());
    });
  }

  // life cycle hook
  ngOnInit(): void {
    this.activeIndex = 0;
    this.chartOptions = {
      chart: {
        height: 300,
        type: 'line',
        stacked: false,
        toolbar: {
          show: false
        }
      },
      plotOptions: {
        bar: {
          columnWidth: '50%'
        }
      },
      legend: {
        show: false
      },
      stroke: {
        width: [0, 4],
        curve: 'smooth'
      },
      dataLabels: {
        enabled: false
      },
      series: [
        {
          name: 'TEAM A',
          type: 'column',
          data: [23, 11, 22, 27, 13, 22, 37, 21, 44, 22, 30, 25]
        },
        {
          name: 'TEAM B',
          type: 'line',
          data: [30, 25, 36, 30, 45, 35, 64, 52, 59, 36, 39, 35]
        }
      ],
      fill: {
        type: 'gradient',
        gradient: {
          inverseColors: false,
          shade: 'light',
          type: 'vertical',
          opacityFrom: [0, 1],
          opacityTo: [0.35, 1],
          stops: [0, 100]
        }
      },
      markers: {
        size: 3,
        colors: ['#fff'],
        strokeColors: '#faad14',
        strokeWidth: 2,
        shape: 'circle',
        hover: {
          size: 5
        }
      },
      colors: ['#faad14', '#faad14'],
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
      yaxis: {
        labels: {
          style: {
            colors: ['#bfbfbf']
          }
        }
      },
      grid: {
        show: true,
        borderColor: '#f0f0f0'
      },
      xaxis: {
        categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        labels: {
          style: {
            colors: [
              '#bfbfbf',
              '#bfbfbf',
              '#bfbfbf',
              '#bfbfbf',
              '#bfbfbf',
              '#bfbfbf',
              '#bfbfbf',
              '#bfbfbf',
              '#bfbfbf',
              '#bfbfbf',
              '#bfbfbf',
              '#bfbfbf'
            ]
          }
        },
        axisBorder: {
          show: false,
          color: '#f0f0f0'
        },
        tickAmount: 11
      },
      tooltip: {
        theme: 'light',
        marker: {
          show: false
        }
      }
    };
  }

  // private methods
  private isDarkTheme(isDark: boolean) {
    const tooltip = { ...this.chartOptions.tooltip };
    const grid = { ...this.chartOptions.grid };
    const xaxis = { ...this.chartOptions.xaxis };
    tooltip.theme = isDark === true ? 'dark' : 'light';
    grid.borderColor = isDark === true ? '#fafafa0d' : '#f0f0f0';
    xaxis.axisBorder!.color = isDark === true ? '#fafafa0d' : '#f0f0f0';
    this.chartOptions = { ...this.chartOptions, tooltip, grid, xaxis };
    this.cardBackground = isDark === true ? 'bg-gray-900' : 'bg-gray-200';
  }

  // public method
  changeChart(index: number) {
    this.activeIndex = index;
    switch (index) {
      case 1:
        this.chartOptions.series = [
          {
            name: 'TEAM A',
            type: 'column',
            data: [10, 15, 8, 12, 11, 7, 10, 13, 22, 10, 18, 4]
          },
          {
            name: 'TEAM B',
            type: 'line',
            data: [12, 18, 15, 17, 12, 10, 14, 16, 25, 17, 20, 8]
          }
        ];
        break;
      case 2:
        this.chartOptions.series = [
          {
            name: 'TEAM A',
            type: 'column',
            data: [12, 11, 22, 27, 13, 22, 37, 21, 44, 22, 30, 25]
          },
          {
            name: 'TEAM B',
            type: 'line',
            data: [17, 25, 36, 30, 45, 35, 64, 52, 59, 36, 39, 35]
          }
        ];
        break;
      case 3:
        this.chartOptions.series = [
          {
            name: 'TEAM A',
            type: 'column',
            data: [1, 2, 3, 5, 1, 0, 2, 0, 6, 1, 5, 3]
          },
          {
            name: 'TEAM B',
            type: 'line',
            data: [5, 3, 5, 6, 7, 0, 3, 1, 7, 3, 5, 4]
          }
        ];
        break;
      case 0:
      default:
        this.chartOptions.series = [
          {
            name: 'TEAM A',
            type: 'column',
            data: [23, 11, 22, 27, 13, 22, 37, 21, 44, 22, 30, 25]
          },
          {
            name: 'TEAM B',
            type: 'line',
            data: [34, 25, 36, 30, 45, 35, 64, 52, 59, 36, 39, 35]
          }
        ];
    }
  }

  widgetData = [
    {
      title: 'Συνολικά',
      count: '£5678.09',
      percentage: 20.3,
      isLoss: true,
      invoice: '3',
      color: 'text-warning'
    },
    {
      title: 'Πληρώθηκαν',
      count: '£5678.09',
      percentage: -8.73,
      isLoss: true,
      invoice: '5',
      color: 'text-danger'
    },
    {
      title: 'Εκκρεμούν',
      count: '£5678.09',
      percentage: 1.73,
      isLoss: false,
      invoice: '20',
      color: 'text-success'
    },
    {
      title: 'Ληξιπρόθεσμα',
      count: '£5678.09',
      percentage: -4.7,
      isLoss: true,
      invoice: '5',
      color: 'text-primary'
    }
  ];
}
