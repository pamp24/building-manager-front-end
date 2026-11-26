import { UiLocaleService } from 'src/app/theme/shared/service/ui-locale.service';
import { inject, Component, OnChanges, OnInit, Input, SimpleChanges } from '@angular/core';

import { SharedModule } from 'src/app/theme/shared/shared.module';
import { NgApexchartsModule, ApexOptions } from 'ng-apexcharts';
import { CommonExpenseStatementService } from 'src/app/theme/shared/service/commonExpensesStatement.service';

@Component({
  selector: 'app-total-expenses-chart',
  standalone: true,
  imports: [SharedModule, NgApexchartsModule],
  templateUrl: './total-expenses-chart.component.html',
  styleUrl: './total-expenses-chart.component.scss'
})
export class TotalExpensesChartComponent implements OnInit, OnChanges {
  private readonly uiLocale = inject(UiLocaleService);

  @Input() buildingId!: number;
  currentPeriod: 'month' | 'year' | 'all' = 'month';
  currentTitle = '';
  chartOptions!: Partial<ApexOptions>;
  expenses: { title: string; value: string; color: string }[] = [];

  private categoryColors: Record<string, string> = {
    COMMON: '#faad14',
    HEATING: '#ff4d4f',
    ELEVATOR: '#1677ff',
    EQUAL: '#52c41a',
    BOILER: '#13c2c2',
    SPECIAL: '#722ed1',
    OWNERS: '#a0d911',
    OTHER: '#595959'
  };

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
    const monthLabel = new Date().toLocaleString(this.uiLocale.locale, { month: 'long', year: 'numeric' });
    switch (this.currentPeriod) {
      case 'year':
        this.currentTitle = this.uiLocale.text('Current Year Expense Categories ({{p0}})', { p0: new Date().getFullYear() });
        break;
      case 'all':
        this.currentTitle = this.uiLocale.text('Categories of Expenses Total');
        break;
      case 'month':
      default:
        this.currentTitle = this.uiLocale.text("Current Month's Expense Categories ({{p0}})", { p0: monthLabel });
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
            noData: { text: this.uiLocale.text('No data available') }
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
            noData: { text: this.uiLocale.text('There are no valid amounts') }
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
          colors: filtered.map((d) => this.categoryColors[d.category] || '#bfbfbf'),

          tooltip: {
            y: {
              formatter: (value: number) =>
                value.toLocaleString(this.uiLocale.locale, {
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
                    label: this.uiLocale.text('Total (€)'),
                    formatter: () =>
                      totalAmount.toLocaleString(this.uiLocale.locale, {
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
        this.expenses = filtered.map((d) => ({
          title: this.translateCategory(d.category),
          value: d.totalAmount.toLocaleString(this.uiLocale.locale, {
            style: 'currency',
            currency: 'EUR'
          }),
          color: this.mapColorClass(d.category)
        }));
      },
      error: (err) => {
        console.error('Σφάλμα φόρτωσης κατηγοριών εξόδων', err);
        this.chartOptions = {
          chart: { height: 280, type: 'donut' },
          series: [],
          labels: [],
          noData: { text: this.uiLocale.text('Error loading data') }
        };
      }
    });
  }

  mapColorClass(category: string): string {
    switch (category) {
      case 'COMMON':
        return 'text-warning';
      case 'HEATING':
        return 'text-danger';
      case 'ELEVATOR':
        return 'text-primary';
      case 'EQUAL':
        return 'text-success';
      case 'BOILER':
        return 'text-info';
      case 'SPECIAL':
        return 'text-purple';
      case 'OWNERS':
        return 'text-lime';
      case 'OTHER':
        return 'text-muted';
      default:
        return 'text-secondary';
    }
  }

  translateCategory(category: string): string {
    switch (category) {
      case 'COMMON':
        return this.uiLocale.text('Shared expenses');
      case 'HEATING':
        return this.uiLocale.text('Heating');
      case 'ELEVATOR':
        return this.uiLocale.text('Elevator');
      case 'EQUAL':
        return this.uiLocale.text('Equal Expenses');
      case 'BOILER':
        return this.uiLocale.text('Boiler');
      case 'SPECIAL':
        return this.uiLocale.text('Special Expenses');
      case 'OWNERS':
        return this.uiLocale.text('Owners');
      case 'OTHER':
        return this.uiLocale.text('Others');
      default:
        return category;
    }
  }
}
