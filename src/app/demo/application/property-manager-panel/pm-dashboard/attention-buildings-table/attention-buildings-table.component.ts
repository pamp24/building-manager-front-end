import { TranslateModule } from '@ngx-translate/core';
import { UiLocaleService } from 'src/app/theme/shared/service/ui-locale.service';
import { inject, Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RouterModule } from '@angular/router';
import { AttentionBuilding } from 'src/app/theme/shared/models/pmDashboardDTO';

@Component({
  selector: 'app-attention-buildings-table',
  standalone: true,
  imports: [TranslateModule, CommonModule, RouterModule],
  templateUrl: './attention-buildings-table.component.html',
  styleUrl: './attention-buildings-table.component.scss'
})
export class AttentionBuildingsTableComponent {
  private readonly uiLocale = inject(UiLocaleService);

  @Input() attentionBuildings: AttentionBuilding[] = [];

  getSeverityBadgeClass(severity: string): string {
    switch (severity?.toLowerCase()) {
      case 'danger':
      case 'high':
        return 'bg-light-danger text-danger';
      case 'warning':
      case 'medium':
        return 'bg-light-warning text-warning';
      case 'success':
      case 'low':
        return 'bg-light-success text-success';
      default:
        return 'bg-light-secondary text-secondary';
    }
  }

  getSeverityLabel(severity: string): string {
    switch (severity?.toLowerCase()) {
      case 'danger':
      case 'high':
        return this.uiLocale.text('High');
      case 'warning':
      case 'medium':
        return this.uiLocale.text('Moderate');
      case 'success':
      case 'low':
        return this.uiLocale.text('Low');
      default:
        return severity;
    }
  }
}
