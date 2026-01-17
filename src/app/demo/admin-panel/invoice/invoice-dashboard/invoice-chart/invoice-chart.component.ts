import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { NgApexchartsModule, ApexOptions } from 'ng-apexcharts';
import { MonthlyAmountStatsDTO } from 'src/app/theme/shared/models/monthlyAmountStatsDTO';

@Component({
  selector: 'app-invoice-chart',
  standalone: true,
  imports: [SharedModule, NgApexchartsModule],
  templateUrl: './invoice-chart.component.html',
  styleUrls: ['./invoice-chart.component.scss']
})
export class InvoiceChartComponent implements OnChanges {
  @Input() monthlyAmountStats: MonthlyAmountStatsDTO[] = [];

  chartOptions!: Partial<ApexOptions>;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['monthlyAmountStats']) {
      this.loadChart();
    }
  }

  private loadChart() {
    if (!this.monthlyAmountStats || this.monthlyAmountStats.length === 0) {
      this.chartOptions = undefined!;
      return;
    }

    const months = this.monthlyAmountStats.map((s) => s.month);

    const paid = this.monthlyAmountStats.map((s) => Number(s.paidAmount ?? 0));
    const expired = this.monthlyAmountStats.map((s) => Number(s.expiredAmount ?? 0));
    const pending = this.monthlyAmountStats.map((s) => Number(s.pendingAmount ?? 0));

    this.chartOptions = {
      chart: {
        height: 450,
        type: 'bar',
        stacked: false,
        toolbar: { show: false }
      },
      plotOptions: {
        bar: { columnWidth: '55%' }
      },
      dataLabels: { enabled: false },
      series: [
        { name: 'Πληρωμένα', data: paid },
        { name: 'Εκκρεμή', data: pending },
        { name: 'Ληξιπρόθεσμα', data: expired }
      ],
      colors: ['#52c41a', '#fcb023', '#ff4d4f'],
      xaxis: { categories: months },
      yaxis: {
        title: { text: 'Ποσό (€)' },
        labels: {
          formatter: (val: number) => `${val.toFixed(0)}€`
        }
      },
      tooltip: {
        theme: 'light',
        y: {
          formatter: (val: number) => val.toLocaleString('el-GR', { style: 'currency', currency: 'EUR' })
        }
      }
    };
    console.log('monthlyAmountStats:', this.monthlyAmountStats);
    console.log(
      'months:',
      this.monthlyAmountStats.map((x) => x.month)
    );
  }
}
