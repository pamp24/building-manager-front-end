// angular import
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

// project import
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { MonthlyBarChartComponent } from 'src/app/theme/shared/apexchart/monthly-bar-chart/monthly-bar-chart.component';
import { IncomeOverviewChartComponent } from 'src/app/theme/shared/apexchart/income-overview-chart/income-overview-chart.component';
import { SalesReportChartComponent } from 'src/app/theme/shared/apexchart/sales-report-chart/sales-report-chart.component';
import { AcquisitionChartComponent } from 'src/app/theme/shared/apexchart/acquisition-chart/acquisition-chart.component';
import { BuildingTotalCardComponent } from '../../../theme/shared/apexchart/building-total-card/building-total-card.component';
import { BuildingChartComponent } from '../../../theme/shared/apexchart/building-chart/building-chart.component';
import { ApartmentPendingCardComponent } from '../../../theme/shared/apexchart/apartment-pending-card/apartment-pending-card.component';
import { LastStatementCardComponent } from '../../../theme/shared/apexchart/last-statement-card/last-statement-card.component';
import { PollsTableComponent } from '../../../theme/shared/apexchart/polls-table/polls-table.component';
import { BuildingPendingCardComponent } from '../../../theme/shared/apexchart/building-pedning-card/building-pedning-card.component';

@Component({
  selector: 'app-widget-chart',
  imports: [
    CommonModule,
    SharedModule,
    MonthlyBarChartComponent,
    IncomeOverviewChartComponent,
    PollsTableComponent,
    LastStatementCardComponent,
    BuildingTotalCardComponent,
    ApartmentPendingCardComponent,
    BuildingPendingCardComponent,
    SalesReportChartComponent,
    BuildingChartComponent,
    AcquisitionChartComponent
  ],
  templateUrl: './widget-chart.component.html',
  styleUrls: ['./widget-chart.component.scss']
})
export class WidgetChartComponent {
  // private props
  channels = [
    {
      title: 'Top Channels',
      icon: 'ti ti-device-analytics',
      background: 'text-secondary bg-light-secondary',
      time: 'Today, 2:00 AM',
      amount: '+ $1,430',
      percentage: '35%'
    },
    {
      title: 'Top Pages',
      icon: 'ti ti-file-text',
      background: 'text-primary bg-light-primary',
      time: 'Today, 6:00 AM',
      amount: '- $1430',
      percentage: '35%'
    }
  ];
}
