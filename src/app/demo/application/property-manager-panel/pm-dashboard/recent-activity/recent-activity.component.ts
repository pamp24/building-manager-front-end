import { CommonModule } from '@angular/common';
import { Component, Input, inject } from '@angular/core';
import { IconService } from '@ant-design/icons-angular';
import { NotificationOutline, RightOutline } from '@ant-design/icons-angular/icons';
import { RouterModule } from '@angular/router';
import { ActivityItem } from 'src/app/theme/shared/models/pmDashboardDTO';

@Component({
  selector: 'app-recent-activity',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './recent-activity.component..html',
  styleUrl: './recent-activity.component.scss'
})
export class RecentActivityComponent {
  private iconService = inject(IconService);

  @Input() recentActivity: ActivityItem[] = [];

  constructor() {
    this.iconService.addIcon(...[NotificationOutline, RightOutline]);
  }

  formatDate(date: string): string {
    if (!date) {
      return '-';
    }

    return new Intl.DateTimeFormat('el-GR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(new Date(date));
  }
}