import { TranslateModule } from '@ngx-translate/core';
import { UiLocaleService } from 'src/app/theme/shared/service/ui-locale.service';
import { inject, Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RouterModule } from '@angular/router';
import { PmBuildingManagerRowDTO } from 'src/app/theme/shared/models/pmDashboardDTO';

@Component({
  selector: 'app-pm-building-managers-table',
  standalone: true,
  imports: [TranslateModule, CommonModule, RouterModule],
  templateUrl: './pm-building-managers-table.component.html',
  styleUrl: './pm-building-managers-table.component.scss'
})
export class PmBuildingManagersTableComponent {
  private readonly uiLocale = inject(UiLocaleService);

  @Input() managers: PmBuildingManagerRowDTO[] = [];

  getStatusBadgeClass(assigned: boolean): string {
    return assigned ? 'bg-light-success text-success' : 'bg-light-warning text-warning';
  }

  getStatusLabel(assigned: boolean): string {
    return assigned ? this.uiLocale.text('Certain') : this.uiLocale.text('No Admin');
  }
}
