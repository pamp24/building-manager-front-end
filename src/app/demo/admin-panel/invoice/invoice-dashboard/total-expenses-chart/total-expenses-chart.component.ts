import { Component, OnChanges, OnInit } from '@angular/core';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { NgApexchartsModule, ApexOptions } from 'ng-apexcharts';
import { CommonExpenseStatementService } from 'src/app/theme/shared/service/commonExpensesStatement.service';
import { Input } from '@angular/core';
import { SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-total-expenses-chart',
  standalone: true,
  imports: [SharedModule, NgApexchartsModule],
  templateUrl: './total-expenses-chart.component.html',
  styleUrl: './total-expenses-chart.component.scss'
})
export class TotalExpensesChartComponent implements OnInit, OnChanges {
  @Input() buildingId!: number;
  currentPeriod: 'month' | 'year' | 'all' = 'month';
  currentTitle = '';
  chartOptions!: Partial<ApexOptions>;
  expenses: { title: string; value: string; color: string }[] = [];

  constructor(private commonExpenseStatementService: CommonExpenseStatementService) {}

  ngOnInit(): void {
    this.setCurrentTitle();
    this.loadChartData('month');
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['buildingId'] && this.buildingId) {
      this.loadChartData(this.currentPeriod);
    }
  }

  onPeriodChange(period: 'month' | 'year' | 'all') {
    this.currentPeriod = period;
    this.setCurrentTitle();
    this.loadChartData(period);
  }

  setCurrentTitle(): void {
    const monthLabel = new Date().toLocaleString('el-GR', { month: 'long', year: 'numeric' });
    switch (this.currentPeriod) {
      case 'year':
        this.currentTitle = `Κατηγορίες Εξόδων Τρέχοντος Έτους (${new Date().getFullYear()})`;
        break;
      case 'all':
        this.currentTitle = 'Κατηγορίες Εξόδων Συνολικά';
        break;
      case 'month':
      default:
        this.currentTitle = `Κατηγορίες Εξόδων Τρέχοντος Μήνα (${monthLabel})`;
        break;
    }
  }

  loadChartData(period: 'month' | 'year' | 'all'): void {
    if (!this.buildingId) return;

    this.commonExpenseStatementService.getExpenseCategories(this.buildingId, period).subscribe({
      next: (data) => {
        if (Array.isArray(data)) {
          data.forEach((d, i) => console.log(`→ ${i}:`, d));
        }

        // Αν δεν υπάρχουν δεδομένα
        if (!data || data.length === 0) {
          this.chartOptions = {
            chart: { height: 280, type: 'donut' },
            series: [],
            labels: [],
            noData: { text: 'Δεν υπάρχουν διαθέσιμα δεδομένα' }
          };
          this.expenses = [];
          return;
        }

        // Φιλτράρουμε μη έγκυρα ποσά (NaN, undefined)
        const filtered = data.filter((d) => d.totalAmount != null && !isNaN(Number(d.totalAmount)));

        // Αν μετά το φίλτρο δεν μένει τίποτα
        if (filtered.length === 0) {
          this.chartOptions = {
            chart: { height: 280, type: 'donut' },
            series: [],
            labels: [],
            noData: { text: 'Δεν υπάρχουν έγκυρα ποσά' }
          };
          return;
        }

        const series = filtered.map((d) => Number(d.totalAmount));
        const labels = filtered.map((d) => this.translateCategory(d.category));
        const totalAmount = series.reduce((sum, val) => sum + val, 0);

        this.chartOptions = {
          chart: {
            height: 280,
            type: 'donut',
            animations: { enabled: true }
          },
          series,
          labels,
          colors: ['#faad14', '#52c41a', '#ff4d4f', '#1677ff', '#13c2c2', '#722ed1'],
          tooltip: {
            y: {
              formatter: (value: number) =>
                value.toLocaleString('el-GR', {
                  style: 'currency',
                  currency: 'EUR'
                })
            }
          },
          plotOptions: {
            pie: {
              donut: {
                size: '70%',
                labels: {
                  show: true,
                  total: {
                    show: true,
                    label: 'Σύνολο (€)',
                    formatter: () =>
                      totalAmount.toLocaleString('el-GR', {
                        style: 'currency',
                        currency: 'EUR',
                        minimumFractionDigits: 2
                      })
                  }
                }
              }
            }
          },
          legend: { show: false }
        };

        // κάτω λίστα
        this.expenses = filtered.map((d, i) => ({
          title: this.translateCategory(d.category),
          value: d.totalAmount.toLocaleString('el-GR', {
            style: 'currency',
            currency: 'EUR'
          }),
          color: ['text-warning', 'text-success', 'text-danger', 'text-primary', 'text-info', 'text-purple'][i % 6]
        }));
      },
      error: (err) => {
        console.error('Σφάλμα φόρτωσης κατηγοριών εξόδων', err);
        this.chartOptions = {
          chart: { height: 280, type: 'donut' },
          series: [],
          labels: [],
          noData: { text: 'Σφάλμα φόρτωσης δεδομένων' }
        };
      }
    });
  }

  translateCategory(category: string): string {
    switch (category) {
      case 'COMMON':
        return 'Κοινόχρηστα';
      case 'HEATING':
        return 'Θέρμανση';
      case 'ELEVATOR':
        return 'Ασανσέρ';
      case 'EQUAL':
        return 'Ισές Δαπάνες';
      case 'BOILER':
        return 'Λέβητας';
      case 'SPECIAL':
        return 'Ειδικές Δαπάνες';
      case 'OWNERS':
        return 'Ιδιοκτήτες';
      case 'OTHER':
        return 'Άλλες';
      default:
        return category;
    }
  }
}
