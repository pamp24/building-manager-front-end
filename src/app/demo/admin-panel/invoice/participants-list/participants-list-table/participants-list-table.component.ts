// angular import
import { Component, inject } from '@angular/core';
import { DecimalPipe } from '@angular/common';

// rxjs import
import { Observable } from 'rxjs';

// project import
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { InvoiceList } from './participants-list-type';
import { InvoiceListService } from './participants-list.service';

// icon service
import { DeleteOutline, EditOutline, EyeOutline, PlusOutline } from '@ant-design/icons-angular/icons';
import { IconService } from '@ant-design/icons-angular';

@Component({
  selector: 'app-participants-list-table',
  imports: [SharedModule],
  templateUrl: './participants-list-table.component.html',
  styleUrl: './participants-list-table.component.scss',
  providers: [InvoiceListService, DecimalPipe]
})
export class ParticipantsListTableComponent {
  service = inject(InvoiceListService);
  private iconService = inject(IconService);

  // public props
  invoices$: Observable<InvoiceList[]>;
  total$: Observable<number>;

  // constructor
  constructor() {
    const service = this.service;

    this.invoices$ = service.invoices$;
    this.total$ = service.total$;
    this.iconService.addIcon(...[PlusOutline, EyeOutline, DeleteOutline, EditOutline]);
  }
}
