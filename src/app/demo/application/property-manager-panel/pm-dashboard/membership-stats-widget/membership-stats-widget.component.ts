import { CommonModule } from '@angular/common';
import { Component, Input, inject } from '@angular/core';
import { IconService } from '@ant-design/icons-angular';
import {
  MailOutline,
  UserAddOutline,
  TeamOutline,
  HomeOutline
} from '@ant-design/icons-angular/icons';
import { PmMembershipStatsDTO } from 'src/app/theme/shared/models/pmDashboardDTO';

@Component({
  selector: 'app-membership-stats-widget',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './membership-stats-widget.component..html',
  styleUrl: './membership-stats-widget.component.scss'
})
export class MembershipStatsWidgetComponent {
  private iconService = inject(IconService);

  @Input() stats: PmMembershipStatsDTO | null = null;

  constructor() {
    this.iconService.addIcon(...[
      MailOutline,
      UserAddOutline,
      TeamOutline,
      HomeOutline
    ]);
  }

  get statCards() {
    return [
      {
        title: 'Εκκρεμείς Προσκλήσεις',
        value: this.stats?.pendingInvites ?? 0,
        icon: 'mail',
        className: 'stat-primary'
      },
      {
        title: 'Αιτήματα Σύνδεσης',
        value: this.stats?.pendingJoinRequests ?? 0,
        icon: 'user-add',
        className: 'stat-warning'
      },
      {
        title: 'Εγγεγραμμένα Μέλη',
        value: this.stats?.joinedMembers ?? 0,
        icon: 'team',
        className: 'stat-success'
      },
      {
        title: 'Χωρίς Ανάθεση',
        value: this.stats?.unassignedApartments ?? 0,
        icon: 'home',
        className: 'stat-danger'
      }
    ];
  }
}