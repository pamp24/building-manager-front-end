import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AttentionBuilding } from 'src/app/theme/shared/models/pmDashboardDTO';

@Component({
  selector: 'app-attention-buildings-table',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './attention-buildings-table.component.html',
  styleUrl: './attention-buildings-table.component.scss'
})
export class AttentionBuildingsTableComponent {
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
        return 'Υψηλή';
      case 'warning':
      case 'medium':
        return 'Μέτρια';
      case 'success':
      case 'low':
        return 'Χαμηλή';
      default:
        return severity;
    }
  }
}