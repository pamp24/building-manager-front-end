import { UiLocaleService } from 'src/app/theme/shared/service/ui-locale.service';
import { inject, Component } from '@angular/core';
// angular import

import { CommonModule } from '@angular/common';

// project import
import { SharedModule } from 'src/app/theme/shared/shared.module';

@Component({
  selector: 'app-frm-radio',
  imports: [CommonModule, SharedModule],
  templateUrl: './frm-radio.component.html',
  styleUrls: ['./frm-radio.component.scss']
})
export class FrmRadioComponent {
  private readonly uiLocale = inject(UiLocaleService);

  // public method
  colorTypes = [
    {
      colors: [
        { id: 'customCheck1', checked: true, label: 'primary', type: 'input-primary' },
        { id: 'customCheck2', checked: true, label: 'secondary', type: 'input-secondary' },
        { id: 'customCheck3', checked: true, label: 'success', type: 'input-success' },
        { id: 'customCheck4', checked: true, label: 'danger', type: 'input-danger' },
        { id: 'customCheck5', checked: true, label: 'warning', type: 'input-warning' },
        { id: 'customCheck6', checked: true, label: 'info', type: 'input-info' },
        { id: 'customCheck7', checked: true, label: 'dark', type: 'input-dark' }
      ]
    },
    {
      colors: [
        { id: 'customCheckLight1', checked: true, label: this.uiLocale.text('primary light'), type: 'input-light-primary' },
        { id: 'customCheckLight2', checked: true, label: this.uiLocale.text('secondary light'), type: 'input-light-secondary' },
        { id: 'customCheckLight3', checked: true, label: this.uiLocale.text('success light'), type: 'input-light-success' },
        { id: 'customCheckLight4', checked: true, label: this.uiLocale.text('danger light'), type: 'input-light-danger' },
        { id: 'customCheckLight5', checked: true, label: this.uiLocale.text('warning light'), type: 'input-light-warning' },
        { id: 'customCheckLight6', checked: true, label: this.uiLocale.text('info light'), type: 'input-light-info' },
        { id: 'customCheckLight7', checked: true, label: this.uiLocale.text('dark light'), type: 'input-light-dark' }
      ]
    }
  ];
}
