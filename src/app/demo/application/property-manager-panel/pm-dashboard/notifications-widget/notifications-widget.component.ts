import { TranslateModule } from '@ngx-translate/core';
import { UiLocaleService } from 'src/app/theme/shared/service/ui-locale.service';
import { CommonModule } from '@angular/common';
import { Component, Input, inject } from '@angular/core';
import { IconService } from '@ant-design/icons-angular';
import { BellOutline, RightOutline } from '@ant-design/icons-angular/icons';
import { RouterModule } from '@angular/router';
import { DashboardNotification } from 'src/app/theme/shared/models/pmDashboardDTO';

@Component({
  selector: 'app-notifications-widget',
  standalone: true,
  imports: [TranslateModule, CommonModule, RouterModule],
  templateUrl: './notifications-widget.component.html',
  styleUrl: './notifications-widget.component.scss'
})
export class NotificationsWidgetComponent {
  private readonly uiLocale = inject(UiLocaleService);

  private iconService = inject(IconService);

  @Input() notifications: DashboardNotification[] = [];

  constructor() {
    this.iconService.addIcon(...[BellOutline, RightOutline]);
  }

  get unreadCount(): number {
    return this.notifications.filter((item) => !item.read).length;
  }

  formatDate(date: string): string {
    if (!date) {
      return '-';
    }

    return new Intl.DateTimeFormat(this.uiLocale.locale, {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(new Date(date));
  }
}
