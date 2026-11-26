import { UiLocaleService } from 'src/app/theme/shared/service/ui-locale.service';
// angular import
import { Component, inject } from '@angular/core';

// icons
import { IconService } from '@ant-design/icons-angular';
import { CaretDownOutline, CaretUpOutline, FileDoneOutline, InfoCircleOutline } from '@ant-design/icons-angular/icons';

// project import
import { SharedModule } from 'src/app/theme/shared/shared.module';

@Component({
  selector: 'app-participants-list',
  imports: [SharedModule],
  templateUrl: './participants-list.component.html',
  styleUrl: './participants-list.component.scss'
})
export class ParticipantsListComponent {
  private readonly uiLocale = inject(UiLocaleService);

  private iconService = inject(IconService);

  // constructor
  constructor() {
    this.iconService.addIcon(...[CaretUpOutline, CaretDownOutline, FileDoneOutline, InfoCircleOutline]);
  }

  // public method
  widgetCards = [
    {
      title: this.uiLocale.text('They were paid'),
      isLoss: false,
      value: '$7,825',
      percentage: 70.5,
      color: 'text-success',
      invoice: '9',
      data: [0, 20, 10, 45, 30, 55, 20, 30],
      colors: ['#52c41a']
    },
    {
      title: this.uiLocale.text('It is pending'),
      isLoss: true,
      value: '$1,880',
      percentage: 27.4,
      color: 'text-warning',
      invoice: '6',
      data: [30, 20, 55, 30, 45, 10, 20, 0],
      colors: ['#faad14']
    },
    {
      title: this.uiLocale.text('They are over'),
      isLoss: true,
      value: '$3,507',
      percentage: 27.4,
      color: 'text-danger',
      invoice: '4',
      data: [0, 20, 10, 45, 30, 55, 20, 30],
      colors: ['#ff4d4f']
    }
  ];
}
