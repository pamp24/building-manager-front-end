import { Component, inject, OnInit } from '@angular/core';
import { ThemeService } from '../../service/customs-theme.service';
import { UserDashboardService } from '../../service/userDashboard.service';
import { NgApexchartsModule, ApexOptions } from 'ng-apexcharts';
import { SharedModule } from '../../shared.module';
import { IconService } from '@ant-design/icons-angular';
import { FallOutline, RiseOutline } from '@ant-design/icons-angular/icons';

@Component({
  selector: 'app-building-total-card',
  imports: [NgApexchartsModule, SharedModule],
  templateUrl: './building-total-card.component.html',
  styleUrl: './building-total-card.component.scss'
})
export class BuildingTotalCardComponent implements OnInit {
  private themeService = inject(ThemeService);
  private userDashboardService = inject(UserDashboardService);
  private iconService = inject(IconService);

  chartOptions!: ApexOptions;
  lastAmount = 0;
  percentage = 0;
  isNegative = false;
  month: string | null = null;

  constructor() {
    this.iconService.addIcon(...[FallOutline, RiseOutline]);
  }

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.userDashboardService.getMiniStatementChart().subscribe((data) => {
      this.lastAmount = data.lastAmount;
      this.percentage = data.percentage;
      this.isNegative = data.percentage < 0;
      this.month = data.month;

      this.chartOptions = {
        chart: {
          type: 'bar',
          height: 100,
          sparkline: { enabled: true }
        },
        colors: ['#faad14'],
        plotOptions: {
          bar: { columnWidth: '80%' }
        },
        series: [
          {
            data: data.last12.reverse() // το παλιότερο -> νεότερο
          }
        ],
        xaxis: {
          crosshairs: { width: 1 }
        },
        tooltip: {
          theme: this.themeService.isDarkMode() ? 'dark' : 'light',
          x: { show: false },
          marker: { show: true }
        }
      };
    });
  }

  get iconType() {
    return this.isNegative ? 'fall' : 'rise';
  }

  get badgeClass() {
    return this.isNegative
      ? 'bg-light-danger border border-danger text-danger'
      : 'bg-light-success border border-success text-success';
  }
}
