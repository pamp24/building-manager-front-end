import { TranslateModule } from '@ngx-translate/core';
import { UiLocaleService } from 'src/app/theme/shared/service/ui-locale.service';
import { inject, Component, Input } from '@angular/core';

import { CommonModule } from '@angular/common';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-confirm-delete-modal',
  standalone: true,
  imports: [TranslateModule, CommonModule],
  templateUrl: './confirm-delete-modal.component.html',
  styleUrls: ['./confirm-delete-modal.component.scss']
})
export class ConfirmDeleteModalComponent {
  private readonly uiLocale = inject(UiLocaleService);

  @Input() title = this.uiLocale.text('Confirm');
  @Input() message = this.uiLocale.text('Are you sure?');

  constructor(public activeModal: NgbActiveModal) {}
}
