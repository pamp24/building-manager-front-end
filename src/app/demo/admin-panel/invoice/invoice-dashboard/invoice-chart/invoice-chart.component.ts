// angular import
import { Component, Input} from '@angular/core';

// project import
import { SharedModule } from 'src/app/theme/shared/shared.module';
// apexChart
import { NgApexchartsModule, ApexOptions } from 'ng-apexcharts';
import { OnChanges } from '@angular/core';
import { MonthlyStatsDTO } from '../../../../../theme/shared/models/monthlyStatsDTO';
import {SimpleChanges} from '@angular/core';

@Component({
  selector: 'app-invoice-chart',
  imports: [SharedModule, NgApexchartsModule],
  templateUrl: './invoice-chart.component.html',
  styleUrl: './invoice-chart.component.scss'
})
export class InvoiceChartComponent implements OnChanges {
  @Input() monthlyStats: MonthlyStatsDTO[] = [];

  chartOptions!: Partial<ApexOptions>;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['monthlyStats'] && this.monthlyStats?.length) {
      this.loadChart();
    }
  }

  private loadChart() {
    const months = this.monthlyStats.map((s) => s.month);
    const issued = this.monthlyStats.map((s) => s.issued);
    const paid = this.monthlyStats.map((s) => s.paid);
    const closed = this.monthlyStats.map((s) => s.issued - s.paid);

    this.chartOptions = {
      chart: {
        height: 450,
        type: 'bar',
        stacked: false,
        toolbar: { show: false }
      },
      plotOptions: {
        bar: { columnWidth: '45%' }
      },
      dataLabels: { enabled: false },
      stroke: {
        width: [0, 3],
        curve: 'smooth'
      },
      series: [
        {
          name: 'Εκδοθέντα',
          type: 'column',
          data: issued
        },
        {
          name: 'Πληρωμένα',
          type: 'column',
          data: paid
        },
        {
          name: 'Εκκρεμείς',
          type: 'column',
          data: closed
        }

      ],
      colors: ['#3474ffff', '#52c41a', '#fcb023ff'],
      labels: months,
      xaxis: {
        categories: months,
        labels: {
          style: { colors: '#8c8c8c' }
        }
      },
      yaxis: {
        labels: {
          style: { colors: '#8c8c8c' }
        }
      },
      grid: {
        borderColor: '#f0f0f0'
      },
      legend: {
        show: true,
        position: 'top'
      },
      tooltip: {
        theme: 'light',
        y: {
          formatter: (val) => `${val} παραστατικά`
        }
      }
    };
  }
}
