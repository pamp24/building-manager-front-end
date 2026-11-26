import { UiLocaleService } from 'src/app/theme/shared/service/ui-locale.service';
import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ApartmentOutline, FileAddOutline, TeamOutline, HomeOutline } from '@ant-design/icons-angular/icons';
import { IconService } from '@ant-design/icons-angular';
import { SharedModule } from '../../../../../theme/shared/shared.module';

interface QuickActionItem {
  title: string;
  subtitle: string;
  icon: string;
  route: string;
  buttonClass: string;
}

@Component({
  selector: 'app-quick-actions',
  standalone: true,
  imports: [CommonModule, SharedModule, RouterModule],
  templateUrl: './quick-actions.component.html',
  styleUrl: './quick-actions.component.scss'
})
export class QuickActionsComponent {
  private readonly uiLocale = inject(UiLocaleService);

  private iconService = inject(IconService);

  constructor() {
    this.iconService.addIcon(...[ApartmentOutline, FileAddOutline, TeamOutline, HomeOutline]);
  }

  actions: QuickActionItem[] = [
    {
      title: this.uiLocale.text('New apartment building'),
      subtitle: this.uiLocale.text('Listing of a new building'),
      icon: 'apartment',
      route: '/pm/add',
      buttonClass: 'action-primary'
    },
    {
      title: this.uiLocale.text('Public Edition'),
      subtitle: this.uiLocale.text('Creating a new document'),
      icon: 'file-add',
      route: '/statement/create',
      buttonClass: 'action-success'
    },
    {
      title: this.uiLocale.text('Send Invitation'),
      subtitle: this.uiLocale.text('Add new member'),
      icon: 'team',
      route: '/pm/buildings',
      buttonClass: 'action-warning'
    },
    {
      title: this.uiLocale.text('View of Apartment Buildings'),
      subtitle: this.uiLocale.text('Portfolio Management'),
      icon: 'home',
      route: '/pm/buildings',
      buttonClass: 'action-info'
    }
  ];
}
