import { UiLocaleService } from 'src/app/theme/shared/service/ui-locale.service';
// angular import
import { Component, inject } from '@angular/core';

// project import
import { SharedModule } from 'src/app/theme/shared/shared.module';

// icons
import { IconService } from '@ant-design/icons-angular';
import { CopyOutline, EditOutline, RightOutline } from '@ant-design/icons-angular/icons';

@Component({
  selector: 'app-membership-setting',
  imports: [SharedModule],
  templateUrl: './membership-setting.component.html',
  styleUrl: './membership-setting.component.scss'
})
export class MembershipSettingComponent {
  private readonly uiLocale = inject(UiLocaleService);

  private iconService = inject(IconService);

  // constructor
  constructor() {
    this.iconService.addIcon(...[CopyOutline, EditOutline, RightOutline]);
  }

  // public method
  memberPlan = [
    {
      title: this.uiLocale.text('Membership Plan'),
      value: 'Addicted $150',
      more: 'See more Plan'
    },
    {
      title: this.uiLocale.text('Manage'),
      value: 'Membership',
      more: 'Update, Cancel and more'
    },
    {
      title: this.uiLocale.text('Renewal Date'),
      value: '120 November, 2024',
      more: 'View payment method'
    }
  ];
}
