import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { NgApexchartsModule, ApexOptions } from 'ng-apexcharts';
import { MonthlyStatsDTO } from '../../../../../theme/shared/models/monthlyStatsDTO';

@Component({
  selector: 'app-invoice-chart',
  standalone: true,
  imports: [SharedModule, NgApexchartsModule],
  templateUrl: './invoice-chart.component.html',
  styleUrls: ['./invoice-chart.component.scss']
})
export class InvoiceChartComponent implements OnChanges {
  @Input() monthlyStats: MonthlyStatsDTO[] = [];

  chartOptions!: Partial<ApexOptions>;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['monthlyStats'] && this.monthlyStats) {
      this.loadChart();
    }
  }

  private loadChart() {
    if (!this.monthlyStats || this.monthlyStats.length === 0) {
      this.chartOptions = undefined!;
      return;
    }

    console.log('Loading chart with data:', this.monthlyStats);

    const months = this.monthlyStats.map((s) => s.month);
    const paid = this.monthlyStats.map((s) => s.paid || 0);
    const expired = this.monthlyStats.map((s) => s.expired || 0);
    const pending = this.monthlyStats.map((s) => s.pending || Math.max((s.issued || 0) - ((s.paid || 0) + (s.expired || 0)), 0));

    this.chartOptions = {
      chart: {
        height: 450,
        type: 'bar',
        stacked: false, // μπάρες δίπλα-δίπλα
        toolbar: { show: false }
      },
      plotOptions: {
        bar: {
          columnWidth: '55%',
        }
      },
      dataLabels: { enabled: false },
      series: [
        {
          name: 'Πληρωμένα',
          data: paid
        },
        {
          name: 'Εκκρεμή',
          data: pending
        },
        {
          name: 'Ληξιπρόθεσμα',
          data: expired
        }
      ],
      colors: ['#52c41a', '#fcb023', '#ff4d4f'],
      xaxis: {
        categories: months,
        labels: {
          style: { colors: '#8c8c8c' }
        }
      },
      yaxis: {
        title: { text: 'Πλήθος Παραστατικών' },
        labels: {
          style: { colors: '#8c8c8c' }
        }
      },
      grid: { borderColor: '#f0f0f0' },
      legend: {
        show: true,
        position: 'top',
        horizontalAlign: 'center',
        fontSize: '13px'
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
