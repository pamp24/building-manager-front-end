import { UiLocaleService } from 'src/app/theme/shared/service/ui-locale.service';
import { Component, Input, OnChanges, OnInit, SimpleChanges, effect, inject } from '@angular/core';
import { SharedModule } from '../../shared.module';
import { ThemeService } from '../../service/customs-theme.service';
import { NgApexchartsModule, ApexOptions } from 'ng-apexcharts';
import { IconService } from '@ant-design/icons-angular';
import { DownloadOutline } from '@ant-design/icons-angular/icons';
import { UserDashboardService } from '../../service/userDashboard.service';

@Component({
  selector: 'app-building-chart',
  imports: [SharedModule, NgApexchartsModule],
  templateUrl: './building-chart.component.html',
  styleUrl: './building-chart.component.scss'
})
export class BuildingChartComponent implements OnInit, OnChanges {
  private readonly uiLocale = inject(UiLocaleService);

  @Input() isVisible = false;
  private themeService = inject(ThemeService);
  private iconService = inject(IconService);
  private userDashboardService = inject(UserDashboardService);

  chartOptions: ApexOptions = {};
  hasData = false;
  loading = false;
  loadError = false;
  isDarkThemes!: boolean;
  selectedView: 'building' | 'apartment' = 'building';
  // filters
  selectedType: 'building' | 'apartment' = 'building';
  selectedPeriod: 'month' | 'year' = 'month';

  constructor() {
    this.iconService.addIcon(...[DownloadOutline]);

    effect(() => {
      this.updateThemeColor();
      this.isDarkTheme(this.themeService.isDarkMode());
    });
  }

  ngOnInit() {
    this.initializeChart();
    this.loadChartData();
  }
  ngOnChanges(changes: SimpleChanges) {
    if (changes['isVisible'] && !changes['isVisible'].firstChange && this.isVisible) {
      this.loadChartData();

      setTimeout(() => {
        window.dispatchEvent(new Event('resize'));
      }, 150);
    }
  }

  //FROM BACKEND
  loadChartData() {
    this.loading = true;
    this.loadError = false;
    this.userDashboardService.getChartData(this.selectedView, this.selectedPeriod).subscribe({
      next: (data) => {
        this.loading = false;
        this.hasData = !!data?.values?.length;
        this.chartOptions = {
          ...this.chartOptions,
          series: [
            {
              name: this.selectedView === 'building' ? this.uiLocale.text('Building') : this.uiLocale.text('Apartment'),
              data: data?.values ?? []
            }
          ],
          xaxis: {
            ...this.chartOptions.xaxis,
            categories: (data?.labels ?? []).map((l: string) => (this.selectedPeriod === 'month' ? this.formatMonthLabel(l) : l))
          }
        };
        setTimeout(() => {
          window.dispatchEvent(new Event('resize'));
        }, 150);
      },
      error: () => {
        this.loading = false;
        this.loadError = true;
        this.hasData = false;
      }
    });
  }

  // === INITIAL CHART STRUCTURE ===
  initializeChart() {
    this.chartOptions = {
      chart: {
        height: 355,
        type: 'area',
        toolbar: { show: false },
        background: 'transparent'
      },

      fill: {
        type: 'gradient',
        gradient: {
          shadeIntensity: 1,
          opacityFrom: 0.5,
          opacityTo: 0
        }
      },

      tooltip: {
        theme: 'light',
        y: {
          formatter: (val: number) => {
            return val.toLocaleString(this.uiLocale.locale, {
              style: 'currency',
              currency: 'EUR',
              maximumFractionDigits: 2
            });
          }
        }
      },

      dataLabels: {
        enabled: false
      },

      colors: ['#1677ff', '#0050b3'],

      series: [
        {
          name: '',
          data: []
        }
      ],

      stroke: {
        curve: 'straight',
        width: 2
      },

      grid: {
        show: true,
        borderColor: '#f5f5f5',
        position: 'back'
      },

      xaxis: {
        categories: [],
        labels: {
          style: { colors: '#8C8C8C' }
        }
      },

      yaxis: {
        labels: {
          style: { colors: '#8C8C8C' },
          formatter: (val: number) => {
            return val.toLocaleString(this.uiLocale.locale, {
              maximumFractionDigits: 2
            });
          }
        }
      }
    };
  }

  // === BUTTONS ===
  toggleActive(type: 'building' | 'apartment') {
    this.selectedView = type;
    this.selectedType = type;
    this.loadChartData(); // Φόρτωσε δεδομένα
  }

  onOptionSelected() {
    this.loadChartData();
  }

  // theme updates
  private isDarkTheme(isDark: boolean) {
    const tooltip = { ...this.chartOptions.tooltip };
    const grid = { ...this.chartOptions.grid };
    tooltip.theme = isDark ? 'dark' : 'light';
    grid.borderColor = isDark ? '#fafafa0d' : '#f5f5f5';

    this.chartOptions = { ...this.chartOptions, tooltip, grid };
    this.isDarkThemes = isDark;
  }

  private updateThemeColor() {
    this.chartOptions.colors = ['#1677ff', '#0050b3'];
  }

  private formatMonthLabel(iso: string) {
    const [y, m] = iso.split('-').map(Number);
    const names = [
      this.uiLocale.text('Jan'),
      this.uiLocale.text('Feb'),
      this.uiLocale.text('Mar'),
      this.uiLocale.text('Apr'),
      this.uiLocale.text('May'),
      this.uiLocale.text('Jun'),
      this.uiLocale.text('Jul'),
      this.uiLocale.text('Aug'),
      this.uiLocale.text('Sep'),
      this.uiLocale.text('Oct'),
      this.uiLocale.text('Nov'),
      this.uiLocale.text('Dec')
    ];
    return `${names[m - 1]} ${y}`;
  }
}
