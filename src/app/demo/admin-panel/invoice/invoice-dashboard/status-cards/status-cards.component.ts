import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { ManagerDashboardDTO } from 'src/app/theme/shared/models/managerDashboardDTO';

@Component({
  selector: 'app-status-cards',
  standalone: true,
  imports: [CommonModule, SharedModule],
  templateUrl: './status-cards.component.html',
  styleUrls: ['./status-cards.component.scss']
})
export class StatusCardsComponent implements OnChanges {
  @Input() dashboardData?: ManagerDashboardDTO;
  @Output() tabSelected = new EventEmitter<number>();

  // Υπολογιζόμενα πεδία
  totalCount = 0;
  paidCount = 0;
  pendingCount = 0;
  expiredCount = 0;
  closedCount = 0;
  draftCount = 0;
  totalAll = 0;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['dashboardData'] && this.dashboardData) {
      this.calculateCounts();
    }
  }

  private calculateCounts(): void {
    const data = this.dashboardData;
    if (!data) return;

    if (data.monthlyStats && data.monthlyStats.length > 0) {
      const totalIssued = data.monthlyStats.reduce((sum, m) => sum + (m.issued || 0), 0);
      const totalPaid = data.monthlyStats.reduce((sum, m) => sum + (m.paid || 0), 0);
      const totalExpired = data.monthlyStats.reduce((sum, m) => sum + (m.expired || 0), 0);

      this.totalCount = totalIssued;
      this.paidCount = totalPaid;
      this.expiredCount = totalExpired;
      this.pendingCount = Math.max(totalIssued - (totalPaid + totalExpired), 0);
    } else {
      this.totalCount = data.totalIssued || 0;
      this.paidCount = data.totalPaid || 0;
      this.expiredCount = data.totalExpired || 0;
      this.pendingCount = Math.max(this.totalCount - (this.paidCount + this.expiredCount), 0);
    }

    this.closedCount = data.totalCancelled || 0;
    this.draftCount = data.totalDraft || 0;

    this.totalAll =
    this.paidCount +
    this.pendingCount +
    this.expiredCount +
    this.closedCount +
    this.draftCount;
  }

  selectTab(tabId: number): void {
    this.tabSelected.emit(tabId);
  }
}
