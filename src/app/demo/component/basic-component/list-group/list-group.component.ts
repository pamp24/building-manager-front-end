import { UiLocaleService } from 'src/app/theme/shared/service/ui-locale.service';
import { inject, Component } from '@angular/core';
// angular import

import { CommonModule } from '@angular/common';

// project import
import { SharedModule } from 'src/app/theme/shared/shared.module';

@Component({
  selector: 'app-list-group',
  imports: [CommonModule, SharedModule],
  templateUrl: './list-group.component.html',
  styleUrls: ['./list-group.component.scss']
})
export class ListGroupComponent {
  private readonly uiLocale = inject(UiLocaleService);

  // public method
  item = [
    {
      text: this.uiLocale.text('Cras justo odio')
    },
    {
      text: this.uiLocale.text('Dapibus ac facilisis in')
    },
    {
      text: this.uiLocale.text('Morbi leo risus')
    },
    {
      text: this.uiLocale.text('Porta ac consectetur ac')
    },
    {
      text: this.uiLocale.text('Vestibulum at eros')
    }
  ];
}
