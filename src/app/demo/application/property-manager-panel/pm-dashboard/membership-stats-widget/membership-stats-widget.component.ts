import { UiLocaleService } from 'src/app/theme/shared/service/ui-locale.service';
import { CommonModule } from '@angular/common';
import { Component, Input, inject } from '@angular/core';
import { IconService } from '@ant-design/icons-angular';
import { MailOutline, UserAddOutline, TeamOutline, HomeOutline } from '@ant-design/icons-angular/icons';
import { PmMembershipStatsDTO } from 'src/app/theme/shared/models/pmDashboardDTO';
import { SharedModule } from 'src/app/theme/shared/shared.module';

@Component({
  selector: 'app-membership-stats-widget',
  standalone: true,
  imports: [CommonModule, SharedModule],
  templateUrl: './membership-stats-widget.component..html',
  styleUrl: './membership-stats-widget.component.scss'
})
export class MembershipStatsWidgetComponent {
  private readonly uiLocale = inject(UiLocaleService);

  private iconService = inject(IconService);

  @Input() stats: PmMembershipStatsDTO | null = null;

  constructor() {
    this.iconService.addIcon(...[MailOutline, UserAddOutline, TeamOutline, HomeOutline]);
  }

  get statCards() {
    return [
      {
        title: this.uiLocale.text('Pending Invitations'),
        value: this.stats?.pendingInvites ?? 0,
        icon: 'mail',
        className: 'stat-primary'
      },
      {
        title: this.uiLocale.text('Connection Requests'),
        value: this.stats?.pendingJoinRequests ?? 0,
        icon: 'user-add',
        className: 'stat-warning'
      },
      {
        title: this.uiLocale.text('Registered Members'),
        value: this.stats?.joinedMembers ?? 0,
        icon: 'team',
        className: 'stat-success'
      },
      {
        title: this.uiLocale.text('Apartment Without Assignment'),
        value: this.stats?.unassignedApartments ?? 0,
        icon: 'home',
        className: 'stat-danger'
      }
    ];
  }
}
