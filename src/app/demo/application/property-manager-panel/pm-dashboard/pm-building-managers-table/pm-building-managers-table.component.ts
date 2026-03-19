import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { RouterModule } from '@angular/router';
import { PmBuildingManagerRowDTO } from 'src/app/theme/shared/models/pmDashboardDTO';

@Component({
  selector: 'app-pm-building-managers-table',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './pm-building-managers-table.component.html',
  styleUrl: './pm-building-managers-table.component.scss'
})
export class PmBuildingManagersTableComponent {
  @Input() managers: PmBuildingManagerRowDTO[] = [];

  getStatusBadgeClass(assigned: boolean): string {
    return assigned
      ? 'bg-light-success text-success'
      : 'bg-light-warning text-warning';
  }

  getStatusLabel(assigned: boolean): string {
    return assigned ? 'Ορισμένος' : 'Χωρίς Διαχειριστή';
  }
}