// angular import
import { Component, effect, inject } from '@angular/core';

// project import
import { SharedModule } from '../../shared.module';
import { ThemeService } from '../../service/customs-theme.service';

//icons
import { IconService } from '@ant-design/icons-angular';
import { RiseOutline } from '@ant-design/icons-angular/icons';

// third party
import { NgApexchartsModule, ApexOptions } from 'ng-apexcharts';
import { UserDashboardService } from '../../service/userDashboard.service';
import { OnInit } from '@angular/core';

@Component({
  selector: 'app-building-pedning-card',
  imports: [NgApexchartsModule, SharedModule],
  templateUrl: './building-pedning-card.component.html',
  styleUrl: './building-pedning-card.component.scss'
})
export class BuildingPendingCardComponent implements OnInit {
  private themeService = inject(ThemeService);
  private iconService = inject(IconService);
  totalUnpaid = 0;
  unpaidMonths: string[] = [];
  // public props
  chartOptions!: ApexOptions;

  // constructor
  constructor(private userDashboardService: UserDashboardService) {
    this.chartOptions = {
      chart: { type: 'area', height: 100, sparkline: { enabled: true } },
      colors: ['#1677ff'],
      plotOptions: { bar: { columnWidth: '80%' } },
      series: [
        {
          data: [100, 140, 100, 240, 115, 125, 90, 100, 80, 150, 160, 150, 170, 155, 150, 160, 145, 200, 140, 160]
        }
      ],
      xaxis: { crosshairs: { width: 1 } },
      stroke: {
        curve: 'straight',
        width: 1.5
      },
      tooltip: {
        fixed: { enabled: false },
        x: { show: false },
        marker: { show: true }
      }
    };
    this.iconService.addIcon(...[RiseOutline]);
    effect(() => {
      this.updateThemeColor(this.themeService.customsTheme());
      this.isDarkTheme(this.themeService.isDarkMode());
      this.rerenderChartOnContainerResize(this.themeService.isContainerMode());
    });
  }

  ngOnInit() {
    this.userDashboardService.getBuildingPending().subscribe((data) => {
      this.totalUnpaid = data.totalUnpaid;
      this.unpaidMonths = data.unpaidMonths;
    });
  }

  // private methods
  private isDarkTheme(isDark: boolean) {
    const tooltip = { ...this.chartOptions.tooltip };
    tooltip.theme = isDark === true ? 'dark' : 'light';
    this.chartOptions = { ...this.chartOptions, tooltip };
  }

  private rerenderChartOnContainerResize(isContainer: boolean) {
    const chart = { ...this.chartOptions.chart };
    chart.redrawOnParentResize = !isContainer;
    this.chartOptions = { ...this.chartOptions, chart } as ApexOptions;
  }

  private updateThemeColor(theme: string) {
    switch (theme) {
      case 'preset-1':
      default:
        this.chartOptions.colors = ['#1677ff'];
        break;
      case 'preset-2':
        this.chartOptions.colors = ['#3366FF'];
        break;
      case 'preset-3':
        this.chartOptions.colors = ['#7265E6'];
        break;
      case 'preset-4':
        this.chartOptions.colors = ['#068e44'];
        break;
      case 'preset-5':
        this.chartOptions.colors = ['#3c64d0'];
        break;
      case 'preset-6':
        this.chartOptions.colors = ['#f27013'];
        break;
      case 'preset-7':
        this.chartOptions.colors = ['#2aa1af'];
        break;
      case 'preset-8':
        this.chartOptions.colors = ['#00a854'];
        break;
      case 'preset-9':
        this.chartOptions.colors = ['#009688'];
        break;
    }
  }
}
