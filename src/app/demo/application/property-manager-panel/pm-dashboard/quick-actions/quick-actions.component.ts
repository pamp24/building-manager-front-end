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
  imports: [CommonModule, SharedModule, RouterModule, RouterModule],
  templateUrl: './quick-actions.component.html',
  styleUrl: './quick-actions.component.scss'
})
export class QuickActionsComponent {
  private iconService = inject(IconService);

  constructor() {
    this.iconService.addIcon(...[ApartmentOutline, FileAddOutline, TeamOutline, HomeOutline]);
  }

  actions: QuickActionItem[] = [
    {
      title: 'Νέα Πολυκατοικία',
      subtitle: 'Καταχώριση νέου κτιρίου',
      icon: 'apartment',
      route: '/pm/add',
      buttonClass: 'action-primary'
    },
    {
      title: 'Έκδοση Κοινοχρήστων',
      subtitle: 'Δημιουργία νέου παραστατικού',
      icon: 'file-add',
      route: '/statement/create',
      buttonClass: 'action-success'
    },
    {
      title: 'Αποστολή Πρόσκλησης',
      subtitle: 'Προσθήκη νέου μέλους',
      icon: 'team',
      route: '/pm/buildings',
      buttonClass: 'action-warning'
    },
    {
      title: 'Προβολή Πολυκατοικιών',
      subtitle: 'Διαχείριση χαρτοφυλακίου',
      icon: 'home',
      route: '/pm/buildings',
      buttonClass: 'action-info'
    }
  ];
}
